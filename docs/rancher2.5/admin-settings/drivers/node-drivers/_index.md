---
title: 节点驱动
description: 节点驱动用于创建节点，Rancher 可以用这些节点启动和管理 Kubernetes 集群。节点驱动就是Docker Machine。在创建集群时显示哪个供应商的可用性是根据节点驱动的状态决定的。在创建供应商提供节点的 Kubernetes 集群的选项中，UI 仅显示节点驱动状态为`Active`的选项。默认情况下，Rancher 内置了许多现有的 Docker Machine 驱动，但是您也可以创建自定义节点驱动，并添加到 Rancher 中。
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
  - 节点驱动
---

节点驱动用于创建节点，Rancher 可以用这些节点启动和管理 Kubernetes 集群。节点驱动就是[Docker Machine](https://docs.docker.com/machine/drivers/)。在创建集群时显示哪个供应商的可用性是根据节点驱动的状态决定的。在创建供应商提供节点的 Kubernetes 集群的选项中，UI 仅显示节点驱动状态为`Active`的选项。默认情况下，Rancher 内置了许多现有的 Docker Machine 驱动，但是您也可以创建自定义节点驱动，并添加到 Rancher 中。

如果不想将特定的节点驱动显示给用户，则可以在 Rancher 中停用这些节点驱动，它们将不会作为创建集群的选项出现。

## 先决条件

- 拥有[系统管理员权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)
- 分配了[管理节点驱动](/docs/rancher2/admin-settings/rbac/global-permissions/_index)角色的[自定义全局权限](/docs/rancher2/admin-settings/rbac/global-permissions/_index)。

## 激活/停用节点驱动

默认情况下，Rancher 仅激活最受欢迎的云提供商，Amazon EC2，Azure，DigitalOcean 和 vSphere 的驱动。如果要显示或隐藏任何节点驱动，则可以更改其状态。

1. 从**全局**视图中，在导航栏中选择**工具>驱动**。在**驱动**页面上，选择**节点驱动**选项卡。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**节点驱动**。

2. 选择要**激活**或**停用**的驱动，然后单击适当的图标。

## 添加自定义节点驱动

如果要使用 Rancher 不支持的节点驱动，则可以添加该供应商的驱动，以便开始使用它们来为 Kubernetes 集群创建节点模板并最终创建节点池。

1. 从**全局**视图中，在导航栏中选择**工具>驱动**。在**驱动**页面上，选择**节点驱动**选项卡。在 v2.2.0 之前的版本中，您可以直接在导航栏中选择**节点驱动**。

2. 单击**添加节点驱动**。

3. 完成**添加节点驱动**表格。然后单击**创建**。

## 开发自己的节点驱动

节点驱动是通过 [Docker Machine](https://docs.docker.com/machine/) 实现的。您可以编写自己的 Docker Machine 然后添加到 Rancher 中。
