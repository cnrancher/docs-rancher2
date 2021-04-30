---
title: 命令行工具
description: 从您的电脑使用命令行工具（CLI）与 Rancher 交互。Rancher CLI（命令行界面）是一个命令行工具，可用于与 Rancher 进行交互。使用此工具，您可以用命令行而不是 GUI 来操作 Rancher，详情请参考Rancher 命令行工具。
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
  - 快速入门
  - 命令行工具
---

## Rancher CLI

Rancher CLI（命令行界面）是一个命令行工具，可用于与 Rancher 进行交互。使用此工具，您可以用命令行而不是 GUI 来操作 Rancher，详情请参考 [Rancher 命令行工具](/docs/rancher2/cli/_index)。

请确保您可以成功运行 `rancher kubectl get pods` 命令。

## 使用 kubectl 和 kubeconfig token 进行 TTL 认证

_v2.4.6 可用_

如果管理员有[强制执行 kubeconfig tokens 上的 TTL](/docs/rancher2/api/api-tokens/_index)，当你运行`kubectl`时，kubeconfig 文件需要[Rancher cli](/docs/rancher2/cli/_index)存在于你的 PATH 中。否则，你会看到这样的错误信息：

`Unable to connect to the server: getting credentials: exec: exec: "rancher": executable file not found in \$PATH`。

该功能可以让 kubectl 与 Rancher 服务器进行身份验证，并在需要时获得新的 kubeconfig 令牌。目前支持以下认证提供者。

1. 本地
2. 活动目录
3. FreeIpa、OpenLdap
4. SAML 供应商:Ping、Okta、ADFS、Keycloak 和 Shibboleth。

当你第一次运行 kubectl 时，例如，`kubectl get pods`，它会要求你选择一个 auth provider 并使用 Rancher 服务器登录。
kubeconfig 令牌被缓存在你运行 kubectl 的路径中，在`./.cache/token`下。这个令牌在[过期](/docs/rancher2/api/api-tokens/_index)或[从 Rancher 服务器删除](/docs/rancher2/api/api-tokens/_index)之前都是有效的。
过期后，下一个`kubectl get pods`会要求你再次用 Rancher 服务器登录。

## kubectl

请先安装`kubectl`，详情请参考[安装 kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl)。

:::tip 提示
国内用户，可以导航到 http://mirror.cnrancher.com 下载所需资源
:::

通过 Rancher UI 访问您的集群，然后单击集群仪表盘页面右上角的`Kubeconfig 文件`，配置 kubectl，把内容复制粘贴到`~/.kube/config`文件内即可。

检查是否可以成功运行`kubectl cluster-info` 或 `kubectl get pods`命令。

当你第一次运行 kubectl 时，例如，`kubectl get pods`，它会要求你选择一个 auth provider 并使用 Rancher 服务器登录。
kubeconfig 令牌被缓存在你运行 kubectl 的路径中，在`./.cache/token`下。这个令牌在过期，或者从 Rancher 服务器上删除之前都有效。
过期后，下一个`kubectl get pods`会要求你再次登录 Rancher 服务器。

:::note 注意
从 CLI [v2.4.10](https://github.com/rancher/cli/releases/tag/v2.4.10)开始，kubeconfig 标记可以用`cache-dir`标志或 env var `RANCHER_CACHE_DIR`缓存在选定的路径。
:::

### 已知问题

1. 如果为 RKE 集群启用[授权集群端点](/docs/rancher2/overview/architecture/_index)，以[直接与下游集群进行认证](/docs/rancher2/cluster-admin/cluster-access/kubectl/index），Rancher 服务器宕机，kubeconfig 令牌过期后，所有 kubectl 调用都会失败。如果 Rancher 服务器无法访问，则无法生成新的 kubeconfig 令牌。

2. 如果从 Rancher [API tokens](/docs/rancher2/api/api-tokens/_index)页面中删除了 kubeconfig 令牌，而令牌仍在缓存中，那么在令牌过期或被删除之前，cli 不会要求你再次登录。`kubectl`调用将导致类似`error: You must be logged in to the server (the server has asked for the client to provide credentials`。可以使用`rancher token delete`删除令牌。
