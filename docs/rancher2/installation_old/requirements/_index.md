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
这是对安装 Rancher Server 的节点的要求。如果您要创建用来运行您自己的应用的集群，请参阅[下游集群的节点要求](/docs/rancher2/cluster-provisioning/node-requirements/_index)。
:::

请确保 Rancher Server 的节点满足以下要求:

- [操作系统和容器运行时要求](#操作系统和-docker-要求)
- [硬件要求](#硬件要求)
  - [CPU 和 Memory](#cpu-和-内存)
  - [Rancher 2.4.0 之前版本的 CPU 和 Memory](#rancher-v240-之前的-rke-高可用安装的-cpu-和内存要求)
  - [磁盘](#磁盘)
- [网络要求](#网络要求)
  - [节点 IP 地址](#节点-ip-地址)
  - [端口要求](#端口要求)

有关在生产环境中运行 Rancher Server 的最佳实践，请参阅[最佳实践](/docs/rancher2/best-practices/2.0-2.4/deployment-types/_index)部分。

建议在 Chrome 或 Firefox 中使用 Rancher UI。

## 操作系统和容器运行时要求

Rancher 应用可以兼容当前任何流行的 Linux 发行版。

Rancher 官方支持并且已在如下操作系统中测试了 Rancher 和 RKE，它们包括 Ubuntu，CentOS，Oracle Linux，RancherOS 和 RedHat Enterprise Linux

K3s 几乎可以在任何 Linux 版本上运行。K3s 在以下操作系统及其这些版本后续的非主要版本中进行了测试：

- Ubuntu 16.04 (amd64)
- Ubuntu 18.04 (amd64)
- Raspbian Buster (armhf)

如果您在 K3s 集群上使用**Raspbian Buster**安装 Rancher，请参考[这些步骤](/docs/k3s/advanced/_index)，在 Raspbian Buster 中启用 legacy iptables。

如果您要在 Alpine Linux 操作系统上安装 K3s 集群并安装 Rancher，您需要执行[这些额外步骤](/docs/k3s/advanced/_index)。

有关每个 Rancher 版本测试了哪些操作系统和 Docker 版本的详细信息，请参阅[支持维护条款](https://rancher.com/support-maintenance-terms/)。

所有受支持的操作系统都是 64-bit x86。

我们建议安装 `ntp` (Network Time Protocol)，这样可以防止在客户端和服务器之间因为时钟不同步而发生证书验证错误。

一些 Linux 发行版可能有默认的防火墙规则。这些规则可能会屏蔽掉 Helm 的通信。这个[操作指南](/docs/rancher2/installation/options/firewall/_index)展示了如何检查 Oracle Linux 的默认防火墙规则，以及在必要时如何使用`firewalld`开放端口。

如果计划在 ARM64 上运行 Rancher，请参阅[在 ARM64 上运行（实验性）](/docs/rancher2/installation/options/arm64-platform/_index)。

#### 安装 Docker

您可以按照[Docker 官方文档](https://docs.docker.com/)中的步骤安装 Docker。Rancher 也提供了使用命令安装 Docker 的[脚本](/docs/rancher2/installation/requirements/installing-docker/_index)。

## 硬件要求

本节描述安装 Rancher Server 的节点的 CPU、内存和磁盘要求。

#### CPU 和 内存

硬件要求根据您的 Rancher 部署规模而定。请根据要求配置每个单独的节点。这些要求具体取决于您是通过单节点容器安装 Rancher，还是在 Kubernetes 集群上安装 Rancher。

### RKE 高可用安装的 CPU 和 内存要求

这些要求适用于[安装了 Rancher Server 的 RKE Kubernetes 集群](/docs/rancher2/installation/k8s-install/_index)中的每个主机。

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

这些要求适用于[安装了 Rancher Server 的 K3s Kubernetes 集群](/docs/rancher2/installation/k8s-install/_index)中的每个主机。

| 部署规模 | 集群         | 节点           | vCPUs | 内存   | 数据库规模               |
| :------- | :----------- | :------------- | :---- | :----- | :----------------------- |
| 小       | 最多 150 个  | 最多 1500 个   | 2     | 8 GB   | 2 cores, 4GB + 1000 IOPS |
| 中       | 最多 300 个  | 最多 3000 个   | 4     | 16 GB  | 2 cores, 4GB + 1000 IOPS |
| 大       | 最多 500 个  | 最多 5000 个   | 8     | 32 GB  | 2 cores, 4GB + 1000 IOPS |
| 特大     | 最多 1000 个 | 最多 10,000 个 | 16    | 64 GB  | 2 cores, 4GB + 1000 IOPS |
| 超大     | 最多 2000 个 | 最多 20,000 个 | 32    | 128 GB | 2 cores, 4GB + 1000 IOPS |

[联系 Rancher](https://www.rancher.cn/contact/)，如果您要管理 2000+ 集群和/或 20,000+ 节点。

### 单节点安装的 CPU 和 内存要求

这些要求适用于使用 Docker 安装 Rancher 的[单节点安装](/docs/rancher2/installation/other-installation-methods/single-node-docker/_index)。

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

#### 端口要求

本节描述运行`rancher/rancher`容器的节点的端口要求。

端口要求会有所不同，具体取决于您是在 K3s 集群，RKE 集群还是单个 Docker 容器中安装 Rancher。

### K3s 高可用安装的端口要求

#### 用于与下游集群通信的端口

为了与下游集群通信，Rancher 要求开放不同的端口，具体取决于您使用的基础架构。

例如，如果您在基础设施提供商托管的节点上部署 Rancher，则必须为 SSH 开放`22`端口。

下图描述了为每种[集群类型](/docs/rancher2/cluster-provisioning/_index)开放的端口。

<figcaption>Rancher 管理面的端口要求</figcaption>

![Basic Port Requirements](/img/rancher/port-communications.svg)

下表细分了入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                                                                                                     | 描述                                   |
| :--- | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| TCP  | 80   | 进行外部 SSL 终止的负载均衡器/代理                                                                                                                     | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>etcd 节点</li><li>controlplane 节点</li><li>worker 节点</li><li>托管的/导入的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 目的                                                     | 描述                                             |
| :--- | :--- | :------------------------------------------------------- | :----------------------------------------------- |
| TCP  | 22   | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443  | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376 | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 6443 | 托管的/导入的 Kubernetes API                             | Kubernetes API Server                            |

**注意** 如果您配置了的外部[身份验证系统](/docs/rancher2/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。

#### K3s 集群中节点的其他端口要求

为了安装 Rancher 高可用，您需要打开其他端口来启动 Kubernetes 集群。

K3s Server 需要开放 6443 端口供节点访问。

使用 Flannel VXLAN 时，这些节点需要能够通过 UDP 端口 8472 访问其他节点。节点不应侦听其他端口。K3s 使用反向隧道，建立节点与服务器的出站连接，所有 kubelet 通信都通过该隧道进行。但是，如果您不使用 Flannel，而是使用自定义的 CNI，则 K3s 不需要 8472 端口。

如果要使用指标服务器（Metrics Server），则需要在每个节点上打开端口 10250。

> **重要：** 节点上的 VXLAN 端口不应暴露给外界，因为这会开放集群网络，任何人都可以访问它。请在禁止访问 8472 端口的防火墙/安全组后面运行节点。

<figcaption> Rancher Server 节点的入站规则 </figcaption>

| 协议 | 端口  | 源                       | 描述               |
| :--- | :---- | :----------------------- | :----------------- |
| TCP  | 6443  | K3s server 节点          | Kubernetes API     |
| UDP  | 8472  | K3s server 和 agent 节点 | Flannel VXLAN 需要 |
| TCP  | 10250 | K3s server 和 agent 节点 | kubelet            |

通常情况下，您可以允许全部的出站流量。

### RKE 高可用安装的端口要求

#### 用于与下游集群通信的端口

为了与下游集群通信，Rancher 要求开放不同的端口，具体取决于您使用的基础架构。

例如，如果您在基础设施提供商托管的节点上部署 Rancher，则必须为 SSH 开放`22`端口。

下图描述了为每种[集群类型](/docs/rancher2/cluster-provisioning/_index)开放的端口。

<figcaption>Rancher 管理面的端口要求</figcaption>

![Basic Port Requirements](/img/rancher/port-communications.svg)

下表细分了入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                                                                                                     | 描述                                   |
| :--- | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| TCP  | 80   | 进行外部 SSL 终止的负载均衡器/代理                                                                                                                     | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>etcd 节点</li><li>controlplane 节点</li><li>worker 节点</li><li>托管的/导入的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 目的                                                     | 描述                                             |
| :--- | :--- | :------------------------------------------------------- | :----------------------------------------------- |
| TCP  | 22   | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443  | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376 | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 6443 | 托管的/导入的 Kubernetes API                             | Kubernetes API Server                            |

**注意** 如果您配置了的外部[身份验证系统](/docs/rancher2/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。

#### RKE 集群中节点的其他端口需求

通过 RKE 安装 Rancher 高可用所在的集群时，您还需要开放其他的端口。

如果您按照 Rancher 安装文档通过 RKE 配置 Kubernetes 集群，这个集群中所有的三个节点都具有所有三个角色：etcd、controlplane 和 worker。在这种情况下，您可以参考具有所有三个角色的每个节点的需求列表：

如果您将 Rancher 安装在 RKE Kubernetes 集群上，但并不是每个节点都具有全部三个角色，请参考 [Rancher Kubernetes Engine（RKE）的端口要求](/docs/rke/os/_index)。RKE 文档显示了每个角色的端口要求的细分。

<figcaption>具有所有三个角色的节点的入站规则：etcd、controlplane 和 worker</figcaption>

| 协议    | 端口        | 源                                                                   | 描述                                                                            |
| :------ | :---------- | :------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| TCP     | 22          | 仅 Linux worker 节点，以及您希望从远程访问这个节点的任何网络。       | 通过 SSH 进行远程访问                                                           |
| TCP     | 80          | 任何使用 Ingress 服务的源                                            | Ingress controller (HTTP)                                                       |
| TCP     | 443         | 任何使用 Ingress 服务的源                                            | Ingress controller (HTTPS)                                                      |
| TCP     | 2376        | Rancher 节点                                                         | Docker Machine 使用的 Docker 守护进程 TLS 的端口（仅在使用 主机驱动/模板时需要) |
| TCP     | 2379        | etcd 节点 和 controlplane 节点                                       | etcd 客户端请求                                                                 |
| TCP     | 2380        | etcd nodes 和 controlplane 节点                                      | etcd 节点通信                                                                   |
| TCP     | 3389        | 仅 Windows worker 节点，以及您希望能够从远程访问这个节点的任何网络。 | 通过 RDP 远程访问                                                               |
| TCP     | 6443        | etcd 节点, controlplane 节点和 worker 节点                           | Kubernetes apiserver                                                            |
| UDP     | 8472        | etcd 节点, controlplane 节点和 worker 节点                           | Canal/Flannel VXLAN overlay 网络                                                |
| TCP     | 9099        | 节点本身 (本地流量， 不跨节点)                                       | Canal/Flannel livenessProbe/readinessProbe                                      |
| TCP     | 10250       | controlplane 节点                                                    | kubelet                                                                         |
| TCP     | 10254       | 节点本身 (本地流量， 不跨节点)                                       | Ingress controller livenessProbe/readinessProbe                                 |
| TCP/UDP | 30000-32767 | 任何使用 NodePort 服务的源                                           | NodePort 端口范围                                                               |

<figcaption>具有所有三个角色的节点的出站规则：etcd、controlplane 和 worker</figcaption>

| 协议 | 端口  | 源                                         | 目的                                            | 描述                        |
| :--- | :---- | :----------------------------------------- | :---------------------------------------------- | :-------------------------- |
| TCP  | 22    | RKE 节点                                   | 集群配置文件中配置的任何节点                    | RKE 通过 SSH 进行节点的配置 |
| TCP  | 443   | Rancher 节点                               | Rancher agent                                   |
| TCP  | 2379  | etcd 节点                                  | etcd 客户端请求                                 |
| TCP  | 2380  | etcd 节点                                  | etcd 节点通信                                   |
| TCP  | 6443  | RKE 节点                                   | controlplane 节点                               | Kubernetes API Server       |
| TCP  | 6443  | controlplane 节点                          | Kubernetes API Server                           |
| UDP  | 8472  | etcd 节点，controlplane 节点和 worker 节点 | Canal/Flannel VXLAN overlay 网络                |
| TCP  | 9099  | 节点本身（本地流量，不跨节点）             | Canal/Flannel livenessProbe/readinessProbe      |
| TCP  | 10250 | etcd 节点，controlplane 节点和 worker 节点 | kubelet                                         |
| TCP  | 10254 | 节点本身（本地流量，不跨节点）             | Ingress controller livenessProbe/readinessProbe |

### 单节点安装的端口要求

#### 与下游集群通信的端口

对于 Docker 安装，您只需要打开 Rancher 与下游用户集群通信所需的端口即可。

端口要求取决于您使用的基础设施。例如，如果要在基础设施提供商托管的节点上部署 Rancher，则必须开放`22`端口，这样您才能使用 SSH。

下图描述了为每种[集群类型](/docs/rancher2/cluster-provisioning/_index)开放的端口。

<figcaption>Rancher 管理面的端口要求</figcaption>

![Basic Port Requirements](/img/rancher/port-communications.svg)

下表细分了入站和出站流量的端口要求：

**注意** 如果您配置了的外部[身份验证系统](/docs/rancher2/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。

<figcaption>入站规则</figcaption>

| 协议 | 端口 | 源                                                                                                                                                     | 描述                                   |
| :--- | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| TCP  | 80   | 进行外部 SSL 终止的负载均衡器/代理                                                                                                                     | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>etcd 节点</li><li>controlplane 节点</li><li>worker 节点</li><li>托管的/导入的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher agent，Rancher UI/API，kubectl |

<figcaption>出站规则</figcaption>

| 协议 | 端口 | 源                                                       | 描述                                             |
| :--- | :--- | :------------------------------------------------------- | :----------------------------------------------- |
| TCP  | 22   | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443  | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376 | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 6443 | 托管/导入集群的 Kubernetes API 端口                      | Kubernetes API Server                            |

**注意** 如果您配置了的外部[身份验证系统](/docs/rancher2/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。
