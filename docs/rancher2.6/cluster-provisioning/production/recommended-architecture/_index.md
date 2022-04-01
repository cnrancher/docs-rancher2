---
title: 推荐的集群架构
weight: 1
---

有三个角色可以分配给节点，分别是 `etcd`、`controlplane` 和 `worker`。

## 将 Worker 节点与具有其他角色的节点分开

在设计集群时，你有两种选择：

- 为每个角色使用专用节点。这确保了特定角色所需组件的资源可用性。它还根据[端口要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/#networking-requirements)严格隔离每个角色之间的网络流量。
- 将 `etcd` 和 `controlplane` 角色分配给相同的节点。该节点必须满足这两个角色的硬件要求。

无论在哪种情况下，都不应该在具有 `etcd` 或 `controlplane` 角色的节点中使用或添加 `worker` 角色。

因此，每个节点的角色都有如下几种配置选择：

- `etcd`
- `controlplane`
- `etcd` 和 `controlplane`
- `worker`

## 每个角色的推荐节点数

集群应该有：

- 至少拥有三个角色为 `etcd` 的节点，来确保失去一个节点时仍能存活。增加 etcd 节点数量能提高容错率，而将 etcd 分散到不同可用区甚至能获取更好的容错能力。
- 至少两个节点具有 `controlplane` 角色，以实现主组件高可用性。
- 至少两个具有 `worker` 角色的节点，用于在节点故障时重新安排工作负载。

有关每个角色的用途的更多信息，请参阅 [Kubernetes 中的节点角色]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production/nodes-and-roles)。

### Controlplane 节点数

添加多个具有 `controlplane` 角色的节点，使每个主组件都具有高可用性。

### etcd 节点数

在保持集群可用性的同时，可以一次丢失的节点数由分配了 `etcd` 角色的节点数决定。对于具有 n 个成员的集群，最小值为 (n/2)+1。因此，我们建议在一个区域内的 3 个不同可用区中各创建一个 `etcd` 节点，以在一个可用区丢失的情况下存活。如果你只使用两个区域，那么在“多数节点”所在的可用区不可用时，你将会丢失 etcd 集群。

| 具有 `etcd` 角色的节点 | 多数节点 | 容错能力 |
| ---------------------- | -------- | -------- |
| 1                      | 1        | 0        |
| 2                      | 2        | 0        |
| 3                      | 2        | **1**    |
| 4                      | 3        | 1        |
| 5                      | 3        | **2**    |
| 6                      | 4        | 2        |
| 7                      | 4        | **3**    |
| 8                      | 5        | 3        |
| 9                      | 5        | **4**    |

参考：

- [最佳 etcd 集群大小的官方 etcd 文档](https://etcd.io/docs/v3.4.0/faq/#what-is-failure-tolerance)
- [为 Kubernetes 操作 etcd 集群的官方 Kubernetes 文档](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/)

### Worker 节点数

添加多个具有 `worker` 角色的节点能确保一个节点出现故障时可以重新安排工作负载。

### 为什么 Rancher 集群和运行应用的集群的生产要求不同

你可能已经注意到我们的 [Kubernetes 安装]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)说明并不符合我们对生产就绪集群的要求，这是因为 `worker` 角色没有专用节点。然而，你 Rancher 中的这个三节点集群是有效的，因为：

- 它允许一个 `etcd` 节点故障。
- 它通过多个 `controlplane` 节点来维护主组件的多个实例。
- 此集群上没有创建除 Rancher 之外的其他工作负载。

## 参考

- [Kubernetes：主组件](https://kubernetes.io/docs/concepts/overview/components/#master-components)
