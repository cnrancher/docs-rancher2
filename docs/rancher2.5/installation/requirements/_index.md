---
title: 具体要求
description: 这个页面描述了安装 Rancher Server 节点的软件，硬件和网络要求。Rancher Server 可以安装在单个节点或高可用的 Kubernetes 集群上。
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
  - 安装指南
  - 安装要求
  - 具体要求
---

这个页面描述了安装 Rancher Server 节点的软件，硬件和网络要求。Rancher Server 可以安装在单个节点或高可用的 Kubernetes 集群上。

:::important 注意
这是对安装 Rancher Server 的节点的要求。如果您要创建用来运行您自己的应用的集群，请参阅[下游集群的节点要求](/docs/rancher2.5/cluster-provisioning/node-requirements/_index)。
:::

请确保 Rancher Server 的节点满足以下要求：

- [操作系统和容器运行时要求](#操作系统和-docker-要求)
- [硬件要求](#硬件要求)
  - [CPU 和 Memory](#cpu-和-内存)
  - [Rancher 2.4.0 之前版本的 CPU 和 Memory](#rancher-v240-之前的-rke-高可用安装的-cpu-和内存要求)
  - [磁盘](#磁盘)
- [网络要求](#网络要求)
  - [节点 IP 地址](#节点-ip-地址)
  - [端口要求](#端口要求)

有关在生产环境中运行 Rancher Server 的最佳实践，请参阅[最佳实践](/docs/rancher2.5/best-practices/2.0-2.4/deployment-types/_index)部分。

建议在 Chrome 或 Firefox 中使用 Rancher UI。

## 操作系统和容器运行时要求

Rancher 应用可以兼容当前任何流行的 Linux 发行版。

对于将运行 K3s 或 RKE Kubernetes 集群的节点，需要使用 Docker。对于 RancherD 安装来说，Docker 不是必需的。

Rancher 需要安装在支持的 Kubernetes 版本上。要了解你的 Rancher 版本支持哪些 Kubernetes 版本，请参考[这里](https://rancher.com/support-maintenance-terms/)。

所有受支持的操作系统都是 64-bit x86。

我们建议安装 `ntp` (Network Time Protocol)，这样可以防止在客户端和服务器之间因为时钟不同步而发生证书验证错误。

一些 Linux 发行版可能有默认的防火墙规则。这些规则可能会屏蔽掉 Helm 的通信。这个[操作指南](/docs/rancher2.5/installation_new/resources/advanced/firewall/_index)展示了如何检查 Oracle Linux 的默认防火墙规则，以及在必要时如何使用`firewalld`开放端口。

如果计划在 ARM64 上运行 Rancher，请参阅[在 ARM64 上运行（实验性）](/docs/rancher2.5/installation_new/resources/advanced/arm64-platform/_index)。

### RKE 要求

RKE 可以兼容当前的所有 Docker 版本。

### K3s 要求

K3s 兼容当前的所有 Docker 版本或 containerd。

Rancher 需要安装在受支持的 Kubernetes 版本上。要了解您的 Rancher 版本支持哪些版本的 Kubernetes，请参考[支持维护条款](https://rancher.com/support-maintenance-terms/)。要指定 K3s 版本，请在运行 K3s 安装脚本时使用 INSTALL_K3S_VERSION 环境变量。

如果您在使用 Raspbian Buster 的 K3s 集群上安装 Rancher，请按照[这些步骤](/docs/k3s/advanced/_index)切换到传统的 iptables。

如果您在使用 Alpine Linux 的 K3s 集群上安装 Rancher，请按照[这些步骤](/docs/k3s/advanced/_index)]进行额外的设置。

### RancherD 要求

RancherD 安装从 v2.5.4 开始可用。这是一个实验性功能。

目前，只支持利用 systemd 的 Linux 操作系统。

RancherD 安装时不需要 Docker。

要在 SELinux Enforcing CentOS 8 或 RHEL 8 节点上安装 RancherD，需要一些额外的步骤。

### 安装 Docker

您可以按照[Docker 官方文档](https://docs.docker.com/)中的步骤安装 Docker。Rancher 也提供了使用命令安装 Docker 的[脚本](/docs/rancher2.5/installation_new/requirements/installing-docker/_index)。

## 硬件要求

本节描述安装 Rancher Server 的节点的 CPU、内存和磁盘要求。

### CPU 和 内存

硬件要求根据您的 Rancher 部署规模而定。请根据要求配置每个单独的节点。这些要求具体取决于您是通过单节点容器安装 Rancher，还是在 Kubernetes 集群上安装 Rancher。

### RKE 高可用安装的 CPU 和 内存要求

这些要求适用于[安装了 Rancher Server 的 RKE Kubernetes 集群](/docs/rancher2.5/installation_new/install-rancher-on-k8s/_index)中的每个主机。

在 Rancher v2.4.0 中提高了性能。有关 v2.4.0 之前的 Rancher 的要求，请参阅[本节](#rancher-v240-之前的-rke-高可用安装的-cpu-和内存要求)。

| 部署规模 | 集群         | 节点           | vCPUs | 内存   |
| :------- | :----------- | :------------- | :---- | :----- |
| 小       | 最多 150 个  | 最多 1500 个   | 2     | 8 GB   |
| 中       | 最多 300 个  | 最多 3000 个   | 4     | 16 GB  |
| 大       | 最多 500 个  | 最多 5000 个   | 8     | 32 GB  |
| 特大     | 最多 1000 个 | 最多 10,000 个 | 16    | 64 GB  |
| 超大     | 最多 2000 个 | 最多 20,000 个 | 32    | 128 GB |

[联系 Rancher](https://www.rancher.cn/contact/)，如果您要管理 2000+ 集群和/或 20000+ 节点。

### K3s 高可用安装的 CPU 和 内存要求

这些要求适用于[安装了 Rancher Server 的 K3s Kubernetes 集群](/docs/rancher2.5/installation_new/install-rancher-on-k8s/_index)中的每个主机。

| 部署规模 | 集群         | 节点           | vCPUs | 内存   | 数据库规模               |
| :------- | :----------- | :------------- | :---- | :----- | :----------------------- |
| 小       | 最多 150 个  | 最多 1500 个   | 2     | 8 GB   | 2 cores, 4GB + 1000 IOPS |
| 中       | 最多 300 个  | 最多 3000 个   | 4     | 16 GB  | 2 cores, 4GB + 1000 IOPS |
| 大       | 最多 500 个  | 最多 5000 个   | 8     | 32 GB  | 2 cores, 4GB + 1000 IOPS |
| 特大     | 最多 1000 个 | 最多 10,000 个 | 16    | 64 GB  | 2 cores, 4GB + 1000 IOPS |
| 超大     | 最多 2000 个 | 最多 20,000 个 | 32    | 128 GB | 2 cores, 4GB + 1000 IOPS |

[联系 Rancher](https://www.rancher.cn/contact/)，如果您要管理 2000+ 集群和/或 20,000+ 节点。

### RancherD 安装的 CPU 和 内存要求

| 部署规模 | 集群       | 节点        | vCPUs | 内存 | RAM |
| :------- | :--------- | :---------- | :---- | :--- | :-- |
| 小       | 最多 5 个  | 最多 50 个  | 2     | 4 GB |
| 中       | 最多 15 个 | 最多 200 个 | 3     | 8 GB |

### 单节点安装的 CPU 和 内存要求

这些要求适用于使用 Docker 安装 Rancher 的[单节点安装](/docs/rancher2.5/installation_new/other-installation-methods/single-node-docker/_index)。

| 部署规模 | 集群       | 节点        | vCPUs | 内存 |
| :------- | :--------- | :---------- | :---- | :--- |
| 小       | 最多 5 个  | 最多 50 个  | 1     | 4 GB |
| 中       | 最多 15 个 | 最多 200 个 | 2     | 8 GB |

### Rancher v2.4.0 之前的 RKE 高可用安装的 CPU 和内存要求

这些要求适用于安装了 v2.4.0 之前版本的 Rancher Server 所在的 Kubernetes 集群中的每个节点：

| 部署规模 | 集群        | 节点         | vCPUs                                           | 内存                                            |
| :------- | :---------- | :----------- | :---------------------------------------------- | :---------------------------------------------- |
| 小       | 最多 5 个   | 最多 50 个   | 2                                               | 8 GB                                            |
| 中       | 最多 15 个  | 最多 200 个  | 4                                               | 16 GB                                           |
| 大       | 最多 50 个  | 最多 500 个  | 8                                               | 32 GB                                           |
| 加大     | 最多 100 个 | 最多 1000 个 | 32                                              | 128 GB                                          |
| 超大     | 100+        | 1000+        | [联系 Rancher](https://www.rancher.cn/contact/) | [联系 Rancher](https://www.rancher.cn/contact/) |

### 磁盘

Rancher 的性能取决于 etcd 在集群中的性能。为了确保最佳速度，我们建议使用 SSD 磁盘来支持 Rancher 管里面的 Kubernetes 集群。在云提供商上，您还需要使用允许最大 IOPS 的最小大小。在较大的集群中，请考虑使用专用存储设备存储 etcd 数据和 wal 目录。

## 网络要求

本节描述了安装 Rancher Server 的节点的网络要求。

### 节点 IP 地址

无论您是在单个节点上还是在 Kubernetes 集群上安装 Rancher，每个节点都应配置一个静态 IP。如果使用 DHCP，则每个节点应具有 DHCP 预留，以确保该节点分配的相同 IP 地址。

### 端口要求

为了正常运行，Rancher 需要在 Rancher 节点和下游 Kubernetes 集群节点上开放一些端口。端口需求列出了不同集群类型的 Rancher 和下游集群的所有必要端口。详情请参考[端口要求](/docs/rancher2.5/installation_new/requirements/ports/_index)

## RancherD 在 SELinux 上强制执行 CentOS 8 或 RHEL 8 节点

在 SELinux Enforcing CentOS 8 节点或 RHEL 8 节点上安装 Rancher 之前，必须安装容器-selinux 和 iptables。

```bash
sudo yum install iptables
sudo yum install container-selinux
```
