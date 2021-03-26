---
title: 3. 安装Rancher
description: 现在您已经有了一个正在运行的 RKE 集群，您可以在其中安装 Rancher。出于安全考虑，所有到 Rancher 的流量必须用 TLS 加密。在本教程中，您将通过cert-manager自动签发自签名证书。在实际使用情况下，您可能会使用 Let's Encrypt 或提供自己的证书。
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
  - 其他安装方法
  - HTTP代理安装
  - 安装 Rancher
---

## 概述

现在您已经有了一个正在运行的 RKE 集群，您可以在其中安装 Rancher。出于安全考虑，所有到 Rancher 的流量必须用 TLS 加密。在本教程中，您将通过[cert-manager](https://cert-manager.io/)自动签发自签名证书。在实际使用情况下，您可能会使用 Let's Encrypt 或提供自己的证书。更多细节请参见[SSL 配置](/docs/rancher2/installation/resources/advanced/helm2/helm-rancher/_index)。

> **注意：**以下步骤基于 Helm 3 写作。

## 安装 cert-manager

添加 cert-manager helm 仓库：

```bash
helm repo add jetstack https://charts.jetstack.io
```

为 cert-manager 创建命名空间：

```bash
kubectl create namespace cert-manager
```

安装 cert-manager 的 CustomResourceDefinitions：

```bash
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.2/cert-manager.crds.yaml
```

然后使用 Helm 安装 cert-manager。需要注意的是，cert-manager 还需要配置你的代理，以防它需要与 Let's Encrypt 或其他外部证书发行商进行通信。

```bash
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --version v0.15.2 \
  --set http_proxy=http://${proxy_host} \
  --set https_proxy=http://${proxy_host} \
  --set no_proxy=127.0.0.0/8\\,10.0.0.0/8\\,cattle-system.svc\\,172.16.0.0/12\\,192.168.0.0/16
```

现在你应该等待 cert-manager 完成启动：

```bash
kubectl rollout status deployment -n cert-manager cert-manager
kubectl rollout status deployment -n cert-manager cert-manager-webhook
```

### 安装 Rancher

接下来就可以安装 Rancher 了，首先添加 Docker 仓库：

```bash
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
```

创建命名空间：

```bash
kubectl create namespace cattle-system
```

然后使用 Helm 安装 Rancher。需要注意的是，Rancher 还需要配置你的代理，以防它需要与 Let's Encrypt 或其他外部证书发行商进行通信。

```bash
helm upgrade --install rancher rancher-latest/rancher \
   --namespace cattle-system \
   --set hostname=rancher.example.com \
   --set proxy=http://${proxy_host}
   --set no_proxy=127.0.0.0/8\\,10.0.0.0/8\\,cattle-system.svc\\,172.16.0.0/12\\,192.168.0.0/16\\,.svc\\,.cluster.local
```

等部署完成后：

```bash
kubectl rollout status deployment -n cattle-system rancher
```

现在你可以导航到`https://rancher.example.com`，开始使用 Rancher。

> **注意：**如果您不打算发送遥测数据，请在初始登录时选择退出[遥测](/docs/rancher2/faq/telemetry/_index)。如果在空口环境中保持这个状态，可能会导致无法成功打开 socket 的问题。

## 相关链接

- [高可用安装 Helm Chart 选项](/docs/rancher2/installation/resources/chart-options/_index)
- [添加 TLS 密文](/docs/rancher2/installation/resources/tls-secrets/_index)
- [Rancher Server 所在 Kubernetes 集群的问题排查](/docs/rancher2/installation/other-installation-methods/troubleshooting/_index)
