---
title: 生产就绪集群检查清单
description: 在本节中，我们将介绍如何创建可用于生产的 Kubernetes 下游集群。这个集群将用来运行您的应用程序和服务。关于对创建下游集群的节点的要求，例如操作系统/Docker、硬件和网络的需求，请参考节点需求。这里是最重要的一些最佳实践，我们强烈建议将这些最佳实践应用于全部的生产集群。有关我们建议的所有最佳实践的完整列表，请参阅最佳实践。
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
  - 生产就绪集群检查清单
---

在本节中，我们将介绍如何创建可用于生产的 Kubernetes 下游集群。这个集群将用来运行您的应用程序和服务。

关于对创建下游集群的节点的要求，例如操作系统/Docker、硬件和网络的需求，请参考[节点需求](/docs/cluster-provisioning/node-requirements/_index)。

:::important 重要
这里是最重要的一些最佳实践，我们强烈建议将这些最佳实践应用于全部的生产集群。
:::

有关我们建议的所有最佳实践的完整列表，请参阅[最佳实践部分](/docs/best-practices/_index)。

## 节点需求

- 确保您的节点满足所有的[节点需求](/docs/cluster-provisioning/node-requirements/_index)，包括端口需求。

## 备份 etcd

- 启用 etcd 快照。验证快照是否被创建成功，并且进行一次灾难恢复来验证快照是否有效。etcd 中存储了您集群状态，丢失 etcd 数据意味着丢失集群。请确保为您的集群配置了[etcd 循环快照](/docs/backups/backups/ha-backups/_index)，并确保快照存储在外部（节点之外）。

## 集群架构

- 节点应具有以下角色配置之一：
  - `etcd`
  - `controlplane`
  - `etcd` 和 `controlplane`
  - `worker` (不应在具有 `etcd` 或 `controlplane` 角色的节点上使用或添加 `worker` 角色)
- 至少有三个角色为 `etcd` 的节点，来确保当失去一个节点时仍能存活。增加 etcd 节点数量以提高容错率，并将 etcd 其分散到不通可用区，以提供更好的容错能力。
- 分配两个或多个节点为 `controlplane` 角色，以实现 master 组件的高可用性。
- 分配两个或多个节点为 `worker` 角色，以在节点出现故障时，可以将工作负载重新调度。

有关每个角色的用途的更多信息，请参考[Kubernetes 中关于节点的角色一节](/docs/cluster-provisioning/production/nodes-and-roles/_index)。

有关每个 Kubernets 角色的节点数的详细信息，请参阅[推荐的集群架构](/docs/cluster-provisioning/production/recommended-architecture/_index)。

## 日志记录和监控

- 为 Kubernetes 组件（系统服务）配置告警和通知程序。
- 配置日志记录以进行集群分析和事后复盘。

## 可靠性

- 在集群上执行压力测试，以验证其硬件能够支撑您的工作负载。

## 网络

- 最小化网络延迟。Rancher 建议最小化 etcd 节点之间的延迟。默认的`心跳间隔`为 `500`，默认的`选举超时`为`5000`。这些[etcd 调优设置](https://coreos.com/etcd/docs/latest/tuning.html)允许 etcd 在大多数网络（网络延迟特别高的情况下除外）中运行。
- 集群节点应该位于单个区域内。大多数云厂商在一个区域内会提供多个可用区。这可以增加您的集群的高可用性。任何角色的节点都可以使用多可用区。如果您正在使用[Kubernetes Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)资源，请参考相关文档了解任何限制(例如可用区存储的限制)。
