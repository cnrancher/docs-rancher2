---
title: Project Monitoring
weight: 2
aliases:
  - /rancher/v2.x/en/project-admin/tools/monitoring
  - /rancher/v2.x/en/monitoring-alerting/v2.0.x-v2.4.x/monitoring/project-monitoring
---

\_从 v2.2.4 开始提供。

## 概述

使用 Rancher，您可以通过与领先的开源监控解决方案[Prometheus](https://prometheus.io/)的集成，监控集群节点、Kubernetes 组件和软件部署的状态和进程。

## 监测范围

使用 Prometheus，您可以在 [群集级别]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/) 和项目级别上监控 Rancher。对于每个启用监控的集群和项目，Rancher 都会部署一个 Prometheus 服务器。

- [集群监控]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/)允许您查看 Kubernetes 集群的健康状况。Prometheus 从下面的集群组件中收集指标，你可以在图形和图表中查看这些指标。

  - [Kubernetes 控制平面]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/cluster-metrics/#kubernetes-components-metrics)
  - [etcd 数据库]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/cluster-metrics/#etcd-metrics)
  - [所有节点（包括 worker）]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/cluster-metrics/#cluster-metrics)

- 项目监控允许您查看特定项目中运行的 pod 的状态。Prometheus 从项目部署的 HTTP 和 TCP/UDP 工作负载中收集指标。

## 配置项目监测的权限

只有[管理员]({{<baseurl>}}/rancher/v2.x/en/admin-settings/rbac/global-permissions/)、[集群所有者或成员]({{<baseurl>}}/rancher/v2.x/en/admin-settings/rbac/cluster-project-roles/#cluster-roles)，或者[项目所有者]({{<baseurl>}}/rancher/v2.x/en/admin-settings/rbac/cluster-project-roles/#project-roles)可以配置项目级监控。项目成员只能查看监控指标。

## 启用项目监控

> **前提条件：**集群监控必须[启用]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/)

1. 转到应启用监控的项目。注意：启用群集监控后，**系统**项目中也默认启用监控。

1. 在导航栏中选择**工具 > 监视**。

1. 选择**启用**，显示[Prometheus 配置选项]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/prometheus/)。输入你需要的配置选项。

1. 点击**保存**。

## 项目级的监测资源需求

| 容器       | CPU 需求 | 内存需求 | CPU 限额 | 内存限额 | 是否可更改 |
| :--------- | :------- | :------- | :------- | :------- | :--------- |
| Prometheus | 750m     | 750Mi    | 1000m    | 1000Mi   | 是         |
| Grafana    | 100m     | 100Mi    | 200m     | 200Mi    | 否         |

**结果:**一个单一的应用程序 "项目监控"，作为一个[应用程序]({{<baseurl>}}/rancher/v2.x/en/catalog/apps/)添加到项目中。应用被 "激活 "后，可以通过[Rancher 仪表盘]({{<baseurl>}}/rancher/v2.x/en/monitoring-catalog/apps)开始查看[项目指标](#project-metrics)。 x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/#rancher-dashboard）或直接从[Grafana]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/#grafana)查看。)

> Grafana 实例的默认用户名和密码是`admin/admin`。然而，Grafana 仪表板是通过 Rancher 身份验证代理提供服务的，因此只有当前通过身份验证进入 Rancher 服务器的用户才能访问 Grafana 仪表板。

## 项目指标

如果在[集群级别]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/cluster-metrics/#workload-metrics)和
[项目级别]({{<baseurl>}}/rancher/v2.x/en/monitoring-alerting/legacy/monitoring/cluster-monitoring/)和[项目级](#enabling-project-monitoring)启用监控。

您可以从任何[导出器](https://prometheus.io/docs/instrumenting/exporters/)监控自定义指标。您还可以在部署上暴露一些自定义端点，而无需为项目配置 Prometheus。

> **示例：** 一个 [Redis](https://redis.io/)。
> 一个 [Redis](https://redis.io/) 应用程序被部署在项目`Datacenter`中的命名空间`redis-app`中。通过[Redis exporter](https://github.com/oliver006/redis_exporter)对其进行监控。启用项目监控后，您可以编辑应用程序来配置高级选项->自定义指标部分。输入 "容器端口 "和 "路径 "并选择 "协议"。

访问项目级 Grafana 实例。

1. 从**全球**视图中，导航到已启用监控的群集。

1. 转到已启用监控的项目。

1. 从项目视图中，单击**Apps**在 v2.2.0 之前的版本中，选择主导航栏上的**Catalog Apps**。

1. 进入 "项目监控 "应用程序。

1. 在 "项目监控 "应用程序中，有两个`/index.html`链接：一个指向 Grafana 实例，一个指向 Prometheus 实例。当你点击 Grafana 链接时，它会将你重定向到 Grafana 的新网页，该网页显示了集群的指标。

1. 您将自动登录到 Grafana 实例。默认用户名是`admin`，默认密码是`admin`。为了安全起见，我们建议您退出 Grafana，用`admin`密码重新登录，并更改密码。

**结果：**您将从 Grafana 实例登录到 Grafana。登录后，可以查看预设的 Grafana 仪表盘，这些仪表盘是通过[Grafana 供应机制](http://docs.grafana.org/administration/provisioning/#dashboards)导入的，所以不能直接修改。目前，如果您想配置自己的仪表盘，请克隆原来的仪表盘，然后修改新的副本。
