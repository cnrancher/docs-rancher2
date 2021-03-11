---
title: 查看 Istio 管理的流量
description: 本节介绍如何查看 Istio 管理的流量。
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
  - rancher 2.5
  - Istio
  - 配置 Istio
  - 查看 Istio 管理的流量
---

## 概述

本节介绍如何查看 Istio 管理的流量。

## Kiali 流量图

Istio 概览页提供了一个到 Kiali 仪表盘的链接。您可以通过 Kiali 仪表盘查看每个命名空间对应的 Chart。Kiali 提供了一种强大的方式来可视化你的 Istio 服务网格的拓扑结构。它向您展示了服务相互之间的通信和流量。

## 前提条件

要使流量显示在 Chart 中，请确保在集群中安装了 prometheus。Rancher-istio 安装的 Kiali 默认配置为与 rancher-monitoring Chart 一起工作。您可以使用 rancher-monitoring 或安装自己的监控解决方案。

可选：您可以通过设置[选择器和拉取配置](/docs/rancher2.5/istio/2.5/configuration-reference/selectors-and-scrape/_index)选项来改变数据拉取方式的配置。

## 操作步骤

1. 从**集群资源管理器**，从导航下拉菜单中选择**Istio**。
1. 单击 Istio **Overview**页面上的**Kiali**链接。
1. 单击侧面导航中的**Graph**。
1. 在**命名空间**下拉菜单中更改命名空间，查看各命名空间的流量。

如果你多次刷新 BookInfo 应用程序的 URL，你应该能够在 Kiali 图上看到绿色箭头，显示 `review`服务的`v1`和`v3`的流量。Chart 右侧的控制面板可让您配置细节，包括最近的流量应在图形上显示多少分钟。

对于其他工具和可视化，您可以进入**监控** > **概览**页面，查看 Grafana 和 Prometheus 仪表盘。
