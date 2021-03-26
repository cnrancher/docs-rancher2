---
title: 404 - default backend
description: 当您对`rancher-cluster.yml`进行更改后，您将必须运行`rke remove --config rancher-cluster.yml`来清理节点，避免与以前的错误配置冲突。
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
  - RKE Add-on 安装
  - 高可用 RKE Add-On 安装 常见问题
  - 404 - default backend
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation/install-rancher-on-k8s/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

要调试此错误，您需要下载命令行工具 `kubectl`。请参阅[安装和设置 kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)，了解如何在您的平台上下载和配置 `kubectl`。

当您对 `rancher-cluster.yml` 进行更改后，您需要运行 `rke remove --config rancher-cluster.yml` 来清理节点，避免与以前的错误配置产生冲突。

## 可能的原因

NGINX ingress controller 无法为 `rancher-cluster.yml` 中配置的主机提供服务。这是您配置的用于访问 Rancher 的 FQDN 。您可以通过运行以下命令来查看创建的 ingress 是否配置正确：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml get ingress -n cattle-system -o wide
```

检查 `HOSTS` 列中是否显示了您在模板中配置的 FQDN ，以及 `ADDRESS` 列中是否显示了使用的节点。如果配置正确，我们可以检查 NGINX ingress controller 的日志。

NGINX ingress controller 的日志会显示为什么它不能为请求的主机提供服务。运行以下命令查看日志：

```
kubectl --kubeconfig kube_config_rancher-cluster.yml logs -l app=ingress-nginx -n ingress-nginx
```

**错误**

- `x509: certificate is valid for fqdn，not your_configured_fqdn`

  使用的证书包含不正确的 FQDN。

  您需要重新生成包含在模板中配置的 FQDN 的新证书，并重新部署 Rancher 。

- `Port 80 is already in use. Please check the flag --http-port`

  节点上有一个进程占用端口 NGINX ingress controller 需要使用此端口将请求路由到 Rancher 。

  您可以通过运行以下命令找到该进程： `netstat -plant | grep \:80`，然后停止或终止该进程，并重新部署 Rancher 。

- `unexpected error creating pem file: no valid PEM formatted block found`

  在模板中配置的 Base64 编码的字符串有误。

  您需要检查是否可以使用 `base64 -D STRING` 解码配置的字符串，且返回的内容与用于编码的证书字符串相同。如果正确，请检查 Base64 编码的字符串是否直接放置在密钥之后，前后和之间确保没有任何换行符。(例如: `tls.crt: LS01..`)
