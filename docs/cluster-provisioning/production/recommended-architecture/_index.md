---
title: 推荐的集群架构
description: 有三个角色可以分配给节点：`etcd`，`controlplane`和`worker`。在设计集群时，您有两个选择，为每个角色使用专用节点。这可确保指定角色所需的组件的资源可用性；将`etcd`和`controlplane`角色分配给相同的节点。这些节点必须满足这两个角色的硬件需求。无论在哪种情况下，都不应该把`worker`角色，添加到具有 `etcd` 或 `controlplane` 角色的节点中。
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
  - 生产环境检查清单
  - 推荐的集群架构
---

有三个角色可以分配给节点：`etcd`，`controlplane`和`worker`。

## 将 worker 节点与其他角色的节点分离

在设计集群时，您有两个选择：

- 为每个角色使用专用节点。这可确保指定角色所需的组件的资源可用性。而且您还可以根据[端口要求](/docs/cluster-provisioning/node-requirements/_index)严格隔离每个角色之间的网络流量。
- 将`etcd`和`controlplane`角色分配给相同的节点。这些节点必须满足这两个角色的硬件需求。

无论在哪种情况下，都不应该把`worker`角色，添加到具有 `etcd` 或 `controlplane` 角色的节点中。

因此，每个节点的角色只应该有如下几种选择：

- `etcd`
- `controlplane`
- `etcd` 和 `controlplane`
- `worker`

## 每个角色的推荐节点数

集群应该具有：

- 至少有三个角色为 `etcd` 的节点，这样可以在丢失一个节点时存活下来。增加这个数量以获得更高的节点容错率，并将它们分散到多个可用区，以提供更好的容错能力。
- 为了主组件高可用性，至少有两个角色为`controlplane`的节点。
- 分配至少两个 `worker` 节点，以在节点出现故障时，可以重新调度您的工作负载。

有关每个角色的用途的更多信息，请参阅[Kubernetes 中关于节点的角色一节](/docs/cluster-provisioning/production/nodes-and-roles/_index)。

### Controlplane 节点数

添加多个`controlplane`角色的节点，可以使每个 master 组件都高度可用。

### etcd 节点数

在维护集群可用性时，可以一次性丢失的节点数量是由`etcd`角色的节点数量决定。etcd 认为写入请求被 Leader 节点处理并分发给了“多数节点”后，就是一个成功的写入。对于一个有 n 个成员的 etcd 集群，“多数节点”是(n/2)+1。因此，我们建议在一个区域内的 3 个不同的可用区中各创建一个`etcd` 节点，这样在失去一个可用区时，etcd 仍生存下来。如果您只使用两个区域，那么在“多数节点”所在的可用区不可用时，您将会丢失 etcd 集群。

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

- [关于最佳 etcd 集群大小的 etcd 官方文档](https://etcd.io/docs/v3.4.0/faq/#what-is-failure-tolerance)
- [关于为 Kubernetes 运维 etcd 集群的 Kubernetes 官方文档](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/)

### Worker 节点数

添加多个`worker`角色的节点，可以确保在节点出现故障时，Kubernetes 可以重新调度您的工作负载到其他工作节点。

### 为什么对生产环境的 Rancher 集群和下游集群有着不通的要求？

您可能已经注意到，我们的[Rancehr Server 高可用安装指南](/docs/installation/k8s-install/_index)并不符合我们对生产就绪集群的定义。因为没有专用的节点作为`worker`节点。但是，对于 Rancehr Server 的部署，这三个节点的集群是有效的，因为：

- 它允许一个`etcd`节点失败。
- 它通过拥有多个`controlplane`节点来维护 master 组件的多个实例。
- 除了 Rancher 本身之外，不应该在此集群上创建其他工作负载。

## 参考

- [Kubernetes: 主组件](https://kubernetes.io/docs/concepts/overview/components/#master-components)
