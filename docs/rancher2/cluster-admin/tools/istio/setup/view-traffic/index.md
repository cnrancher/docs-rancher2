---
title: 7、产生并查看流量
description: 本节介绍如何查看由 Istio 管理的流量。Rancher 将 Kiali 图集成到 Rancher UI 中。Kiali 图提供了一种强大的方式来可视化 Istio 服务网格的拓扑。它向您显示哪些服务相互通信。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - Istio使用指南
  - 产生并查看流量
---

本节介绍如何查看由 Istio 管理的流量。

## Kiali 流量图

Rancher 将 Kiali 图集成到 Rancher UI 中，Kiali 图提供了一种强大的方式来可视化 Istio 服务网格的拓扑，显示了服务之间相互通信的管道。

请按照以下操作步骤，查看流量图：

1. 在 Rancher 的项目视图中，单击**资源 > Istio**。
1. 转到**流量图**标签页。此标签页将 Kiali 网络可视化集成到 UI 中。

如果您多次刷新 BookInfo 应用程序的 URL，您应该能够在 Kiali 图上看到绿色箭头，其中显示了到`reviews`服务的`v1`和`v3`的访问量。Chart 右侧的控制面板可让您配置详细信息，包括应在 Chart 上显示多少分钟的最新流量。

要获得其他工具和可视化效果，您可以通过单击页面右上角的 Kiali、Jaeger、Grafana 或 Prometheus，进入它们的界面，查看对应的可视化效果。

## 查看流量指标

Istio 的监控功能使您可以查看所有服务的性能。

1. 在 Rancher 的项目视图中，单击**资源 > Istio**。
1. 转到**流量指标**标签页。在集群中生成流量之后，您应该能够看到**成功率、请求量、4xx 响应计数、项目 5xx 响应计数**和**请求持续时间**等指标。
