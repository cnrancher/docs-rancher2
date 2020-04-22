---
title: 创建 Windows 集群
description: 当使用 Rancher 初始化一个[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)时，Rancher 会在您的基础设施上，使用 RKE（Rancher Kubernetes Engine）进行 Kubernetes 集群初始化。
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
  - 创建RKE集群
  - Windows 集群
  - 创建 Windows 集群
---

_从 v2.3.0 开始支持_

当使用 Rancher 初始化一个[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)时，Rancher 会在您的基础设施上，使用 RKE（Rancher Kubernetes Engine）进行 Kubernetes 集群初始化。

您可以同时使用 Linux 以及 Windows 的节点组成您的集群。Windows 节点只能作为 `worker` 节点使用，Linux 则需要作为管理节点。

您只能在启用了 Windows 支持的集群中添加 Windows 节点。Windows 支持只能适用于自定义集群并且 Kubernetes 版本为 1.15+，并且只能使用 Flannel 作为网络插件。不能在已创建的集群中启用 Windows 支持。

> Windows 集群比 Linux 集群有更多的先决条件。例如，Windows 节点必须有 50GB 的磁盘空间，并且需要保证满足所有以下的[节点要求](#节点要求)。

有关 Kubernetes 中 Windows 节点支持，请参阅[Kubernetes Windows 支持](https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations)或者参考[在 Kubernetes 中调度 Windows 容器](https://kubernetes.io/docs/setup/production-environment/windows/user-guide-windows-containers/)。

## Windows 集群要求

对于自定义集群，网络，操作系统和 Docker 的一般节点要求与[下游集群的节点要求](/docs/cluster-provisioning/node-requirements/_index)相同。

### 操作系统和 Docker

为了将 Windows 节点添加到集群，该节点必须运行以下 Windows Server 版本之一，并且使用相应版本的 Docker 企业版（EE）：

- 具有 Windows Server 核心版本 1809 的节点应使用 Docker EE-basic 18.09 或 Docker EE-basic 19.03。
- 具有 Windows Server 核心版本 1903 的节点应使用 Docker EE-basic 19.03。

> **注意事项：**
>
> - 如果您使用的是 AWS，Rancher 建议将 _Microsoft Windows Server 2019 Base with Containers_ 作为 Amazon Machine Image（AMI）。
> - 如果您使用的是 GCP，Rancher 建议将 _Windows Server 2019 Datacenter for Containers_ 作为 OS 映像。

### 节点要求

集群中的节点至少必须具有：

- 2 核 CPU
- 5 GB 内存
- 50 GB 磁盘空间

如果节点不满足这些要求，Rancher 将不会纳管该节点。

### 网络要求

在配置新集群之前，请确保已经安装了 Rancher。并且确保节点可以与 Rancher 通信，这是必需的。如果尚未安装 Rancher，请在继续本指南之前参考[安装文档](/docs/installation/_index)进行安装。

Rancher 仅支持在 Windows 集群中使用 Flannel 作为网络插件。

有两个网络模式：[**Host Gateway (L2bridge)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) 和 [**VXLAN (Overlay)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。默认选项是 **VXLAN (Overlay)** 模式。

对于 **Host Gateway (L2bridge)** 网络模式，最好对所有节点使用相同的第 2 层网络。否则，您需要为其配置路由规则。有关详细信息，请参阅[配置云托管的 VM 路由](/docs/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/_index)，如果您使用的是亚马逊 EC2，Google GCE 或 Azure VM，还需要[禁用私有 IP 地址检查](/docs/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/_index)。

对于 **VXLAN (Overlay)** 网络，必须安装[KB4489899](https://support.microsoft.com/en-us/help/4489899)修补程序。大多数云托管的 VM 已经具有此修补程序。

### 架构要求

Kubernetes 集群管理节点(`etcd`和`controlplane`)必须在 Linux 节点上运行。

Windows 集群中的工作负载通常部署在 Windows（`worker`）节点中。但是，您必须至少有一个 Linux `worker`节点才能运行 Rancher Cluster Agent，Metrics Server，DNS 和与 Ingress 相关的容器。

下表中是一个由三个节点组成的集群，您可以添加其他 Linux 和 Windows 节点来扩展集群，实现冗余：

| 节点   | 操作系统                                 | 集群角色                                                                                                                                   | 目的                                                           |
| ------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Node 1 | Linux (推荐 Ubuntu Server 18.04)         | [Control Plane](/docs/cluster-provisioning/_index), [etcd](/docs/cluster-provisioning/_index), [Worker](/docs/cluster-provisioning/_index) | 管理 Kubernetes 集群                                           |
| Node 2 | Linux (推荐 Ubuntu Server 18.04)         | [Worker](/docs/cluster-provisioning/_index)                                                                                                | 用来部署 Rancher Cluster Agent，Metrics server，DNS 和 Ingress |
| Node 3 | Windows (Windows Server 1809 或以上版本) | [Worker](/docs/cluster-provisioning/_index)                                                                                                | 运行 Windows 容器                                              |

### 容器要求

Windows 要求容器必须建立在与容器相同的 Windows Server 版本上。因此，必须在 Windows Server Core 1809 或更高版本上构建容器。如果您已经为早期的 Windows Server 核心版本构建了容器，则必须在 Windows Server Core 1809 或更高版本上重新构建它们。

### Cloud Providers

如果您在集群中设置 Kubernetes Cloud Provider，则需要执行一些其他步骤。如果要利用云提供商的功能（例如，为集群自动配置存储，负载均衡器或其他基础设施），则可能需要设置 Cloud Provider。请参阅[本页](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)，以获取有关如何配置 Cloud Provider 的详细信息。

如果您使用的是 GCE（Google Compute Engine）云提供商，则必须执行以下操作：

- 按照[这些步骤](/docs/cluster-provisioning/rke-clusters/cloud-providers/gce/_index)在`cluster.yml`中启用 GCE Cloud Provider。
- 在 Rancher 中配置集群时，请在 Rancher UI 中选择“自定义云提供商”作为云提供商。

## 创建 Windows 集群

本教程将介绍如何使用三个节点创建 Windows 集群。

使用 Rancher 设置自定义集群时，将通过在每个集群上安装[Rancher Agent](/docs/cluster-provisioning/custom-clusters/agent-options/_index)将节点添加到集群中。从 Rancher UI 创建或编辑集群时，您将看到一个**自定义节点启动命令**，您可以在每个服务器上运行该命令以将其添加到自定义集群中。

要创建支持 Windows 节点和容器的自定义集群，您需要完成以下任务。

### 1. 初始化主机

要开始配置具有 Windows 支持的自定义集群，请先准备主机。

您的主机可以是：

- 云托管的虚拟机
- 虚拟化集群中的 VM
- 裸金属服务器

您将置备三个节点：

- 一个 Linux 节点，用于部署 Kubernetes 控制平面和`etcd`
- 第二个 Linux 节点，它将是一个工作节点
- Windows 节点，它将用来运行 Windows 容器。

| 节点   | 操作系统                                          |
| ------ | ------------------------------------------------- |
| Node 1 | Linux (推荐 Ubuntu Server 18.04)                  |
| Node 2 | Linux (推荐 Ubuntu Server 18.04)                  |
| Node 3 | Windows (Windows Server Core Version 1809 或以上) |

如果您的节点由**云供应商**托管，并且您需要自动化支持（例如负载均衡器或永久性存储设备），则您的节点还有其他配置要求。有关详细信息，请参阅[设置 Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)。

### 2. 创建自定义集群

创建支持 Windows 节点的自定义集群的说明与一般[创建自定义集群的说明](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)基本相同，但是具有一些特定于 Windows 的要求。

仅当集群使用 Kubernetes v1.15+ 和 Flannel 网络插件时才可以启用 Windows 支持。

1. 从**全局**视图中，单击**集群**选项卡，然后单击**添加集群**。

1. 单击**自定义**。

1. 在**集群名称**文本框中输入集群的名称。

1. 在 **Kubernetes 版本**下拉菜单中，选择 v1.15 或更高版本。

1. 在**网络驱动**字段中，选择**Flannel**。

1. 在 **Windows 支持**部分中，单击**启用**。

1. 可选：启用 Windows 支持后，您将能够选择 Flannel 后端模式。有两个网络选项：[**Host Gateway (L2bridge)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) 和 [**VXLAN (Overlay)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。默认选项是 **VXLAN (Overlay)** 模式。

1. 点击 **下一步**.

> **重要提示：** 对于 **Host Gateway (L2bridge)**网络，最好对所有节点使用相同的第 2 层网络。否则，您需要为其配置路由规则。有关详细信息，请参阅[配置云托管的 VM 路由](/docs/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/_index)。如果您使用的是亚马逊 EC2，Google GCE 或 Azure VM，还需要[禁用私有 IP 地址检查](/docs/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/_index)。

### 3. 在集群上添加节点

本节介绍如何将 Linux 和 Worker 节点注册到自定义集群。

#### 添加 Linux Master 节点

集群中的第一个节点应该是同时具有 **Control Plane** 和 **etcd** 角色的 Linux 主机。至少必须为此节点启用这两个角色，并且必须先将此节点添加到集群中，然后才能添加 Windows 主机。

在本节中，我们在 Rancher UI 上填写表格，以获取自定义命令，以在 Linux 主节点上安装 Rancher 代理。然后，我们将复制命令并在 Linux 主节点上运行该命令，以在集群中注册该节点。

1. 在**节点操作系统**部分中，单击**Linux**。

1. 在**节点角色**部分中，至少选择**etcd**和**Control Plane**。我们这里选择所有三个角色。

1. 可选：如果您单击**显示高级选项**，则可以自定义 [Rancher Agent](/docs/cluster-provisioning/rke-clusters/rancher-agents/_index) 和[节点标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)等。

1. 将屏幕上显示的命令复制到剪贴板。

1. SSH 进入 Linux 主机，然后运行复制到剪贴板的命令。

1. 完成配置 Linux 节点后，选择**完成**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果存在）。

该节点可能需要几分钟才能在您的集群中注册。

#### 添加 Linux Worker 节点

初始配置自定义集群后，集群仅具有单个 Linux 主机。接下来，我们添加另一个 Linux`worker`主机，它将用于为您的集群支持 _Rancher Cluster Agent_，_Metrics Server_，_DNS_ 和 _Ingress_。

1. 在**全局**视图中，单击**集群**。

1. 转到您创建的自定义集群，然后单击**省略号（...）> 编辑。**

1. 向下滚动到**节点操作系统**。选择 **Linux**。

1. 在**自定义节点运行命令**部分中，转到**节点选项**并选择**Worker**角色。

1. 将屏幕上显示的命令复制到剪贴板。

1. 使用远程终端连接登录到 Linux 主机。运行复制到剪贴板的命令。

1. 在 **Rancher** 中，单击**保存**。

**结果：** **Worker** 角色节点已安装在您的 Linux 主机上，并且该节点向 Rancher 注册。该节点可能需要几分钟才能在您的集群中注册。

> **注意：** Linux 节点上的污点(Taint)设置
>
> 对于添加到集群中的每个 Linux 节点，以下污点将添加到 Linux 节点。通过将此污点添加到 Linux Worker 节点，使得添加到 Windows 集群的所有工作负载都将自动调度到 Windows Worker 节点。如果要将工作负载专门安排到 Linux 工作节点上，则需要为这些工作负载添加 Toleration 或者指定某一台 Linux 主机。
>
> | Taint Key      | Taint Value | Taint Effect |
> | -------------- | ----------- | ------------ |
> | `cattle.io/os` | `linux`     | `NoSchedule` |

#### 添加 Windows 节点

您可以通过编辑集群并选择**Windows**选项将 Windows 主机添加到自定义集群。

1. 在**全局**视图中，单击**集群**。

1. 转到您创建的自定义集群，然后单击**省略号（...）>编辑。**

1. 向下滚动到**节点操作系统**。选择 **Windows**。注意：您将看到 **worker** 角色是唯一可用的角色。

1. 将屏幕上显示的命令复制到剪贴板。

1. 使用首选工具，例如[Microsoft 远程桌面](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients)。在**命令提示符（CMD）**中运行复制到剪贴板的命令。

1. 在**Rancher**中，单击**保存**。

1. 可选：如果要向集群添加更多 Windows 节点，请重复这些说明。

**结果：** **Worker**角色已安装在 Windows 主机上，并且该节点向 Rancher 注册。该节点可能需要几分钟才能在您的集群中注册。您现在已经拥有来 Windows Kubernetes 集群。

#### 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher 服务器的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。

## Azure 中存储类的配置

如果您为节点使用 Azure VM，则可以将[Azure File](https://docs.microsoft.com/en-us/azure/aks/azure-files-dynamic-pv)用作[存储类](/docs/cluster-admin/volumes-and-storage/_index)。

为了使 Azure 平台创建所需的存储资源，请按照下列步骤操作：

1. [配置 Azure Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)。

1. 配置`kubectl`连接到您的集群。

1. 复制下面的 Service Account 的`ClusterRole`和`ClusterRoleBinding`配置：

   ```
       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRole
       metadata:
         name: system:azure-cloud-provider
       rules:
       - apiGroups: ['']
         resources: ['secrets']
         verbs:     ['get','create']
       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRoleBinding
       metadata:
         name: system:azure-cloud-provider
       roleRef:
         kind: ClusterRole
         apiGroup: rbac.authorization.k8s.io
         name: system:azure-cloud-provider
       subjects:
       - kind: ServiceAccount
         name: persistent-volume-binder
         namespace: kube-system
   ```

1. 使用以下命令创建相关资源

   ```
   # kubectl create -f <MANIFEST>
   ```
