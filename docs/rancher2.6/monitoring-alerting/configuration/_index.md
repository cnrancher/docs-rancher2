---
title: 配置
weight: 5
---

本文介绍在 Rancher UI 中配置 Monitoring V2 的一些最重要选项。

有关为 Prometheus 配置自定义抓取目标和规则的信息，请参阅 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 的上游文档。Prometheus Operator [设计文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md)中解释了一些最重要的自定义资源。Prometheus Operator 文档还可以帮助你设置 RBAC、Thanos 或进行自定义配置。

# 设置资源限制和请求

安装 `rancher-monitoring` 时可以配置 Monitoring 应用的资源请求和限制。有关默认限制的更多信息，请参阅[此页面](./helm-chart-options/#configuring-resource-limits-and-requests)。

> **注意**：在空闲集群上，Monitoring V2 的 CPU 使用率（高达 70%）比 Monitoring V1 显著更高。要提高性能并获得与 Monitoring V1 类似的结果，请关闭 Prometheus Adapter。

# Prometheus 配置

通常不需要直接编辑 Prometheus 自定义资源。

相反，要让 Prometheus 抓取自定义指标，你只需创建一个新的 ServiceMonitor 或 PodMonitor 来将 Prometheus 配置为抓取其他指标。


### ServiceMonitor 和 PodMonitor 配置

有关详细信息，请参阅[此页面](./servicemonitor-podmonitor)。

### 高级 Prometheus 配置

有关直接编辑 Prometheus 自定义资源（对高级用例可能有帮助）的更多信息，请参阅[此页面](./advanced/prometheus)。

# Alertmanager 配置

Alertmanager 自定义资源通常不需要直接编辑。在常见用例中，你可以通过更新路由和接收器来管理告警。

路由和接收器是 Alertmanager 自定义资源配置的一部分。在 Rancher UI 中，路由（Route）和接收器（Receiver）并不是真正的自定义资源，而是 Prometheus Operator 用来将你的配置与 Alertmanager 自定义资源同步的伪自定义资源。当路由和接收器更新时，Monitoring 应用将自动更新 Alertmanager 来反映这些更改。

对于一些高级用例，你可能需要直接配置 Alertmanager。有关详细信息，请参阅[此页面](./advanced/alertmanager)。

### 接收器

接收器（Receiver）用于设置通知。有关如何配置接收器的详细信息，请参阅[此页面](./receiver)。
### 路由

路由（Route）在通知到达接收器之前过滤它们。每条路由都需要引用一个已经配置好的接收器。有关如何配置路由的详细信息，请参阅[此页面](./route)。

### 高级配置

有关直接编辑 Alertmanager 自定义资源（对高级用例可能有帮助）的更多信息，请参阅[此页面](./advanced/alertmanager)。