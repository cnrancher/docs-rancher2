---
title: 在 vSphere 中配置 Kubernetes 集群
weight: 1
---

在本节中，你将学习如何使用 Rancher 在 vSphere 中安装 [RKE]({{<baseurl>}}/rke/latest/en/) Kubernetes 集群。

首先，在 Rancher 中设置你的 vSphere 云凭证。然后，使用云凭证创建一个节点模板，Rancher 将使用该模板在 vSphere 中配置节点。

然后，在 Rancher 中创建一个 vSphere 集群，并在配置新集群时为集群定义节点池。每个节点池都有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 会在新节点上安装 RKE Kubernetes，并为每个节点设置节点池定义的 Kubernetes 角色。

有关配置 vSphere 节点模板的详细信息，请参阅 [vSphere 节点模板配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/vsphere-node-template-config/)。

有关在 Rancher 中配置 RKE Kubernetes 集群的详细信息，请参阅[集群配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options)。

- [vSphere 中的准备工作](#preparation-in-vsphere)
- [创建 vSphere 集群](#creating-a-vsphere-cluster)

## vSphere 中的准备工作

本节介绍设置 vSphere 的要求，以便 Rancher 可以配置虚拟机和集群。

节点模板已使用 vSphere Web Services API 6.5 版本进行记录和测试。

### 在 vSphere 中创建凭证

在继续创建集群之前，确保你的 vSphere 用户拥有足够的权限。设置节点模板时，模板将需要使用这些 vSphere 凭证。

有关如何在 vSphere 中创建具有所需权限的用户的说明，请参阅此[操作指南]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/creating-credentials)。这些步骤会产生需要向 Rancher 提供的用户名和密码，从而允许 Rancher 在 vSphere 中配置资源。

### 网络权限

必须确保运行 Rancher Server 的主机能够建立以下网络连接：

- 连接到 vCenter Server 上的 vSphere API（通常是端口 443/TCP）。
- 连接到用于实例化集群虚拟机的所有 ESXi 主机上的 Host API（端口 443/TCP）（_仅在使用 ISO 创建模式时需要_）。
- 连接到创建的 VM 上的 22/TCP 和 2376/TCP 端口。

有关在基础设施提供商上创建节点的端口要求，请参阅[节点网络要求]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/node-requirements/#networking-requirements)。

### 用于 vSphere API 访问的有效 ESXi 许可证

免费的 ESXi 许可证不支持 API 访问。vSphere Server 必须具有有效或评估的 ESXi 许可证。

### 具有 DRS 的集群的 VM-VM 关联规则

如果你的集群启用了 DRS，建议设置 [VM-VM 关联规则](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.resmgmt.doc/GUID-7297C302-378F-4AF2-9BD6-6EDB1E0A850A.html)。这些规则允许分配了 etcd 和 control-plane 角色的虚拟机在分配给不同节点池时，在单独的 ESXi 主机上运行。这种做法可确保单个物理机的故障不会影响这些平面的可用性。

## 创建 vSphere 集群

在 Rancher 中创建 vSphere 集群的操作取决于 Rancher 的版本。

1. [创建云凭证](#1-create-your-cloud-credentials)
2. [使用云凭证创建节点模板](#2-create-a-node-template-with-your-cloud-credentials)
3. [使用节点模板创建具有节点池的集群](#3-create-a-cluster-with-node-pools-using-the-node-template)

### 1. 创建云凭证

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 单击**创建**。
1. 单击 **VMware vSphere**。
1. 输入你的 vSphere 凭证。如需帮助，请参见[节点模板配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/vsphere-node-template-config/)中的**账号访问**。
1. 单击**创建**。

**结果**：已创建用于在集群中配置节点的云凭证。你可以在其他节点模板或集群中复用这些凭证。

### 2. 使用云凭证创建节点模板

为 vSphere 创建[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)会允许 Rancher 在 vSphere 中配置新节点。其他集群可以复用节点模板。

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 单击**创建**。
1. 单击**添加模板**。
1. 单击 **vSphere**。
1. 填写 vSphere 的节点模板。有关填写表格的帮助，请参阅 vSphere 节点模板[配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/vsphere-node-template-config/)。
1. 单击**创建**。

### 3. 使用节点模板创建具有节点池的集群

使用 Rancher 在 vSphere 中创建 Kubernetes 集群。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击 **VMware vSphere**。
1. 输入**集群名称**并使用你的 vSphere 云凭证。点击**继续**。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 使用**集群选项**选择要安装的 Kubernetes 版本、要使用的网络提供商，以及是否启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。如需获取配置集群的帮助，请参阅 [RKE 集群配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options)。
1. 如果你想稍后动态配置持久存储或其他基础设施，你需要修改集群 YAML 文件来启用 vSphere 云提供商。详情请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere)。
1. 将一个或多个节点池添加到你的集群。每个节点池都使用节点模板来配置新节点。有关节点池的更多信息，包括为节点分配 Kubernetes 角色的最佳实践，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-pools)。
1. 检查并确认你的选项。然后单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

## 可选的后续步骤

创建集群后，你可以通过 Rancher UI 访问集群。最佳实践建议你设置以下访问集群的备用方式：

- **通过 kubectl CLI 访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#accessing-clusters-with-kubectl-on-your-workstation)在你的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会让你连接到下游集群。此方法允许你在没有 Rancher UI 的情况下管理集群。
- **通过 kubectl CLI 使用授权的集群端点访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#authenticating-directly-with-a-downstream-cluster)直接使用 kubectl 访问集群，而无需通过 Rancher 进行身份验证。我们建议设置此替代方法来访问集群，以便在无法连接到 Rancher 时访问集群。
- **配置存储**：有关如何使用 Rancher 在 vSphere 中配置存储的示例，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/examples/vsphere)。要在 vSphere 中动态配置存储，你必须[启用]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/vsphere) vSphere 云提供商。
