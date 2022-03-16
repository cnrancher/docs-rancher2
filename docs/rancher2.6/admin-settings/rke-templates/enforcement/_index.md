---
title: 强制使用模板
weight: 32
---

本节介绍模板管理员如何在 Rancher 中强制执行模板，从而限制用户在没有模板的情况下创建集群。

默认情况下，Rancher 中的任何普通用户都可以创建集群。但当开启强制使用 RKE 模板时，有以下约束：

- 只有管理员才能在没有模板的情况下创建集群。
- 所有普通用户必须使用 RKE 模板来创建新集群。
- 普通用户在不使用模板的情况下无法创建集群。

只有管理员[授予权限]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creator-permissions/_index#允许用户创建模板)后，用户才能创建新模板。

使用 RKE 模板创建集群后，集群创建者无法编辑模板中定义的设置。创建集群后更改这些设置的唯一方法是[将集群升级到相同模板的新修订版]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#updating-a-cluster-created-with-an-rke-template)。如果集群创建者想要更改模板定义的设置，他们需要联系模板所有者以获取模板的新版本。有关模板修订如何工作的详细信息，请参阅[修订模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#updating-a-template)。

## 强制新集群使用 RKE 模板

要求用户创建新集群时使用模板，可以确保[普通用户]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)启动的任何集群都使用经过管理员审核的 Kubernetes 和 Rancher 设置。

管理员可以通过以下步骤启用 RKE 模板强制，从而要求用户必须使用模板创建集群：

1. 单击 **☰ > 全局设置**。
1. 转到 `cluster-template-enforcement` 设置。单击 **⋮ > 编辑设置**。
1. 将值设置为 **True** 并单击**保存**。

   > **重要提示**：如果管理员将 `cluster-template-enforcement` 设置为 <b>True</b>，还需要与用户共享`clusterTemplates`，以便用户可以选择其中一个模板来创建集群。

**结果**：除非创建者是管理员，否则 Rancher 配置的所有集群都必须使用模板。

## 禁用 RKE 模板强制

管理员可以通过以下步骤关闭 RKE 模板强制，从而允许用户在没有 RKE 模板的情况下创建新集群：

1. 单击 **☰ > 全局设置**。
1. 转到 `cluster-template-enforcement` 设置。单击 **⋮ > 编辑设置**。
1. 将值设置为 **False** 并单击**保存**。

**结果**：在 Rancher 中创建集群时，用户不需要使用模板。
