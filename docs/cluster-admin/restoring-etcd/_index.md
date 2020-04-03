---
title: 恢复 etcd
---

_从 v2.2.0 开始可用_

etcd 备份和恢复由[Rancher 启用的 Kubernetes 集群](/docs/cluster-provisioning/rke-clusters/_index)可以很容易地执行。etcd 数据库的快照被获取并保存到本地的 etcd 节点或 S3 兼容的目标上。配置 S3 的优点是，如果所有 etcd 节点都丢失了，您的快照将被远程保存，并可用于恢复集群。

Rancher 建议启用[设置 etcd 重复快照的能力](/docs/cluster-admin/backing-up-etcd/_index)，但是[一次性快照](/docs/cluster-admin/backing-up-etcd/_index)也可以很容易地获取。Rancher 允许从[已保存的快照](#从快照恢复集群)恢复，或者如果您没有任何快照，您仍然可以[恢复 etcd](#在没有快照的情况下恢复-etcd)。

> **注意：** I 如果您有任何 Rancher 启动了 v2.2.0 之前版本创建的 Kubernetes 集群，在升级 Rancher 之后，您必须[编辑集群](/docs/cluster-admin/editing-clusters/_index)并*保存* 它， 以便启用[已更新的快照功能](/docs/cluster-admin/backing-up-etcd/_index)。即使您已经使用 v2.2.0 之前的版本创建了快照，您也必须执行此步骤，因为旧的快照将无法用于通过 UI 备份和恢复 etcd。

## 查看可用的快照

集群中所有可用快照的列表都是可用的。

1. 在 **全局** 视图中，导航到要查看快照的集群。

2. 从导航栏中点击 **工具>快照** 查看保存的快照列表。这些快照包括创建它们的时间戳。

## 从快照恢复集群

如果您的 Kubernetes 集群不可用了，您可以从快照中恢复集群。

1. 在 **全局** 视图中，导航到要查看快照的集群。

2. 点击 **垂直省略号 (...)> 恢复快照**。

3. 从可用快照的下拉菜单中选择要用于恢复集群的快照。点击 **保存**。

   > **注意：** 只有将集群配置为在 S3 上获取重复快照，才能从 S3 恢复快照。

**结果：** 集群将进入 `更新中` 状态，从快照恢复 `etcd` 节点的过程将启动。当集群返回到 `活动` 状态时，它将被恢复。

> **注意：** 如果您正在恢复一个具有不可用 etcd 节点的集群，建议在尝试恢复之前从 Rancher 中删除所有 etcd 节点。对于使用[在基础设施提供商中托管的节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)创建的集群，将自动创建新的 etcd 节点。对于[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)，请确保将新的 etcd 节点添加到集群中。

## 在没有快照的情况下恢复 etcd

如果 etcd 节点组失去 quorum, Kubernetes 集群将报告失败，因为在 Kubernetes 集群中不能执行任何操作，例如部署工作负载。请查看 Kubernetes 集群中的[etcd 节点数量](/docs/cluster-provisioning/production/_index)的最佳实践。如果您想恢复您的 etcd 节点集，请遵循以下说明:

1. 通过删除所有其他 etcd 节点，在集群中只保留一个 etcd 节点。

2. 在剩下的 etcd 节点上，运行以下命令:

   ```
   $ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock assaflavie/runlike etcd
   ```

   此命令输出 etcd 的运行命令，保存此命令供以后使用。

3. 停止上一步启动的 etcd 容器，将其重命名为 `etcd-old`。

   ```
   $ docker stop etcd
   $ docker rename etcd etcd-old
   ```

4. 使用步骤 2 中保存的命令并修改它:

   - 如果您最初拥有一个以上的 etcd 节点，那么您需要将 `--initial-cluster` 更改为只包含剩余的节点。
   - 在命令末尾添加`--force-new-cluster` 。

5. 运行修改后的命令。

6. 在单个节点启动并运行之后，Rancher 建议向集群添加额外的 etcd 节点。如果您有一个[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)并且希望重用旧节点，则需要在尝试将它们重新添加回集群之前[清理节点](/docs/cluster-admin/cleaning-cluster-nodes/_index)。
