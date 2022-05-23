---
title: Helm Chart 选项
weight: 8
---

- [配置资源限制和请求](#configuring-resource-limits-and-requests)
- [Notifiers 的可信 CA](#trusted-ca-for-notifiers)
- [其它抓取配置](#additional-scrape-configurations)
- [配置打包在 Monitoring V2 中的应用](#configuring-applications-packaged-within-monitoring-v2)
- [增加 Alertmanager 的副本](#increase-the-replicas-of-alertmanager)
- [为持久化 Grafana 仪表板配置命名空间](#configuring-the-namespace-for-a-persistent-grafana-dashboard)


## 配置资源限制和请求

安装 `rancher-monitoring` 时可以配置资源请求和限制。

默认值在 `rancher-monitoring` Helm Chart 的 [values.yaml](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/values.yaml) 中。

下表中的默认值是所需的最低资源限制和请求：

| 资源名称 | 内存限制 | CPU 限制 | 内存请求 | CPU 请求 |
| ------------- | ------------ | ----------- | ---------------- | ------------------ |
| alertmanager | 500Mi | 1000m | 100Mi | 100m |
| grafana | 200Mi | 200m | 100Mi | 100m |
| kube-state-metrics subchart | 200Mi | 100m | 130Mi | 100m |
| prometheus-node-exporter subchart | 50Mi | 200m | 30Mi | 100m |
| prometheusOperator | 500Mi | 200m | 100Mi | 100m |
| prometheus | 2500Mi | 1000m | 1750Mi | 750m |
| **总计** | **3950Mi** | **2700m** | **2210Mi** | **1250m** |

建议至少配 50Gi 存储。


## Notifiers 的可信 CA

如果你需要将受信任的 CA 添加到 Notifiers，请执行以下步骤：

1. 创建 `cattle-monitoring-system` 命名空间。
1. 将你信任的 CA 密文添加到 `cattle-monitoring-system` 命名空间。
1. 部署或升级 `rancher-monitoring` Helm Chart。在 Chart 选项中，引用**告警 > 补充密文**中的密钥。

**结果**：默认的 Alertmanager 自定义资源将有权访问你信任的 CA。


## 其它抓取配置

如果无法通过 ServiceMonitor 或 PodMonitor 指定你想要的抓取配置，你可以在部署或升级 `rancher-monitoring` 时提供 `additionalScrapeConfigSecret`。

[scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) 指定一组目标以及抓取这些目标的参数。在一般情况下，一个抓取配置指定一个 job。

Istio 就是一个可能用到这个配置的例子。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/selectors-and-scrape)。


## 配置打包在 Monitoring V2 中的应用

我们使用 Monitoring V2 来部署 kube-state-metrics 和 node-exporter。node-exporter 部署为 DaemonSet。对于 Monitoring V2 helm Chart，values.yaml 中的所有东西都部署为子 Chart。

我们还部署了不由 prometheus 管理的 Grafana。

如果你查看 Helm Chart 在 kube-state-metrics 中的功能，则还有很多可以设置的值没有在顶层 Chart 中显示。

但是，你可以在顶层 Chart 中添加覆盖子 Chart 的值。

### 增加 Alertmanager 的副本

作为 Chart 部署选项的一部分，你可以选择增加部署到集群上的 Alertmanager 副本的数量。这些副本使用相同的底层 Alertmanager Config Secret 进行管理。有关 Alertmanager Config Secret 的更多信息，请参阅[本节](../advanced/alertmanager/#multiple-alertmanager-replicas)。

### 为持久化 Grafana 仪表板配置命名空间

要让 Grafana 监控所有命名空间中的 ConfigMap，请在 `rancher-monitoring` Helm chart 中指定以下值：

```
grafana.sidecar.dashboards.searchNamespace=ALL
```

请注意，Monitoring Chart 用于添加 Grafana 仪表板的 RBAC 角色仅能让用户将仪表板添加到定义在 `grafana.dashboards.namespace` 中的命名空间，默认为 `cattle-dashboards`。