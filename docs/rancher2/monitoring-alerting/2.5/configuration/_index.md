---
title: 配置用于监控的自定义资源
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

## 概述

本文讲述了一些配置监控的自定义资源时使用到的重要配置选项。

有关为 Prometheus 配置自定义拉取目标和规则的信息，请参考 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator)。一些最重要的自定义资源在 Prometheus Operator [设计文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/design.md)中进行了说明。Prometheus Operator 文档也可以帮助您设置 RBAC、Thanos 或自定义配置。

## 配置 Prometheus

用户能够针对特定的监控和警报用例定制此功能的主要方式是通过创建或修改与此部署相关的 ConfigMaps、Secrets 和 Custom Resources。

Prometheus Operator 引入了一组自定义资源定义，允许用户通过在集群上创建和修改这些自定义资源来部署和管理 Prometheus 和 Alertmanager 实例。

Prometheus Operator 会根据这些自定义资源的实时状态自动更新您的 Prometheus 配置。

还有某些特殊类型的 ConfigMaps/Secrets，如对应于 Grafana Dashboards、Grafana Datasources 和 Alertmanager Configs 的 ConfigMaps/Secrets，它们将通过 sidecar 代理观察您集群内这些资源的实时状态，自动更新您的 Prometheus 配置。

默认情况下，这些资源（由 kube-prometheus 项目策划）的一组会被部署到您的集群上，作为安装 Rancher 监控应用程序的一部分，以建立基本的监控/警报堆栈。有关如何在部署图表后配置自定义目标、警报、通知器和仪表盘的更多信息，请参阅下文。

## 使用 ServiceMonitors 和 PodMonitors 配置目标

自定义由 Prometheus 使用的 scrape 配置，以确定要从哪些资源中刮取指标，主要涉及在您的集群中创建/修改以下资源。

### 配置 ServiceMonitors

该 CRD 声明性地指定了应如何监控 Kubernetes 服务组。集群中任何符合 ServiceMonitor `selector`字段中标签的服务都将根据 ServiceMonitor 上指定的`endpoints`进行监控。有关可以指定哪些字段的详细信息，请查看 Prometheus Operator 提供的 [spec](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#servicemonitor)。

有关 ServiceMonitors 工作方式的更多信息，请参阅 [Prometheus Operator 文档](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/running-exporters.md)。

### 配置 PodMonitors

该 CRD 声明性地指定了应如何监测 pods 组。您集群中的任何符合 PodMonitor`selector`字段中标签的 Pod 将根据 PodMonitor 上指定的`podMetricsEndpoints`进行监控。关于可以指定哪些字段的更多信息，请查看 Prometheus Operator 提供的[规范](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#podmonitorspec)。

### 配置 PrometheusRules

此 CRD 定义了一组 Prometheus 警报和/或记录规则。

要添加一组警报/记录规则，您应该创建一个 PrometheusRule CR，该 CR 定义了一个带有您所需规则的 RuleGroup，每个规则都指定了。

- 新警报/记录的名称
- 新警报/记录的 PromQL 表达式。
- 应附加在警报/记录上的标签，以识别它（如群组名称或严重性）。
- 注释，对需要在警报通知上显示的任何其他重要信息进行编码（如摘要、描述、信息、运行簿 URL 等）。记录规则不需要此字段。

有关可指定哪些字段的详细信息，请查看 [Prometheus Operator spec.](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#prometheusrulespec)

### 配置 Alertmanager Config

[Alertmanager Config](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file) Secret 包含 Alertmanager 实例的配置，该实例根据从 Prometheus 收到的警报发送通知。

默认情况下，Rancher Monitoring 将单个 Alertmanager 部署到使用默认 Alertmanager Config Secret 的集群上。作为图表部署选项的一部分，您可以选择增加部署到您的集群上的 Alertmanager 的副本数量，这些副本都可以使用相同的基础 Alertmanager 配置秘籍进行管理。

这个秘密应该随时更新或修改。

- 添加新的通知器或接收器
- 更改应发送至特定通知者或接收者的警报。
- 更改发送的警报群组。

> 默认情况下，您可以选择提供一个现有的 Alertmanager Config Secret（即 "cattle-monitoring-system "命名空间中的任何 Secret），或者允许 Rancher Monitoring 在您的集群上部署一个默认的 Alertmanager Config Secret。默认情况下，Rancher 创建的 Alertmanager Config Secret 将永远不会在升级/卸载`rancher-monitoring`图表时被修改/删除，以防止用户在图表上执行操作时丢失或覆盖其警报配置。

关于这个秘密中可以指定哪些字段的更多信息，请查看[Prometheus Alertmanager docs](https://prometheus.io/docs/alerting/latest/alertmanager/)。

Alertmanager 配置文件的完整规格以及它所包含的内容可以在[这里](https://prometheus.io/docs/alerting/latest/configuration/#configuration-file)找到。

通知集成是通过 "接收者 "来配置的，这一点在文件中已有说明[这里](https://prometheus.io/docs/alerting/latest/configuration/#receiver)。

更多信息，请参考[关于配置路由的 Prometheus 官方文档](https://www.prometheus.io/docs/alerting/latest/configuration/#route)

## 为通知添加 CA 证书

如果您需要将受信任的 CA 添加到您的通知器中，请按照以下步骤进行操作。

1. 创建`cattle-monitoring-system`命名空间。
1. 将您的可信 CA 秘密添加到`cattle-monitoring-system`命名空间中。
1. 部署或升级`rancher-monitoring`Helm 图表。在图表选项中，引用\*\*警报>附加秘密中的秘密。

**结果：**默认的 Alertmanager 自定义资源将可以访问您的受信任 CA。

## 配置拉取参数

如果目前不能通过 ServiceMonitor 或 PodMonitor 指定你想要的 scrape 配置，你可以在部署或升级`rancher-monitoring`时提供一个`additionalScrapeConfigSecret`。

一个[scrape_config 部分](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)指定了一组目标和描述如何刮取它们的参数。在一般情况下，一个 scrape 配置指定了一个作业。

Istio 就是一个可以使用这个配置的例子。更多信息，请参见[本节](https://rancher.com/docs/rancher/v2.x/en/istio/setup/enable-istio-in-cluster/#selectors-scrape-configs)

## 示例

### ServiceMonitor

可以在[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml)找到一个 ServiceMonitor 自定义资源的例子。

### PodMonitor

可以找到一个 PodMonitor 的例子[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/example-app-pod-monitor.yaml) 可以找到一个引用 Prometheus 资源的例子[这里](https://github.com/prometheus-operator/prometheus-operator/blob/master/example/user-guides/getting-started/prometheus-pod-monitor.yaml)。

### PrometheusRule

Prometheus 规则文件保存在 PrometheusRule 自定义资源中。使用 Prometheus 对象中的标签选择器字段 ruleSelector 来定义您要装入 Prometheus 的规则文件。PrometheusRule 的示例在 [本页](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/alerting.md)。

### Alertmanager Config

要通过 Slack 设置通知，需要将以下 Alertmanager 配置 YAML 放入 Alertmanager 配置秘籍的`alertmanager.yaml`键中，其中`api_url`应更新为使用 Slack 中的 Webhook URL。

```yaml
route:
  group_by: ["job"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: "slack-notifications"
receivers:
  - name: "slack-notifications"
    slack_configs:
      - send_resolved: true
        text: '{{ template "slack.rancher.text" . }}'
        api_url: <user-provided slack webhook url here>
templates:
  - /etc/alertmanager/config/*.tmpl
```
