---
title: 为工作负载设置 Monitoring
weight: 4
---

- [显示工作负载的 CPU 和内存指标](#display-cpu-and-memory-metrics-for-a-workload)
- [设置 CPU 和内存之外的指标](#setting-up-metrics-beyond-cpu-and-memory)

如果你只需要工作负载的 CPU 和内存时间序列，则不需要部署 ServiceMonitor 或 PodMonitor，因为 Monitoring 应用默认会收集资源使用情况的指标数据。

设置工作负载监控的步骤取决于你是否需要基本指标（例如工作负载的 CPU 和内存），或者是否需要从工作负载中抓取自定义指标。

如果你只需要工作负载的 CPU 和内存时间序列，则不需要部署 ServiceMonitor 或 PodMonitor，因为 Monitoring 应用默认会收集资源使用情况的指标数据。资源使用的时间序列数据在 Prometheus 的本地时间序列数据库中。

Grafana 显示聚合数据，你也可以使用 PromQL 查询来查看单个工作负载的数据。进行 PromQL 查询后，你可以在 Prometheus UI 中单独执行查询并查看可视化的时间序列，你也可以使用查询来自定义显示工作负载指标的 Grafana 仪表板。有关工作负载指标的 PromQL 查询示例，请参阅[本节](https://rancher.com/docs/rancher/v2.6/en/monitoring-alerting/expression/#workload-metrics)。

要为你的工作负载设置自定义指标，你需要设置一个 Exporter 并创建一个新的 ServiceMonitor 自定义资源，从而将 Prometheus 配置为从 Exporter 中抓取指标。

### 显示工作负载的 CPU 和内存指标

默认情况下，Monitoring 应用会抓取 CPU 和内存指标。

要获取特定工作负载的细粒度信息，你可以自定义 Grafana 仪表板来显示该工作负载的指标。

### 设置 CPU 和内存之外的指标

对于自定义指标，你需要使用 Prometheus 支持的格式来公开应用上的指标。

我们建议你创建一个新的 ServiceMonitor 自定义资源。创建此资源时，Prometheus 自定义资源将自动更新，以便将新的自定义指标端点包含在抓取配置中。然后 Prometheus 会开始从端点抓取指标。

你还可以创建 PodMonitor 来公开自定义指标端点，但 ServiceMonitor 更适合大多数用例。
