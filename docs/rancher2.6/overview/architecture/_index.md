---
title: 架构
weight: 1
---

本章节介绍 Rancher Server 及其组件，以及 Rancher 如何与下游 Kubernetes 集群通信。

有关安装 Rancher 的不同方式的信息，请参见[安装选项概述]({{<baseurl>}}/rancher/v2.6/en/installation/#overview-of-installation-options)。

有关 Rancher API Server 的主要功能，请参见[概述]({{<baseurl>}}/rancher/v2.6/en/overview/#features-of-the-rancher-api-server)。

有关如何为 Rancher Server 设置底层基础架构，请参见[架构推荐]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations)。

> 本节默认你已对 Docker 和 Kubernetes 有一定的了解。如果你需要了解 Kubernetes 组件如何协作，请参见 [Kubernetes 概念]({{<baseurl>}}/rancher/v2.6/en/overview/concepts)。

本节涵盖以下主题：

- [Rancher Server 架构](#rancher-server-architecture)
- [与下游集群通信](#communicating-with-downstream-user-clusters)
   - [认证代理](#1-the-authentication-proxy)
   - [Cluster controller 和 Cluster Agent](#2-cluster-controllers-and-cluster-agents)
   - [Node Agent](#3-node-agents)
   - [授权集群端点（ACE）](#4-authorized-cluster-endpoint-ace)
- [重要文件](#important-files)
- [配置 Kubernetes 集群的工具](#tools-for-provisioning-kubernetes-clusters)
- [Rancher Server 组件和源码](#rancher-server-components-and-source-code)

# Rancher Server 架构

大多数 Rancher 2.x 软件均运行在 Rancher Server 上。Rancher Server 包括用于管理整个 Rancher 部署的所有软件组件。

下图展示了 Rancher 2.x 的上层架构。下图中，Rancher Server 管理两个下游 Kubernetes 集群，其中一个由 RKE 创建，另一个由 Amazon EKS 创建。

为了达到最佳性能和安全性，我们建议你为 Rancher Management Server 创建一个专用的 Kubernetes 集群。不建议在此集群上运行用户工作负载。部署 Rancher 后，你可以[创建或导入集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)来运行你的工作负载。

下图介绍了用户如何通过 Rancher 的认证代理管理 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群和[托管的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/) 集群：

<figcaption>通过 Rancher 的认证代理管理 Kubernetes 集群</figcaption>

![架构]({{<baseurl>}}/img/rancher/rancher-architecture-rancher-api-server.svg)

你可以把 Rancher 安装到单个节点或高可用 Kubernetes 集群上。

在生产环境中，建议安装到高可用 Kubernetes 集群。

Rancher 的 Docker 安装仅推荐用于开发和测试环境中。Rancher 版本决定了能否将 Rancher 迁移到高可用集群。

Rancher backup operator 可将 Rancher 从单个 Docker 容器迁移到高可用 Kubernetes 集群上。详情请参见[把 Rancher 迁移到新集群]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。

不管 Rancher Server 是如何安装的，它都应该运行在与其管理的下游集群不同节点上。如果 Rancher 安装在高可用的 Kubernetes 集群上，它需要运行在与其管理的集群不同的集群上。

# 与下游集群通信

本节介绍 Rancher 如何配置和管理运行应用和服务的下游集群。

下图显示了 Cluster Controller、Cluster Agent 和 Node Agent 让 Rancher 控制下游集群的。

<figcaption>与下游集群通信</figcaption>

![Rancher 组件]({{<baseurl>}}/img/rancher/rancher-architecture-cluster-controller.svg)

以下描述对应于上图中的数字：

1. [认证代理](#1-the-authentication-proxy)
2. [Cluster Controller 和  Cluster Agent](#2-cluster-controllers-and-cluster-agents)
3. [Node Agent](#3-node-agents)
4. [授权集群端点（ACE）](#4-authorized-cluster-endpoint)

### 1. 认证代理

在此图中，名为 Bob 的用户希望查看在名为 User Cluster 1 的下游集群上运行的所有 Pod。在 Rancher 中，他可以运行 `kubectl` 命令来查看
Pod。Bob 通过 Rancher 的认证代理进行身份验证。

认证代理将所有 Kubernetes API 调用转发到下游集群。它集成了本地身份验证、Active Directory 和 GitHub 等身份验证方式。在每个 Kubernetes API 调用请求时，认证代理会验证请求方的身份，并在转发给 Kubernetes master 节点之前，设置正确的 Kubernetes 消息头。

Rancher 使用[服务账号](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)与 Kubernetes 集群通信，该服务账号为在 Pod 中运行的进程提供身份。

默认情况下，Rancher 生成一个 [kubeconfig 文件]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/)，文件包含凭证信息，用于为 Rancher Server 连接下游集群的 Kubernetes API Server 的代理。kubeconfig 文件 (`kube_config_cluster.yml`)包含了访问集群的所有权限。

### 2. Cluster Controller 和 Cluster Agent

每个下游集群都有一个 Cluster Agent，用于打开与 Rancher Server 中对应的 Cluster Controller 之间的通道。

每个下游集群有一个 Cluster cController 和一个 Cluster Agent。每个 Cluster Controller 都能：

- 检测下游集群中的资源变化
- 将下游集群的当前状态变更到目标状态
- 配置集群和项目的访问控制策略
- 通过调用所需的 Docker Machine 驱动和 Kubernetes 引擎（例如 RKE 和 GKE）来配置集群

默认情况下，Cluster Controller 连接到 Cluster Agent，Rancher 才能与下游集群通信。如果 Cluster Agent 不可用，Cluster Controller 可以连接到 [Node Agent](#3-node-agents)。

Cluster Agent，也叫做 `cattle-cluster-agent`，是运行在下游集群中的组件。它具有以下功能：

- 连接 Rancher 启动的 Kubernetes 集群中的 Kubernetes API。
- 管理集群内的工作负载，pod 创建和部署。
- 根据每个集群的全局策略，应用定义的角色和绑定。
- 通过与 Cluster Controller 之间的通道，实现集群和 Rancher Server 之间的通信，包括事件，统计数据，节点信息和健康状况。

### 3.  Node Agent

如果 Cluster Agent（也称为 `cattle-cluster-agent`）不可用，其中一个 Node Agent 会创建一个连接到 Cluster Controller 的通道与 Rancher 通信。

`cattle-node-agent` 使用 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 资源进行部署，以确保它能在 Rancher 启动的 Kubernetes 集群中的每个节点上运行，用于在执行集群操作时与节点交互。集群操作的包括升级 Kubernetes 版本，创建或恢复 etcd 快照等。

### 4. 授权集群端点（ACE）

授权集群端点（ACE）可连接到下游集群的 Kubernetes API Server，而不用通过 Rancher 认证代理调度请求。

> 授权集群端点（ACE）仅适用于 Rancher 启动的 Kubernetes 集群，即只适用于 Rancher [使用 RKE]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters) 来配置的集群。ACE 不可用于于托管在 Kubernetes 提供商（如 Amazon EKS）中的集群。

> 从 Rancher 2.6.3 开始，[ACE 可用于注册的 RKE2 和 K3s 集群]({{<baseurl>}}/v2.6/en/cluster-provisioning/registered-clusters/#authorized-cluster-endpoint-support-for-rke2-and-k3s-clusters)。

授权集群端点（ACE）的主要用途：

- 在 Rancher 不可用时访问下游集群
- 在 Rancher Server 和与下游集群之间相距甚远时降低延迟

`kube-api-auth` 微服务为授权集群端点（ACE）提供用户验证功能。当使用 `kubectl`访问下游集群时，集群的 Kubernetes API Server 使用 `kube-api-auth` 服务作为 webhook 对用户进行身份验证。

与授权集群端点（ACE）一样，`kube-api-auth` 的身份验证功能也仅适用于 Rancher 启动的 Kubernetes 集群。

> **示例场景：** 假设 Rancher Server 位于美国，User Cluster 1 与用户 Alice 均位于澳大利亚。Alice 可以使用 Rancher UI 操作 User Cluster 1 中的资源，但她的请求必须从澳大利亚发送到美国的 Rancher Server，然后通过代理返回澳大利亚，即下游集群所在的位置。地理距离可能导致明显延迟，因此，Alice 可以使用授权集群端点（ACE）来降低延迟。

为下游集群启用授权集群端点（ACE）后，Rancher 会在 kubeconfig 文件中额外生成一段 Kubernetes 上下文，用于直连到集群。该文件具有 `kubectl` 和 `helm`的凭证。

如果 Rancher 出现问题，你需要使用此 kubeconfig 文件中定义的上下文来访问集群。因此，我们建议你导出 kubeconfig 文件，以便在 Rancher 出现问题时，仍能使用文件中的凭证访问集群。详情请参见使用 [kubectl 和 kubeconfig 文件]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl)访问集群的章节。

# 重要文件

维护、排除问题和升级集群需要用到以下文件：

- `rancher-cluster.yml`：RKE 集群配置文件。
- `kube_config_cluster.yml`：集群的 Kubeconfig 文件，包含完全访问集群的凭证。如果 Rancher 出现问题时，你可以使用此文件认证由 Rancher 启动的 Kubernetes 集群。
- `rancher-cluster.rkestate`：Kubernetes 集群状态文件，文件包含用于完全访问集群的凭证。注意：仅在使用 RKE v0.2.0 或更高版本时，才会创建此该文件。

> :::note 注意
> 后两个文件名中的 `rancher-cluster` 部分取决于你命名 RKE 集群配置文件的方式。
> :::

有关在没有 Rancher 认证代理和其他配置选项的情况下连接到集群的更多信息，请参见 [kubeconfig 文件]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/)。

# 配置 Kubernetes 集群的工具

Rancher 使用什么工具配置下游集群，取决于集群的类型。

### Rancher 为托管在云提供商中的节点启动 Kubernetes

Rancher 可以动态启动云上（如 Amazon EC2、DigitalOcean、Azure 或 vSphere 等）的节点，然后在节点上安装 Kubernetes。

Rancher 使用 [RKE](https://github.com/rancher/rke) 和 [docker-machine](https://github.com/rancher/machine) 来配置这类型的集群。

### Rancher 为自定义节点启动 Kubernetes

在配置此类集群时，Rancher 会在现有节点上安装 Kubernetes，从而创建自定义集群。

Rancher 使用 [RKE](https://github.com/rancher/rke) 来启动此类集群。

### 托管的 Kubernetes 提供商

配置此类集群时，Kubernetes 由云提供商安装，如 GKE、ECS 或 AKS 等。

Rancher 使用 [kontainer-engine](https://github.com/rancher/kontainer-engine) 配置此类型的集群。

### 注册的 Kubernetes 集群

这种情况下，Rancher 需要连接到一个设置好的 Kubernetes 集群。因此，Rancher 不提供 Kubernetes，只设置 Rancher Agent 实现与集群通信。

# Rancher Server 组件和源码

下图展示了 Rancher Server 的组件：

![Rancher 组件]({{<baseurl>}}/img/rancher/rancher-architecture-rancher-components.svg)

Rancher 的 GitHub 代码仓库如下：

- [Rancher Server 主代码库](https://github.com/rancher/rancher)
- [Rancher UI](https://github.com/rancher/ui)
- [Rancher API UI](https://github.com/rancher/api-ui)
- [Norman](https://github.com/rancher/norman)（Rancher 的 API 框架）
- [API 类型](https://github.com/rancher/types)
- [Rancher CLI](https://github.com/rancher/cli)
- [应用商店](https://github.com/rancher/helm)

以上仅列出部分 Rancher 最重要的仓库。详情请参见[参与 Rancher 开源贡献]({{<baseurl>}}/rancher/v2.6/en/contributing/#repositories)。如需获取 Rancher 使用的所有库和项目，请参见 `rancher/rancher` 仓库中的 [`go.mod` 文件](https://github.com/rancher/rancher/blob/master/go.mod)。
