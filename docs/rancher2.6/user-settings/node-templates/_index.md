---
title: 管理节点模板
weight: 7010
---

如果要配置[由基础设施提供商托管]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)的集群，则可以使用[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)来配置集群节点。这些模板使用 Docker Machine 配置选项来定义节点的操作系统镜像以及设置/参数。你可以在两种情况下创建节点模板：

- [配置节点池集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)。
- 在任何时间使用[用户设置](#creating-a-node-template-from-user-settings)。

创建节点模板时，它会绑定到你的用户配置文件。节点模板不能在用户之间共享。你可以从用户设置中删除不再使用的旧节点模板。

## 创建节点模板

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 单击**添加模板**。
1. 选择一个可用的云提供商。然后按照屏幕上的说明配置模板。

**结果**：模板已配置。你可以稍后在[配置节点池集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)时使用该模板。

## 更新节点模板

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 选择要编辑的节点模板并单击 **⋮ > 编辑**。

    > **注意**：默认的 `active` [主机驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/node-drivers/) 和任何标记了 “password” 字段主机驱动都需要需要使用[云凭证]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#cloud-credentials)。

1. 编辑所需信息并单击**保存**。

**结果**：节点模板已更新。添加新节点时，使用此节点模板的所有节点池都会自动使用更新的信息。

## 克隆节点模板

通过用户设置创建新的节点模板时，可以克隆现有模板并快速更新其设置，而无需从头开始创建新的模板。克隆模板避免了为云提供商重新输入访问密钥的麻烦。

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 找到要克隆的模板。然后选择 **⋮ > 克隆**。
1. 填写表单的其余部分。

**结果**：已克隆和配置模板。你可以稍后在[配置节点池集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)时使用该模板。

## 删除节点模板

不再使用节点模板时，你可以将其从用户设置中删除。

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 从列表中选择一个或多个模板。然后点击**删除**。出现提示时确认删除。
