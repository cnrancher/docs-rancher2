---
title: 应用模板
weight: 50
---

你可以使用你自己创建的 RKE 模板来创建集群，也可以使用[与你共享的模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/template-access-and-sharing)来创建集群。

RKE 模板可以应用于新集群。

你可以[将现有集群的配置保存为 RKE 模板](#converting-an-existing-cluster-to-use-an-rke-template)。这样，只有模板更新后才能更改集群的设置。

你无法将集群更改为使用不同的 RKE 模板。你只能将集群更新为同一模板的新版本。

本节涵盖以下主题：

- [使用 RKE 模板创建集群](#creating-a-cluster-from-an-rke-template)
- [更新使用 RKE 模板创建的集群](#updating-a-cluster-created-with-an-rke-template)
- [将现有集群转换为使用 RKE 模板](#converting-an-existing-cluster-to-use-an-rke-template)

### 使用 RKE 模板创建集群

要使用 RKE 模板添加[由基础设施提供商托管]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters)的集群，请按照以下步骤操作：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**并选择基础设施提供商。
1. 设置集群名称和节点模板详情。
1. 要使用 RKE 模板，请在**集群选项**下，选中**使用现有 RKE 模板和修订版**复选框。
1. 从下拉菜单中选择 RKE 模板和修订版。
1. 可选：你可以编辑 RKE 模板所有者在创建模板时标记为**允许用户覆盖**的任何设置。如果你无法更改某些设置，则需要联系模板所有者以获取模板的新修订版。然后，你需要编辑集群来将其升级到新版本。
1. 单击**创建**以启动集群。

### 更新使用 RKE 模板创建的集群

模板所有者创建 RKE 模板时，每个设置在 Rancher UI 中都有一个开关，指示用户是否可以覆盖该设置。

- 如果某个设置允许用户覆盖，你可以通过[编辑集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/)来更新集群中的设置。
- 如果该开关处于关闭状态，则除非集群所有者创建了允许你覆盖这些设置的模板修订版，否则你无法更改这些设置。如果你无法更改某些设置，则需要联系模板所有者以获取模板的新修订版。

如果集群是使用 RKE 模板创建的，你可以编辑集群，来将集群更新为模板的新版本。

现有集群的设置可以[保存为 RKE 模板](#converting-an-existing-cluster-to-use-an-rke-template)。在这种情况下，你还可以编辑集群以将集群更新为模板的新版本。

> **注意**：你无法将集群更改为使用不同的 RKE 模板。你只能将集群更新为同一模板的新版本。

### 将现有集群转换为使用 RKE 模板

本节介绍如何使用现有集群创建 RKE 模板。

除非你将现有集群的设置保存为 RKE 模板，否则 RKE 模板不能应用于现有集群。这将把集群的设置导出为新的 RKE 模板，并且将集群绑定到该模板。然后，只有[更新了模板]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/creating-and-revising/#updating-a-template)并且集群升级到**使用更新版本的模板**时，集群才能改变。

要将现有集群转换为使用 RKE 模板：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要转换为使用 RKE 模板的集群。单击 **⋮ > 保存为 RKE 模板**。
1. 在出现的表单中输入模板的名称，然后单击**创建**。

**结果**：

- 创建了一个新的 RKE 模板。
- 将集群转换为使用该新模板。
- 可以[使用新模板创建新集群]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rke-templates/applying-templates/#creating-a-cluster-from-an-rke-template)。
