---
title: 创建华为 CCE 集群
shortTitle: 华为云 Kubernetes 服务
weight: 2130
---

你可以使用 Rancher 创建托管在华为云容器引擎 (CCE) 中的集群。Rancher 已经为 CCE 实现并打包了针对 CCE 的[集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/)，但是默认情况下，这个集群驱动的状态是 `inactive`。为了启动 CCE 集群，你需要[启用 CCE 集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/#activating-deactivating-cluster-drivers)。启用集群驱动后，你可以开始配置 CCE 集群。

## 华为先决条件

> **注意**：
> 部署到 CCE 会产生费用。

1. 在华为 CCE 门户中找到你的项目 ID。请参阅 CCE 文档以了解如何[管理你的项目](https://support.huaweicloud.com/en-us/usermanual-iam/en-us_topic_0066738518.html)。

2. 创建一个[访问密钥 ID 和密文访问密钥](https://support.huaweicloud.com/en-us/usermanual-iam/en-us_topic_0079477318.html)。

## Rancher 先决条件

你需要启用华为 CCE 集群驱动：

1. 点击 **☰ > 集群管理**。
1. 点击**驱动**。
1. 在**集群驱动**选项卡中，转到 **Huawei CCE** 集群驱动并单击 **⋮ > 激活**。

集群驱动下载完成后，就可以在 Rancher 中创建华为 CCE 集群了。

## 限制

华为 CCE 服务不支持通过其 API 创建具有公共访问权限的集群。你需要在要配置的 CCE 集群的相同 VPC 中运行 Rancher。

## 创建 CCE 集群

1. 在**集群**页面，点击**创建**。
1. 单击 **Huawei CCE**。
1. 输入**集群名称**。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 输入**项目 ID**，访问密钥 ID，**Access Key**，和密文访问密钥 **Secret Key**。然后点击**下一步：配置集群**。填写集群配置。有关填写表单的帮助，请参阅[华为 CCE 配置](#huawei-cce-configuration)。
1. 填写集群的以下节点配置。有关填写表单的帮助，请参阅[节点配置](#node-configuration)。
1. 点击**创建**来创建 CCE 集群。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

## 华为 CCE 配置

| 设置          | 描述                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| 集群类型      | 要包含到集群的节点类型，可以是 `VirtualMachine` 或 `BareMetal`。                                                  |
| 描述          | 集群的描述。                                                                                                      |
| 主版本        | Kubernetes 版本。                                                                                                 |
| 管理规模数量  | 集群的最大节点数。选项为 50、200 和 1000。规模计数越大，成本越高。                                                |
| 高可用性      | 启用主节点高可用性。启用高可用性的集群成本会更高。                                                                |
| 容器网络模式  | 集群中使用的网络模式。`VirtualMachine` 支持 `overlay_l2` 和 `vpc-router`，而 `BareMetal` 支持 `underlay_ipvlan`。 |
| 容器网络 CIDR | 集群的网络 CIDR。                                                                                                 |
| VPC 名称      | 要部署集群的 VPC 名称。如果留空，Rancher 将创建一个。                                                             |
| 子网名称      | 要部署集群的子网名称。如果留空，Rancher 将创建一个。                                                              |
| 外部服务器    | 预留选项，用于通过 API 启用 CCE 集群的公共访问。这个选项暂时是一直禁用的。                                        |
| 集群标签      | 集群的标签。                                                                                                      |
| 高速子网      | 只有 `BareMetal` 支持该选项。裸金属机器要求选择网速高的 VPC。                                                     |

**注意**：如果你在 `cluster.yml` 中编辑集群，而不是使用 Rancher UI，则集群配置参数必须嵌套在 `cluster.yml` 中的 `rancher_kubernetes_engine_config` 中。有关详细信息，请参阅[配置文件结构]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/#config-file-structure-in-rancher-v2-3-0)。

## 节点配置

| 设置         | 描述                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 区域         | 部署集群节点的可用区域。                                                                                                                                                                                            |
| 计费方式     | 集群节点的计费模式。`VirtualMachine` 仅支持 `Pay-per-use`。`BareMetal` 支持 `Pay-per-use` 或 `Yearly/Monthly`。                                                                                                     |
| 有效期       | 该选项仅在 `Yearly/Monthly` 计费模式中显示。表示支付集群节点费用的时间。                                                                                                                                            |
| 自动续期     | 该选项仅在 `Yearly/Monthly` 计费模式中显示。表示是否为集群节点自动续期 `Yearly/Monthly` 计费。                                                                                                                      |
| 数据卷类型   | 集群节点的数据卷类型。可选 `SATA`，`SSD` 或 `SAS`。                                                                                                                                                                 |
| 数据量大小   | 集群节点的数据卷大小。                                                                                                                                                                                              |
| 根卷类型     | 集群节点的根卷类型。可选 `SATA`，`SSD` 或 `SAS`。                                                                                                                                                                   |
| 根卷大小     | 集群节点的根卷大小。                                                                                                                                                                                                |
| 节点风格     | 集群节点的节点风格。Rancher UI 中的风格列表取自华为云。其中包括所有支持的节点风格。                                                                                                                                 |
| 节点数       | 集群的节点数                                                                                                                                                                                                        |
| 节点操作系统 | 集群节点的操作系统。目前仅支持 `EulerOS 2.2` 和 `CentOS 7.4`。                                                                                                                                                      |
| SSH 密钥名称 | 集群节点的 SSH 密钥                                                                                                                                                                                                 |
| EIP          | 集群节点的公共 IP 选项。`已禁用`表示集群节点不会绑定公共 IP。`创建 EIP`表示集群节点在配置后将绑定一个或多个新创建的 EIP，UI 中将显示更多用来创建 EIP 参数的选项。`选择现有 EIP` 表示节点将绑定到你选择的 EIP。      |
| EIP 数量     | 此选项仅在选择`创建 EIP`时显示。表示你要为节点创建的 EIP 数量。                                                                                                                                                     |
| EIP 类型     | 此选项仅在选择`创建 EIP`时显示。可选 `5_bgp` 和 `5_sbgp`。                                                                                                                                                          |
| EIP 共享类型 | 此选项仅在选择`创建 EIP`时显示。仅可选 `PER`。                                                                                                                                                                      |
| EIP 收费模式 | 此选项仅在选择`创建 EIP`时显示。选择按照`带宽`或`流量`计费。                                                                                                                                                        |
| EIP 带宽大小 | 此选项仅在选择`创建 EIP`时显示。EIP 的带宽。                                                                                                                                                                        |
| 身份验证模式 | 表示启用 `RBAC`，或同时启用`认证代理`。如果选择`认证代理`，则还需要用于验证代理的证书。                                                                                                                             |
| 节点标签     | 集群节点的标签。无效标签会阻止升级，或阻止 Rancher 启动。有关标签语法要求的详细信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)。 |
