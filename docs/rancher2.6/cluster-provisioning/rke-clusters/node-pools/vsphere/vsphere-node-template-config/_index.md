---
title: vSphere 节点模板配置
weight: 2
---

- [账号访问](#account-access)
- [调度](#scheduling)
- [实例选项](#instance-options)
- [网络](#networks)
- [节点标签和自定义属性](#node-tags-and-custom-attributes)
- [cloud-init](#cloud-init)

## 账号访问

| 参数   | 是否必填 | 描述                                                                                                          |
| :----- | :------: | :------------------------------------------------------------------------------------------------------------ |
| 云凭证 |    \*    | 你的 vSphere 账号访问信息，存储在[云凭证]({{<baseurl>}}/rancher/v2.6/en/user-settings/cloud-credentials/)中。 |

你的云凭证具有以下字段：

| 凭证字段               | 描述                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vCenter 或 ESXi Server | 输入 vCenter 或 ESXi 主机名/IP。ESXi 是你创建和运行虚拟机和虚拟设备的虚拟化平台。你可以通过 vCenter Server 服务来管理网络中连接的多个主机并池化主机资源。 |
| 端口                   | 可选：配置 vCenter 或 ESXi Server 的端口。                                                                                                                |
| 用户名和密码           | 你的 vSphere 登录用户名和密码。                                                                                                                           |

## 调度

选择虚拟机将被调度到哪个管理程序。

**调度**中的字段应使用 vSphere 中可用的数据中心和其他计划选项自动填充。

| 字段     | 是否必填 | 解释                                                                                                                                                              |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 数据中心 | \*       | 选择要调度 VM 的数据中心的名称/路径。                                                                                                                             |
| 资源池   |          | 要在其中调度 VM 的资源池名称。资源池可对独立主机或集群的可用 CPU 和内存资源进行分区，也可以嵌套使用。如果是独立 ESXi，请留空。如果未指定，则使用默认资源池。      |
| 数据存储 | \*       | 如果你有数据存储集群，则可以打开**数据存储**字段。此字段允许你选择要将 VM 调度到哪个数据存储集群。如果该字段未打开，你可以选择单个磁盘。                          |
| 文件夹   |          | 数据中心中用于创建 VM 的文件夹的名称。必须已经存在。此下拉菜单中的 VM 文件夹直接对应于 vSphere 中的 VM 文件夹。在 vSphere 配置文件中，文件夹名称应以 `vm/` 开头。 |
| 主机     |          | 用于调度 VM 的主机系统的 IP。如果是独立 ESXi 或具有 DRS（分布式资源调度器）的集群，将此字段留空。如果指定，将使用主机系统的池，而忽略**资源池**参数。             |

## 实例选项

在**实例参数**中，配置此模板创建的 VM 的 vCPU 数量、内存和磁盘大小。

| 参数               | 是否必填 | 描述                                                                                                                                                                                                                                                                              |
| :----------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPUs               |    \*    | 要分配给 VM 的 vCPU 数量。                                                                                                                                                                                                                                                        |
| 内存               |    \*    | 要分配给 VM 的内存量。                                                                                                                                                                                                                                                            |
| 磁盘               |    \*    | 要挂载到 VM 的磁盘大小（以 MB 为单位）。                                                                                                                                                                                                                                          |
| 创建方法           |    \*    | 在节点上创建操作系统的方法。可以使用 ISO 或 VM 模板安装操作系统。根据创建方法，你还必须指定 VM 模板、内容库、现有 VM 或 ISO。有关创建方法的详细信息，请参阅 [VM 创建方法](#about-vm-creation-methods)。                                                                           |
| Cloud Init         |          | `cloud-config.yml` 文件的 URL 或用于配置 VM 的 URL。此文件允许进一步定制操作系统，例如网络配置、DNS 服务器或系统守护程序。操作系统必须支持 `cloud-init`。                                                                                                                         |
| 网络               |          | 要挂载 VM 的网络的名称。                                                                                                                                                                                                                                                          |
| guestinfo 配置参数 |          | VM 的其他配置参数。这些参数对应 vSphere 控制台中的[高级设置](https://kb.vmware.com/s/article/1016098)。示例用例包括提供 RancherOS [guestinfo]({{< baseurl >}}/os/v1.x/en/installation/cloud/vmware-esxi/#vmware-guestinfo) 参数，或为 VM 启用磁盘 UUID (`disk.EnableUUID=TRUE`)。 |

### VM 创建方法

在**创建方法**字段中，配置用于在 vSphere 中配置 VM 的方法。可用的选项包括创建从 RancherOS ISO 启动的 VM，或通过从现有虚拟机或 [VM 模板](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-F7BF0E6B-7C4F-4E46-8BBF-76229AEA7220.html)克隆来创建 VM。

现有 VM 或模板可以使用任何现代 Linux 操作系统，该操作系统配置为使用 [NoCloud 数据源](https://cloudinit.readthedocs.io/en/latest/topics/datasources/nocloud.html)来支持 [cloud-init](https://cloudinit.readthedocs.io/en/latest/)。

选择创建 VM 的方式：

- **使用模板部署：数据中心**：选择存在于所选数据中心的 VM 模板。
- **使用模板部署：内容库**：首先选择包含你的模板的[内容库](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-254B2CE8-20A8-43F0-90E8-3F6776C2C896.html)，然后从填充列表**库模板**中选择模板。
- **克隆现有的虚拟机**：在**虚拟机**字段中选择一个现有虚拟机，新虚拟机将克隆自该虚拟机。
- **使用 boot2docker ISO 安装**：确保 **OS ISO URL** 字段包含 RancherOS 的 VMware ISO 版本的 URL (`rancheros-vmware.iso`)。请注意，运行 Rancher Server 节点必须能访问该 URL。

## 网络

节点模板现在允许为 VM 配置多个网络。在**网络**字段中，你可以单击**添加网络**来添加 vSphere 中可用的任何网络。

## 节点标签和自定义属性

标签用于向 vSphere 对象清单中的对象添加元数据，以便对对象进行排序和搜索。

你的所有 vSphere 标签都将显示为节点模板中可供选择的选项。

在自定义属性中，Rancher 会让你选择你已经在 vSphere 中设置的所有自定义属性。自定义属性是键，你可以为每个属性输入值。

> **注意**：自定义属性是一项旧版功能，最终将从 vSphere 中删除。

## cloud-init

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/) 允许你在首次启动时应用配置，从而初始化节点。这可能涉及创建用户、授权 SSH 密钥或设置网络之类的操作。

要使用 cloud-init 初始化，请使用有效的 YAML 语法创建一个 cloud config 文件，并将文件内容粘贴到 **Cloud Init** 字段中。要获取支持的 cloud config 指令的注释示例集，请参阅 [cloud-init 文档](https://cloudinit.readthedocs.io/en/latest/topics/examples.html)。

请注意，使用 ISO 创建方法时不支持 cloud-init。
