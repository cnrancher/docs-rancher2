---
title: 创建集群
description: 本节说明了如何在 Rancher 中配置 vSphere 凭证，在 vSphere 中创建节点以及在这些节点上启动 Kubernetes 集群。
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
  - 创建集群
  - 创建节点和集群
  - vSphere
  - 创建集群
---

本节说明了如何在 Rancher 中配置 vSphere 凭证，在 vSphere 中创建节点以及在这些节点上启动 Kubernetes 集群。

## 先决条件

本节介绍了使用 vSphere 在 Rancher 中创建节点和集群需要的必要条件。

该节点模板的文档使用 vSphere Web Services API 6.5 版本中进行了测试。

### 在 vSphere 中创建凭证

在继续创建集群之前，必须确保您拥有具有足够权限的 vSphere 用户。当您设置节点模板时，该模板将需要使用这些 vSphere 凭证。

有关如何在 vSphere 中创建具有所需权限的用户，请参考此[使用指南](/docs/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/creating-credentials/_index)。通过这些步骤您将创建出需要提供给 Rancher 的用户名和密码，从而允许 Rancher 在 vSphere 中创建资源。

### 网络权限

必须确保运行 Rancher 的节点能够建立以下网络连接：

- 能够访问 vCenter 服务中的 vSphere API（通常使用端口： 443/TCP）。
- 能够访问位于实例化虚拟机的所有 ESXi 节点上的 Host API（端口 443/TCP）(_仅在使用 ISO 创建节点时需要_)。
- 能够访问虚拟机的端口 22/TCP 和 2376/TCP

请参照[节点网络需求](/docs/cluster-provisioning/node-requirements/_index)来获取详细的端口需求。

### 适用于 vSphere API 访问的有效 ESXi 许可证

免费的 ESXi 许可证不支持 API 访问。vSphere 服务器必须具有效或评估的 ESXi 许可证。

## 使用 vSphere 创建集群

本节介绍了如何使用 Rancher UI 设置 vSphere 凭证，节点模板和 vSphere 集群。

### 配置参考

详细的节点模板配置，请参照[节点模板配置参考](/docs/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/node-template-reference/_index)。

Rancher 使用 RKE 来创建 Kubernetes 集群。详细的 vSphere 中集群配置，请参照[RKE 文档中的集群配置参考](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/vsphere/config-reference/)。

请注意，必须[启用](#为集群启用-vsphere-cloud-provider) vSphere Cloud Provider 才能够动态配置数据卷。

### 使用 vSphere 凭证创建节点模板

为了创建集群，您至少创建一个 vSphere[节点模板](/docs/cluster-provisioning/rke-clusters/node-pools/_index) 来配置如何在 vSphere 创建虚拟机。创建并保存的节点模板可在创建其他 vSphere 集群时重复使用它。

为了创建节点模板,

1. 在 Rancher UI 中登录。

1. 在右上角的用户设定菜单中，选择**节点模板**。

1. 点击**添加模板**，然后点击**vSphere**图标。

#### A. 配置 vSphere 凭证

根据您的 Rancher 版本，为集群配置 vSphere 凭证的步骤有所不同。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.2.0+', value: 'new', },
{ label: 'Rancher v2.2.0 之前的版本', value: 'old', },
]}>

<TabItem value="new">

您的账户访问信息保存在[云凭证](/docs/user-settings/cloud-credentials/_index)。云凭证会保存为 Kubernetes 密文。

您可以使用现有的云凭证或创建新的云凭证。要创建新的云凭证：

1. 点击**添加凭证**。
1. 在**名称**字段，输入 vSphere 凭证的名称。
1. 在**vCenter or ESXi 服务** 字段，输入 vCenter 或 ESXi 节点名/IP。ESXi 是用于创建和运行虚拟机和虚拟设备的虚拟化平台。vCenter Server 是一项服务，通过它可以管理网络中连接的多个节点池中的节点资源。
1. 可选：在**端口**字段，配置 vCenter 或 ESXi 服务的端口。
1. 在**用户名** 和 **密码** 字段，输入您 vSphere 的用户名和密码。
1. 点击**创建**。

**结果：** 节点模板成功添加了 vSphere 的云凭证。

</TabItem>

<TabItem value="old">

在 **账户访问** 选项中，输入 vCenter 的 FQDN 或 IP 地址和 vSphere 用户账户的凭证。

</TabItem>

</Tabs>

#### B. 配置节点调度

选择虚拟机将被调度到的虚拟机管理程序。配置选项取决于您的 Rancher 版本。

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.3.3+', value: 'new', },
{ label: 'Rancher v2.3.3 之前的版本', value: 'old', },
]}>

<TabItem value="new">

**调度**部分中的字段会自动显示为数据中心和 vSphere 中可用的选项。

1. 在**数据中心**选项中，选择哪个数据中心用于虚拟机调度。
1. **资源池**（可选）：选择**资源池**。资源池可用于对独立节点或集群中的 CPU 和内存资源进行分区，也可以嵌套。
1. **数据存储**：如果您有数据存储集群，则可以切换它。这样，您可以选择将 VM 调度到哪个数据存储集群。如果选择该选项，则可以选择单个磁盘。
1. **Folder** 可选：选择要放置虚拟机的文件夹。此下拉菜单中的 VM 文件夹直接与 vSphere 中的 VM 文件夹相对应。注意：文件夹名称在 vSphere 配置文件中应该以`vm/`开头。
1. **主机**（可选）：选择一个特定的节点用于创建 VM。对于独立 ESXi 或具有 DRS（分布式资源调度程序）的集群，请将此字段设置为空。如果指定了该字段，将使用节点系统的池，并且**资源池**参数将被忽略。

</TabItem>

<TabItem value="old">

在**调度**选项卡中，输入:

- 用于创建 VM 的**数据中心**的名称或路径。
- **虚拟机网络**的名称。
- 保存磁盘的**数据存储**名称或路径。

  ![image](/img/rancher/vsphere-node-template-2.png)

</TabItem>

</Tabs>

#### C. 配置实例和操作系统

根据 Rancher 版本的不同，可以使用不同的选项来配置实例。

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.3.3+', value: 'new', },
{ label: 'Rancher v2.3.3 之前的版本', value: 'old', },
]}>

<TabItem value="new">

在**实例选项**选项卡中，配置该节点模板创建节点的 CPU 数量，内存和磁盘大小。

在**创建方法**选项中，配置在 vSphere 中创建 VMs 的创建方法。可用选项包括通过 RancherOS ISO 创建 VMs 或通过一个已有的 VM 或[VM 模板](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-F7BF0E6B-7C4F-4E46-8BBF-76229AEA7220.html)克隆 VMs。

已有的 VM 或 VM 模板可以使用配置了[cloud-init](https://cloudinit.readthedocs.io/en/latest/)并使用[NoCloud datasource](https://cloudinit.readthedocs.io/en/latest/topics/datasources/nocloud.html)的任何现代 Linux 操作系统。

选择创建虚拟机的方式：

- **模板部署: Data Center：** 选择一个数据中心中的 VM 模板。
- **模板部署: Content Library：** 首先选择包含您的模板的 [Content Library](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-254B2CE8-20A8-43F0-90E8-3F6776C2C896.html)，然后在`Library 模板`选项中选择模板。
- **克隆一个现有的虚拟机：** 在**虚拟机**选项中，选择一个用于克隆的虚拟机。
- **从 boot2docker ISO 安装（弃用）：** 确保`操作系统ISO下载地址`选项填写正确的 VMware ISO 或 RancherOS (rancheros-vmware.iso)地址。请注意这个 URL 必须在 Rancher Server 的节点中能够访问。

</TabItem>

<TabItem value="old">

在**实例选项**选项卡中，配置该节点模板创建节点的 CPU 数量，内存和磁盘大小。

仅支持从 RancherOS ISO 创建 VM。

确保`操作系统ISO下载地址`选项填写正确的 VMware ISO 或 RancherOS (rancheros-vmware.iso)地址。

![image](/img/rancher/vsphere-node-template-1.png)

</TabItem>

</Tabs>

#### D. 添加网络

_从 Rancher v2.3.3 开始可用_

现在，节点模板允许 VM 配置多个网络。在**网络**字段中，您可以点击**添加网络**来添加任何 vSphere 中可用的网络。

#### E. 启用磁盘 UUIDs

为了使用 RKE 创建集群，必须为所有节点配置磁盘 UUIDs。

从 Rancher v2.0.4 开始，在 vSphere 节点模板中默认启用了磁盘 UUIDs。

如果您在使用 Rancher v2.0.4 之前的版本，请参照以下[说明](/docs/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/enabling-uuids/_index)以获取如何通过 Rancher 节点模板启用 UUID 的详细信息。

#### F. 可选：配置节点标签和自定义属性

将元数据附加到 VM 的方式因 Rancher 版本而异。

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.3.3+', value: 'new', },
{ label: 'Rancher v2.3.3 之前的版本', value: 'old', },
]}>

<TabItem value="new">

**可选：** 添加 vSphere 标签和自定义属性。标签使您可以将元数据附加到 vSphere 清单中的对象，以使排序和搜索这些对象更加容易。

对于标签，在您选择节点模版时，所有 vSphere 标签都会显示出来。

在自定义属性中，Rancher 将允许您选择已在 vSphere 中设置的所有自定义属性。自定义属性作为 keys，您可以为每个属性输入 value。

> **注意：** 自定义属性是一项 legacy 功能，最终将会从 vSphere 中删除。这些属性使您可以将元数据附加到 vSphere 清单中的对象，以使排序和搜索这些对象更加容易。

</TabItem>

<TabItem value="old">

**可选：**

- 为虚拟机提供一组配置参数（实例选项）。
- 为 VM 分配标签，这些标签可用作在集群中调度规则的依据。
- 自定义将要创建的 VM 中的 Docker 守护程序的配置。

> **注意：** 自定义属性是一项 legacy 功能，最终将会从 vSphere 中删除。这些属性使您可以将元数据附加到 vSphere 清单中的对象，以使排序和搜索这些对象更加容易。

</TabItem>

</Tabs>

#### G. 可选：配置 cloud-init

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/) 允许您在第一次启动时通过应用配置来初始化节点。这可能包括诸如创建用户，授权 SSH 密钥或设置网络等事情。

VM 的 cloud-init 支持范围取决于 Rancher 的版本。

<Tabs
defaultValue="new"
values={[
{ label: 'Rancher v2.3.3+', value: 'new', },
{ label: 'Rancher v2.3.3 之前的版本', value: 'old', },
]}>

<TabItem value="new">

要使用 cloud-init 初始化，请使用有效的 YAML 语法创建一个配置文件，然后将文件内容粘贴到**Cloud Init**字段中。请参照[cloud-init 文档。](https://cloudinit.readthedocs.io/en/latest/topics/examples.html)以获取 cloud config 配置示例。

_注意，通过 ISO 创建 VM 时不支持使用 cloud-init 选项_

</TabItem>

<TabItem value="old">

您可以在**Cloud Init**字段中指定 RancherOS cloud-config.yaml 文件的 URL。有关受支持的配置的详细信息，请参考[RancherOS 文档](https://rancher.com/docs/os/v1.x/en/installation/configuration/#cloud-config)。请注意，创建的 VM 中必须可以访问该 URL。

</TabItem>

</Tabs>

#### H. 保存节点模板

为此模板分配一个描述性的**名称**，然后点击**创建**。

#### 节点模板配置参考

适用于 vSphere 节点模板的配置选项的参考，请参考[本节](/docs/cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/node-template-reference/_index)。

### 使用节点模板创建 Kubernetes 集群

创建模板后，可以使用它启动 vSphere 集群。

如果要在 vSphere 节点上安装的 Kubernetes 中使用一些高级功能，您需要通过修改集群 YAML 文件来启用 vSphere Cloud Provider。此项既适用于预先创建的[自定义节点](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)，也适用于使用 vSphere 节点驱动程序在 Rancher 中创建的节点。

要创建集群，请执行以下步骤：

#### A. 设置集群名称和成员角色

1. 以管理员身份登录到 Rancher UI。
2. 进入到**全局**中的**集群列表**页面。
3. 点击**添加集群** 选择 **vSphere** 基础设施供应商。
4. 填写 **集群名称**。
5. 指定需要的**成员角色**

   通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

> **注意：**
>
> 如果您的集群启用了 DRS，推荐设置[VM-VM 关联性规则](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.resmgmt.doc/GUID-7297C302-378F-4AF2-9BD6-6EDB1E0A850A.html)。这些规则使分配了 etcd 和控制平面角色的 VM 在分配给不同的节点池时可以在单独的 ESXi 节点上运行。这种做法可确保单个物理机的故障不会影响这些平面的可用性。

#### B. 配置 Kubernetes 选项

使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。

#### C. 为集群添加节点池

将一个或多个节点池添加到您的集群。

**节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

:::important 注意：

- 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
- 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。至少两个。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

:::

#### D. 可选：添加自我修复的节点池

要使节点池能够自我修复，请在**自动替换**列中输入一个大于零的数字。如果节点池在指定的分钟内处于非活动状态，Rancher 将使用该节点池使用的节点模板来重新创建该节点。

> **注意：** 自我修复节点池旨在帮助您为**无状态**应用程序替换工作节点。不建议在主节点或具有持久卷连接的节点的节点池上启用节点自动替换。当节点池中的节点失去与集群的连接时，其持久卷将被破坏，从而导致有状态应用程序丢失数据。

#### E. 创建集群

点击 **创建** 开始创建虚拟机和 Kubernetes 集群。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果存在）。

### 可选：配置 Cloud Provider 和并创建存储

有关如何使用 Rancher 在 vSphere 中创建存储的，请参照[vShpere 存储](/docs/cluster-admin/volumes-and-storage/examples/vsphere/_index)。

为了在 vSphere 中创建存储，必须启用 vSphere Cloud Provider。

#### 为集群启用 vSphere Cloud Provider

1. 设置 **Cloud Provider** 选项为`Custom`.

   ![vsphere-node-driver-cloudprovider](/img/rancher/vsphere-node-driver-cloudprovider.png)

1. 点击**编辑 YAML**
1. 将以下结构内容插入到预先配置的集群 YAML 中。从 Rancher v2.3+ 开始，此结构必须放在`rancher_kubernetes_engine_config`下。在 v2.3 之前的版本中，必须将其定义为顶级字段。注意，`name` *必须*设置为`vsphere`。

   ```yaml
   rancher_kubernetes_engine_config: # Required as of Rancher v2.3+
     cloud_provider:
       name: vsphere
       vsphereCloudProvider:
         # 在下面加入您的 provider 配置
   ```

   Rancher 使用 RKE（the Rancher Kubernetes Engine）来创建 Kubernetes 集群。请参照[RKE 文档中的 vSphere 配置参考](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/vsphere/config-reference/)以获取`vsphereCloudProvider`配置中属性的详细信息。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher 服务器的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。
