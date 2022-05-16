---
title: ServiceMonitor 和 PodMonitor 配置
shortTitle: ServiceMonitor 和 PodMonitor
weight: 7
---

ServiceMonitor 和 PodMonitor 都是伪 CRD，它们映射 Prometheus 自定义资源的抓取配置。

这些配置对象以声明方式指定 Prometheus 抓取指标的端点。

ServiceMonitor 比 PodMonitor 更常用，推荐用于大多数用例。

> 本节参考假设你已经熟悉 Monitoring 组件的协同工作方式。有关 Alertmanager 的详细信息，请参阅[本节](../../how-monitoring-works/)。

### ServiceMonitor

这个伪 CRD 映射到 Prometheus 自定义资源配置的一部分。它以声明方式指定应如何监控 Kubernetes 服务组。

创建 ServiceMonitor 时，Prometheus Operator 会更新 Prometheus 抓取配置，从而包含 ServiceMonitor 配置。然后 Prometheus 开始从 ServiceMonitor 中定义的端点抓取指标。

如果集群中的任何 Service 与 ServiceMonitor `selector` 字段中的标签匹配，则会根据 ServiceMonitor 指定的 `endpoints` 进行监控。有关可以指定的字段的更多信息，请查看 Prometheus Operator 的[规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#servicemonitor)。

有关 ServiceMonitor 工作原理的更多信息，请参阅 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/running-exporters.md)。

### PodMonitor

这个伪 CRD 映射到 Prometheus 自定义资源配置的一部分。它以声明方式指定应如何监视 Pod 组。

创建 PodMonitor 时，Prometheus Operator 会更新 Prometheus 抓取配置，从而包含 PodMonitor 配置。然后 Prometheus 开始从 PodMonitor 中定义的端点抓取指标。

如果集群中的任何 Pod 与 PodMonitor `selector` 字段中的标签匹配，则会根据 PodMonitor 指定的 `podMetricsEndpoints` 进行监控。有关可以指定的字段的更多信息，请查看 Prometheus Operator 的[规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#podmonitorspec)。
