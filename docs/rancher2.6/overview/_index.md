---
title: 概述
weight: 1
---

Rancher 是一个为使用容器的公司打造的容器管理平台。Rancher 使得开发者可以随处运行 Kubernetes（Run Kubernetes Everywhere），满足 IT 需求规范，赋能 DevOps 团队。

# Run Kubernetes Everywhere

Kubernetes 已经成为容器编排标准。现在，大多数云和虚拟化提供商都提供容器编排服务。Rancher 用户可以选择使用 Rancher Kubernetes Engine（RKE）或云 Kubernetes 服务（例如 GKE、AKS 和 EKS）创建 Kubernetes 集群。还可以导入和管理使用任何 Kubernetes 发行版或安装程序创建的现有 Kubernetes 集群。

# 满足 IT 需求规范

Rancher 支持对其控制的所有 Kubernetes 集群进行集中认证、访问控制和监控。例如，你可以：

- 使用你的 Active Directory 凭据访问由云提供商（例如 GKE）托管的 Kubernetes 集群。
- 设置所有用户、组、项目、集群和云服务的权限控制策略和安全策略。
- 一站式查看 Kubernetes 集群的运行状况和容量。

# 赋能 DevOps 团队

Rancher 为 DevOps 工程师提供简单直接的用户界面，以管理其应用负载。用户不需要对 Kubernetes 有非常深入的了解，即可使用 Rancher。Rancher 应用商店包含一套实用的 DevOps 开发工具。Rancher 获得了多种云原生生态系统产品的认证，包括安全工具、监控系统、容器镜像仓库、存储和网络驱动等。

下图讲述了 Rancher 在 IT 管理团队和 DevOps 开发团队之间扮演的角色。DevOps 团队把他们的应用部署在他们选择的公有云或私有云上。IT 管理员负责查看并管理用户、集群、云服务的权限。

![平台]({{<baseurl>}}/img/rancher/platform.png)

# Rancher API Server 的功能

Rancher API Server 是基于嵌入式 Kubernetes API Server 和 etcd 数据库建立的，它提供了以下功能：

### 授权和基于角色的权限控制（RBAC）

- **用户管理**：Rancher API Server 除了管理本地用户，还[管理用户用来访问外部服务所需的认证信息]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/)，如登录 Active Directory 和 GitHub 所需的账号密码。
- **授权**：Rancher API Server 可以管理[访问控制策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/)和[安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。

### 使用 Kubernetes 的功能

- **配置 Kubernetes 集群**：Rancher API Server 可以在已有节点上[配置 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/)，或进行 [Kubernetes 版本升级]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/upgrading-kubernetes)。
- **管理应用商店**：Rancher 支持使用 [Helm Chart 应用商店]({{<baseurl>}}/rancher/v2.6/en/helm-charts/)实现轻松重复部署应用。
- **管理项目**：项目由集群中多个命名空间和访问控制策略组成，是 Rancher 中的一个概念，Kubernetes 中并没有这个概念。你可以使用项目实现以组为单位，管理多个命名空间，并进行 Kubernetes 相关操作。Rancher UI 提供用于[项目管理]({{<baseurl>}}/rancher/v2.6/en/project-admin/)和[项目内应用管理]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/)的功能。
- **流水线**：[流水线]({{<baseurl>}}/rancher/v2.6/en/project-admin/pipelines/)可以帮助开发者快速高效地上线新软件。Rancher 支持给每个项目单独设置流水线。
- **Istio**：[Rancher 与 Istio 集成]({{<baseurl>}}/rancher/v2.6/en/istio/)，使得管理员或集群所有者可以将 Istio 交给开发者，然后开发者使用 Istio 执行安全策略，排查问题，或为蓝绿部署，金丝雀部署，和 A/B 测试进行流量管理。

### 配置云基础设施

- **同步节点信息**：Rancher API Server 可以同步所有集群中全部[节点]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/nodes/)的信息。
- **配置云基础设施**：如果你为 Rancher 配置了云提供商，Rancher 可以在云端动态配置[新节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)和[持久化存储]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)。

### 查看集群信息

- **日志管理**：Rancher 可以与多种 Kubernetes 集群之外的主流日志管理工具集成。
- **监控**：你可以使用 Rancher，通过业界领先并开源的 Prometheus，来监控集群节点、Kubernetes 组件和软件部署的状态和进程。
- **告警**：为了保证集群和应用程序的正常运行，提高公司的生产效率，你需要随时了解集群和项目的计划内和非计划事件。

# 使用 Rancher 编辑下游集群

对于已有集群而言，可提供的选项和设置取决于你配置集群的方法。例如，只有[通过 RKE 启动]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)的集群才有可编辑的**集群选项**。

使用 Rancher 创建集群后，集群管理员可以管理集群成员，开启 Pod 安全策略，管理节点池，以及进行[其他操作]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/)。

下表总结了每一种类型的集群和对应的可编辑的选项和设置：

{{% include file="/rancher/v2.6/en/cluster-provisioning/cluster-capabilities-table" %}}
