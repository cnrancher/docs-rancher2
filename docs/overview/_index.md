---
title: 产品简介
description: 为您介绍Rancher的产品。帮助您了解 Rancher 容器平台。Rancher 是为使用容器的公司打造的容器管理平台。Rancher 简化了使用 Kubernetes 的流程，开发者可以随处运行 Kubernetes，满足 IT 需求规范，赋能 DevOps 团队。
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
  - 产品简介
---

## 概述

Rancher 是为使用容器的公司打造的容器管理平台。Rancher 简化了使用 Kubernetes 的流程，开发者可以随处运行 Kubernetes（Run Kubernetes Everywhere），满足 IT 需求规范，赋能 DevOps 团队。

Rancher 1.x 最初是为了支持多种容器编排引擎而构建的，其中包括自己的容器编排引擎 Cattle。但随着 Kubernetes 在市场上的兴起，Rancher 2.x 已经完全转向了 Kubernetes。Rancher 2.x 可以部署和管理在任何地方运行的 Kubernetes 集群。

> **说明：**下文中所有的“Rancher”代指的都是 Rancher 2.x。

Rancher 可以创建来自 Kubernetes 托管服务提供商但集群，自动创建节点并安装 Kubernetes 集群，或者导入任何已经存在的 Kubernetes 集群。

Rancher 通过支持集群的身份验证和基于角色的访问控制（RBAC），使系统管理员能够从一个位置控制全部集群的访问。Rancher 可以对集群及其资源进行详细的监控和并在需要时发送告警，也可以将容器日志发送给外部日志系统，并通过应用商店与 Helm 集成。如果您具有外部 CI/CD 流水线系统，则可以将其与 Rancher 对接，如果没有，Rancher 也提供了简单易用的流水线来帮助您自动部署和升级工作负载。除此之外，Rancher 还有很多开箱即用的功能来帮助您更好的管理集群和业务应用，例如多集群应用，全局 DNS，服务网格，安全扫描，集群模版和基于 OPA 的策略管理等功能。

总而言之，Rancher 是一个全栈式的 Kubernetes 容器管理平台，也是一个可以在任何地方都能成功运行 Kubernetes 的工具。

<div class="text-center">
<iframe width="444" height="250" src="//player.bilibili.com/player.html?aid=94394330&cid=161139480&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>
<div class="text-center">
<a href="https://www.bilibili.com/video/av94394330/"> Rancher v2.3.5 Demo 视频 </a>
</div>

更多视频教程，请前往 [Bilibili](https://space.bilibili.com/430496045/video?tid=0&page=1&keyword=&order=pubdate) 查看。

## Run Kubernetes Everywhere

Kubernetes 已经成为了容器管理的标准。大多数云服务和虚拟服务的提供商现在将 Kubernetes 作为标准的基础设施。用户可以使用 Rancher Kubernetes Engine（简称 RKE），或其他云服务提供商的容器服务，如 GKE、AKS、 EKS 等，创建 Kubernetes 集群。用户也可以将已有集群导入 Rancher，集中管理。

## 满足 IT 需求规范

Rancher 支持集中化认证、权限控制、监控和管理所有 Kubernetes 集群。您可以使用 Rancher 完成以下操作：

- 使用活动目录（Active Directory）的认证信息访问云端 Kubernetes 集群，如 GKE、AKS、EKS 等。
- 设置用户、用户组、项目组、集群、云服务的权限控制策略和安全策略。
- 一站式监控您名下所有集群的健康状态。

## 赋能 DevOps 开发团队

Rancher 提供了一个简单直接的用户界面给 DevOps 工程师管理他们的应用程序。用户不需要对 Kubernetes 有深入的了解，即可使用 Rancher。

Rancher 应用商店包含了一套内置的 DevOps 开发工具。Rancher 通过了一些云原生的生态系统认证，包括安全工具、监控系统、容器镜像、存储和网络驱动等。

以下的示意图讲述了 Rancher 在 IT 管理团队和 DevOps 开发团队之间扮演的角色。DevOps 团队把他们的应用部署在他们选择的云上面，可以是公有云，也可以是私有云。IT 管理员负责管理用户、集群、多云之间的权限。

![Platform](/img/rancher/platform.png)

## Rancher API Server 的功能

Rancher API Server 是基于嵌入式 Kubernetes API Server 和 ETCD 数据库建立的，它提供了以下功能：

### 授权和角色权限控制

- **用户管理：** Rancher API server 除了管理用户在公司内部的使用的认证信息之外，还管理[用户访问外部服务所需的认证信息](/docs/admin-settings/authentication/_index)，如登录活动目录或 GitHub 所需的账号密码。
- **授权：** Rancher API server 负责管理[权限控制策略](/docs/admin-settings/rbac/_index) 和 [安全策略](/docs/admin-settings/pod-security-policies/_index)。

### 使用 Kubernetes 的功能

- **运行 Kubernetes 集群：** Rancher API server 可以在已有节点上运行 [Kubernetes 集群](/docs/cluster-provisioning/_index) ，或对 Kubernetes 进行[版本升级](/docs/cluster-admin/upgrading-kubernetes/_index)。
- **应用商店管理：** Rancher 可以使用[Helm Chart 应用商店](/docs/catalog/_index)重复部署应用。
- **项目管理：** 项目，是 Rancher 中的一个概念，Kubernetes 中并没有这个概念。项目由一个集群内的多个命名空间和多个访问控制策略组成，允许用户以组为单位，一次管理多个命名空间，对其进行 Kubernetes 相关操作。Rancher 用户界面提供了 [项目管理](/docs/project-admin/_index)和 [项目内应用管理](/docs/k8s-in-rancher/_index)两个功能。
- **流水线：** [流水线](/docs/project-admin/pipelines/_index) 可以帮助开发者快速高效地上线新软件。Rancher 支持给每一个项目单独配置流水线。
- **Istio：** [Rancher 与 Istio 集成](/docs/cluster-admin/tools/istio/_index)，管理员或集群所有者可以将 Istio 交给开发者，然后开发者使用 Istio 执行安全策略，排查问题，或为快速发布、灰度发布和 A/B 测试进行流量控制。

### 配置云端基础信息

- **同步节点信息：** Rancher API server 可以同步集群内所有[节点](/docs/cluster-admin/nodes/_index)的信息。
- **配置云端基础信息：** 当 Rancher 与云服务提供商配置完了之后，可以在云端动态配置[新节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index)和[持久化存储](/docs/cluster-admin/volumes-and-storage/_index)。

### 查看集群信息

- **日志：** Rancher 可以跟多种主流日志工具集成，您可以设置 [集群日志](/docs/cluster-admin/tools/logging/_index) 或[项目日志](/docs/project-admin/tools/logging/_index)。
- **监控：** 使用 Rancher，您可以通过 Prometheus 监控集群节点、Kubernetes 组件、软件部署的状态和进度。您可以设置 [集群监控](/docs/cluster-admin/tools/monitoring/_index) 或[项目监控](/docs/project-admin/tools/monitoring/_index)。
- **告警信息：** 您需要随时知道集群和项目动态，才可以提高公司的运行效率。您可以设置[集群告警](/docs/cluster-admin/tools/alerts/_index) 或 [项目告警](/docs/project-admin/tools/alerts/_index)。

## 编辑下游集群

对于已有集群而言，启动集群的方法决定了可编辑的选项和设置。例如，只有通过 RKE 启动的集群才有可编辑的**集群选项**。使用 Rancher 创建集群后，集群管理员可以管理集群会员，开启 Pod 域安全策略，管理节点池，以及进行 [其他操作](/docs/cluster-admin/editing-clusters/_index)。下表总结了每一种类型的集群和对应的可编辑的选项和设置：

| 可编辑的选项和设置 | RKE 集群 | 云服务集群 | 导入集群 |
| ------------------ | -------- | ---------- | -------- |
| 管理用户角色       | ✓        | ✓          | ✓        |
| 编辑集群选项       | ✓        |            |          |
| 管理节点池         | ✓        |            |          |
