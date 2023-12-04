---
title: v2.3.0
---

## Account Access

| 参数   | 是否必填 | 描述                                                                                                     |
| :----- | :------: | :------------------------------------------------------------------------------------------------------- |
| 云凭证 |    是    | 您的 vSphere 帐户访问信息，存储在 [云凭证](/docs/rancher2.5/user-settings/cloud-credentials/_index) 中。 |

Your cloud credential has these fields:

| 凭证参数               | 描述                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| vCenter or ESXi Server | 输入 vCenter 或 ESXi 主机名称/IP。ESXi 是您创建和运行虚拟机和虚拟设备的虚拟化平台。vCenter Server 是您管理连接在网络中的多台主机并汇集主机资源的服务。 |
| Port                   | 可选：配置 vCenter 或 ESXi 服务器的端口。                                                                                                              |
| Username and password  | 输入您的 vSphere 登录用户名和密码。                                                                                                                    |

## 调度

请选择虚拟机将被调度到哪个管理程序。

| 参数        | 是否必填 | 描述                                                                                               |
| :---------- | -------- | :------------------------------------------------------------------------------------------------- |
| Data Center | 是       | 要在其中创建虚拟机的数据中心的名称/路径。                                                          |
| Pool        |          | 要调度虚拟机的资源池的名称/路径。如果未指定，则使用默认资源池。                                    |
| Host        |          | 要调度虚拟机的主机系统的名称/路径。如果指定了，将使用主机系统的池，而 _Pool_ 参数将被忽略。        |
| Network     | 是       | 要将虚拟机连接到的虚拟机网络的名称。                                                               |
| Data Store  | 是       | 用于存储虚拟机磁盘的数据存储。                                                                     |
| Folder      |          | 数据中心中要创建虚拟机的文件夹的名称。必须已经存在。文件夹名称应在 vSphere 配置文件中以`vm/`开头。 |

## Instance Options

在**Instance Options**部分，为该模板创建的虚拟机配置 vCPU 数量、内存和磁盘大小。

仅支持从 RancherOS ISO 启动的虚拟机。

确保操作系统 ISO URL 包含 RancherOS 的 VMware ISO 版本的 URL：`rancheros-vmware.iso`。

| 参数                     | 是否必填 | 描述                                                                                                                                                                                                            |
| :----------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPUs                     |    是    | 分配给虚拟机的 CPU 数量                                                                                                                                                                                         |
| Memory                   |    是    | 分配给虚拟机的内存                                                                                                                                                                                              |
| Disk                     |    是    | 虚拟机挂在的磁盘大小                                                                                                                                                                                            |
| Cloud Init               |          | RancherOS cloud-confi 文件的 URL，用于供应虚拟机。该文件允许进一步定制 RancherOS 操作系统，如网络配置、DNS 服务器或系统守护进程。                                                                               |
| OS ISO URL               |    是    | 用于引导虚拟机的 RancherOS vSphere ISO 文件的 URL。您可以在 [Rancher OS GitHub Repo](https://github.com/rancher/os) 中找到特定版本的 URL。                                                                      |
| Configuration Parameters |          | 虚拟机的其他配置参数。这些参数对应于 vSphere 控制台中的 [Advanced Settings](https://kb.vmware.com/s/article/1016098)。示例用例包括提供 RancherOS guestinfo 参数或为虚拟机启用磁盘 UUID(`disk.EnableUID=TRUE`)。 |

## 节点标签和自定义属性

这些属性允许您将元数据附加到 vSphere 清单中的对象，以便于对这些对象进行排序和搜索。

您可以执行以下操作：

- 为虚拟机提供一组配置参数（实例选项）。
- 为虚拟机分配标签，这些标签可用作集群中调度规则的基础。
- 在将要创建的虚拟机上自定义 Docker 守护进程的配置。

:::note 说明
自定义属性是 vSphere 中的一项功能，虽然在当前的 vSphere 版本中可用，但是不排除 vSphere 在后续版本中删除此功能的可能性。
:::

## Cloud Init

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/)允许您通过在第一次启动时应用配置来初始化您的节点。这可能涉及创建用户、授权 SSH 密钥或设置网络等事项。

您可以在 **Cloud Init** 字段中指定 RancherOS cloud-config.yaml 文件的 URL。有关支持的配置指令的详细信息，请参考 [RancherOS 文档](https://rancher.com/docs/os/v1.x/en/configuration/#cloud-config)。请注意，该 URL 必须可以从模板创建的虚拟机进行网络访问。
