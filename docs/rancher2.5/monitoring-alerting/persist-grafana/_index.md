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

## 操作步骤

### v2.5.8 及之后

> **先决条件：**
>
> - 需要安装监控应用程序。
> - 要创建持久化仪表盘，你必须在包含 Grafana 仪表盘的项目或命名空间中至少有**管理配置地图**Rancher RBAC 权限分配给你。这与 "监控-仪表盘-编辑 "或 "监控-仪表盘-管理员 "的 Kubernetes 本地 RBAC 角色相关，这些角色由监控图暴露。
> - 要看到外部监控 UI 的链接，包括 Grafana 仪表盘，你至少需要一个[项目成员角色](/docs/rancher2.5/monitoring-alerting/rbac/_index)。
>   。

#### 1. 获取你想持久化的仪表盘的 JSON 模型

要创建一个持久化的仪表盘，你将需要获得你想要持久化的仪表盘的 JSON 模型。你可以使用一个预制的仪表盘或建立你自己的。

要使用一个预制的仪表盘，请到[https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards)，打开它的详细页面，并点击**下载 JSON**按钮，为下一步获取 JSON 模型。

要使用你自己的仪表盘。

1. 点击链接，打开 Grafana。从**集群浏览器**点击**集群浏览器 > 监控**。
1. 登录到 Grafana。注意：Grafana 实例的默认管理员用户名和密码是 "admin/prom-operator"。也可以在部署或升级图表时提供其他凭证。

   > **注意：**无论谁拥有密码，为了访问 Grafana 实例，你仍然需要在 Rancher 监控部署到的项目中至少有**管理服务**或**查看监控**的权限。在部署或升级图表时，也可以提供其他凭证。

1. 使用 Grafana 的用户界面创建一个仪表盘。一旦完成，通过点击顶部导航菜单中的齿轮图标进入仪表盘的设置。在左边的导航菜单中，点击**JSON 模型**。
1. 复制出现的 JSON 数据结构。

#### 2. 使用 Grafana 的 JSON 模型创建一个 ConfigMap

在包含 Grafana 仪表盘的命名空间中创建一个 ConfigMap（例如，默认情况下是 cattle-dashboards）。

该 ConfigMap 应该是这样的。

```yaml
apiVersion: v1
类型。配置图
metadata:
  标签。
    grafana_dashboard。"1"
  名称。<dashboard-name>（仪表盘名称
  namespace: cattle-dashboards # 如果使用非默认的命名空间，则进行更改
数据。
  <dashboard-name>.json。|-
    <copied-json>
```

默认情况下，Grafana 被配置为监视`cattle-dashboards`命名空间中带有`grafana_dashboard`标签的所有 ConfigMaps。

要指定你希望 Grafana 观察所有命名空间的 ConfigMaps，请参阅[本节](#configuring-namespaces-for-the-grafana-dashboard-configmap)

要在 Rancher UI 中创建 ConfigMap。

1. 转到集群资源管理器。
1. 单击**核心>配置地图**。
1. 单击**创建**。
1. 设置与上述例子类似的键值对。当输入`<dashboard-name>.json`的值时，单击**从文件中读取**以上传 JSON 数据模型作为值。
1. 单击**创建**。

**结果：**创建 ConfigMap 后，它应该显示在 Grafana UI 上，即使 Grafana pod 重新启动也会被持久化。

使用 ConfigMaps 持久化的仪表盘不能从 Grafana 用户界面中删除或编辑。

如果你试图在 Grafana UI 中删除仪表盘，你会看到错误信息 "仪表盘不能被删除，因为它被配置了"。要删除仪表盘，你将需要删除 ConfigMap。

#### 为 Grafana Dashboard ConfigMap 配置命名空间

要指定你希望 Grafana 在所有命名空间中观察 ConfigMaps，请设置。

```
grafana.sidecar.dashboards.searchNamespace=ALL
```

注意，监控图所暴露的添加 Grafana 仪表盘的 RBAC 角色仍然被限制在给予用户在`grafana.dashboards.namespace`中定义的命名空间中添加仪表盘的权限，默认为`cattle-dashboards`。

### v2.5.0-v2.5.8

#### 前提条件

- 已安装安装监控应用程序。
- 拥有 `cluster-admin` ClusterRole 的权限。

#### 操作步骤

1. 打开 Grafana 仪表盘。导航到**Cluster Explore > 群组资源管理器 > 监控**。
1. 登录到 Grafana，Grafana 实例的默认 Admin 用户名和密码为 "admin/prom-operator"。Rancher 中的集群管理员权限然需要访问 Grafana 实例。也可以在部署或升级 chart 时提供其他凭证。
1. 转到您要持久化的仪表板。在顶部导航菜单中，通过单击齿轮图标进入仪表板设置页面。
1. 在左侧导航菜单中，单击**JSON Model**。
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

**结果**：创建 ConfigMap 后，它应显示在 Grafana UI 上，即使重新启动 Grafana pod，它也会被持久化。

使用配置图持久化的仪表板不能从 Grafana UI 中删除。如果您尝试在 Grafana UI 中删除仪表板，您将看到错误消息 "Dashboard cannot be deleted because it was provisioned."。要删除仪表板，您需要删除 ConfigMap。

为了防止在卸载 Monitoring v2 时删除持久性仪表板，请在 `cattle-dashboards` 命名空间中添加以下注解。

```
helm.sh/resource-policy: "keep"
```

## 已知问题

对于使用 Monitoring V2 v9.4.203 或以下版本的用户，卸载 Monitoring 图表将删除`cattle-dashboards`命名空间，这将删除所有持久化的仪表盘，除非该命名空间被标记为注释`helm.sh/resource-policy。"keep"`。

在 Rancher v2.5.8 发布的新监控图中，这个注解将被默认添加，但对于早期 Rancher 版本的用户来说，仍然需要手动应用它。
