---
title: Rancher v2.5 的日志功能
description: 本文描述了日志功能在Rancher2.5中的变化，提供了启用和卸载日志的操作指导。
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
  - 日志服务
  - Rancher v2.5 的日志功能
---

Rancher 日志现在使用[Banzai Cloud Logging operator](https://banzaicloud.com/docs/one-eye/logging-operator/)记录，取代了以前的内部日志记录解决方案。

## 启用日志

您可以通过进入“应用市场”页面并安装日志应用程序，为 Rancher 管理的集群启用日志记录。

1. 在 Rancher UI 中，进入要安装日志记录的集群，然后单击 **集群资源管理器**。
1. 单击**应用**。
1. 单击`rancher-logging`应用程序。
1. 滚动到 Helm chart README 底部，单击**安装**。

**结果：**日志应用部署在`cattle-logging-system`命名空间中。

## 卸载日志

1. 从**群组资源管理器**中，单击**应用市场**。
1. 单击**安装的应用程序**。
1. 进入`cattle-logging-system`命名空间，选中`rancher-logging`和`rancher-logging-crd`的方框。
1. 单击**删除**。
1. 确认 **删除**。

**结果：** `rancher-logging`被卸载。

## 架构

更多关于日志应用程序如何工作的信息，请参考[日志架构](/docs/rancher2.5/logging/architecture/_index)。

## 基于角色的访问控制

Rancher 日志记录有两个角色，`logging-admin`和`logging-view`，详情请参考[基于角色的访问控制](/docs/rancher2.5/logging/rbac/_index)。

## 配置日志自定义资源

可配置的日志自定义资源包括：`Flow`、`ClusterFlow`、`Outputs`和`ClusterOutputs`。

进入 Rancher 用户界面中的集群资源管理器。在左上角，点击**集群资源管理器 > 日志**，以配置自定义资源。

### Flow 和 ClusterFlow

详情请参考[Flow 和 ClusterFlow](/docs/rancher2.5/logging/custom-resource-config/flows/_index)。

### Outputs 和 ClusterOutputs

详情请参考[Outputs 和 ClusterOutputs](/docs/rancher2.5/logging/custom-resource-config/flows/_index)。

## Windows 集群支持

**Rancher v2.5.8**：从 Rancher v2.5.8 开始，增加了对 Windows 集群的日志支持，可以从 Windows 节点收集日志。

关于如何启用或禁用 Windows 节点日志的细节，请参见[本节](/docs/rancher2.5/logging/helm-chart-options/_index)。

**Rancher v2.5.0-v2.5.7**：带有 Windows 工作者的集群支持从 Linux 节点导出日志，但 Windows 节点的日志目前无法导出。只有 Linux 节点的日志能够被导出。

为了允许在 Linux 节点上调度日志 pod，必须向 pod 添加容错。请参阅 [使用污点和容忍度](/docs/rancher2.5/logging/taints-tolerations/_index)一节，以了解细节和例子。

### 自定义 Docker 根目录

关于使用自定义 Docker 根目录的细节，请参见[本节](/docs/rancher2.5/logging/helm-chart-options/_index)。

### 配置污点和容忍度

关于如何在日志应用程序中使用污点和容忍度的信息，请参见[本节](/docs/rancher2.5/logging/taints-tolerations/_index)。

### 在 SELinux 系统中实现日志功能

从 v2.5.8 开始可用

关于为支持 SELinux 的节点启用日志应用程序的信息，请参见[本节](/docs/rancher2.5/logging/helm-chart-options/_index)。

### 配置其他日志资源

默认情况下，Rancher 会收集所有集群类型的控制平面组件和节点组件的日志。在某些情况下，可以收集额外的日志。详情见[本节](/docs/rancher2.5/logging/helm-chart-options/_index)。

## 常见问题及解决方法

### The `cattle-logging` Namespace Being Recreated

如果你的集群之前从集群管理器用户界面部署了日志记录，你可能会遇到一个问题，就是它的`cattle-logging`命名空间不断被重新创建。

解决办法是删除管理集群中集群特定命名空间中的所有`clusterloggings.management.cattle.io`和`projectloggings.management.cattle.io`自定义资源。

这些自定义资源的存在导致 Rancher 在下游集群中创建`cattle-logging`命名空间。

集群命名空间与集群 ID 相匹配，所以我们需要找到每个集群的集群 ID。

1. 在您的 Web 浏览器中，在集群管理器用户界面或集群资源管理器用户界面中导航到您的集群。
2. 从下面的一个 URL 中复制`<cluster-id>`部分。`<cluster-id>`部分是集群命名空间名称。

```bash
# Cluster Management UI
https://<your-url>/c/<cluster-id>/
# Cluster Explorer UI (Dashboard)
https://<your-url>/dashboard/c/<cluster-id>/
```

现在我们有了`<cluster-id>`命名空间，我们可以删除导致`cattle-logging`不断被重新创建的 CR。

:::warning 警告
确保日志，从集群管理器用户界面安装的版本，目前没有在使用。
:::

```bash
kubectl delete clusterloggings.management.cattle.io -n <cluster-id>
kubectl delete projectloggings.management.cattle.io -n <cluster-id>
```
