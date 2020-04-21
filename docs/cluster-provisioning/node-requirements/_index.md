---
title: 下游集群节点要求
description: 本页描述了安装您的应用和服务所在节点的要求。在本章节，`下游集群` 是指运行您的应用程序的集群，它应该与运行 Rancher Server 的集群（或单个节点）分开。如果 Rancher 安装在 Kubernetes 集群上，Rancher Server 集群和下游集群有不同的要求。有关 Rancher Server 安装要求，请参阅高可用安装要求。请确保 Rancher Server 的节点满足以下要求。
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
  - 下游集群节点要求
---

本页描述了安装您的应用和服务所在节点的要求。

在本章节，`下游集群` 是指运行您的应用程序的集群，它应该与运行 Rancher Server 的集群（或单个节点）分开。

> 如果 Rancher 安装在 Kubernetes 集群上，Rancher Server 集群和下游集群有不同的要求。有关 Rancher Server 安装要求，请参阅[高可用安装要求](/docs/installation/requirements/_index)。

请确保 Rancher Server 的节点满足以下要求。

## 操作系统和 Docker 要求

Rancher 理论上可以任何通用的 Linux 发行版和任何通用的 Docker 版本一起工作。所有下游集群的 etcd 和 controlplane 节点都需要运行在 Linux 上。Worker 节点可以运行在 Linux 或 Windows 上。在 Rancher v2.3.0 中添加了在下游集群中使用 Windows Worker 节点的功能。

Rancher 已经过测试，并官方支持在 Ubuntu，CentOS，Oracle Linux，RancherOS 和 RedHat Enterprise Linux 上运行下游集群。关于每个 Rancher 版本所测试过的操作系统和 Docker 版本的详细信息，请参阅[支持维护条款](https://rancher.com/support-maintenance-terms/)。

所有受支持的操作系统都是 64-bit x86 系统。

如果您计划使用 ARM64，请参阅[在 ARM64 上运行（实验性）](/docs/installation/options/arm64-platform/_index)。

有关如何安装 Docker 的信息，请参阅官方[Docker 文档](https://docs.docker.com/)。

一些 RHEL 派生的 Linux 发行版，可能有默认的防火墙规则。这些规则可能会屏蔽掉 Helm 的通信。这个[操作指南](/docs/installation/options/firewall/_index)展示了如何检查 Oracle Linux 的默认防火墙规则，以及在必要时如何使用`firewalld`开放端口。

SUSE Linux 可能有默认阻止所有端口的防火墙。在这种情况下，请按照[以下步骤](#开放-suse-linux-端口)，开放将添加到自定义集群的主机的端口。

### Windows 节点要求

_Rancher v2.3.0 可以使用 Windows Worker 节点_

Windows Server 的节点必须使用 Docker 企业版。这是 Kubernetes 的限制。

Windows 节点只能用于工作节点。详情请参阅[配置自定义 Windows 集群](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)。

## 硬件要求

具有`worker`角色的节点的硬件要求主要取决于您的工作负载。运行 Kubernetes 节点组件的最小值是 1 个 CPU（核心）和 1GB 内存。

关于 CPU 和内存，建议将不同平面的 Kubernetes 集群组件（etcd、controlplane 和 worker）托管在不同的节点上，以便它们可以彼此分开扩展。

有关大型 Kubernetes 集群的硬件建议，请参阅关于[构建大型集群](https://kubernetes.io/docs/setup/best-practices/cluster-large/)的官方 Kubernetes 文档。

有关生产中 etcd 集群的硬件建议，请参阅官方[etcd 文档](https://etcd.io/docs/v3.4.0/op-guide/hardware/)。

## 网络要求

对于生产集群，我们建议您仅开放下文端口要求中定义的端口来限制流量。

需要开放的端口根据下游集群的启动方式而有所不同。下面的每个部分列出了在不同的[集群创建选项](/docs/cluster-provisioning/_index)下需要开放的端口。

有关 kubernetes 集群中 etcd 节点、controlplane 节点和 worker 节点的端口要求的详细信息，请参阅 [Rancher Kubernetes Engine 的端口要求](https://rancher.com/docs/rke/latest/en/os/#ports)。

有关在每种情况下使用哪些端口的详细信息，请参阅以下章节。

### 常用端口

如果安全性不是一个大问题，并且您可以开放一些额外的端口，则可以使用此表作为端口参考，而不是后续部分中的综合表。

这些端口通常在 Kubernetes 节点上是开放的，无论它是什么类型的集群。

<figcaption>常用端口参考</figcaption>

|  协议   |    端口     | 描述                                        |
| :-----: | :---------: | ------------------------------------------- |
|   TCP   |     22      | 节点驱动程序 SSH 设置                       |
|   TCP   |    2376     | 节点驱动程序 Docker 守护进程 TLS 端口       |
|   TCP   |    2379     | etcd 客户端请求                             |
|   TCP   |    2380     | etcd 对等通信                               |
|   UDP   |    8472     | Canal/Flannel VXLAN overlay 网络            |
|   UDP   |    4789     | windows 集群上的 Flannel VXLAN overlay 网络 |
|   TCP   |    9099     | Canal/Flannel 健康检查                      |
|   TCP   |    6783     | Weave 端口                                  |
|   UDP   |  6783-6784  | Weave UDP 端口                              |
|   TCP   |    10250    | kubelet API                                 |
|   TCP   |    10254    | Ingress controller 健康检查                 |
| TCP/UDP | 30000-32767 | NodePort 端口范围                           |

### 自定义集群的端口要求

如果您要在现有的云服务商上启动 Kubernetes 集群，请参阅这些端口要求。

下表描述了[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)与[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)的端口要求。

import PortsCustomNodes from '@theme/PortsCustomNodes';

<PortsCustomNodes/>

### 集群节点托管在云服务商的端口要求

如果您要在云服务商（如 Amazon EC2、Google Container Engine、DigitalOcean、Azure 或 vSphere）中的节点上启动 Kubernetes 集群，请应用这些端口要求。

在使用云服务商创建集群期间，Rancher 会自动开放这些必需的端口。

下表描述了[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)在[云服务商](/docs/cluster-provisioning/rke-clusters/node-pools/_index)创建节点的端口要求。

> **注意：**
> 在 Amazon EC2 或 DigitalOcean 等云服务商创建集群期间，Rancher 会自动开放所需的端口。

import PortsIaasNodes from '@theme/PortsIaasNodes';

<PortsIaasNodes/>

#### AWS EC2 上节点的安全组

在使用 [AWS EC2 主机驱动](/docs/cluster-provisioning/rke-clusters/node-pools/ec2/_index)在 Rancher 中配置集群节点时，您可以选择让 Rancher 创建一个名为 rancher-nodes 的安全组。以下规则将自动添加到此安全组。

| 类型            | 协议 |  端口范围   | 源/目的                | 规则类型 |
| --------------- | :--: | :---------: | ---------------------- | :------: |
| SSH             | TCP  |     22      | 0.0.0.0/0              |   入站   |
| HTTP            | TCP  |     80      | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |     443     | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |    2376     | 0.0.0.0/0              |   入站   |
| 自定义 TCP 规则 | TCP  |  2379-2380  | sg-xxx (rancher-nodes) |   入站   |
| 自定义 UDP 规则 | UDP  |    4789     | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  |    6443     | 0.0.0.0/0              |   入站   |
| 自定义 UDP 规则 | UDP  |    8472     | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  | 10250-10252 | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  |    10256    | sg-xxx (rancher-nodes) |   入站   |
| 自定义 TCP 规则 | TCP  | 30000-32767 | 0.0.0.0/0              |   入站   |
| 自定义 UDP 规则 | UDP  | 30000-32767 | 0.0.0.0/0              |   入站   |
| 全部流量        | All  |     All     | 0.0.0.0/0              |   出站   |

### 托管 Kubernetes 集群的端口要求

如果您使用服务商托管的 Kubernetes（如 Google Kubernetes Engine、Amazon 或 Azure Kubernetes 服务）启动集群，请参阅这些端口要求。

下表描述了[托管的 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index)中节点的端口要求。

import PortsImportedHosted from '@theme/PortsImportedHosted';

<PortsImportedHosted/>

### 导入集群的端口要求

如果要导入现有集群，请参阅这些端口要求。

下表描述了[导入集群](/docs/cluster-provisioning/import-clusters/_index)的端口要求。

<PortsImportedHosted/>

### 本地流量的端口要求

在端口要求中标记为 `local traffic`（例如：`9099 TCP`）的端口用于 Kubernetes 运行健康检查`livenessProbe`和`readinessprobe`）。
这些健康检查在自身节点上执行。在大多数云环境中，默认情况下允许此本地流量。

但是，在以下情况下，此流量可能会被阻止：

- 您已在节点上应用了严格的主机防火墙策略。
- 您正在使用具有多个接口（多宿主）的节点。

在这些情况下，您必须在您的主机防火墙中明确允许此流量，或者在机器托管在公共/私有云（例如：AWS 或 OpenStack）的情况下，在您的安全组配置中明确允许此流量。请记住，在安全组中设置源或目标时，显式打开端口仅适用于节点/实例的私有接口。

## 可选：安全注意事项

如果您想要配置符合 CIS（Center for Internet Security）Kubernetes 基准的 Kubernetes 集群，我们建议您在安装 Kubernetes 之前，遵循我们的安全加固指南来配置您的节点。

有关安全加固指南的更多信息以及指南的哪个版本与您的 Rancher 和 Kubernetes 版本对应的详细信息，请参阅[安全说明](/docs/security/_index)。

## 开放 SUSE Linux 端口

SUSE Linux 可能具有默认情况下阻止所有端口的防火墙。要开放中集群所需的主机端口。

1. SSH 进入实例。
2. 编辑/`etc/sysconfig/SuSEfirewall2`并开放所需的端口。在此示例中，还开放了端口 9796 和 10250 以进行监视：

   ```
   FW_SERVICES_EXT_TCP="22 80 443 2376 2379 2380 6443 9099 9796 10250 10254 30000:32767"
   FW_SERVICES_EXT_UDP="8472 30000:32767"
   FW_ROUTE=yes
   ```

3. 使用新端口重启防火墙:

   ```
   SuSEfirewall2
   ```

**结果：** 节点添加到自定义集群所需的节点端口已打开。
