---
title: 监控和告警-v2.5
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
  - 监控和告警
  - rancher2.5
---

## 概述

使用 Rancher，您可以在您的集群上快速部署领先的开源监控和警报解决方案，如 [Prometheus](https://prometheus.io/)、[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)和 [Grafana](https://grafana.com/docs/grafana/latest/getting-started/what-is-grafana/)。

Rancher 的解决方案（由[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)提供支持）允许用户：

- 通过[Prometheus](https://prometheus.io/)，监控您的集群节点、Kubernetes 组件和软件部署的状态和进程。

- 根据[Prometheus](https://prometheus.io/)收集的指标创建定义告警。

- 通过[Grafana](https://grafana.com/docs/grafana/latest/getting-started/what-is-grafana/)创建自定义仪表盘，使其能够轻松地将收集的指标可视化。

- 使用[Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)通过 Email、Slack、PagerDuty 等配置基于警报的通知。

- 根据[Prometheus](https://prometheus.io/)收集到的参数，预先计算出的经常需要/计算成本高的表达式定义为新的时间序列（仅在 2.5.x 中可用）。

- 通过[Prometheus Adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter)将从 Prometheus 收集到的指标暴露给 Kubernetes Custom Metrics API，以便在 HPA 中使用（仅在 2.5 中可用）。

关于部署到集群上以支持该解决方案的资源的更多信息，可以在 [`rancher-monitoring`](https://github.com/rancher/charts/tree/main/charts/rancher-monitoring) Helm 图表中找到，该图表密切跟踪 Prometheus 社区维护的上游 [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm 图表，并在 [CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md) 中跟踪某些变化。

本页介绍了如何使用 Rancher v2.5 中引入的新监控应用程序在集群中启用监控和警报。

如果您在 v2.5 之前在 Rancher 中启用了监控、警报或通知器，则没有升级路径可以切换到新的监控/警报解决方案。在通过集群资源管理器部署新的监控解决方案之前，您需要在集群管理器中禁用监控/警报/通知器。

有关 Rancher 2.5 中监控应用升级的更多信息，请参考[迁移文档](/docs/rancher2/monitoring-alerting/2.5/migrating/_index)。

启用监控之前，请务必确认[配置资源限额和资源需求](#配置资源限额和资源需求)中的默认值是所需的最小资源限制和请求。

## 监控组件介绍

`rancher-monitoring` operator 由 Prometheus、Grafana、Alertmanager、Prometheus 操作员和 Prometheus 适配器提供动力。

### 关于 Prometheus

Prometheus 提供了你的数据的时间序列，根据[Prometheus](https://prometheus.io/docs/concepts/data_model/)

属于同一个度量和同一组标注维度的时间戳值流，以及被监控集群的综合统计和度量。

Prometheus 让您可以查看来自不同 Rancher 和 Kubernetes 对象的度量。使用时间戳，Prometheus 让您可以通过 Rancher UI 或 Grafana（与 Prometheus 一起部署的分析查看平台）以易于阅读的图形和可视化方式查询和查看这些指标。

通过查看 Prometheus 从集群控制平面、节点和部署中抓取的数据，您可以随时了解集群中发生的一切。然后，您可以使用这些分析来更好地运行您的组织：在系统紧急情况开始之前阻止它们，制定维护策略，恢复崩溃的服务器等。

### 关于 Grafana

[Grafana](https://grafana.com/grafana/)允许您查询、可视化、提醒和了解您的指标，无论它们存储在哪里。与您的团队一起创建、探索和共享仪表盘，培养数据驱动的文化。

## 启用 Monitoring

[管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)或[集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index#cluster-roles)可以配置 Rancher 部署 Prometheus，监控 Kubernetes 集群。

如果要设置 Alertmanager、Grafana 或 Ingress，必须在 Helm chart 部署上进行设置。在部署之外创建 Ingress 是有问题的。

### 先决条件

- 确保你允许你的每个节点在 9796 端口上的流量，因为 Prometheus 会从这里拉取指标。
- 确保你的集群满足资源要求。集群应该有至少 1950Mi 的可用内存，2700m 的 CPU 和 50Gi 的存储。

### 操作步骤

1. 在 Rancher UI 中，进入要安装监控的集群，然后单击**集群资源管理器**。
1. 单击**应用程序**。
1. 点击`rancher-monitoring`应用程序。
1. （可选）点击**图表选项**，配置警报、Prometheus 和 Grafana。如需帮助，请参阅[配置参考](/docs/rancher2/monitoring-alerting/2.5/configuration/_index)
1. 滚动到 Helm chart README 底部，点击**安装**。

**结果：**监控应用部署在`cattle-monitoring-system`命名空间中。

### 默认告警、目标和 Grafana 仪表盘

默认情况下，Rancher Monitoring 将 exporter（如 [node-exporter](https://github.com/prometheus/node_exporter) 和 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)）以及默认的 Prometheus 警报和 Grafana 仪表板（由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目策划）部署到集群上。

要查看默认的警报，请进入[查看 Alertmanager 中的活动警报](#查看-Alertmanager-中的活动警报)并点击展开所有组。

要查看你正在监控哪些服务，你需要查看你的目标。要查看默认目标，请参考[查看 Prometheus 目标](#查看-Prometheus-目标)。

要查看默认的仪表盘，请进入[Grafana UI](#grafana-ui)在左侧导航栏中，点击有四个方框的图标，然后点击**管理**。

### 下一步

要从 Rancher 用户界面配置 Prometheus 资源，请单击左上角的**Apps & Marketplace > Monitoring**。

## 使用监控

安装 "rancher-monitoring "后，在 Rancher 用户界面中可以使用以下仪表盘。

### Grafana UI

Rancher 允许任何通过 Kubernetes 认证并能够访问 Rancher 监控图部署的 Grafana 服务的用户通过 Rancher Dashboard UI 访问 Grafana。默认情况下，所有能够访问 Grafana 的用户都被赋予[Viewer](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#viewer-role)角色，允许他们查看 Rancher 部署的任何默认仪表板。

但是，如果有必要，用户可以选择以[Admin](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#admin-role)的身份登录 Grafana。Grafana 实例的默认 Admin 用户名和密码将是`admin`/`prom-operator`，但也可以在部署或升级图表时提供其他凭证。

要查看 Grafana 用户界面，安装`rancher-monitoring`。然后进入**群资源管理器.**在左上角，点击**群资源管理器>监控**然后点击 Grafana。

<figcaption>Grafana中的集群计算资源仪表盘</figcaption>

![Cluster Compute Resources Dashboard in Grafana](/img/rancher/cluster-compute-resources-dashboard.png)

<figcaption>Grafana中的默认仪表盘</figcaption>

![Default Dashboards in Grafana](/img/rancher/grafana-default-dashboard.png)

要允许 Grafana 仪表板在重启后持续存在，您需要将配置 JSON 添加到 ConfigMap 中。您可以使用 Rancher UI 将此配置添加到 ConfigMap 中。

### Prometheus UI

要查看 Prometheus 用户界面，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，点击**群组资源管理器>监控.**然后点击**Prometheus Graph**。

![Prometheus Graph UI](/img/rancher/prometheus-graph-ui.png)

### 查看 Prometheus 目标

要查看 Prometheus Targets，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，点击**群组资源管理器>监控.**然后点击**Prometheus Targets.**。

![Prometheus Targets UI](/img/rancher/prometheus-targets-ui.png)

### 查看 Prometheus 规则

要查看 Prometheus 规则，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，点击**群组资源管理器>监控.**然后点击**Prometheus 规则**。

![Prometheus Rules UI](/img/rancher/prometheus-rules-ui.png)

### 查看 Alertmanager 中的活动警报

安装`rancher-monitoring`后，部署了 Prometheus Alertmanager 用户界面。

Alertmanager 处理客户端应用程序（如 Prometheus 服务器）发送的警报。它负责重复复制、分组，并将它们路由到正确的接收器集成，如电子邮件、PagerDuty 或 OpsGenie。它还负责警报的沉默和抑制。

在 Alertmanager UI 中，您可以查看您的警报和当前 Alertmanager 配置。

要查看 Prometheus 规则，安装`rancher-monitoring`。然后进入**集群资源管理器.**在左上角，点击**集群资源管理器>监控.**然后点击**Alertmanager.**。

**结果：** Alertmanager 用户界面在新标签页中打开。有关配置方面的帮助，请参阅 [官方 Alertmanager 文档。](https://prometheus.io/docs/alerting/latest/alertmanager/)

![Alertmanager UI](/img/rancher/alertmanager-ui.png)

## 卸载监控

1. 从**集群资源管理器中**，单击应用程序和市场。
1. 单击**安装的应用程序**。
1. 进入`cattle-monitoring-system`命名空间，选中`rancher-monitoring-crd`和 `rancher-monitoring`的方框。
1. 点击**删除**。
1. 确认 **删除** 。

**结果：** `rancher-monitoring`被卸载。

## 配置资源限额和资源需求

资源请求和限制可以在安装`rancher-monitoring`时进行配置。

默认值在`rancher-monitoring`Helm 图表的[values.yaml](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/values.yaml)中。

下表中的默认值是最小的资源限制和请求。

| 资源名称                          | 内存限额   | CPU 限额  | 内存需求   | CPU 需求  |
| :-------------------------------- | :--------- | :-------- | :--------- | :-------- |
| alertmanager                      | 500Mi      | 1000m     | 100Mi      | 100m      |
| grafana                           | 200Mi      | 200m      | 100Mi      | 100m      |
| kube-state-metrics subchart       | 200Mi      | 100m      | 130Mi      | 100m      |
| prometheus-node-exporter subchart | 50Mi       | 200m      | 30Mi       | 100m      |
| prometheusOperator                | 500Mi      | 200m      | 100Mi      | 100m      |
| prometheus                        | 2500Mi     | 1000m     | 1750Mi     | 750m      |
| **Total**                         | **3950Mi** | **2700m** | **2210Mi** | **1250m** |

建议为资源预留至少 50GiB 存储空间。

## 已知问题

有一个[已知问题](https://github.com/rancher/rancher/issues/28787#issuecomment-693611821)，K3s 集群需要更多的默认内存。如果你在 K3s 集群上启用监控，我们建议将`prometheus.prometheusSpec.resources.memory.limit`设置为 2500Mi`和`prometheus.prometheusSpec.resources.memory.request`设置为 1750Mi。
