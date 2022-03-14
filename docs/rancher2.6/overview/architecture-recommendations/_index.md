---
title: 架构推荐
weight: 3
---

如果你准备在单个节点上安装 Rancher，我们推荐你[分开部署 Rancher 与下游集群](#separation-of-rancher-and-user-clusters)。

本节涵盖以下主题：

- [分开部署 Rancher 与下游集群](#separation-of-rancher-and-user-clusters)
- [为什么高可用（HA）更适合生产环境中的 Rancher](#why-ha-is-better-for-rancher-in-production)
- [Kubernetes 安装中负载均衡器的推荐配置参数](#recommended-load-balancer-configuration-for-kubernetes-installations)
- [Kubernetes 安装环境](#environment-for-kubernetes-installations)
- [Kubernetes 安装的节点角色建议](#recommended-node-roles-for-kubernetes-installations)
- [授权集群端点（ACE）的架构](#architecture-for-an-authorized-cluster-endpoint-ace)

## 分开部署 Rancher 与下游集群

下游集群，是运行你自己的应用和服务的下游 Kubernetes 集群。

如果你通过 Docker 安装了 Rancher，运行 Rancher Server 的节点应该与你的下游集群分开。

如果你需要使用 Rancher 管理下游 Kubernetes 集群，那么运行 Rancher Server 的 Kubernetes 集群也应该与下游集群分开。

![分开部署 Rancher Server 与下游集群]({{<baseurl>}}/img/rancher/rancher-architecture-separation-of-rancher-server.svg)

## 为什么高可用（HA）更适合生产环境中的 Rancher

我们建议在高可用 Kubernetes 集群上安装 Rancher Server，以保护 Rancher Server 的数据。在高可用安装中，负载均衡器充当客户端的单点入口，并在集群中的多台服务器之间分配网络流量，这有助于防止任何一台服务器成为单点故障。

我们不建议在单个 Docker 容器中安装 Rancher，因为如果该节点发生故障，则其他节点上将没有可用的集群数据副本，并且你可能会丢失 Rancher Server 上的数据。

### K3s Kubernetes 集群安装

底层 Kubernetes 集群的一种选择是使用 K3s Kubernetes。K3s 是 Rancher CNCF 认证的 Kubernetes 发行版。K3s 易于安装，仅需要 Kubernetes 内存的一半，所有组件都在一个小于 100 MB 的二进制文件中。K3s 的另一个优点是允许外部 Datastore 保存集群数据，因此可以把 K3s 服务器节点视为无状态。

<figcaption>运行 Rancher Management Server 的 K3s Kubernetes 集群架构</figcaption>
![使用 K3s Kubernetes 集群运行 Rancher Management Server 的架构]({{<baseurl>}}/img/rancher/k3s-server-storage.svg)

### RKE Kubernetes 集群安装

在 RKE 安装中，集群数据在集群中的三个 etcd 节点上复制，以在某个节点发生故障时提供冗余和进行数据复制。

<figcaption>运行 Rancher Management Server 的 RKE Kubernetes 集群的架构</figcaption>
![运行 Rancher Management Server 的 RKE Kubernetes 集群的架构]({{<baseurl>}}/img/rancher/rke-server-storage.svg)

## Kubernetes 安装的负载均衡器推荐配置

我们建议你为负载均衡器和 Ingress Controller 使用以下配置：

* 把 Rancher 的 DNS 解析到四层负载均衡器上。
* 负载均衡器应该把 TCP/80 端口和 TCP/443 端口的流量转发到 Kubernetes 集群的全部 3 个节点上。
* Ingress Controller 会把 HTTP 重定向到 HTTPS，在 TCP/443 端口终结 SSL/TLS。
* Ingress Controller 会把流量转发到 Rancher deployment 的 Pod 上的 TCP/80 端口。

<figcaption>在 Kubernetes 集群中安装 Rancher，并使用四层负载均衡器，SSL 终止在 Ingress Controller 中</figcaption>
![Rancher 高可用]({{<baseurl>}}/img/rancher/ha/rancher2ha.svg)

## Kubernetes 安装环境

我们强烈建议你把 Rancher 安装到托管在云提供商（如 AWS EC2 和 Google Compute Engine（GCE）等）上的 Kubernetes 集群上。

为了达到最佳性能和安全性，我们建议你为 Rancher Management Server 创建一个专用的 Kubernetes 集群。不建议在此集群上运行用户工作负载。部署 Rancher 后，你可以[创建或导入集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)来运行你的工作负载。

## Kubernetes 安装的推荐节点角色

如果 Rancher 安装在 K3s Kubernetes 或 RKE Kubernetes 集群上，以下建议适用。

### K3s 集群角色

在 K3s 集群中有两种类型的节点，分别是 Server 节点和 Agent 节点。你可以把工作负载调度到 Server 节点和 Agent 节点上。Server 节点运行 Kubernetes master。

对于运行 Rancher Management Server 的集群，我们建议使用两个 server 节点。不需要 Agent 节点。

### RKE 集群角色

如果 Rancher 安装在 RKE Kubernetes 集群上，该集群应具有三个节点，并且每个节点都应具有所有三个 Kubernetes 角色，分别是 etcd，controlplane 和 worker。

### Rancher Server 和下游 Kubernetes 集群的 RKE 集群架构对比

我们对 Rancher Server 集群上 RKE 节点角色建议，与对运行你的应用和服务的下游集群的建议相反。

在配置下游 Kubernetes 集群时，Rancher 使用 RKE 作为创建下游 Kubernetes 集群的工具。注意：Rancher 将在未来的版本中添加配置下游 K3s 集群的功能。

我们建议下游 Kubernetes 集群中的每个节点都只分配一个角色，以确保稳定性和可扩展性。

![Rancher Server 集群中和下游集群中节点的 Kubernetes 角色对比]({{<baseurl>}}/img/rancher/rancher-architecture-node-roles.svg)

RKE 每个角色至少需要一个节点，但并不强制每个节点只能有一个角色。但是，我们建议为运行应用的集群中的每个节点，使用单独的角色，以保证在服务拓展时，worker 节点上的工作负载不影响 Kubernetes master 或集群的数据。

以下是我们对下游集群的最低配置建议：

- **三个仅使用 etcd 角色的节点** ，以在三个节点中其中一个发生故障时，仍能保障集群的高可用性。
- **两个只有 controlplane 角色的节点** ，以保证 master 组件的高可用性。
- **一个或多个只有 worker 角色的节点**，用于运行 Kubernetes 节点组件，以及你部署的服务或应用的工作负载。

在设置 Rancher Server 时，在三个节点上使用全部这三个角色也是安全的，因为：

* 允许一个 `etcd` 节点故障。
* 多个 `controlplane` 节点可以维护 master 组件的多个实例。
* 该集群中只有 Rancher 在运行。

由于 Rancher Server 集群中没有部署其他工作负载，因此在大多数情况下，这个集群都不需要使用我们出于可扩展性和可用性的考虑，而为下游集群推荐的架构。

有关下游集群的最佳实践，请查看[生产环境清单]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/production)或[最佳实践]({{<baseurl>}}/rancher/v2.6/en/best-practices/)。

## 授权集群端点（ACE）架构

如果你使用[授权集群端点（ACE）]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)，我们建议你创建一个指向负载均衡器的 FQDN，这个负载均衡器把流量转到所有角色为 `controlplane` 的节点。

如果你在负载均衡器上使用了私有 CA 签发的证书，你需要提供 CA 证书，这个证书会包含在生成的 kubeconfig 文件中，以校验证书链。详情请参见 [kubeconfig 文件]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/)和 [API 密钥]({{<baseurl>}}/rancher/v2.6/en/user-settings/api-keys/#creating-an-api-key)的相关文档。

在 Rancher 2.6.3 中，注册的 RKE2 和 K3s 集群可以使用 ACE 支持。点击[这里]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/#authorized-cluster-endpoint-support-for-rke2-and-k3s-clusters)了解在下游集群中开启 ACE 的步骤。
