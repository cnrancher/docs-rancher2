---
title: 创建腾讯 TKE 集群
shortTitle: Tencent Kubernetes Engine
weight: 2125
---

你可以使用 Rancher 创建托管在腾讯 Tencent Kubernetes Engine (TKE) 中的集群。Rancher 已经为 TKE 实现并打包了针对 TKE 的[集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/)，但是默认情况下，这个集群驱动的状态是 `inactive`。为了启动 TKE 集群，你需要[启用 TKE 集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/#activating-deactivating-cluster-drivers)。启用集群驱动后，你可以开始配置 TKE 集群。

## 腾讯先决条件

> **注意**：
> 部署到 TKE 会产生费用。

1. 参见[云访问管理](https://intl.cloud.tencent.com/document/product/598/10600)文档，确保用于创建 TKE 集群的账号具有适当的权限。

2. 创建[云 API 密钥 ID 和密钥](https://console.cloud.tencent.com/capi)。

3. 在要部署 Kubernetes 集群的区域中创建[私有网络和子网](https://intl.cloud.tencent.com/document/product/215/4927)。

4. 创建 [SSH 密钥对](https://intl.cloud.tencent.com/document/product/213/6092)。该密钥用于访问 Kubernetes 集群中的节点。

## Rancher 先决条件

你需要启用腾讯 TKE 集群驱动：

1. 点击 **☰ > 集群管理**。
1. 点击**驱动**。
1. 在**集群驱动**选项卡中，转到 **Tencent TKE** 集群驱动并单击 **⋮ > 激活**。

集群驱动下载完成后，就可以在 Rancher 中创建腾讯 TKE 集群了。

## 创建 TKE 集群

1. 在**集群**页面，点击**创建**。

2. 选择 **Tencent TKE**。

3. 输入**集群名称**。

4. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。

5. 为 TKE 集群配置**账号访问**。使用[先决条件](#prerequisites-in-tencent)中获得的信息完成每个下拉列表和字段。

   | 选项     | 描述                                 |
   | -------- | ------------------------------------ |
   | 区域     | 从下拉列表中选择构建集群的地理区域。 |
   | 密文 ID  | 输入从腾讯云控制台获取的密文 ID。    |
   | 密文密钥 | 输入从腾讯云控制台获取的密文密钥。   |

6. 然后，单击`下一步：配置集群`来配置 TKE 集群。

   | 选项            | 描述                                                                                                              |
   | --------------- | ----------------------------------------------------------------------------------------------------------------- |
   | Kubernetes 版本 | TKE 目前只支持 Kubernetes 1.10.5。                                                                                |
   | 节点数          | 输入要为 Kubernetes 集群购买的 worker 节点数，最大值是 100。                                                      |
   | VPC             | 选择在腾讯云控制台中创建的 VPC 名称。                                                                             |
   | 容器网络 CIDR   | 输入 Kubernetes 集群的 CIDR 范围。你可以在腾讯云控制台的 VPC 服务中查看该 CIDR 的可用范围。默认为 172.16.0.0/16。 |

   **注意**：如果你在 `cluster.yml` 中编辑集群，而不是使用 Rancher UI，则集群配置参数必须嵌套在 `cluster.yml` 中的 `rancher_kubernetes_engine_config` 中。有关详细信息，请参阅 [Rancher 2.3.0+ 配置文件结构]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#config-file-structure-in-rancher-v2-3-0)。

7. 点击`下一步：选择实例类型`，然后选择将用于 TKE 集群的实例类型。

   | 选项     | 描述                                                                                    |
   | -------- | --------------------------------------------------------------------------------------- |
   | 可用区   | 选择 VPC 区域的可用区。                                                                 |
   | 子网     | 选择你在 VPC 中创建的子网。如果在所选可用区中没有该子网，请添加一个新子网。             |
   | 实例类型 | 从下拉列表中选择要用于 TKE 集群的 VM 实例类型，默认为 S2.MEDIUM4（CPU 2；内存 4 GiB）。 |

8. 点击`下一步：配置实例`，配置用于 TKE 集群的 VM 实例。

   | 选项         | 描述                                                                                                  |
   | ------------ | ----------------------------------------------------------------------------------------------------- |
   | 操作系统     | 操作系统名称，目前支持 Centos7.2x86_64 或 ubuntu16.04.1 LTSx86_64。                                   |
   | 安全组       | 安全组 ID，默认不绑定任何安全组。                                                                     |
   | 根磁盘类型   | 系统盘类型。系统盘类型限制详见 [CVM 实例配置](https://cloud.tencent.com/document/product/213/11518)。 |
   | 根磁盘大小   | 系统盘大小。Linux 系统调整范围为 20-50 GB，步长为 1。                                                 |
   | 数据盘类型   | 数据盘类型，默认为 SSD 云盘。                                                                         |
   | 数据磁盘大小 | 数据盘大小（GB），步长为 10。                                                                         |
   | 带宽类型     | 带宽收费类型，PayByTraffic 或 PayByHour。                                                             |
   | 带宽         | 公网带宽 (Mbps)                                                                                       |
   | 密钥对       | 密钥 ID，关联后可以用来登录 VM 节点。                                                                 |

9. 单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。
