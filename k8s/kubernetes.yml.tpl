apiVersion: v1
data:
  config.js: |
    window.env = {}
    window.env.AUTH0_DOMAIN="smarketing.eu.auth0.com"
    window.env.AUTH0_CLIENT_ID="4IWpAYFnCEjhtVbxdaXaP0nzVltpmk7A"
    window.env.CLIENT_ADDRESS="habite.site"
    window.env.GRAPHQL_HOST="https://api.habite.site/graphql"
    window.env.FILES_ENDPOINT="https://api.habite.site/files"
    window.env.FACEBOOK_APP_ID="2002136040088512"
    window.env.GA_TRACKING_ID="UA-162565362-1"
kind: ConfigMap
metadata:
  name: react-app-config
---
apiVersion: v1
data:
  AUTH0_DOMAIN: "https://smarketing.eu.auth0.com/"
  FACEBOOK_APP_ID: "2002136040088512"
  TWITTER_CONSUMER_KEY: "0FUfd55TBCepUErv001kUHA89"
  REDIS_HOST: localhost
  REDIS_PORT: "6379"
kind: ConfigMap
metadata:
  name: api-config
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: api-files-storage-claim
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      volumes:
        - name: api-files-storage
          persistentVolumeClaim:
            claimName: api-files-storage-claim
      containers:
        - name: api
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-api:COMMIT_SHA
          ports:
            - containerPort: 7000
          volumeMounts:
            - mountPath: "/data/files"
              name: api-files-storage
          env:
            - name: TYPEORM_HOST
              valueFrom:
                secretKeyRef:
                  name: db
                  key: host
            - name: TYPEORM_DATABASE
              valueFrom:
                secretKeyRef:
                  name: db
                  key: database
            - name: TYPEORM_USERNAME
              valueFrom:
                secretKeyRef:
                  name: db
                  key: username
            - name: TYPEORM_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db
                  key: password
            - name: TYPEORM_PORT
              valueFrom:
                secretKeyRef:
                  name: db
                  key: port
            - name: AUTH0_DOMAIN
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: AUTH0_DOMAIN
            - name: AUTH0_AUDIENCE
              valueFrom:
                secretKeyRef:
                  name: app
                  key: auth0-audience
            - name: FACEBOOK_APP_ID
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: FACEBOOK_APP_ID
            - name: FACEBOOK_APP_SECRET
              valueFrom:
                secretKeyRef:
                  name: app
                  key: facebook-app-secret
            - name: TWITTER_CONSUMER_KEY
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: TWITTER_CONSUMER_KEY
            - name: TWITTER_CONSUMER_SECRET
              valueFrom:
                secretKeyRef:
                  name: app
                  key: twitter-consumer-secret
            - name: FILE_DIR
              value: "/data/files"
            - name: REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: REDIS_HOST
            - name: REDIS_PORT
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: REDIS_PORT
        - name: redis
          image: docker.io/redis:alpine
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
          ports:
            - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: api-nodeport-service
spec:
  type: NodePort
  selector:
    app: api
  ports:
    - port: 81
      targetPort: 7000
      protocol: TCP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
        - name: client
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-client:COMMIT_SHA
          ports:
            - containerPort: 80
          volumeMounts:
            - name: react-app-config-volume
              mountPath: /usr/share/nginx/html/config.js
              subPath: config.js
              readOnly: true
      volumes:
        - name: react-app-config-volume
          configMap:
            name: react-app-config
---
apiVersion: v1
kind: Service
metadata:
  name: client-nodeport-service
spec:
  type: NodePort
  selector:
    app: client
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
---
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate-COMMIT_SHA
spec:
  ttlSecondsAfterFinished: 0
  backoffLimit: 1
  template:
    spec:
      containers:
        - name: db-migrate
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-db-migration:COMMIT_SHA
          env:
            - name: DB_HOST
              valueFrom:
                secretKeyRef:
                  name: db
                  key: host
            - name: DB_NAME
              valueFrom:
                secretKeyRef:
                  name: db
                  key: database
            - name: DB_PORT
              valueFrom:
                secretKeyRef:
                  name: db
                  key: port
            - name: FLYWAY_URL
              value: jdbc:postgresql://$(DB_HOST):$(DB_PORT)/$(DB_NAME)
            - name: FLYWAY_USER
              valueFrom:
                secretKeyRef:
                  name: db
                  key: username
            - name: FLYWAY_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db
                  key: password
      restartPolicy: Never
---
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: dannyheard7@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource used to store the account's private key.
      name: letsencrypt-production
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: habite.site
      http:
        paths:
          - backend:
              serviceName: client-nodeport-service
              servicePort: 80
    - host: api.habite.site
      http:
        paths:
          - backend:
              serviceName: api-nodeport-service
              servicePort: 81
  tls:
    - hosts:
        - habite.site
        - api.habite.site
      secretName: habite-site
