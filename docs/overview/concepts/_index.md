---
title: Kubernetes 概念
description: 本文对 Kubernetes 相关概念和术语进行了解释，帮助您更好地了解 Rancher 的运行机制。
---
本文对 Kubernetes 相关概念和术语进行了解释，帮助您更好地了解 Rancher 的运行机制。如需了解更多细节，请查看[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/overview/components/)。

## 关于 Docker

_Docker_ 是容器打包和运行时系统的标准，主要用于管理各个节点上的容器。开发者在 Dockerfiles 中构建容器镜像，上传到镜像仓库中，用户只需从镜像仓库下载该镜像文件，就可以开始使用。

镜像仓库分为公有镜像仓库和私有镜像仓库。[Docker Hub](https://hub.docker.com) 是市面上主流的公有镜像仓库。除了公有镜像仓库以外，很多企业为了节省网络带宽和提高镜像资源使用率，也会配置自己的私有镜像仓库，提供给企业内部员工使用。 

> **说明：** 因为 Kubernetes 已经成为了容器管理的主流工具，所以从Rancher 2.x 版本开始，我们不再支持 Docker Swarm。如果您仍有使用 Docker 管理容器的需求，您可以安装Rancher 1.6 进行操作。

## 关于 Kubernetes

_Kubernetes_ 是容器和集群管理的标准。 YAML 文件规定了组成一个应用所需的容器和其他资源。 Kubernetes提供了定时启停应用、容器扩容、服务发现、监控检查容器和节点是否健康、秘钥管理和容器配置管理等功能。

## Kubernetes 集群是什么

_Kubernetes 集群_ 是由多个计算机（可以是物理机、云主机或虚拟机）组成的一个独立系统，通过 Kubernetes 容器管理系统，实现集群部署、集群运维、集群扩容等功能，允许您自动化部署和管理容器中的应用。 

## Kubernetes 集群中的节点角色

_节点_ 是集群内的一个计算资源，节点可以是裸金属服务器或虚拟机。根据节点的角色不同，我们把节点分为三类：**etcd 节点**、**controlplane 节点**和**worker 节点**，下文会讲解三种节点的功能。一个 Kubernetes 集群至少要有一个 etcd 
节点、一个 controlplane 节点 和 一个worker 节点 。

### etcd 节点

_etcd 节点_ 的主要功能是数据备份，它负责备份 Rancher Server的数据和集群状态。
Kubernetes 集群的状态保存在 [etcd节点](https://kubernetes.io/docs/concepts/overview/components/#etcd)  中，etcd节点运行 ectd 数据库。ectd 数据库组件是一个分部署键值存储系统，用于存储 Kubernetes 的集群数据，像是集群协作和状态管理。建议在多个节点上运行 etcd，保证在节点失效的情况下，可以获取到备份的集群数据。

etcd 更新集群状态前，需要集群中的所有节点通过 quorum 投票机制完成投票。假设集群中有 n 个节点，至少需要 n/2 + 1（向下取整） 个节点同意，才被视为多数集群同意更新集群状态。例如一个集群中有3个 etcd 节点，quorum 投票机制要求至少两个节点同意，才会更新集群状态。

集群应该含有足够多健康的 etcd 节点，这样才可以形成一个 quorum。对含有奇数个节点的集群而言，每新增一个节点，就会增加通过 quarum 投票机制所需节点的数量。

一般情况下，集群中只要配置三个 etcd 节点就能满足小型集群的需求，五个 etcd 节点就能能满足大型集群的需求。

### Controlplane 节点

Controlplane 节点上运行的工作负载包括：Kubernetes API server、scheduler和 controller mananger 。这些节点保证已设置好的任务会定时执行，也会保证您的集群设置保持不变。因为 etcd 节点保存了集群数据，所以 Controlplane 节点是没有状态的。虽然可以在单节点上运行 Controlplane 节点，但是我们建议在两个或以上的节点上运行 Controlplane 节点，以保证数据的冗余性。另外，因为Kubernetes只要求每个节点至少要分配一个角色，所以一个节点可以既是Controlplane 节点，又是etcd 节点。

### Worker 节点

[worker 节点](https://kubernetes.io/docs/concepts/architecture/nodes/)运行以下应用：

* **Kuberlets：**监控节点状态的 Agent，确保您的容器处于健康状态。
* **工作负载：**承载您的应用和其他类型的部署的容器。

Worker 节点也运行存储和网络驱动；有必要时也会运行 应用路由控制器（Ingress Controller）。Rancher 对 Worker 节点的数量没有限制，您可以按照实际需要创建多个 Worker 节点。

## 关于 Helm

Helm 是在高可用集群中安装 Rancher 时会用到的工具。

Helm 是 Kubernetes 的软件包管理工具。Helm chart 提供了 Kubernetes YAML manifest 文档的语法和模板。您可以使用 Helm 代替静态文件，创建可配置的部署计划。如果您想了解更多关于如何创建自己的发布目录（deployment catalog），请查阅[Helm官方网站](https://helm.sh)。

如果您想了解更多关于 Service Account 和集群角色分配的信息，请查阅[Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)。

