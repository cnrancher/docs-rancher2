---
title: 迁移到 Rancher v2.5 监控
---

如果你在 Rancher v2.5 之前启用了监控、告警或通知，那么没有自动升级到新的监控/告警的解决方案。在通过 Cluster Explore 部署新的监控之前，你需要禁用和删除整个集群和所有项目中的所有现有自定义告警、通知和监控安装。

- [Rancher v2.5 之前的监控](#rancher-v25-之前的监控)
- [通过 Rancher v2.5 中的集群资源管理器进行监控和告警](#通过-rancher-v25-中的集群资源管理器进行监控和告警)
- [基于角色的访问控制的变化](#基于角色的访问控制的变化)
- [从监控 V1 迁移到监控 V2](#从监控-v1-迁移到监控-v2)
  - [迁移 Grafana 仪表盘](#迁移-grafana-仪表盘)
  - [迁移告警](#迁移告警)
  - [迁移通知](#迁移通知)
  - [为 RKE 模板用户迁移](#为-rke-模板用户迁移)

## Rancher v2.5 之前的监控

从 v2.2.0 开始，Rancher 的集群管理器允许用户在一个集群内独立启用监控和告警 V1（两者都由 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 提供支持）。

当启用监控时，监控 V1 将 [Prometheus](https://prometheus.io/) 和 [Grafana](https://grafana.com/docs/grafana/latest/getting-started/what-is-grafana/) 部署到集群上来监控你的集群节点、Kubernetes 组件和软件部署的进程状态，并创建自定义仪表盘，使收集的指标易于可视化。

监控 V1 可以在集群级和项目级进行配置，并将自动抓取某些在 Rancher 集群上作为应用程序部署的工作负载。

当启用告警或通知时，告警 V1 将 [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) 和一组 Rancher 控制器部署到集群上，允许用户定义告警并通过 Email、Slack、PagerDuty 等配置基于告警的通知。用户可以根据需要监控的内容选择创建不同类型的告警（例如，系统服务、资源、CIS 扫描等）；但是，基于 PromQL 表达式的告警只有在启用监控 V1 时才能创建。

## 通过 Rancher v2.5 中的集群资源管理器进行监控和告警

从 v2.5.0 版开始，Rancher 的集群资源管理器现在允许用户在一个集群内同时启用监控和告警 V2（两者都由 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 提供支持）。

与监控和告警 V1 不同的是，这两个功能都被打包在一个 Helm chart 中，可在[这里](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring)找到。该 chart 的行为和可配置字段与 prometheus 社区的 Helm chart [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) 相关，与上游 chart 的任何偏差都可以在与该 chart 一起维护的 [CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md) 中找到。

监控 V2 只能在集群级别上配置。不再支持项目级监控和告警。

关于如何配置监控与告警 V2 的更多信息，请参见[本页。](/docs/rancher2.5/monitoring-alerting/configuration/)

## 基于角色的访问控制的变化

默认情况下，项目所有者和成员不再可以访问 Grafana 或 Prometheus。如果只有 view-only 的用户有权访问 Grafana，他们将能够查看来自任何命名空间的数据。对于 Kiali，任何用户都可以在任何命名空间中编辑他们不拥有的东西。

关于 `rancher-monitoring` 中基于角色的访问控制的更多信息，请参考[此页面。](/docs/rancher2.5/monitoring-alerting/rbac/)

## 从监控 V1 迁移到监控 V2

虽然没有办法实现自动迁移，但可以手动将 Monitoring V1 中创建的自定义 Grafana 仪表盘和告警迁移到 Monitoring V2。

在你安装 Monitoring V2 之前，需要完全卸载 Monitoring V1。卸载监控 V1：

- 移除所有集群和项目特定的告警和告警组。
- 移除所有通知。
- 禁用群集->项目->工具->监控下的所有项目监控安装。
- 确保所有项目中的所有项目监控应用已经被删除，并且在几分钟后不会重新创建
- 禁用集群->工具->监控下的集群监控安装。
- 确保系统项目中的集群监控应用程序和监控操作程序已被删除，并且在几分钟后不会重新创建。

### RKE 模板集群

要防止重新启用 V1 监控，请通过修改 RKE 模板 yaml 禁用监控和将来的 RKE 模板修订：

```yaml
enable_cluster_alerting: false
enable_cluster_monitoring: false
```

### 迁移 Grafana 仪表盘

你可以将 Monitoring V1 中添加到 Grafana 的任何仪表盘迁移到 Monitoring V2。在 Monitoring V1 中，你可以像这样导出一个现有的仪表盘：

- 登录到 Grafana
- 导航到您要导出的仪表盘
- 转到仪表盘设置
- 复制 [JSON 模型](https://grafana.com/docs/grafana/latest/dashboards/json-model/)

在 JSON 模型中，将所有 `datasource` 字段从 `RANCHER_MONITORING` 更改为 `Prometheus`。您可以通过将所有出现的 `"datasource": "RANCHER_MONITORING"` 替换为 `"datasource": "Prometheus"` 来轻松完成此操作。

如果 Grafana 是由持久化卷支持的，你现在可以[导入](https://grafana.com/docs/grafana/latest/dashboards/export-import/)这个 JSON 模型到 Monitoring V2 Grafana UI。
建议用 `cattle-dashboards` 命名空间中的 ConfigMap 向 Grafana 提供仪表盘，其标签为 `grafana_dashboard: "1"`:

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

一旦创建了这个 ConfigMap，仪表盘将自动被添加到 Grafana 中。

### 迁移告警

只能将基于表达式的告警直接迁移到 Monitoring V2。幸运的是，基于事件的告警可以被设置为对系统组件、节点或工作负载事件的告警，已经被 Monitoring V2 中的告警所覆盖。所以没有必要迁移它们。

要迁移以下表达式的告警

{{< img "/img/rancher/monitoring/migration/alert_2.4_to_2.5_source.png" "">}}

你必须创建像这样的 PrometheusRule 配置:

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

或者通过集群资源管理器添加 Prometheus 规则

{{< img "/img/rancher/monitoring/migration/alert_2.4_to_2.5_target.png " ">}}

关于如何在 Monitoring V2 中配置 PrometheusRules 的更多细节，请参阅 [Monitoring 配置](/docs/rancher2.5/monitoring-alerting/configuration/#prometheusrules-配置)。

### 迁移通知

在 Monitoring V1 中，没有直接对应的通知工作方式。相反，你必须在 Monitoring V2 中用 [Routes 和 Receivers](/docs/rancher2.5/monitoring-alerting/configuration/#alertmanager-配置) 复制所需的设置。

### 为 RKE 模板用户迁移

如果集群使用 RKE 模板进行管理，你需要在未来的 RKE 模板修订中禁用监控，以防止传统的监控被重新启用。
