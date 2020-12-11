---
title: 监控
---

_v2.2.4 或更新版本可用_

您可以通过 Rancher 和 [Prometheus](https://prometheus.io/) 的集成，监控集群节点、Kubernetes 组件或工作负载的状态。

> 如需了解更多关于 Prometheus 的信息，请参考[Prometheus 的工作原理](/docs/rancher2/cluster-admin/tools/monitoring/_index)。

## 监控范围

Prometheus 监控可以应用于 Rancher [集群层级](/docs/rancher2/cluster-admin/tools/monitoring/_index)和 Rancher 项目层级。Rancher 为每一个启用了监控功能的集群和项目都部署了一个对应的 Prometheus Server。

- [集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)允许用户查看 Kubernetes 集群的健康状况。Prometheus 从以下的集群组件中收集健康数据，用户可以通过 Rancher 用户界面的图表查看集群的健康状况。

  - [Kubernetes 监控指标](/docs/rancher2/cluster-admin/tools/monitoring/cluster-metrics/_index#kubernetes-components-metrics)
  - [etcd 数据库](/docs/rancher2/cluster-admin/tools/monitoring/cluster-metrics/_index#etcd-metrics)
  - [全部节点（包括 worker 节点）](/docs/rancher2/cluster-admin/tools/monitoring/cluster-metrics/_index#cluster-metrics)

* 项目监控允许用户查看项目内 Pod 的运行状态。项目级别的 Prometheus 可以从通过 HTTP(S)协议采集，项目中部署的工作负载的自定义指标。

> **提示：** 如果集群开启了[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)，您不需要开启项目监控也可以在 Rancher UI 中查看工作负载的资源使用相关的指标，如 CPU 和内存等。但是项目管理员和项目成员无法访问 Grafana 查看指标，并且也无法采集自定义指标。

## 配置项目监控的权限

只有[管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)、[集群所有者或集群成员](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index#cluster-roles)和[项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index#project-roles)可以配置项目层级的监控。项目成员可以查看监控参数，不可以修改监控参数。

## 开启项目监控

> **注意：** 如果需要查看 Pod 资源使用相关的指标，您需要先开启[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)。否则您只能通过项目监控采集自定义指标。

1. 打开需要启用项目监控功能的项目。

1. 在导航栏选择**工具 > 监控**。

1. 选择 **启用**，控制台上会出现[Prometheus 配置选项](/docs/rancher2/cluster-admin/tools/monitoring/prometheus/_index)，输入您需要配置的监控参数。

1. 单击**保存**，保存修改后的参数配置。

## 项目层级监控资源要求

| 容器       | CPU 资源需求 | 内存资源需求 | CPU 资源限制 | 内存限制 | 是否可以修改 |
| ---------- | ------------ | ------------ | ------------ | -------- | ------------ |
| Prometheus | 750m         | 750Mi        | 1000m        | 1000Mi   | 是           |
| Grafana    | 100m         | 100Mi        | 200m         | 200Mi    | 否           |

**结果：**完成监控资源配置以后，Rancher 会把一个叫做`project-monitoring`的项目层级监控，以[应用商店应用](/docs/rancher2/helm-charts/legacy-catalogs/launching-apps/_index)的形式添加到了项目中。当这个应用的状态变成了`active` ，您可以通过 [Rancher UI](/docs/rancher2/cluster-admin/tools/monitoring/_index#rancher-dashboard) 查看项目的监控指标，或者直接从[Grafana](/docs/rancher2/cluster-admin/tools/monitoring/_index#grafana)查看项目的监控指标。

> Grafana 实例的默认用户名和密码为 "admin/admin"。然而，Grafana 仪表板是通过 Rancher 认证代理提供服务的，因此只有当前通过认证进入 Rancher 服务器的用户才能访问 Grafana 仪表板。

## 项目监控指标

在激活了项目监控后，在部署工作负载的页面，您可以配置自定义指标端点，从而使项目监控可以采集到自定义指标。当然，您可以通过部署任何 Prometheus [exporters](https://prometheus.io/docs/instrumenting/exporters/)，并在 Rancher 中配置相应的自定义端点，从而监控您的服务。

> **示例：**
> 项目中有一个命名空间叫 `redis-app` ，这个命名空间中部署了一个 [Redis](https://redis.io/) 应用。您可以通过部署 [Redis exporter](https://github.com/oliver006/redis_exporter) 监控这个应用。开启了项目监控以后，您可以编辑 Redis exporter 工作负载，配置**高级选项 -> 自定义参数**。输入暴露指标的`端口` 和 `路径`，然后选择`协议`。

访问项目层级的 Grafana 实例需要执行以下步骤：

1. 从**全局**视图找到到已经开启监控的集群。

1. 打开这个集群中已经开启监控的项目。

1. 打开项目视图，单击**应用商店**。

1. 打开`project-monitoring`应用。

1. 在`project-monitoring`里面，有两个以`/index.html`结尾的链接，分别连接了 Prometheus 实例和 Grafana 实例。单击 Grafana 实例的链接，会打开一个新的页面，里面有集群的监控参数。

1. 您会自动跳转到 Grafana UI。如果需要以管理员身份登录 Grafana，您需要在 Grafana 页面手动登录。默认的 Grafana 管理员的用户名和密码都是`admin`。为了保证 Grafana 实例的安全，建议您在登入后，先修改密码，然后再开始使用 Grafana 实例。

**结果：** 您通过 Grafana 实例登录 Grafana，登录后，您可以查看通过[Grafana Provisioning 机制](http://docs.grafana.org/administration/provisioning/#dashboards)导入的，已经设置好的的 Grafana 仪表盘。如果您需要修改或创建自己的仪表盘，您需要先登录 Grafana。我们建议您先复制原有的 Grafana 仪表盘，通过它创建一个副本，再通过修改副本的参数，达到创建自己的仪表盘的目的。
