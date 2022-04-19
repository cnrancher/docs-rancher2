---
title: 升级和回滚 Kubernetes
weight: 70
---

升级到最新版本的 Rancher 之后，下游 Kubernetes 集群可以升级为 Rancher 支持的最新的 Kubernetes 版本。

Rancher 使用 RKE（Rancher Kubernetes Engine）来预置和编辑 RKE 集群。有关为 RKE 集群配置升级策略的更多信息，请参阅 [RKE 文档]({{<baseurl>}}/rke/latest/en/)。

本节涵盖以下主题：

- [新功能](#new-features)
- [经过测试的 Kubernetes 版本](#tested-kubernetes-versions)
- [升级的工作原理](#how-upgrades-work)
- [升级的最佳实践](#recommended-best-practice-for-upgrades)
- [升级 Kubernetes 版本](#upgrading-the-kubernetes-version)
- [回滚](#rolling-back)
- [配置升级策略](#configuring-the-upgrade-strategy)
  - [在 Rancher UI 中配置最大不可用的 Worker 节点](#configuring-the-maximum-unavailable-worker-nodes-in-the-rancher-ui)
  - [使用 Rancher UI 在升级期间启用节点清空](#enabling-draining-nodes-during-upgrades-from-the-rancher-ui)
  - [在升级期间维护应用的可用性](#maintaining-availability-for-applications-during-upgrades)
  - [在 cluster.yml 中配置升级策略](#configuring-the-upgrade-strategy-in-the-cluster-yml)
- [故障排查](#troubleshooting)

## 经过测试的 Kubernetes 版本

Rancher 在发布新版本之前，会对其与 Kubernetes 的最新次要版本进行测试，以确保兼容性。有关各个 Rancher 版本测试了哪些 Kubernetes 版本的详细信息，请参阅[支持维护条款](https://rancher.com/support-maintenance-terms/all-supported-versions/rancher-v2.6.0/)。

## 升级的工作原理

RKE v1.1.0 改变了集群升级的方式。

在 [RKE 文档]({{<baseurl>}}/rke/latest/en/upgrades/how-upgrades-work)中，你将了解编辑或升级 RKE Kubernetes 集群时会发生的情况。

## 升级的最佳实践

在升级集群的 Kubernetes 版本时，我们建议你：

1. 拍一张快照。
1. 启动 Kubernetes 升级。
1. 如果升级失败，请将集群恢复到升级前的 Kubernetes 版本。这可以通过选择**恢复 etcd 和 Kubernetes 版本**选项来实现。在恢复 etcd 快照 之前，这会将你的集群恢复到升级前的 kubernetes 版本。

恢复操作将在不处于健康或 active 状态的集群上运行。

## 升级 Kubernetes 版本

> **前提**：
>
> - 以下选项仅适用于 [Rancher 启动的 RKE Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)和[注册的 K3s Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/#additional-features-for-registered-k3s-clusters)。
> - 在升级 Kubernetes 之前，先[备份你的集群]({{<baseurl>}}/rancher/v2.6/en/backups)。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，进入要升级的集群，然后点击 **⋮ > 编辑配置**。
1. 从 **Kubernetes 版本** 下拉列表中，选择要用于集群的 Kubernetes 版本。
1. 单击**保存**。

**结果**：已开始为集群升级 Kubernetes。

## 回滚

你可以将集群恢复到使用先前 Kubernetes 版本的备份。有关详细信息，请参阅：

- [备份集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/backing-up-etcd/#how-snapshots-work)
- [使用备份恢复集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/restoring-etcd/#restoring-a-cluster-from-a-snapshot)

## 配置升级策略

从 RKE v1.1.0 开始，我们提供了额外的升级选项，让你更精细地控制升级过程。如果满足[条件和要求]({{<baseurl>}}/rke/latest/en/upgrades/maintaining-availability)，你可以使用这些选项，从而在集群升级期间维持应用的可用性。

你可以在 Rancher UI 中配置升级策略，也可以通过编辑 `cluster.yml` 来配置策略。编辑 `cluster.yml` 可以配置更多高级选项。

### 在 Rancher UI 中配置最大不可用的 Worker 节点

你可以在 Rancher UI 中配置不可用 worker 节点的最大数量。在集群升级期间，worker 节点将按此大小批量升级。

默认情况下，不可用 worker 节点的最大数量为所有 worker 节点的 10%。此数字可以配置为百分比或整数。当定义为百分比时，批大小会被四舍五入到最近的节点，最小为一个节点。

要更改 worker 节点的默认数量或百分比：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，进入要升级的集群，然后点击 **⋮ > 编辑配置**。
1. 在**升级策略**选项卡中，输入 **Worker 并发**作为固定的数字或百分比。你可以通过将集群中的节点数减去最大不可用节点数来获取该数字。
1. 单击**保存**。

**结果**：集群更新为使用新的升级策略。

### 使用 Rancher UI 在升级期间启用节点清空

默认情况下，RKE 会在升级之前[封锁](https://kubernetes.io/docs/concepts/architecture/nodes/#manual-node-administration)每个节点。默认情况下，[清空](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/)会在升级期间被禁用。如果在集群配置中启用了清空，RKE 将在升级之前对节点进行封锁和清空。

要在集群升级期间清空每个节点：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，进入要启用节点清空的集群，然后点击 **⋮ > 编辑配置**。
1. 单击 **⋮ > 编辑**。
1. 在**升级策略**选项卡中，转到**清空节点**字段并单击**是**。control plane 和 worker 节点的清空是单独配置的。
1. 配置如何删除 pod 的选项。有关每个选项的详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/nodes/#aggressive-and-safe-draining-options)。
1. （可选）配置宽限期。宽限期是给每个 pod 进行清理的超时时间，能让 pod 有机会优雅地退出。Pod 可能需要完成任何未完成的请求、回滚事务或将状态保存到某些外部存储。如果该值为负数，将使用 pod 中指定的默认值。
1. （可选）配置超时，这是在清空放弃之前应该继续等待的时间。
1. 单击**保存**。

**结果**：集群更新为使用新的升级策略。

> **注意**：从 Rancher v2.4.0 开始出现了一个[已知问题](https://github.com/rancher/rancher/issues/25478)，即使 etcd 和 control plane 正在被清空， Rancher UI 不会将它们的状态显示为已清空。

### 在升级期间维护应用的可用性

_从 RKE v1.1.0 起可用_

在 [RKE 文档]({{<baseurl>}}/rke/latest/en/upgrades/maintaining-availability/)中，你将了解在升级集群时防止应用停机的要求。

### 在 cluster.yml 中配置升级策略

你通过编辑 `cluster.yml` 来获得更高级的升级策略配置选项。

有关详细信息，请参阅 RKE 文档中的[配置升级策略]({{<baseurl>}}/rke/latest/en/upgrades/configuring-strategy)。这部分还包括一个用于配置升级策略的示例 `cluster.yml`。

## 故障排查

如果升级后节点没有出现，`rke up` 命令会出错。

如果不可用节点的数量超过配置的最大值，则不会进行升级。

如果升级停止，你可能需要修复不可用节点或将其从集群中删除，然后才能继续升级。

失败的节点可能处于许多不同的状态：

- 关机
- 不可用
- 用户在升级过程中清空了节点，因此节点上没有 kubelet
- 升级本身失败

如果在升级过程中达到最大不可用节点数，Rancher 的下游集群将停留在更新中的状态，并且不会继续升级其他 control plane 节点。它将继续评估不可用的节点集，以防其中一个节点变得可用。如果无法修复节点，则必须移除节点才能继续升级。
