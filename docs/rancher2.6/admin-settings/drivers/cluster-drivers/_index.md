---
title: 集群驱动
weight: 1
---

集群驱动用于在[托管 Kubernetes 提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/)（例如 Google GKE）中创建集群。创建集群时可以显示的集群驱动，是由集群驱动的状态定义的。只有 `active` 集群驱动将作为创建集群的选项显示。默认情况下，Rancher 与多个现有的云提供商集群驱动打包在一起，但你也可以将自定义集群驱动添加到 Rancher。

如果你不想向用户显示特定的集群驱动，你可以在 Rancher 中停用这些集群驱动，它们将不会作为创建集群的选项出现。

### 管理集群驱动

> **前提**：要创建、编辑或删除集群驱动，你需要以下权限中的 _一个_：
>
> - [管理员全局权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)
> - 分配了[管理集群驱动角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)的[自定义全局权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/#custom-global-permissions)。

## 激活/停用集群驱动

默认情况下，Rancher 仅激活主流的云提供商 Google GKE、Amazon EKS 和 Azure AKS 的驱动。如果要显示或隐藏驱动，你可以更改驱动的状态：

1. 点击左上角 **☰ > 集群管理**。

2. 在左侧导航菜单中，单击**驱动**。

3. 在**集群驱动**选项卡上，选择要激活或停用的驱动，然后单击 **⋮ > 激活** 或 **⋮ > 停用**。

## 添加自定义集群驱动

如果你想使用 Rancher 不支持开箱即用的集群驱动，你可以添加提供商的驱动，从而使用该驱动来创建 _托管_ Kubernetes 集群：

1. 点击左上角 **☰ > 集群管理**。
1. 在左侧导航菜单中，单击**驱动**。
1. 在**集群驱动**选项卡上，单击**添加集群驱动**。
1. 填写**添加集群驱动**表单。然后单击**创建**。

### 开发自己的集群驱动

如果要开发集群驱动并添加到 Rancher，请参考我们的[示例](https://github.com/rancher-plugins/kontainer-engine-driver-example)。
