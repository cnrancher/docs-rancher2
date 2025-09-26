---
title: ServiceMonitor 和 PodMonitor 配置
---

ServiceMonitors 和 PodMonitors 都是伪 CRD，用于映射 Prometheus 自定义资源的抓取配置。

这些配置对象声明性地指定了 Prometheus 将抓取指标的端点。

ServiceMonitors 比 PodMonitors 更常用，我们建议在大多数用例中使用它们。

> 本节假设熟悉监控组件如何协同工作。要了解更多信息，请参阅[本节](/docs/rancher2.5/monitoring-alerting/how-monitoring-works/_index)

## ServiceMonitors

这个伪 CRD 映射到 Prometheus 自定义资源配置的一个部分。它以声明方式指定应如何监控 Kubernetes 服务组。

当 ServiceMonitor 被创建时，Prometheus Operator 会更新 Prometheus 抓取配置以包含 ServiceMonitor 配置。然后 Prometheus 开始从 ServiceMonitor 中定义的端点抓取指标。

集群中与 ServiceMonitor `selector` 字段中的标签相匹配的任何服务将根据 ServiceMonitor 上指定的 `endpoints` 进行监控。具体可以指定哪些字段，请查看 Prometheus Operator 提供的[详细文档](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#servicemonitor)。

关于 ServiceMonitors 如何工作的更多信息，请参阅 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/user-guides/running-exporters.md)。

## PodMonitors

这个伪 CRD 映射到 Prometheus 自定义资源配置的一部分。它以声明方式指定应如何监控 Pod 组。

创建 PodMonitor 时，Prometheus Operator 会更新 Prometheus 抓取配置以包含 PodMonitor 配置。然后 Prometheus 开始从 PodMonitor 中定义的端点抓取指标。

集群中与 PodMonitor `selector` 字段中的标签匹配的任何 Pod 都将根据 PodMonitor 上指定的 `podMetricsEndpoints` 进行监控。具体可以指定哪些字段，请查看 Prometheus Operator 提供的[详细文档](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#podmonitorspec)。
