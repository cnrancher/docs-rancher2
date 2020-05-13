---
title: 3. 选择部署 Istio 组件的节点
description: 您的集群需要一个可以为 Istio 指定的 worker 节点。Worker 结点应满足资源要求。本节介绍如何使用节点选择器来配置在指定节点上部署 Istio 组件。在较大型的部署中，强烈建议通过为每个 Istio 组件添加节点选择器，将 Istio 的基础结构放置在集群中的专用节点上。
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
  - 告警
  - Istio
  - Istio使用指南
  - 选择部署 Istio 组件的节点
---

> **先决条件：** 您的集群需要一个可以为 Istio 指定的 worker 节点。Worker 结点应满足[资源要求](/docs/cluster-admin/tools/istio/resources/_index)。

在较大型的部署中，我们建议通过为每个 Istio 组件添加节点选择器，将 Istio 的基础结构放置在集群中的专用节点上。

## 给 Istio 节点添加标签

首先，向应该部署 Istio 组件的节点添加标签。此标签可以是任意键值对。在这个例子中，我们将使用键`istio`和值`enabled`。

1. 在集群视图中，转到**节点**标签页。
1. 找到用来运行 Istio 组件的工作节点，单击**省略号 (...) > 编辑**。
1. 展开**标签/注释**部分。
1. 单击**添加标签**。
1. 在输入框中输入`istio`作为键，并输入`enabled`作为值。
1. 单击**保存**。

**结果：** 一个 worker 节点拥有对应的标签，使其后续作为指定的节点用于 Istio 组件的部署。

## 配置 Istio 组件以使用带标签的节点

配置每个 Istio 组件以使用 Istio 标签将其部署到节点。每个 Istio 组件都可以单独配置，但是在本教程中，为简单起见，我们将所有组件配置为在同一节点上调度。

对于较大型的部署，建议将 Istio 的每个组件调度到单独的节点上。

1. 在集群视图中，单击**工具 > Istio**。
1. 展开**Pilot**部分并在出现的表单中单击**添加选择器**。输入您添加到 Istio 节点的节点标签。在本例中，我们使用键`istio`和值`enabled`。
1. 对**Mixer**和**Tracing**部分重复上述步骤。
1. 单击**保存**。

**结果：** Istio 组件将部署在指定的节点上。

## 后续操作

[添加部署和服务](/docs/cluster-admin/tools/istio/setup/deploy-workloads/_index)
