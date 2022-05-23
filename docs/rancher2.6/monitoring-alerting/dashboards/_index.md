---
title: 内置仪表板
weight: 3
---

- [Grafana UI](#grafana-ui)
- [Alertmanager UI](#alertmanager-ui)
- [Prometheus UI](#prometheus-ui)

## Grafana UI

你可以使用 [Grafana](https://grafana.com/grafana/) 对存储在各个地方的指标进行查询、可视化、告警和了解。你能与你的团队创建、探索和共享仪表板，并培养数据驱动的文化。

要查看时间序列数据可视化的默认仪表板，请转到 Grafana UI。

### 自定义 Grafana

要查看和自定义用于支持 Grafana 仪表板的 PromQL 查询，请参阅[此页面](../guides/customize-grafana)。

### 持久化 Grafana 仪表板

要创建持久化 Grafana 仪表板，请参阅[此页面](../guides/persist-grafana)。

### 访问 Grafana

有关 Grafana 的基于角色的访问控制，请参阅[本节](../rbac/#role-based-access-control-for-grafana)。


## Alertmanager UI

安装 `rancher-monitoring` 后，会部署 Prometheus Alertmanager UI，从而让你查看告警以及当前的 Alertmanager 配置。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关 Alertmanager 的详细信息，请参阅[本节](../how-monitoring-works/#how-alertmanager-works)。


### 访问 Alertmanager UI

Alertmanager UI 可让你查看最近触发的告警。

> **先决条件**：必须安装 `rancher-monitoring` 应用。

要查看 Alertmanager UI：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要查看 Alertmanager UI 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 单击 **Alertmanager**。

**结果**：在新选项卡中打开 Alertmanager UI。如需配置帮助，请参阅[官方 Alertmanager 文档](https://prometheus.io/docs/alerting/latest/alertmanager/)。

有关在 Rancher 中配置 Alertmanager 的更多信息，请参阅[此页面](../configuration/advanced/alertmanager)。

<figcaption>Alertmanager UI</figcaption>
![Alertmanager UI]({{<baseurl>}}/img/rancher/alertmanager-ui.png)


### 查看默认告警

要查看默认触发的告警，请转到 Alertmanager UI 并单击**展开所有组**。


## Prometheus UI

默认情况下，[kube-state-metrics service](https://github.com/kubernetes/kube-state-metrics) 向 monitoring 应用提供 CPU 和内存利用率的大量信息。这些指标涵盖了跨命名空间的 Kubernetes 资源。换言之，如果你要查看服务的资源指标，你无需为其创建新的 ServiceMonitor。由于数据已经在时间序列数据库中，你可以转到 Prometheus UI 并运行 PromQL 查询来获取信息。你可以使用相同的查询来配置 Grafana 仪表板，从而显示这些指标随时间变化的图表。

要查看 Prometheus UI，请安装 `rancher-monitoring`。然后：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要查看 Prometheus UI 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 单击 **Prometheus Graph**。

<figcaption>Prometheus Graph UI</figcaption>
![Prometheus Graph UI]({{<baseurl>}}/img/rancher/prometheus-graph-ui.png)

### 查看 Prometheus 目标

要查看你正在监控的服务，你需要查看你的目标。目标是由 ServiceMonitor 和 PodMonitor 设置的，指的是指标抓取的的源。你无需直接编辑目标，但 Prometheus UI 可为你提供抓取的所有指标来源的概览。

要查看 Prometheus 目标，请安装 `rancher-monitoring`。然后：


1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要查看 Prometheus 目标的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 单击 **Prometheus 目标**。

<figcaption>Prometheus UI 中的目标</figcaption>
![Prometheus 目标 UI]({{<baseurl>}}/img/rancher/prometheus-targets-ui.png)

### 查看 PrometheusRules

当你定义规则时（在 PrometheusRule 资源的 RuleGroup 中声明），[规则本身的规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#rule)会包含标签，然后 Alertmanager 会使用这些标签来确定接收对应告警的路由。

要查看 PrometheusRule，请安装 `rancher-monitoring`。然后：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要可视化的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 点击 **Prometheus 规则**。

你还可以在 Prometheus UI 中查看规则：

<figcaption>Prometheus UI 中的规则</figcaption>
![PrometheusRule UI]({{<baseurl>}}/img/rancher/prometheus-rules-ui.png)

有关在 Rancher 中配置 PrometheusRule 的更多信息，请参阅[此页面](../configuration/advanced/prometheusrules)。