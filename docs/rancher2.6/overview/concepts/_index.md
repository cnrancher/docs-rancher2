---
title: Kubernetes 概念
weight: 4
---

本文解释了 Kubernetes 的相关概念，以便让你更好地了解 Rancher 的运行机制。本文仅对 Kubernetes 组件进行了简单的描述。如需了解更多详情，请参见 [Kubernetes 组件的官方文档](https://kubernetes.io/docs/concepts/overview/components/)。

本节涵盖以下主题：

- [关于 Docker](#about-docker)
- [关于 Kubernetes](#about-kubernetes)
- [Kubernetes 集群是什么](#what-is-a-kubernetes-cluster)
- [Kubernetes 集群中节点的角色](#roles-for-nodes-in-kubernetes-clusters)
   - [etcd 节点](#etcd-nodes)
   - [Controlplane 节点](#controlplane-nodes)
   - [Worker 节点](#worker-nodes)
- [关于 Helm](#about-helm)

## 关于 Docker

Docker 是容器打包和运行时系统的标准。开发者在 Dockerfiles 中构建容器映像，并在 Docker 镜像仓库中分发容器镜像。[Docker Hub](https://hub.docker.com) 是市面上主流的公有镜像仓库。许多企业还创建私有 Docker 镜像仓库。Docker 主要用于管理单个节点上的容器。

> **注意**：由于 Kubernetes 已经成为了容器管理的主流工具，所以从 Rancher 2.x 版本开始，我们不再支持 Docker Swarm。如果你有使用 Docker 管理容器的需求，可以安装 Rancher 1.6 进行操作。

## 关于 Kubernetes

Kubernetes 是容器和集群管理的标准。YAML 文件规定了组成一个应用所需的容器和其他资源。Kubernetes 提供了调度、伸缩、服务发现、健康检查、密文管理和配置管理等功能。

## Kubernetes 集群是什么

集群是可作为一个系统协同工作的一组计算机。

_Kubernetes 集群_ 是使用 [Kubernetes 容器编排系统](https://kubernetes.io/)来部署、运维和伸缩 Docker 容器的集群，让你的组织实现应用自动化运维。

## Kubernetes 集群中节点的角色

Kubernetes 集群中的每个计算资源称为一个 _节点_ 。节点可以是裸金属服务器或虚拟机。Kubernetes 将节点分为 _etcd_ 节点、_controlplane_ 节点和 _worker_ 节点。

一个 Kubernetes 集群至少包含一个 etcd 节点，一个 controlplane 节点和一个 worker 节点。

### etcd 节点

Rancher 在单节点和高可用安装中均使用 etcd 作为数据存储。在 Kubernetes 中，etcd 也是存储集群状态的节点的角色。

Kubernetes 集群的状态保存在 [etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd) 中。etcd 节点运行 etcd 数据库。

etcd 数据库组件是一个分布式的键值对存储系统，用于存储所有 Kubernetes 的集群数据，例如集群协作和状态管理相关的数据。建议在多个节点上运行 etcd，以保证在发生故障时有可用的备份数据。

即使你可以仅在一个节点上运行 etcd，但 etcd 需要大多数节点（即 quorum）的同意才能更新集群状态。集群需要包含足够数量的健康 etcd 节点，以形成 quorum。假设集群中有 n 个节点，quorum 的数量则需要是 (n/2)+1。如果集群节点数量是奇数，每新增一个节点，都会增加 quorum 所需节点数。

一般情况下，集群中只要配置三个 etcd 节点就能满足小型集群的需求，五个 etcd 节点能满足大型集群的需求。

### Controlplane 节点

Controlplane 节点上运行 Kubernetes API server、scheduler 和 Controller Manager。这些节点执行日常任务，以确保集群状态和你的配置一致。因为 etcd 节点保存了集群的全部数据，所以 Controlplane 节点是无状态的。虽然你可以在单个节点上运行 Controlplane，但是我们建议在两个或以上的节点上运行 Controlplane，以保证冗余性。另外，一个节点可以既是 Controlplane 节点，又是 etcd 节点。

### Worker 节点

每个 [worker 节点](https://kubernetes.io/docs/concepts/architecture/nodes/)都能运行：

- **Kubelets**：监控节点状态的 Agent，确保你的容器处于健康状态。
- **工作负载**：承载应用和其他 deployment 的容器和 Pod。

Worker 节点也运行存储和网络驱动，有必要时也会运行 Ingress Controller。你可以根据需要，创建尽可能多的 worker 节点来运行你的[工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/)。

## 关于 Helm

在 Rancher 高可用安装的场景下，你可以使用 Helm 工具，把 Rancher 安装到 Kubernetes 集群上。

Helm 是 Kubernetes 的包管理工具。Helm Chart 为 Kubernetes YAML 清单文件提供了模板语法。通过 Helm，用户可以创建可配置的 deployment，而不仅仅只能使用静态文件。如果你需要创建自己的 deployment 商店应用，请参见 [https://helm.sh/](https://helm.sh) 上的文档。

有关服务账号和 Cluster Role Binding 的更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)。
