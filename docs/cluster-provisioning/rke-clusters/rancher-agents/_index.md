---
title: Rancher Agent
description: 有两种不同的 Agent 资源部署在 Rancher 纳管的集群：cattle-cluster-agent和cattle-node-agent
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
  - 创建集群
  - 集群配置参数
  - 配置 Pod 安全策略
---

有两种不同的 Agent 资源部署在 Rancher 纳管的集群：

- [cattle-cluster-agent](#cattle-cluster-agent)
- [cattle-node-agent](#cattle-node-agent)

有关 Rancher Server 如何设置集群并与之通信的概述，请参阅[产品架构](/docs/overview/architecture/_index)。

## cattle-cluster-agent

`cattle-cluster-agent`用于连接集群的[Rancher 部署的 Kubernetes 集群](/docs/cluster-provisioning/rke-clusters/_index)的 Kubernetes API。`cattle-cluster-agent`是通过 Deployment 的方式部署的。

## cattle-node-agent

在执行集群操作时，`cattle-node-agent`用于和[Rancher 部署的 Kubernetes 集群](/docs/cluster-provisioning/rke-clusters/_index)中的节点进行交互。集群操作的示例包括升级 Kubernetes 版本和创建/恢复 etcd 快照。`cattle-node-agent`是通过 DaemonSet 的方式部署的，以确保其在每个节点上运行。当`cattle-cluster-agent`不可用时，`cattle-node-agent` 讲作为备选方案连接到[Rancher 部署的 Kubernetes 集群](/docs/cluster-provisioning/rke-clusters/_index)中的 Kubernetes API。

> **注意：** 在 Rancher v2.2.4 及以下版本中，`cattle-node-agent` pod 没有忍受所有的 taints，导致 Kubernetes 升级失败。Rancher v2.2.5 及更高版本中包含了对此问题的修复。

## 调度规则

_适用于 v2.3.0 及更高版本_

| 组件                   | 节点亲和性和节点选择器                | 节点选择器 | 容忍              |
| ---------------------- | ------------------------------------- | ---------- | ----------------- |
| `cattle-cluster-agent` | `beta.kubernetes.io/os:NotIn:windows` | none       | `operator:Exists` |
| `cattle-node-agent`    | `beta.kubernetes.io/os:NotIn:windows` | none       | `operator:Exists` |

`cattle-cluster-agent` 部署配置了有着`requiredDuringSchedulingIgnoredDuringExecution`的设置的首选调度规则，使它在 `controlplane` 角色的节点上调度。参考[Kubernetes: 将 pod 分配给节点](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)，可以找到更多关于调度规则的信息。

`requiredDuringSchedulingIgnoredDuringExecution` 配置如下表所示:

| 权重 | 表达式                                           |
| ---- | ------------------------------------------------ |
| 100  | `node-role.kubernetes.io/controlplane:In:"true"` |
| 1    | `node-role.kubernetes.io/etcd:In:"true"`         |
