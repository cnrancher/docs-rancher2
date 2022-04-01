---
title: 创建 DigitalOcean 集群
shortTitle: DigitalOcean
weight: 2215
---

在本节中，你将学习如何使用 Rancher 在 DigitalOcean 中安装 [RKE](https://rancher.com/docs/rke/latest/en/) Kubernetes 集群。

首先，在 Rancher 中设置你的 DigitalOcean 云凭证。然后，使用云凭证创建一个节点模板，Rancher 将使用该模板在 DigitalOcean 中配置新节点。

然后，在 Rancher 中创建一个 DigitalOcean 集群，并在配置新集群时为集群定义节点池。每个节点池都有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 会在新节点上安装 RKE Kubernetes，并为每个节点设置节点池定义的 Kubernetes 角色。

1. [创建云凭证](#1-create-your-cloud-credentials)
2. [使用云凭证创建节点模板](#2-create-a-node-template-with-your-cloud-credentials)
3. [使用节点模板创建具有节点池的集群](#3-create-a-cluster-with-node-pools-using-the-node-template)

### 1. 创建云凭证

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 单击**创建**。
1. 单击 **DigitalOcean**。
1. 输入你的 Digital Ocean 凭证。
1. 单击**创建**。

**结果**：已创建用于在集群中配置节点的云凭证。你可以在其他节点模板或集群中复用这些凭证。

### 2. 使用云凭证创建节点模板

为 DigitalOcean 创建[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates) 会允许 Rancher 在 DigitalOcean 中配置新节点。其他集群可以复用节点模板。

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 单击**添加模板**。
1. 单击 **DigitalOcean**。
1. 填写 DigitalOcean 的节点模板。有关填写表单的帮助，请参阅 [DigitalOcean 节点模板配置](./do-node-template-config)。

### 3. 使用节点模板创建具有节点池的集群

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击 **DigitalOcean**。
1. 输入**集群名称**。
1. 将一个或多个节点池添加到你的集群。将一个或多个节点池添加到你的集群。每个节点池都使用节点模板来配置新节点。有关节点池的更多信息，包括为节点分配 Kubernetes 角色的最佳实践，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)。
1. 在**集群配置**中，选择要安装的 Kubernetes 版本、要使用的网络提供商，以及是否启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。如需获取配置集群的帮助，请参阅 [RKE 集群配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options)。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

# 可选的后续步骤

创建集群后，你可以通过 Rancher UI 访问集群。最佳实践建议你设置以下访问集群的备用方式：

- **通过 kubectl CLI 访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#accessing-clusters-with-kubectl-on-your-workstation)在你的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会让你连接到下游集群。此方法允许你在没有 Rancher UI 的情况下管理集群。
- **通过 kubectl CLI 使用授权的集群端点访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#authenticating-directly-with-a-downstream-cluster)直接使用 kubectl 访问集群，而无需通过 Rancher 进行身份验证。我们建议设置此替代方法来访问集群，以便在无法连接到 Rancher 时访问集群。
