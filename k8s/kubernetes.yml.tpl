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
      serviceAccountName: berglas-k8s@GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com
      automountServiceAccountToken: false
      containers:
        - name: api
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-api:COMMIT_SHA
          ports:
            - containerPort: 7000
          command: ["/bin/envserver"]
          env:
            - name: TYPEORM_HOST
              value: berglas://smarketing-secrets/db/host
            - name: TYPEORM_USERNAME
              value: berglas://smarketing-secrets/db/username
            - name: TYPEORM_PASSWORD
              value: berglas://smarketing-secrets/db/password
            - name: TYPEORM_DATABASE
              value: berglas://smarketing-secrets/db/database
            - name: TYPEORM_PORT
              value: berglas://smarketing-secrets/db/port
            - name: AUTH0_DOMAIN
              value: berglas://smarketing-secrets/app/auth0-domain
            - name: AUTH0_AUDIENCE
              value: berglas://smarketing-secrets/app/auth0-audience
            - name: FACEBOOK_APP_ID
              value: berglas://smarketing-secrets/app/facebook-app-id
            - name: FACEBOOK_APP_SECRET
              value: berglas://smarketing-secrets/app/facebook-app-secret
        - name: client
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-client:COMMIT_SHA
          ports:
            - containerPort: 80
---
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate-COMMIT_SHA
spec:
  activeDeadlineSeconds: 60
  template:
    spec:
      serviceAccountName: berglas-k8s@GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com
      containers:
        - name: db-migrate
          image: gcr.io/GOOGLE_CLOUD_PROJECT/smarketing-db-migration:COMMIT_SHA
          command: ["/bin/envserver"]
          env:
            - name: TYPEORM_HOST
              value: berglas://smarketing-secrets/db/host
            - name: TYPEORM_USERNAME
              value: berglas://smarketing-secrets/db/username
            - name: TYPEORM_PASSWORD
              value: berglas://smarketing-secrets/db/password
            - name: TYPEORM_DATABASE
              value: berglas://smarketing-secrets/db/database
            - name: TYPEORM_PORT
              value: berglas://smarketing-secrets/db/port
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
---
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
metadata:
  name: berglas-webhook
  labels:
    app: berglas-webhook
    kind: mutator
webhooks:
  - name: berglas-webhook.cloud.google.com
    clientConfig:
      url: https://us-central1-GOOGLE_CLOUD_PROJECT.cloudfunctions.net/berglas-secrets-webhook
      caBundle: ""
    rules:
      - operations: ["CREATE"]
        apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["pods"]
