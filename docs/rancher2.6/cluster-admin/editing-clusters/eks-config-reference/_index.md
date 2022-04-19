---
title: EKS 集群配置参考
shortTitle: EKS 集群配置
weight: 2
---

### 账号访问

使用获取的信息为 IAM 策略填写每个下拉列表和字段：

| 设置   | 描述                                                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 区域   | 从下拉列表中选择构建集群的地理区域。                                                                                                                 |
| 云凭证 | 选择为 IAM 策略创建的云凭证。有关在 Rancher 中创建云凭证的更多信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/user-settings/cloud-credentials/)。 |

### 服务角色

选择一个[服务角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html)。

| 服务角色                         | 描述                                                                                                                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard：Rancher 生成的服务角色 | 如果选择此角色，Rancher 会自动添加一个服务角色以供集群使用。                                                                                                                                                                                          |
| 自定义：从现有的服务角色中选择   | 如果选择此角色，Rancher 将允许你从已在 AWS 中创建的服务角色中进行选择。有关在 AWS 中创建自定义服务角色的更多信息，请参阅 [Amazon 文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

### 密文加密

可选：要加密密文，请选择或输入在 [AWS 密钥管理服务 (KMS)](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) 中创建的密钥。

### API Server 端点访问

配置公共/私有 API 访问是一个高级用例。有关详细信息，请参阅 [EKS 集群端点访问控制文档](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)。

### 专用 API 端点

如果你在创建集群时启用了私有 API 端点访问，并禁用了公共 API 端点访问，那么你必须进行额外的步骤才能使 Rancher 成功连接到集群。在这种情况下，一个弹窗将会显示，其中包含需要在要注册到 Rancher 的集群上运行的命令。配置集群后，你可以在任何能连接到集群的 Kubernetes API 的地方运行显示的命令。

以下两种方法能避免这个额外的手动步骤：

- 在创建集群时，创建具有私有和公共 API 端点访问权限的集群。在集群创建并处于 active 状态后，你可以禁用公共访问，Rancher 将能继续与 EKS 集群通信。
- 确保 Rancher 与 EKS 集群共享同一个子网。然后，你可以使用安全组使 Rancher 能够与集群的 API 端点进行通信。在这种情况下，你不需要运行注册集群的命令，Rancher 就能够与你的集群通信。有关配置安全组的更多信息，请参阅[安全组文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)。

### 公共访问端点

你也可以选择通过显式 CIDR 块来限制对公共端点的访问。

如果你限制对特定 CIDR 块的访问，那么建议你也启用私有访问，以避免丢失与集群的网络通信。

启用私有访问需要满足以下条件之一：

- Rancher 的 IP 必须是允许的 CIDR 块的一部分。
- 应该启用了私有访问。此外，Rancher 必须和集群共享同一个子网，并对集群有网络访问权限。你可以通过安全组来进行配置。

有关对集群端点的公共和私有访问的更多信息，请参阅 [Amazon EKS 文档](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)。

### 子网

| 选项                                | 描述                                                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard：Rancher 生成的 VPC 和子网 | 在配置集群时，Rancher 会生成一个具有 3 个公有子网的新 VPC。                                                                                                               |
| 自定义：从现有的 VPC 和子网中选择   | 在配置集群时，Rancher 将你的 control plane 和节点配置为使用你已经[在 AWS 中创建](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)的 VPC 和子网。 |

有关更多信息，请参阅 AWS 文档以了解 [集群 VPC 注意事项](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html)。根据你在上一步中的选择，按照以下说明进行操作。

- [什么是 Amazon VPC？](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPC 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

### 安全组

Amazon 文档：

- [集群安全组注意事项](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
- [VPC 的安全组](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [创建安全组](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html#getting-started-create-security-group)

### 日志管理

将 control plane 日志配置为发送到 Amazon CloudWatch。如果你将集群日志发送到 CloudWatch Logs，你需要按照 standard CloudWatch Logs 支付数据引入和存储费用。

每个日志类型均对应一个 Kubernetes control plane 组件。有关这些组件的更多信息，请参阅 Kubernetes 文档中的 [Kubernetes 组件](https://kubernetes.io/docs/concepts/overview/components/)。

有关 EKS control plane 日志管理的更多信息，请参阅[官方文档](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)。

### 托管节点组

Amazon EKS 托管的节点组自动为 Amazon EKS Kubernetes 集群的节点（Amazon EC2 实例）进行预置和生命周期管理。

有关节点组如何工作以及如何配置的更多信息，请参阅 [EKS 文档](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html)。

#### 使用你自己的启动模板

你可以提供启动模板 ID 和版本，以便轻松配置节点组中的 EC2 实例。如果你提供了启动模板，则以下设置都无法在 Rancher 中进行配置。因此，如果你使用启动模板，则需要在启动模板中指定以下列表中的所有必须和所需的设置。另请注意，如果提供了启动模板 ID 和版本，则只能更新模板版本。如果要使用新模板 ID，则需要创建新的托管节点组。

| 选项         | 描述                                                                                                                                             | 必填/选填 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| 实例类型     | 为要配置的实例选择[硬件规格](https://aws.amazon.com/ec2/instance-types/)。                                                                       | 必填      |
| 镜像 ID      | 为节点指定自定义 AMI。与 EKS 一起使用的自定义 AMI 必须[正确配置](https://aws.amazon.com/premiumsupport/knowledge-center/eks-custom-linux-ami/)。 | 选填      |
| 节点卷大小   | 启动模板必须指定具有所需大小的 EBS 卷。                                                                                                          | 必填      |
| SSH 密钥     | 要添加到实例以对节点进行 SSH 访问的密钥。                                                                                                        | 选填      |
| 用户数据     | [MIME 多部分格式](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)的 Cloud init 脚本。          | 选填      |
| 实例资源标签 | 标记节点组中的每个 EC2 实例。                                                                                                                    | 选填      |

#### Rancher 管理的启动模板

如果你不指定启动模板，你将能够在 Rancher UI 中配置上述选项，并且可以在创建后更新所有这些选项。为了利用所有这些选项，Rancher 将为你创建和管理启动模板。Rancher 中的所有集群都将有一个 Rancher 管理的启动模板。此外，每个没有指定启动模板的托管节点组都将具有一个管理的启动模板版本。此启动模板的名称将具有 “rancher-managed-lt-” 前缀，后面是集群的显示名称。此外，Rancher 管理的启动模板将使用 “rancher-managed-template” 键和 “do-not-modify-or-delete” 值来进行标记，以将其识别为 Rancher 管理的启动模板。请注意，不要修改或删除此启动模板，或将此启动模板与其他集群或托管节点组一起使用。因为这可能会使你的节点组“降级”并需要销毁和重新创建。

#### 自定义 AMI

如果你在启动模板或 Rancher 中指定了自定义 AMI，则必须[正确配置](https://aws.amazon.com/premiumsupport/knowledge-center/eks-custom-linux-ami/)镜像，并且必须提供用户数据以[引导节点](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-custom-ami)。这是一个高级用例，因此你必须要了解其要求。

如果你指定了不包含自定义 AMI 的启动模板，则 Amazon 将为 Kubernetes 版本和所选区域使用 [EKS 优化的 AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html)。你还可以为能从中受益的工作负载选择[启用 GPU 的实例](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html#gpu-ami)。

> **注意**：
> 如果你在下拉菜单或启动模板中提供了自定义 AMI，则会忽略 Rancher 中设置的启用 GPU 的实例。

#### Spot 实例

Spot 实例现在[受 EKS 支持](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types-spot)。如果你指定了启动模板，Amazon 建议不要在模板中提供实例类型。相反，Amazon 建议提供多种实例类型。如果你为节点组启用了“请求 Spot 实例”复选框，那么你将有机会提供多种实例类型。

> **注意**：
> 在这种情况下，你在实例类型下拉列表中所选的选项都将被忽略，你必须在“Spot 实例类型”中至少指定一种实例类型。此外，与 EKS 一起使用的启动模板无法请求 Spot 实例。请求 Spot 实例必须是 EKS 配置的一部分。

#### 节点组设置

以下设置也是可配置的。在创建节点组后，除“节点组名称”外的所有选项都是可编辑的。

| 选项          | 描述                                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 节点组名称    | 节点组的名称。                                                                                                                               |
| 期望 ASG 大小 | 期望的实例数量。                                                                                                                             |
| 最大 ASG 大小 | 最大的实例数量。在安装 [Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html) 之前，此设置不会生效。 |
| 最小 ASG 大小 | 最小的实例数量。在安装 [Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html) 之前，此设置不会生效。 |
| Labels        | 应用于管理的节点组中节点的 Kubernetes 标签。                                                                                                 |
| Tags          | 管理的节点组的标签，这些标签不会传播到任何相关资源。                                                                                         |

### 配置刷新间隔

`eks-refresh-cron` 设置已弃用。它已迁移到 `eks-refresh` 设置，这是一个表示秒的整数。

默认值为 300 秒。

你可以通过运行 `kubectl edit setting eks-refresh` 来更改同步间隔。

如果之前设置了 `eks-refresh-cron` 设置，迁移将自动进行。

刷新窗口越短，争用条件发生的可能性就越小。但这确实增加了遇到 AWS API 可能存在的请求限制的可能性。
