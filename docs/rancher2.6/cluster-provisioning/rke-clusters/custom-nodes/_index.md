---
title: 在现有自定义节点上启动 Kubernetes
description: 要创建具有自定义节点的集群，你需要访问集群中的服务器，并根据 Rancher 的要求配置服务器。
metaDescription: "要创建具有自定义节点的集群，你需要访问集群中的服务器，并根据 Rancher 的要求配置服务器。"
weight: 2225
---

创建自定义集群时，Rancher 使用 RKE（Rancher Kubernetes Engine）在本地裸机服务器、本地虚拟机或云服务器节点中创建 Kubernetes 集群。

要使用此选项，你需要访问要在 Kubernetes 集群中使用的服务器。请根据[要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements)配置每台服务器，其中包括硬件要求和 Docker 要求。在每台服务器上安装 Docker 后，你还需要在每台服务器上运行 Rancher UI 中提供的命令，从而将每台服务器转换为 Kubernetes 节点。

本节介绍如何设置自定义集群。

## 使用自定义节点创建集群

> **使用 Windows 主机作为 Kubernetes Worker 节点？**
>
> 在开始之前，请参阅[配置 Windows 自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/)。

<!-- TOC -->

- [1. 配置 Linux 主机](#1-provision-a-linux-host)
- [2. 创建自定义集群](#2-create-the-custom-cluster)
- [3. 仅限亚马逊：标签资源](#3-amazon-only-tag-resources)

<!-- /TOC -->

### 1. 配置 Linux 主机

你可以通过配置 Linux 主机，来创建自定义集群。你的主机可以是：

- 云虚拟机
- 本地虚拟机
- 裸机服务器

如果要重复使用之前的自定义集群中的节点，请在复用之前[清理节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cleaning-cluster-nodes/)。如果你重复使用尚未清理的节点，则集群配置可能会失败。

根据[安装要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements)和[生产就绪集群的检查清单]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production)配置主机。

如果你使用 Amazon EC2 作为主机，并希望使用[双栈 (dual-stack)](https://kubernetes.io/docs/concepts/services-networking/dual-stack/) 功能，则需要满足配置主机的其他[要求]({{<baseurl>}}/rke//latest/en/config-options/dual-stack#requirements)。

### 2. 创建自定义集群

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击**自定义**。
1. 输入**集群名称**。
1. 在**集群配置**中，选择 Kubernetes 版本、要使用的网络提供商，以及是否启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

   > **使用 Windows 主机作为 Kubernetes Worker 节点？**
   >
   > - 请参阅[启用 Windows 支持选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/)。
   > - 支持 Windows 集群的唯一网络插件是 Flannel。
   >
   > **Amazon EC2 上的双栈**：如果你使用 Amazon EC2 作为主机并希望使用[双栈](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)功能，在配置 RKE 时还需要满足其他[要求]({{<baseurl>}}/rke//latest/en/config-options/dual-stack#requirements)。

1. <a id="step-6"></a>单击**下一步**。

1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。

1. 从**节点角色**中，选择要由集群节点充当的角色。你必须为 `etcd`、`worker` 和 `control plane` 角色配置至少一个节点。自定义集群需要所有三个角色才能完成配置。有关角色的详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/overview/concepts/#roles-for-nodes-in-kubernetes-clusters)。

   > **注意**：
   >
   > - 使用 Windows 主机作为 Kubernetes Worker 节点？请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/)。
   > - 裸机服务器提醒：如果你想将裸机服务器专用于每个角色，则必须为每个角色配置一个裸机服务器（即配置多个裸机服务器）。

1. <a id="step-8"></a>**可选**：点击[显示高级选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/rancher-agents/)来指定注册节点时使用的 IP 地址，覆盖节点的主机名，或将[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)添加到节点。

1. 将屏幕上显示的命令复制到剪贴板。

1. 使用你惯用的 shell（例如 PuTTy 或远程终端）登录到你的 Linux 主机。粘贴剪贴板的命令并运行。

> **注意**：如果要将特定主机专用于特定节点角色，请重复步骤 7-10。根据需要多次重复这些步骤。

12. 在 Linux 主机上运行完命令后，单击**完成**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

### 3. 仅限亚马逊：标签资源

如果你已将集群配置为使用 Amazon 作为**云提供商**，请使用集群 ID 标记你的 AWS 资源。

[Amazon 文档：标记你的 Amazon EC2 资源](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)

> **注意**：你可以使用 Amazon EC2 实例，而无需在 Kubernetes 中配置云提供商。如果你想使用特定的 Kubernetes 云提供商功能，配置云提供商即可。如需更多信息，请参阅 [Kubernetes 云提供商](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。

以下资源需要使用 `ClusterID` 进行标记：

- **Nodes**：Rancher 中添加的所有主机。
- **Subnet**：集群使用的子网。
- **Security Group**：用于你的集群的安全组。

  > **注意**：不要标记多个安全组。创建 Elastic Load Balancer 时，标记多个组会导致错误。

应该使用的标签是：

```
Key=kubernetes.io/cluster/<CLUSTERID>, Value=owned
```

`<CLUSTERID>` 可以是你选择的任何字符串。但是，必须在你标记的每个资源上使用相同的字符串。将值设置为 `owned` 会通知集群所有带有 `<CLUSTERID>` 标记的资源都由该集群拥有和管理。

如果你在集群之间共享资源，你可以将标签更改为：

```
Key=kubernetes.io/cluster/CLUSTERID, Value=shared
```

## 可选的后续步骤

创建集群后，你可以通过 Rancher UI 访问集群。最佳实践建议你设置以下访问集群的备用方式：

- **通过 kubectl CLI 访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#accessing-clusters-with-kubectl-on-your-workstation)在你的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会让你连接到下游集群。此方法允许你在没有 Rancher UI 的情况下管理集群。
- **通过 kubectl CLI 使用授权的集群端点访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#authenticating-directly-with-a-downstream-cluster)直接使用 kubectl 访问集群，而无需通过 Rancher 进行身份验证。我们建议设置此替代方法来访问集群，以便在无法连接到 Rancher 时访问集群。
