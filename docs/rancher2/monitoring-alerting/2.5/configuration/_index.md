---
title: 配置用于监控的自定义资源
description: 本文讲述了一些配置监控的自定义资源时使用到的重要配置选项，如配置 Prometheus、为通知添加 CA 证书和配置拉取参数，并且提供了示例代码。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - rancher 2.5
  - 监控和告警
  - 配置用于监控的自定义资源
---

## 概述

本文讲述了一些配置监控的自定义资源时使用到的重要配置选项。

有关为 Prometheus 配置自定义拉取目标和规则的信息，请参考 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator)。一些最重要的自定义资源在 Prometheus Operator [设计文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md)中进行了说明。Prometheus Operator 文档也可以帮助您设置 RBAC、Thanos 或自定义配置。

## 配置 Prometheus

用户通过创建或修改与此部署相关的 ConfigMaps、Secrets 和 Custom Resources，可以配置特定的监控和告警用例。Prometheus Operator 引入了一组自定义资源定义，允许用户通过在集群上创建和修改这些自定义资源来部署和管理 Prometheus 和 Alertmanager 实例。Prometheus Operator 会根据这些自定义资源的实时状态自动更新您的 Prometheus 配置。

还有某些特殊类型的 ConfigMaps/Secrets，如对应于 Grafana Dashboards、Grafana Datasources 和 Alertmanager Configs 的 ConfigMaps/Secrets，它们将通过 sidecar 代理监控您集群内这些资源的实时状态，自动更新您的 Prometheus 配置。

默认情况下，这些资源（由 kube-prometheus 项目策划）的一组会被部署到您的集群上，作为安装 Rancher 监控应用程序的一部分，以建立基本的监控和告警。有关如何在部署 chart 后配置自定义目标、警报、通知器和仪表盘的更多信息，请参阅下文。

## 使用 ServiceMonitors 和 PodMonitors 配置目标

自定义由 Prometheus 使用的 scrape 配置，以确定要从哪些资源中拉取指标，主要涉及在您的集群中创建或修改以下资源。

### 配置 ServiceMonitors

该 CRD 声明性地指定了应如何监控 Kubernetes 服务组。集群中任何符合 ServiceMonitor `selector`字段中标签的服务都将根据 ServiceMonitor 上指定的`endpoints`进行监控。有关可以指定哪些字段的详细信息，请查看 Prometheus Operator 提供的 [规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#servicemonitor)。

有关 ServiceMonitors 工作方式的更多信息，请参阅 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/running-exporters.md)。

### 配置 PodMonitors

该 CRD 声明性地指定了应如何监测 pods 组。您集群中的任何符合 PodMonitor`selector`字段中标签的 Pod 将根据 PodMonitor 上指定的`podMetricsEndpoints`进行监控。关于可以指定哪些字段的更多信息，请查看 Prometheus Operator 提供的[规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#podmonitorspec)。

## 配置 PrometheusRules

此 CRD 定义了一组 Prometheus 警报和记录规则。

要添加一组警报/记录规则，您应该创建一个 PrometheusRule CR，该 CR 定义了一个带有您所需规则的 RuleGroup，每个规则都指定了。

- 新警报/记录的名称
- 新警报/记录的 PromQL 表达式。
- 应附加在警报/记录上的标签，以识别它（如群组名称或严重性）。
- 注释，对需要在警报通知上显示的任何其他重要信息进行编码（如摘要、描述、信息、运行簿 URL 等）。记录规则不需要此字段。

有关可指定哪些字段的详细信息，请查看 [Prometheus Operator spec.](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#prometheusrulespec)

## 配置 Alertmanager Config

详情请参考[配置 Alertmanager](/docs/rancher2/monitoring-alerting/2.5/configuration/alert-manager/_index)。

## 为通知添加 CA 证书

如果您需要将受信任的 CA 添加到您的 notifier 中，请按照以下步骤进行操作。

1. 创建`cattle-monitoring-system`命名空间。
1. 将您的可信 CA 密钥添加到`cattle-monitoring-system`命名空间中。
1. 部署或升级`rancher-monitoring`Helm chart。在 chart 选项中，引用“**警报 > 附加密钥**”中的密钥。

**结果：**默认的 Alertmanager 自定义资源将可以访问您的受信任 CA。

## 配置拉取参数

如果目前不能通过 ServiceMonitor 或 PodMonitor 指定你想要的 scrape 配置，你可以在部署或升级`rancher-monitoring`时提供一个`additionalScrapeConfigSecret`。

一个[scrape_config 部分](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)指定了一组目标和描述如何拉取它们的参数。在一般情况下，一个 scrape 配置指定了一个 job。

Istio 就是一个可以使用这个配置的例子。更多信息，请参见[在集群中启用 Istio](/docs/rancher2/istio/2.5/setup/enable-istio-in-cluster/_index)。

## 示例

### ServiceMonitor

可以在[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml)找到一个 ServiceMonitor 自定义资源的例子。

### PodMonitor

可以找到一个 PodMonitor 的例子[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/example-app-pod-monitor.yaml) 可以找到一个引用 Prometheus 资源的例子[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/prometheus-pod-monitor.yaml)。

### PrometheusRule

对于熟悉 Prometheus 的用户来说，一个 PrometheusRule 包含了您通常放在 [Prometheus 规则文件](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)中的警报和记录规则。

为了在您的集群内更精细地应用 PrometheusRules，Prometheus 资源上的 ruleSelector 字段允许您根据附加在 PrometheusRules 资源上的标签选择哪些 PrometheusRules 应加载到 Prometheus 上。

PrometheusRule 的示例在 [本页](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/alerting.md)。

### Alertmanager Config

详情请参考[配置 Alertmanager](/docs/rancher2/monitoring-alerting/2.5/configuration/alert-manager/_index)。
