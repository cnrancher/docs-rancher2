---
title: 主机驱动
weight: 2
---

主机驱动用于配置主机，Rancher 使用这些主机启动和管理 Kubernetes 集群。主机驱动与 [Docker Machine 驱动](https://docs.docker.com/machine/drivers/)相同。创建主机模板时可以显示的主机驱动，是由主机驱动的状态定义的。只有 `active` 主机驱动将显示为创建节点模板的选项。默认情况下，Rancher 与许多现有的 Docker Machine 驱动打包在一起，但你也可以创建自定义主机驱动并添加到 Rancher。

如果你不想向用户显示特定的主机驱动，则需要停用这些主机驱动。

#### 管理主机驱动

> **前提**：要创建、编辑或删除驱动，你需要以下权限中的 _一个_：
>
> - [管理员全局权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)
> - 分配了[管理主机驱动角色]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)的[自定义全局权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/#custom-global-permissions)。

## 激活/停用主机驱动

默认情况下，Rancher 仅激活主流云提供商 Amazon EC2、Azure、DigitalOcean 和 vSphere 的驱动。如果要显示或隐藏驱动，你可以更改驱动的状态：

1. 点击左上角 **☰ > 集群管理**。

2. 在左侧导航菜单中，单击**驱动**。

3. 在**主机驱动**选项卡上，选择要激活或停用的驱动，然后单击 **⋮ > 激活** 或 **⋮ > 停用**。

## 添加自定义主机驱动

如果你想使用 Rancher 不支持开箱即用的主机驱动，你可以添加提供商的驱动，从而使用该驱动为你的 Kubernetes 集群创建节点模板并最终创建节点池：

1. 点击左上角 **☰ > 集群管理**。
1. 在左侧导航菜单中，单击**驱动**。
1. 在**主机驱动**选项卡上，单击**添加主机驱动**。
1. 填写**添加主机驱动**表单。然后单击**创建**。

### 开发自己的主机驱动

主机驱动使用 [Docker Machine](https://docs.docker.com/machine/) 来实现。
