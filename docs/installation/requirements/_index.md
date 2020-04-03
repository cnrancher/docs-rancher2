---
title: 具体要求
---

这个页面描述了安装 Rancher Server 节点的软件，硬件和网络要求。Rancher Server 可以安装在单个节点或高可用的 Kubernetes 集群上。

:::important 注意
这是对安装 Rancher Server 的节点的要求。如果您要创建用来运行您自己的应用的集群，请参阅[用户集群的节点要求](/docs/cluster-provisioning/node-requirements/_index)。
:::

请确保 Rancher Server 的节点满足以下要求:

- [操作系统和 Docker 要求](#操作系统和-docker-要求)
- [硬件要求](#硬件要求)
  - [CPU 和 Memory](#cpu-和-内存)
  - [磁盘](#磁盘)
- [网络要求](#网络要求)
  - [节点 IP 地址](#节点-ip-地址)
  - [端口要求](#端口要求)

有关在生产环境中运行 Rancher Server 的最佳实践，请参阅[最佳实践](/docs/best-practices/deployment-types/_index)部分。

建议在 Chrome 或 Firefox 中使用 Rancher UI。

## 操作系统和 Docker 要求

Rancher 应用可以兼容当前任何流行的 Linux 发行版和流行的 Docker 版本。

Rancher 官方支持并且已在如下操作系统中进行了测试，它们包括 Ubuntu，CentOS，Oracle Linux，RancherOS 和 RedHat Enterprise Linux

有关每个 Rancher 版本测试了哪些操作系统和 Docker 版本的详细信息，请参阅[支持维护条款](https://rancher.com/support-maintenance-terms/)。

所有受支持的操作系统都是 64-bit x86。

我们建议安装 `ntp` (Network Time Protocol)，这样可以防止在客户端和服务器之间因为时钟不同步而发生证书验证错误。

一些 Linux 发行版可能有默认的防火墙规则。这些规则可能会屏蔽掉 Helm 的通信。这个[操作指南](/docs/installation/options/firewall/_index)展示了如何检查 Oracle Linux 的默认防火墙规则，以及在必要时如何使用`firewalld`开放端口。

如果计划在 ARM64 上运行 Rancher，请参阅[在 ARM64 上运行（实验性）](/docs/installation/options/arm64-platform/_index)。

#### 安装 Docker

您可以按照[Docker 官方文档](https://docs.docker.com/)中的步骤安装 Docker。Rancher 也提供了使用命令安装 Docker 的[脚本](/docs/installation/requirements/installing-docker/_index)。

## 硬件要求

本节描述安装 Rancher Server 的节点的 CPU、内存和磁盘要求。

#### CPU 和 内存

硬件要求根据您的 Rancher 部署规模而定。根据要求配置每个单独的节点要求是不同的，具体取决于您是将 Rancher 与 Docker 一起安装还是在 Kubernetes 集群上安装。

### RKE 高可用安装的 CPU 和 内存要求

这些要求适用于[在 Kubernetes 集群上安装 Rancher](/docs/installation/k8s-install/_index)。

| 部署规模 | 集群        | 节点         | vCPUs                                           | 内存                                            |
| -------- | ----------- | ------------ | ----------------------------------------------- | ----------------------------------------------- |
| 小       | 最多 5 个   | 最多 50 个   | 2                                               | 8 GB                                            |
| 中       | 最多 15 个  | 最多 200 个  | 4                                               | 16 GB                                           |
| 大       | 最多 50 个  | 最多 500 个  | 8                                               | 32 GB                                           |
| 加大     | 最多 100 个 | 最多 1000 个 | 32                                              | 128 GB                                          |
| 超大     | 100+        | 1000+        | [联系 Rancher](https://www.rancher.cn/contact/) | [联系 Rancher](https://www.rancher.cn/contact/) |

### 单节点安装的 CPU 和 内存要求

这些要求适用于使用 Docker 安装 Rancher 的[单节点安装](/docs/installation/other-installation-methods/single-node-docker/_index)。

| 部署规模 | 集群       | 节点        | vCPUs | 内存 |
| -------- | ---------- | ----------- | ----- | ---- |
| 小       | 最多 5 个  | 最多 50 个  | 1     | 4 GB |
| 中       | 最多 15 个 | 最多 200 个 | 2     | 8 GB |

### 磁盘

Rancher 的性能取决于 etcd 在集群中的性能。为了确保最佳速度，我们建议使用 SSD 磁盘来支持 Rancher 管里面的 Kubernetes 集群。在云提供商上，您还需要使用允许最大 IOPS 的最小大小。在较大的集群中，请考虑使用专用存储设备存储 etcd 数据和 wal 目录。

## 网络要求

本节描述了安装 Rancher Server 的节点的网络要求。

### 节点 IP 地址

无论您是在单个节点上还是在 Kubernetes 集群上安装 Rancher，每个节点都应配置一个静态 IP。如果使用 DHCP，则每个节点应具有 DHCP 预留，以确保该节点分配的相同 IP 地址。

#### 端口要求

本节描述运行`rancher/rancher`容器的节点的端口要求。

端口要求会有所不同，这取决于您是单节点安装还是高可用安装。

- **对于 Docker 单节点**，您只需要开放使 Rancher 能够与下游用户集群通信所需的端口即可。
- **对于高可用安装**，需要开放相同的端口，以及 Rancher Server 所安在的 Kubernetes 集群所需的其他端口。

### RKE 高可用安装的端口要求

#### 用于与下游集群通信的端口

为了与下游集群通信，Rancher 要求开放不同的端口，具体取决于您使用的基础架构。

例如，如果您在基础设施提供商托管的节点上部署 Rancher，则必须为 SSH 开放`22`端口。

下图描述了为每种[集群类型](/docs/cluster-provisioning/_index)开放的端口。

<figcaption>Rancher 管理面的端口要求</figcaption>

![Basic Port Requirements](/img/rancher/port-communications.svg)

下表细分了入站和出站流量的端口要求：

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                                                                                                     | 描述                                   |
| ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| TCP  | 80   | 进行外部 SSL 终止的负载均衡器/代理                                                                                                                     | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>etcd 节点</li><li>controlplane 节点</li><li>worker 节点</li><li>托管的/导入的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher Agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 目的                                                     | 描述                                             |
| ---- | ---- | -------------------------------------------------------- | ------------------------------------------------ |
| TCP  | 22   | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443  | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376 | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 6443 | 托管的/导入的 Kubernetes API                             | Kubernetes API Server                            |

**注意** 如果您配置了的外部[身份验证系统](/docs/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。

#### RKE 集群中节点的其他端口需求

通过 RKE 安装 Rancher 高可用所在的集群时，您还需要开放其他的端口。

如果您按照 Rancher 安装文档通过 RKE 配置 Kubernetes 集群，这个集群中所有的三个节点都具有所有三个角色：etcd、controlplane 和 worker。在这种情况下，您可以参考具有所有三个角色的每个节点的需求列表：

<figcaption>具有所有三个角色的节点的入站规则：etcd、controlplane 和 worker</figcaption>

| 协议    | 端口        | 源                                                                   | 描述                                                                            |
| ------- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| TCP     | 22          | 仅 Linux worker 节点，以及您希望从远程访问这个节点的任何网络。       | 通过 SSH 进行远程访问                                                           |
| TCP     | 80          | 任何使用 Ingress 服务的源                                            | Ingress controller (HTTP)                                                       |
| TCP     | 443         | 任何使用 Ingress 服务的源                                            | Ingress controller (HTTPS)                                                      |
| TCP     | 2376        | Rancher 节点                                                         | Docker Machine 使用的 Docker 守护进程 TLS 的端口（仅在使用 主机驱动/模版时需要) |
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
| ---- | ----- | ------------------------------------------ | ----------------------------------------------- | --------------------------- |
| TCP  | 22    | RKE 节点                                   | 集群配置文件中配置的任何节点                    | RKE 通过 SSH 进行节点的配置 |
| TCP  | 443   | Rancher 节点                               | Rancher agent                                   |
| TCP  | 2379  | etcd 节点                                  | etcd 客户端请求                                 |
| TCP  | 2380  | etcd 节点                                  | etcd 节点通信                                   |
| TCP  | 6443  | RKE 节点                                   | controlplane 节点                               | Kubernetes API Server       |
| TCP  | 6443  | controlplane 节点                          | Kubernetes API Server                           |
| UDP  | 8472  | etcd 节点, controlplane 节点和 worker 节点 | Canal/Flannel VXLAN overlay 网络                |
| TCP  | 9099  | 节点本身（本地流量，不跨节点）             | Canal/Flannel livenessProbe/readinessProbe      |
| TCP  | 10250 | etcd 节点, controlplane 节点和 worker 节点 | kubelet                                         |
| TCP  | 10254 | 节点本身（本地流量，不跨节点               | Ingress controller livenessProbe/readinessProbe |

每个节点需要开放的端口取决于节点的 Kubernetes 角色：etcd、controlplane 或 worker。如果您将 Rancher 安装在 Kubernetes 集群上，但并不是每个节点都有这三个角色，请参阅[Rancher Kubernetes Engine（RKE）的端口要求](https://rancher.com/docs/rke/latest/en/os/#ports)。RKE 文档显示了每个角色的端口需求。

### 单节点安装的端口要求

#### 与下游集群通信的端口

为了与下游集群通信，Rancher 要求开放不同的端口，具体端口取决于使用的基础架构。

例如，如果要在基础设施提供商托管的节点上部署 Rancher，则必须为 SSH 开放`22`端口。

下图描述了为每种[集群类型](/docs/cluster-provisioning/_index)开放的端口。

<figcaption>Rancher 管理面的端口要求</figcaption>

![Basic Port Requirements](/img/rancher/port-communications.svg)

下表细分了入站和出站流量的端口要求：

**注意** 如果您配置了的外部[身份验证系统](/docs/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。

<figcaption>Rancher 节点的入站规则</figcaption>

| 协议 | 端口 | 源                                                                                                                                                     | 描述                                   |
| ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| TCP  | 80   | 进行外部 SSL 终止的负载均衡器/代理                                                                                                                     | 使用外部 SSL 终止时的 Rancher UI/API   |
| TCP  | 443  | <ul><li>etcd 节点</li><li>controlplane 节点</li><li>worker 节点</li><li>托管的/导入的 Kubernetes</li><li>任何需要使用 Rancher UI 或 API 的源</li></ul> | Rancher agent，Rancher UI/API，kubectl |

<figcaption>Rancher 节点的出站规则</figcaption>

| 协议 | 端口 | 源                                                       | 描述                                             |
| ---- | ---- | -------------------------------------------------------- | ------------------------------------------------ |
| TCP  | 22   | 使用主机驱动创建的节点中的任何节点 IP                    | 使用主机驱动通过 SSH 进行节点配置                |
| TCP  | 443  | `35.160.43.145/32`，`35.167.242.46/32`，`52.33.59.17/32` | git.rancher.io (应用商店)                        |
| TCP  | 2376 | 使用主机驱动创建的节点中的任何节点 IP                    | Docker Machine 使用的 Docker 守护进程的 TLS 端口 |
| TCP  | 6443 | 托管/导入集群的 Kubernetes API 端口                      | Kubernetes API Server                            |

**注意** 如果您配置了的外部[身份验证系统](/docs/admin-settings/authentication/_index)（例如 LDAP），Rancher 节点可能还需要其他出站规则。
