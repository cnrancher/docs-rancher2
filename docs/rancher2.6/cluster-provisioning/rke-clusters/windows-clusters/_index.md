---
title: 在 Windows 集群上启动 Kubernetes
weight: 2240
---

使用 Rancher 配置[自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes)时，Rancher 通过 RKE（Rancher Kubernetes Engine）在现有节点上安装 Kubernetes。

在使用 Rancher 配置的 Windows 集群中，集群必须同时包含 Linux 和 Windows 节点。Kubernetes controlplane 只能运行在 Linux 节点上，Windows 节点只能有 Worker 角色。Windows 节点只能用于部署工作负载。

Windows 集群的其他要求如下：

- 只有在创建集群时启用了 Windows 支持的集群才能添加 Windows 节点。无法为现有集群启用 Windows 支持。
- 需要 Kubernetes 1.15+。
- 必须使用 Flannel 网络提供商。
- Windows 节点必须有 50 GB 的磁盘空间。

有关完整的要求列表，请参阅[本节](#requirements-for-windows-clusters)。

有关支持 Windows 的 Kubernetes 功能摘要，请参阅[在 Windows 中使用 Kubernetes 支持的功能和限制](https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations)的 Kubernetes 文档，或[在 Kubernetes 中调度 Windows 容器的指南](https://kubernetes.io/docs/setup/production-environment/windows/user-guide-windows-containers/)。

本指南涵盖以下主题：

<!-- TOC -->

- [Rancher 2.6 变更](#changes-in-rancher-v2-6)
- [要求](#requirements-for-windows-clusters)
- [教程：如何创建支持 Windows 的集群](#tutorial-how-to-create-a-cluster-with-windows-support)
- [Azure 中存储类的配置](#configuration-for-storage-classes-in-azure)
   <!-- /TOC -->

## Rancher 2.6 变更

_技术预览_

Rancher 2.6 支持直接使用 Rancher UI 配置 [RKE2](https://docs.rke2.io/) 集群。RKE2，也称为 RKE Government，是一个完全符合标准的 Kubernetes 发行版，它专注于安全性和合规性。

RKE2 配置技术预览还包括在 Windows 集群上安装 RKE2。RKE2 的 Windows 功能包括：

- 由 containerd 提供支持的使用 RKE2 的 Windows 容器
- 直接从 Rancher UI 配置 Windows RKE2 自定义集群
- 用于 Windows RKE2 自定义集群的 Calico CNI
- 技术预览包含了 Windows Server 的 SAC 版本（2004 和 20H2）

要使 Windows 支持 RKE2 自定义集群，请选择 Calico 作为 CNI。

> **重要提示**：默认情况下，Rancher 允许 Windows 工作负载 pod 部署在 Windows 和 Linux Worker 节点上。在 RKE2 中创建混合集群时，你必须编辑 Chart 中的 `nodeSelector`，从而将 Pod 放置到兼容的 Windows 节点上。有关如何使用 `nodeSelector` 将 pod 分配给节点的更多信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)。

## Windows 集群的要求

网络、操作系统和 Docker 的一般节点要求与 [Rancher 安装]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)的节点要求相同。

### 操作系统和 Docker 要求

我们对 Windows Server 和 Windows 容器的支持与 LTSC（长期服务渠道）和 SAC（半年渠道）的 Microsoft 官方生命周期相匹配。

有关 Windows Server 的支持生命周期的日期，请参阅 [Microsoft 文档](https://docs.microsoft.com/en-us/windows-server/get-started/windows-server-release-info)。

### Kubernetes 版本

需要 Kubernetes v1.15+。

如果你在 Windows Server 20H2 Standard Core 上使用 Kubernetes v1.21，则必须在节点上安装补丁“2019-08 Servicing Stack Update for Windows Server”。

### 节点要求

集群中的主机至少需要：

- 2 核 CPU
- 5 GB 内存
- 50 GB 磁盘空间

Rancher 不会配置不满足要求的节点。

### 网络要求

在配置新集群之前，请确保你已经在接收入站网络流量的设备上安装了 Rancher。这是集群节点与 Rancher 通信所必需的。如果你尚未安装 Rancher，请在继续阅读本指南之前先参阅[安装文档]({{<baseurl>}}/rancher/v2.6/en/installation/)进行安装。

Rancher 仅支持使用 Flannel 作为网络提供商的 Windows。

有两个网络选项：[**Host Gateway (L2bridge)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) 和 [**VXLAN (Overlay)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。默认选项是 **VXLAN (Overlay)** 模式。

对于 **Host Gateway (L2bridge)** 网络，最好为所有节点使用相同的第 2 层网络。否则，你需要为它们配置路由规则。有关详细信息，请参阅[配置云托管 VM 路由的文档]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/#cloud-hosted-vm-routes-configuration)。如果你使用的是 Amazon EC2、Google GCE 或 Azure 虚拟机，你需要[禁用私有 IP 地址检查]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/#disabling-private-ip-address-checks)。

对于 **VXLAN (Overlay)** 网络，你必须安装 [KB4489899](https://support.microsoft.com/en-us/help/4489899) 修补程序。大多数云托管的 VM 已经具有此修补程序。

如果你在为 AWS 虚拟私有云配置 DHCP 选项集，请注意，你只能在 `domain-name` 选项字段中指定一个域名。详情请参见 [DHCP 选项文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_DHCP_Options.html)。

> 一些 Linux 操作系统支持以空格分隔的多个域名。但是，其他 Linux 操作系统和 Windows 将该值视为单个域名，从而导致意外错误。如果你的 DHCP 选项集与具有多个操作系统实例的 VPC 相关联，请仅指定一个域名。

### 带有 ESXi 6.7u2 及更高版本的 vSphere 上的 Rancher

如果你在带有 ESXi 6.7u2 或更高版本的 VMware vSphere 上使用 Rancher，并使用 Red Hat Enterprise Linux 8.3、CentOS 8.3 或 SUSE Enterprise Linux 15 SP2 或更高版本，你需要禁用 `vmxnet3` 虚拟网络适配器硬件卸载功能。否则，不同集群节点上的 pod 之间的所有网络连接会因为超时错误而失败。从 Windows pod 到在 Linux 节点上运行的关键服务（例如 CoreDNS）的所有连接也将失败。外部连接也可能失败。出现这个问题的原因是 Linux 发行版在 `vmxnet3` 中启用了硬件卸载功能，而且 `vmxnet3` 硬件卸载功能中存在一个会丢弃客户覆盖流量的数据包的 bug。要解决此问题，必须禁用 `vmxnet3` 硬件卸载功能。此设置不会在重启后继续生效，因此需要在每次启动时禁用。推荐的做法是在 `/etc/systemd/system/disable_hw_offloading.service` 中创建一个 systemd 单元文件，这会在启动时禁用 `vmxnet3` 硬件卸载功能。禁用 `vmxnet3` 硬件卸载功能的示例 systemd 单元文件如下所示。注意，`<VM network interface>` 必须自定义为主机的 `vmxnet3` 网络接口，如 `ens192`：

```
[Unit]
Description=Disable vmxnet3 hardware offloading feature

[Service]
Type=oneshot
ExecStart=ethtool -K <VM network interface> tx-udp_tnl-segmentation off
ExecStart=ethtool -K <VM network interface> tx-udp_tnl-csum-segmentation off
StandardOutput=journal

[Install]
WantedBy=multi-user.target
```

然后在 systemd 单元文件上设置适当的权限：

```
chmod 0644 /etc/systemd/system/disable_hw_offloading.service
```

最后，启用 systemd 服务：

```
systemctl enable disable_hw_offloading.service
```

### 架构要求

Kubernetes 集群管理节点（`etcd` 和 `controlplane`）必须运行在 Linux 节点上。

部署工作负载的 `worker` 节点通常是 Windows 节点，但必须至少有一个 `worker` 节点运行在 Linux 上，才能按顺序运行 Rancher Cluster Agent、DNS、Metrics Server 和 Ingress 相关容器。

我们推荐下表中列出的三节点架构，但你始终可以添加额外的 Linux 和 Windows worker 节点来扩展集群，从而实现冗余：

<a id="guide-architecture"></a>

| 节点   | 操作系统                                           | Kubernetes 集群角色         | 用途                                                             |
| ------ | -------------------------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| 节点 1 | Linux（推荐 Ubuntu Server 18.04）                  | Control plane, etcd, worker | 管理 Kubernetes 集群                                             |
| 节点 2 | Linux（推荐 Ubuntu Server 18.04）                  | Worker                      | 支持集群的 Rancher Cluster Agent、Metrics Server、DNS 和 Ingress |
| 节点 3 | Windows（Windows Server 核心版本 1809 或更高版本） | Worker                      | 运行 Windows 容器                                                |

### 容器要求

Windows 要求容器的版本必须与部署容器的 Windows Server 的版本一致。因此，你必须在 Windows Server 核心版本 1809 或更高版本上构建容器。如果你已经使用早期的 Windows Server 核心版本构建了容器，则必须使用 Windows Server 核心版本 1809 或更高版本重新构建容器。

### 云提供商要求

如果你在集群中设置了 Kubernetes 云提供商，则需要进行一些额外的操作。如果你想使用云提供商的功能，例如为集群自动配置存储、负载均衡器或其他基础设施，你可能需要设置云提供商。有关如何配置满足条件的云提供商集群节点，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)。

如果你的云提供商是 GCE（Google Compute Engine），则必须执行以下操作：

- 按照[步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/gce) 在`cluster.yml` 中启用 GCE 云提供商。
- 在 Rancher 中配置集群时，在 Rancher UI 中选择**自定义云提供商**作为云提供商。

## 教程：如何创建支持 Windows 的集群

本教程描述了如何使用[推荐架构](#guide-architecture)中的三个节点创建由 Rancher 配置的集群。

在现有节点上使用 Rancher 配置集群时，你需要在每个节点上安装 [Rancher Agent]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/agent-options/) 来将节点添加到集群中。在 Rancher UI 中创建或编辑集群时，你会看到一个**自定义节点运行命令**，你可以在每台服务器上运行该命令，从而将服务器添加到集群中。

要设置支持 Windows 节点和容器的集群，你需要完成以下任务：

<!-- TOC -->

1. [配置主机](#1-provision-hosts)
1. [在现有节点上创建集群](#2-create-the-cluster-on-existing-nodes)
1. [将节点添加到集群](#3-add-nodes-to-the-cluster)
1. [可选：配置 Azure 文件](#4-optional-configuration-for-azure-files)
   <!-- /TOC -->

## 1. 配置主机

要在具有 Windows 支持的现有节点上配置集群，请准备好你的主机。

主机可以是：

- 云托管的虚拟机
- 虚拟化集群中的虚拟机
- 裸金属服务器

你将配置三个节点：

- 一个 Linux 节点，用于管理 Kubernetes control plane 并存储你的 `etcd`。
- 第二个 Linux 节点，它将作为 worker 节点。
- Windows 节点，它将作为 worker 节点运行 Windows 容器。

| 节点   | 操作系统                                           |
| ------ | -------------------------------------------------- |
| 节点 1 | Linux（推荐 Ubuntu Server 18.04）                  |
| 节点 2 | Linux（推荐 Ubuntu Server 18.04）                  |
| 节点 3 | Windows（Windows Server 核心版本 1809 或更高版本） |

如果你的节点托管在**云提供商**上，并且你需要自动化支持（例如负载均衡器或持久存储设备），你的节点还需要满足额外的配置要求。详情请参见[选择云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers)。

## 2. 在现有节点上创建集群

在现有节点上创建 Windows 集群的说明与一般[创建自定义集群的说明]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/)非常相似，但有一些特定于 Windows 的要求。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击**自定义**。
1. 在**集群名称**字段中输入集群的名称。
1. 在 **Kubernetes 版本**下拉菜单中，选择 v1.19 或更高版本。
1. 在**网络提供商**字段中，选择 **Flannel**。
1. 在 **Windows 支持**中，单击**启用**。
1. 可选：启用 Windows 支持后，你将能够选择 Flannel 后端模式。有两个网络选项：[**Host Gateway (L2bridge)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) 和 [**VXLAN (Overlay)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。默认选项是 **VXLAN (Overlay)** 模式。
1. 点击**下一步**。

> **重要提示**：对于 <b>Host Gateway (L2bridge)</b> 网络，最好为所有节点使用相同的第 2 层网络。否则，你需要为它们配置路由规则。有关详细信息，请参阅[配置云托管 VM 路由的文档]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/#cloud-hosted-vm-routes-configuration)。如果你使用的是 Amazon EC2、Google GCE 或 Azure 虚拟机，你需要[禁用私有 IP 地址检查]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/#disabling-private-ip-address-checks)。

## 3. 将节点添加到集群

本节介绍如何将 Linux 和 Worker 节点注册到集群。你将在每个节点上运行一个命令，该命令将安装 Rancher Agent 并允许 Rancher 管理每个节点。

### 添加 Linux 主节点

在本节中，你需要在 Rancher UI 上填写表单以获取自定义命令，从而在 Linux 主节点上安装 Rancher Agent。然后，复制该命令并在 Linux 主节点上运行命令，从而在集群中注册该节点。

集群中的第一个节点应该是具有 **Control Plane** 和 **etcd** 角色的 Linux 主机。至少必须为此节点启用这两个角色，并且必须先将此节点添加到集群中，然后才能添加 Windows 主机。

1. 在**节点操作系统**中，单击 **Linux**。
1. 在**节点角色**中，至少选择 **etcd** 和 **Control Plane**。推荐选择所有的三个角色。
1. 可选：如果点击**显示高级选项**，你可以自定义 [Rancher Agent]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/agent-options/) 和[节点标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)的设置。
1. 将屏幕上显示的命令复制到剪贴板。
1. SSH 到你的 Linux 主机，然后运行复制到剪贴板的命令。
1. 完成配置 Linux 节点后，选择**完成**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

节点可能需要几分钟才能注册到集群中。

### 添加 Linux Worker 节点

在本节中，我们通过运行命令将 Linux Worker 节点注册到集群中。

在初始配置集群之后，你的集群只有一个 Linux 主机。接下来，我们添加另一个 Linux `worker` 主机，用于支持集群的 _Rancher Cluster Agent_、_Metrics Server_、_DNS_ 和 _Ingress_。

1. 点击左上角 **☰ > 集群管理**。
1. 转到你创建的集群，然后单击 **⋮ > 编辑配置**。
1. 向下滚动到**节点操作系统**。选择 **Linux**。
1. 在**自定义节点运行命令**中，转到**节点选项**并选择 **Worker** 角色。
1. 将屏幕上显示的命令复制到剪贴板。
1. 使用远程终端连接登录到你的 Linux 主机。粘贴剪贴板的命令并运行。
1. 在 **Rancher**中，单击**保存**。

**结果**：**Worker** 角色已安装在你的 Linux 主机上，并且节点会向 Rancher 注册。节点可能需要几分钟才能注册到集群中。

> **注意**：Linux Worker 节点上的污点
>
> 以下污点将添加集群中的 Linux Worker 节点中。将此污点添加到 Linux Worker 节点后，添加到 Windows 集群的任何工作负载都将自动调度到 Windows Worker 节点。如果想将工作负载专门调度到 Linux Worker 节点上，则需要为这些工作负载添加容忍度。
> 
> | 污点键         | 污点值  | 污点效果     |
> | -------------- | ------- | ------------ |
> | `cattle.io/os` | `linux` | `NoSchedule` |

### 添加 Windows Worker 节点

在本节中，我们通过运行命令将 Windows Worker 节点注册到集群中。

你可以通过编辑集群并选择 **Windows** 选项，从而将 Windows 主机添加到集群中。

1. 点击左上角 **☰ > 集群管理**。
1. 转到你创建的集群，然后单击 **⋮ > 编辑配置**。
1. 向下滚动到**节点操作系统**。选择 **Windows**。注意：你将看到 **worker** 角色是唯一可用的角色。
1. 将屏幕上显示的命令复制到剪贴板。
1. 使用你喜欢的工具（例如 [Microsoft 远程桌面](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients)）登录到 Windows 主机。在 **Command Prompt (CMD)** 中运行复制到剪贴板的命令。
1. 在 Rancher 中，单击**保存**。
1. 可选：如果要向集群添加更多 Windows 节点，请重复这些操作。

**结果**：**Worker** 角色已安装在你的 Windows 主机上，并且节点会向 Rancher 注册。节点可能需要几分钟才能注册到集群中。你现在已拥有一个 Windows Kubernetes 集群。

### 可选的后续步骤

创建集群后，你可以通过 Rancher UI 访问集群。最佳实践建议你设置以下访问集群的备用方式：

- **通过 kubectl CLI 访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#accessing-clusters-with-kubectl-on-your-workstation)在你的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会让你连接到下游集群。此方法允许你在没有 Rancher UI 的情况下管理集群。
- **通过 kubectl CLI 使用授权的集群端点访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#authenticating-directly-with-a-downstream-cluster)直接使用 kubectl 访问集群，而无需通过 Rancher Server 进行身份验证。我们建议设置此替代方法来访问集群，以便在无法连接到 Rancher 时访问集群。

## Azure 中存储类的配置

如果你的节点使用 Azure VM，则可以使用 [Azure 文件](https://docs.microsoft.com/en-us/azure/aks/azure-files-dynamic-pv)作为集群的存储类（StorageClass）。详情请参见[此部分]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/azure-storageclass)。
