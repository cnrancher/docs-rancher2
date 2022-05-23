---
title: 6. 生成和查看流量
weight: 7
---

本文介绍如何查看 Istio 管理的流量。

## Kiali 流量图

Istio 概览页面提供了 Kiali 仪表板的链接。在 Kiali 仪表板中，你可以查看每个命名空间的图。Kiali 图提供了一种强大的方式来可视化 Istio 服务网格的拓扑。它显示了服务之间相互通信的情况。

> **先决条件**：要显示流量图，请确保你在集群中安装了 Prometheus。Rancher-istio 安装了默认配置的 Kiali 来与 rancher-monitoring Chart 一起工作。你可以使用 rancher-monitoring 或安装自己的监控解决方案。你也可以通过设置[选择器 & 抓取配置]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/selectors-and-scrape)选项来更改数据抓取的配置（可选）。

要查看流量图：

1. 在安装了 Istio 的集群中，点击左侧导航栏中的 **Istio**。
1. 单击 **Kiali** 链接。
1. 单击侧导航中的**图**。
1. 在**命名空间**下拉列表中，更改命名空间以查看每个命名空间的流量。

如果你多次刷新 BookInfo 应用的 URL，你将能够在 Kiali 图上看到绿色箭头，显示 `reviews` 服务 `v1` 和 `v3` 的流量。图右侧的控制面板可用于配置详细信息，包括应在图上显示多少分钟的最新流量。

对于其他工具和可视化，你可以从**监控** > **概览**页面转到 Grafana 和 Prometheus 仪表板。
