---
title: 监控工作负载
---

- [显示工作负载的 CPU 和内存指标](#显示工作负载的-cpu-和内存指标)
- [设置 CPU 和内存以外的指标](#设置-cpu-和内存以外的指标)

如果你只需要工作负载的 CPU 和内存时间序列，则不需要部署 ServiceMonitor 或 PodMonitor，因为默认情况下，监控应用程序已经收集了有关资源使用情况的指标数据。

为工作负载设置监控的步骤取决于你是想要工作负载的 CPU 和内存等基本指标，还是想要从工作负载中抓取自定义指标。

如果你只需要工作负载的 CPU 和内存时间序列，你不需要部署 ServiceMonitor 或 PodMonitor，因为监控应用已经默认收集了资源使用情况的指标数据。资源使用时间序列数据在 Prometheus 的本地时间序列数据库中。

Grafana 显示的是汇总的数据，但你可以通过使用 PromQL 查询，提取该工作负载的数据，看到单个工作负载的数据。获得 PromQL 查询后，你可以在 Prometheus UI 中单独执行查询，并在那里看到可视化的时间序列，或者你可以使用查询来自定义 Grafana 仪表盘来显示工作负载指标。关于工作负载指标的 PromQL 查询的例子，见[本节。](/docs/rancher2.5/monitoring-alerting/expression/#workload-指标)

要为你的工作负载设置自定义指标，你需要设置一个 exporter，并创建一个新的 ServiceMonitor 自定义资源来配置 Prometheus 从你的 exporter 抓取指标。

### 显示工作负载的 CPU 和内存指标

默认情况下，监控应用程序已经抓取了 CPU 和内存。

为了获得特定工作负载的一些细化细节，你可以自定义一个 Grafana 仪表盘来显示特定工作负载的指标。

### 设置 CPU 和内存以外的指标

对于自定义指标，你需要以 Prometheus 支持的格式在你的应用程序上公开这些指标。

然后，我们建议你应该创建一个新的 ServiceMonitor 自定义资源。当这个资源被创建时，Prometheus 的自定义资源将被自动更新，以便它的抓取配置包括新的自定义指标的端点。然后 Prometheus 将开始从 endpoint 抓取指标。

你也可以创建一个 PodMonitor 来公开自定义指标 endpoint，但是 ServiceMonitors 更适合于大多数的使用情况。
