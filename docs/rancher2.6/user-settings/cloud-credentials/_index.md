---
title: 管理云凭证
weight: 7011
---

如果要创建[由基础设施提供商托管]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)的集群，则可以使用[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)来配置集群节点。这些模板使用 Docker Machine 配置选项来定义节点的操作系统镜像以及设置/参数。

节点模板可以使用云凭证来访问在基础设施提供商中配置节点所需的凭证信息。多个节点模板可以使用相同的云凭证。云凭证省去了为同一云提供商重新输入访问密钥的麻烦。云凭证存储在 Kubernetes 密文中。

只有存在标记为 `password` 的字段时，节点模板才会使用云凭证。默认的 `active` 主机驱动将其帐户访问字段标记为 `password`，但可能有一些 `inactive` 主机驱动没有使用它们。这些主机驱动不会使用云凭证。

你可以在两种情况下创建云凭证：

- [在为集群创建节点模板期间]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)。
- 在**用户设置**中。

所有云凭证都绑定到创建者的用户配置文件。**不能**与其他用户共享。

## 使用用户设置创建云凭证

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 单击**创建**。
1. 单击云凭证类型。下拉列表中的选项取决于 Rancher 中的 `active` [主机驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/node-drivers/)。
1. 输入云凭证的名称。
1. 根据所选的云凭证类型输入所需的值，从而向基础设施提供商进行身份验证。
1. 单击**创建**。

**结果**：已创建云凭证，它可以立即用于[创建节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)。

## 更新云凭证

如果访问凭证更改或泄露了，你可以通过更新云凭证来进行轮换，同时保留相同的节点模板。

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 选择要编辑的云凭证，然后单击 **⋮ > 编辑配置**。
1. 更新凭证信息并单击**保存**。

**结果**：已使用新的访问凭证更新云凭证。[添加新节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)时，所有使用此云凭证的现有节点模板都会自动使用更新的信息。

## 删除云凭证

如果要删除云凭证，云凭证不能有关联的节点模板。如果你无法删除云凭证，请[删除与该云凭证关联的所有节点模板]({{<baseurl>}}/rancher/v2.6/en/user-settings/node-templates/#deleting-a-node-template)。

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 你可以删除单个云凭证或进行批量删除。

   - 要单独删除一个云凭证，请选择你要编辑的云凭证，然后单击 **⋮ > 删除**。
   - 要批量删除云凭证，请从列表中选择一个或多个云凭证。单击**删除**。
1. 确认你需要删除这些云凭证。
