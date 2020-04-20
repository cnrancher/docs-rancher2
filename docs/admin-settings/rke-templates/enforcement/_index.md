---
title: 强制使用模板
description: 本节介绍管理员如何在 Rancher 中强制使用模板，从而限制用户在没有模板的情况下创建集群的能力。默认情况下，Rancher 中的任何标准用户都可以创建集群。但当开启 RKE 模板强制时，只有管理员才能在没有模板的情况下创建集群；所有标准用户必须使用 RKE 模板创建新集群；标准用户不能在不使用模板的情况下创建集群。
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
  - 系统管理员指南
  - RKE模板
  - 强制使用模板
---

本节介绍管理员如何在 Rancher 中强制使用模板，从而限制用户在没有模板的情况下创建集群的能力。

默认情况下，Rancher 中的任何标准用户都可以创建集群。但当开启 RKE 模板强制时，

- 只有管理员才能在没有模板的情况下创建集群。
- 所有标准用户必须使用 RKE 模板创建新集群。
- 标准用户不能在不使用模板的情况下创建集群。

用户只能在管理员[授予其权限](/docs/admin-settings/rke-templates/creator-permissions/_index)的情况下创建新模板。

使用 RKE 模板创建集群后，集群创建者无法编辑模板中定义的设置。创建集群后更改这些设置的唯一方法是[将集群升级到相同模板的新版本](/docs/admin-settings/rke-templates/applying-templates/_index)。如果集群创建者想要更改模板定义的设置，他们需要联系模板所有者以获取模板的新版本。有关模板修订工作方式的详细信息，请参阅[修订模板文档](/docs/admin-settings/rke-templates/creating-and-revising/_index)。

## 要求新集群使用 RKE 模板

您可能希望要求新集群使用模板，以确保[标准用户](/docs/admin-settings/rbac/global-permissions/_index)启动的任何集群都将使用经过管理员审核的 Kubernetes 和/或 Rancher 设置。

要要求新集群使用 RKE 模板，管理员可以通过以下步骤启用 RKE 模板强制：

1. 在**全局**视图中，单击**设置**选项卡。
1. 转到`cluster-template-enforcement`设置。单击垂直**省略号(…)**并单击**编辑**。
1. 将该值设置为**true**，然后单击**保存**。

**结果：** Rancher 设置的所有集群都必须使用模板，除非创建者是系统管理员。

## 禁用 RKE 模板强制

要允许在没有 RKE 模板的情况下创建新集群，管理员可以通过以下步骤关闭 RKE 模板强制:

1. 在**全局**视图中，单击**设置**选项卡。
1. 转到`cluster-template-enforcement`设置。单击垂直**省略号(…)**并单击**编辑**。
1. 将该值设置为**false**，并单击**保存**。

**结果：** 当在 Rancher 中创建集群时，用户不需要使用模板。
