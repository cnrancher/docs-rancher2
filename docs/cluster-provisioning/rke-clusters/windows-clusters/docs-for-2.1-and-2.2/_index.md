---
title: v2.1 和v2.2 版本中的 Windows 支持（实验性）
description: 本节介绍如何在 Rancher v2.1.x 和 v2.2.x 版本中配置 Windows 集群。如果您正在使用 Rancher v2.3.0 或更高版本的 Rancher，请参阅新的 Windows 文档[v2.3.0 或更高版本](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。
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
  - v2.1 和v2.2 版本中的 Windows 支持（实验性）
---

_适用于 v2.1.0 到 v2.1.9 和 v2.2.0 到 v2.2.3 版本_

本节介绍如何在 Rancher v2.1.x 和 v2.2.x 版本中配置 Windows 集群。如果您正在使用 Rancher v2.3.0 或更高版本的 Rancher，请参阅新的 Windows 文档[v2.3.0 或更高版本](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。

当您创建一个[自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index) （Rancher 使用 RKE (Rancher Kubernetes Engine) 在现有的节点上配置 Kubernetes 集群）时，您可以通过将 Linux 和 Windows 节点混合使用来创建自定义 Windows 集群。

> **重要:** 在 v2.3 之前的 Rancher 版本中，对 Windows 节点的支持是实验性的。因此，如果您在 v2.3 之前使用 Rancher，则不建议在生产环境中使用 Windows 节点。

本指南将引导您完成创建包含三个节点的自定义 Windows 集群：

- 一个 Linux 节点，用作 Kubernetes 管理面节点。
- 另一个 Linux 节点，用作 Kubernetes 工作节点，用于支持集群的 Ingress Controller 等。
- 一个 Windows 节点，也用作 Kubernetes 工作节点，用于运行您的 Windows 容器。

有关 Kubernetes 支持 Windows 的特性的摘要，请参阅[在 Kubernetes 中使用 Windows](https://kubernetes.io/docs/setup/windows/intro-windows-in-kubernetes/)。

## 操作系统和容器要求

- 对于使用 Rancher v2.1.x 和 v2.2.x 创建的集群，容器必须运行在 Windows Server 1809 或更高版本的 Windows 上。
- 您必须在 Windows Server 1809 或更高版本的 Windows 上构建容器，才能在有着相同 Windows 版本的服务器上运行这些容器。

## 创建支持 Windows 的集群

在设置支持 Windows 节点和容器的自定义集群时，请完成下面的一系列任务.

### 1、创建节点

开始创建支持 Windows 的自定义集群前，请先准备您的节点服务器。根据我们的[需求](/docs/installation/requirements/_index)提供三个节点，两个 Linux 节点，一个 Windows 节点。您的节点可以是：

- 云主机
- 虚拟化平台中的虚拟机
- 裸金属服务器

下表列出了您将分配给每个节点的[Kubernetes 角色](/docs/cluster-provisioning/_index)，尽管在创建节点过程中，您不会启用这些角色。但我们只是通知您每个节点的用途。第一个节点是 Linux 节点，主要负责 Kubernetes 控制面，不过，在这个用例中，我们将在这个节点上安装所有三个角色。节点 2 还是一个 Linux 工作节点，负责 Ingress Controller 等组件的支持。最后，第三个节点是 Windows 工作节点，它将运行您的 Windows 应用程序。

| 节点   | 操作系统                                              | 集群未来的角色                   |
| ------ | ----------------------------------------------------- | -------------------------------- |
| 节点 1 | Linux (推荐 Ubuntu Server 16.04)                      | controlplane，etcd，worker       |
| 节点 2 | Linux (推荐 Ubuntu Server 16.04)                      | worker (此节点用于 Ingress 支持) |
| 节点 3 | Windows (Windows Server core version 1809 或更高版本) | worker                           |

#### 要求

- 您可以在[安装指南](/docs/installation/requirements/_index)中查看 Linux 和 Windows 节点的节点要求。
- 虚拟化或裸金属的节点都必须使用 2 层网络连接。
- 为了支持[Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress/)，您的集群必须包含至少一个专门用于 worker 角色的 Linux 节点。
- 尽管我们推荐上表中只列出的三个节点的架构，但是您可以添加额外的 Linux 和 Windows 节点来扩展您的集群，来实现冗余。

### 2、云主机的网络配置

> **注意:** 此步骤仅适用于托管在云厂商虚拟机上的节点。如果您正在使用虚拟化或裸金属服务器，请直击跳到[创建自定义集群](#3、创建自定义集群)。

如果您将节点托管在下面列出的任何云服务上，则必须在启动时禁用 Linux 和 Windows 节点时，禁用私有 IP 地址检查。请按照下面每个的说明，在每个节点上禁用的此检查。

| 服务       | 禁用私有 IP 地址检查的说明                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 亚马逊 EC2 | [禁用源/目标检查](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck)                             |
| 谷歌云     | [为实例启用 IP 转发](https://cloud.google.com/vpc/docs/using-routes#canipforward)                                                              |
| Azure VM   | [启用或禁用 IP 转发](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface#enable-or-disable-ip-forwarding) |

### 3、创建自定义集群

要创建支持 Windows 节点的自定义集群，请按照[使用自定义节点创建集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)中的说明操作，创建自定义集群，创建 Windows 集群的差异入下。

#### 启用 Windows 支持选项

在选择**集群选项**时，将**Windows 支持** (**实验**)设置为启用。

#### 网络选项

当为支持 Windows 的集群选择网络插件时，唯一可用的选项是 Flannel，因为我们要用到[host-gw](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)来进行 IP 路由。

如果您的节点由云提供商托管，并且您希望获得额外自动化功能，例如负载均衡器或持久存储设备等，有关配置信息，请参阅[Cloud Provider 设置](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)。

#### 节点配置

集群中的第一个节点应该是充当控制面角色的 Linux 节点。在将 Windows 节点添加到集群之前，必须先创建此角色的节点。此节点必须启用 etcd 和 controlplane 角色，但我们建议同时启用这三个角色。下表列出了我们的推荐设置 (稍后我们将为节点 2 和节点 3 提供推荐设置)。

| 选项         | 设置                       |
| ------------ | -------------------------- |
| 节点操作系统 | Linux                      |
| 节点的角色   | etcd，controlplane，worker |

### 4、添加支持 Ingress 的 Linux 节点

在完成自定义集群的初始设置之后，集群只有一个 Linux 节点。我们需要添加另一个 Linux 节点，该节点将用于支持集群的 Ingress。

1. 从主菜单中，找到您的 Windows 集群。

1. 单击 **编辑集群**.

1. 向下滚动到**节点操作系统**。选择**Linux**.

1. 选择 **Worker** 角色.

1. 将屏幕上显示的命令复制到剪贴板.

1. 使用远程终端连接登录到 Linux 节点。运行复制到剪贴板的命令.

1. 在 **Rancher**中，单击 **保存**.

**结果:** worker 角色已安装在 Linux 节点上，节点注册到了 Rancher 中。

### 5、添加 Windows 工作节点

您可以通过编辑集群并选择**Windows**选项将 Windows 节点添加到自定义集群。

1. 从主菜单中，找到您的 Windows 集群。

1. 单击 **编辑集群**.

1. 向下滚动到**节点操作系统**。选择**Windows**.

1. 选择 **Worker** 角色.

1. 将屏幕上显示的命令复制到剪贴板.

1. 使用您喜欢的工具登录到您的 Windows 节点，例如[Microsoft 远程桌面](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients)。在**命令提示符(CMD)**中运行复制到剪贴板的命令。

1. 在 Rancher 中，单击 **保存**.

1. **可选:** 如果您希望向集群中添加更多的 Windows 节点，请重复这些指令。

**结果:** worker 角色已经安装在您的 Windows 节点上，节点注册到了 Rancher 中。

### 6、配置云主机路由

我们使用的 Flannel 后端是[**Host Gateway（L2bridge）**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)模式，那么同一节点上的所有容器都属于一个私有子网，子网会通过主机网络和另一个节点上的子网进行通信。

- 如果您的节点在 AWS、私有数据中心或裸金属服务器上，请确保这些节点都在相同的 2 层子网中。如果节点不属于同一个 2 层子网，那么`host-gw`网络将无法正常工作。

- 如果您的节点在谷歌云或 Azure 上，那么它们会在不同的 2 层子网中。谷歌云和 Azure 上的节点属于一个可路由的 3 层网络。请按照下面的说明，来配置谷歌云和 Azure，以便云网络知道如何在每个节点上路由主机子网。

要在谷歌云或 Azure 上配置主机子网路由，首先运行以下命令来查找每个工作节点上的主机子网：

```bash
kubectl get nodes -o custom-columns=nodeName:.metadata.name,nodeIP:status.addresses[0].address,routeDestination:.spec.podCIDR
```

然后按照每个云提供商的说明为每个节点配置路由规则：

| 服务   | 说明                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 谷歌云 | 如果节点在谷歌云，您需要为每个节点添加一个静态路由：[添加静态路由](https://cloud.google.com/vpc/docs/using-routes#addingroute)。                                   |
| Azure  | 如果节点在 Azure，您需要创建一个路由表：[自定义路由:用户定义](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#user-defined)。 |
