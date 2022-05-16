---
title: 示例
weight: 400
---


### ServiceMonitor

你可以在[此处](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml)找到 ServiceMonitor 自定义资源的示例。

### PodMonitor

你可以在[此处](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/example-app-pod-monitor.yaml)找到 PodMonitor 示例，还可以在[此处](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/prometheus-pod-monitor.yaml)找到引用它的 Prometheus 资源示例。

### PrometheusRule

PrometheusRule 包含你通常放置在 [Prometheus 规则文件](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)中的告警和记录规则。

要在集群中更细粒度地应用 PrometheusRules，你可以使用 Prometheus 资源的 ruleSelector 字段，从而根据添加到 PrometheusRules 资源的标签来选择要加载到 Prometheus 上的 PrometheusRule。

你可以在[此页面](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/alerting.md)找到 PrometheusRule 示例。

### Alertmanager 配置

有关示例配置，请参阅[本节](../advanced/alertmanager/#example-alertmanager-config)。