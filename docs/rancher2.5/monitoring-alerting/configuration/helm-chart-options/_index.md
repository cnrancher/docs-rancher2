---
title: Helm Chart 选项
---

- [配置资源限制和请求](#配置资源限制和请求)
- [通知的受信 CA](#通知的受信-ca)
- [额外的抓取配置](#额外的抓取配置)
- [配置 Monitoring V2 中的应用包](#配置-monitoring-v2-中的应用包)
- [增加 Alertmanager 的副本](#增加-alertmanager-的副本)
- [配置持久化 Grafana 仪表盘的命名空间](#配置持久化-grafana-仪表盘的命名空间)

## 配置资源限制和请求

资源请求和限制可以在安装 `rancher-monitoring` 时配置。

默认值在 `rancher-monitoring` Helm chart 中的 [values.yaml](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/values.yaml)。

下表中的默认值是最低要求的资源限制和请求:

| 资源名称                          | 内存限制   | CPU 限制  | 内存请求   | CPU 请求  |
| --------------------------------- | ---------- | --------- | ---------- | --------- | 
| alertmanager                      | 500Mi      | 1000m     | 100Mi      | 100m      |
| grafana                           | 200Mi      | 200m      | 100Mi      | 100m      |
| kube-state-metrics subchart       | 200Mi      | 100m      | 130Mi      | 100m      |
| prometheus-node-exporter subchart | 50Mi       | 200m      | 30Mi       | 100m      |
| prometheusOperator                | 500Mi      | 200m      | 100Mi      | 100m      |
| prometheus                        | 2500Mi     | 1000m     | 1750Mi     | 750m      |
| **总**                            | **3950Mi** | **2700m** | **2210Mi** | **1250m** | 

建议至少有 50Gi 的存储。

## 通知的受信 CA

如果你需要为你的通知器添加一个受信任的 CA，请遵循以下步骤：

1. 创建 `cattle-monitoring-system` 命名空间。
1. 在 `cattle-monitoring-system` 命名空间中添加你的受信任 CA 的 secret。
1. 部署或升级 `rancher-monitoring` Helm chart。在 chart 选项中，参考**告警>额外的 secret**。

**结果：**默认的 Alertmanager 自定义资源将可以访问你的受信任的 CA。

## 额外的抓取配置

如果你想要的 scrape 配置暂时不能通过 ServiceMonitor 或 PodMonitor 指定，你可以在部署或升级 `rancher-monitoring` 时提供一个 `additionalScrapeConfigSecret`。

一个 [scrape_config section](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) 指定了一组目标和参数，描述了如何对它们进行抓取。在一般情况下，一个 scrape 配置指定一个 job。

Istio 就是一个可能用到这个配置的例子。要了解更多信息，请参阅[本节](/docs/rancher2.5/istio/configuration-reference/selectors-and-scrape/_index)

## 配置 Monitoring V2 中的应用包

我们将 kube-state-metrics 和 node-exporter 部署在 monitoring v2 中。 node exporter 被部署为 DaemonSets。在 monitoring v2 的 helm chart 中，在 values.yaml 中，每个东西都被部署为子 chart。

我们还部署了 grafana，这不是由 Prometheus 管理的。

如果你查看 kube-state-metrics 中的 helm chart 的功能，还有很多你可以设置的值没有在顶级 chart 中显示。

但在顶层 chart 中，你可以添加覆盖子 chart 中存在的值。

## 增加 Alertmanager 的副本

作为 chart deployment 选项的一部分，你可以选择增加 deployment 在集群上的 Alertmanager 的副本数量。这些副本都可以使用相同的底层 Alertmanager Config Secret 来管理。关于 Alertmanager Config Secret 的更多信息，请参阅[本节](/docs/rancher2.5/monitoring-alerting/configuration/advanced/alertmanager/_index#多个-alertmanager-replicas)

## 配置持久化 Grafana 仪表盘的命名空间

要指定你希望 Grafana 观察所有命名空间的 ConfigMaps，请在 `rancher-monitoring` Helm chart 中设置这个值。

```
grafana.sidecar.dashboards.searchNamespace=ALL
```

请注意，监控 chart 公开的用于添加 Grafana 仪表盘的 RBAC 角色仍然仅限于授予用户在 `grafana.dashboards.namespace` 中定义的命名空间中添加仪表盘的权限，该命名空间默认为 `cattle-dashboards`。