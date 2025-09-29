---
title: vSphere 配置参考
description: 本文介绍了vSphere 配置参考。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - RKE
  - 配置选项
  - 云服务提供商
  - vSphere
  - vSphere 配置参考
---

## 概述

本节显示了如何配置 vSphere 云提供商的示例。

必须启用 vSphere 云提供商以允许动态供应卷。

有关在 vSphere 上部署 Kubernetes 集群的更多详细信息，请参阅 [官方云提供商文档](https://cloud-provider-vsphere.sigs.k8s.io/tutorials/kubernetes-on-vsphere-with-kubeadm.html)。

> **说明：**本文档反映了 Kubernetes v1.9 中引入的新 vSphere Cloud Provider 配置模式，与之前的版本有所不同。

## vSphere 配置示例

已知以下信息：

- 集群中的虚拟机运行在同一个数据中心`us-west-1`，由 vCenter`vc.example.com`管理。
- vCenter 有一个用户`provisioner`，密码`secret`，并分配了所需的角色。
- vCenter 有一个名为`ds-1`的数据存储，应该用来存储卷的 VMDK。
- vCenter 中存在一个`vm/kubernetes`文件夹。

那么，提供商的相应配置如下：

```yaml
(...)
cloud_provider:
  name: vsphere
  vsphereCloudProvider:
    virtual_center:
      vc.example.com:
        user: provisioner
        password: secret
        port: 443
        datacenters: /eu-west-1
    workspace:
      server: vc.example.com
      folder: /eu-west-1/folder/myvmfolder
      default-datastore: ds-1
      datacenter: /eu-west-1
      resourcepool-path: /eu-west-1/host/hn1/resources/myresourcepool

```

## 可配置选项

vSphere 配置选项分为 5 大类：

- [global](#global)
- [virtual_center](#virtual_center)
- [workspace](#workspace)
- [disk](#disk)
- [network](#network)

### global

全局选项的主要目的是能够定义一套通用的配置参数，除非在`virtual_center`指令下明确定义，否则所有在`virtual_center`指令下定义的 vCenters 都将继承这些参数。

因此，`global`指令接受与`virtual_center`指令相同的配置选项。此外，它还接受一个只能在这里指定的单一参数：

| 全局选项      | 类型    | 是否必填 | 描述                                                 |
| :------------ | :------ | :------- | :--------------------------------------------------- |
| insecure-flag | boolean | 否       | 如果 vCenter/ESXi 使用自签名证书，则设置为**true**。 |

**示例：**

```yaml
(...)
    global:
      insecure-flag: true
```

### virtual_center

此配置指令指定管理集群中节点的 vCenters。您必须至少定义一个 vCenter/ESXi 服务器。如果节点跨越多个 vCenters，则必须定义所有的 vCenters。

通过在`virtual_center`指令下添加一个新条目来定义每个 vCenter，并将 vCenter IP 或 FQDN 作为名称。必须为每个 vCenter 提供所有必要的参数，除非它们已经在`global`指令下定义。

| virtual_center 选项  | 类型   | 是否必填 | 描述                                                           |
| :------------------- | :----- | :------- | :------------------------------------------------------------- |
| user                 | string | 是       | 用于验证此服务器的 vCenter/ESXi 用户                           |
| password             | string | 是       | 用户密码                                                       |
| port                 | string | 否       | 用于连接到该服务器的端口。默认使用 443 端口                    |
| datacenters          | string | 是       | 集群节点运行的所有数据中心列表，通过逗号分隔。                 |
| soap-roundtrip-count | uint   | 否       | 向 vCenter 提出的 API 请求的往返次数（num retries = 值 - 1）。 |

> RKE 尚未支持以下附加选项（在 Kubernetes v1.11 中引入）。

| virtual_center 选项 | 类型   | 是否必填 | 描述                                                           |
| :------------------ | :----- | :------- | :------------------------------------------------------------- |
| secret-name         | string | 否       | 包含凭证密钥/值对的密钥资源的名称。可以代替用户/密码参数而指定 |
| secret-namespace    | string | 否       | 创建密钥资源所在的命名空间                                     |
| ca-file             | string | 否       | 用于验证 vCenter 证书的 CA 证书文件的路径                      |

**示例：**

```yaml
(...)
    virtual_center:
      172.158.111.1: {}  # This vCenter inherits all it's properties from global options
      172.158.110.2:     # All required options are set explicitly
        user: vc-user
        password: othersecret
        datacenters: us-west-2
```

### workspace

此配置组指定如何在 vSphere 中创建卷的存储。
可使用以下配置选项。

| workspace Options 选项 | 类型   | 是否必填 | 描述                                                                                                                                                                                                                                                                                                                                                                                 |
| :--------------------- | :----- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| server                 | string | 是       | 应用于创建卷的 vCenter/ESXi 的 IP 或 FQDN。必须与`virtual_center`指令中定义的 vCenters 之一相匹配                                                                                                                                                                                                                                                                                    |
| datacenter             | string | 是       | 应用于创建卷的数据中心的名称。对于 ESXi，请输入*ha-datacenter*                                                                                                                                                                                                                                                                                                                       |
| folder                 | string | 是       | 用于创建用于卷供应的虚拟机的文件夹路径（相对于 vCenter 中的根文件夹），例如 "vm/kubernetes"。                                                                                                                                                                                                                                                                                        |
| default-datastore      | string | 否       | 如果在 PVC 的卷选项中既没有指定数据存储也没有指定存储策略，则要放置 VMDK 的默认数据存储的名称。如果数据存储位于存储文件夹中，或者是数据存储集群的成员，请指定完整路径。                                                                                                                                                                                                              |
| resourcepool-path      | string | 否       | 资源池的绝对或相对路径，[基于存储策略的供应](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/policy-based-mgmt.html)的虚拟机应在其中创建。如果指定了相对路径，则根据数据中心的*host*文件夹进行解析。示例： `/<dataCenter>(dataCenter) /<dataCenter>/host/<host或ClusterName>/Resources/<poolName>`、`Resources/<poolName>`。对于独立的 ESXi，指定`Resources`。 |

**示例：**

```yaml
(...)
    workspace:
      server: 172.158.111.1 # virtual_center块中定义的vCenter的IP地址
      datacenter: eu-west-1
      folder: vm/kubernetes
      default-datastore: ds-1
```

### disk

disk 有以下配置选项：

| disk 配置选项      | 类型   | 是否必填 | 描述                                                                                                                  |
| :----------------- | :----- | :------- | :-------------------------------------------------------------------------------------------------------------------- |
| scsicontrollertype | string | 否       | 将块存储连接到虚拟机时要使用的 SCSI controller 类型，必须是以下类型之一：*lsilogic-sas*或*pvscsi*，默认值为*pvscsi*。 |

### network

network 有以下配置选项：

| disk 配置选项  | 类型   | 是否必填 | 描述                                                                           |
| :------------- | :----- | :------- | :----------------------------------------------------------------------------- |
| public-network | string | 否       | 集群中的虚拟机所连接的公共**VM Network**的名称。用于确定虚拟机的公共 IP 地址。 |
