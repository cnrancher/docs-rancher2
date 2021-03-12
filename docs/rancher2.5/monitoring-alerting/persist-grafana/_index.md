---
title: 持久化Grafana仪表盘
description: 请将仪表板配置 JSON 添加到 ConfigMap 中，以允许在 Grafana 实例重启后，Grafana 仪表板持续存在。ConfigMaps 还允许使用基于 GitOps 或 CD 的方法部署仪表板。这允许将仪表板置于版本控制之下。
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

请将仪表板配置 JSON 添加到 ConfigMap 中，以允许在 Grafana 实例重启后，Grafana 仪表板持续存在。ConfigMaps 还允许使用基于 GitOps 或 CD 的方法部署仪表板。这允许将仪表板置于版本控制之下。

## 前提条件

- 已安装安装监控应用程序。
- 拥有 `cluster-admin` ClusterRole 的权限。

## 操作步骤

1. 打开 Grafana 仪表盘。导航到**Cluster Explore > 群组资源管理器 > 监控**。
1. 登录到 Grafana，Grafana 实例的默认 Admin 用户名和密码为 "admin/prom-operator"。Rancher 中的群集管理员权限然需要访问 Grafana 实例。也可以在部署或升级 chart 时提供其他凭证。
1. 转到您要持久化的仪表板。在顶部导航菜单中，通过点击齿轮图标进入仪表板设置页面。
1. 在左侧导航菜单中，点击**JSON Model**。
1. 复制出现的 JSON 数据结构。
1. 在`cattle-dashboards`命名空间中创建一个 ConfigMap。ConfigMap 需要有标签`grafana_dashboard: "1"`。将 JSON 按照下图所示格式粘贴到 ConfigMap 中。

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     labels:
       grafana_dashboard: "1"
     name: <dashboard-name>
     namespace: cattle-dashboards
   data:
     <dashboard-name>.json: |-
       <copied-json>
   ```

## 结果

创建 ConfigMap 后，它应显示在 Grafana UI 上，即使重新启动 Grafana pod，它也会被持久化。

使用配置图持久化的仪表板不能从 Grafana UI 中删除。如果您尝试在 Grafana UI 中删除仪表板，您将看到错误消息 "Dashboard cannot be deleted because it was provisioned."。要删除仪表板，您需要删除 ConfigMap。
