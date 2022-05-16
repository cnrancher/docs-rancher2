---
title: 自定义 Grafana 仪表板
weight: 5
---

在本文中，你将学习通过自定义 Grafana 仪表板来显示特定容器的指标。

### 前提

在自定义 Grafana 仪表板之前，你必须先安装 `rancher-monitoring` 应用。

要查看指向外部监控 UI（包括 Grafana 仪表板）的链接，你至少需要一个 [project-member 角色]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/rbac/#users-with-rancher-cluster-manager-based-permissions)。

### 登录 Grafana

1. 在 Rancher UI 中，转到要自定义的仪表板的集群。
1. 在左侧导航栏中，单击**监控**。
1. 单击 **Grafana**。Grafana 仪表板将在新选项卡中打开。
1. 转到左下角的登录图标，然后单击 **Sign In**。
1. 登录到 Grafana。Grafana 实例的默认 Admin 用户名和密码是 `admin/prom-operator`（无论谁拥有密码，都需要 Rancher 的集群管理员权限才能访问 Grafana 实例）。你还可以在部署或升级 Chart 时替换凭证。


### 获取支持 Grafana 面板的 PromQL 查询

对于任何面板，你可以单击标题并单击 **Explore** 以获取支持图形的 PromQL 查询。

例如，如果要获取 Alertmanager 容器的 CPU 使用率，点击 **CPU Utilization > Inspect**。

**Data** 选项卡将基础数据显示为时间序列，第一列是时间，第二列是 PromQL 查询结果。复制 PromQL 查询。

    ```
    (1 - (avg(irate({__name__=~"node_cpu_seconds_total|windows_cpu_time_total",mode="idle"}[5m])))) * 100

    ```

然后，你可以在 Grafana 面板中修改查询，或使用该查询创建新的 Grafana 面板。

参考：

- [编辑面板的 Grafana 文档](https://grafana.com/docs/grafana/latest/panels/panel-editor/)
- [向仪表板添加面板的 Grafana 文档](https://grafana.com/docs/grafana/latest/panels/add-a-panel/)