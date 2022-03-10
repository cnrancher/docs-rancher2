---
title: 集群模板
weight: 100
---

集群模板包含 Kubernetes 配置和节点池配置，允许单个模板包含 Rancher 在云提供商中配置新节点并在这些节点上安装 Kubernetes 所需的所有信息。

- [概述](#overview)
- [RKE2 集群模板](#rke2-cluster-template)
- [向 Rancher 添加集群模板](#adding-a-cluster-template-to-rancher)
- [使用集群模板创建集群](#creating-a-cluster-from-a-cluster-template)
- [更新使用集群模板创建的集群](#updating-a-cluster-created-from-a-cluster-template)
- [使用 Fleet 从模板部署集群](#deploying-clusters-from-a-template-with-fleet)
- [卸载集群模板](#uninstalling-cluster-templates)
- [配置选项](#configuration-options)

## 概述

集群模板以 Helm Chart 的形式提供。要使用集群模板，你需要克隆和复刻模板，根据你的用例更改模板，然后在 Rancher 管理集群上安装 Helm Chart。如果 Helm Chart 安装在 Rancher 管理集群上，会创建一个新的集群资源，Rancher 使用它来配置新集群。

使用模板配置集群后，对模板的任何更改都不会影响集群。使用集群模板创建集群后，集群的配置和基础设施可能会发生变化，因为集群模板没有任何执行限制。

### Kubernetes 发行版

集群模板可以使用任何 Kubernetes 发行版。现在，我们提供一个带有 RKE2 Kubernetes 集群的示例。将来我们可能会提供更多使用其他 Kubernetes 发行版的示例。

### 版本控制

Rancher 不管理集群模板的版本控制。版本控制在包含模板的 Helm Chart 的仓库中处理。

## RKE2 集群模板

RKE2 集群模板的示例仓库在[这里](https://github.com/rancher/cluster-template-examples)。从 Rancher 2.6.0 开始，我们提供了一个 RKE2 集群模板，未来可能会添加更多模板。

## 向 Rancher 添加集群模板

在本节中，你将学习如何将集群模板添加到`本地`集群的 Chart 仓库列表中。这样，当用户安装新的 Kubernetes 集群时，Rancher 将提供集群模板的选项。

> **前提**：
>
> - 你需要有在`本地` Kubernetes 集群上安装 Helm Chart 的权限。
> - 为了使 Chart 以创建新集群的形式出现，Chart 必须具有注释 `catalog.cattle.io/type: cluster-template`。

1. 转到集群模板示例仓库。你可以在[此 GitHub 仓库](https://github.com/rancher/cluster-template-examples)中找到 Rancher 的示例。从 Rancher 2.6.0 开始，我们提供了一个 RKE2 集群模板，未来可能会添加更多模板。
1. 复刻仓库。
1. 可选：通过编辑 `values.yaml` 文件来编辑集群选项。有关编辑文件的帮助，请参阅集群模板的 Helm Chart 自述文件。
1. 将 Chart 仓库添加到 Rancher。点击 **☰ > 集群管理**。
1. 转到`本地`集群并单击 **Explore**。
1. 在左侧导航栏中，单击**应用 & 应用市场 > Chart 仓库。**
1. 点击**创建**。
1. 输入集群模板仓库的名称。
1. 点击**包含 Helm Chart 定义的 Git 仓库**。
1. 在 **Git 仓库 URL**字段，输入仓库的 URL，例如，`https://github.com/rancher/cluster-template-examples.git`。
1. 在**Git 分支**字段，输入要用作模板源的分支。Rancher 的示例仓库使用了 `main` 分支。
1. 点击**创建**。

**结果**：集群模板可从 Rancher 的`本地`集群中的**应用 & 应用市场**获得。现在，你可以使用模板来部署集群。

> - **受限管理员访问**：如果你是受限管理员并且无权访问`本地`集群，你仍然可以添加新的 RKE2 模板并管理集群仓库。要导航到 Chart 仓库，请在左侧导航栏单击 **☰ > 集群管理 > 高级选项 > 仓库**。你将绕过上述步骤 1 - 6，然后继续按照步骤 7 - 12 创建集群模板。

## 使用集群模板创建集群

> **前提**：
>
> - 你需要获得配置新 Kubernetes 集群的权限。
> - 你将需要云凭证来使用模板配置基础设施。
> - 为了以创建新集群的形式显示，集群模板的 Helm Chart 必须具有 `catalog.cattle.io/type: cluster-template` 注释。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面，点击**创建**。
1. 单击集群模板的名称。
1. 完成 Helm Chart 的安装。

**结果**：在 Rancher 配置新集群后，你可以像管理其他 Rancher 启动的 Kubernetes 集群一样管理该新集群。如果集群模板有可供用户选择的选项，你可以通过 UI 配置这些选项。

## 更新使用集群模板创建的集群

如果集群所用的模板有了新版本，你可以使用**应用 & 应用市场 > 已安装的应用**页面中的模板更新集群。

## 使用 Fleet 从模板部署集群

> **前提**：
>
> - 你需要获得配置新 Kubernetes 集群的权限。
> - 你将需要云凭证来使用模板配置基础设施。
> - 为了以创建新集群的形式显示，集群模板的 Helm Chart 必须具有 `catalog.cattle.io/type:cluster-template` 注释。
> - 为了将模板用作持续交付/GitOps 的一部分，集群模板需要部署在`本地`集群的 `fleet-local` 命名空间中。
> - 所有值都必须在模板的 `values.yaml` 中设置。
> - Fleet 仓库必须遵循此处的[准则](http://fleet.rancher.io/gitrepo-structure/)。对于 RKE2 集群模板，则必须把 `fleet.yaml` 文件添加到仓库。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面，点击**创建**。
1. 点击**使用模板创建集群**。

**结果**：Rancher 配置好新集群后，集群由 Fleet 管理。

## 卸载集群模板

1. 点击 **☰ > 集群管理**。
1. 前往`本地`集群并单击**应用 & 应用市场 > Chart 仓库**。
1. 转到集群模板的 Chart 仓库，然后单击 **⋮ > 删除。**
1. 确认删除。

**结果**：集群模板已卸载。此操作不会影响使用集群模板创建的现有集群。

能够访问`本地`集群的管理员还可以前往**应用 & 应用市场 > 已安装的应用**页面，通过集群模板来移除已部署的集群。

## 配置选项

集群模板非常灵活，可用于配置以下所有选项：

- 节点配置
- 节点池
- 预先指定的云凭证
- 启用/配置授权的集群端点，以在不使用 Rancher 作为代理的情况下获得对集群的 kubectl 访问权限
- 安装 Rancher V2 monitoring
- Kubernetes 版本
- 分配集群成员
- 配置基础设施，例如 AWS VPC/子网或 vSphere 数据中心
- 云提供商选项
- Pod 安全选项
- 网络提供商
- Ingress Controller
- 网络安全配置
- 网络插件
- 私有镜像仓库 URL 和凭证
- 附加组件
- Kubernetes 选项，包括 kube-api、kube-controller、kubelet 和服务等 Kubernetes 组件的配置

有关如何配置模板的详细信息，请参阅集群模板的 Helm Chart README 文件。
