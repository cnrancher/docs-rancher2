---
title: 自定义 Grafana 仪表盘
---

在本节中，您将学习如何自定义 Grafana 仪表盘以显示适用于特定容器的指标。

## 先决条件

在你自定义 Grafana 仪表盘之前，必须安装 `rancher-monitoring` 应用程序。

要查看外部监控 UI 的链接，包括 Grafana 仪表盘，你至少需要一个[项目成员角色。](/docs/rancher2.5/monitoring-alerting/rbac/_index#具有基于-rancher-cluster-manager-的权限的用户)

## 登录到 Grafana

1. 在 Rancher UI 中，转到拥有你想自定义的仪表盘的集群。
1. 在左边的导航菜单中，点击**监控**。
1. 点击**Grafana.** Grafana 仪表盘应该在一个新的标签中打开。
1. 前往左下角的登录图标，点击**登录**。
1. 登录到 Grafana。Grafana 实例的默认管理员用户名和密码是`admin/prom-operator`。(无论谁拥有密码，仍然需要 Rancher 中的集群管理员权限才能访问 Grafana 实例。） 在部署或升级图表时也可以提供其他的凭证。

## 获取支持 PromQL 查询的 Grafana 面板的

对于任何面板，你可以点击标题并点击**Explore**来获取支持图形的 PromQL 查询。

在这个例子中，我们想获得 Alertmanager 容器的 CPU 使用率，所以我们点击**CPU 利用率>检查**。

在**数据**选项卡中显示了作为时间序列的基础数据，时间在第一列，PromQL 查询结果在第二列。

    ```
    (1 - (avg(irate({__name__=~"node_cpu_seconds_total|windows_cpu_time_total",mode="idle"}[5m])))) * 100
    ```

然后你可以修改 Grafana 面板中的查询，或者使用该查询创建一个新的 Grafana 面板。

也可以看看。

- [Grafana 编辑面板的文档](https://grafana.com/docs/grafana/latest/panels/panel-editor/)
- [关于向仪表盘添加面板的 Grafana 文档](https://grafana.com/docs/grafana/latest/panels/add-a-panel/)
