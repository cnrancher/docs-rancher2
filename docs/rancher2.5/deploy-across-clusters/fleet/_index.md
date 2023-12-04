---
title: Fleet 介绍
description: Fleet 是轻量级的集群管理工具，您可以使用 Fleet 管理多达一百万个集群。Fleet 是一个独立于 Rancher 的项目，可以用 Helm 安装在任何 Kubernetes 集群上。Fleet 可以从 git 管理原始 Kubernetes YAML、Helm chart 或 Kustomize 或三者的任意组合的部署。无论来源如何，所有的资源都会被动态地转化为 Helm chart，并以 Helm 作为引擎，来实现部署集群中的一切。这给了一个高度的控制，一致性和可审计性。Fleet 不仅关注于扩展能力，还关注于给人高度的控制和可视性，以确切地了解集群上安装了什么。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 跨集群部署应用
  - Fleet
---

_适用于 Rancher v2.5+_

## 概述

Fleet 是轻量级的集群管理工具，您可以使用 Fleet 管理多达一百万个集群。对于[单个集群](https://fleet.rancher.io/single-cluster-install/)也很好用，但当你达到[大规模](https://fleet.rancher.io/multi-cluster-install/)时，它才真正发挥出它的威力。

Fleet 是一个独立于 Rancher 的项目，可以用 Helm 安装在任何 Kubernetes 集群上。Fleet 的架构如下图所示：

- [架构](#架构)
- [在 Rancher UI 中访问 Fleet](#在-rancher-ui-中访问-fleet)
- [Windows 支持](#windows-支持)
- [GitHub 存储库](#github-存储库)
- [在代理服务器后面使用-fleet](#在代理服务器后面使用-fleet)
- [Helm Chart 依赖项](#helm-chart-dependencies)
- [故障排查](#troubleshooting)
- [文档](#文档)

## 架构

关于 Fleet 如何工作的详细信息，请参见[本页面](/docs/rancher2.5/deploy-across-clusters/fleet/architecture/_index)。

## 在 Rancher UI 中访问 Fleet

Fleet 预装在 Rancher v2.5 中。用户可以通过遵循 **gitops** 实践，利用持续交付将他们的应用程序部署到 git 存储库中的 Kubernetes 集群中，而无需任何手动操作。有关持续交付和其他 Fleet 故障排除技巧的更多信息，请参阅[此处](https://fleet.rancher.io/troubleshooting/)。

按照下面的步骤，在 Rancher UI 中访问持续交付：

1. 点击 Rancher UI 中的 **Cluster Explorer**。

1. 在左上角的下拉菜单中，点击 **Cluster Explorer > Continuous Delivery**。

1. 在菜单的顶部选择你的命名空间，注意以下几点：

   - 默认情况下，选择 `fleet-default`，包括所有通过 Rancher 注册的下游集群。
   - 你可以切换到 `fleet-local`，它只包含 `local` 集群，或者你可以创建你自己的工作空间，你可以将集群分配和移动到该工作空间。
   - 然后你可以通过点击左侧导航栏上的**集群**来管理集群。

1. 点击左侧导航栏上的 **Gitrepos**，将 gitrepo 部署到当前工作区的集群中。

1. 选择你的 [git 仓库](https://fleet.rancher.io/gitrepo-add/)和[目标集群/集群组](https://fleet.rancher.io/gitrepo-structure/)。你也可以在 UI 中通过点击左侧导航栏的**集群组**来创建集群组。

1. 一旦 gitrepo 部署完毕，你可以通过 Rancher UI 监控应用程序。

## Windows 支持

_从 v2.5.6 版起可用_

关于对带有 Windows 节点的集群的支持，详见[本页](/docs/rancher2.5/deploy-across-clusters/fleet/windows/_index)。

## GitHub 存储库

Fleet 的 Helm chart 可在[这里](https://github.com/rancher/fleet/releases/latest)查阅。

## 在代理服务器后面使用 Fleet

_从 v2.5.8 版起可用_

关于在代理服务器后面使用 Fleet 的细节，请参见[本页](/docs/rancher2.5/deploy-across-clusters/fleet/proxy/_index)。

## Helm Chart 的依赖

为了让有依赖关系的 Helm Chart 能够成功部署，你必须运行一个手动命令，因为要由用户来完成依赖关系列表。如果你不这样做，继续克隆你的仓库并运行 `helm install`，你的安装将会失败，因为依赖项会丢失。

git 仓库中的 Helm Chart 必须包括其在 charts 子目录中的依赖项。你必须手动运行 `helm dependencies update $chart` 或者在本地运行 `helm dependencies build $chart`，然后提交完整的 charts 目录到你的 git 仓库。注意，你需要使用适合的参数更新你的命令。

## Troubleshooting

---

**已知问题：** Fleet 在使用 [backup-restore-operator](/docs/rancher2.5/backups/back-up-rancher/_index#步骤-1：安装-rancher-backup-operator) 进行还原后变得无法操作。一旦有了解决方案，我们会在社区中进行更新。

**临时解决方法：**

1. 找到 fleet-controller 和 fleet-controller-bootstrap 服务账户中列出的两个服务账户的 tokens。这些都在 local 集群的 fleet-system 命名空间下。
2. 删除不存在的 token secret。这样做可以使实际存在的服务账户 token secret 只存在一个条目。
3. 删除 fleet-system 命名空间中的 fleet-controller Pod，重新调度。
4. 服务账户 token 问题解决后，你可以强制重新部署 fleet agent。在 Rancher UI 中，进入 **☰>集群管理**，点击**集群**页面，然后点击**强制更新**。
5. 如果在步骤 4 之后，Fleet agent 包仍然处于 `修改` 状态，更新 fleet agent 包的 `spec.forceSyncGeneration` 字段，强制重新创建。

---

**已知问题：** Fleet gitrepos 的 clientSecretName 和 helmSecretName secret 不包含在由 [backup-restore-operator](/docs/rancher2.5/backups/back-up-rancher/_index#步骤-1：安装-rancher-backup-operator) 创建的备份或还原中。一旦有了解决方案，我们会在社区中进行更新。

**临时解决方法：**

默认情况下，Fleet 中不备份用户定义的 secret。如果执行灾难还原或将 Rancher 迁移到一个新的集群，有必要重新创建 secret。要修改 resourceSet 以包括你想要备份的额外资源，请参考文档[这里](https://github.com/rancher/backup-restore-operator#user-flow)。

---

## 文档

Fleet 的文档请参考见[Fleet 文档](https://fleet.rancher.io/)。
