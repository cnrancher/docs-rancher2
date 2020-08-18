---
title: 通过 Rancher UI 管理 HPA
description: Rancher UI 支持创建，管理和删除 HPA。您可以将 CPU 或内存使用率配置为用于 HPA 自动扩缩容所使用的指标。
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
  - 用户指南
  - Pod 弹性伸缩
  - 通过 Rancher UI 管理 HPA
---

_自 Rancher v2.3.0 起可用_

Rancher UI 支持创建，管理和删除 HPA。您可以将 CPU 或内存使用率配置为用于 HPA 自动扩缩容所使用的指标。

如果要创建可根据 CPU 和内存以外的其他指标进行扩展的 HPA，请参阅[配置 HPA 以使用 Prometheus 的自定义指标进行扩展](/docs/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index)。

## 创建一个 HPA

1. 从**全局**视图中，打开一个项目，将 HPA 部署到此项目中。
1. 单击**资源 > HPA**。
1. 单击**添加 HPA**。
1. 输入 HPA 的**名称**。
1. 为 HPA 选择一个**命名空间**。
1. 选择**工作负载**作为 HPA 的扩展目标。
1. 为 HPA 指定**最小比例**和**最大比例**。
1. 配置 HPA 的指标。您可以选择内存或 CPU 使用率作为度量标准，这将触发 HPA 弹性扩缩容。在**数量**字段中，输入将触发 HPA 扩缩容机制的工作负载内存或 CPU 使用率的百分比。要配置其他 HPA 指标，包括 Prometheus 可用的指标，您需要[使用 kubectl 管理 HPA](/docs/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index)。
1. 单击**创建**以创建 HPA。

> **结果：** HPA 已部署到选定的命名空间。您可以从项目的资源> HPA 视图查看 HPA 的状态。

## 获取 HPA 指标和状态

1. 从**全局**视图中，打开要查看的 HPA 资源所在的项目。
1. 单击**资源 > HPA**。**HPA**选项卡显示当前副本数。
1. 有关特定 HPA 的更多详细指标和状态，请单击 HPA 的名称。将会进入 HPA 详细信息页面。

## 删除 HPA

1. 从**全局**视图中，打开要从中删除 HPA 的项目。
1. 单击**资源> HPA”**。
1. 找到要删除的 HPA。
1. 单击**省略号（...）>删除**。
1. 单击**删除**以确认。

> **结果：** HPA 已从当前集群中删除。
