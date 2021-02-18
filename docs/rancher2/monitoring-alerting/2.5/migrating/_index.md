---
title: 迁移到Rancher v2.5监控
description: 如果您在 Rancher v2.5 之前曾在 Rancher 中启用过监控、告警或通知器，则没有自动升级路径来切换到新的监控/告警解决方案。在通过 Cluster Explore 部署新的监控解决方案之前，您需要禁用和删除整个集群和所有项目中所有现有的自定义告警、通知器和监控安装。
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
  - 迁移到Rancher v2.5监控
---

## 概述

如果您在 Rancher v2.5 之前曾在 Rancher 中启用过监控、告警或通知，则无法通过自动升级路径切换到新的监控告警解决方案。在通过 Cluster Explorer 部署新的监控解决方案之前，您需要禁用和删除整个集群和所有项目中所有现有的监控、自定义告警和通知。

## Rancher v2.5 之前的监控

从 v2.2.0 开始，Rancher 的集群管理器允许用户在集群内独立启用监控和告警 V1（均由[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)提供支持）。有关如何配置 Monitoring & Alerting V1 的更多信息，请参阅[关于 Rancher v2.5 之前的监控的文档](/docs/rancher2/monitoring-alerting/2.0-2.4/_index)。

启用 Monitoring 后，Monitoring V1 会将[Prometheus](https://prometheus.io/)和[Grafana](https://grafana.com/docs/grafana/latest/getting-started/)部署到集群上，以监控集群节点、Kubernetes 组件和软件部署的进程状态，并创建自定义仪表盘，使其易于可视化收集的指标。

Monitoring V1 可以在集群级别和项目级别上配置，并将自动拉取 Rancher 集群上部署为 Apps 的某些工作负载。

当启用 Alerts 或 Notifiers 时，Alerting V1 会将[Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)和一组 Rancher 控制器部署到集群上，用户可以通过 Email、Slack、PagerDuty 等方式定义告警和配置基于告警的通知。用户可以根据需要监控的内容（如系统服务、资源、CIS 扫描等）选择创建不同类型的告警；但是，只有在启用了 Monitoring V1 的情况下，才能创建基于 PromQL 表达式的告警。

## 通过 Rancher 2.5 中的集群浏览器进行监控和告警

从 v2.5.0 开始，Rancher 的集群浏览器现在允许用户在集群内同时启用 Monitoring & Alerting V2（均由[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)提供支持）。

与 Monitoring & Alerting V1 不同的是，这两个功能都打包在一个单一的 Helm 图表中，可以在[这里](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring)找到。该图表和可配置字段的行为与[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)、Prometheus Community Helm 图表紧密匹配，任何与上游图表的偏差都可以在与该图表一起维护的[CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md)中找到。

监控 V2 只能在集群层面进行配置。不再支持项目级监控和告警。

有关如何配置 Monitoring & Alerting V2 的更多信息，请参阅 [配置用于监控的自定义资源](/docs/rancher2/monitoring-alerting/2.5/configuration/_index)。

## 基于角色的访问控制的变更

项目所有者和成员不再能默认访问 Grafana 或 Prometheus。如果仅有视图的用户可以访问 Grafana，他们将能够看到任何命名空间的数据。对于 Kiali，任何用户都可以在任何命名空间中编辑他们不拥有的东西。

关于`rancher-monitoring`中基于角色的访问控制的更多信息，请参考[基于角色的访问控制](/docs/rancher2/monitoring-alerting/2.5/rbac/_index)。

## 从监控 V1 迁移到监控 V2

虽然没有自动迁移功能，但是您可以将 Monitoring V1 中创建的自定义 Grafana 仪表盘和告警手动迁移到 Monitoring V2 中。

在安装 Monitoring V2 之前，请执行以下步骤，彻底卸载 Monitoring V1：

1. 移除所有集群和项目的告警和告警组。
1. 删除所有 notifier。
1. 在 **“集群 > 项目 > 工具 > 监控”** 下禁用所有项目监控安装。
1. 确保所有项目中的所有项目监控应用都已被删除，并且在几分钟后不再重新创建。
1. 在 **“集群 > 工具 > 监控”** 下禁用集群监控安装。
1. 确保系统项目中的集群监控应用和监控操作应用已经被删除，并且在几分钟后不重新创建。

### 迁移 Grafana 仪表盘

您可以将监控 V1 中添加到 Grafana 的任何仪表盘迁移到监控 V2 中。在 监控 V1 中，您可以执行以下步骤，导出现有的仪表盘。

1. 登录 Grafana。
1. 导航到您要导出的仪表盘。
1. 进入仪表板设置。
1. 复制[JSON 模型](https://grafana.com/docs/grafana/latest/dashboards/json-model/)。

在 JSON 模型中，将所有`datasource`字段从 `RANCHER_MONITORING`改为`Prometheus`。你可以通过替换所有出现的`"datasource "`来轻松做到这一点。`"RANCHER_MONITORING"`替换为`"datasource": "Prometheus"`。

如果 Grafana 是由一个持久卷支持的，你现在可以[导入](https://grafana.com/docs/grafana/latest/dashboards/export-import/)这个 JSON 模型到 Monitoring V2 Grafana UI 中。
建议在`cattle-dashboards`命名空间中向 Grafana 提供一个 ConfigMap，该 ConfigMap 的标签为`grafana_dashboard。"1"`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: custom-dashboard
  namespace: cattle-dashboards
  labels:
    grafana_dashboard: "1"
data:
  custom-dashboard.json: |
    { 
      ... 
    }
```

创建此 ConfigMap 以后，仪表板将自动添加到 Grafana 中。

### 迁移告警

只有将基于表达式的告警直接迁移到 Monitoring V2 中才有可能。幸运的是，基于事件的告警可以设置为对系统组件、节点或工作负载事件进行告警，这些告警已经被 Monitoring V2 的一部分所覆盖。所以没有必要迁移它们。

要迁移以下表达式告警

有两种方式可以迁移告警表表达式，选择其中一种执行即可：

- 在命名空间创建一个像这样的 PrometheusRule 配置。

  ```yaml
  apiVersion: monitoring.coreos.com/v1
  kind: PrometheusRule
  metadata:
  name: custom-rules
  namespace: default
  spec:
  groups:
    - name: custom.rules
      rules:
        - alert: Custom Expression Alert
          expr: prometheus_query > 5
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "The result of prometheus_query has been larger than 5 for 5m. Current value {{ $value }}"
  ```

- 通过集群浏览器添加 Prometheus 规则。

  ![alert_2.4_to_2.5_source](/img/rancher/monitoring/migration/alert_2.4_to_2.5_source.png)

有关如何在监控 V2 中配置 PrometheusRules 的更多细节，请参见[监控配置](/docs/rancher2/monitoring-alerting/2.5/configuration/_index)。

### 迁移 notifier

在 Monitoring V1 中，没有直接对应的通知器工作方式。相反，你必须在 Monitoring V2 中用[Routes and Receivers](/docs/rancher2/monitoring-alerting/2.5/configuration/_index#配置-Alertmanager-Config)复制所需的设置。
