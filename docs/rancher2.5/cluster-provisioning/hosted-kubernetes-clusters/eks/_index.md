---
title: 创建亚马逊 EKS 集群
description: Amazon EKS 为 Kubernetes 集群提供了一个托管的control-plane。为了确保高可用性，Amazon EKS 中的 Kubernetes control-plane实例运行在多个可用区。Rancher 为部署和管理 Amazon EKS 中运行的 Kubernetes 集群提供了直观的用户界面。通过本指南，您将使用 Rancher 在您的 AWS 帐户中快速轻松地启动 Amazon EKS Kubernetes 集群。有关 Amazon EKS 的更多信息，参考EKS文档。
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
  - 创建集群
  - 创建托管集群
  - 创建亚马逊 EKS 集群
---

Amazon EKS 为 Kubernetes 集群提供了一个托管的 control-plane。为了确保高可用性，Amazon EKS 中的 Kubernetes control-plane 实例运行在多个可用区。Rancher 为部署和管理 Amazon EKS 中运行的 Kubernetes 集群提供了直观的用户界面。通过本指南，您将使用 Rancher 在您的 AWS 帐户中快速轻松地启动 Amazon EKS Kubernetes 集群。有关 Amazon EKS 的更多信息，参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)。

## 先决条件

> **注意**
> 在亚马逊 AWS 中进行部署会产生费用。了解更多信息，请参阅[EKS 定价页面](https://aws.amazon.com/eks/pricing/)。

要在 EKS 上建立集群，您需要创建一个 Amazon VPC（Virtual Private Cloud）。您还需要确保用于创建 EKS 集群的帐户具有适当的权限。有关详细信息，请参阅官方文档[Amazon EKS 先决条件](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#eks-prereqs)。

### Amazon VPC

您需要建立一个 Amazon VPC 来启动 EKS 集群。VPC 使您能够将 AWS 资源启动到您定义的虚拟网络中。了解更多信息，参考[教程: 为 Amazon EKS 集群创建一个包含公共和私有子网的 VPC](https://docs.aws.amazon.com/eks/latest/userguide/create-public-private-vpc.html)。

### IAM 策略

Rancher 需要访问您的 AWS 帐户，以便在 Amazon EKS 中创建和管理您的 Kubernetes 集群。您需要在 AWS 帐户中为 Rancher 创建一个用户，并定义该用户可以访问的内容。

1. 请按照以下步骤创建具有程序访问权限的用户：[此处](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)。

2. 下一步，创建 IAM 策略，定义该用户在 AWS 账户中有权访问的内容。请务必仅授予此用户所需要的最小权限。请按照[此处](https://docs.aws.amazon.com/eks/latest/userguide/EKS_IAM_user_policies.html)的步骤来创建 IAM 策略并将其附加到用户。

下一步，创建 IAM 策略，定义该用户在 AWS 账户中有权访问的内容。请参考[最小权限](#附录-最小-EKS-权限)，为该用户配置所需要的最小权限。按照步骤[这里](https://docs.aws.amazon.com/eks/latest/userguide/EKS_IAM_user_policies.html)创建 IAM 策略并将其附加到你的用户。

3. 最后，按照[此处](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)的步骤为此用户创建 Access Key 和 Secret Key。

> **注意:** 定期轮换 Access Key 和 Secret Key 非常重要，参考[文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#rotating_access_keys_console)了解更多信息。

有关 EKS 的 IAM 策略的更多详细信息，请参阅官方[有关 Amazon EKS IAM 策略、角色和权限的文档](https://docs.aws.amazon.com/eks/latest/userguide/IAM_policies.html)。

## 架构

下图展示了 Rancher 2.x 的大体架构。该图描述了一个 Rancher Server 管理两个 Kubernetes 集群：一个由 RKE 创建，另一个由 EKS 创建。

![具有EKS托管集群的Rancher体系结构](/img/rancher/rancher-architecture.svg)

## 创建 EKS 集群

使用 Rancher 设置和配置 Kubernetes 集群.

1. 从 **集群** 页面，单击 **添加集群**.

1. 选择 **Amazon EKS**.

1. 输入 **集群名称**.

1. 通过**成员角色**来设置用户访问集群的权限。

   - 单击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 为 EKS 集群配置**账户权限**。

   | 设置       | 描述                                         |
   | ---------- | -------------------------------------------- |
   | 区域       | 从下拉列表中选择要在其中创建集群的地理区域。 |
   | Access Key | 输入之前创建的 Access Key                    |
   | Secret Key | 输入之前创建的 Secret Key                    |

1. 单击 **下一步: 配置集群**。然后选择[服务相关角色](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html)。

   | 服务相关角色                       | 描述                                                                                                                                                                                                                                                              |
   | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 标准：Rancher 生成的服务相关角色。 | 如果选择此角色，Rancher 会自动添加一个服务相关角色以用于集群。                                                                                                                                                                                                    |
   | 自定义：从现有服务相关角色中选择。 | 如果您选择此角色，Rancher 允许您从已经在 AWS 中创建的服务相关角色中进行选择。有关在 AWS 中创建自定义服务相关角色的详细信息，参考[亚马逊文档](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

1. 单击 **下一步: 选择 VPC 和 Subnet**。

1. 为**Worker 节点的公网 IP**选择一个选项。您对此选项的选择决定了**VPC 和 Subnet**可用的选项。

   | 选择          | 描述                                                                                                                                                                                                           |
   | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 是            | 当您的集群节点被配置时，它们将被分配一个内网 IP 地址和一个外网 IP 地址。                                                                                                                                       |
   | 否：仅私有 IP | 当您的集群节点被配置时，它们将会只被分配一个内网 IP 地址。如果您选择此选项，您还必须选择一个**VPC & Subnet**来允许您的实例访问 internet。此访问是必需的，以便您的工作节点可以连接到 Kubernetes control-plane。 |

1. 现在选择**VPC & Subnet**。有关更多信息，请参阅 AWS 文档中的[集群 VPC 注意事项](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html)。根据上一步的选择，按照下面的说明进行操作。

   - [什么是亚马逊 VPC？](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
   - [VPCs 和 Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

   - **Worker 节点的公网 IP：是**

     如果您选择将外网 IP 地址分配给集群的工作节点，您可以选择 “由 Rancher 自动生成 VPC” 或“使用在 AWS 中已有的 VPC”。请选择最适合您的用例的选项。

     1. 选择 **VPC 和 Subnet** 选项。

        | 操作                                | 描述                                                                                                                                                                                        |
        | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
        | 标准: Rancher 生成的 VPC 和 Subnets | 在配置集群时，Rancher 会生成一个新的 VPC 和子网。                                                                                                                                           |
        | 自定义：选择您现有的 VPC 和 Subnets | 设置集群时，Rancher 将使用您已经在[AWS 中创建](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html)的 VPC 和子网来配置您的节点。如果选择此选项，请完成以下剩余步骤。 |

     1. 如果您使用 **自定义：选择现有的 VPC 和 Subnets**：

        1. 确保 **自定义：选择现有的 VPC 和 Subnets** 已经选择中。

        1. 在显示的下拉列表中,选择一个 VPC。

        1. 单击 **下一步: 选择 Subnets**。然后选择其中一个显示的**Subnets**。

        1. 单击 **下一步: 选择安全组**。

   - **Worker 节点的公网 IP：否：仅私有 IP**

     如果您选择此选项，您还必须选择允许您的实例访问 internet 的**VPC & Subnet**。这个访问是必需的，这样您的工作节点才可以连接到 Kubernetes control-plane。步骤如下：

     > **提示:** 仅使用私有 IP 地址时，为了使您的节点可以访问 internet，您可以创建一个由两个子网组成的 VPC，一个共有子网，一个私有子网。公有子网内的网络地址转换 (NAT) 实例，可让私有子网中的实例发起到 Internet 的流量。有关私有子网路由流量的更多信息，请查看 [官方 AWS 文档](https://docs.aws.amazon.com/zh_cn/vpc/latest/userguide/VPC_NAT_Instance.html)。

     1. 从显示的下拉列表中,选择专有网络 VPC。

     1. 单击 **下一步: 选择 Subnets**。然后选择其中一个显示的**Subnets**。

     1. 单击 **下一步: 选择安全组**。

1. 选择**安全组**。请参阅下面的文档，了解如何创建一个安全组。

   Amazon 文档:

   - [集群安全组注意事项](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
   - [VPC 的安全组](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
   - [创建安全组](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html#getting-started-create-security-group)

1. 单击 **选择实例选项**，然后编辑可用的节点选项。工作节点的实例类型和大小会影响每个工作节点将有多少 IP 地址可用。参考这个[文档](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI)了解更多信息。

   | 选项          | 描述                                                                                                                                                                                                                                                                                                   |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | 实例类型      | 为正在配置的实例选择[硬件规格](https://aws.amazon.com/ec2/instance-types/)。                                                                                                                                                                                                                           |
   | 自定义 AMI    | 如果您想使用自定义的 [Amazon Machine Image](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html#creating-an-ami) (AMI)，请在这里指定它。默认情况下，Rancher 将会根据您选择的 EKS 版本来使用相应的[EKS-调优的 AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html)。 |
   | 预期 ASG 大小 | 通过[亚马逊弹性伸缩组](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)控制实例数。                                                                                                                                                                         |
   | 用户数据      | 可以传递自定义命令来执行自动配置任务 **警告：修改此命令可能会导致节点无法加入集群** _注意: 从 v2.2.0 起提供_                                                                                                                                                                                           |

1. 单击 **创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，有两个默认项目：`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。

## EKS 集群配置参考

### Rancher v2.5 的变化

当你在 Rancher 中创建一个 EKS 集群时，可以配置更多的 EKS 选项，包括以下内容。

- 被管理的节点组
- 希望的规模、最小规模、最大规模（需要安装集群自动调节器
- 控制平面日志
- 使用 KMS 的密钥加密

在 Rancher 中配置 EKS 集群时，增加了以下功能。

- 支持 GPU
- 只使用随最新 AMI 而来的管理节点组
- 添加新的节点
- 升级节点
- 添加和删除节点组
- 禁用和启用私人访问
- 为公共访问添加限制
- 使用你的云证书来创建 EKS 集群，而不是传递你的访问密钥和密钥密钥

由于集群数据与 EKS 同步的方式，如果在五分钟内从其他来源（如 EKS 控制台）和 Rancher 中修改集群，可能会导致一些变化被覆盖。关于同步的工作方式以及如何配置的信息，请参考[本节](#同步)。

### 2.5.6

#### 账户权限

使用为你的 IAM 策略获得的信息填写区域和云凭证这两个字段。

| 配置   | 描述                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 区域   | 从下拉菜单中选择在哪个区域创建集群。                                                                                                              |
| 云凭证 | 选择你为你的 IAM 策略创建的云凭证。关于在 Rancher 中创建云证书的更多信息，请参考[本页](/docs/rancher2.5/user-settings/cloud-credentials/_index)。 |

#### 服务相关角色

选择一个[服务相关角色](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html).

| 服务相关角色                         | 描述                                                                                                                                                                                                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的服务相关角色     | 如果你选择了这个角色，Rancher 会自动添加一个服务相关角色供集群使用。                                                                                                                                                                                              |
| 自定义：从你现有的服务相关角色中选择 | 如果你选择了这个角色，Rancher 让你从 AWS 中已经创建的服务相关角色中选择。关于在 AWS 中创建自定义服务相关角色的更多信息，请参阅[AWS 官方文档](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

#### 密钥加密

可选：为了加密密钥，选择或输入在[AWS 密钥管理服务（KMS）](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)中创建的密钥。

#### API Server 端点权限

配置公共/私人 API 访问是一个高级用例。详情请参考 [EKS 集群端点访问控制文档](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)。

#### 仅限私人使用的 API 端点

如果你在创建集群时启用了私有 API 端点访问并禁用了公共 API 端点访问，那么为了让 Rancher 成功连接到集群，你必须采取一个额外的步骤。在这种情况下，将显示一个弹出窗口，其中有一条命令，你将在集群上运行该命令，以便向 Rancher 注册。一旦集群被配置，你可以在任何可以连接到集群的 Kubernetes API 的地方运行显示的命令。

有两种方法可以避免这个额外的手动步骤。

- 你可以在创建集群时，用私人和公共 API 端点访问来创建集群。你可以在集群创建并处于活动状态后禁用公共访问，Rancher 将继续与 EKS 集群通信。
- 你可以确保 Rancher 与 EKS 集群共享一个子网。然后可以使用安全组来使 Rancher 与集群的 API 端点进行通信。在这种情况下，不需要注册集群的命令，Rancher 将能够与你的集群进行通信。关于配置安全组的更多信息，请参考[安全组文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)。

#### 公用的端点

可以选择通过明确的 CIDR 块来限制对公共端点的访问。

如果你限制对特定 CIDR 块的访问，那么建议你也启用私有访问，以避免失去与集群的网络通信。

启用私有访问需要以下条件之一。

- Rancher 的 IP 必须是允许的 CIDR 块的一部分
- 应启用私有访问，Rancher 必须与集群共享一个子网，并拥有对集群的网络访问权，这可以用安全组来进行配置

关于集群端点的公共和私人访问的更多信息，请参考[Amazon EKS 文档。](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)

#### 子网

| 选项                                | 描述                                                                                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的 VPC 和子网     | 在配置你的集群时，Rancher 生成了一个新的 VPC，有 3 个公共子网。                                                                                                        |
| 自定义：从你现有的 VPC 和子网中选择 | 在配置你的集群时，Rancher 将你的控制平面和节点配置为使用你已经[在 AWS 中创建的 VPC 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)。 |

欲了解更多信息，请参阅 AWS 文档中的[集群 VPC 注意事项](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html)。根据你在上一步骤中的选择，按照下面的一组说明进行操作。

- [什么是亚马逊 VPC？](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPCs 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

#### 安全组

请参考 AWS 文档：

- [集群安全组的注意事项](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
- [VPC 的安全组](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [创建一个安全组](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html#getting-started-create-security-group)

#### 日志

配置控制平面的日志，以发送至 Amazon CloudWatch。对于从你的集群发送到 CloudWatch Logs 的任何日志，你将被收取标准的 CloudWatch Logs 数据摄入和存储费用。

每种日志类型对应于 Kubernetes 控制平面的一个组件。要了解这些组件的更多信息，请参阅 Kubernetes 文档中的[Kubernetes 组件](https://kubernetes.io/docs/concepts/overview/components/)。

关于 EKS 控制平面日志的更多信息，请参考官方的[文档](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)。

#### Managed Node Groups

亚马逊 EKS 管理的节点组可以为亚马逊 EKS Kubernetes 集群自动配置和生命周期管理节点（亚马逊 EC2 实例）。

关于节点组如何工作以及如何配置的更多信息，请参阅[EKS 文档](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html)。

##### 自带启动模板

可以提供启动模板的 ID 和版本，以方便配置节点组中的 EC2 实例。如果提供了一个启动模板，那么下面的设置都不能在 Rancher 中配置。因此，使用启动模板需要在启动模板中指定以下列表中的所有必要和期望的设置。还要注意的是，如果提供了启动模板的 ID 和版本，那么只有模板版本可以被更新。使用一个新的模板 ID 将需要创建一个新的管理节点组。

| 选项         | 描述                                                                                                                                                   | 是否必填 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 实例类型     | 为你要配置的实例选择[硬件规格]（https://aws.amazon.com/ec2/instance-types/）。                                                                         | 是       |
| Image ID     | 为节点指定一个自定义 AMI。与 EKS 一起使用的自定义 AMI 必须是[正确配置的](https://aws.amazon.com/premiumsupport/knowledge-center/eks-custom-linux-ami/) | 否       |
| 节点卷大小   | 启动模板必须指定一个具有所需大小的 EBS 卷                                                                                                              | 是       |
| SSH 密钥     | 一个将被添加到实例的密钥，以提供对节点的 SSH 访问                                                                                                      | 否       |
| User Data    | 云启动脚本为[MIME 多部分格式](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)                        | 否       |
| 实例资源标签 | 对节点组中的每个 EC2 实例进行标记                                                                                                                      | 否       |

##### Rancher 管理的启动模板

如果你没有指定一个启动模板，那么你将能够在 Rancher UI 中配置上述选项，并且所有这些选项都可以在创建后更新。为了利用所有这些选项，Rancher 将为你创建和管理一个启动模板。Rancher 中的每个集群将有一个 Rancher 管理的启动模板，每个没有指定启动模板的管理节点组将有一个管理的启动模板的版本。这个启动模板的名称将有前缀 "Rancher-managed-lt-"，后面是集群的显示名称。此外，Rancher 管理的启动模板将被标记为键 "rancher-managed-template "和值 "do-not-modify-or-delete"，以帮助识别它是 Rancher 管理的。重要的是，这个启动模板及其版本不能被修改、删除，或用于任何其他集群或管理的节点组。这样做可能会导致你的节点组被 "降级"，需要销毁和重新创建。

##### 自定义 AMI

如果你指定了一个自定义的 AMI，无论是在启动模板中还是在 Rancher 中，那么这个镜像必须[正确配置](https://aws.amazon.com/premiumsupport/knowledge-center/eks-custom-linux-ami/)，你必须提供用户数据来[启动节点](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-custom-ami)。这被认为是一个高级用例，理解这些要求是必须的。

如果你指定的启动模板不包含自定义 AMI，那么亚马逊将使用[EKS 优化的 AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html)，用于 Kubernetes 版本和选定区域。你也可以选择一个[启用 GPU 的实例](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html#gpu-ami)，以获得受益的工作负载。

> **注意**
> 如果在下拉菜单或启动模板中提供了自定义 AMI，Rancher 中的 GPU 启用实例设置会被忽略。

#### Spot instances

Spot 实例现在[由 EKS 支持](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types-spot)。如果指定了一个启动模板，亚马逊建议该模板不要提供实例类型。相反，亚马逊建议提供多种实例类型。如果节点组的 "Request Spot Instances "复选框被启用，那么你将有机会提供多种实例类型。

> **注意**
> 在这种情况下，你在实例类型下拉菜单中的任何选择都将被忽略，你必须在 "Spot Instance Types "部分指定至少一种实例类型。此外，与 EKS 一起使用的启动模板不能请求现货实例。请求现货实例必须是 EKS 配置的一部分。

##### 节点组设置

以下设置也是可配置的。除 "节点组名称 "外，所有这些都可以在创建节点组后进行编辑。

| 选项            | 描述                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 节点组名称      | 节点组名的称                                                                                                                            |
| 期待的 ASG 规模 | 所需的实例数量。                                                                                                                        |
| 最大 ASG 规模   | 实例的最大数量。此设置在[Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)安装后才会生效。  |
| 最小 ASG 规模   | 实例的最小数量。此设置在[Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)安装后才会生效。. |
| 标签            | 应用于管理节点组中的节点的 Kubernetes 标签。                                                                                            |
| Tags            | 这些是被管理的节点组的标签，不会传播到任何相关的资源。                                                                                  |

### 2.5.0-2.5.5

#### 账户权限

使用为你的 IAM 策略获得的信息填写区域和云凭证这两个字段。

| 配置   | 描述                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 区域   | 从下拉菜单中选择在哪个区域创建集群。                                                                                                              |
| 云凭证 | 选择你为你的 IAM 策略创建的云凭证。关于在 Rancher 中创建云证书的更多信息，请参考[本页](/docs/rancher2.5/user-settings/cloud-credentials/_index)。 |

#### 服务相关角色

| 服务相关角色                         | 描述                                                                                                                                                                                                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的服务相关角色     | 如果你选择了这个角色，Rancher 会自动添加一个服务相关角色供集群使用。                                                                                                                                                                                              |
| 自定义：从你现有的服务相关角色中选择 | 如果你选择了这个角色，Rancher 让你从 AWS 中已经创建的服务相关角色中选择。关于在 AWS 中创建自定义服务相关角色的更多信息，请参阅[AWS 官方文档](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

#### 密钥加密

可选：为了加密密钥，选择或输入在[AWS 密钥管理服务（KMS）](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)中创建的密钥。

#### API Server 端点权限

配置公共/私人 API 访问是一个高级用例。详情请参考 [EKS 集群端点访问控制文档](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)。

#### 仅限私人使用的 API 端点

如果你在创建集群时启用了私有 API 端点访问并禁用了公共 API 端点访问，那么为了让 Rancher 成功连接到集群，你必须采取一个额外的步骤。在这种情况下，将显示一个弹出窗口，其中有一条命令，你将在集群上运行该命令，以便向 Rancher 注册。一旦集群被配置，你可以在任何可以连接到集群的 Kubernetes API 的地方运行显示的命令。

有两种方法可以避免这个额外的手动步骤。

- 你可以在创建集群时，用私人和公共 API 端点访问来创建集群。你可以在集群创建并处于活动状态后禁用公共访问，Rancher 将继续与 EKS 集群通信。
- 你可以确保 Rancher 与 EKS 集群共享一个子网。然后可以使用安全组来使 Rancher 与集群的 API 端点进行通信。在这种情况下，不需要注册集群的命令，Rancher 将能够与你的集群进行通信。关于配置安全组的更多信息，请参考[安全组文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)。

#### 公用的端点

可以选择通过明确的 CIDR 块来限制对公共端点的访问。

如果你限制对特定 CIDR 块的访问，那么建议你也启用私有访问，以避免失去与集群的网络通信。

启用私有访问需要以下条件之一。

- Rancher 的 IP 必须是允许的 CIDR 块的一部分
- 应启用私有访问，Rancher 必须与集群共享一个子网，并拥有对集群的网络访问权，这可以用安全组来进行配置

关于集群端点的公共和私人访问的更多信息，请参考[Amazon EKS 文档。](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)

#### 子网

| 选项                                | 描述                                                                                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的 VPC 和子网     | 在配置你的集群时，Rancher 生成了一个新的 VPC，有 3 个公共子网。                                                                                                        |
| 自定义：从你现有的 VPC 和子网中选择 | 在配置你的集群时，Rancher 将你的控制平面和节点配置为使用你已经[在 AWS 中创建的 VPC 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)。 |

欲了解更多信息，请参阅 AWS 文档中的[集群 VPC 注意事项](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html)。根据你在上一步骤中的选择，按照下面的一组说明进行操作。

- [什么是亚马逊 VPC？](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPCs 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

#### 安全组

请参考 AWS 文档：

- [集群安全组的注意事项](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
- [VPC 的安全组](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [创建一个安全组](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html#getting-started-create-security-group)

#### 日志

配置控制平面的日志，以发送至 Amazon CloudWatch。对于从你的集群发送到 CloudWatch Logs 的任何日志，你将被收取标准的 CloudWatch Logs 数据摄入和存储费用。

每种日志类型对应于 Kubernetes 控制平面的一个组件。要了解这些组件的更多信息，请参阅 Kubernetes 文档中的[Kubernetes 组件](https://kubernetes.io/docs/concepts/overview/components/)。

关于 EKS 控制平面日志的更多信息，请参考官方的[文档](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)。

#### Managed Node Groups

<a id="managed-node-groups-2-5"></a>

亚马逊 EKS 管理的节点组可以为亚马逊 EKS Kubernetes 集群自动配置和生命周期管理节点（亚马逊 EC2 实例）。

关于节点组如何工作以及如何配置的更多信息，请参阅[EKS 文档](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html)。

亚马逊将使用[EKS-optimized AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html)为 Kubernetes 版本。你可以配置该 AMI 是否启用了 GPU。

| 选项            | 描述                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 节点组名称      | 节点组名的称                                                                                                                            |
| 期待的 ASG 规模 | 所需的实例数量。                                                                                                                        |
| 最大 ASG 规模   | 实例的最大数量。此设置在[Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)安装后才会生效。  |
| 最小 ASG 规模   | 实例的最小数量。此设置在[Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)安装后才会生效。. |

### 2.5.0 之前

#### 账户权限

使用为你的 IAM 策略获得的信息，填写以下字段。

| 配置       | 描述                                 |
| ---------- | ------------------------------------ |
| 区域       | 从下拉菜单中选择要建立集群的地理区域 |
| Access Key | 输入你为你的 IAM 策略创建的访问密钥  |
| Secret Key | 输入你为你的 IAM 策略创建的密钥      |

#### 服务相关角色

选择一个[服务相关角色](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html).

| 服务相关角色                         | 描述                                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的服务相关角色     | 如果你选择了这个角色，Rancher 会自动添加一个服务相关角色供集群使用。                                           |
| 自定义：从你现有的服务相关角色中选择 | 如果你选择了这个角色，Rancher 让你从 AWS 中已经创建的服务相关角色中选择。关于在 AWS 中创建自定义服务相关角色的 |

更多信息，请参阅[AWS 官方文档](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

#### Worker 节点的公网 IP

你对这个选项的选择决定了 VPC 和子网的可用选项。

| 选项 | 描述                                                                                                                                           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 是   | 当你的集群节点被配置时，他们被分配了一个私人和公共 IP 地址。                                                                                   |
| 否   | 如果你选择这个选项，你还必须选择一个**VPC 和子网**，允许你的实例访问互联网。这种访问是必需的，以便你的工作节点可以连接到 Kubernetes 控制平面。 |

#### VPC 和子网

可用的选项取决于[worker 节点的公共 IP](#public-ip-for-worker-nodes)。

| 选项                                | 描述                                                                                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 标准：Rancher 生成的 VPC 和子网     | 在配置你的集群时，Rancher 生成了一个新的 VPC，有 3 个公共子网。                                                                                                        |
| 自定义：从你现有的 VPC 和子网中选择 | 在配置你的集群时，Rancher 将你的控制平面和节点配置为使用你已经[在 AWS 中创建的 VPC 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)。 |

更多信息，请参阅[AWS 官方文档](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。

- [什么是亚马逊 VPC？](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPCs 和子网](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

如果你选择为集群的工作节点分配一个公共 IP 地址，你可以选择 Rancher 自动生成的 VPC（即**标准：Rancher 生成的 VPC 和子网**），或者选择你已经在 AWS 创建的 VPC（即**自定义：从你现有的 VPC 和子网中选择**）。选择最适合你使用情况的选项。

如果你使用的是**定制：从你现有的 VPC 和子网中选择**。

(如果你使用**标准**，请跳到[实例选项])](#select-instance-options-2-4)

1. 请确保**自定义：从你现有的 VPC 和子网中选择**。

1. 从显示的下拉菜单中，选择一个 VPC。

1. 单击**下一步：选择子网**。然后在显示的**子网**中选择一个。

1. 单击**下一步：选择安全组**。
   {{% /accordion %}}

如果你的工作节点只有私有 IP，你还必须选择一个**VPC 和子网**，让你的实例能够访问互联网。这种访问是必需的，这样你的工作节点才能连接到 Kubernetes 控制平面。

按照下面的步骤进行。

> 提示：当只使用私有 IP 地址时，你可以通过创建一个有两个子网的 VPC 来提供你的节点的互联网访问，一个私有网和一个公共网。私有集应该将其路由表配置为指向公共集的 NAT。关于从私有子网路由流量的更多信息，请参见[AWS 官方文档](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html)。

1. 从显示的下拉菜单中，选择一个 VPC。

1. 单击**下一步。选择子网**。然后从显示的**子网**中选择一个。

### Security Group

请参考 AWS 文档：

- [集群安全组的注意事项](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
- [VPC 的安全组](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [创建一个安全组](https://docs.aws.amazon.com/vpc/latest/userguide/getting-started-ipv4.html#getting-started-create-security-group)

### 实例选项

实例类型和工作节点的大小会影响每个工作节点的可用 IP 地址。更多信息请参见此[文档](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI)。

| 选项            | 描述                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 实例类型        | 为你要配置的实例选择[硬件规格]（https://aws.amazon.com/ec2/instance-types/）。                                                                                                                                                                                                             |
| 自定义 AMI 覆盖 | 如果你想使用一个自定义的[Amazon Machine Image](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html#creating-an-ami)(AMI)，请在这里指定它。默认情况下，Rancher 将使用你选择的 EKS 版本的[EKS 优化 AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html)。 |
| 期待 ASG 大小   | 你的集群将提供的实例的数量。                                                                                                                                                                                                                                                               |
| User Data       | 可以通过自定义命令来执行自动配置任务 **警告：修改这个可能会导致你的节点无法加入集群。** \_注意：从 v2.2.0 开始可用。                                                                                                                                                                       |

## 故障排查

对于您的 Amazon EKS Kubernetes 集群的任何问题或故障排查细节，请参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html)。

## AWS 服务事件

查找任何 AWS 服务事件的信息，请参考[此页](https://status.aws.amazon.com/)。

## 安全性和合规性

对于您的 Amazon EKS Kubernetes 集群的安全性和合规性的更多信息，请参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/shared-responsibilty.html)。

## 教程

AWS 开源博客上的这篇[教程](https://aws.amazon.com/blogs/opensource/managing-eks-clusters-rancher/)将指导您如何使用 Rancher 设置一个 EKS 集群，并部署一个可公开访问的应用程序来测试集群。并部署一个通过使用其他开源软件如 Grafana 和 influxdb 来实时监控地理信息的示例项目。

## 附录 - 最小 EKS 权限

此文档描述了在使用 Rancher 中的 EKS 驱动时，所需要的最小权限。

这里记录的是在 Rancher 中使用 EKS 驱动的所有功能所需的最低权限。Rancher 需要额外的权限来配置服务相关角色和 VPC 资源。这些资源可以选择在集群创建之前创建，并在定义集群配置时可以选择。

| 资源         | 描述                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| 服务相关角色 | 服务相关角色为 Kubernetes 提供它代表你管理资源所需的权限。Rancher 可以通过以下服务相关角色权限创建服务相关角色。 |
| VPC          | 提供由 EKS 和工作节点利用的隔离网络资源。Rancher 可以用以下 VPC 权限创建 VPC 资源。                              |

因为很多要创建的资源的 ARN（Amazon 资源名称）不能在创建 EKS 集群之前确定，所以需要使用`*`来表示目标资源。某些权限（例如 `ec2：CreateVpc`）仅在 Rancher 需要创建这些资源的时候使用。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2Permisssions",
      "Effect": "Allow",
      "Action": [
        "ec2:RunInstances",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:DescribeVpcs",
        "ec2:DescribeTags",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeRouteTables",
        "ec2:DescribeLaunchTemplateVersions",
        "ec2:DescribeLaunchTemplates",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeImages",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeAccountAttributes",
        "ec2:DeleteTags",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteKeyPair",
        "ec2:CreateTags",
        "ec2:CreateSecurityGroup",
        "ec2:CreateLaunchTemplateVersion",
        "ec2:CreateLaunchTemplate",
        "ec2:CreateKeyPair",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EKSPermissions",
      "Effect": "Allow",
      "Action": [
        "eks:DeleteFargateProfile",
        "eks:DescribeFargateProfile",
        "eks:ListTagsForResource",
        "eks:UpdateClusterConfig",
        "eks:DescribeNodegroup",
        "eks:ListNodegroups",
        "eks:DeleteCluster",
        "eks:CreateFargateProfile",
        "eks:DeleteNodegroup",
        "eks:UpdateNodegroupConfig",
        "eks:DescribeCluster",
        "eks:ListClusters",
        "eks:UpdateClusterVersion",
        "eks:UpdateNodegroupVersion",
        "eks:ListUpdates",
        "eks:CreateCluster",
        "eks:UntagResource",
        "eks:CreateNodegroup",
        "eks:ListFargateProfiles",
        "eks:DescribeUpdate",
        "eks:TagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:ListRoleTags",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:AddRoleToInstanceProfile",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:DeleteRole",
        "iam:CreateInstanceProfile",
        "iam:ListInstanceProfilesForRole",
        "iam:PassRole",
        "iam:GetInstanceProfile",
        "iam:ListRoles",
        "iam:ListInstanceProfiles",
        "iam:DeleteInstanceProfile"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationPermisssions",
      "Effect": "Allow",
      "Action": [
        "cloudformation:DescribeStackResource",
        "cloudformation:ListStackResources",
        "cloudformation:DescribeStackResources",
        "cloudformation:DescribeStacks",
        "cloudformation:ListStacks",
        "cloudformation:CreateStack",
        "cloudformation:DeleteStack"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AutoScalingPermissions",
      "Effect": "Allow",
      "Action": [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:UpdateAutoScalingGroup",
        "autoscaling:TerminateInstanceInAutoScalingGroup",
        "autoscaling:CreateOrUpdateTags",
        "autoscaling:DeleteAutoScalingGroup",
        "autoscaling:CreateAutoScalingGroup",
        "autoscaling:DescribeAutoScalingInstances",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeScalingActivities",
        "autoscaling:CreateLaunchConfiguration",
        "autoscaling:DeleteLaunchConfiguration"
      ],
      "Resource": "*"
    }
  ]
}
```

### 服务相关角色权限

Rancher 将创建一个具有以下信任策略的服务相关角色：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
```

这个角色也将有两个角色策略附件，有以下策略 ARN：

```
arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
arn:aws:iam::aws:policy/AmazonEKSServicePolicy
```

在 EKS 集群创建过程中，Rancher 代表用户创建服务角色所需的权限。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IAMPermisssions",
      "Effect": "Allow",
      "Action": [
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:CreateRole",
        "iam:CreateServiceLinkedRole",
        "iam:DeleteInstanceProfile",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListInstanceProfiles",
        "iam:ListInstanceProfilesForRole",
        "iam:ListRoles",
        "iam:ListRoleTags",
        "iam:PassRole",
        "iam:RemoveRoleFromInstanceProfile"
      ],
      "Resource": "*"
    }
  ]
}
```

### VPC 权限

Rancher 创建 VPC 和相关资源所需的权限如下：

```json
{
  "Sid": "VPCPermissions",
  "Effect": "Allow",
  "Action": [
    "ec2:ReplaceRoute",
    "ec2:ModifyVpcAttribute",
    "ec2:ModifySubnetAttribute",
    "ec2:DisassociateRouteTable",
    "ec2:DetachInternetGateway",
    "ec2:DescribeVpcs",
    "ec2:DeleteVpc",
    "ec2:DeleteTags",
    "ec2:DeleteSubnet",
    "ec2:DeleteRouteTable",
    "ec2:DeleteRoute",
    "ec2:DeleteInternetGateway",
    "ec2:CreateVpc",
    "ec2:CreateSubnet",
    "ec2:CreateSecurityGroup",
    "ec2:CreateRouteTable",
    "ec2:CreateRoute",
    "ec2:CreateInternetGateway",
    "ec2:AttachInternetGateway",
    "ec2:AssociateRouteTable"
  ],
  "Resource": "*"
}
```

## 同步

EKS 供应者可以在 Rancher 和供应商之间同步 EKS 集群的状态。

### 配置刷新时间间隔

#### v2.5.8 及之后

`eks-refresh-cron`设置已被废弃。它已经被迁移到`eks-refresh`设置，它是一个代表秒的整数。

默认值是 300 秒。

同步时间间隔可以通过运行`kubectl edit setting eks-refresh`来改变。

如果之前设置了`eks-refresh-cron`，迁移将自动发生。

刷新窗口越短，越不可能发生任何竞赛条件，但它确实增加了遇到 AWS API 可能存在的请求限制的可能性。

#### v2.5.8 之前

可以通过设置`eks-refresh-cron`来改变刷新时间间隔。这个设置接受 Cron 格式的值。默认值是`*/5 * * *`。

刷新窗口越短，越不可能发生任何竞赛条件，但它确实增加了遇到 AWS API 可能存在的请求限制的可能性。
