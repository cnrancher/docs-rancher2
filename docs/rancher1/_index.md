---
title: Rancher 1.x Docs
---

# Rancher 1.x Docs

---

Rancher 是一个开源的企业级容器管理平台。通过 Rancher，企业再也不必自己使用一系列的开源软件去从头搭建容器服务平台。Rancher 提供了在生产环境中使用的管理 Docker 和 Kubernetes 的全栈化容器部署与管理平台。

Rancher 由以下四个部分组成:

## 基础设施编排

Rancher 可以使用任何公有云或者私有云的 Linux[主机](/docs/rancher1/infrastructure/hosts/_index)资源。Linux 主机可以是虚拟机，也可以是物理机。Rancher 仅需要主机有 CPU，内存，本地磁盘和网络资源。从 Rancher 的角度来说，一台云厂商提供的云主机和一台自己的物理机是一样的。

Rancher 为运行容器化的应用实现了一层灵活的[基础设施服务](/docs/rancher1/rancher-service/_index)。Rancher 的基础设施服务包括[网络](/docs/_rancher1/rancher-service/networking_/index)， [存储](/docs/rancher1/rancher-service/storage-services/_index)， [负载均衡](/docs/rancher1/rancher-service/load-balancer/_index)， [DNS](/docs/rancher1/rancher-service/dns-service/_index)和安全模块。Rancher 的基础设施服务也是通过容器部署的，所以同样 Rancher 的基础设施服务可以运行在任何 Linux 主机上。

## 容器编排与调度

很多用户都会选择使用容器编排调度框架来运行容器化应用。Rancher 包含了当前全部主流的编排调度引擎，例如[Docker Swarm](/docs/rancher1/infrastructure/swarm/_index)， Kubernetes， 和[Mesos](/docs/rancher1/infrastructure/mesos/_index)。同一个用户可以创建 Swarm 或者 Kubernetes 集群。并且可以使用原生的 Swarm 或者 Kubernetes 工具管理应用。

除了 Swarm，Kubernetes 和 Mesos 之外，Rancher 还支持自己的 Cattle 容器编排调度引擎。Cattle 被广泛用于编排 Rancher 自己的基础设施服务以及用于 Swarm 集群，Kubernetes 集群和 Mesos 集群的配置，管理与升级。

## 应用商店

Rancher 的用户可以在[应用商店](/docs/rancher1/configurations/catalog/_index)里一键部署由多个容器组成的应用。用户可以管理这个部署的应用，并且可以在这个应用有新的可用版本时进行自动化的升级。Rancher 提供了一个由 Rancher 社区维护的应用商店，其中包括了一系列的流行应用。Rancher 的用户也可以[创建自己的私有应用商店](/docs/rancher1/configurations/catalog/private-catalog/_index)。

## 企业级权限管理

Rancher 支持灵活的插件式的用户认证。支持 Active Directory，LDAP， Github 等 [认证方式](/docs/rancher1/configurations/environments/access-control/_index)。 Rancher 支持在[环境](/docs/rancher1/configurations/environments/_index)级别的基于角色的访问控制 (RBAC)，可以通过角色来配置某个用户或者用户组对开发环境或者生产环境的访问权限。
