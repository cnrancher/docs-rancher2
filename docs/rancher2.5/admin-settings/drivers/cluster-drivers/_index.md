---
title: 集群驱动
description: 集群驱动用于创建托管的 Kubernetes 集群(例如 Google GKE)。在创建集群时显示哪个供应商的可用性是根据集群驱动的状态决定的。在创建托管 Kubernetes 集群的选项中，UI 仅显示集群驱动状态为`Active`的选项。默认情况下，Rancher 与几个现有的集群驱动打包在一起，但是您也可以创建自定义集群驱动，并添加到 Rancher 中。如果不想将特定的集群驱动显示给用户，则可以在 Rancher 中停用这些集群驱动，它们将不会作为创建集群的选项出现。
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
  - 系统管理员指南
  - 驱动管理
  - 驱动介绍
  - 集群驱动
---

_自 v2.2.0 起可用_

集群驱动用于创建[托管的 Kubernetes 集群](/docs/rancher2/cluster-provisioning/hosted-kubernetes-clusters/_index)(例如 Google GKE)。在创建集群时显示哪个供应商的可用性是根据集群驱动的状态决定的。在创建托管 Kubernetes 集群的选项中，UI 仅显示集群驱动状态为`Active`的选项。默认情况下，Rancher 与几个现有的集群驱动打包在一起，但是您也可以创建自定义集群驱动，并添加到 Rancher 中。

如果不想将特定的集群驱动显示给用户，则可以在 Rancher 中停用这些集群驱动，它们将不会作为创建集群的选项出现。

## 先决条件

- 拥有[系统管理员权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)。
- 分配了[管理集群驱动](/docs/rancher2/admin-settings/rbac/global-permissions/_index)角色的[自定义全局权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)。

## 激活/停用集群驱动

默认情况下，Rancher 仅激活最流行的云供应商，Google GKE，Amazon EKS 和 Azure AKS 的驱动。如果要显示或隐藏任何集群驱动，则可以更改其状态。

1. 从**全局**视图中，在导航栏中选择**工具>驱动**。

2. 在**驱动**页面上，选择**集群驱动**选项卡。

3. 选择要**激活**或**禁用**的驱动，然后单击适当的图标。

## 添加自定义集群驱动

如果要使用 Rancher 不支持的集群驱动，您可以添加供应商的驱动，以便开始使用它们来创建**托管的** Kubernetes 集群。

1. 从**全局**视图中，在导航栏中选择**工具>驱动**。

2. 从**驱动**页面中，选择**集群驱动**选项卡。

3. 单击**添加集群驱动**。

4. 完成**添加集群驱动**表格。然后单击**创建**。

## 开发自己的集群驱动

为了开发集群驱动以添加到 Rancher，请参阅我们的[示例](https://github.com/rancher-plugins/kontainer-engine-driver-example)。
