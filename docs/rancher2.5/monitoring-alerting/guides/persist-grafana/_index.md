---
title: 持久化 Grafana 仪表盘
---

为了让 Grafana 仪表盘在 Grafana 实例重启后仍然存在，请将仪表盘配置 JSON 添加到 ConfigMap 中。ConfigMap 还允许用基于 GitOps 或 CD 的方法来部署仪表盘。

- [创建一个持久化的 Grafana 仪表盘](#创建一个持久化的-grafana-仪表盘)
- [已知问题](#已知问题)

## 创建一个持久化的 Grafana 仪表盘

### Rancher v2.5.8+

> **前提条件：**
>
> - 需要安装监控应用程序。
> - 要创建持久化仪表盘，你必须在包含 Grafana 仪表盘的项目或命名空间中至少有 **Manage ConfigMaps** Rancher RBAC 权限。这与 Monitoring chart 公开的 `monitoring-dashboard-edit` 或 `monitoring-dashboard-admin` Kubernetes 原生 RBAC 角色相关。
> - 要查看外部监控 UI 的链接，包括 Grafana 仪表盘，你至少需要一个[项目成员角色。](/docs/rancher2.5/monitoring-alerting/rbac/_index#具有基于-rancher-cluster-manager-的权限的用户)

#### 1. 获取你想持久化的仪表盘的 JSON 模型

要创建一个持久化的仪表盘，你需要获得要持久化的仪表盘的 JSON 模型。你可以使用预制仪表盘或构建自己的仪表盘。

要使用一个预制的仪表盘，请到 [https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards) ，然后打开它的详细页面，并点击 **Download JSON** 按钮获取下一步的 JSON 模型。

要使用你自己的仪表盘：

1. 点击链接，打开 Grafana。从**集群浏览器，**点击**集群浏览器>监控。**
1. 登录到 Grafana。注意：Grafana 实例的默认管理员用户名和密码是 `admin/prom-operator`。也可以在部署或升级 chart 时提供其他凭证。

   > **注意：**无论谁拥有密码，为了访问 Grafana 实例，你需要在 Rancher 监控部署到的项目中时，至少拥有 **Manage Services** 或 **View Monitoring** 的权限。还可以在部署或升级 chart 时提供其他凭证。

1. 使用 Grafana UI 创建一个仪表盘。完成后，通过点击顶部导航菜单中的齿轮图标进入仪表盘的设置。在左边的导航菜单中，点击**JSON 模型**。
1. 复制出现 JSON 数据结构。

#### 2. 使用 Grafana 的 JSON 模型创建一个 ConfigMap

在 Grafana 仪表盘的命名空间中创建一个 ConfigMap（例如，默认为 cattle-dashboards）。

ConfigMap 看起来应该是这样的：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    grafana_dashboard: "1"
  name: <dashboard-name>
  namespace: cattle-dashboards # Change if using a non-default namespace
data:
  <dashboard-name>.json: |-
    <copied-json>
```

默认情况下，Grafana 监听 `cattle-dashboards` 命名空间中带有 `grafana_dashboard` 标签的所有 ConfigMap。

要指定 Grafana 在所有命名空间中监听 ConfigMap，请参阅[本节](#为-grafana-仪表盘-configmap-配置命名空间)

要在 Rancher UI 中创建 ConfigMap：

1. 转到群集资源管理器。
1. 单击**Core > ConfigMaps**。
1. 单击**创建**。
1. 设置与上述例子类似的键值对。当输入 `<dashboard-name>.json` 的值时，单击**从文件中读取**来上传 JSON 数据模型作为值。
1. 单击**创建**。

**结果：**创建 ConfigMap 后，它应该显示在 Grafana UI 上，即使 Grafana pod 重新启动也会被持久化。

使用 ConfigMaps 持久化的仪表盘不能从 Grafana UI 中删除或编辑。

如果你尝试在 Grafana UI 中删除仪表盘，你会看到错误信息 "Dashboard cannot be deleted because it was provisioned"。要删除仪表盘，你需要删除 ConfigMap。

#### 为 Grafana 仪表盘 ConfigMap 配置命名空间

要指定 Grafana 监听所有命名空间的 ConfigMap，请在 `rancher-monitoring` Helm chart 中设置如下值：

```
grafana.sidecar.dashboards.searchNamespace=ALL
```

请注意，监控 chart 公开的用于添加 Grafana 仪表盘的 RBAC 角色仅限于授予用户在 `grafana.dashboards.namespace` 中定义的命名空间中添加仪表盘的权限，该命名空间默认为 `cattle-dashboards`

### Rancher v2.5.8 之前

> **前提条件：**
>
> - 需要安装监控应用程序。
> - 你必须有 cluster-admin ClusterRole 权限。

1. 打开 Grafana 仪表盘。从**集群资源管理器中，**单击**集群资源管理器>监控**。
1. 登录到 Grafana。注意：Grafana 实例的默认管理员用户名和密码是 `admin/prom-operator`。你也可以在部署或升级 chart 时提供其他凭证。

   > **注意：**无论谁拥有密码，访问 Grafana 实例仍然需要 Rancher 中的集群管理员权限。

1. 转到你想要持久化的仪表盘。在顶部导航菜单中，通过点击齿轮图标进入仪表盘设置。
1. 在左边的导航菜单中，点击**JSON 模型**。
1. 复制出现的 JSON 数据结构。
1. 在 `cattle-dashboards` 命名空间中创建一个 ConfigMap。该 ConfigMap 需要有标签 `grafana_dashboard: "1"`. 将 JSON 粘贴到 ConfigMap 中，其格式如下图所示：
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

**结果：**创建 ConfigMap 后，它应该显示在 Grafana UI 上，即使 Grafana pod 重新启动也会被持久化。

使用 ConfigMaps 持久化的仪表盘不能从 Grafana UI 中删除。如果你试图在 Grafana UI 中删除仪表盘，你会看到错误信息 "Dashboard cannot be deleted because it was provisioned"。要删除仪表盘，你需要删除 ConfigMap。

为了防止 Monitoring v2 卸载后持久化仪表盘被删除，请在 `cattle-dashboards` 命名空间中添加以下注解：

```
helm.sh/resource-policy: "keep"
```

## 已知问题

对于使用 Monitoring V2 v9.4.203 或以下版本的用户，卸载 Monitoring chart 将删除 `cattle-dashboards` 命名空间，这将删除所有持久化的仪表盘，除非该命名空间被标记为注释 `helm.sh/resource-policy: "keep"`。

在 Rancher v2.5.8 发布的新监控 chart 中，这个注解将被默认添加，但对于早期 Rancher 版本的用户来说，仍然需要手动应用它。
