apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
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
                  name: db-secret
                  key: host
            - name: TYPEORM_USERNAME
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: username
            - name: TYPEORM_DATABASE
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
            - name: TYPEORM_PORT
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: port
            - name: AUTH0_DOMAIN
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: auth0-domain
            - name: AUTH0_AUDIENCE
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: auth0-audience
            - name: FACEBOOK_APP_ID
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: facebook-app-id
            - name: FACEBOOK_APP_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: facebook-app-secret
        - name: client
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-client:COMMIT_SHA
          ports:
            - containerPort: 80
---
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
spec:
  activeDeadlineSeconds: 60
  template:
    containers:
      - name: db-migrate
        image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-db-migration:COMMIT_SHA
        env:
          - name: TYPEORM_HOST
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: host
          - name: TYPEORM_USERNAME
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: username
          - name: TYPEORM_DATABASE
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: password
          - name: TYPEORM_PORT
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: port
    restartPolicy: Never
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: basic-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: basic-ingress-ip
spec:
  rules:
    - http:
        paths:
          - path: /*
            backend:
              serviceName: backend-nodeport-service
              servicePort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nodeport-service
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 7000
      protocol: TCP
