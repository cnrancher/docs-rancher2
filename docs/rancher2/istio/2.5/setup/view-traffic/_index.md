---
title: 查看 Istio 管理的流量
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

## 概述

本节介绍如何查看 Istio 管理的流量。

## Kiali 流量图

Istio overpage 提供了一个到 Kiali 仪表板的链接。从 Kiali 仪表板，你能够查看每个命名空间的图形。Kiali 图提供了一种强大的方式来可视化你的 Istio 服务网格的拓扑结构。它向您展示了哪些服务相互之间的通信。

## 前提条件

要使流量显示在图表中，请确保在集群中安装了 prometheus。Rancher-istio 安装的 Kiali 默认配置为与 rancher-monitoring 图表一起工作。您可以使用 rancher-monitoring 或安装自己的监控解决方案。可选：您可以通过设置[选择器和刮取配置]({{<baseurl>}}/rancher/v2.x/en/istio/setup/enable-istio-in-cluster/#selectors-scrape-configs)选项来改变数据刮取方式的配置。

## 操作步骤

1. 从**集群资源管理器**，从导航下拉菜单中选择**Istio**。
1. 点击 Istio **Overview**页面上的**Kiali**链接。
1. 点击侧面导航中的**图**。
1. 在**命名空间**下拉菜单中更改命名空间，查看各命名空间的流量。

如果你多次刷新 BookInfo 应用程序的 URL，你应该能够在 Kiali 图上看到绿色箭头，显示 "reviews "服务的 "v1 "和 "v3 "的流量。图形右侧的控制面板可让您配置细节，包括最近的流量应在图形上显示多少分钟。

对于其他工具和可视化，您可以从**监测** **概览**页面进入 Grafana，和 Prometheus 仪表盘。
