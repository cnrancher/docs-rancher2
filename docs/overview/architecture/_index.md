---
title: 产品架构
---

本文主要介绍 Rancher Server 和它的组件，以及 Rancher 如何与下游用户集群通信。请查阅[安装介绍](/docs/installation/_index/#overview-of-installation-options)获取 Rancher 的其他安装方式。请查阅 [产品简介](/docs/overview/_index#rancher-api-server-的功能)获取 Rancher API Server 的功能介绍。请查阅[推荐架构](/docs/overview/architecture-recommendations/_index)获取 Rancher Server 底层架构的配置指导。

> 本文默认读者已经对 Docker 和 Kubernetes 有一定的了解。如果您需要了解 Kubernetes 组件的工作机制和原理，请查阅 [Kubernetes 概念](/docs/overview/concepts/_index)。

## Rancher Server 架构

大多数 Rancher 2.x 软件在 Rancher Server 上运行。 Rancher Server 囊括了管理 Rancher 部署的所有组件。

下图描述了 Rancher 2.x 的架构。图中描述的是一个 Rancher Server 管理了两个下游用户集群：一个是通过 Rancher 部署的集群 （RKE 集群），一个是通过亚马逊的 EKS 创建的集群。

考虑到最佳实践和安全因素，我们建议您在一个专门的 Kubernetes 集群中部署 Rancher Server。不建议您在这个专有集群部署自己的工作负载。部署 Rancher 之后，您可以创建或导入集群，然后在这些集群上运行您的工作负载。

下图展示了用户通过 Rancher 的认证代理，控制 Rancher 部署的 Kubernetes 集群和托管的 Kubernetes 集群的过程。

<figcaption>通过Rancher认证代理管理 Kubernetes 集群</figcaption>

![Architecture](/img/rancher/rancher-architecture-rancher-api-server.svg)

您可以在单个节点或高可用的 Kubernetes 集群上安装 Rancher。

我们建议您在生产环境中使用高可用 Kubernetes 集群安装 Rancher。虽然单节点 Docker 安装可以用于开发和测试环境，但是单节点和高可用集群之间无法进行数据迁移。因此，我们建议您从一开始就使用高可用的 Kubernetes 集群来部署 Rancher Server。运行 Rancher Server 的集群应该与下游用户集群区分开来。

## 与下游用户集群交互

本小节讲解 Rancher 启动和管理下游用户集群的具体步骤。

下图演示了集群控制器、集群 Agent 和 Node Agent 是如何允许 Rancher 控制下游用户集群的。

<figcaption>与下游用户集群通信</figcaption>

![Rancher Components](/img/rancher/rancher-architecture-cluster-controller.svg)

图中的数字和对应的描述如下：

1. [认证代理](#认证代理)
2. [集群控制器和集群Agent](#集群控制器和集群agent)
3. [节点 Agents](#节点-agent)
4. [授权集群端点](#授权集群端点)

### 认证代理

在这张示意图中，一个叫做 Bob 的用户希望查看下游用户集群“User Cluster 1”里面正在运行的 pod。通过了 Rancher 的 认证代理之后，Bob 可以运行 `kubectl` 命令查看该集群中的 pod。

Rancher 的 认证代理把 API 调用命令转发到下游用户集群。认证代理集成了多种认证方式，如本地认证、活动目录认证、GitHub 认证等。在发起每一个 Kubernetes API 调用请求的时候，认证代理会去确认请求方的身份，在转发调用命令前，设置正确的 Kubernetes impersonation 的消息头。

Rancher 使用 [Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) （Service Accout 提供了一种方便的认证机制）和 Kubernetes 进行交互。

默认状态下，Rancher 生成一个包含认证信息的[kubeconfig](/docs/cluster-admin/cluster-access/kubectl//index)文件，为 Rancher Server 和下游用户集群的 Kubernetes API Server 之间的通信提供认证。该文件包含了访问集群的所有权限。

### 集群控制器和集群Agent

每一个下游用户集群都有一个集群 Agent 保持用户集群的集群控制器与 Rancher Server 之间的信息畅通。

集群控制器具有以下功能：

- 观察用户集群的资源变化
- 把用户集群从“当前”状态变更到“目标”状态
- 配置用户集群和项目的访问控制策略
- 通过调用 Docker Machine 和 Kubernetes Engine，如 RKE 和 GKE，创建集群。

默认状态下，集群控制器连接 Agent，Rancher 才可以与用户集群通信。如果集群 Agent 不可用，集群控制器可以连接到节点 Agent，不会影响 Rancher 与用户集群之间的通信。

集群 Agent，也叫做“cattle-cluster-agent”，是在用户集群中运行的组件，它具有以下功能：

- 连接使用 Rancher 部署的 Kubernetes 集群（RKE 集群）中的 Kubernetes API。
- 管理集群内的工作负载，pod 创建和部署。
- 根据每个集群的设置，配置 Role 和 RoleBindings
- 实现集群和 Rancher Server 之间的消息传输，包括事件，指标，健康状况和节点信息等。

### 节点 Agent

如果集群 Agent 不可用，其中一个节点 Agent 会创建一个通信的管道，由节点 Agent 连接到集群控制器，实现集群和 Rancher 之间的通信。

使用[DaemonSet](https://kubernetes.io/docs/concepts/workloads/Controllers/daemonset/)作为节点 Agent 的部署方式，可以确保集群内每个节点都成功运行节点 Agent。执行集群操作时，可以使用这种方式和节点互动。集群操作包括：升级 Kubernetes 版本和创建或恢复 etcd 快照（etcd snapshot）。

### 授权集群端点

用户通过授权集群端点连接下游用户集群时，不需要将他们的请求发送到 Rancher 认证代理。

> 授权集群端点只在 Rancher 部署的 Kubernetes 集群（RKE 集群）中有效。换句话说，它只在 Rancher Server 使用 RKE 创建的集群中有效。其他类型的集群，如导入的集群、位于其他云服务上的集群等，并不能够使用此功能。

使用授权集群端点的主要理由如下：

- 无法访问 Rancher 出时，仍然可通过授权集群端点访问用户集群。
- Rancher Server 和下游用户集群距离较远时，两者之间的通信会有延迟，使用授权集群端点可以显著地减少通信时延。

`kube-api-auth` 微服务向授权集群端点提供了用户认证功能。使用 `kubectl` 访问用户集群时，集群的 Kubernetes API Server 通过 `kube-api-auth` 对用户进行认证。

与授权集群端点类似， `kube-api-auth` 认证功能只在 Rancher 部署的 Kubernetes 集群（RKE 集群）中有效。

> 使用场景举例：假设 Rancher Server 位于美国，用户集群“User Cluster 1”位于澳大利亚，用户“Alice”也位于澳大利亚。虽然 Alice 可以使用 Rancher 控制台管理 User Cluster 1 中的资源，但是她发出的请求要从澳大利亚发送到美国的 Server 端，然后再由 Server 代理回澳大利亚的集群端，澳大利亚集群端处理完请求后，再返回给美国的 Server 端，最后才能返回给澳大利亚的“Alice”。因为美澳之间实际的距离非常遥远，所以发送的请求和返回的请求结果都会存在显著的时延。Alice 可以使用授权集群端点，降低时延，更好地掌控她的用户集群。

为下游用户集群开启授权集群端点后，Rancher 会在“kubeconfig”文件中额外生成一段 Kubernetes context，来允许用户直接连接到集群。kubeconfig 这个文件中含有 `kubectl` 和 `helm` 的认证信息。

如果 Rancher 出现问题，无法连接，您需要使用 kubeconfig 中的 context 帮助您访问集群。因此，我们建议您导出一份 kubeconfig 文件副本，保存到本地，以备不时之需。更多详细信息请参考 [kubectl 和 kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index)。

## 重要文件

下列文件在运维、排查问题和升级集群的场景中都会用到：

- `rancher-cluster.yml` ：RKE 集群配置文件。
- `kube_config_rancher-cluster.yml` ：集群的 kubeconfig 文件，它包含了访问集群的全部权限。如果 Rancher 出现故障，无法运行，您可以使用这个文件连接通过 Rancher 部署的 Kubernetes 集群（RKE 集群）。
- `rancher-cluster.rkestate` ：Kubernetes 集群状态文件，该文件含有访问集群的所有权限。只有使用 RKE 0.2.0 或以上版本时，才会创建该文件。

更多详细信息请参考[kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index)。

## 启动 Kubernetes 集群所需工具

下游 Kubernetes 集群的类型决定了启动集群需要的工具。集群类型主要分为以下几种：

### Rancher 通过云供应商自动创建节点部署 Kubernetes 集群

Rancher 可以动态启动位于云上的节点，如 Amazon EC2、DigitalOcean、Azure 和 vSphere，然后在节点上安装 Kubernetes。Rancher 使用 [RKE](https://github.com/rancher/rke) 和 [docker-machine](https://github.com/rancher/machine)启动这种集群。

### Rancher 通过自定义主机部署的 Kubernetes 集群

配置这种集群时，Rancher 可以在已有的虚拟机，物理机或云主机上安装 Kubernetes。这种集群叫自定义集群。Rancher 使用[RKE](https://github.com/rancher/rke)启动这种集群。

### 云服务供应商提供的托管的 Kubernetes 集群

配置这种集群时，Kubernetes 由云服务供应商安装，如 GKE、ECS 和 AKS。Rancher 使用[kontainer-engine](https://github.com/rancher/kontainer-engine)来调用云厂商的 API 来启动集群。

### 导入的 Kubernetes 集群

这种情况下，Rancher 只需要连接到已经配置好 Kubernetes 的集群。因此，Rancher 只配置 Rancher Agent 与集群通信，不直接启动集群。

## Rancher Server 组件和源代码

下图说明了 Rancher Server 都有哪些组件：

![Rancher Components](/img/rancher/rancher-architecture-rancher-components.svg)

Rancher 的 GitHub 源代码仓库如下：

- [Rancher server 的主代码库](https://github.com/rancher/rancher)
- [Rancher UI](https://github.com/rancher/ui)
- [Rancher API UI](https://github.com/rancher/api-ui)
- [Norman](https://github.com/rancher/norman)
- [Types](https://github.com/rancher/types)
- [Rancher 命令行](https://github.com/rancher/cli)
- [应用商店](https://github.com/rancher/helm)

上面只列举了 Rancher 最重要的组件。请查看[参与 Rancher 开源贡献](/docs/contributing/_index#源代码仓库)，获取详细信息。请查看 `rancher/rancher` 代码库中的 [ `go.mod` 文件](https://github.com/rancher/rancher/blob/master/go.mod)，获取 Rancher 使用的所有库和项目。
