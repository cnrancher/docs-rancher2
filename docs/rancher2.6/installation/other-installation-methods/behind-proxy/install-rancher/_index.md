---
title: 3. 安装 Rancher
weight: 300
---

在前文的操作后，你已经有了一个运行的 RKE 集群，现在可以在其中安装 Rancher 了。出于安全考虑，所有到 Rancher 的流量都必须使用 TLS 加密。在本教程中，你将使用 [cert-manager](https://cert-manager.io/)自动颁发自签名证书。在实际使用情况下，你可使用 Let's Encrypt 或自己的证书。

> **注意**：本安装教程假设你使用 Helm 3。

### 安装 cert-manager

添加 cert-manager Helm 仓库：

```
helm repo add jetstack https://charts.jetstack.io
```

为 cert-manager 创建命名空间：

```
kubectl create namespace cert-manager
```

安装 cert-manager 的 CustomResourceDefinitions：

```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml
```

使用 Helm 安装 cert-manager。请注意，cert-manager 还需要你配置代理，以防它需要与 Let's Encrypt 或其他外部证书颁发商进行通信：

```
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --version v1.5.1 \
  --set http_proxy=http://${proxy_host} \
  --set https_proxy=http://${proxy_host} \
  --set no_proxy=127.0.0.0/8\\,10.0.0.0/8\\,cattle-system.svc\\,172.16.0.0/12\\,192.168.0.0/16\\,.svc\\,.cluster.local
```

等待 cert-manager 完成启动：

```
kubectl rollout status deployment -n cert-manager cert-manager
kubectl rollout status deployment -n cert-manager cert-manager-webhook
```

### 安装 Rancher

接下来，你可以安装 Rancher 了。首先，添加 Helm 仓库：

```
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
```

创建命名空间：

```
kubectl create namespace cattle-system
```

然后使用 Helm 安装 Rancher：Rancher 也需要你配置代理，以便它可以与外部应用商店通信，或检索 Kubernetes 版本更新元数据：

```
helm upgrade --install rancher rancher-latest/rancher \
   --namespace cattle-system \
   --set hostname=rancher.example.com \
   --set proxy=http://${proxy_host}
   --set noProxy=127.0.0.0/8\\,10.0.0.0/8\\,cattle-system.svc\\,172.16.0.0/12\\,192.168.0.0/16\\,.svc\\,.cluster.local
```

等待部署完成：

```
kubectl rollout status deployment -n cattle-system rancher
```

现在，你可以导航到 `https://rancher.example.com` 并开始使用 Rancher。

> **注意**：如果你不想发送遥测数据，在首次登录时退出[遥测]({{<baseurl>}}/rancher/v2.6/en/faq/telemetry/)。如果在离线安装的环境中让这个功能处于 active 状态，socket 可能无法打开。

### 其他资源

以下资源可能对安装 Rancher 有帮助：

- [Rancher Helm Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)
- [添加 TLS 密文]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-secrets/)
- [Rancher Kubernetes 安装的故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/resources/troubleshooting/)
