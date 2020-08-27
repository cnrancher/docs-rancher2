---
title: Rancher Agent
description: Rancher 纳管的集群部署有两种不同的Agent ：cattle-cluster-agent 和 cattle-node-agent
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

Rancher 纳管的集群部署有两种不同的 Agent：

- [cattle-cluster-agent](#cattle-cluster-agent)
- [cattle-node-agent](#cattle-node-agent)

有关 Rancher Server 如何设置集群并与之通信的概述，请参阅[产品架构](/docs/rancher2/overview/architecture/_index)。

## cattle-cluster-agent

`cattle-cluster-agent`用于连接集群的[Rancher 部署的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)的 Kubernetes API。`cattle-cluster-agent`通过 Deployment 的方式部署。

## cattle-node-agent

在执行集群操作时，`cattle-node-agent`用于和[Rancher 部署的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)中的节点进行交互。集群操作的示例包括升级 Kubernetes 版本、创建 etcd 快照和恢复 etcd 快照。`cattle-node-agent`通过 DaemonSet 的方式部署，以确保其在每个节点上运行。当`cattle-cluster-agent`不可用时，`cattle-node-agent` 将作为备选方案连接到[Rancher 部署的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)中的 Kubernetes API。

> **注意：** 在 Rancher v2.2.4 及以下版本中，`cattle-node-agent` pod 没有忍受所有的 taints，导致 Kubernetes 升级失败。Rancher v2.2.5 及更高版本中包含了对此问题的修复。

## 调度规则

_适用于 v2.3.0 及更高版本_

| 组件                   | 节点亲和性和节点选择器                | 节点选择器 | 容忍              |
| :--------------------- | :------------------------------------ | :--------- | :---------------- |
| `cattle-cluster-agent` | `beta.kubernetes.io/os:NotIn:windows` | none       | `operator:Exists` |
| `cattle-node-agent`    | `beta.kubernetes.io/os:NotIn:windows` | none       | `operator:Exists` |

因为`cattle-cluster-agent` 部署配置了`requiredDuringSchedulingIgnoredDuringExecution`相关的首选调度规则设置，所以它会在 `controlplane` 角色的节点上执行调度。参考[Kubernetes: 将 pod 分配给节点](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)，可以找到更多关于调度规则的信息。

`requiredDuringSchedulingIgnoredDuringExecution` 配置如下表所示:

| 权重 | 表达式                                           |
| :--- | :----------------------------------------------- |
| 100  | `node-role.kubernetes.io/controlplane:In:"true"` |
| 1    | `node-role.kubernetes.io/etcd:In:"true"`         |
