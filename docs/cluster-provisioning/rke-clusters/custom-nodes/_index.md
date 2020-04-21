---
title: 在自定义点上启动集群
description: 当您创建自定义集群时，Rancher 使用 RKE（Rancher Kubernetes Engine）在本地裸金属服务器、本地虚拟机或云提供商托管的任何节点中创建 Kubernetes 集群。要使用此选项，您需要访问将要在 Kubernetes 集群中使用的服务器。根据要求配置每个服务器，其中包括一些硬件规格和 Docker 版本等。在每台服务器上安装 Docker 后，运行 Rancher UI 中提供的命令，将每台服务器转换为 Kubernetes 节点。本节介绍如何设置自定义集群。
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
  - 创建集群
  - 自定义集群
  - 在自定义点上启动集群
---

当您创建自定义集群时，Rancher 使用 RKE（Rancher Kubernetes Engine）在本地裸金属服务器、本地虚拟机或云提供商托管的任何节点中创建 Kubernetes 集群。

要使用此选项，您需要访问将要在 Kubernetes 集群中使用的服务器。根据[要求](/docs/cluster-provisioning/node-requirements/_index)配置每个服务器，其中包括一些硬件规格和 Docker 版本等。在每台服务器上安装 Docker 后，运行 Rancher UI 中提供的命令，将每台服务器转换为 Kubernetes 节点。

本节介绍如何设置自定义集群。

## 创建具有自定义节点的集群

> **想要使用 Windows 主机作为 Kubernetes Worker 节点?**
>
> 在开始之前，请参阅[配置 Windows 自定义集群](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。

### 1. 设置 Linux 主机

通过配置 Linux 主机开始创建自定义集群。您的主机可以为：

- 云主机虚拟机 (VM)
- 内部部署 VM
- 裸金属服务器

:::important 重要
如果要重复使用以前的自定义集群中的节点，再次在集群中使用之前请[清理节点](/docs/faq/removing-rancher/_index)。如果重复使用尚未清理的节点，则启动集群可能会失败。
:::

再次检查节点是否满足[安装要求](/docs/cluster-provisioning/node-requirements/_index)和[生产就绪集群检查清单](/docs/cluster-provisioning/production/_index)。

### 2. 创建自定义集群

1. 在**集群**页面中，单击**添加集群**。

2. 选择**Custom**.

3. 输入**集群名称**.

4. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

5. 使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

   > **使用 Windows 主机作为 Kubernetes Worker 节点?**
   >
   > - 请参阅[启用 Windows 支持选项](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。
   > - 唯一可用于支持 Windows 的集群的网络插件是 Flannel。请参阅[网络选项](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。

6. 点击 **下一步** 。

7. 从**节点角色**中，选择需要的集群节点角色。

   > **注意：**
   >
   > - 使用 Windows 主机作为 Kubernetes Worker 节点? 请参阅[节点配置](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。
   > - 裸金属服务器提醒：如果您计划将裸金属服务器专用于每个角色，则必须为每个角色配置裸金属服务器（即配置多个裸金属服务器）。

8. **可选**: 点击**[显示高级选项](/docs/cluster-provisioning/rke-clusters/custom-nodes/agent-options/_index)**以指定注册节点时要使用的 IP 地址、重写节点的主机名或添加[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)到节点上。

9. 复制屏幕上显示的命令到剪贴板。

10. 使用您喜欢的 shell 工具登录到您的 Linux 主机，如 PuTTy 等。运行复制到剪贴板的命令。

    > **注意：** 如果要将特定主机专用于特定节点角色，请重复步骤 7-10。根据需要多次重复这些步骤。

11. 当您完成在 Linux 主机上运行该命令时，点击 **完成**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果存在）。

### 3. 仅限 Amazon：标签资源

如果您已将集群配置为使用 Amazon 作为**Cloud Provider**，请使用 ClusterID 标记您的 AWS 资源。

[Amazon 文档: 标记您的 Amazon EC2 资源](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/Using_Tags.html)

> **注意：** 您无需在 Kubernetes 中配置 **Cloud Provider** 即可使用 Amazon EC2 实例。如果您想使用特定的 Kubernetes Cloud Provider 功能，则需要配置 **Cloud Provider** 。有关更多信息，请参阅 [Kubernetes Cloud Provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。

以下资源需要标记上`ClusterID`:

- **节点**：在 Rancher 中添加的所有主机。
- **子网**：用于集群的子网
- **安全组**：用于集群的安全组。

  > **注意：** 不要标记多个安全组。创建弹性负载均衡器时，标记多个组会产生错误。

应该使用的标签是:

```
Key=kubernetes.io/cluster/<CLUSTERID>, Value=owned
```

`<CLUSTERID>`可以是您选择的任何字符串。但是，必须在您标记的每个资源上使用相同的字符串。将标记值设置为`owned`会通知集群，使用`<CLUSTERID>`标记的所有资源都由该集群拥有和管理。

如果在集群之间共享资源，则可以将标记更改为:

```
Key=kubernetes.io/cluster/CLUSTERID, Value=shared
```

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher 服务器的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
