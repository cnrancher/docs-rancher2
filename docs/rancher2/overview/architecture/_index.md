---
title: 产品架构
description: 本文主要介绍 Rancher Server 架构和各个组件的功能，用户如何通过 Rancher Server 或授权集群端点控制下游集群，以及如何通过授权集群访问端点管理下游集群。 Rancher Server 由认证代理（Authentication Proxy）、Rancher API Server、集群控制器（Cluster Controller）、etcd 节点和集群 Agent（Cluster Agent） 组成。除了集群 Agent 以外，其他组件都部署在 Rancher Server 中。
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
  - 产品架构
---

本文主要介绍 Rancher Server 架构和各个组件的功能，例如：用户如何通过 Rancher Server 或授权集群端点控制下游集群，以及如何通过授权集群访问端点管理下游集群。

> 本文默认读者已经对 Docker 和 Kubernetes 有一定的了解。如果您需要了解 Kubernetes 组件的工作机制和原理，请查阅 [Kubernetes 概念](/docs/overview/concepts/_index)。

## Rancher Server 架构

Rancher Server 由认证代理（Authentication Proxy）、Rancher API Server、集群控制器（Cluster Controller）、etcd 节点和集群 Agent（Cluster Agent） 组成。除了集群 Agent 以外，其他组件都部署在 Rancher Server 中。

图中描述的是用户通过 Rancher Server 管控 Rancher 部署的 Kubernetes 集群（RKE 集群）和托管的 Kubernetes 集群的（EKS）集群的流程。以用户下发指令为例，指令的流动路径如下：

1. 首先，用户通过 Rancher UI（即 Rancher 控制台） Rancher 命令行工具（Rancher CLI）输入指令；直接调用 Rancher API 接口也可以达到相同的效果。
2. 用户通过 Rancher 的代理认证后，指令会进一步下发到 Rancher Server 。
3. 与此同时，Rancher Server 也会执行容灾备份，将数据备份到 etcd 节点。
4. 然后 Rancher Server 把指令传递给集群控制器。集群控制器把指令传递到下游集群的 Agent，最终通过 Agent 把指令下发到指定的集群中。

如果 Rancher Server 出现问题，我们也提供了备用方案，您可以通过[授权集群端点](#授权集群端点)管理集群。

考虑到性能表现和安全因素，我们建议您使用两个 Kubernetes 集群，分开部署 Rancher Server 和工作负载。部署 Rancher Server 后，您可以创建或导入集群，然后在这些集群上运行您的工作负载。

<figcaption>通过Rancher认证代理管理 Kubernetes 集群</figcaption>

![Architecture](/img/rancher/rancher-architecture-rancher-api-server.svg)

您可以在单个节点或高可用的 Kubernetes 集群上安装 Rancher。由于单节点安装只适用于开发和测试环境，而且单节点和高可用集群之间无法进行数据迁移，所以我们建议您从一开始就使用高可用的 Kubernetes 集群来部署 Rancher Server，而且您需要分开部署运行 Rancher Server 的集群和运行自己业务的下游集群。

## 与下游集群交互

本小节通过两个用户 Bob 和 Alice 的案例，讲解 Rancher 启动和管理下游集群的具体过程，和每个 Rancher 组件的作用。

下图演示了集群控制器、集群 Agent 和 Node Agent 是如何允许 Rancher 控制下游集群的。

<figcaption>与下游集群通信</figcaption>

![Rancher Components](/img/rancher/rancher-architecture-cluster-controller.svg)

图中的数字和对应的描述如下：

1. [认证代理](#认证代理)
2. [集群控制器和集群 Agent](#集群控制器和集群-agent)
3. [节点 Agents](#节点-agent)
4. [授权集群端点](#授权集群端点)

### 认证代理

图左上角一个叫做 Bob 的用户希望查看下游集群“User Cluster 1”里面正在运行的 pod。Bob 发起的请求会首先经过认证代理，通过认证之后，Rancher 的 认证代理才会把 API 调用命令转发到下游集群。

认证代理集成了多种认证方式，如本地认证、活动目录认证、GitHub 认证等。在发起每一个 Kubernetes API 调用请求的时候，认证代理会去确认请求方的身份，在转发调用命令前，请设置正确的 Kubernetes impersonation 的消息头。

Rancher 使用 [Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) （Service Accout 提供了一种方便的认证机制）和 Kubernetes 进行交互。

默认状态下，Rancher 生成一个包含认证信息的[kubeconfig](/docs/cluster-admin/cluster-access/kubectl/_index)文件，为 Rancher Server 和下游集群的 Kubernetes API Server 之间的通信提供认证。该文件包含了访问集群的所有权限。

### 集群控制器和集群 Agent

每一个下游集群都有一个集群 Agent 保持下游集群的集群控制器与 Rancher Server 之间的信息畅通。

集群控制器具有以下功能：

- 检测下游集群的资源变化，如内存使用率、CPU 使用率等
- 把下游集群从“当前”状态变更到“目标”状态
- 配置集群和项目的访问控制策略
- 通过调用 Docker Machine 和 Kubernetes Engine，如 RKE 和 GKE，创建集群。

默认状态下，集群控制器连接 Agent，Rancher 才可以与下游集群通信。如果集群 Agent 不可用，集群控制器可以连接到节点 Agent，通过节点 Agent 实现用户和集群之间的通信。

集群 Agent，也叫做“cattle-cluster-agent”，是在下游集群中运行的组件，它具有以下功能：

- 连接使用 Rancher 部署的 Kubernetes 集群（RKE 集群）中的 Kubernetes API。
- 管理集群内的工作负载，pod 创建和部署。
- 根据每个集群的设置，配置 Role 和 RoleBindings
- 实现集群和 Rancher Server 之间的消息传输，包括事件，指标，健康状况和节点信息等。

### 节点 Agent

如果集群 Agent 不可用，下游集群中的其中一个节点 Agent 会创建一个通信管道，由节点 Agent 连接到集群控制器，实现下游集群和 Rancher 之间的通信。

部署节点 Agent 的方式有很多，我们建议您使用[DaemonSet](https://kubernetes.io/docs/concepts/workloads/Controllers/daemonset/)部署节点 Agent ，这种方式可以确保下游集群内每个节点都成功运行节点 Agent。执行集群操作时，可以使用这种方式将指令下发到下游集群。集群操作包括：升级 Kubernetes 版本、创建 etcd 节点备份和恢复 etcd 节点。

### 授权集群端点

Rancher Server 和下游集群之间有明显的延迟，或 Rancher Server 不可用时，用户可以通过授权集群端点连接下游集群，实现 Rancher Server 和集群之间的通信，降低网络延迟。

> 需要注意的是，只有 Rancher 部署的 Kubernetes 集群（RKE 集群）可以使用授权集群端点这个功能。其他类型的集群，如导入的集群、托管的集群等，并不能够使用此功能。

`kube-api-auth` 微服务向授权集群端点提供了用户认证功能。使用 `kubectl` 访问下游集群时，集群的 Kubernetes API Server 通过 `kube-api-auth` 对用户进行认证。

与授权集群端点类似， `kube-api-auth` 认证功能只在 Rancher 部署的 Kubernetes 集群（RKE 集群）中有效。

> 使用场景举例：假设 Rancher Server 位于美国，用户“Alice”和她管理的下游集群“User Cluster 1”位于澳大利亚。虽然 Alice 可以使用 Rancher 控制台管理 User Cluster 1 中的资源，但是她发出的请求要从澳大利亚发送到美国的 Server 端，然后再由 Server 代理回澳大利亚的集群端，澳大利亚集群端处理完请求后，再返回给美国的 Server 端，最后才能返回给澳大利亚的“Alice”。因为美澳之间的距离非常遥远，所以发送的请求和返回的请求结果都会存在显著的延迟。Alice 可以使用授权集群端点，降低延迟，更好地掌控她的下游集群。

为下游集群开启授权集群端点后，Rancher 会在“kubeconfig”文件中额外生成一段 Kubernetes context，来允许用户直接连接到集群。kubeconfig 这个文件中含有 `kubectl` 和 `helm` 的认证信息。

如果 Rancher 出现问题，无法连接，您需要使用 kubeconfig 中的 context 帮助您访问集群。因此，我们建议您导出一份 kubeconfig 文件副本，保存到本地，以备不时之需。更多详细信息请参考 [kubectl 和 kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index)。

## 重要文件

下列文件在运维、排查问题和升级集群的场景中都会用到：

- `rancher-cluster.yml` ：RKE 集群配置文件。
- `kube_config_rancher-cluster.yml` ：集群的 kubeconfig 文件，它包含了访问集群的全部权限。如果 Rancher 出现故障，无法运行，您可以使用这个文件连接通过 Rancher 部署的 Kubernetes 集群（RKE 集群）。
- `rancher-cluster.rkestate` ：Kubernetes 集群状态文件，该文件含有访问集群的所有权限。只有使用 RKE 0.2.0 或以上版本时，才会创建该文件。

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

更多详细信息请参考[kubeconfig 文件](/docs/cluster-admin/cluster-access/kubectl/_index)。

## 启动 Kubernetes 集群所需工具

下游 Kubernetes 集群的类型决定了启动集群需要的工具。集群类型主要分为以下几种：

### Rancher 通过云供应商自动创建节点部署 Kubernetes 集群

Rancher 可以动态启动位于云上的节点，如 Amazon EC2、DigitalOcean、Azure 和 vSphere，然后在节点上安装 Kubernetes。Rancher 使用 [RKE](https://github.com/rancher/rke) 和 [docker-machine](https://github.com/rancher/machine)启动这种集群。

### Rancher 通过自定义主机部署的 Kubernetes 集群

配置这种集群时，Rancher 可以在已有的虚拟机、物理机或云主机上安装 Kubernetes。这种集群叫自定义集群。Rancher 使用[RKE](https://github.com/rancher/rke)启动这种集群。

### 云服务供应商提供的托管的 Kubernetes 集群

配置这种集群时，Kubernetes 由云服务供应商安装，如 GKE、ECS 和 AKS。Rancher 使用[kontainer-engine](https://github.com/rancher/kontainer-engine)来调用云厂商的 API 来启动集群。

### 导入的 Kubernetes 集群

这种情况下，Rancher 只需要连接到已经配置好 Kubernetes 的集群。因此，Rancher 只设置 Rancher Agent 与集群通信，不直接启动集群。

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
