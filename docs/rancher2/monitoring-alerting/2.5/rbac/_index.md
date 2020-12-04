---
title: RBAC
description: description
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

## 概述

本文介绍了 RBAC 在 Rancher 监控中起到的作用。

## 集群管理员

默认情况下，只有那些拥有 cluster-admin`ClusterRole`的人才能做到。

- 在集群上安装 "rancher-monitoring "App，并在图表部署上进行所有其他相关配置。
  - 例如，是否创建了默认的仪表盘，在集群上部署了哪些导出器来收集指标等。
- 通过 Prometheus CRs 在集群中创建/修改/删除 Prometheus 部署。
- 通过 Alertmanager CRs 在集群中创建/修改/删除 Alertmanager 部署。
- 通过在适当的命名空间中创建 ConfigMaps 来坚持新的 Grafana 仪表盘或数据资源。
- 通过`cattle-monitoring-system`命名空间中的秘密，将某些 Prometheus 指标暴露给 HPA 的 K8s 自定义指标 API。

## 具有基于 k8s 集群角色的权限的用户

`rancher-monitoring`图表安装了以下三个`ClusterRoles`。默认情况下，它们会聚集到相应的 k8s`ClusterRoles`中。

| ClusterRole        | 默认的 K8s ClusterRole |
| ------------------ | ---------------------- |
| `monitoring-admin` | `admin`                |
| `monitoring-edit`  | `edit`                 |
| `monitoring-view`  | `view `                |

这些 "群组角色 "根据可以执行的行动，提供了对监测 CRD 的不同级别的访问。

| CRDs (monitoring.coreos.com)                                                        | Admin            | Edit             | View             |
| ----------------------------------------------------------------------------------- | ---------------- | ---------------- | ---------------- |
| <ul><li>`prometheuses`</li><li>`alertmanagers`</li></ul>                            | Get, List, Watch | Get, List, Watch | Get, List, Watch |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li><li>`prometheusrules`</li></ul> | \*               | \*               | Get, List, Watch |

在高层次上，以下权限是默认分配的结果。

### 拥有 k8s admin/edit 权限的用户

只有那些拥有集群-admin/admin/编辑`ClusterRole`的人才能做到。

- 通过 ServiceMonitor 和 PodMonitor CRs 修改 Prometheus 部署的刮擦配置。
- 通过 PrometheusRules CRs 修改 Prometheus 部署的警报/记录规则。

### 拥有 k8s view 权限的用户

只有那些有一些 k8s`ClusterRole`的人应该可以。

- 查看部署在集群内的 Prometheuses 的配置。
- 查看部署在集群中的警报器管理员的配置。
- 通过 ServiceMonitor 和 PodMonitor CRs 查看 Prometheus 部署的刮擦配置。
- 通过 PrometheusRules CRs 查看 Prometheus 部署的警报/记录规则。

## 其他角色的权限说明

监测还创建了六个额外的 "角色"，这些角色不是默认分配给用户的，而是在集群内创建的。管理员应使用这些角色为用户提供更精细的访问。

| 角色                       | 目的                                                                                                                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| monitoring-config-admin    | 允许管理员给用户分配角色，使其能够查看/修改 cattle-monitoring-system 命名空间内的 Secrets 和 ConfigMaps。在这个命名空间中修改 Secrets / ConfigMaps 可以让用户改变集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS 秘密等。 |
| monitoring-config-edit     | 允许管理员给用户分配角色，使其能够查看/修改 cattle-monitoring-system 命名空间内的 Secrets 和 ConfigMaps。在这个命名空间中修改 Secrets / ConfigMaps 可以让用户改变集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS 秘密等。 |
| monitoring-config-view     | 允许管理员给用户分配角色，使其能够在 cattle-monitoring-system 命名空间内查看 Secrets 和 ConfigMaps。在这个命名空间中查看秘密/配置图可以让用户观察集群的 Alertmanager 配置、Prometheus 适配器配置、额外的 Grafana 数据源、TLS 秘密等。                 |
| monitoring-dashboard-admin | 允许管理员将角色分配给用户，以便能够编辑/查看 cattle-dashboards 命名空间中的 ConfigMaps。该命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana Dashboards。                                                                                      |
| monitoring-dashboard-edit  | 允许管理员将角色分配给用户，以便能够编辑/查看 cattle-dashboards 命名空间中的 ConfigMaps。该命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana Dashboards。                                                                                      |
| monitoring-dashboard-view  | 允许管理员将角色分配给用户，以便能够查看 cattle-dashboards 命名空间内的 ConfigMaps。此命名空间中的 ConfigMaps 将对应于持久化到集群上的 Grafana Dashboards。                                                                                           |

## 具有基于 Rancher 群集管理器权限的用户

Rancher 集群管理器部署的默认角色（即集群-所有者、集群-成员、项目-所有者、项目-成员）、默认的 k8s 角色和 rancher-监控图部署的角色之间的关系详见下表。

| Cluster Manager Role | k8s Role      | Monitoring ClusterRole / Role | ClusterRoleBinding or RoleBinding?   |
| -------------------- | ------------- | ----------------------------- | ------------------------------------ |
| cluster-owner        | cluster-admin | N/A                           | ClusterRoleBinding                   |
| cluster-member       | admin         | monitoring-admin              | ClusterRoleBinding                   |
| project-owner        | edit          | monitoring-admin              | RoleBinding within Project namespace |
| project-member       | view          | monitoring-edit               | RoleBinding within Project namespace |

### 2.5.x 中的差异

在 Rancher 2.5.x 中，分配了项目成员或项目所有者角色的用户将无法访问 Prometheus 或 Grafana，因为我们只在集群级别创建 Grafana 或 Prometheus。

此外，虽然项目所有者仍然只能添加默认在其项目的命名空间内搜刮资源的 ServiceMonitors/PodMonitors，但 PrometheusRules 的范围并不限于单个命名空间/项目。因此，项目所有者在其项目命名空间内创建的任何警报规则或记录规则将适用于整个集群，尽管他们将无法查看/编辑/删除在项目命名空间之外创建的任何规则。

### 分配额外的权限

如果群集管理员想为 rancher-监控图提供的角色之外的用户提供额外的管理/编辑访问权限，下表确定了潜在的影响。

| CRDs (monitoring.coreos.com)                              | 它是否会在命名空间/项目之外造成影响？                                                   | 影响                                                                                                                                                                           |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prometheuses`                                            | 是的，此资源可以从整个群集的任何目标中刮取指标（除非操作员本身另有配置）。              | 用户将能够定义新的集群级 Prometheus 部署的配置，应该在集群中创建。                                                                                                             |
| `alertmanagers`                                           | 否                                                                                      | 用户将能够定义应该在集群中创建的新集群级 Alertmanager 部署的配置。注意：如果你只是想让用户配置路由和接收器等设置，你应该只提供对 Alertmanager Config Secret 的访问权限来代替。 |
| <ul><li>`servicemonitors`</li><li>`podmonitors`</li></ul> | 没有，默认情况下没有；这可以通过 Prometheus CR 上的`ignoreNamespaceSelectors`进行配置。 | 用户将能够在他们被赋予此权限的命名空间内，在服务/Pod 暴露的端点上设置 Prometheus 的拉取。                                                                                      |
| `prometheusrules`                                         | 是的，PrometheusRules 的作用范围在集群内。                                              | 用户将能够根据整个集群收集的任何系列在 Prometheus 上定义警报或记录规则。                                                                                                       |

| k8s Resources                                    | Namespace                  | 它是否会在命名空间/项目之外造成影响？                                                    | 影响                                                                                                                                                                                |
| ------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-monitoring-system` | 是的，此命名空间中的 Configs 和 Secrets 可能会影响整个监控/告警线路。                    | 用户将能够创建或编辑 Secrets / ConfigMaps，如 Alertmanager Config、Prometheus Adapter Config、TLS secrets、额外的 Grafana datasoruces 等。这对所有集群监控/告警都会产生广泛的影响。 |
| <ul><li>`secrets`</li><li>`configmaps`</li></ul> | `cattle-dashboards`        | 是的，此命名空间中的 Configs 和 Secrets 可以创建仪表盘，对集群级收集的所有指标进行查询。 | 用户将能够创建密钥/ConfigMaps，只坚持新的 Grafana 仪表板。                                                                                                                          |
