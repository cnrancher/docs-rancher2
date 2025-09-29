---
title: v2.3.3
---

## Account Access

| 参数   | 是否必填 | 描述                                                                                                     |
| :----- | :------: | :------------------------------------------------------------------------------------------------------- |
| 云凭证 |    是    | 您的 vSphere 帐户访问信息，存储在 [云凭证](/docs/rancher2.5/user-settings/cloud-credentials/) 中。 |

Your cloud credential has these fields:

| 凭证参数               | 描述                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| vCenter or ESXi Server | 输入 vCenter 或 ESXi 主机名称/IP。ESXi 是您创建和运行虚拟机和虚拟设备的虚拟化平台。vCenter Server 是您管理连接在网络中的多台主机并汇集主机资源的服务。 |
| Port                   | 可选：配置 vCenter 或 ESXi 服务器的端口。                                                                                                              |
| Username and password  | 输入您的 vSphere 登录用户名和密码。                                                                                                                    |

## 调度

选择虚拟机将被调度到哪个管理程序。

在 **Scheduling** 部分中的字段应自动填充您在 vSphere 中可用的数据中心和其他调度选项。

| 参数          | 是否必填 | 描述                                                                                                                                                        |
| :------------ | -------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data Center   | 是       | 要在其中创建虚拟机的数据中心的名称/路径。                                                                                                                   |
| Resource Pool |          | 要调度虚拟机的资源池的名称/路径。如果未指定，则使用默认资源池。                                                                                             |
| Host          |          | 要调度虚拟机的主机系统的 IP。对于独立的 ESXi 或使用 DRS（分布式资源调度器）的集群，请将此字段留空。如果指定，将使用主机系统的资源池，并忽略**资源池**参数。 |
| Network       | 是       | 要将虚拟机连接到的虚拟机网络的名称。                                                                                                                        |
| Data Store    | 是       | 如果您有数据存储集群，您可以切换**数据存储**字段。这可让您选择虚拟机将被排程到的数据存储集群。如果未切换该字段，您可以选择单个磁盘。                        |
| Folder        |          | 数据中心中要创建虚拟机的文件夹的名称。必须已经存在。文件夹名称应在 vSphere 配置文件中以`vm/`开头。                                                          |

## Instance Options

在**Instance Options**部分，为该模板创建的虚拟机配置 vCPU 数量、内存和磁盘大小。

| 参数                                        | 是否必填 | 描述                                                                                                                                                                                                            |
| :------------------------------------------ | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPUs                                        |    是    | 分配给虚拟机的 CPU 数量                                                                                                                                                                                         |
| Memory                                      |    是    | 分配给虚拟机的内存                                                                                                                                                                                              |
| Disk                                        |    是    | 虚拟机挂载的磁盘大小                                                                                                                                                                                            |
| Creation method                             |    是    | 在节点上设置操作系统的方法。操作系统可以从 ISO 或从虚拟机模板安装。根据创建方法，您还必须指定 VM 模板、内容库、现有 VM 或 ISO。有关创建方法的更多信息，请参阅[关于虚拟机创建方法](#about-vm-creation-methods)。 |
| Cloud Init                                  |          | `cloud-config.yml`文件或 URL 的 RL，用于提供虚拟机。该文件允许进一步定制操作系统，如网络配置、DNS 服务器或系统守护程序。操作系统必须支持`cloud-init`。                                                          |
| Networks                                    |          | 要将虚拟机连接到的网络的名称。                                                                                                                                                                                  |
| Configuration Parameters used for guestinfo |          | 虚拟机的其他配置参数。这些参数对应于 vSphere 控制台中的 [Advanced Settings](https://kb.vmware.com/s/article/1016098)。示例用例包括提供 RancherOS guestinfo 参数或为虚拟机启用磁盘 UUID(`disk.EnableUID=TRUE`)。 |

### 创建虚拟机的方式

在 **Creation method** 字段中，配置用于在 vSphere 中配置虚拟机的方法。可用的选项包括创建从 RancherOS ISO 引导的虚拟机，或通过从现有虚拟机或 [虚拟机模板](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-F7BF0E6B-7C4F-4E46-8BBF-76229AEA7220.html) 克隆创建虚拟机。

现有的虚拟机或模板可以使用任何现代 Linux 操作系统，这些操作系统使用 [NoCloud 数据源](https://cloudinit.readthedocs.io/en/latest/topics/datasources/nocloud.html)配置了对 [cloud-init](https://cloudinit.readthedocs.io/en/latest/)的支持。

选择创建虚拟机的方式。

- **从 Data Center 模板部署**：选择您选择的数据中心中存在的虚拟机模板。
- **从 Content Library 模板部署**首先，选择包含您的模板的[内容库](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-254B2CE8-20A8-43F0-90E8-3F6776C2C896.html)，然后从弹出的列表中选择模板**库模板**。
- **克隆一个现有的虚拟机：**在**Virtual machine**字段中，选择一个现有的虚拟机，新的虚拟机将从该虚拟机中克隆出来。
- **从 boot2docker ISO 安装**：确保 **OS ISO URL**字段包含 RancherOS 的 VMware ISO 版本的 URL (`rancheros-vmware.iso`)。请注意，此 URL 必须可以从运行 Rancher 服务器安装的节点访问。

## 网络

节点模板现在允许用多个网络配置虚拟机。在 **Networks** 字段中，现在可以单击 **Add Network** 来添加 vSphere 中可用的任何网络。

## 节点标签和自定义属性

这些属性允许您将元数据附加到 vSphere 清单中的对象，以便于对这些对象进行排序和搜索。

您可以执行以下操作：

- 为虚拟机提供一组配置参数（实例选项）。
- 为虚拟机分配标签，这些标签可用作集群中调度规则的基础。
- 在将要创建的虚拟机上自定义 Docker 守护进程的配置。

:::note 说明
自定义属性是 vSphere 中的一项功能，虽然在当前的 vSphere 版本中可用，但是不排除 vSphere 在后续版本中删除此功能的可能性。
:::
[Cloud-init](https://cloudinit.readthedocs.io/en/latest/)允许您通过在第一次启动时应用配置来初始化您的节点。这可能涉及创建用户、授权 SSH 密钥或设置网络等事项。

您可以在 **Cloud Init** 字段中指定 RancherOS cloud-config.yaml 文件的 URL。有关支持的配置指令的详细信息，请参考 [RancherOS 文档](https://rancher.com/docs/os/v1.x/en/configuration/#cloud-config)。请注意，该 URL 必须可以从模板创建的虚拟机进行网络访问。
