---
title: Windows 支持
weight: 2
---


在 Rancher 2.5.6 之前，`agent` 在具有 Windows 节点的下游集群上没有原生的 Windows 清单。这将导致集群的 `agent` pod 失败。

如果你从旧版本的 Rancher 升级到 2.5.6+，你可以在*下游集群*中部署具有以下工作流的工作 `agent`：

1. 封锁所有 Windows 节点。
1. 对 `agent` 工作负载应用以下容忍度。
1. 取消所有 Windows 节点的封锁。
1. 删除所有 `agent` pod。使用新的容忍度来创建新 pod。
1. `agent` pod 运行并为 Fleet 启用了自动更新后，它们会更新到与 Windows 兼容的 `agent` 版本。

```yaml
tolerations:
- effect: NoSchedule
  key: cattle.io/os
  operator: Equal
  value: linux
```
