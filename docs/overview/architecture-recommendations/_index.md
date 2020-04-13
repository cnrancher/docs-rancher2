---
title: 推荐架构
---

安装 Rancher 的方式有两种：**单节点安装**和**高可用集群安装**。因为单节点安装只适用于测试和 demo 环境，而且单节点安装和高可用集群安装之间不能进行数据迁移，所以我们推荐从一开始就使用高可用集群安装的方式安装 Rancher。本文将详细介绍高可用集群安装的配置方式。如果您仍然准备在单节点上安装 Rancher，本文只有运行 Rancher 的节点[与下游集群开部署](#分开部署-rancher-与用户集群)的部分适用于单节点安装。

## 分开部署 Rancher 与用户集群

用户集群，是运行您自己的应用和服务的下游 Kubernetes 集群。

如果您是单节点通过 Docker 安装的 Rancher。那么运行 Rancher Server 的节点应该和您的下游集群区分开。

如果您是 Kubernetes 方式安装的 Rancher，安装 Rancher Server 的集群应该和下游集群分开部署。

![Separation of Rancher Server from User Clusters](/img/rancher/rancher-architecture-separation-of-rancher-server.svg)

## 为什么高可用集群与 Rancher 适配性更高

在生产环境中，我们建议您创建三节点的 Kubernetes 集群，然后把 Rancher Server 安装在里面，这样可以保障 Rancher Server 的数据安全。不管是单节点安装，还是高可用安装，Rancher Server 都会把数据存储在 etcd 中。

使用单节点安装 Rancher Server 时，如果该节点出现故障，而且 etcd 数据在其他节点没有备份，那么有可能导致 Rancher Server 数据丢失。

与单节点安装不同，高可用集群（High Availability Cluster，简称 HA）安装具有如下优势：

- etcd 节点数据在三个节点上都有备份，如果 etcd 节点出现故障，其他三个节点可以提供数据备份。
- 负载均衡负责对外提供服务，它可以把网络流量分配给集群内的多个服务器，防止单个服务器因为访问请求过多，而出现故障。这个[例子](/docs/installation/options/nginx/_index)讲述如何通过 NGINX 配置四层负载均衡（TCP）。

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

适合安装 Rancher 的 Kubernetes 集群应满足以下条件：

- 集群有多个节点。
- 每个节点都有三个 Kubernetes 角色：etcd、controlplane 和 worker。

## Rancher Server 集群和用户集群的角色对比

Rancher Server 集群中的节点角色分配，我们建议每个节点都分配 etcd、controlplane 和 worker 三个角色；而用户集群中的角色分配则恰好相反，每个节点只分配一个角色，这样可以保持集群的稳定性和可扩展性。

![Kubernetes Roles for Nodes in Rancher Server Cluster vs. User Clusters](/img/rancher/rancher-architecture-node-roles.svg)

Kubernetes 只要求每个节点至少要分配到一个角色，而没有对每个节点可分配的角色数量作要求。然而，对于您自己需要运行应用的用户集群，我们建议只给每个节点分配一个角色来提高可扩展性。这样您的业务应用不会干扰到 Kubernetes Master 节点或集群的数据。

以下是我们对于下游用户集群的最低配置建议：

- **三个只有 etcd 角色的节点** 保障高可用性，如果这三个节点中的任意一个出现故障，还可以继续使用。
- **两个只有 controlplane 角色的节点** 这样可以保证 master 组件的高可用性。
- **一个或多个只有 worker 角色的节点** 用于运行 Kubernetes 节点组件和您部署的服务或应用。

在安装 Rancher Server 时三个节点，每个节点都有三个角色是安全的，因为：

- 可以允许一个 etcd 节点失败
- 多个 controlplane 节点使 master 组件保持多实例的状态。
- 该集群有且只有 Rancher 在运行。

因为这个节点中只部署了 Rancher，其他程序或应用都没有部署到这里，它的可扩展性和可靠性足以应对大多数情况。所以我们安装 Rancher 的集群并不需要像我们建议的客户集群这样。

请查看 [生产环境清单](/docs/cluster-provisioning/production/_index) 或 [最佳实践](/docs/best-practices/management/_index#tips-for-scaling-and-reliability)，获取用户用户集群配置的更多最佳实践。

## 授权集群端点的架构

如果您使用的是[授权集群端点](/docs/overview/architecture/_index)，我们建议您创建一个指向负载均衡的 FQDN，这个负载均衡把流量转到所有角色为 `controlplane` 的节点。

如果您在负载均衡上使用了私有 CA 签发的证书，您需要提供 CA 证书。这个证书将被包含在生成的 kubeconfig 文件中来校验证书链。详情请见 [kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index) 和 [API keys](/docs/user-settings/api-keys/_index)相关的文档。
