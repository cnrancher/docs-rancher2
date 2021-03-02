---
title: 自签名证书和7层负载均衡的cluster.yml 文件模板
description: RKE 使用 cluster.yml 文件安装和配置您的 Kubernetes 集群。如果您使用配置是自签名证书和7层负载均衡，您可以使用这个 cluster.yml 模板安装和配置集群。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 资料、参考和高级选项
  - cluster.yml 文件模板
  - 自签名证书和7层负载均衡的cluster.yml 文件模板
---

RKE 使用 cluster.yml 文件安装和配置您的 Kubernetes 集群。

本模板旨在用于 RKE 插件安装，只支持到 Rancher v2.0.8。如果您要安装更新的 Rancher 版本，请使用 Rancher Helm chart。有关详细信息，请参阅[Kubernetes 安装-安装大纲](/docs/rancher2/installation/k8s-install/_index)。

如果您使用配置如下所示，您可以使用这个 cluster.yml 模板安装和配置集群。

- 自签名证书（HTTPS）
- 7 层负载均衡
- [NGINX Ingress controller](https://kubernetes.github.io/ingress-nginx/)

详情请参考[RKE 文档](/docs/rke/config-options/_index)

```yaml
nodes:
  - address: <IP> # hostname or IP to access nodes
    user: <USER> # root user (usually 'root')
    role: [controlplane, etcd, worker] # K8s roles for node
    ssh_key_path: <PEM_FILE> # path to PEM file
  - address: <IP>
    user: <USER>
    role: [controlplane, etcd, worker]
    ssh_key_path: <PEM_FILE>
  - address: <IP>
    user: <USER>
    role: [controlplane, etcd, worker]
    ssh_key_path: <PEM_FILE>
services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24h
addons: |-
  ---
  kind: Namespace
  apiVersion: v1
  metadata:
    name: cattle-system
  ---
  kind: ServiceAccount
  apiVersion: v1
  metadata:
    name: cattle-admin
    namespace: cattle-system
  ---
  kind: ClusterRoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: cattle-crb
    namespace: cattle-system
  subjects:
  - kind: ServiceAccount
    name: cattle-admin
    namespace: cattle-system
  roleRef:
    kind: ClusterRole
    name: cluster-admin
    apiGroup: rbac.authorization.k8s.io
  ---
  apiVersion: v1
  kind: Secret
  metadata:
    name: cattle-keys-server
    namespace: cattle-system
  type: Opaque
  data:
    cacerts.pem: <BASE64_CA>  # CA cert used to sign cattle server cert and key
  ---
  apiVersion: v1
  kind: Service
  metadata:
    namespace: cattle-system
    name: cattle-service
    labels:
      app: cattle
  spec:
    ports:
    - port: 80
      targetPort: 80
      protocol: TCP
      name: http
    selector:
      app: cattle
  ---
  apiVersion: extensions/v1beta1
  kind: Ingress
  metadata:
    namespace: cattle-system
    name: cattle-ingress-http
    annotations:
      nginx.ingress.kubernetes.io/proxy-connect-timeout: "30"
      nginx.ingress.kubernetes.io/proxy-read-timeout: "1800"   # Max time in seconds for ws to remain shell window open
      nginx.ingress.kubernetes.io/proxy-send-timeout: "1800"   # Max time in seconds for ws to remain shell window open
      nginx.ingress.kubernetes.io/ssl-redirect: "false"        # Disable redirect to ssl
  spec:
    rules:
    - host: <FQDN>
      http:
        paths:
        - backend:
            serviceName: cattle-service
            servicePort: 80
  ---
  kind: Deployment
  apiVersion: extensions/v1beta1
  metadata:
    namespace: cattle-system
    name: cattle
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: cattle
      spec:
        serviceAccountName: cattle-admin
        containers:
        # Rancher install via RKE addons is only supported up to v2.0.8
        - image: rancher/rancher:v2.0.8
          imagePullPolicy: Always
          name: cattle-server
  #       env:
  #       - name: HTTP_PROXY
  #         value: "http://your_proxy_address:port"
  #       - name: HTTPS_PROXY
  #         value: "http://your_proxy_address:port"
  #       - name: NO_PROXY
  #         value: "localhost,127.0.0.1,0.0.0.0,10.43.0.0/16,your_network_ranges_that_dont_need_proxy_to_access"
          livenessProbe:
            httpGet:
              path: /ping
              port: 80
            initialDelaySeconds: 60
            periodSeconds: 60
          readinessProbe:
            httpGet:
              path: /ping
              port: 80
            initialDelaySeconds: 20
            periodSeconds: 10
          ports:
          - containerPort: 80
            protocol: TCP
          volumeMounts:
          - mountPath: /etc/rancher/ssl
            name: cattle-keys-volume
            readOnly: true
        volumes:
        - name: cattle-keys-volume
          secret:
            defaultMode: 420
            secretName: cattle-keys-server
```
