---
title: 内置 Dashboards
description: Grafana允许你查询、可视化、预警和了解你的指标。
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
  - 内置 Dashboards
---

- [Grafana UI](#grafana-ui)
- [Alertmanager UI](#alertmanager-ui)
- [Prometheus UI](#prometheus-ui)

## Grafana UI

[Grafana](https://grafana.com/grafana/) 允许你查询、可视化、预警和了解你的指标。

要查看时间序列数据可视化的默认仪表盘，请访问 Grafana UI。

### 自定义 Grafana

要查看和自定义支持 Grafana 仪表盘的 PromQL 查询，请参见[本页](/docs/rancher2.5/monitoring-alerting/guides/customize-grafana/_index)

### 持久化 Grafana 仪表盘

要创建一个持久的 Grafana 仪表盘，请参见[本页](/docs/rancher2.5/monitoring-alerting/guides/persist-grafana/_index)

### 访问 Grafana

关于 Grafana 的基于角色的访问控制的信息，见[本节](/docs/rancher2.5/monitoring-alerting/rbac/_index#grafana-的基于角色的访问控制)

## Alertmanager UI

当安装 `rancher-monitoring` 后，将自动部署 Prometheus Alertmanager UI，该 UI 允许你查看你的告警和当前 Alertmanager 配置。

> 本节假设熟悉监控组件如何协同工作。关于 Alertmanager 的更多信息，见[本节。](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/_index#3-alertmanager-如何工作)

### 访问 Alertmanager UI

Alertmanager UI 可以看到最近发生的告警。

> **前提条件：**必须安装 `rancher-monitoring` 应用程序。

要查看 Alertmanager UI ，请进入**集群资源管理器。**在左上角，点击**集群资源管理器>监控。**然后点击**Alertmanager.**

**结果：** Alertmanager UI 在一个新的标签中打开。关于配置的帮助，请参考[官方 Alertmanager 文档。](https://prometheus.io/docs/alerting/latest/alertmanager/)

![Alertmanager UI](/img/rancher/alertmanager-ui.png)

### 查看默认告警

要查看默认触发的告警，请进入 Alertmanager UI 并点击**展开所有组**。

## Prometheus UI

默认情况下，[kube-state-metrics 服务](https://github.com/kubernetes/kube-state-metrics)为监控应用提供了大量关于 CPU 和内存利用率的信息。这些指标涵盖了跨命名空间的 Kubernetes 资源。这意味着，为了看到一个服务的资源指标，你不需要为它创建一个新的 ServiceMonitor。因为数据已经在时间序列数据库中，你可以去 Prometheus UI ，运行 PromQL 查询来获得信息。同样的查询可以用来配置一个 Grafana 仪表盘，以显示这些指标随时间变化的图表。

要使用 Prometheus UI ，请安装 `rancher-monitoring`。然后进入**集群浏览器**。在左上角，点击**集群浏览器>监控**。然后点击**Prometheus 图表**。

Prometheus Graph UI:
![Prometheus Graph UI](/img/rancher/prometheus-graph-ui.png)

### 查看 Prometheus Targets

要查看你正在监控的服务，你需要查看你的 targets。Targets 是由 ServiceMonitors 和 PodMonitors 设置的，作为抓取指标的来源。你不需要直接编辑 targets，但是 Prometheus UI 可以让你看到所有正在被抓取的指标来源的概况。

要查看 Prometheus Targets，请安装 `rancher-monitoring`。然后进入**集群浏览器**。在左上角，点击**集群浏览器>监控**。然后点击**Prometheus Targets**。

Prometheus UI 中的 Targets:
![Prometheus Targets UI](/img/rancher/prometheus-targets-ui.png)

### 查看 PrometheusRules

当你定义一个规则（在 PrometheusRule 资源的 RuleGroup 中声明）时，[规则本身的规格](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)包含标签，这些标签被 Alertmanager 用来计算哪个路由应该收到某个告警。

要查看 PrometheusRules，请安装 `rancher-monitoring`。然后进入**群组资源管理器**。在左上角，点击**群组资源管理器>监控**。然后点击**Prometheus 规则**。

你也可以在 Prometheus UI 中看到这些规则。

Prometheus UI 中的规则:
![PrometheusRules UI](/img/rancher/prometheus-rules-ui.png)
