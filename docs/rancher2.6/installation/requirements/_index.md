---
title: 安装要求
description: 如果 Rancher 配置在 Docker 或 Kubernetes 中运行时，了解运行 Rancher Server 的每个节点的节点要求
weight: 1
---

本文描述了对需要安装 Rancher Server 的节点的软件、硬件和网络要求。Rancher Server 可以安装在单个节点或高可用的 Kubernetes 集群上。

> 如果你需要在 Kubernetes 集群上安装 Rancher，该节点的要求与用于运行应用和服务的[下游集群的节点要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/)不同。

请确保安装 Rancher server 的节点满足以下要求：

- [操作系统和容器运行时要求](#operating-systems-and-container-runtime-requirements)
   - [RKE 要求](#rke-specific-requirements)
   - [K3s 要求](#k3s-specific-requirements)
   - [RKE2 要求](#rke2-specific-requirements)
   - [安装 Docker](#installing-docker)
- [硬件要求](#hardware-requirements)
- [CPU 和内存](#cpu-and-memory)
   - [RKE 和托管 Kubernetes](#rke-and-hosted-kubernetes)
   - [K3s Kubernetes](#k3s-kubernetes)
   - [RKE2 Kubernetes](#rke2-kubernetes)
   - [Docker](#docker)
- [Ingress](#ingress)
   - [RKE2 的 Ingress](#ingress-for-rke2)
   - [EKS 的 Ingress](#ingress-for-eks)
- [磁盘](#disks)
- [网络要求](#networking-requirements)
   - [节点 IP 地址](#node-ip-addresses)
   - [端口要求](#port-requirements)
- [Dockershim 支持](#dockershim-support)

如需获取在生产环境中运行 Rancher server 的最佳实践列表，请参见[最佳实践]({{<baseurl>}}/rancher/v2.6/en/best-practices/rancher-server/deployment-types/)。

Rancher UI 在 Firefox 或 Chrome 中效果更佳。

# 操作系统和容器运行时要求

Rancher 兼容当前所有的主流 Linux 发行版。

运行 RKE Kubernetes 集群的节点需要安装 Docker。Kubernetes 安装不需要 Docker。

Rancher 需要安装在支持的 Kubernetes 版本上。如需了解你使用的 Rancher 版本支持哪些 Kubernetes 版本，请参见[支持维护条款](https://rancher.com/support-maintenance-terms/)。

如需了解各个 Rancher 版本通过了哪些操作系统和 Docker 版本测试，请参见[支持和维护条款](https://rancher.com/support-maintenance-terms/)。

所有支持的操作系统都使用 64-bit x86 架构。

请安装 `ntp`（Network Time Protocol），以防止在客户端和服务器之间由于时间不同步造成的证书验证错误。

某些 Linux 发行版的默认防火墙规则可能会阻止与 Helm 的通信。我们建议禁用 firewalld。如果使用的是 Kubernetes 1.19，1.20 或 1.21，则必须关闭 firewalld。

如果你不太想这样做的话，你可以查看[相关问题](https://github.com/rancher/rancher/issues/28840)中的建议。某些用户已能成功[使用 ACCEPT 策略 为 Pod CIDR 创建一个独立的 firewalld 区域](https://github.com/rancher/rancher/issues/28840#issuecomment-787404822)。

如果你需要在 ARM64 上使用 Rancher，请参见[在 ARM64（实验功能）上运行 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/arm64-platform/)。

### RKE 要求

容器运行时方面，RKE 可以兼容当前的所有 Docker 版本。

请注意，必须应用以下 sysctl 设置：

```
net.bridge.bridge-nf-call-iptables=1
```

### K3s 要求

容器运行时方面，K3s 可以兼容当前的所有 Docker 版本。

Rancher 需要安装在支持的 Kubernetes 版本上。如需了解你使用的 Rancher 版本支持哪些 Kubernetes 版本，请参见[支持维护条款](https://rancher.com/support-maintenance-terms/)。如需指定 K3s 版本，请在运行 K3s 安装脚本时，使用 INSTALL_K3S_VERSION 环境变量。

如果你使用 **Raspbian Buster** 在 K3s 集群上安装 Rancher，请按照[这些步骤]({{<baseurl>}}/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster)切换到旧版 iptables。

如果你使用 Alpine Linux 的 K3s 集群上安装 Rancher，请按照[这些步骤]({{<baseurl>}}/k3s/latest/en/advanced/#additional-preparation-for-alpine-linux-setup) 进行其他设置。



### RKE2 要求

如需了解 RKE2 通过了哪些操作系统版本的测试，请参见[支持和维护条款](https://rancher.com/support-maintenance-terms/)。

RKE2 安装不需要 Docker。

Ingress 需要部署为 DaemonSet 以确保负载均衡器能成功把流量转发到各个节点。目前，RKE2 默认将 nginx-ingress 部署为 Deployment，因此你需要按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/ha-rke2/#5-configure-nginx-to-be-a-daemonset)将其部署为 DaemonSet。

### 安装 Docker

Docker 是 Helm Chart 安装所必须的。你可以参见 [Docker 官方文档](https://docs.docker.com/)中的步骤进行安装。Rancher 也提供使用单条命令安装 Docker 的[脚本]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/installing-docker)。

# 硬件要求

本节描述安装 Rancher Server 的节点的 CPU、内存和磁盘要求。

# CPU 和内存

硬件要求根据你的 Rancher 部署规模而定。请根据要求配置每个节点。通过单节点容器安装 Rancher，和在 Kubernetes 集群上安装 Rancher 的要求有所不同。

### RKE 和托管 Kubernetes

这些 CPU 和内存要求适用于每个安装 Rancher Server 的 Kubernetes 集群中的主机。

这些要求适用于 RKE Kubernetes 集群以及托管的 Kubernetes 集群，例如 EKS。

| 部署规模 | 集群 | 节点 | vCPUs | 内存 |
| --------------- | ---------- | ------------ | -------| ------- |
| 小 | 最多 150 个 | 最多 1500 个 | 2 | 8 GB |
| 中 | 最多 300 个 | 最多 3,000 个 | 4 | 16 GB |
| 大 | 最多 500 个 | 最多 5,000 个 | 8 | 32 GB |
| 特大 | 最多 1,000 个 | 最多 10,000 个 | 16 | 64 GB |
| 超大 | 最多 2,000 个 | 最多 20,000 个 | 32 | 128 GB |

如果你的集群数量超过 2,000，以及（或）节点数量超过20,000，请[联系 Rancher](https://rancher.com/contact/)。

### K3s Kubernetes

这些 CPU 和内存要求适用于每个[安装 Rancher Server 的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)中的主机。

| 部署规模 | 集群 | 节点 | vCPUs | 内存 | 数据库大小 |
| --------------- | ---------- | ------------ | -------| ---------| ------------------------- |
| 小 | 最多 150 个 | 最多 1500 个 | 2 | 8 GB | 2 核，4 GB + 1,000 IOPS |
| 中 | 最多 300 个 | 最多 3,000 个 | 4 | 16 GB | 2 核，4 GB + 1,000 IOPS |
| 大 | 最多 500 个 | 最多 5,000 个 | 8 | 32 GB | 2 核，4 GB + 1,000 IOPS |
| 特大 | 最多 1,000 个 | 最多 10,000 个 | 16 | 64 GB | 2 核，4 GB + 1,000 IOPS |
| 超大 | 最多 2,000 个 | 最多 20,000 个 | 32 | 128 GB | 2 核，4 GB + 1,000 IOPS |

如果你的集群数量超过 2,000，以及（或）节点数量超过20,000，请[联系 Rancher](https://rancher.com/contact/)。


### RKE2 Kubernetes

这些 CPU 和内存要求适用于安装了 RKE2 的每个实例。最低配置要求如下：

| 部署规模 | 集群 | 节点 | vCPUs | 内存 |
| --------------- | -------- | --------- | ----- | ---- |
| 小 | 最多 5 个 | 最多 50 个 | 2 | 5 GB |
| 中 | 最多 15 个 | 最多 200 个 | 3 | 9 GB |

### Docker

这些 CPU 和内存要求适用于[单节点]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker)安装 Rancher 的主机。

| 部署规模 | 集群 | 节点 | vCPUs | 内存 |
| --------------- | -------- | --------- | ----- | ---- |
| 小 | 最多 5 个 | 最多 50 个 | 1 | 4 GB |
| 中 | 最多 15 个 | 最多 200 个 | 2 | 8 GB |

# Ingress

安装 Rancher 的 Kubernetes 集群中的每个节点都应该运行一个 Ingress。

Ingress 需要部署为 DaemonSet 以确保负载均衡器能成功把流量转发到各个节点。

如果是 RKE 和 K3s 安装，你不需要手动安装 Ingress，因为它是默认安装的。

如果是托管 Kubernetes 集群（EKS、GKE、AKS）和 RKE2 Kubernetes 安装，你需要设置 Ingress。

### RKE2 的 Ingress

目前，RKE2 默认将 nginx-ingress 部署为 Deployment，因此你需要按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/ha-rke2/#5-configure-nginx-to-be-a-daemonset)将其部署为 DaemonSet。

### EKS 的 Ingress
如果你需要获取使用 LoadBalancer 服务部署 nginx-ingress-controller 的示例，请参见[此处]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/amazon-eks/#5-install-an-ingress)。

# 磁盘

etcd 在集群中的性能决定了 Rancher 的性能。因此，为了获得最佳速度，我们建议使用 SSD 磁盘来支持 Rancher 管理的 Kubernetes 集群。在云提供商上，你还需使用能获得最大 IOPS 的最小大小。在较大的集群中，请考虑使用专用存储设备存储 etcd 数据和 wal 目录。

# 网络要求

本节描述了安装 Rancher Server 的节点的网络要求。

### 节点 IP 地址

无论你是在单个节点还是高可用集群上安装 Rancher，每个节点都应配置一个静态 IP。如果使用 DHCP，则每个节点应具有 DHCP 预留，以确保该节点分配的相同 IP 地址。

### 端口要求

为了确保能正常运行，Rancher 需要在 Rancher 节点和下游 Kubernetes 集群节点上开放一些端口。不同集群类型的 Rancher 和下游集群的所有必要端口，请参见[端口要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/ports)。

# Dockershim 支持

Kubernetes 1.20 弃用了 Dockershim，也不再使用 Docker 作为 Kubernetes 容器运行时。Dockershim 作为适配器内置于 Kubernetes 中，用于让 Kubernetes 管理 Docker 容器。由于 Docker Daemon 不适用于为 Kubernetes 创建的 CRI（容器运行时接口），因此 Dockershim 是必须的。Dockershim 仍然包含在 Kubernetes 1.20 的 kubelet 中。

Rancher 计划实施 [Mirantis 和 Docker 宣布的上游开源社区 Dockershim](https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/) 以确保 RKE 集群可以继续利用 Docker 作为其容器运行时。RKE 用户将能够利用 Docker 作为运行时和安装方法，以继续升级和构建新的 RKE 集群。

如果你想使用其它容器运行时，Rancher 也提供使用 Containerd 作为默认运行时的，以边缘为中心的 K3s，和以数据中心为中心的 RKE2 Kubernetes 发行版。然后，你就可以通过 Rancher 对导入的 RKE2 和 K3s Kubernetes 集群进行升级和管理。

有关弃用 Docker 作为 Kubernetes 容器运行时的详情，请参见 [Kubernetes 官方博客](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/)和 Mirantis 的[官方博客](https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/)。

Dockershim 弃用计划由上游 Kubernetes 社区在 [Kubernetes 增强提案 (KEP) 1985](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1985-remove-dockershim) 中跟踪。