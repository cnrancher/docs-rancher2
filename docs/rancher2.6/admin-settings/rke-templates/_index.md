---
title: RKE 模板
weight: 80
---

RKE 模板旨在让 DevOps 和安全团队标准化和简化 Kubernetes 集群创建的流程。

RKE 的全称是 [Rancher Kubernetes Engine]({{<baseurl>}}/rke/latest/en/)，它是 Rancher 用来配置 Kubernetes 集群的工具。

随着 Kubernetes 越来越受欢迎，管理更多小型集群逐渐成为趋势。如果你想要创建大量集群，对集群进行一致管理尤为重要。多集群管理面临着安全和附件配置执行的挑战，在将集群移交给最终用户之前，这些配置需要标准化。

RKE 模板有助于标准化这些配置。无论是使用 Rancher UI、Rancher API 还是自动化流程创建的集群，Rancher 都将保证从 RKE 集群模板创建的每个集群在生成方式上是一致的。

管理员可以控制最终用户能更改的集群选项。RKE 模板还可以与特定的用户和组共享，以便管理员可以为不同的用户集创建不同的 RKE 模板。

如果集群是使用 RKE 模板创建的，则不能让集群使用另一个 RKE 模板。你只能将集群更新为同一模板的新版本。

你可以[将现有集群的配置保存为 RKE 模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#converting-an-existing-cluster-to-use-an-rke-template)。这样，只有模板更新后才能更改集群的设置。新模板还可用于启动新集群。

RKE 模板的核心功能允许 DevOps 和安全团队：

- 标准化集群配置并确保按照最佳实践创建 Rancher 配置的集群
- 配置集群时，防止用户做出不明智的选择
- 与不同的用户和组共享不同的模板
- 将模板的所有权委托给受信任的用户进行更改
- 控制哪些用户可以创建模板
- 要求用户使用模板来创建集群

## 可配置的设置

RKE 模板可以在 Rancher UI 中创建或以 YAML 格式定义。当你使用 Rancher 从基础设施提供商配置自定义节点或一般节点时，它们可以指定为相同的参数：

- 云提供商选项
- Pod 安全选项
- 网络提供商
- Ingress Controller
- 网络安全配置
- 网络插件
- 私有镜像仓库 URL 和凭证
- 附加组件
- Kubernetes 选项，包括 kube-api、kube-controller、kubelet 和服务等 Kubernetes 组件的配置

RKE 模板的[附加组件](#add-ons)的功能特别强大，因为它允许多种自定义选项。

## RKE 模板的范围

Rancher 配置的集群支持 RKE 模板。模板可用于配置自定义集群或由基础设施提供商启动的集群。

RKE 模板用于定义 Kubernetes 和 Rancher 设置。节点模板负责配置节点。有关如何将 RKE 模板与硬件结合使用的参考，请参阅 [RKE 模板和硬件]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/rke-templates-and-hardware)。

可以从头开始创建 RKE 模板来预先定义集群配置。它们可以用于启动新集群，也可以从现有的 RKE 集群导出模板。

现有集群的设置可以[保存为 RKE 模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#converting-an-existing-cluster-to-use-an-rke-template)。这会创建一个新模板并将集群设置绑定到该模板。这样，集群只有在[模板更新]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#updating-a-template)的情况下才能[使用新版本的模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#upgrading-a-cluster-to-use-a-new-template-revision)进行升级。新模板也可以用来创建新集群。

## 示例场景

如果一个组织同时拥有普通和高级 Rancher 用户，管理员可能希望为高级用户提供更多用于集群创建的选项，并限制普通用户的选项。

这些[示例场景]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-scenarios)描述组织如何使用模板来标准化集群创建。

示例场景包括：

- **强制执行模板**：如果希望所有 Rancher 配置的新集群都具有某些设置，管理员可能想要[为每个用户强制执行一项或多项模板设置]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-scenarios/#enforcing-a-template-setting-for-everyone)。
- **与不同的用户共享不同的模板**：管理员可以为[普通用户和高级用户提供不同的模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-scenarios/#templates-for-basic-and-advanced-users)。这样，普通用户会有更多限制选项，而高级用户在创建集群时可以使用更多选项。
- **更新模板设置**：如果组织的安全和 DevOps 团队决定将最佳实践嵌入到新集群所需的设置中，这些最佳实践可能会随着时间而改变。如果最佳实践发生变化，[可以将模板更新为新版本]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-scenarios/#updating-templates-and-clusters-created-with-them)，这样，使用模板创建的集群可以[升级到模板的新版本]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#upgrading-a-cluster-to-use-a-new-template-revision)。
- **共享模板的所有权**：当模板所有者不再想要维护模板或想要共享模板的所有权时，此方案描述了如何[共享模板所有权]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-scenarios/#allowing-other-users-to-control-and-share-a-template)。

## 模板管理

创建 RKE 模板时，可以在 Rancher UI 中的**集群管理**下的 **RKE 模板**中使用模板。创建模板后，你将成为模板所有者，这将授予你修改和共享模板的权限。你可以与特定用户或组共享 RKE 模板，也可以公开模板。

管理员可以开启模板强制执行，要求用户在创建集群时始终使用 RKE 模板。这使管理员可以保证 Rancher 总是创建指定配置的集群。

RKE 模板更新通过修订系统处理。如果要更改或更新模板，请创建模板的新版本。然后，可以将使用旧版本模板创建的集群升级到新模板修订版。

在 RKE 模板中，模板所有者可以限制设置的内容，也可以打开设置以供最终用户选择值。它们的差别体现在，创建模板时，Rancher UI 中的每个设置上的**允许用户覆盖**标示。

对于无法覆盖的设置，最终用户将无法直接编辑它们。为了让用户使用这些设置的不同选项，RKE 模板所有者需要创建 RKE 模板的新版本，这将允许用户升级和更改该选项。

本节中的文件解释了 RKE 模板管理的细节：

- [获取创建模板的权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creator-permissions/)
- [创建和修改模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/)
- [强制执行模板设置](./enforcement/#requiring-new-clusters-to-use-an-rke-template)
- [覆盖模板设置]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/overrides/)
- [与集群创建者共享模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing/#sharing-templates-with-specific-users-or-groups)
- [共享模板的所有权]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing/#sharing-ownership-of-templates)

你可以参见此[模板的示例 YAML 文件]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-yaml)作为参考。

## 应用模板

你可以使用你自己创建的模板来[创建集群]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#creating-a-cluster-from-an-rke-template)，也可以使用[与你共享的模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing)来创建集群。

如果 RKE 模板所有者创建了模板的新版本，你可以[将你的集群升级到该版本]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#updating-a-cluster-created-with-an-rke-template)。

可以从头开始创建 RKE 模板来预先定义集群配置。它们可以用于启动新集群，也可以从现有的 RKE 集群导出模板。

你可以[将现有集群的配置保存为 RKE 模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#converting-an-existing-cluster-to-use-an-rke-template)。这样，只有模板更新后才能更改集群的设置。

## 标准化硬件

RKE 模板的目的是标准化 Kubernetes 和 Rancher 设置。如果你还想标准化你的基础设施，一个选择是将 RKE 模板与[其他工具]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/rke-templates-and-hardware)一起使用。

另一种选择是使用包含节点池配置选项，但不强制执行配置的[集群模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/cluster-templates)。

## YAML 定制

如果将 RKE 模板定义为 YAML 文件，则可以修改此[示例 RKE 模板 YAML]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/example-yaml)。RKE 模板中的 YAML 使用了 Rancher 在创建 RKE 集群时使用的相同自定义设置。但由于 YAML 要在 Rancher 配置的集群中使用，因此需要将 RKE 模板自定义项嵌套在 YAML 中的 `rancher_kubernetes_engine_config` 参数下。

RKE 文档也提供[注释的]({{<baseurl>}}/rke/latest/en/example-yamls/) `cluster.yml` 文件供你参考。

有关可用选项的更多信息，请参阅[集群配置]({{<baseurl>}}/rke/latest/en/config-options/)上的 RKE 文档。

### 附加组件

RKE 模板配置文件的附加组件部分的工作方式与[集群配置文件的附加组件部分]({{<baseurl>}}/rke/latest/en/config-options/add-ons/)相同。

用户定义的附加组件指令允许你调用和下拉 Kubernetes 清单或将它们直接内联。如果这些 YAML 清单包括在 RKE 模板中，Rancher 将在集群中部署这些 YAML 文件。

你可以使用附加组件执行以下操作：

- 启动 Kubernetes 集群后，在集群上安装应用
- 在使用 Kubernetes Daemonset 部署的节点上安装插件
- 自动设置命名空间、服务账号或角色绑定

RKE 模板配置必须嵌套在 `rancher_kubernetes_engine_config` 参数中。要设置附加组件，在创建模板时单击**以 YAML 文件编辑**。然后使用 `addons` 指令添加清单，或使用 `addons_include` 指令设置哪些 YAML 文件可用于附加组件。有关自定义附加组件的更多信息，请参见[用户自定义附加组件文档]({{<baseurl>}}/rke/latest/en/config-options/add-ons/user-defined-add-ons/)。
