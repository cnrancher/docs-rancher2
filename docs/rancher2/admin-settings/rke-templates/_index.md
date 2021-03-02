---
title: 功能介绍
description: RKE 的全称是Rancher Kubernetes Engine，它是 Rancher 用来创建 Kubernetes 集群的工具。RKE 集群模板制定了 DevOps 和安全团队的标准，简化了 Kubernetes 集群的创建过程。多集群管理面临着如何强制实施安全策略和附加配置的挑战，在将集群移交给最终用户之前，管理员需要标准化这些配置。RKE 集群模板提供了标准化集群配置的方式。无论是使用 Rancher UI、Rancher API 还是自动化流程创建的集群，Rancher 都将保证从 RKE 集群模板创建的每个集群在生成方式上是一致的。
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
  - 系统管理员指南
  - RKE模板
---

_从 Rancher v2.3.0 开始可用_

RKE 的全称是[Rancher Kubernetes Engine](/docs/rke/_index)，它是 Rancher 用来创建 Kubernetes 集群的工具。RKE 集群模板制定了 DevOps 和安全团队的标准，简化了 Kubernetes 集群的创建过程。

多集群管理面临着如何强制实施安全策略和附加配置的挑战，在将集群移交给最终用户之前，管理员需要标准化这些配置。RKE 集群模板提供了标准化集群配置的方式。无论是使用 Rancher UI、Rancher API 还是自动化流程创建的集群，Rancher 都将保证从 RKE 集群模板创建的每个集群在生成方式上是一致的。

配置 RKE 集群模板时，管理员具有以下权限：

- 决定用户可以修改的和不可修改的集群选项。
- 指定的用户是否可以与其他用户或和用户组共享 RKE 集群模板。
- 为不同的用户组创建 RKE 集群模板。

集群和模板之间存在多对一的关系，用户可以使用一个模板创建多个集群，而每个集群有且只有一个对应的模板。确认使用的模板后，无法修改。例如，“集群 A”是用户使用“模板 a”创建的，那么在编辑集群时，用户不能将集群 A”对应的“模板 a”，修改为其他模板。管理员可以通过编辑集群模板的方式更新集群模板，应用该模板创建的集群就会自动适配新模板的参数。

从 Rancher v2.3.3 开始，您可以[将现有集群的配置另存为 RKE 模板](/docs/rancher2/admin-settings/rke-templates/applying-templates/_index)。只有在更新模板后，才能更改集群的设置。新模板也可以用于启动新集群。

RKE 模板的核心功能使 DevOps 和安全团队能够：

- 标准化集群配置，并确保按照最佳实践来创建 RKE 集群
- 配置集群时，防止用户做出不明智的选择
- 与不同的用户和组共享不同的模板
- 将模板的所有权委托给受信任的用户进行更改
- 控制哪些用户可以创建模板
- 要求用户从模板创建集群

## 可配置设置

RKE 模板可以在 Rancher UI 中创建，也可以用 YAML 格式定义。模板中可以定义全部 RKE 集群中可以使用的参数：

- Cloud Provider 选项
- Pod 安全选项
- 网络供应商
- Ingress 控制器
- 网络安全配置
- 网络插件
- 私有镜像库 URL 和凭据
- 插件（Add-ons）
- Kubernetes 选项，包括 Kubernetes 组件的参数，如 kube-api、kube-controller、kubelet 和 services

RKE 模板的[插件部分](#插件)功能特别强大，因为它允许多种自定义选项。

## RKE 模板作用范围

Rancher 创建的集群支持 RKE 模板。模板可用于创建 RKE 集群（自定义集群和在云供应商上通过节点驱动创建的集群）。

RKE 模板用于定义 Kubernetes 和 Rancher 设置。节点模板负责配置节点。有关如何将 RKE 模板与硬件结合使用的参考，请参阅 [RKE 模板和硬件](/docs/rancher2/admin-settings/rke-templates/rke-templates-and-hardware/_index)。

可以从头开始创建 RKE 模板来预先定义集群配置。它们可以用于启动新集群，也可以从现有的 RKE 集群导出模板。

从 v2.3.3 开始，现有 RKE 集群的设置可以[保存为 RKE 模板](/docs/rancher2/admin-settings/rke-templates/applying-templates/_index)。这将创建新的模板并将集群设置绑定到该模板。因此，只有通过更新[模板](/docs/rancher2/admin-settings/rke-templates/creating-and-revising/_index)并且将这个集群[升级到新版本的模板](/docs/rancher2/admin-settings/rke-templates/creating-and-revising/_index)，才能编辑这个集群。

## 示例场景

当组织同时拥有基本和高级 Rancher 用户时，管理员可能希望为高级用户提供更多创建集群的选项，同时限制基本用户的选项。

这些[示例场景](/docs/rancher2/admin-settings/rke-templates/example-scenarios/_index)描述了组织如何使用模板来标准化集群创建。

一些示例场景包括：

- **强制使用模板：** 如果管理员希望所有新的 Rancher 创建的集群都具有这些设置，则管理员可能希望[强制每个人使用一个或多个模板来创建集群](/docs/rancher2/admin-settings/rke-templates/example-scenarios/_index)。
- **与不同的用户共享不同的模板：** 管理员可以为[基本用户和高级用户提供不同的模板](/docs/rancher2/admin-settings/rke-templates/example-scenarios/_index)，这样基本用户会有更多受限的选项，高级用户在创建集群时可以更谨慎地使用更多选项。
- **更新模板设置：** 如果组织的安全和 DevOps 团队决定将最佳实践嵌入到新集群所需的设置中，则这些最佳实践可能会随时间而改变。如果最佳实践发生变化，[模板可以更新为新版本](/docs/rancher2/admin-settings/rke-templates/example-scenarios/_index)并且从模板创建的集群可以[升级到新版本](/docs/rancher2/admin-settings/rke-templates/creating-and-revising/_index)模板。
- **共享模板的所有权：** 当模板所有者不再希望维护模板或希望共享模板的所有权时，此场景描述如何[共享模板所有权](/docs/rancher2/admin-settings/rke-templates/example-scenarios/_index)。

## 模板管理

创建 RKE 模板时，可以在 Rancher UI 中的**全局**视图中的**工具 > RKE 集群模板**下使用它。创建模板时，您将成为模板所有者，这将授予您修改和共享模板的权限。您可以与指定的用户或组共享 RKE 模板，也可以将其公开。

管理员可以启用模板强制执行，以要求用户在创建集群时必须使用 RKE 模板。这使管理员可以保证 Rancher 总是创建指定配置的集群。

RKE 模板更新通过修订系统处理。如果要更改或更新模板，请创建模板的新修订版。然后，可以将使用旧版本模板创建的集群升级到新模板修订版。

在 RKE 模板中，可以将设置限制为模板所有者选择的内容，也可以打开设置以供最终用户选择值。它们的差别体现在，创建模板时，Rancher UI 中的每个设置上的**允许用户覆盖**标示。

对于无法覆盖的设置，最终用户将无法直接编辑它们。为了让用户使用这些设置的不同选项，RKE 模板所有者需要创建 RKE 模板的新版本，这将允许用户升级和更改该选项。

本节中的文件解释了 RKE 模板管理的细节：

- [获取创建模板的权限](/docs/rancher2/admin-settings/rke-templates/creator-permissions/_index)
- [创建和修改模板](/docs/rancher2/admin-settings/rke-templates/creating-and-revising/_index)
- [强制使用模板](/docs/rancher2/admin-settings/rke-templates/enforcement/_index)
- [覆盖模板设置](/docs/rancher2/admin-settings/rke-templates/overrides/_index)
- [与集群创建者共享模板](/docs/rancher2/admin-settings/rke-templates/template-access-and-sharing/_index)
- [共享模板所有权](/docs/rancher2/admin-settings/rke-templates/template-access-and-sharing/_index)

这里有一个[RKE 模板的示例 YAML 文件](/docs/rancher2/admin-settings/rke-templates/example-yaml/_index)以供参考。

## 应用模板

您可以使用自己创建的模板来[创建集群](/docs/rancher2/admin-settings/rke-templates/applying-templates/_index)，也可以从[与您共享的模板](/docs/rancher2/admin-settings/rke-templates/template-access-and-sharing/_index)创建集群。

如果 RKE 模板所有者创建了模板的新版本，则可以[将集群升级到该版本](/docs/rancher2/admin-settings/rke-templates/applying-templates/_index)。

可以从头开始创建 RKE 模板来预先定义集群配置。它们可以应用于启动新的集群，也可以从现有的集群导出 RKE 模板。

从 Rancher v2.3.3 开始，您可以[将现有的集群另存为 RKE 模板](/docs/rancher2/admin-settings/rke-templates/applying-templates/_index)，然后只有通过更新模板，才能更改集群的设置。

## 标准化硬件

RKE 模板的目的是用于标准化 Kubernetes 和 Rancher 设置。如果您还想标准化您的基础设施，可以将 RKE 模板和[其他工具](/docs/rancher2/admin-settings/rke-templates/rke-templates-and-hardware/_index)一起使用，来实现这个目的。

## YAML 定制

如果将 RKE 模板定义为 YAML 文件，则可以修改此[示例 RKE 模板 YAML](/docs/rancher2/admin-settings/rke-templates/example-yaml/_index)。RKE 模板中的 YAML 使用与 Rancher 在创建 RKE 集群时相同的自定义项，但由于 YAML 要在 Rancher 的 RKE 集群中使用，因此需要将 RKE 模板自定义项嵌套在 YAML 中的`rancher_kubernetes_engine_config`参数下。

RKE 文档还有带有注释的[cluster.yml 文件示例](/docs/rke/example-yamls/_index) `，您可以使用这些文件作为参考。

有关可用的全部选项，请参阅[集群配置](/docs/rke/config-options/_index/)上的 RKE 文档。

## 插件

RKE 模板配置文件的插件部分的工作方式与[集群配置文件的插件部分](/docs/rke/config-options/add-ons/_index)相同。

用户定义的插件（Add-ons) 指令允许您使用外部的 URL 来获取 Kubernetes 清单文件，或者直接将 Kubernetes YAML 写在模板内。如果您将这些 YAML 清单作为 RKE 模板的一部分，Rancher 将在集群中部署这些 YAML 文件。

您可以使用插件执行以下操作：

- 启动 Kubernetes 集群后，在集群上安装应用程序
- 使用 Kubernetes 守护程序集，在集群中的每个节点上部署插件
- 自动设置命名空间、服务帐户或角色绑定

RKE 模板配置必须嵌套在`rancher_kubernetes_engine_config`指令中。要设置插件，请在创建模板时单击**编辑 YAML**，然后使用`addons`参数添加清单，或使用`addons_include`指令设置 YAML 文件的 URL。有关自定义插件的详细信息，请参阅[用户定义的插件文档](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)。
