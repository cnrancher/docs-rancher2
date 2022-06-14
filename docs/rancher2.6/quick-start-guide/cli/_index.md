---
title: Rancher CLI
weight: 100
---

Rancher CLI 是一个命令行工具，用于在工作站中与 Rancher 进行交互。

## Rancher CLI

请参考 [Rancher CLI](../../cli) 中的步骤进行操作。

请确保你可以成功运行 `rancher kubectl get pods`。


## kubectl
安装 `kubectl` 请参见[安装 kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。


要配置 kubectl，通过 Rancher Web UI 访问你的集群，单击 `Kubeconfig`，然后复制内容并将其粘贴到你的 `~/.kube/config` 文件中。

检查是否可以成功运行 `kubectl cluster-info` 或 `kubectl get pods` 命令。

## 使用 kubectl 和 kubeconfig token 进行 TTL 认证

_要求_

如果管理员已[强制执行 kubeconfig token 上的 TTL]({{<baseurl>}}/rancher/v2.6/en/api/api-tokens/#setting-ttl-on-kubeconfig-tokens)，当你运行 `kubectl` 时，kubeconfig 文件需要 [Rancher CLI](../cli) 存在于你的 PATH 中。否则，你会看到这样的错误信息：
`Unable to connect to the server: getting credentials: exec: exec: "rancher": executable file not found in $PATH`。

该功能可以让 kubectl 与 Rancher Server 进行身份验证，并在需要时获得新的 kubeconfig token。目前支持以下验证提供程序：

1. 本地
2. Active Directory
3. FreeIpa，OpenLdap
4. SAML 身份提供商：Ping，Okta，ADFS，Keycloak 和 Shibboleth

如果你是第一次运行 kubectl，例如，`kubectl get pods`，它会要求你选择一个验证提供程序并使用 Rancher Server 登录。
kubeconfig token 会被缓存 `./.cache/token` 下你运行 kubectl 的路径中。该 Token 在[过期](../../api/api-tokens/#setting-ttl-on-kubeconfig-tokens-period)或[从 Rancher Server 删除](../../api/api-tokens/#deleting-tokens)之前都是有效的。
过期后，下一个 `kubectl get pods` 命令会要求你再次使用 Rancher Server 登录。
