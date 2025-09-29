---
title: Windows 支持
description: 在 Rancher v2.5.6 之前，`agent` 在带有 Windows 节点的下游集群上没有本地 Windows manifests。这将导致集群的`agent` pod 失败。
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
  - 跨集群部署应用
  - Fleet
  - Windows 支持
---

在 Rancher v2.5.6 之前，`agent` 在带有 Windows 节点的下游集群上没有本地 Windows manifests。这将导致集群的`agent` pod 失败。

如果你从旧版本的 Rancher 升级到 v2.5.6+，你可以通过以下工作流程在*下游集群*中部署一个工作的 `agent`。

1. Cordon 所有 Windows 节点。
1. 对 `agent` 的工作负载应用以下的容忍度。
1. Uncordon 所有 Windows 节点。
1. 删除所有 `agent` pod。用新的权限创建新的 pod。
1. 一旦 `agent` pods 运行，并为 Fleet 启用了自动更新功能，它们应该被更新到与 Windows 兼容的 `agent` 版本。

```yaml
tolerations:
  - effect: NoSchedule
    key: cattle.io/os
    operator: Equal
    value: linux
```
