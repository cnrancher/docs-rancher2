---
title: 产品架构
---

本文主要介绍Rancher Server和它的组件，以及Rancher如何与下游Kubernetes集群沟通。请查阅[安装介绍](/docs/installation/_index/#overview-of-installation-options)获取Rancher的其他安装方式。请查阅 [产品介绍](/docs/overview/_index/#features-of-the-rancher-api-server)获取Rancher API Server的功能介绍。请查阅[推荐架构](/docs/overview/architecture-recommendations/_index)获取Rancher Server底层架构的配置指导。

> 本章节默认读者已经对Docker和Kubernetes有一定的了解。如果您需要了解Kubernetes组件的工作机制和原理，请查阅 [Kubernetes概念](/docs/overview/concepts/_index)。

## Rancher Server架构

大多数Rancher 2.x软件在Rancher Server上运行。 Rancher Server囊括了管理Rancher部署的所有组件。

下图描述了Rancher 2.x的架构。该图描述了用户使用Rancher Server向RKE集群和EKS集群下发指令的全过程。

为了达到最好的效果，我们建议您使用一个专门与Rancher Server对接的Kubernetes集群进行操作。不建议您使用用工作负载。部署Rancher之后，您可以创建或导入集群，然后在这些集群上运行您的工作负载。

下图展示了用户通过Rancher Proxy认证，控制Kubernetes集群的过程。
<figcaption>Managing Kubernetes Clusters through Rancher's Authentication Proxy</figcaption>

![Architecture](/img/rancher/rancher-architecture-rancher-api-server.svg)

您可以在单个节点或高可用Kubernetes集群上安装Rancher。

我们建议您在生产环境中使用高可用Kubernetes集群安装Rancher。虽然Docker安装可以用于开发和测试环境，但是单节点和高可用集群之间无法进行数据迁移。因此，我们建议您从一开始就使用高可用Kubernetes集群。运行Rancher Server的集群应该与下游用户集群区分开来。

## 与下游用户集群交互

本小节讲解Rancher运行和管理下游用户集群的具体步骤。

下图演示了集群控制面板、集群Agent和Node Agent是如何允许Rancher控制下游集群的。
<figcaption>Communicating with Downstream Clusters</figcaption>

![Rancher Components](/img/rancher/rancher-architecture-cluster-controller.svg)

图中的数字和对应的描述如下：

1. [Proxy认证](#proxy认证)
2. [集群控制器和集群Agent](#集群控制器和集群agent)
3. [节点Agent](#节点agent)
4. [授权集群端点](#授权集群端点)

### Proxy认证

在这张示意图中，一个叫做Bob的用户希望查看下游用户集群“User Cluster 1”里面正在运行的pod。在Rancher中，他可以运行 `kubectl` 命令查看该集群中的pod。Bob通过了Rancher的Proxy认证。

Rancher的Proxy认证把API调用命令转发到下游用户集群。Proxy认证集成了多种认证方式，如本地认证、活动目录认证、GitHub认证等。在发起每一个Kubernetes API调用请求的时候，Proxy认证会去确认请求方的身份，在转发调用命令前，设置 Kubernetes impersonation 消息头。

Rancher使用 [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)和Kubernetes进行交互。Service Accout提供了一种方便的认证机制。

默认状态下，Rancher生成一个包含认证信息的[kubeconfig](/docs/cluster-admin/cluster-access/kubectl/_index)文件，为Rancher Server和下游用户集群的Kubernetes API Server之间的通信提供认证。该文件包含了访问集群的所有权限。

### 集群控制器和集群Agent

每一个下游用户集群都有一个集群Agent保持用户集群的控制器与Rancher Server之间的信息畅通。

每一个下游用户集群都有一个Agent和和一个控制器。集群控制器具有以下功能：

* 检测用户集群的资源变化
* 变更用户集群的状态
* 配置用户集群和项目的安全控制策略
* 调用docker machine 和 Kubernetes 引擎，如RKE和GKE，创建集群。

默认状态下，集群控制器连接Agent，Rancher才可以与用户集群通信。如果集群Agent不可用，集群控制器可以连接到节点Agent，不会影响Ranche与用户集群之间的通信。

集群Agent，也叫做“cattle-cluster-agent”，是在用户集群中运行的组件，它具有以下功能：

* 连接使用Rancher运行的Kubernetes集群中的Kubernetes API。
* 管理工作负载和集群内的pod创建和部署。
* 在每个集群的全局策略中应用角色和连接
* 实现集群和Rancher Server之间的消息传输，包括健康状况和节点信息等。

### 节点Agent

如果集群Agent不可用，其中一个节点Agent会创建一个通信的管道，由节点Agent连接到集群控制器，再由控制器连接到Rancher，实现集群Agent和Rancher之间的通信。

使用[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)资源部署节点Agent，可以确保集群内每个节点都成功运行节点Agent。执行集群操作时，可以使用这种方式和节点互动。集群操作包括：升级Kubernetes版本和创建或恢复etcd快照（etcd snapshot）。

### 授权集群端点

用户授权集群端点连接下游用户集群时，不需要将他们的请求发送到Rancher认证Proxy。

> 授权集群端点只在Rancher运行的Kubernetes集群中有效。换句话说，它只在使用RKE创建的集群中有效。其他类型的集群，如导入的集群、位于其他云服务上的集群等，并不能够使用此功能。

使用授权集群端点的主要理由如下：

* 无法访问Rancher出时，仍然可通过授权集群端点访问用户集群。
* Rancher Server和下游集群距离较远时，两者之间的通信会有延迟，使用授权集群端点可以显著地减少通信时延。

`kube-api-auth` 微服务向授权集群端点提供了用户认证功能。使用 `kubectl` 访问用户集群时，集群的Kubernetes API Server通过 `kube-api-auth` 对用户进行认证。

与授权集群端点类似， `kube-api-auth` 认证功能只在使用RKE发布的集群中有效。

> 使用场景举例：假设Rancher Server位于美国，用户集群“User Cluster 1”位于澳大利亚，用户“Alice“也位于澳大利亚。虽然Alice可以使用Rancher控制台分配User Cluster 1中的资源，但是她发出的请求从澳大利亚集群端发送到美国Server端，请求结果从美国Server端返回到澳大利亚集群端。因为美澳之间实际的距离非常遥远，所以发送的请求和返回的请求结果都会存在显著的时延。Alice可以使用授权集群端点，降低时延，更好地掌控她的用户集群。

为下游集群开启授权集群端点后，Rancher会在”kubeconfig“文件中额外生成一段 Kubernetes context，允许集群和Rancher Server直连。kubeconfig这个文件中含有 `kubectl` 和 `helm` 的认证信息。

如果Rancher出现问题，无法连接，您需要使用kubeconfig文件中的一个字段可以帮助您访问集群。因此，我们建议您导出一份kubeconfig文件副本，保存到本地，以备不时之需。更多详细信息请参考 [kubectl 和 kubeconfig文件](/docs/cluster-admin/cluster-access/kubectl)。

## 重要文件

下列文件在运维、排查问题和升级集群的场景中都会用到：

* `rancher-cluster.yml` ：RKE集群配置文件。
* `kube_config_rancher-cluster.yml` ：集群的kubeconfig文件，如上文所述，该文件含有 `kubectl` 和 `helm` 的认证信息。如果Rancher出现故障，无法运行，您可以使用这个文件完成Rancher集群认证。
* `rancher-cluster.rkestate` ：Kubernetes集群状态文件，该文件含有访问集群的所有权限。只有使用RKE 0.2.0或以上版本时，才会创建该文件。

更多详细信息请参考[kubeconfig文件](/docs/cluster-admin/cluster-access/_index)。

## 创建Kubernetes集群所需工具

下游Kubernetes集群的类型决定了启动集群需要的工具。集群类型主要分为以下几种：

### 在Rancher内运行云服务供应商的集群

Rancher可以动态启动位于云上的集群，如Amazon EC2、DigitalOcean、Azure和vSphere，然后在集群上安装Kubernetes。Rancher使用 [RKE](https://github.com/rancher/rke) 和 [docker-machine](https://github.com/rancher/machine)启动这种集群。

### Rancher部署的Kubernetes集群（RKE集群）

配置这种集群时，Rancher在已有节点上安装了Kubernetes，创建了自定义集群。Rancher使用[RKE](https://github.com/rancher/rke)启动这种集群。

### 云服务供应商的集群

配置这种集群时，Kubernetes由云服务供应商安装，如GKE、ECS和AKS。Rancher使用[kontainer-engine](https://github.com/rancher/kontainer-engine)启动这种集群。

### 导入的Kubernetes集群

这种情况下，Rancher连接到已经配置好Kubernetes的集群。因此，Rancher只配置Rancher Agent与集群通信，不直接启动集群。

## Rancher Server组件和源代码

下图说明了Rancher Server都有哪些组件：

![Rancher Components](/img/rancher/rancher-architecture-rancher-components.svg)

Rancher的GitHub repository如下：

* [Main Rancher server repository](https://github.com/rancher/rancher)
* [Rancher UI](https://github.com/rancher/ui)
* [Rancher API UI](https://github.com/rancher/api-ui)
* [Norman](https://github.com/rancher/norman)
* [Types](https://github.com/rancher/types)
* [Rancher CLI](https://github.com/rancher/cli)
* [Catalog applications](https://github.com/rancher/helm)

上面只列举了Rancher最重要的组件。请查看[参与Rancher开源贡献](/docs/contributing/_index#源代码仓库)，获取详细信息。请查看 `rancher/rancher` repository中的 [ `go.mod` 文件](https://github.com/rancher/rancher/blob/master/go.mod)，获取Rancher使用的所有库和项目。

