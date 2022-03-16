---
title: 示例场景
weight: 5
---

以下示例场景描述了组织如何使用模板来标准化集群创建。

- **强制执行模板**：如果希望所有 Rancher 配置的新集群都具有某些设置，管理员可能想要[为每个用户强制执行一项或多项模板设置](#强制执行模板设置)。
- **与不同的用户共享不同的模板**：管理员可以为[普通用户和高级用户提供不同的模板](#普通用户和高级用户模板)。这样，普通用户会有更多限制选项，而高级用户在创建集群时可以使用更多选项。
- **更新模板设置**：如果组织的安全和 DevOps 团队决定将最佳实践嵌入到新集群所需的设置中，这些最佳实践可能会随着时间而改变。如果最佳实践发生变化，[可以将模板更新为新版本](#更新模板和集群)。这样，使用模板创建的集群可以升级到模板的新版本。
- **共享模板的所有权**：当模板所有者不再想要维护模板或想要共享模板的所有权时，此方案描述了如何[授权模板所有权](#允许其他用户控制和共享模板)。

## 强制执行模板设置

假设一个组织的管理员决定用 Kubernetes 版本 1.14 创建所有新集群：

1. 首先，管理员创建一个模板，将 Kubernetes 版本指定为 1.14，并将所有其他设置标记为**允许用户覆盖**。
1. 管理员将模板公开。
1. 管理员打开模板强制功能。

**结果**：

- 组织中的所有 Rancher 用户都可以访问该模板。
- [普通用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)使用此模板创建的所有新集群都将使用 Kubernetes 1.14，它们无法使用其它 Kubernetes 版本。默认情况下，普通用户没有创建模板的权限。因此，除非与他们共享更多模板，否则此模板将是普通用户唯一可以使用的模板。
- 所有普通用户都必须使用集群模板来创建新集群。他们无法在不使用模板的情况下创建集群。

通过这种方式，管理员在整个组织中强制执行 Kubernetes 版本，同时仍然允许最终用户配置其他所有内容。

## 普通用户和高级用户模板

假设一个组织有普通用户和高级用户。管理员希望普通用户必须使用模板，而高级用户和管理员可以根据自己的需要创建集群。

1. 首先，管理员开启 [RKE 模板强制执行]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/enforcement/#requiring-new-clusters-to-use-an-rke-template)。这意味着 Rancher 中的每个[普通用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)在创建集群时都需要使用 RKE 模板。
1. 然后管理员创建两个模板：

- 一个普通用户模板，该模板除了访问密钥外，几乎指定了所有选项
- 一个高级用户模板，该模板具有大部分或所有已启用**允许用户覆盖**的选项

1. 管理员仅与高级用户共享高级模板。
1. 管理员将普通用户的模板公开，因此在 Rancher 中创建的 RKE 集群的每个人都能选择限制性更强的模板。

**结果**：除管理员外，所有 Rancher 用户在创建集群时都需要使用模板。每个人都可以访问限制模板，但只有高级用户有权使用更宽松的模板。普通用户会受到更多限制，而高级用户在配置 Kubernetes 集群时有更多选择。

## 更新模板和集群

假设一个组织有一个模板，该模板要求集群使用 Kubernetes v1.14。然而，随着时间的推移，管理员改变了主意。管理员现在希望用户能够升级集群，以使用更新版本的 Kubernetes。

在这个组织中，许多集群是用一个需要 Kubernetes v1.14 的模板创建的。由于模板不允许重写该设置，因此创建集群的用户无法直接编辑该设置。

模板所有者可以有以下几个选项，来允许集群创建者在集群上升级 Kubernetes：

- **在模板上指定 Kubernetes v1.15**：模板所有者可以创建指定 Kubernetes v1.15 的新模板修订版。然后使用该模板的每个集群的所有者可以将集群升级到模板的新版本。此模板升级允许集群创建者在集群上将 Kubernetes 升级到 v1.15。
- **允许在模板上使用任何 Kubernetes 版本**：创建模板修订时，模板所有者还可以使用 Rancher UI 上该设置附近的开关，将 Kubernetes 版本标记为**允许用户覆盖**。该设置允许升级到此模板版本的集群使用任意 Kubernetes 的版本。
- **允许在模板上使用最新的 Kubernetes 次要版本**：模板所有者还可以创建一个模板修订版，其中 Kubernetes 版本被定义为 **Latest v1.14（允许补丁版本升级）**。这意味着使用该版本的集群将能够进行补丁版本升级，但不支持主要版本升级。

## 允许其他用户控制和共享模板

假设 Alice 是 Rancher 管理员。她拥有一个 RKE 模板，该模板反映了她的组织为创建集群而商定的最佳实践。

Bob 是一位高级用户，可以就集群配置做出明智的决策。随着最佳实践随着时间的推移不断更新，Alice 相信 Bob 会为她的模板创建新的修订。因此，她决定让 Bob 成为模板的所有者。

为了与 Bob 共享模板的所有权，Alice [将 Bob 添加为模板的所有者]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing/#sharing-ownership-of-templates)。

结果是，作为模板所有者，Bob 负责该模板的版本控制。Bob 现在可以执行以下所有操作：

- 当最佳实践发生变化时[修改模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#updating-a-template)
- [禁用模板的过时修订]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#disabling-a-template-revision)，以禁止使用该模板来创建集群
- 如果组织想要改变方向，则[删除整个模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#deleting-a-template)
- [将某个版本设置为默认值]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#setting-a-template-revision-as-default)，用于用户创建集群。模板的最终用户仍然可以选择他们想要使用哪个版本来创建集群。
- [与特定用户共享模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing)，让所有 Rancher 用户都可以使用该模板，或与其他用户共享该模板的所有权。
