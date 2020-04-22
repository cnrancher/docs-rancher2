---
title: 创建亚马逊 EKS 集群
description: Amazon EKS 为 Kubernetes 集群提供了一个托管的控制平面。为了确保高可用性，Amazon EKS 中的 Kubernetes 控制平面实例运行在多个可用区。Rancher 为部署和管理 Amazon EKS 中运行的 Kubernetes 集群提供了直观的用户界面。通过本指南，您将使用 Rancher 在您的 AWS 帐户中快速轻松地启动 Amazon EKS Kubernetes 集群。有关 Amazon EKS 的更多信息，参考EKS文档。
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
  - 创建亚马逊 EKS 集群
---

Amazon EKS 为 Kubernetes 集群提供了一个托管的控制平面。为了确保高可用性，Amazon EKS 中的 Kubernetes 控制平面实例运行在多个可用区。Rancher 为部署和管理 Amazon EKS 中运行的 Kubernetes 集群提供了直观的用户界面。通过本指南，您将使用 Rancher 在您的 AWS 帐户中快速轻松地启动 Amazon EKS Kubernetes 集群。有关 Amazon EKS 的更多信息，参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)。

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

3. 最后,按照[此处](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)的步骤为此用户创建 Access Key 和 Secret Key。

> **注意:** 定期轮换 Access Key 和 Secret Key 非常重要。参考[文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#rotating_access_keys_console)了解更多信息。

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

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 为 EKS 集群配置**账户访问**。

   | 设置       | 描述                                           |
   | ---------- | ---------------------------------------------- |
   | 区域       | 从下拉列表中选择要在其中创建集群的地理区域。。 |
   | Access Key | 输入之前创建的 Access Key                      |
   | Secret Key | 输入之前创建的 Secret Key                      |

1. 单击 **下一步: 配置集群**。然后选择[服务角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html)。

   | 服务角色                       | 描述                                                                                                                                                                                                                                                |
   | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 标准: Rancher 生成的服务角色。 | 如果选择此角色，Rancher 会自动添加一个服务角色以用于集群。                                                                                                                                                                                          |
   | 自定义: 从现有服务角色中选择。 | 如果您选择此角色，Rancher 允许您从已经在 AWS 中创建的服务角色中进行选择。有关在 AWS 中创建自定义服务角色的详细信息，参考[亚马逊文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role)。 |

1. 单击 **下一步: 选择 VPC 和 Subnet**。

1. 为**Worker 节点的公网 IP**选择一个选项。您对此选项的选择决定了**VPC 和 Subnet**可用的选项。

   | 选择          | 描述                                                                                                                                                                                                                |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 是            | 当您的集群节点被配置时，它们将被分配一个内网 IP 地址和一个外网 IP 地址。                                                                                                                                            |
   | 否：仅私有 IP | 当您的集群节点被配置时，它们将会只被分配一个内网 IP 地址。<br/><br/>如果您选择此选项，您还必须选择一个**VPC & Subnet**来允许您的实例访问 internet。此访问是必需的，以便您的工作节点可以连接到 Kubernetes 控制平面。 |

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

     如果您选择此选项，您还必须选择允许您的实例访问 internet 的**VPC & Subnet**。这个访问是必需的，这样您的工作节点才可以连接到 Kubernetes 控制平面。步骤如下：

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
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）

## 故障排查

对于您的 Amazon EKS Kubernetes 集群的任何问题或故障排查细节，请参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html)。

## AWS 服务事件

查找任何 AWS 服务事件的信息，请参考[此页](https://status.aws.amazon.com/)。

## 安全性和合规性

对于您的 Amazon EKS Kubernetes 集群的安全性和合规性的更多信息，请参考[文档](https://docs.aws.amazon.com/eks/latest/userguide/shared-responsibilty.html)。

## 教程

AWS 开源博客上的这篇[教程](https://aws.amazon.com/blogs/opensource/managing-eks-clusters-rancher/)将指导您如何使用 Rancher 设置一个 EKS 集群，并部署一个可公开访问的应用程序来测试集群。并部署一个通过使用其他开源软件如 Grafana 和 infloxdb 来实时监控地理信息的示例项目。
