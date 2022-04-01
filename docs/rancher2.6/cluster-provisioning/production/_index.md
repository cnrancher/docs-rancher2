---
title: 生产就绪集群检查清单
weight: 2
---

本节将介绍创建生产就绪型 Kubernetes 集群的最佳实践。这个集群可用于运行你的应用和服务。

有关集群的要求（包括对 OS/Docker、硬件和网络的要求），请参阅[节点要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements)。

本文介绍了我们推荐用于所有生产集群的最佳实践的简短列表。

如需获取推荐的所有最佳实践的完整列表，请参阅[最佳实践]({{<baseurl>}}/rancher/v2.6/en/best-practices)。

### 节点要求

- 确保你的节点满足所有[节点要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/)，包括端口要求。

### 备份 etcd

- 启用 etcd 快照。验证是否正在创建快照，并执行灾难恢复方案，从而验证快照是否有效。etcd 是存储集群状态的位置，丢失 etcd 数据意味着丢失集群。因此，请确保为集群配置 etcd 的定期快照，并确保快照也是存储在外部（节点外）的。

### 集群架构

- 节点应具有以下角色配置之一：
  - `etcd`
  - `controlplane`
  - `etcd` 和 `controlplane`
  - `worker`（不应在具有 `etcd` 或 `controlplane` 角色的节点上使用或添加 `worker` 角色）
- 至少拥有三个角色为 `etcd` 的节点，来确保失去一个节点时仍能存活。增加 etcd 节点数量能提高容错率，而将 etcd 分散到不同可用区甚至能获取更好的容错能力。
- 为两个或更多节点分配 `controlplane` 角色，能实现主组件的高可用性。
- 为两个或多个节点分配 `worker` 角色，以便在节点故障时重新安排工作负载。

有关每个角色的用途的更多信息，请参阅 [Kubernetes 中的节点角色]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production/nodes-and-roles)。

有关每个 Kubernetes 角色的节点数的详细信息，请参阅[推荐架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/)。

### 日志管理和监控

- 为 Kubernetes 组件（系统服务）配置告警/通知程序。
- 为集群分析和事后剖析配置日志管理。

### 可靠性

- 在集群上执行负载测试，以验证硬件是否可以支持你的工作负载。

### 网络

- 最小化网络延迟。Rancher 建议尽量减少 etcd 节点之间的延迟。`heartbeat-interval` 的默认设置是 `500`，`election-timeout` 的默认设置是 `5000`。这些 [etcd 调优设置](https://coreos.com/etcd/docs/latest/tuning.html) 允许 etcd 在大多数网络（网络延迟特别高的情况下除外）中运行。
- 集群节点应位于单个区域内。大多数云厂商在一个区域内提供多个可用区，这可以提高你集群的可用性。任何角色的节点都可以使用多个可用区。如果你使用 [Kubernetes Cloud Provider]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/) 资源，请查阅文档以了解限制（即区域存储限制）。
