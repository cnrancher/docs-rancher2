---
title: 推荐架构
description: 安装 Rancher 的方式有两种：单节点安装和高可用集群安装。因为单节点安装只适用于测试和 demo 环境，而且单节点安装和高可用集群安装之间不能进行数据迁移，所以我们推荐从一开始就使用高可用集群安装的方式安装 Rancher。本文将详细介绍高可用集群安装的配置方式。如果您仍然准备在单节点上安装 Rancher，本文只有分开部署 Rancher 与下游集群的部分适用于单节点安装。
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
  - 产品介绍
  - 推荐架构
---

安装 Rancher 的方式有两种：**单节点安装**和**高可用集群安装**。因为单节点安装只适用于测试和 demo 环境，而且单节点安装和高可用集群安装之间不能进行数据迁移，所以我们推荐从一开始就使用高可用集群安装的方式安装 Rancher。

本文将详细介绍高可用集群安装的配置方式。如果您仍然准备在单节点上安装 Rancher，本文只有[分开部署 Rancher 与下游集群](#分开部署-rancher-与下游集群)的部分适用于单节点安装。

## 分开部署 Rancher 与下游集群

下游集群，是运行您自己的应用和服务的下游 Kubernetes 集群。单节点安装和高可用集群安装都需要将部署 Rancher Server 的集群和下游集群分开。

![Separation of Rancher Server from User Clusters](/img/rancher/rancher-architecture-separation-of-rancher-server.svg)

## 为什么高可用集群与 Rancher 适配性更高

我们建议将 Rancher Server 安装在高可用的 Kubernetes 集群上，主要是因为它可以保护 Rancher Server 的数据。在高可用安装中，负载均衡器充当客户端的单点入口，并在集群中的多台服务器之间分配网络流量，这有助于防止任何一台服务器成为单点故障。

我们不建议在单个 Docker 容器中安装 Rancher，因为如果该节点发生故障，则其他节点上将没有可用的集群数据副本，并且您可能会丢失 Rancher 服务器上的数据。

Rancher 需要安装在高可用的 [RKE（Rancher Kubernetes Engine）](https://rancher.com/docs/rke/latest/en/)Kubernetes 集群上，或高可用的[K3s（比 K8s 少 5）](https://rancher.com/docs/k3s/latest/en/)Kubernetes 集群。 RKE 和 K3s 都是经过完全认证的 Kubernetes 发行版。

### K3s Kubernetes 集群安装

如果您是首次安装 Rancher v2.4，建议将其安装在 K3s Kubernetes 集群上。这种 K3s 架构的一个主要优点是，它允许使用外部数据库保存集群数据，从而可以将 K3s 服务器节点视为无状态的。

在 K3s 集群上安装 Rancher 的功能是在 Rancher v2.4 中引入的。K3s 易于安装，仅需要 Kubernetes 一半的内存，而且所有组件都在一个不超过 50 MB 的二进制文件中。

<figcaption> 使用 K3s Kubernetes 集群运行 Rancher Management Server 的架构 </figcaption>

![Architecture of a K3s Kubernetes Cluster Running the Rancher Management Server](/img/rancher/k3s-server-storage.svg)

### RKE Kubernetes 集群安装

如果要安装 Rancher v2.4 之前的版本，您需要在 RKE 集群上安装 Rancher，该集群中的数据存储在每个有 etcd 角色的节点上。在 Rancher v2.4 中，没有将 Rancher Server 从 RKE 集群迁移到 K3s 集群的方法。所有版本的 Rancher Server（包括 v2.4+）仍然可以安装在 RKE 集群上。

在 RKE 安装中，集群数据将在集群中的三个 etcd 节点上进行复制，这是为了保障在一个 etcd 节点发生故障时，可以提供冗余和数据复制。

<figcaption> 使用 RKE Kubernetes 集群运行 Rancher Management Server 的架构 </figcaption>

![Architecture of an RKE Kubernetes cluster running the Rancher management server](/img/rancher/rke-server-storage.svg)

## 负载均衡的推荐配置参数

我们建议您使用以下方案，配置您的负载均衡和 Ingress Controller：

- Rancher 的 DNS 应该被解析到四层负载均衡器上。
- 负载均衡器应该把 TCP/80 端口和 TCP/443 端口的流量转发到集群中全部的 3 个节点上。
- Ingress Controller 将把 HTTP 重定向到 HTTPS，在 TCP/443 端口使用 SSL/TLS。
- Ingress Controller 把流量转发到 Rancher Server 的 pod 的 80 端口。

<figcaption>在Kubernetes集群中安装Rancher，并使用四层负载均衡，SSL终止在Ingress Controller中</figcaption>

![Rancher HA](/img/rancher/ha/rancher2ha.svg)

## Kubernetes 的安装环境

我们强烈建议您使用云服务提供商的虚拟机，如 EC2、GCE 等，安装 Kubernetes 集群，然后在集群中安装 Rancher。

为了达到最好的性能和安全条件，我们建议您为 Rancher 创建一个专用的 Kubernetes 集群，只在这个机器中部署 Rancher Server，不在这个集群中运行应用或程序。部署 Rancher 后，您可以[创建新集群或导入已有集群](/docs/cluster-provisioning/_index)，然后用这些集群启动您自己的应用或程序。

我们不建议在托管的 Kubernetes 集群上，如 EKS 和 GKE，安装 Rancher。
这些托管的 Kubernetes 集群不会将 etcd 暴露给 Rancher ，达到 Rancher 可以管理的程度，而且它们的特殊改动可能与 Rancher 的操作冲突。

## 节点角色分配建议

根据 Rancher 是安装在 K3s Kubernetes 集群上还是 RKE Kubernetes 集群上，我们对每个节点的角色的建议有所不同。

### K3s 集群角色

在 K3s 集群中，有两种类型的节点：Master 节点和 Agent 节点。Master 和 Agent 都可以运行工作负载。Master 节点运行 Kubernetes Master。

对于运行 Rancher Server 的集群，建议使用两个 Master 节点。不需要 Agent 节点。

### RKE 集群角色

如果将 Rancher 安装在 RKE Kubernetes 集群上，则该集群应具有三个节点，并且每个节点都应具有所有三个 Kubernetes 角色：etcd，controlplane 和 worker。

### Rancher Server 所在的 RKE 集群和下游 RKE Kubernetes 集群架构对比

我们对 Rancher Server 集群上的 RKE 节点角色的建议与对运行您的业务应用的下游集群的建议相反。

在配置下游 Kubernetes 集群时，Rancher 使用 RKE 作为创建下游 Kubernetes 集群的工具。注意：在将来的 Rancher 版本中将添加创建下游 K3s 集群的功能。

对于下游 Kubernetes 集群，考虑到稳定性和可扩展性，我们建议下游集群中的每个节点都应只扮演一个角色。

![Rancher Server 集群与下游集群中节点的 Kubernetes 角色](/img/rancher/rancher-architecture-node-roles.svg)

RKE 每个节点至少需要一个角色，但并不强制每个节点只能有一个角色。但是，对于运行您的业务应用的集群，我们建议为每个节点使用单独的角色，这可以保证工作节点上的工作负载不会干扰 Kubernetes Master 或集群数据。

以下是我们对于下游集群的最低配置建议：

- **三个只有 etcd 角色的节点** 保障高可用性，如果这三个节点中的任意一个出现故障，还可以继续使用。
- **两个只有 controlplane 角色的节点** 这样可以保证 master 组件的高可用性。
- **一个或多个只有 worker 角色的节点** 用于运行 Kubernetes 节点组件和您部署的服务或应用。

在安装 Rancher Server 时三个节点，每个节点都有三个角色是安全的，因为：

- 可以允许一个 etcd 节点失败
- 多个 controlplane 节点使 master 组件保持多实例的状态。
- 该集群有且只有 Rancher 在运行。

因为这个节点中只部署了 Rancher，其他程序或应用都没有部署到这里，它的可扩展性和可靠性足以应对大多数情况。所以我们安装 Rancher 的集群并不需要像我们建议的客户集群这样。

请查看 [生产环境清单](/docs/cluster-provisioning/production/_index) 或 [最佳实践](/docs/best-practices/management/_index#tips-for-scaling-and-reliability)，获取下游集群配置的更多最佳实践。

## 授权集群端点的架构

如果您使用的是[授权集群端点](/docs/overview/architecture/_index)，我们建议您创建一个指向负载均衡的 FQDN，这个负载均衡把流量转到所有角色为 `controlplane` 的节点。

如果您在负载均衡上使用了私有 CA 签发的证书，您需要提供 CA 证书。这个证书将被包含在生成的 kubeconfig 文件中来校验证书链。详情请见 [kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index) 和 [API keys](/docs/user-settings/api-keys/_index)相关的文档。
