---
title: 升级 Kubernetes 版本
---

> **先决条件：**以下选项仅对 [使用 RKE 启动的](/docs/cluster-provisioning/rke-clusters/_index)集群可用。

升级到最新版本的 Rancher 之后，您可以更新现有集群以使用最新支持的 Kubernetes 版本。

在新版本的 Rancher 发布之前，它会与 Kubernetes 的最新小版本进行测试，以确保兼容性。例如，Rancher v2.3.0 使用 Kubernetes v1.15.4、v1.14.7 和 v1.13.11 进行了测试。有关在每个 Rancher 版本上测试的 Kubernetes 版本的详细信息，请参阅 [支持维护条款](https://rancher.com/support-maintenance-terms/all-supported-versions/rancher-v2.3.0/)。

从 Rancher v2.3.0 开始，添加了 Kubernetes 元数据功能，允许 Rancher 在不升级 Rancher 的情况下发布 Kubernetes 补丁版本。有关详细信息，请参阅 [Kubernetes metadata 部分](/docs/admin-settings/k8s-metadata/_index)。

> **建议：** 在升级 Kubernetes 之前， [备份您的集群](/docs/backups/_index)。

1. 在 **Global** 视图中，找到要为其升级 Kubernetes 的集群。选择 **垂直省略号 (...) > 编辑**。

1. 展开 **集群选项**。

1. 从 **Kubernetes 版本** 下拉列表中，选择您希望用于集群的 Kubernetes 版本。

1. 点击 **保存**。

**结果：** Kubernetes 开始为集群升级。在升级期间，您的集群将不可用。
