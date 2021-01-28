---
title: 创建腾讯 TKE 集群
description: 您可以使用 Rancher 创建一个托管于 Tencent Kubernetes Engine（TKE）中的集群。Rancher 已经为 TKE 实现并打包了针对 TKE 的集群驱动，但是默认情况下，这个集群驱动是`未启用的`。为了启动 TKE 集群，您需要先启用 TKE 集群驱动程序。启用集群驱动后，可以开始配置 TKE 集群。
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
  - 创建托管集群
  - 创建腾讯 TKE 集群
---

_从 v2.2.0 开始可用_

您可以使用 Rancher 创建一个托管于 Tencent Kubernetes Engine（TKE）中的集群。Rancher 已经为 TKE 实现并打包了针对 TKE 的[集群驱动](/docs/rancher2/admin-settings/drivers/cluster-drivers/_index)，但是默认情况下，这个集群驱动是`未启用的`。为了启动 TKE 集群，您需要先[启用 TKE 集群驱动程序](/docs/rancher2/admin-settings/drivers/cluster-drivers/_index)。启用集群驱动后，可以开始配置 TKE 集群。

## 先决条件

> **注意**
> 创建腾讯 TKE 集群会产生费用。

1. 请确保您将用于创建 TKE 集群的帐户具有适当的权限，详细信息请参考[云访问管理](https://cloud.tencent.com/document/product/598/10600)文档。

1. 创建[云 API 密钥 ID 和密钥](https://console.cloud.tencent.com/capi)。

1. 在您要部署 Kubernetes 集群的区域中创建[专用网络和子网](https://cloud.tencent.com/document/product/215/4927)。

1. 创建[SSH 密钥对](https://cloud.tencent.com/document/product/213/6092)，此密钥用于访问 Kubernetes 集群中的节点。

## 创建 TKE 集群

1. 从 **集群** 页面，单击 **添加集群**。

1. 选择 **Tencent TKE**。

1. 输入 **集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 单击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 为 TKE 集群配置**帐户权限**。使用先决条件中获得的信息完成每个下拉列表和字段。

   | 选项       | 描述                                         |
   | :--------- | :------------------------------------------- |
   | 区域       | 从下拉列表中选择要在其中构建集群的地理区域。 |
   | Secret ID  | 输入从腾讯云控制台获取的 Secret ID。         |
   | Secret Key | 输入从腾讯云控制台获取的 Secret key。        |

1. 单击 `下一步：配置集群` 来设置您的 TKE 集群配置。

   | 选项            | 描述                                                                                                          |
   | :-------------- | :------------------------------------------------------------------------------------------------------------ |
   | Kubernetes 版本 | TKE 现在只支持 Kubernetes 版本 1.10.5。                                                                       |
   | 节点数量        | 输入您希望为 Kubernetes 集群购买的工作节点数量，最多 100 个。                                                 |
   | VPC             | 选择您在腾讯云控制台中创建的 VPC 名称。                                                                       |
   | 容器 CIDR 网络  | 输入 Kubernetes 集群的 CIDR 范围，您可以在腾讯云控制台的 VPC 服务中查看 CIDR 的可用范围。默认 172.16.0.0/16。 |

1. 单击 `下一步：选择实例类型` 选择将用于 TKE 集群的实例类型。

   | 选项     | 描述                                                                                    |
   | :------- | :-------------------------------------------------------------------------------------- |
   | 可用区   | 选择 VPC 的可用区。                                                                     |
   | 子网     | 选择在 VPC 中创建的子网，如果在选择的可用区中没有子网，则添加一个新的子网。             |
   | 实例类型 | 从下拉菜单中选择要用于 TKE 集群的 VM 实例类型，默认为 S2.MEDIUM4 (CPU 2 Memory 4 GiB)。 |

1. 单击 `下一步：配置实例` 配置将用于 TKE 集群的 VM 实例。

   | 选项         | 描述                                                                                                     |
   | :----------- | :------------------------------------------------------------------------------------------------------- |
   | 操作系统     | 操作系统的名称，当前支持 Centos7.2x86_64 或 ubuntu16.04.1 LTSx86_64。                                    |
   | 安全组       | 安全组 ID，默认不绑定任何安全组。                                                                        |
   | 根磁盘类型   | 系统磁盘类型。系统磁盘类型限制详见[CVM 实例配置](https://cloud.tencent.com/document/product/213/11518)。 |
   | 根磁盘大小   | 系统磁盘大小。Linux 系统调整范围为 20-50G，步长为 1。                                                    |
   | 数据磁盘类型 | 数据磁盘类型，SSD 云驱动器的默认值。                                                                     |
   | 数据磁盘大小 | 数据磁盘大小（GB），步长为 10。                                                                          |
   | 带宽类型     | 带宽类型、按流量计费或按小时计费。                                                                       |
   | 带宽         | 公网带宽（Mbps）                                                                                         |
   | 密钥对       | 密钥 id，在关联密钥后可以用来登录到 VM 节点。                                                            |

1. 单击 **创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，有两个默认项目：`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。
