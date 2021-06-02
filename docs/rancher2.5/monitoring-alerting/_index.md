---
title: 监控和告警
description: description
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
  - 监控和告警
  - rancher2.5
---

## 概述

使用 Rancher，您可以在您的集群上快速部署领先的开源监控和告警解决方案。

Rancher v2.5 中引入的 `rancher-monitoring`operator 由[Prometheus](https://prometheus.io/)、[Grafana](https://grafana.com/grafana/)、[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)、[Prometheus 操作员](https://github.com/prometheus-operator/prometheus-operator)和[Prometheus 适配器](https://github.com/DirectXMan12/k8s-prometheus-adapter)驱动。

Rancher 的监控和告警解决方案（由[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)提供支持）允许用户执行以下操作：

- 通过[Prometheus](https://prometheus.io/)，监控您的集群节点、Kubernetes 组件和软件部署的状态和进程。

- 根据[Prometheus](https://prometheus.io/)收集的指标创建定义告警。

- 通过[Grafana](https://grafana.com/docs/grafana/latest/getting-started/)创建自定义仪表盘，使其能够轻松地将收集的指标可视化。

- 使用[Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)通过 Email、Slack、PagerDuty 等配置基于警报的通知。

- 根据[Prometheus](https://prometheus.io/)收集到的参数，预先计算出的经常需要/计算成本高的表达式定义为新的时间序列（仅在 2.5.x 中可用）。

- 通过[Prometheus Adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter)将从 Prometheus 收集到的指标暴露给 Kubernetes Custom Metrics API，以便在 HPA 中使用（仅在 2.5 中可用）。

关于部署到集群上以支持该解决方案的资源的更多信息，可以在 [`rancher-monitoring`](https://github.com/rancher/charts/tree/main/charts/rancher-monitoring) Helm Chart 中找到，该 Chart 密切跟踪 Prometheus 社区维护的上游 [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm Chart，并在 [CHANGELOG.md](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/CHANGELOG.md) 中跟踪某些变化。

如果您在 v2.5 之前在 Rancher 中启用了监控、警报或通知器，则没有升级路径可以切换到新的监控/警报解决方案。在通过集群资源管理器部署新的监控解决方案之前，您需要在集群管理器中禁用监控/警报/通知器。

有关 Rancher 2.5 中监控应用升级的更多信息，请参考[迁移文档](/docs/rancher2.5/monitoring-alerting/migrating/_index)。

启用监控之前，请务必确认[配置资源限额和资源需求](#配置资源限额和资源需求)中的默认值是所需的最小资源限制和请求。

## 关于 Prometheus

Prometheus 提供了你的数据的时间序列，根据[Prometheus](https://prometheus.io/docs/concepts/data_model/)

属于同一个度量和同一组标注维度的时间戳值流，以及被监控集群的综合统计和度量。

Prometheus 让您可以查看来自不同 Rancher 和 Kubernetes 对象的度量。使用时间戳，Prometheus 让您可以通过 Rancher UI 或 Grafana（与 Prometheus 一起部署的分析查看平台）以易于阅读的图形和可视化方式查询和查看这些指标。

通过查看 Prometheus 从集群 control-plane、节点和部署中抓取的数据，您可以随时了解集群中发生的一切。然后，您可以使用这些分析来更好地运行您的组织：在系统紧急情况开始之前阻止它们，制定维护策略，恢复崩溃的服务器等。

## 启用监控

[管理员](/docs/rancher2.5/admin-settings/rbac/global-permissions/_index)或[集群所有者](/docs/rancher2.5/admin-settings/rbac/cluster-project-roles/_index#cluster-roles)可以配置 Rancher 部署 Prometheus，监控 Kubernetes 集群。

如果要设置 Alertmanager、Grafana 或 Ingress，必须在 Helm chart 部署上进行设置。在部署之外创建 Ingress 是有问题的。

### 先决条件

- 确保你允许你的每个节点在 9796 端口上的流量，因为 Prometheus 会从这里拉取指标。
- 确保你的集群满足资源要求。集群应该有至少 1950Mi 的可用内存，2700m 的 CPU 和 50Gi 的存储。
- 在 RKE 集群中使用 RancherOS 或 Flatcar Linux 节点安装监控时，请将 etcd 节点证书的路径改为`/opt/rke/etc/kubernetes/ssl`。

### 操作步骤

#### 2.5.0-2.5.7

1. 在 Rancher UI 中，进入要安装监控的集群，然后单击**集群资源管理器**。
1. 单击**应用程序**。
1. 单击`rancher-monitoring`应用程序。
1. （可选）单击**Chart 选项**，配置警报、Prometheus 和 Grafana。如需帮助，请参阅[配置参考](/docs/rancher2.5/monitoring-alerting/configuration/_index)
1. 滚动到 Helm chart README 底部，单击**安装**。

**结果：**监控应用部署在`cattle-monitoring-system`命名空间中。

#### 2.5.8

**启用监控，以便在没有 SSL 的情况下使用**。

1. 在 Rancher 用户界面中，进入你想安装监控的集群，点击**集群浏览器**。
1. 单击**应用程序**。
1. 点击 `rancher-monitoring`应用程序。
1. 可选的。点击**图表选项**，配置警报、Prometheus 和 Grafana。如需帮助，请参考[配置参考。](/docs/rancher2.5/monitoring-alerting/configuration/_index)
1. 滚动到 Helm 图表 README 的底部，点击**安装**。

**结果：**监控应用被部署在`cattle-monitoring-system`命名空间。

**启用监控，以便与 SSL 一起使用**。

1. 按照[本页](/docs/rancher2.5/k8s-in-rancher/secrets/_index)上的步骤，创建一个密钥，以便 SSL 用于警报。

- 密钥应该在`cattle-monitoring-system`命名空间中创建。如果它不存在，先创建它。
- 将 `ca`、`cert`和`key`文件添加到密钥中。

1. 在 Rancher 用户界面中，进入你要安装监控的集群，点击**集群浏览器**。
1. 单击**应用程序**。
1. 点击`rancher-monitoring`应用程序。
1. 单击**警报**。
1. 单击**附加密钥**并添加先前创建的密钥。

**结果：**监控应用程序被部署在`cattle-monitoring-system`命名空间。

当[创建接收器时](/docs/rancher2.5/monitoring-alerting/configuration/alert-manager/_index)，支持 SSL 的接收器，如电子邮件或 webhook，将有一个**SSL**部分，有**CA 文件路径**、**Cert 文件路径和**密钥文件路径的字段。在这些字段中填写 "CA"、"cert "和 "key "的路径。路径的形式为`/etc/alertmanager/secrets/name-of-file-in-secret`。

例如，如果你用这些键值对创建了一个密钥。

```yaml
ca.crt=`base64-content`
cert.pem=`base64-content`
key.pfx=`base64-content`
```

那么**Cert 文件路径**将被设置为`/etc/alertmanager/secrets/cert.pem`。

### 默认告警、目标和 Grafana 仪表盘

默认情况下，Rancher Monitoring 将 exporter（如 [node-exporter](https://github.com/prometheus/node_exporter) 和 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)）以及默认的 Prometheus 警报和 Grafana 仪表板（由 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus) 项目策划）部署到集群上。

要查看默认的警报，请进入[查看 Alertmanager 中的活动警报](#查看-Alertmanager-中的活动警报)并单击展开所有组。

要查看你正在监控哪些服务，你需要查看你的目标。要查看默认目标，请参考[查看 Prometheus 目标](#查看-Prometheus-目标)。

要查看默认的仪表盘，请进入[Grafana UI](#grafana-ui)在左侧导航栏中，单击有四个方框的图标，然后单击**管理**。

### 下一步

要从 Rancher 用户界面配置 Prometheus 资源，请单击左上角的**Apps & Marketplace > Monitoring**。

## 支持 Windows 集群

_从 v2.5.8 版起可用_

当部署到 RKE1 Windows 集群时，Monitoring V2 现在会自动部署一个[windows-exporter](https://github.com/prometheus-community/windows_exporter) DaemonSet，并设置一个 ServiceMonitor 来收集每个部署的 Pod 的指标。这将为 Prometheus 提供`windows_`指标，与 Linux 主机的[node_exporter](https://github.com/prometheus/node_exporter)导出的`node_`指标相似。

为了能够完全部署 Windows 的 Monitoring V2，你的所有 Windows 主机必须有至少[wins](https://github.com/rancher/wins) v0.1.0 的版本。

有关如何在现有 Windows 主机上升级 wins 的更多细节，请参阅 [Windows 集群对监控 V2 的支持](/docs/rancher2.5/monitoring-alerting/windows-clusters/_index) 一节。

## 使用监控

安装 `rancher-monitoring`后，在 Rancher 用户界面中可以使用以下仪表盘。

### Grafana UI

[Grafana](https://grafana.com/grafana/)允许您查询、可视化、提醒和了解您的指标，无论它们存储在哪里。与您的团队一起创建、探索和共享仪表盘，培养数据驱动的文化。

Rancher 允许任何通过 Kubernetes 认证并能够访问 Rancher 监控图部署的 Grafana 服务的用户通过 Rancher Dashboard UI 访问 Grafana。默认情况下，所有能够访问 Grafana 的用户都被赋予[Viewer](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#viewer-role)角色，允许他们查看 Rancher 部署的任何默认仪表板。

但是，如果有必要，用户可以选择以[Admin](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#admin-role)的身份登录 Grafana。Grafana 实例的默认 Admin 用户名和密码将是`admin`/`prom-operator`，但也可以在部署或升级 Chart 时提供其他凭证。

要查看 Grafana 用户界面，安装`rancher-monitoring`。然后进入**群资源管理器.**在左上角，单击**群资源管理器>监控**然后单击 Grafana。

<figcaption>Grafana中的集群计算资源仪表盘</figcaption>

![Cluster Compute Resources Dashboard in Grafana](/img/rancher/cluster-compute-resources-dashboard.png)

<figcaption>Grafana中的默认仪表盘</figcaption>

![Default Dashboards in Grafana](/img/rancher/grafana-default-dashboard.png)

要允许 Grafana 仪表板在重启后持续存在，您需要将配置 JSON 添加到 ConfigMap 中。您可以使用 Rancher UI 将此配置添加到 ConfigMap 中。

### Prometheus UI

要查看 Prometheus 用户界面，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，单击**群组资源管理器>监控.**然后单击**Prometheus Graph**。

![Prometheus Graph UI](/img/rancher/prometheus-graph-ui.png)

### 查看 Prometheus 目标

要查看 Prometheus Targets，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，单击**群组资源管理器>监控.**然后单击**Prometheus Targets.**。

![Prometheus Targets UI](/img/rancher/prometheus-targets-ui.png)

### 查看 Prometheus 规则

要查看 Prometheus 规则，安装`rancher-monitoring`。然后进入**群组资源管理器.**在左上角，单击**群组资源管理器>监控.**然后单击**Prometheus 规则**。

![Prometheus Rules UI](/img/rancher/prometheus-rules-ui.png)

### 查看 Alertmanager 中的活动警报

安装`rancher-monitoring`后，部署了 Prometheus Alertmanager 用户界面。

Alertmanager 处理客户端应用程序（如 Prometheus 服务器）发送的警报。它负责重复复制、分组，并将它们路由到正确的接收器集成，如电子邮件、PagerDuty 或 OpsGenie。它还负责警报的沉默和抑制。

在 Alertmanager UI 中，您可以查看您的警报和当前 Alertmanager 配置。

要查看 Prometheus 规则，安装`rancher-monitoring`。然后进入**集群资源管理器.**在左上角，单击**集群资源管理器>监控.**然后单击**Alertmanager.**。

**结果：** Alertmanager 用户界面在新标签页中打开。有关配置方面的帮助，请参阅 [官方 Alertmanager 文档。](https://prometheus.io/docs/alerting/latest/alertmanager/)

![Alertmanager UI](/img/rancher/alertmanager-ui.png)

## 卸载监控

1. 从**集群资源管理器中**，单击应用程序和市场。
1. 单击**安装的应用程序**。
1. 进入`cattle-monitoring-system`命名空间，选中`rancher-monitoring-crd`和 `rancher-monitoring`的方框。
1. 单击**删除**。
1. 确认 **删除** 。

**结果：** `rancher-monitoring`被卸载。

> **关于持久化 Grafana 仪表盘的注意事项：**对于使用 Monitoring V2 v9.4.203 或以下版本的用户，卸载 Monitoring Chart 将删除 cattle-dashboards 命名空间，这将删除所有持久化的仪表盘，除非该命名空间被标记为注释`helm.sh/resource-policy。"keep"`。这个注释在 Monitoring V2 v14.5.100+中是默认添加的，但是如果你的集群中目前安装了旧版本的监控图，可以在卸载前手动应用到 cattle-dashboards 命名空间。

## 配置资源限额和资源需求

资源请求和限制可以在安装`rancher-monitoring`时进行配置。

默认值在`rancher-monitoring`Helm Chart 的[values.yaml](https://github.com/rancher/charts/blob/main/charts/rancher-monitoring/values.yaml)中。

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
