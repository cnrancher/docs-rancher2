---
title: 持久化 Grafana 仪表板
weight: 6
---

要在重启 Grafana 实例后保存 Grafana 仪表板，请将仪表板的配置 JSON 添加到 ConfigMap 中。ConfigMap 还支持使用基于 GitOps 或 CD 的方法来部署仪表板，从而让你对仪表板进行版本控制。

- [创建持久化 Grafana 仪表板](#creating-a-persistent-grafana-dashboard)
- [已知问题](#known-issues)

## 创建持久化 Grafana 仪表板

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="after"
values={[
{ label: 'Rancher 2.5.8+', value: 'after', },
{ label: 'Rancher 2.5.8 之前版本', value: 'before', },
]}>

<TabItem value="after">

> **前提**：
>
> - 已安装 Monitoring 应用。
> - 要创建持久化仪表板，你必须在包含 Grafana 仪表板的项目或命名空间中至少具有**管理 ConfigMap** 的 Rancher RBAC 权限。这与 Monitoring Chart 公开的 `monitoring-dashboard-edit` 或 `monitoring-dashboard-admin` Kubernetes 原生 RBAC 角色对应。
> - 要查看指向外部监控 UI（包括 Grafana 仪表板）的链接，你至少需要一个 [project-member 角色]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/rbac/#users-with-rancher-cluster-manager-based-permissions)。

### 1. 获取要持久化的仪表板的 JSON 模型

要创建持久化仪表板，你需要获取要持久化的仪表板的 JSON 模型。你可以使用预制仪表板或自行构建仪表板。

要使用预制仪表板，请转到 [https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards)，打开详细信息页面，然后单击 **Download JSON** 按钮来获取下一步所需的 JSON 模型。

要使用你自己的仪表板：

1. 点击链接打开 Grafana。在集群详细信息页面上，单击 **Monitoring**。
1. 登录到 Grafana。请注意，Grafana 实例的默认 Admin 用户名和密码是 `admin/prom-operator`。你还可以在部署或升级 Chart 时替换凭证。

   > **注意** ：无论谁拥有密码，你都需要在部署了 Rancher Monitoring 的项目中至少具有<b>管理服务</b>或<b>查看监控</b>的权限才能访问 Grafana 实例。你还可以在部署或升级 Chart 时替换凭证。
1. 使用 Grafana UI 创建仪表板。完成后，单击顶部导航菜单中的齿轮图标转到仪表板设置页面。在左侧导航菜单中，单击 **JSON Model**。
1. 复制出现的 JSON 数据结构。

### 2. 使用 Grafana JSON 模型创建 ConfigMap

在包含 Grafana 仪表板的命名空间中创建一个 ConfigMap（默认为 cattle-dashboards ）。

ConfigMap 与以下内容类似：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    grafana_dashboard: "1"
  name: <dashboard-name>
  namespace: cattle-dashboards # 如果不使用默认命名空间，则修改此值
data:
  <dashboard-name>.json: |-
    <copied-json>
```

默认情况下，Grafana 配置为监视 `cattle-dashboards` 命名空间中带有 `grafana_dashboard` 标签的所有 ConfigMap。

要让 Grafana 监视所有命名空间中的 ConfigMap，请参阅[本节](#configuring-namespaces-for-the-grafana-dashboard-configmap)。

要在 Rancher UI 中创建 ConfigMap：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要可视化的集群，然后单击 **Explore**。
1. 单击**更多资源 > 核心 > 配置映射**。
1. 单击**创建**。
1. 设置与上例类似的键值对。输入 `<dashboard-name>.json` 的值时，点击**从文件读取**并上传 JSON 数据模型。
1. 单击**创建**。

**结果**：创建 ConfigMap 后，即使 Grafana pod 重启了，ConfigMap 也能显示在 Grafana UI 上并持久化。

无法在 Grafana UI 中删除或编辑使用 ConfigMap 持久化了的仪表板。

如果你在 Grafana UI 中删除仪表板，你将看到 "Dashboard cannot be deleted because it was provisioned" 的错误消息。如需删除仪表板，你需要删除 ConfigMap。

### 为 Grafana 仪表板 ConfigMap 配置命名空间

要让 Grafana 监视所有命名空间中的 ConfigMap，请在 `rancher-monitoring` Helm chart 中指定以下值：

```
grafana.sidecar.dashboards.searchNamespace=ALL
```

请注意，Monitoring Chart 用于添加 Grafana 仪表板的 RBAC 角色仅能让用户将仪表板添加到定义在 `grafana.dashboards.namespace` 中的命名空间，默认为 `cattle-dashboards`。

</TabItem>
<TabItem value="before">

> **前提**：
>
> - 已安装 Monitoring 应用。
> - 你必须具有 cluster-admin ClusterRole 权限。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要在其中配置 Grafana 命名空间的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 点击 **Grafana**。
1. 登录到 Grafana。请注意，Grafana 实例的默认 Admin 用户名和密码是 `admin/prom-operator`。你还可以在部署或升级 Chart 时替换凭证。

   > **注意**：无论谁拥有密码，都需要 Rancher 的集群管理员权限才能访问 Grafana 实例。
1. 转到要进行持久化的仪表板。在顶部导航菜单中，通过单击齿轮图标转到仪表板设置。
1. 在左侧导航菜单中，单击 **JSON Model**。
1. 复制出现的 JSON 数据结构。
1. 在 `cattle-dashboards` 命名空间中创建一个 ConfigMap。ConfigMap 需要有 `grafana_dashboard: "1"` 标签。将 JSON 粘贴到 ConfigMap 中，格式如下例所示：

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

**结果**：创建 ConfigMap 后，即使 Grafana pod 重启了，ConfigMap 也能显示在 Grafana UI 上并持久化。

无法在 Grafana UI 中删除使用 ConfigMap 持久化了的仪表板。如果你在 Grafana UI 中删除仪表板，你将看到 "Dashboard cannot be deleted because it was provisioned" 的错误消息。如需删除仪表板，你需要删除 ConfigMap。

为防止在卸载 Monitoring v2 时删除持久化的仪表板，请将以下注释添加到 `cattle-dashboards` 命名空间：

```
helm.sh/resource-policy: "keep"
```

</TabItem>
</Tabs>

## 已知问题

如果你的 Monitoring V2 版本是 v9.4.203 或更低版本，卸载 Monitoring chart 将同时删除 `cattle-dashboards` 命名空间，所有持久化的仪表板将被删除（除非命名空间带有注释 `helm.sh/resource-policy: "keep"`）。

Rancher 2.5.8 发布的新 Monitoring Chart 中默认添加了该注解，但使用早期 Rancher 版本的用户仍需手动应用该注释。
