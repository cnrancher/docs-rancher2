---
title: 使用备份恢复集群
weight: 2050
---

你可以轻松备份和恢复 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)的 etcd。etcd 数据库的快照会保存在 etcd 节点或 S3 兼容目标上。配置 S3 的好处是，如果所有 etcd 节点都丢失了，你的快照会保存到远端并能用于恢复集群。

Rancher 建议启用 [etcd 定期快照的功能]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/backing-up-etcd/#configuring-recurring-snapshots)，但你也可以轻松创建[一次性快照]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/backing-up-etcd/#one-time-snapshots)。Rancher 允许使用[保存的快照](#restoring-a-cluster-from-a-snapshot)进行恢复。如果你没有任何快照，你仍然可以[恢复 etcd](#recovering-etcd-without-a-snapshot)。

集群也可以恢复到之前的 Kubernetes 版本和集群配置。

本节涵盖以下主题：

- [查看可用快照](#viewing-available-snapshots)
- [使用快照恢复集群](#restoring-a-cluster-from-a-snapshot)
- [在没有快照的情况下恢复 etcd](#recovering-etcd-without-a-snapshot)
- [为使用 Rancher v2.2.0 之前的版本创建的集群启用快照功能](#enabling-snapshot-features-for-clusters-created-before-rancher-v2-2-0)

## 查看可用快照

Rancher UI 中提供了集群所有可用快照的列表：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，转到要查看快照的集群并点击集群名称。
1. 单击**快照**选项卡。列出的快照包括创建时间的时间戳。

## 使用快照恢复集群

如果你的 Kubernetes 集群已损坏，你可以使用快照来恢复集群。

快照由 etcd 中的集群数据、Kubernetes 版本和 `cluster.yml` 中的集群配置组成。有了这些组件，你可以在使用快照恢复集群时选择：

- **仅恢复 etcd 内容**：类似于在 Rancher v2.4.0 之前版本中的使用快照恢复。
- **恢复 etcd 和 Kubernetes 版本**：如果 Kubernetes 升级导致集群失败，并且你没有更改任何集群配置，则应使用此选项。
- **恢复 etcd、Kubernetes 版本和集群配置**：如果你在升级时同时更改了 Kubernetes 版本和集群配置，则应使用此选项。

回滚到之前的 Kubernetes 版本时，[升级策略选项]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes/#configuring-the-upgrade-strategy)会被忽略。在恢复到旧 Kubernetes 版本之前，Worker 节点不会被封锁或清空，因此可以更快地将不健康的集群恢复到健康状态。

> **先决条件**：要恢复 S3 中的快照，需要将集群配置为[在 S3 上创建定期快照]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/backing-up-etcd/#configuring-recurring-snapshots)。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面中，转到要查看快照的集群并点击集群名称。
1. 单击**快照**选项卡来查看已保存快照的列表。
1. 转到要恢复的快照，然后单击 **⋮ > 还原快照**。
1. 点击**还原**。

**结果**：集群将进入 `updating` 状态，然后将开始使用快照恢复 `etcd` 节点。集群会在返回到 `active` 状态后被恢复。

## 在没有快照的情况下恢复 etcd

如果 etcd 节点组失去了仲裁（quorum），由于没有操作（例如部署工作负载）可以在 Kubernetes 集群中执行，Kubernetes 集群将报告失败。集群需要有三个 etcd 节点以防止仲裁丢失。如果你想恢复你的 etcd 节点集，请按照以下说明操作：

1. 通过删除所有其他 etcd 节点，从而仅在集群中保留一个 etcd 节点。

2. 在剩余的单个 etcd 节点上，运行以下命令：

   ```
   $ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock assaflavie/runlike etcd
   ```

   此命令会输出 etcd 要运行的命令，请保存此命令以备后用。

3. 停止你在上一步中启动的 etcd 容器，并将其重命名为 `etcd-old`：

   ```
   $ docker stop etcd
   $ docker rename etcd etcd-old
   ```

4. 修改步骤 2 中获取保存的命令：

   - 如果你最初有超过 1 个 etcd 节点，则将 `--initial-cluster` 更改为仅包含剩余的单个节点。
   - 将 `--force-new-cluster` 添加到命令的末尾。

5. 运行修改后的命令。

6. 在单个节点启动并运行后，Rancher 建议向你的集群添加额外的 etcd 节点。如果你有一个[自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes)，并且想要复用旧节点，则需要先[清理节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cleaning-cluster-nodes/)，然后再尝试将它们重新添加到集群中。

## 为使用 Rancher v2.2.0 之前的版本创建的集群启用快照功能

如果你有使用 v2.2.0 之前版本创建的 Rancher 启动的 Kubernetes 集群，升级 Rancher 后，你必须[编辑集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/)并 _保存_ 它，以启用更新的快照功能。即使你已经在 v2.2.0 之前创建了快照，你也必须执行此步骤，因为旧的快照将无法用于[通过 UI 备份和恢复 etcd]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/restoring-etcd/)。
