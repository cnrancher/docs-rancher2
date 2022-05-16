---
title: 基于角色的访问控制
shortTitle: RBAC
weight: 2
---
本节描述了 RBAC 在 Rancher Monitoring 中的作用。

- [集群管理员](#cluster-admins)
- [具有基于 Kubernetes ClusterRole 权限的用户](#users-with-kubernetes-clusterrole-based-permissions)
   - [具有 Kubernetes 管理员/编辑权限的用户](#users-with-kubernetes-admin-edit-permissions)
   - [具有 Kubernetes 查看权限的用户](#users-with-kubernetes-view-permissions)
   - [其他监控角色](#additional-monitoring-roles)
   - [其他监控集群角色](#additional-monitoring-clusterroles)
- [具有 Rancher 权限的用户](#users-with-rancher-based-permissions)
   - [与 2.5.x 的差异](#differences-in-2-5-x)
   - [分配其他访问权限](#assigning-additional-access)
- [Grafana 的基于角色的访问控制](#role-based-access-control-for-grafana)

# 集群管理员

默认情况下，只有具有 cluster-admin `ClusterRole` 的用户才能：

- 将 `rancher-monitoring` 应用安装到集群上，并在 Chart 部署上执行所有其他相关配置。
   - 例如，是否创建了默认仪表板，要将哪些 Exporter 部署到集群上以收集指标等。
- 通过 Prometheus CR 在集群中创建/修改/删除 Prometheus deployment。
- 通过 Alertmanager CR 在集群中创建/修改/删除 Alertmanager deployment。
- 通过在命名空间中创建 ConfigMap 来保留新的 Grafana 仪表板或数据源。
- 通过 `cattle-monitoring-system` 命名空间中的 Secret 将某些 Prometheus 指标暴露给 HPA 的 K8s Custom Metrics API。

# 具有基于 Kubernetes ClusterRole 权限的用户

`rancher-monitoring` Chart 安装了以下三个 `ClusterRole`。默认情况下，它们会聚合到相应的 K8s `ClusterRole` 中：

| ClusterRole | 聚合到默认的 K8s ClusterRole |
| ------------------------------| ---------------------------|
| `monitoring-admin` | `admin` |
| `monitoring-edit` | `edit` |
| `monitoring-view` | `view ` |

这些 `ClusterRole` 根据可执行的操作提供对 Monitoring CRD 的不同访问级别：

| CRD (monitoring.coreos.com) | Admin | Edit | View |
| ------------------------------| ---------------------------| ---------------------------| ---------------------------|
| <ul><li>`prometheuses`</li><li>`alertmanagers`</li></ul> | Get, List, Watch | Get, List, Watch | Get, List, Watch |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li><li>`prometheusrules`</li></ul> | * | * | Get, List, Watch |

在较高级别上，默认情况下会分配以下权限。

### 具有 Kubernetes 管理员/编辑权限的用户

只有具有 cluster-admin、admin 或 edit 的 `ClusterRole` 可以：

- 通过 ServiceMonitor 和 PodMonitor CR 修改 Prometheus deployment 的抓取配置。
- 通过 PrometheusRules CR 修改 Prometheus deployment 的告警/记录规则。

### 具有 Kubernetes 查看权限的用户

只有具有 Kubernetes `ClusterRole` 的用户可以：

- 查看集群内部署的 Prometheuses 的配置。
- 查看集群内部署的 Alertmanagers 的配置。
- 通过 ServiceMonitor 和 PodMonitor CR 查看 Prometheus deployment 的抓取配置。
- 通过 PrometheusRules CR 查看 Prometheus deployment 的告警/记录规则。

### 其他监控角色

Monitoring 还会创建其他 `Role`，这些角色默认情况下不会分配给用户，而是在集群中创建。你可以部署引用角色的 `RoleBinding` 来将角色绑定到命名空间。要使用 `kubectl` 而不是通过 Rancher 来定义 `RoleBinding`，请单击[此处](#assigning-roles-and-clusterroles-with-kubectl)。

管理员应使用这些角色为用户提供更细粒度的访问权限：

| 角色 | 用途 |
| ------------------------------| ---------------------------|
| monitoring-config-admin | 允许管理员为用户分配角色，以便查看/编辑 cattle-monitoring-system 命名空间中的 Secret 和 ConfigMap。修改此命名空间中的 Secret/ConfigMap 可以允许用户更改集群的 Alertmanager 配置、Prometheus Adapter 配置、其他 Grafana 数据源、TLS 密钥等。 |
| monitoring-config-edit | 允许管理员为用户分配角色，以便查看/编辑 cattle-monitoring-system 命名空间中的 Secret 和 ConfigMap。修改此命名空间中的 Secret/ConfigMap 可以允许用户更改集群的 Alertmanager 配置、Prometheus Adapter 配置、其他 Grafana 数据源、TLS 密钥等。 |
| monitoring-config-view | 允许管理员为用户分配角色，以便查看 cattle-monitoring-system 命名空间中的 Secret 和 ConfigMap。查看此命名空间中的 Secret/ConfigMap 可以允许用户观察集群的 Alertmanager 配置、Prometheus Adapter 配置、其他 Grafana 数据源、TLS 密钥等。 |
| monitoring-dashboard-admin | 允许管理员为用户分配角色，以便查看/编辑 cattle-dashboards 命名空间中的 ConfigMap。此命名空间中的 ConfigMap 将对应于持久化到集群上的 Grafana 仪表板。 |
| monitoring-dashboard-edit | 允许管理员为用户分配角色，以便查看/编辑 cattle-dashboards 命名空间中的 ConfigMap。此命名空间中的 ConfigMap 将对应于持久化到集群上的 Grafana 仪表板。 |
| monitoring-dashboard-view | 允许管理员为用户分配角色，以便查看 cattle-dashboards 命名空间中的 ConfigMap。此命名空间中的 ConfigMap 将对应于持久化到集群上的 Grafana 仪表板。 |

### 其他监控集群角色

Monitoring 还会创建其他 `ClusterRole`，这些角色默认情况下不会分配给用户，而是在集群中创建。默认情况下，这些角色不会聚合，但你可以部署引用角色的 `RoleBinding` 或 `ClusterRoleBinding` 来将角色绑定到命名空间。要使用 `kubectl` 而不是通过 Rancher 来定义 `RoleBinding`，请单击[此处](#assigning-roles-and-clusterroles-with-kubectl)。

| 角色 | 用途 |
| ------------------------------| ---------------------------|
| monitoring-ui-view | <a id="monitoring-ui-view"></a>_从 Monitoring v2 14.5.100+ 开始可用_。通过授权用户列出 Prometheus、Alertmanager 和 Grafana 端点，并通过 Rancher 代理向 Prometheus、Grafana 和 Alertmanager UI 进行 GET 请求，来允许用户对外部 Monitoring UI 进行只读访问。 |

### 使用 kubectl 分配 Role 和 ClusterRole

使用 Rancher 将 `Role` 或 `ClusterRole` 附加到用户或组的另一种方法，是在你创建的 YAML 文件中定义绑定。你必须首先使用 YAML 文件配置 `RoleBinding`，然后运行 `kubectl apply` 命令来应用配置更改。


* **Role**：以下 YAML 文件示例可帮助你在 Kubernetes 中配置 `RoleBinding`。你需要填写下方的 `name`（区分大小写）：

```
# monitoring-config-view-role-binding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: monitoring-config-view
  namespace: cattle-monitoring-system
roleRef:
  kind: Role
  name: monitoring-config-view
  apiGroup: rbac.authorization.k8s.io
subjects:
- kind: User
  name: u-b4qkhsnliz # this can be found via `kubectl get users -A`
  apiGroup: rbac.authorization.k8s.io
```

* **kubectl**：以下 `kubectl` 示例命令用于应用 YAML 文件中创建的绑定。如前所述，你需要相应地填写你的 YAML 文件名。

   * `kubectl apply -f monitoring-config-view-role-binding.yaml`


# 具有 Rancher 权限的用户

Rancher 部署的默认角色（即 cluster-owner、cluster-member、project-owner、project-member）、Kubernetes 默认角色，以及 rancher-monitoring Chart 部署的角色之间的关系如下：

<figcaption>默认 Rancher 权限和对应的 Kubernetes ClusterRole</figcaption>

| Rancher 角色 | Kubernetes 角色 | Monitoring ClusterRole/Role | ClusterRoleBinding/RoleBinding |
| --------- | --------- | --------- | --------- |
| cluster-owner | cluster-admin | N/A | ClusterRoleBinding |
| cluster-member | admin | monitoring-admin | ClusterRoleBinding |
| project-owner | admin | monitoring-admin | 项目命名空间中的 RoleBinding |
| project-member | edit | monitoring-edit | 项目命名空间中的 RoleBinding |

除这些默认角色之外，你还可以将以下的其他 Rancher 项目角色应用于集群成员，以提供对 Monitoring 的其他访问。这些 Rancher 角色将与 Monitoring Chart 部署的 ClusterRole 相关联：

<figcaption>非默认的 Rancher 权限和对应的 Kubernetes ClusterRole</figcaption>

| Rancher 角色 | Kubernetes ClusterRole | 可用 Rancher 版本 | 可用 Monitoring V2 版本 |
|--------------------------|-------------------------------|-------|------|
| 查看 Monitoring\* | [monitoring-ui-view](#monitoring-ui-view) | 2.4.8+ | 9.4.204+ |

\* 如果某个用户绑定了 Rancher 的 **View Monitoring** 角色，该用户只有在有 UI 链接时才有权访问外部 Monitoring UI。要访问 Monitoring Pane 以获取这些链接，用户必须是至少一个项目的项目成员。

### 2.5.x 中的差异

在 Rancher 2.5.x 中，分配了 project-member 或 project-owner 角色的用户将无法访问 Prometheus 或 Grafana，因为我们仅在集群级别创建 Grafana 或 Prometheus。

此外，虽然 project-owner 仍然只能添加默认在项目命名空间内抓取资源的 ServiceMonitor/PodMonitor，但 PrometheusRule 并不局限于单个命名空间/项目。因此，即使 project-owner 无法查看/编辑/删除在项目命名空间之外创建的任何规则，project-owner 在其项目命名空间内创建的任何告警规则或记录规则都将应用于整个集群。

### 分配其他访问权限

如果 cluster-admin 想要为不具有 rancher-monitoring chart 角色的用户提供 admin/edit 访问权限，则存在下表的潜在影响：

| CRD (monitoring.coreos.com) | 是否会在命名空间/项目之外造成影响 | 影响 |
|----------------------------| ------| ----------------------------|
| `prometheuses` | 是。该资源可以从整个集群中的任何目标中抓取指标（除非 Operator 本身进行了额外的配置）。 | 用户将能够定义应在集群中创建的新集群级 Prometheus deployment 的配置。 |
| `alertmanagers` | 否 | 用户将能够定义应在集群中创建的新集群级 Alertmanager deployment 的配置。注意：如果你只想允许用户配置路由和接收器等设置，你应该只提供对 Alertmanager Config Secret 的访问权限。 |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li></ul> | 否（默认）。可以通过 Prometheus CR 上的 `ignoreNamespaceSelectors` 进行配置。 | 用户将能够通过 Prometheus，在他们被授予此权限的命名空间内的 Service/Pod 暴露的端点上设置抓取。 |
| `prometheusrules` | 是。PrometheusRules 是集群范围的。 | 用户将能够根据在整个集群中收集的任何系列，在 Prometheus 上定义告警或记录规则。 |

| K8s 资源 | 命名空间 | 是否会在命名空间/项目之外造成影响 | 影响 |
|----------------------------| ------| ------| ----------------------------|
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-monitoring-system` | 是。此命名空间中的 Config 和 Secret 会影响整个监控/告警管道。 | 用户将能够创建或编辑 Secret/ ConfigMap，例如 Alertmanager Config、Prometheus Adapter 配置、TLS 密文、其他 Grafana 数据源等。这会对所有集群监控/告警产生广泛影响。 |
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-dashboards` | 是。此命名空间中的 Config 和 Secret 可以创建仪表板，对在集群级别收集的所有指标进行查询。 | 用户将能够创建仅保留新 Grafana 仪表板的 Secret/ConfigMap。 |



# Grafana 的基于角色的访问控制

对于经过 Kubernetes 认证并可以访问 Rancher Monitoring Chart 部署的 Grafana 服务的任何用户，Rancher 允许他们通过 Rancher Dashboard UI 访问 Grafana。默认情况下，所有能够访问 Grafana 的用户都被赋予 [Viewer](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#viewer-role) 角色，能查看 Rancher 部署的任何默认仪表板。

但是，如果有需要的话，用户可以选择以 [Admin](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#admin-role) 身份登录 Grafana。Grafana 实例的默认 Admin 用户名和密码是 `admin`/`prom-operator`，但你也可以在部署或升级 Chart 时替换凭证。

要查看 Grafana UI，请安装 `rancher-monitoring`。然后：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要可视化的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 点击 **Grafana**。

<figcaption>Grafana 中的集群计算资源仪表板</figcaption>
![Grafana 中的集群计算资源仪表板]({{<baseurl>}}/img/rancher/cluster-compute-resources-dashboard.png)

<figcaption>Grafana 中的默认仪表板</figcaption>
![Grafana 中的默认仪表板]({{<baseurl>}}/img/rancher/grafana-default-dashboard.png)