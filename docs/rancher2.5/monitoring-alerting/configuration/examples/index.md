---
title: 示例
---

## ServiceMonitor

可以找到一个 ServiceMonitor 自定义资源的例子[在这里。](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml)

## PodMonitor

可以找到一个 PodMonitor 的例子[在这里。](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/example-app-pod-monitor.yaml) 可以找到一个引用它的 Prometheus 资源的例子[在这里。](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/prometheus-pod-monitor.yaml)

## PrometheusRule

对于熟悉 Prometheus 的用户来说，PrometheusRule 包含了你通常会放在[Prometheus 规则文件](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)中的告警和记录规则。

为了在集群中更精确地应用 PrometheusRules，Prometheus 资源上的 ruleSelector 字段允许你根据 PrometheusRules 资源上的标签选择哪些 PrometheusRules 应该被加载到 Prometheus 上。

一个 PrometheusRules 的例子在[本页面。](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/alerting.md)

## Alertmanager 配置

关于配置的例子，请参阅[本页面。](/docs/rancher2.5/monitoring-alerting/configuration/advanced/alertmanager/)
