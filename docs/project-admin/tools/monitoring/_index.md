---
title: 监控
---

_v2.2.4 或更新版本可用_

您可以通过 Rancher 和 Prometheus 的集成，监控集群节点、Kubernetes 组件或软件部署的状态和进程。

> 如需了解更多关于 Prometheus 的信息，请参考[Prometheus 的工作原理](/docs/cluster-admin/tools/monitoring/_index#about-prometheus)。

## 监控范围

Prometheus 监控可以应用于 Ranche [集群层级](/docs/cluster-admin/tools/monitoring/_index)和 Rancher 项目层级。Rancher 为每一个启用了监控功能的集群和项目都部署了一个对应的 Prometheus server。

- [集群监控](/docs/cluster-admin/tools/monitoring/_index)允许用户查看 Kubernetes 集群的健康状况。Prometheus 从以下的集群组件中收集健康数据，用户可以通过 Rancher 用户界面的图表查看集群的健康状况。

  - [Kubernetes 监控指标](/docs/cluster-admin/tools/monitoring/cluster-metrics/_index#kubernetes-components-metrics)
  - [etcd 数据库](/docs/cluster-admin/tools/monitoring/cluster-metrics/_index#etcd-metrics)
  - [全部节点（包括 worker 节点）](/docs/cluster-admin/tools/monitoring/cluster-metrics/_index#cluster-metrics)

* 项目监控允许用户查看项目内 pod 的运行状态。Prometheus 从项目部署的 HTTP 和 TCP/UDP 工作负载中收集数据。

## 配置项目监控的许可

只有[管理员](/docs/admin-settings/rbac/global-permissions/_index)、[集群所有者或集群成员](/docs/admin-settings/rbac/cluster-project-roles/_index#cluster-roles)和 [项目所有者](/docs/admin-settings/rbac/cluster-project-roles/_index#project-roles) 可以配置项目层级的监控。项目成员可以查看监控参数，不可以修改监控参数。

## 开启项目监控

> **前提条件：** 开启项目监控前，您需要先开启[集群监控](/docs/cluster-admin/tools/monitoring/_index)。

1. 打开需要启用项目监控功能的项目。

   > 如果含有这个项目的集群已经启用了集群监控，默认会一并启用项目层级的监控功能。

1. 在导航栏选择**工具 > 监控**。

1. 选择 **启用**，控制台上会出现[Prometheus 配置选项](/docs/cluster-admin/tools/monitoring/prometheus/_index)，输入你需要配置的监控参数。

1. 单击**保存**，保存修改后的参数配置。

## 项目层级监控资源要求

| 容器       | CPU 资源需求 | 内存资源需求 | CPU 资源限制 | 内存限制 | 是否可以修改 |
| ---------- | ------------ | ------------ | ------------ | -------- | ------------ |
| Prometheus | 750m         | 750Mi        | 1000m        | 1000Mi   | 是           |
| Grafana    | 100m         | 100Mi        | 200m         | 200Mi    | 否           |

**结果：**完成监控资源配置以后，Rancher 会把一个叫做`project-monitoring` 的项目层级监控，以[应用](/docs/catalog/apps/_index) 的形式添加到了项目中。当这个应用的状态变成了`active` ，您可以通过 [Rancher dashboard](/docs/cluster-admin/tools/monitoring/_index#rancher-dashboard) 查看项目的监控指标，或者直接从[Grafana](/docs/cluster-admin/tools/monitoring/_index#grafana)查看项目的监控指标。

## Project Metrics 项目监控指标

如果您已经启用了[集群层级](/docs/cluster-admin/tools/monitoring/_index)和[项目层级](#开启项目监控)的的监控功能，[工作负载监控指标](/docs/cluster-admin/tools/monitoring/cluster-metrics/_index#workload-metrics)可用于项目监控。

您可以从[Prometheus exporters](https://prometheus.io/docs/instrumenting/exporters/)监控自定义的监控指标。您也可以暴露一些部署里面的自定义端点，而不需要修改 Prometheus 的参数，适配您的项目。

> **示例：**
> 项目中有一个命名空间叫`redis-app` ，这个命名空间中部署了一个[Redis](https://redis.io/)应用。您可以通过[Redis exporter](https://github.com/oliver006/redis_exporter)监控这个应用。开启了项目监控以后，您可以编辑应用，配置<b>高级选项 -> 自定义参数</b> 。输入`容器端口` 和 `路径`，然后选择`协议`。

访问项目层级的 Grafana 实例需要执行以下步骤：

1. 从 **全局**视图找到到已经开启监控的集群。

1. 打开这个集群中已经开启监控的项目。

1) 打开项目视图，单击**应用**。如果您使用的是 Rancher v2.2.0 以前的版本，请在主导航栏中选择**目录应用**。

1) 打开`项目监控` 应用。

1) 在`项目监控`里面，有两个以`/index.html`结尾的链接，分别连接了 Prometheus 实例和 Grafana 实例。单击 Grafana 实例的链接，会打开一个新的页面，里面有集群的监控参数。

1) 您会自动登录进 Grafana 实例。默认用户名和密码都是`admin`。为了保证 Grafana 实例的安全，建议您先登出 Grafana 实例，重新登入后修改密码，然后再开始使用 Grafana 实例。

**结果：**您通过 Grafana 实例登录 Grafana。登录后，您可以查看通过[Grafana provisioning mechanism](http://docs.grafana.org/administration/provisioning/#dashboards)导入的，已经设置好的的 Grafana dashboards。您不可以直接修改栎社的配置。如果您需要创建自己的 dashboards，请先复制原有的 Grafana dashboard，创建一个副本，再通过修改副本的参数，达到创建自己的 dashboards 的目的。
