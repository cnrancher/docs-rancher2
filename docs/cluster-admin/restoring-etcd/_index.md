---
title: 恢复集群
description: 在 RKE 集群中可以很容易地执行 etcd 备份和恢复。etcd 数据库的快照被获取并保存到本地的 etcd 节点或 S3 兼容的目标上。配置 S3 的优点是，即使所有的 etcd 节点都丢失了，因为您的快照保存在远程，您仍然可以用它来恢复集群。
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
  - 集群管理员指南
  - 集群访问控制
  - 恢复集群
---

_从 v2.2.0 开始可用_

在 [RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)中可以很容易地执行 etcd 备份和恢复。etcd 数据库的快照被获取并保存到本地的 etcd 节点或 S3 兼容的目标上。配置 S3 的优点是，即使所有的 etcd 节点都丢失了，因为您的快照保存在远程，您仍然可以用它来恢复集群。

Rancher 建议启用[对 etcd 进行定期快照的功能](/docs/cluster-admin/backing-up-etcd/_index)，但是您也可以轻松的进行[一次性快照](/docs/cluster-admin/backing-up-etcd/_index)。Rancher 允许从[已保存的快照](#从快照恢复集群)恢复，或者如果您没有任何快照，您仍然可以[恢复 etcd](#在没有快照的情况下恢复-etcd)。

从 Rancher v2.4.0 开始，您还可以还原集群的 Kubernetes 版本和集群配置。

## 查看可用的快照

在 Rancher UI 中，您可以查看所有可用快照的列表。

1. 在 **全局** 视图中，导航到要查看快照的集群。

2. 从导航栏中点击 **工具 > 快照** 查看保存的快照列表。这些快照包括创建它们的时间戳。

## 从快照中恢复集群

如果您的 Kubernetes 集群已损坏，您可以从快照中还原该集群。

在 Rancher v2.4.0 中恢复的功能有所变化。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.4.0+', value: 'new', },
{ label: 'Rancher v2.4.0 之前的版本', value: 'old', },
]}>

<TabItem value="new">

快照由 etcd 中的集群数据，Kubernetes 版本和`cluster.yml`形式的集群配置组成。有了这些快照中的组件，您可以选择如何从快照中恢复集群：

- **仅恢复 etcd 中的集群数据：** 此还原类似于在 v2.4.0 之前的 Rancher 中还原快照。
- **恢复 etcd 和 Kubernetes 版本：** 如果由于升级 Kubernetes 版本导致集群出现故障，并且您尚未进行任何集群配置更改，则应使用此选项。
- **恢复 etcd，Kubernetes 版本和集群配置：** 如果在升级时同时更改了 Kubernetes 版本和集群配置，则应使用此选项。

回滚到 Kubernetes 之前的版本时，[升级策略选项](/docs/cluster-admin/upgrading-kubernetes/_index)是将不会生效。在将工作节点恢复到较早的 Kubernetes 版本之前，不会对其进行**暂停（Cordon）**或**驱散（Drain）**，这是为了尽快将运行状况不佳的集群恢复到健康状态。

> **先决条件：** 要从 S3 恢复快照，需要将集群配置为[在 S3 上进行定期快照](/docs/cluster-admin/backing-up-etcd/_index)。

1. 在 **全局** 视图中，导航到要恢复的集群。

2. 点击 **垂直省略号 (...)> 恢复**。

3. 从可用快照的下拉菜单中选择要用于恢复集群的快照。

4. 在**恢复类型**字段中，选择上述恢复方式之一。

5. 点击**保存**。

**结果：** 集群将进入`Updating`状态，从快照恢复`etcd`节点的过程将启动。当集群回到`active`状态时，表示集群已经被恢复了。

</TabItem>

<TabItem value="old">

> **先决条件：**
>
> - 确保您的 etcd 节点运行状况良好。如果要还原的集群中的 etcd 节点不可用，建议在尝试还原之前从 Rancher 中删除所有 etcd 节点。如果您使用的是通过节点池[在基础设施中创建节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)的集群，那么新的 etcd 节点将自动创建。对于[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)，请确保将新的 etcd 节点添加到集群。
> - 要从 S3 恢复快照，需要将集群配置为[在 S3 上进行定期快照](/docs/cluster-admin/backing-up-etcd/_index)

1. 在 **全局** 视图中，导航到要恢复的集群。

2. 点击 **垂直省略号 (...) > 恢复**。

3. 从可用快照的下拉菜单中选择要用于恢复集群的快照。

4. 点击 **保存**。

**结果：** 集群将进入`Updating`状态，从快照恢复`etcd`节点的过程将启动。当集群回到`active`状态时，表示集群已经被恢复了。

</TabItem>

</Tabs>

## 在没有快照的情况下恢复 etcd

如果 etcd 节点组失去 quorum，Kubernetes 集群将报告失败，因为在 Kubernetes 集群中不能执行任何操作，例如部署工作负载。请查看 Kubernetes 集群中的[etcd 节点数量](/docs/cluster-provisioning/production/_index)的最佳实践。如果您想恢复您的 etcd 节点集，请遵循以下说明:

1. 通过删除所有其他 etcd 节点，在集群中只保留一个 etcd 节点。

2. 在剩下的 etcd 节点上，运行以下命令:

   ```bash
   $ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock assaflavie/runlike etcd
   ```

   此命令输出 etcd 的运行命令，保存此命令供以后使用。

3. 停止上一步启动的 etcd 容器，将其重命名为 `etcd-old`。

   ```bash
   $ docker stop etcd
   $ docker rename etcd etcd-old
   ```

4. 使用步骤 2 中保存的命令并修改它:

   - 如果您最初拥有一个以上的 etcd 节点，那么您需要将 `--initial-cluster` 更改为只包含剩余的节点。
   - 在命令末尾添加`--force-new-cluster` 。

5. 运行修改后的命令。

6. 在单个节点启动并运行之后，Rancher 建议向集群添加额外的 etcd 节点。如果您有一个[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)并且希望重用旧节点，则需要在尝试将它们重新添加回集群之前[清理节点](/docs/cluster-admin/cleaning-cluster-nodes/_index)。

## 在 Rancher v2.2.0 之前的版本中创建的集群里启用定期快照

如果您有任何在 v2.2.0 之前创建的 Rancher 启动的 Kubernetes 集群（RKE 集群），在升级 Rancher 之后，您必须[编辑集群](/docs/cluster-admin/editing-clusters/_index)并且**保存**它，以启用更新的快照功能。即使您已经在 v2.2.0 之前创建了快照，也必须执行此步骤，因为在[通过 UI 还原集群](/docs/cluster-admin/restoring-etcd/_index)时，无法使用较早版本中创建的快照。
/docs/cluster-admin/editing-clusters/\_index
