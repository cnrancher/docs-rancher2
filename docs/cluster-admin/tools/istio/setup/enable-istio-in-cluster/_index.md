---
title: 启用 Istio
description: 该集群使用默认的 Nginx 控制器来允许流量进入集群。Rancher的管理员或者集群所有者可以在一个 Kubernetes 集群中部署 Istio。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - Istio使用指南
  - 启用 Istio
---

该集群使用默认的 Nginx 控制器来允许流量进入集群。

Rancher 的[管理员](/docs/admin-settings/rbac/global-permissions/_index)或者[集群所有者](/docs/admin-settings/rbac/cluster-project-roles/_index)可以在一个 Kubernetes 集群中部署 Istio。

> 如果集群启用了 Pod 安全策略，则有[先决条件步骤](/docs/cluster-admin/tools/istio/setup/enable-istio-in-cluster/enable-istio-with-psp/_index)

1. 从**全局**视图中，导航到要启用 Istio 的集群。
1. 单击**工具 > Istio**。
1. 可选: 为 Istio 组件配置成员访问权限和[资源限制](/docs/cluster-admin/tools/istio/resources/_index)。确保您的 worker 节点上有足够的资源来启用 Istio。
1. 单击**启用**。
1. 单击**保存**。

**结果：** 在集群层级启用了 Istio。

Istio 会作为一个名为`cluster-istio`的[应用](/docs/catalog/launching-apps/_index)添加到该集群的`系统`项目中。

在集群中启用 Istio 时，Istio sidecar 自动注入的标签`istio-injection = enabled`将自动添加到该集群中的每个新的命名空间。这会自动在这些命名空间中部署的所有新工作负载中启用 Istio sidecar 注入。您将需要在预先存在的命名空间和工作负载中手动启用 Istio。

#### [下一步：在命名空间中启用 Istio](/docs/cluster-admin/tools/istio/setup/enable-istio-in-namespace/_index)
