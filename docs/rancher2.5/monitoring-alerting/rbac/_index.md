---
title: 基于角色的访问控制
description: 本文介绍了 RBAC 在 Rancher 监控中起到的作用。
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
  - rancher 2.5
  - 监控和告警
  - RBAC
---

## 概述

本文介绍了 RBAC 在 Rancher 监控中起到的作用。

## 集群管理员

默认情况下，只有那些拥有集群管理员 `ClusterRole` 权限的人应该能够：

- 在集群上安装 `rancher-monitoring` 应用程序，并在 chart 部署中执行所有其他相关配置
  - 例如，是否创建默认的仪表盘，哪些 exporter 被部署到集群上以收集指标，等等。
- 通过 Prometheus CRs 创建/修改/删除集群中的 Prometheus deployment
- 通过 Alertmanager CRs 创建/修改/删除集群中的 Alertmanager deployment
- 通过在适当的命名空间创建 ConfigMaps 来保留新的 Grafana 仪表盘或数据源
- 通过 `cattle-monitoring-system` 命名空间中的 Secret，将某些 Prometheus 指标暴露给 HPA 的 k8s Custom Metrics API。

## 拥有基于 Kubernetes ClusterRole 的权限的用户

`rancher-monitoring` chart 安装了以下三个 `ClusterRole`。默认情况下，它们会聚合到相应的 k8s `ClusterRoles` 中:

| ClusterRole        | 默认 K8s ClusterRole |
| ------------------ | -------------------- |
| `monitoring-admin` | `admin`              |
| `monitoring-edit`  | `edit`               |
| `monitoring-view`  | `view `              |

这些 `ClusterRoles` 根据可以执行的操作，提供对监控 CRD 的不同访问级别：

| CRDs (monitoring.coreos.com)                                                        | Admin            | Edit             | View             |
| ----------------------------------------------------------------------------------- | ---------------- | ---------------- | ---------------- |
| <ul><li>`prometheuses`</li><li>`alertmanagers`</li></ul>                            | Get, List, Watch | Get, List, Watch | Get, List, Watch |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li><li>`prometheusrules`</li></ul> | \*               | \*               | Get, List, Watch |

在较高级别上，默认情况下会分配以下权限。

### 具有 Kubernetes Admin/Edit 权限的用户

只有拥有 cluster-admin、admin 或编辑 `ClusterRole` 的用户才可以：

- 通过 ServiceMonitor 和 PodMonitor CRs 修改 Prometheus deployments 的抓取配置
- 通过 PrometheusRules CRs 修改 Prometheus deployments 的告警/记录规则。

### 具有 Kubernetes View 权限的用户

只有那些拥有 Kubernetes `ClusterRole`的用户才可以：

- 查看集群内部署的 Prometheuses 的配置
- 查看部署在集群中的 Alertmanagers 的配置
- 通过 ServiceMonitor 和 PodMonitor CRs 查看 Prometheus deployments 的抓取配置
- 通过 PrometheusRules CRs 查看 Prometheus deployments 的告警/记录规则

### 额外的监控角色

监控还创建了额外的 `Roles`，默认情况下不分配给用户，而是在集群内创建。它们可以通过部署一个引用它的 `RoleBinding` 来绑定到一个命名空间。要用 `kubectl` 而不是通过 Rancher 定义 `RoleBinding`，请点击[这里]（#用-kubectl-分配角色和集群角色）。

管理员应使用这些角色为用户提供更细粒度的访问权限：

| 角色                       | 作用                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| monitoring-config-admin    | 允许管理员为用户分配角色，使其能够查看/修改 cattle-monitoring-system 命名空间中的 Secrets 和 ConfigMaps。在这个命名空间中修改 Secrets/ConfigMaps 可以让用户改变集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS secrets 等。 |
| monitoring-config-edit     | 允许管理员为用户分配角色，使其能够查看/修改 cattle-monitoring-system 命名空间中的 Secrets 和 ConfigMaps。在这个命名空间中修改 Secrets/ConfigMaps 可以让用户改变集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS secrets 等。 |
| monitoring-config-view     | 允许管理员为用户分配角色，使其能够查看 cattle-monitoring-system 命名空间中的 Secrets 和 ConfigMaps。在这个命名空间中查看 Secrets / ConfigMaps 可以让用户观察集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS secrets 等。    |
| monitoring-dashboard-admin | 允许管理员为用户分配角色，使其能够在 cattle-dashboards 命名空间中编辑/查看 ConfigMaps。这个命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana 仪表盘。                                                                                            |
| monitoring-dashboard-edit  | 允许管理员为用户分配角色，使其能够在 cattle-dashboards 命名空间中编辑/查看 ConfigMaps。这个命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana 仪表盘。                                                                                            |
| monitoring-dashboard-view  | 允许管理员为用户分配角色，使其能够查看 cattle-dashboards 命名空间中的 ConfigMaps。这个命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana 仪表盘。                                                                                                 |     |

### 额外的监控集群角色

监控还创建了额外的 `ClusterRoles`，这些角色默认不分配给用户，而是在集群内创建。 默认情况下，它们不会被聚合，但可以通过部署一个引用它的 `RoleBinding` 或 `ClusterRoleBinding` 来绑定到一个命名空间。要用 `kubectl` 而不是通过 Rancher 定义 `RoleBinding`，请点击[这里](#用-kubectl-分配角色和集群角色)。

| 角色               | 作用                                                                                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| monitoring-ui-view | <a id="monitoring-ui-view"></a>_从 Monitoring v2 14.5.100+_ 开始提供对外部 Monitoring UIs 的只读访问，给用户权限列出 Prometheus、Alertmanager 和 Grafana 端点，并通过 Rancher 代理对 Prometheus、Grafana 和 Alertmanager UIs 进行 GET 请求。 |

### 用 kubectl 分配角色和集群角色

使用 Rancher 将 `Role` 或 `ClusterRole` 附加到用户或组的另一种方法是通过在你创建的 YAML 文件中定义绑定关系。你必须先用 YAML 文件配置 `RoleBinding`，然后通过运行 `kubectl apply` 命令来应用配置变化。

**Roles**：下面是一个 YAML 文件的例子，帮助你在 Kubernetes 中配置 `RoleBindings` 并附加到一个用户。你需要填写下面的名字，名字是区分大小写的。

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

**kubectl**：下面是一个 `kubectl` 命令的例子，用于应用你在 YAML 文件中创建的绑定。如前所述，你需要相应地填写你的 YAML 文件名。

- \*\*`kubectl apply -f monitoring-config-view-role-binding.yaml`

## 具有基于 Rancher Cluster Manager 的权限的用户

Rancher Cluster Manager 部署的默认角色（即集群所有者、集群成员、项目所有者、项目成员）、默认的 Kubernetes 角色和 rancher-monitoring chart 部署的角色之间的关系详见下表：

默认的 Rancher 权限和对应的 Kubernetes 集群角色：

| Cluster Manager Role | k8s Role      | Monitoring ClusterRole / Role | ClusterRoleBinding or RoleBinding?   |
| -------------------- | ------------- | ----------------------------- | ------------------------------------ |
| cluster-owner        | cluster-admin | N/A                           | ClusterRoleBinding                   |
| cluster-member       | admin         | monitoring-admin              | ClusterRoleBinding                   |
| project-owner        | admin          | monitoring-admin              | RoleBinding within Project namespace |
| project-member       | edit          | monitoring-edit               | RoleBinding within Project namespace |

除了这些默认的角色，以下额外的 Rancher 项目角色可以应用于集群的成员，以提供对监控的额外访问。这些 Rancher 角色将与监控 chart 部署的 ClusterRoles 相关联：

非默认的 Rancher 权限和对应的 Kubernetes ClusterRoles：

| 集群管理员角色    | Kubernetes 集群角色                       | 在 Rancher 中可用 | 在 Monitoring v2 中可用 |
| ----------------- | ----------------------------------------- | ----------------- | ----------------------- |
| View Monitoring\* | [monitoring-ui-view](#monitoring-ui-view) | 2.4.8+            | 9.4.204+                |

\* 绑定到**View Monitoring** Rancher 角色的用户只有在提供链接到外部监控 UI 时才有权限访问这些 UI。为了访问 Cluster Explorer 上的监控来获得这些链接，用户必须是至少一个项目的项目成员。

### 2.5.x 中的差异

在 Rancher 2.5.x 中，分配了 project-member 或 project-owners 角色的用户将无法访问 Prometheus 或 Grafana，因为我们只在集群级创建 Grafana 或 Prometheus。

此外，虽然项目所有者仍然能添加 ServiceMonitors/PodMonitors，默认情况下，在他们项目的命名空间内抓取资源，但 PrometheusRules 并不局限于单个命名空间/项目。因此，项目所有者在其项目命名空间内创建的任何告警规则或记录规则将应用于整个集群，尽管他们将无法查看/编辑/删除任何在项目命名空间以外创建的规则。

### 分配额外的访问权限

如果集群管理员想为 rancher-monitoring chart 提供的角色之外的用户提供额外的管理/编辑权限，下表列出了潜在的影响：

| CRD (monitoring.coreos.com)                               | 能否在命名空间/项目之外造成影响？                                                 | 影响                                                                                                                                                         |
| --------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prometheuses`                                            | 是的，这个资源可以从整个集群的任何目标中抓取指标（除非运营商本身另有配置）。      | 用户将能够定义应在集群中创建的新集群级 Prometheus 部署的配置。                                                                                               |
| `alertmanagers`                                           | No                                                                                | 用户将能够定义集群中应创建的新集群级 Alertmanager 部署的配置。注意：如果你只想让用户配置路由和接收器等设置，你应该只提供对 Alertmanager 配置 Secret 的访问。 |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li></ul> | 不，不是默认的；这是可以通过 Prometheus CR 上的`ignoreNamespaceSelectors`配置的。 | 用户将能够通过 Prometheus 在他们被赋予此权限的命名空间内的 Service/Pod 暴露的端点上设置抓取。                                                                |
| `prometheusrules`                                         | 是的，PrometheusRules 是集群范围的。                                              | 用户将能够在 Prometheus 上根据在整个集群中收集的任何系列定义告警或记录规则。                                                                                 |

| k8s 资源                                         | 命名空间                   | 能否在命名空间/项目之外造成影响？                                                        | 影响                                                                                                                                                                |
| ------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-monitoring-system` | 是的，这个命名空间的 Configs 和 Secrets 可以影响整个监控/告警管道。                      | 用户将能够创建或编辑 Secret/ConfigMaps，如 Alertmanager 配置、Prometheus 适配器配置、TLS secrets 、额外的 Grafana 数据源等。这将对所有集群的监控/告警产生广泛影响。 |
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-dashboards`        | 是的，这个命名空间的 Configs 和 Secrets 可以创建仪表盘，对集群级收集的所有指标进行查询。 | 用户将能够创建 Secrets/ConfigMaps，只保留新的 Grafana 仪表盘。                                                                                                      |

## Grafana 的基于角色的访问控制

Rancher 允许任何通过 Kubernetes 认证并能访问 Rancher Monitoring chart 部署的 Grafana 服务的用户通过 Rancher 仪表盘 UI 访问 Grafana。默认情况下，所有能够访问 Grafana 的用户都被赋予 [Viewer](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#viewer-role) 角色，这允许他们查看 Rancher 部署的任何默认仪表盘。

然而，如果有必要，用户可以选择以[管理员](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#admin-role)身份登录 Grafana。Grafana 实例的默认管理员用户名和密码将是`admin`/`prom-operator`，但在部署或升级 chart 时也可以提供其他凭证。

要查看 Grafana UI，请安装 `rancher-monitoring`。然后进入**集群浏览器。**在左上角，点击**集群浏览器>监控。**然后点击**Grafana**。

Grafana 中的集群计算资源仪表盘：
![Grafana中的集群计算资源仪表盘](/img/rancher/cluster-compute-resources-dashboard.png)

Grafana 中的默认仪表盘：
![Grafana中的默认仪表盘](/img/rancher/grafana-default-dashboard.png)
