---
title: API 令牌
weight: 1
---

默认情况下，某些集群级别的 API 令牌是使用无限期 TTL（`ttl=0`）生成的。换言之，`ttl=0` 的 API 令牌永远不会过期，除非你让令牌失效。令牌不会因为更改密码而失效。

要停用 API 令牌，你可以删除令牌或停用用户账号。

### 删除令牌
要删除令牌：

1. 转到 `https://<Rancher-Server-IP>/v3/tokens`，在 Rancher API 视图中查看包含所有令牌的列表。

1. 通过 ID 访问要删除的令牌。例如，`https://<Rancher-Server-IP>/v3/tokens/kubectl-shell-user-vqkqt`。

1. 单击**删除**。

以下是使用 `ttl=0` 生成的完整令牌列表：

| 令牌 | 描述 |
|-------|-------------|
| `kubeconfig-*` | Kubeconfig 令牌 |
| `kubectl-shell-*` | 在浏览器中访问 `kubectl` shell |
| `agent-*` | Agent deployment 令牌 |
| `compose-token-*` | compose 令牌 |
| `helm-token-*` | Helm Chart deployment 令牌 |
| `*-pipeline*` | 项目管道令牌 |
| `telemetry-*` | 遥测令牌 |
| `drain-node-*` | 用于清空的令牌（由于没有原生 Kubernetes API，我们使用 `kubectl` 来清空） |


### 在 Kubeconfig 令牌上设置 TTL

管理员可以在 Kubeconfig 令牌上设置全局 TTL。令牌过期后，kubectl 会要求用户向 Rancher 进行身份验证。

转到全局设置，然后：

1. 将 `kubeconfig-generate-token` 设置为 `false`。此设置让 Rancher 不再在用户单击下载 kubeconfig 文件时自动生成令牌。kubeconfig 文件会提供登录 Rancher 的命令。

_**注意**_：如果停用此设置，生成的 kubeconfig 将引用 [Rancher CLI]({{<baseurl>}}/rancher/v2.6/en/cli) 来检索集群的短期令牌。如果你在客户端（例如 `kubectl`）中使用此 kubeconfig，则还需要安装 Rancher CLI。

2. 将 `kubeconfig-token-ttl-minutes` 设置为所需的时长（以分钟为单位）。`kubeconfig-token-ttl-minutes` 默认设置为 960（即 16 小时）。

_**注意**_：该值不能超过 API 令牌的 max-ttl（`https://<Rancher-Server-IP/v3/settings/auth-token-max-ttl-minutes`）。`auth-token-max-ttl-minutes` 默认设置为 1440（即 24 小时）。`auth-token-max-ttl-minutes` 默认为 0，即允许令牌永不过期。

### 令牌哈希

你可以启用令牌哈希，令牌将使用 SHA256 算法进行单向哈希。这是一个不可逆的操作，一旦启用，此功能将无法禁用。在启用功能或在测试环境中评估之前，建议你先进行备份。

要启用令牌哈希，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags)。

此功能将影响所有令牌，包括但不限于以下内容：

- Kubeconfig 令牌
- 持有者令牌 API 密钥/调用
- 内部操作使用的令牌

