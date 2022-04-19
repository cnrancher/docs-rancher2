---
title: 创建 EKS 集群
shortTitle: Amazon EKS
weight: 2110
---

Amazon EKS 为 Kubernetes 集群提供托管的 control plane。Amazon EKS 跨多个可用区运行 Kubernetes control plane 实例，以确保高可用性。Rancher 提供了一个直观的用户界面，用于管理和部署你运行在 Amazon EKS 中的 Kubernetes 集群。通过本指南，你将使用 Rancher 在你的 AWS 账户中快速轻松地启动 Amazon EKS Kubernetes 集群。有关 Amazon EKS 的更多信息，请参阅此[文档](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)。

- [Amazon Web 服务的先决条件](#prerequisites-in-amazon-web-services)
  - [Amazon VPC](#amazon-vpc)
  - [IAM 策略](#iam-policies)
- [创建 EKS 集群](#create-the-eks-cluster)
- [EKS 集群配置参考](#eks-cluster-configuration-reference)
- [架构](#architecture)
- [AWS 服务事件](#aws-service-events)
- [安全与合规](#security-and-compliance)
- [教程](#tutorial)
- [最小 EKS 权限](#minimum-eks-permissions)
- [同步](#syncing)
- [故障排查](#troubleshooting)
- [以编程方式创建 EKS 集群](#programmatically-creating-eks-clusters)

## Amazon Web 服务的先决条件

> **注意**：
> 部署到 Amazon AWS 会产生费用。有关详细信息，请参阅 [EKS 定价页面](https://aws.amazon.com/eks/pricing/)。

要在 EKS 上设置集群，你需要设置 Amazon VPC（虚拟私有云）。你还需要确保用于创建 EKS 集群的账号具有适当的[权限](#minimum-eks-permissions)。详情请参阅 [Amazon EKS 先决条件官方指南](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#eks-prereqs)。

### Amazon VPC

你需要建立一个 Amazon VPC 来启动 EKS 集群。VPC 使你能够将 AWS 资源启动到你定义的虚拟网络中。你可以自己设置一个 VPC，并在 Rancher 中创建集群时提供它。如果你创建过程中没有提供，Rancher 将创建一个 VPC。详情请参阅[教程：为你的 Amazon EKS 集群创建具有公有和私有子网的 VPC](https://docs.aws.amazon.com/eks/latest/userguide/create-public-private-vpc.html)。

### IAM 策略

Rancher 需要访问你的 AWS 账户才能在 Amazon EKS 中预置和管理你的 Kubernetes 集群。你需要在 AWS 账户中为 Rancher 创建一个用户，并定义该用户可以访问的内容。

1. 按照[此处](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)的步骤创建具有编程访问权限的用户。

2. 创建一个 IAM 策略，定义该用户在 AWS 账户中有权访问的内容。请务必仅授予此用户所需的最小访问权限。[此处](#minimum-eks-permissions)列出了 EKS 集群所需的最低权限。请按照[此处](https://docs.aws.amazon.com/eks/latest/userguide/EKS_IAM_user_policies.html)的步骤创建 IAM 策略并将策略绑定到你的用户。

3. 最后，按照[此处](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)的步骤为该用户创建访问密钥和密文密钥。

> **注意**：定期轮换访问密钥和密文密钥非常重要。有关详细信息，请参阅此[文档](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#rotating_access_keys_console)。

有关 EKS 的 IAM 策略的更多详细信息，请参阅 [Amazon EKS IAM 策略、角色和权限的官方文档](https://docs.aws.amazon.com/eks/latest/userguide/IAM_policies.html)。

## 创建 EKS 集群

使用 Rancher 配置你的 Kubernetes 集群。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 选择 **Amazon EKS**。
1. 输入**集群名称**。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 完成表单的其余部分。如需帮助，请参阅[配置参考](#eks-cluster-configuration-reference)。
1. 单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

## EKS 集群配置参考

有关 EKS 集群配置选项的完整列表，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/eks-config-reference)。

## 架构

下图展示了 Rancher 2.x 的上层架构。下图中，Rancher Server 管理两个 Kubernetes 集群，其中一个由 RKE 创建，另一个由 EKS 创建。

<figcaption>通过 Rancher 的认证代理管理 Kubernetes 集群</figcaption>

![架构]({{<baseurl>}}/img/rancher/rancher-architecture-rancher-api-server.svg)

## AWS 服务事件

有关 AWS 服务事件的信息，请参阅[此页面](https://status.aws.amazon.com/)。

## 安全与合规

默认情况下，只有创建集群的 IAM 用户或角色才能访问该集群。在没有额外配置的情况下，使用其他用户或角色访问集群将导致错误。在 Rancher 中，这意味着使用映射到未用于创建集群的用户或角色的凭证，导致未经授权的错误。除非用于注册集群的凭证与 EKSCtl 使用的角色或用户匹配，否则 EKSCtl 集群将不会注册到 Rancher。通过将其他用户和角色添加到 kube-system 命名空间中的 aws-auth configmap，可以授权其他用户和角色访问集群。如需更深入的解释和详细说明，请参阅此[文档](https://aws.amazon.com/premiumsupport/knowledge-center/amazon-eks-cluster-access/)。

有关 Amazon EKS Kubernetes 集群的安全性和合规性的更多信息，请参阅此[文档](https://docs.aws.amazon.com/eks/latest/userguide/shared-responsibilty.html)。

## 教程

AWS 开源博客上的这篇[教程](https://aws.amazon.com/blogs/opensource/managing-eks-clusters-rancher/)将指导你使用 Rancher 设置一个 EKS 集群，部署一个可公开访问的示例应用来测试集群，并部署一个使用其他开源软件（如 Grafana 和 influxdb）来实时监控地理信息的示例项目。

## 最小 EKS 权限

请参阅[此页面](./permissions)，了解在 Rancher 中使用 EKS 驱动所有功能所需的最小权限。

## 同步

EKS 配置者可以在 Rancher 和提供商之间同步 EKS 集群的状态。有关其工作原理的技术说明，请参阅[同步]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/syncing/)。

有关配置刷新间隔的信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/eks-config-reference/#configuring-the-refresh-interval)。

## 故障排查

如果你的更改被覆盖，可能是集群数据与 EKS 同步的方式导致的。不要在使用其他源（例如 EKS 控制台）对集群进行更改后，又在五分钟之内在 Rancher 中进行更改。有关其工作原理，以及如何配置刷新间隔的信息，请参阅[同步](#syncing)。

如果在修改或注册集群时返回未经授权的错误，并且集群不是使用你的凭证所属的角色或用户创建的，请参阅[安全与合规](#security-and-compliance)。

有关 Amazon EKS Kubernetes 集群的任何问题或故障排除详细信息，请参阅此[文档](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html)。

## 以编程方式创建 EKS 集群

通过 Rancher 以编程方式部署 EKS 集群的最常见方法是使用 Rancher 2 Terraform Provider。详情请参见[使用 Terraform 创建集群](https://registry.terraform.io/providers/rancher/rancher2/latest/docs/resources/cluster)。
