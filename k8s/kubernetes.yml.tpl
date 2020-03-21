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
      containers:
        - name: api
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-api:COMMIT_SHA
          ports:
            - containerPort: 7000
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
                secretKeyRef:
                  name: app
                  key: auth0-domain
            - name: AUTH0_AUDIENCE
              valueFrom:
                secretKeyRef:
                  name: app
                  key: auth0-audience
            - name: FACEBOOK_APP_ID
              valueFrom:
                secretKeyRef:
                  name: app
                  key: facebook-app-id
            - name: FACEBOOK_APP_SECRET
              valueFrom:
                secretKeyRef:
                  name: app
                  key: facebook-app-secret
        - name: client
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-client:COMMIT_SHA
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
    - port: 80
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
---
apiVersion: v1
kind: Service
metadata:
  name: client-nodeport-service
spec:
  type: NodePort
  selector:
    app: api
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
  ttlSecondsAfterFinished: 100
  activeDeadlineSeconds: 60
  template:
    spec:
      containers:
        - name: db-migrate
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-db-migration:COMMIT_SHA
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
    server: https://acme-staging-v02.api.letsencrypt.org/directory
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
              servicePort: 80
  tls:
    - hosts:
        - habite.site
        - api.habite.site
      secretName: habite-site
