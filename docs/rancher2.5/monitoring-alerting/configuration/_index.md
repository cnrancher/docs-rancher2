---
title: 配置介绍
description: 本文讲述了一些配置监控的自定义资源时使用到的重要配置选项，如配置 Prometheus、为通知添加 CA 证书和配置拉取参数，并且提供了示例代码。
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
  - 监控和告警
  - 配置
---

本页讲述了在 Rancher UI 中配置监控 V2 版本的一些最重要选项。

有关为 Prometheus 配置自定义拉取目标和规则的信息，请参考 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator)。一些最重要的自定义资源在 Prometheus Operator [设计文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md)中进行了说明。Prometheus Operator 文档也可以帮助您设置 RBAC、Thanos 或自定义配置。

## 设置资源限制和请求

在安装 `rancher-monitoring` 时，可以配置监控应用程序的资源请求和限制。有关默认限制的更多信息，请参阅[此页面](/docs/rancher2.5/monitoring-alerting/configuration/helm-chart-options/_index#配置资源限制和请求)

> **注意：**在空闲的集群上，与监控 V1 相比，监控 V2 的 CPU 使用率明显更高（高达 70%）。为了提高性能并获得与监控 V1 类似的结果，请关闭 Prometheus adapter。

## Prometheus 配置

通常没必要直接编辑 Prometheus 的自定义资源。

相反，要配置 Prometheus 抓取自定义指标，你只需要创建一个新的 ServiceMonitor 或 PodMonitor 来配置 Prometheus 抓取其他指标。

### ServiceMonitor 和 PodMonitor 配置

详情请参阅[此页面。](./servicemonitor-podmonitor/_index)

### Prometheus 高级配置

关于直接编辑 Prometheus 自定义资源的更多信息，请参阅[此页面](./advanced/prometheus/_index)，这在高级场景中可能会有所帮助。

## Alertmanager 配置

Alertmanager 的自定义资源通常不需要直接编辑。对于大多数常见的场景，你可以通过更新 Routes 和 Receivers 来管理告警。

路由和接收器是 alertmanager 自定义资源的配置的一部分。在 Rancher UI 中，路由和接收器不是真正的自定义资源，而是伪自定义资源，Prometheus Operator 使用它来将你的配置与 Alertmanager 自定义资源同步。当路由和接收器被更新时，监控应用程序将自动更新 Alertmanager 以反映这些变化。

对于一些高级场景，你可能想直接配置 alertmanager。要了解更多信息，请参阅[此页](./advanced/alertmanager/_index)

### 接收器

接收器是用来设置通知的。关于如何配置接收器的细节，请参阅[此页](./receiver/_index)。

### 路由

路由会在通知到达接收者之前过滤它们。每个路由都需要指向一个已经配置好的接收器。关于如何配置路由的细节，请参阅[此页](./route/_index)。

### 高级

关于直接编辑 Alertmanager 自定义资源的更多信息，这在高级场景中可能是有帮助的，请参阅[此页](./advanced/alertmanager/_index)
