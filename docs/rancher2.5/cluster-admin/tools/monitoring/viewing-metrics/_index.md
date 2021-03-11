---
title: 查看指标
description: 在启用集群监控或项目监控后，您将希望开始查看正在收集的监控数据。有多种查看监控数据的方式。
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
  - 集群管理员指南
  - 集群工具
  - 监控
  - 查看指标
---

_自 v2.2.0 起可用_

在启用[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)或[项目监控](/docs/rancher2/project-admin/tools/monitoring/_index)后，您将希望开始查看正在收集的监控数据。有多种查看监控数据的方式。

## Rancher UI

> **注意：** 仅当您启用了[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)后，此方式才可用。[项目监控](/docs/rancher2/project-admin/tools/monitoring/_index)采集到的自定义指标必须使用项目监控部署的 Grafana 来进行查看。

Rancher 的指标线图在多个位置可用：

- **集群仪表盘**：在**全局**页面导航到某个集群。
- **节点指标**： 在**全局**页面导航到某个集群。点选**节点**，展开**节点指标**。
- **工作负载指标**：在**全局**页面导航到某个项目。在导航栏里下拉**资源**，选择**工作负载** (在早于 v2.3.0 的版本中，可直接在导航栏中选择**工作负载**) 。点选工作负载，展开**工作负载指标**。
- **Pod 指标**：在**全局**页面导航到某个项目。在导航栏里下拉**资源**，选择**工作负载** (在早于 v2.3.0 的版本中，可直接在导航栏中选择**工作负载**) 。点选单个工作负载，点选其**Pod 部分**，展开**Pod 指标**。
- **容器指标**： 在**全局**页面导航到某个项目。在导航栏里下拉**资源**，选择**工作负载** (在早于 v2.3.0 的版本中，可直接在导航栏中选择**工作负载**) 。点选单个工作负载。点选单个 Pod，点选其**Container 部分**，展开**Container 指标**。

上述的仪表盘会显示 Prometheus 收集到的监控数据。单击右边的 Grafana 图标，浏览器会打开一个新的页签，在 Grafana 里呈现这些监控数据。

在这些指标的 UI 组件里，有几种方法可以切换视图：

- 视图切换:
  - **详情：** 显示图形和 Chart，可以查看各个单元的指标。例如，在 **Pod 指标**的“内存使用率”的详情视图里，您可以看到各个容器的使用率折线，这可以帮助您进行对比分析。
  - **汇总：** 查看单元汇总后的指标。例如，在 **Pod 指标**的“内存使用率”的汇总视图里，您可以看到整个 Pod 的使用率折线，这可以帮助您分析这个 Pod 对内存使用的走势。
- 选择您正在查看的时间的范围，以查看更精确或更广阔的数据样本。
- 自定义时间以显示特定时间之间的数据。

分析这些指标时，不能仅关注 Chart 内的某时刻的单个独立指标。相反，您应该观察一段时间以确立“指标基准”。例如，首先对组件进行一段时间的操作，并观察相关指标，然后评估出能描述其为“健康”的指标值，最后建立可供日后度量的参考系。拥有指标基准后，可以注意 Chart 和图形中是否有较大的变化量，因为这些较大的变化通常表明组件可能存在问题，您需要进行调查。

## Grafana

在启用[集群监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)或[项目监控](/docs/rancher2/project-admin/tools/monitoring/_index)后，Rancher 会自动创建一条可跳转到 Grafana 实例的链接。Grafana 允许您查询，可视化，设置告警并最终了解您的集群和工作负载状态。有关 Grafana 及其功能的更多信息，请查看 [Grafana 网站](https://grafana.com/grafana)。

### 访问权限

Rancher 通过根据用户的[角色](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)，确定用户是否可以访问 Grafana 实例以及在其中可查看的数据。换句话说，用户在 Grafana 中的访问权限反映了他们在 Rancher 中的访问权限。

#### 集群级别 Grafana

如果您有集群中 System 项目的访问权限，则您可以访问集群级别 Grafana 实例。当您跳转到 Grafana 实例时，需要使用用户名`admin`和密码`admin`登录。第一次登录时，Grafana 将提示您更改密码。如果您的 Rancher 权限仅限于自己的项目（非 System 项目），您将无法在集群级别的 Grafana 实例中查看集群级别的指标。

#### 项目级别 Grafana

如果您的项目启用了项目监控，您可以在这个项目中的项目级别 Grafana 中查看指标。当您跳转到 Grafana 实例时，需要使用用户名`admin`和密码`admin`登录。第一次登录时，Grafana 将提示您更改密码。在这个项目级别的 Grafana 中，您只能查看到该项目中的工作负载的指标，例如 CPU，内存等。如果您配置了自定义指标，您也可以自己创建仪表盘来查看您的自定义指标。

> 注意：System 项目中不支持启用项目监控。

### 访问集群级别 Grafana 实例

1. 启动监控以后，在**全局**页面导航到某个集群。

1. 找到**系统**项目，这个项目运行着集群级别 Grafana 实例。

1. 单击**应用**菜单。

1. 点选`cluster-monitoring`应用。

1. 在`cluster-monitoring`应用中，有两个`/index.html`链接：一个连接到 Grafana 实例，另一个连接到 Prometheus 实例。当单击 Grafana 链接时，它将把您重定向到 Grafana 的新页面，其中显示了集群的指标。

1. 您可以使用用户名`admin`和密码`admin`登录 Grafana 实例。为了安全起见，建议更改密码。

**结果：** 您登录到 Grafana 里。登录后，您可以查看预设的 Grafana 仪表盘，这些仪表盘是通过[Grafana 设置机制](http://docs.grafana.org/administration/provisioning/#dashboards)导入的，因此您无法直接对它们进行修改。如果要修改这些仪表盘，请克隆仪表盘并修改副本。
