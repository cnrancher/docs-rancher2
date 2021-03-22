---
title: 升级回滚 Kubernetes 版本
description: 升级到最新版本的 Rancher 之后，下游 Kubernetes 集群可以升级为 Rancher 支持的最新的 Kubernetes 版本。Rancher 将使用 RKE（Rancher Kubernetes Engine）作为库来创建和编辑 RKE 集群。有关为 RKE 集群配置升级策略的更多信息，请参考 RKE 文档。
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
  - 集群管理员指南
  - 升级回滚 Kubernetes 版本
---

升级到最新版本的 Rancher 之后，下游 Kubernetes 集群可以升级为 Rancher 支持的最新的 Kubernetes 版本。

Rancher 将使用 RKE（Rancher Kubernetes Engine）作为库来创建和编辑 RKE 集群。有关为 RKE 集群配置升级策略的更多信息，请参考[RKE 文档](/docs/rke/_index)。

## 新功能

从 Rancher v2.3.0 开始，Rancher 添加了 Kubernetes 元数据功能，该功能允许在不升级 Rancher 的情况下，获取到 Kubernetes 补丁版本。有关详细信息，请参阅关于 [Kubernetes 元数据](/docs/rancher2.5/admin-settings/k8s-metadata/_index)的部分。

从 Rancher v2.4.0 开始，

- 添加了将 K3s Kubernetes 集群导入 Rancher 的功能，以及在编辑这些集群时升级 Kubernetes 的功能。有关详细信息，请参阅[关于导入集群](/docs/rancher2/cluster-provisioning/imported-clusters/_index)的部分。
- Rancher UI 中提供了用于配置 RKE 集群升级策略的新高级选项：**最大不可用工作节点**和**驱散节点**。这些选项利用了 RKE v1.1.0 的新的集群升级功能，其中节点可以进行滚动升级，以便在某些特殊情况下，保障在集群升级期间集群和应用的可用性。

## 经过测试的 Kubernetes 版本

在发布新版本的 Rancher 之前，将会对 Kubernetes 的最新次要版本进行了测试，以确保兼容性。例如，Rancher v2.3.0 中以及验证了 Kubernetes v1.15.4，v1.14.7 和 v1.13.11。有关在每个 Rancher 版本上测试过哪个版本的 Kubernetes 的详细信息，请参阅[支持维护条款](https://rancher.com/support-maintenance-terms/all-supported-versions/)。

## 升级的工作原理

RKE v1.1.0 更改了集群升级方式。

在这一部分的 [升级原理](/docs/rke/upgrades/how-upgrades-work/_index)中，您将了解编辑或升级 RKE Kubernetes 集群时会发生什么。

## 升级的最佳实践

### Rancher v2.4+

升级集群的 Kubernetes 版本时，我们建议您：

1. 备份集群，保存集群快照。
1. 启动 Kubernetes 升级。
1. 如果升级失败，请将集群恢复到升级前的 Kubernetes 版本。这可以通过选择*还原 etcd 和 Kubernetes 版本*选项来实现。这将在恢复 etcd 快照之前，将集群恢复到升级前的 kubernetes 版本。
1. 从 etcd 快照还原集群。在还原之前，请确保您的集群正在运行升级之前的 Kubernetes 版本。

还原操作将在处于非健康状态或非 `active` 状态的集群上进行。

### Rancher v2.4 之前的版本

升级集群的 Kubernetes 版本时，我们建议您：

1. 备份集群，保存集群快照。
1. 查看集群 YAML，记下当前的 Kubernetes 版本。
1. 启动 Kubernetes 升级。
1. 如果升级失败，编辑集群 YAML，修改 Kubernetes 版本到之前的版本。
1. 从 etcd 快照还原集群。

> **注意：**用户无法在 Rancher UI 中通过表单来还原 Kubernetes 版本。

## 升级 Kubernetes 版本

> **先决条件：**
>
> - 以下选项仅适用于 [RKE 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)和[导入的 K3s Kubernetes 集群](/docs/rancher2/cluster-provisioning/imported-clusters/_index)。
> - 升级 Kubernetes 之前，请[备份您的集群](/docs/rancher2.5/backups/_index)。

1. 从**全局**视图中，找到要升级 Kubernetes 版本的集群。选择 **省略号 > 编辑**。
1. 点开**集群选项**。
1. 从 **Kubernetes 版本**下拉菜单中，选择要用于集群的 Kubernetes 版本。
1. 单击**保存**。

**结果：** 集群开始升级 Kubernetes 版本。

## 滚回 Kubernetes 版本

_自 v2.4 起可用_

可以使用备份将集群还原到先前的状态，并使用之前的 Kubernetes 版本。有关更多信息，请参阅以下部分：

- [备份集群](/docs/rancher2.5/cluster-admin/backing-up-etcd/_index)
- [从备份恢复集群](/docs/rancher2.5/cluster-admin/restoring-etcd/_index)

> Rancher v2.4.0 之前的版本中，需要编辑 YAML 才能回滚 Kubernetes 版本。

## 配置升级策略

从 RKE v1.1.0 开始，升级功能加入了一些新选项，您可以控制升级过程的一些细节，例如，您可以配置最大不可用工作节点数量、先驱散节点再升级集群、保证升级期间应用的可用性、配置升级策略等。如果满足某些[条件和要求](/docs/rke/upgrades/maintaining-availability/_index)，则可以使用这些选项在集群升级期间保障集群的 Kubernetes 组件和业务应用的可用性。

可以在 Rancher UI 中通过表单来配置升级策略，也可以通过编辑`cluster.yml`来配置。通过编辑`cluster.yml`，可以使用更多高级选项。

### 在 Rancher UI 中配置最大不可用工作节点数量

从 Rancher UI 中，可以配置最大不可用工作节点的数量。在集群升级过程中，将按此大小批量升级工作节点。

默认情况下，最大不可用工作节点数为所有工作节点的 10％。可以通过百分比或整数的形式配置最大不可用工作节点数。当定义为百分比时，批量处理的节点数会四舍五入到最接近的节点，但最小值不会小于 1。

1. 转到 Rancher UI 中的集群视图。
1. 单击**省略号>编辑**。
1. 在**高级选项**部分中，转到**最大不可用工作节点数**字段。输入批量升级的工作节点的百分比。（可选）从下拉菜单中选择**数量**，然后输入最大不可用工作节点的整数。
1. 单击**保存**。

**结果：** 集群已更新为使用新的升级策略。

### 先驱散节点再升级集群

默认情况下，在升级每个节点之前，RKE 会[暂停（cordons）](https://kubernetes.io/docs/concepts/architecture/nodes/#manual-node-administration)节点。默认情况下，不会对节点进行[驱散（drain）](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/)。如果在集群配置中启用了驱散功能，则 RKE 将在升级节点之前暂停并驱散节点。

1. 转到 Rancher UI 中的集群视图。
1. 单击**省略号>编辑**。
1. 在**高级选项**部分中，转到**驱散**字段，然后单击**是**。
1. 选择安全或激进的驱散选项。有关每个选项的更多信息，请参考[本节](/docs/rancher2.5/cluster-admin/nodes/_index)。
1. （可选）配置优雅停止时长。优雅停止时长是分配给每个 Pod 进行清理的超时时间，因此 Pod 将有机会优雅地退出。Pod 可能需要完成所有未完成的请求，回滚事务或将状态保存到某些外部存储。如果此值为负数，则将使用每个 Pod 中自己定义的优雅停止时长。
1. （可选）配置超时，该超时是驱散节点的最长的等待的时间。超过这个时间后，即使无法完成驱散节点，也将对节点进行升级。
1. 单击**保存**。

**结果：** 集群已更新为使用新的升级策略。

> **注意：** 从 Rancher v2.4.0 开始，存在一个[已知问题](https://github.com/rancher/rancher/issues/25478)，Rancher UI 将不会显示 etcd 节点和控制面节点被驱散了的状态，即使它们已被成功驱散了。

### 在升级期间保证应用的可用性

_自 RKE v1.1.0 起可用_

在 [RKE 文档](/docs/rke/upgrades/maintaining-availability/_index) 中，您将了解在升级集群时，为防止应用宕机的要求。

### 在 cluster.yml 中配置升级策略

通过编辑`cluster.yml`，可以使用更多高级升级策略配置选项。

有关详细信息，请参阅 RKE 文档中的[配置升级策略](/docs/rke/upgrades/configuring-strategy/_index)。其中也包括了用于配置升级策略的`cluster.yml`示例。

## 故障排查

如果节点在升级后没有出现，则`rke up`命令会报错。

如果升级前，不可用节点的数量超过了配置的最大不可用数量，则不会开始进行升级。

如果升级停止了，则可能需要修复不可用的节点或将其从集群中删除，然后才能继续升级。

发生故障的节点可能处于许多不同的状态：

- 关机
- 不可用
- 升级过程中，用户清理了节点，因此节点上没有 kubelet
- 升级本身失败

如果在升级过程中达到不可用节点的数量达到了设置的最大不可用节点数，则 Rancher 中的下游集群将停留在`Updating`状态，并且不会继续升级任何其他 controlplane 节点。它将继续评估不可用节点集，以防其中一个节点变得可用。如果无法修复该节点，必须删除该节点才能继续升级。
