---
title: 配置 Cloud Provider
---

_Cloud Provider_ 是 Kubernetes 中的一个模块，它提供了一个用于管理节点、负载均衡和网络路由的接口。有关更多信息，请参阅[关于 Cloud Provider 的官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。

当在 Rancher 中设置 Cloud Provider 时，如果您使用的 Cloud Provider 支持这种自动化，Rancher Server 可以在启动 Kubernetes 定义时自动配置新的节点，负载均衡器或持久存储设备。

## Cloud Provider 选项

默认情况下，**Cloud Provider** 选项设置为“无”。支持的 Cloud Provider 包括:

- Amazon
- Azure

`自定义` Cloud Provider 可以用来配置任意的 [Kubernetes Cloud Provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。

对于自定义 Cloud Provider 选项，您可以参考 [RKE 文档](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/)关于如何为您的特定 Cloud Provider 编辑 yaml 文件。有一些特定的 Cloud Provider 具有更详细的配置文档：

- [vSphere](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/vsphere/)
- [Openstack](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/openstack/)

> **警告：** 如果您配置了不符合先决条件的节点的 Cloud Provider 集群，则集群将无法正确配置。下面列出了支持的 Cloud Provider 的先决条件。

## 设置 Amazon Cloud Provider

使用`Amazon`Cloud Provider 时，您可以使用以下功能:

- **负载均衡：** 在**端口映射**中选择`4 层负载均衡`时或在启动带有`type: LoadBalancer`的`Service`时，自动启动 AWS Elastic Load Balancer(ELB)。
- **持久卷：** 允许您将 AWS Elastic Block Store(EBS) 用于持久卷。

请参阅[Cloud Provider AWS 自述文档](https://github.com/kubernetes/cloud-provider-aws/blob/master/README.md)获取有关 Amazon Cloud Provider 的所有信息。

设置 Amazon Cloud Provider。

### 创建 IAM 角色并附加到实例

添加到集群的所有节点必须能够与 EC2 交互，以便它们可以创建和删除资源。您可以使用附加到实例的 IAM 角色来启用此交互。请参阅[Amazon 文档：创建 IAM Role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#create-iam-role)了解如何创建 IAM 角色。有两个示例策略：

- 第一个策略是针对具有`controlplane`角色的节点。这些节点必须能够创建/删除 EC2 资源。下面的 IAM 策略是一个例子，请在例子中删除任何不需要的权限。
- 第二个策略是针对具有`etcd`或`worker`角色的节点。这些节点只需要能够从 EC2 检索信息。

创建 [Amazon EC2 集群](/docs/cluster-provisioning/rke-clusters/node-pools/ec2/_index)时，必须在创建**节点模板**时填写创建的 IAM 角色的**Iam 实例配置文件名称**（而不是 ARN）。

创建[自定义集群](/docs/cluster-provisioning/custom-clusters/_index)时，必须手动将 IAM 角色附加到实例。

具有`controlplane`角色的节点的 IAM 策略:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeTags",
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVolumes",
        "ec2:CreateSecurityGroup",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifyVolume",
        "ec2:AttachVolume",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteVolume",
        "ec2:DetachVolume",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:DescribeVpcs",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:AttachLoadBalancerToSubnets",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancerPolicy",
        "elasticloadbalancing:CreateLoadBalancerListeners",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteLoadBalancerListeners",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:DetachLoadBalancerFromSubnets",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:CreateListener",
        "elasticloadbalancing:CreateTargetGroup",
        "elasticloadbalancing:DeleteListener",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:DescribeLoadBalancerPolicies",
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeTargetHealth",
        "elasticloadbalancing:ModifyListener",
        "elasticloadbalancing:ModifyTargetGroup",
        "elasticloadbalancing:RegisterTargets",
        "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
        "iam:CreateServiceLinkedRole",
        "kms:DescribeKey"
      ],
      "Resource": ["*"]
    }
  ]
}
```

具有`etcd`或`worker`角色的节点的 IAM 策略:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

### 配置 ClusterID

以下资源需要标记上`ClusterID`:

- **节点**：在 Rancher 中添加的所有主机。
- **子网**：用于集群的子网
- **安全组**：用于集群的安全组。

  > **注意：** 不要标记多个安全组。创建弹性负载均衡器时，标记多个组会产生错误。

应该使用的标签是:

```
Key=kubernetes.io/cluster/<CLUSTERID>, Value=owned
```

`<CLUSTERID>`可以是你选择的任何字符串。但是，必须在您标记的每个资源上使用相同的字符串。将标记值设置为`owned`会通知集群，使用`<CLUSTERID>`标记的所有资源都由该集群拥有和管理。

如果在集群之间共享资源，则可以将标记更改为:

```
Key=kubernetes.io/cluster/CLUSTERID, Value=shared
```

### 使用 Amazon Elastic Container Registry (ECR)

将上面提到的 IAM 配置文件附加到实例时，kubelet 组件能够自动获取 ECR 凭据。当使用早于 v1.15.0 的 Kubernetes 版本时，需要在集群中配置 Amazon Cloud Provider。从 Kubernetes 版本 v1.15.0 开始，kubelet 可以自动获取 ECR 凭据，而无需在集群中配置 Amazon Cloud Provider。

## 设置 Azure Cloud Provider

使用 "Azure" Cloud Provider 时，您可以使用以下功能:

- **负载均衡：** 在特定网络安全组中启动 Azure 负载均衡器。

- **持久卷：** 支持使用具有标准和高级存储帐户的 Azure Blob 磁盘和 Azure 托管磁盘。

- **网络存储：** 通过 CIFS 安装支持 Azure 文件。

Azure 订阅不支持以下帐户类型:

- 单租户帐户（即没有订阅的帐户）。
- 多订阅帐户。

要设置 Azure Cloud Provider 需要配置以下凭据:

### 设置 Azure 租户 ID

浏览[Azure 控制台](https://portal.azure.com), 登录并跳转**Azure Active Directory** 然后选择 **属性**. 您的**目录 ID** 是您的 **租户 ID** (tenantID).

如果你想使用 Azure CLI，你可以运行命令`az account show`来获取信息。

### 设置 Azure 客户端 ID 和 Azure 客户端密钥

浏览[Azure Portal](https://portal.azure.com)，登录并按照以下步骤创建**应用注册**中的**Azure 客户端 ID** (aadClientId)和**Azure 客户端密钥** (aadClientSecret)。

1. 选择**Azure Active Directory**.
1. 选择**应用注册**。
1. 选择**注册应用程序**。
1. 输入**名称**, 在**Application 类型**中选择`Web app / API`和在这种情况下，可以是任何东西的**Sign-on URL**。
1. 选择**创建**。

在**应用注册**视图，你应该看到你创建的应用程序注册。列中显示的值**应用 ID**便是您需要的**Azure 客户端 ID**。

下一步是生成**Azure 客户端密钥**:

1. 打开您创建的应用程序注册。
1. 在**设置**视图中，打开**键**。
1. 输入**密钥说明**，选择到期时间并选择**保存**。
1. **Value**列中显示的生成值是您需要用作**Azure 客户端密钥**的值。此值将只显示一次。

### 配置应用程序注册权限

您需要做的最后一件事是为您的应用程序注册分配适当的权限

1. 转到**更多服务**，搜索**订阅**并打开它。
1. 打开**访问控制(IAM)**。
1. 选择**添加**。
1. 对于**角色**，选择`参与者`。
1. 对于**选择**，选择您创建的应用程序注册名称。
1. 选择**保存**。

### 设置 Azure 网络安全组名称

需要自定义 Azure 网络安全组（securityGroupName）才能允许 Azure 负载均衡器工作。

如果使用 Rancher 的 Azure 主机驱动设置主机，则需要手动编辑它们以将它们分配给此网络安全组。

在设置过程中，您应该已将自定义主机分配给此网络安全组。

只有为负载均衡后台的主机需要在此组中。
