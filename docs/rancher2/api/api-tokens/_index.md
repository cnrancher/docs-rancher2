---
title: API Tokens
description: 我们建议您在创建 API KEY 时，给它设置一个有效时间。但是一些 API Tokens 是永久有效(`ttl=0`)，除非删除它们，否则永不失效，并且 API Tokens 不会因更改用户密码而失效。您可以通过删除 API Tokens 或禁用用户来禁用它们。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - API
  - API Tokens
  - API指南
  - API参考
---

我们建议您在创建 API KEY 时，给它设置一个有效时间。有些 API Tokens 是永久有效(`ttl=0`)，除非删除它们，否则永不失效，并且 API Tokens 不会因更改用户密码而失效。

您可以通过删除 API Tokens 或禁用用户来禁用它们。

删除 API Tokens 的操作步骤如下：

1. 访问 Rancher API 视图中的所有 Tokens 列表：`https://<Rancher-Server-IP>/v3/tokens`。

1. 通过要删除的 Tokens ID 访问，例如：`https://<Rancher-Server-IP>/v3/tokens/kubectl-shell-user-vqkqt`。

1. 单击**删除**。

以下是用`ttl=0`生成的 Tokens 完整列表：

| Token             | 描述                                                                                          |
| :---------------- | :-------------------------------------------------------------------------------------------- |
| `kubeconfig-*`    | Kubeconfig Token                                                                              |
| `kubectl-shell-*` | UI 中执行 `kubectl` 命令的 Token                                                              |
| `agent-*`         | Agent 使用的 Token                                                                            |
| `compose-token-*` | compose 使用的 Token                                                                          |
| `helm-token-*`    | Helm chart 使用的 Token                                                                       |
| `*-pipeline*`     | 项目流水线使用的 Token                                                                        |
| `telemetry-*`     | Telemetry Token                                                                               |
| `drain-node-*`    | Token for drain (我们使用 `kubectl` 来执行驱逐操作，因为没有原生 Kubernetes API 支持这个操作) |
