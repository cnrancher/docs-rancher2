---
title: 设置 Amazon 云提供商
weight: 1
---

使用 `Amazon` 云提供商时，你可以利用以下功能：

- **负载均衡器**：在 **Port Mapping** 中选择 `Layer-4 Load Balancer` 或使用 `type: LoadBalancer` 启动 `Service` 时，启动 AWS 弹性负载均衡器 (ELB)。
- **持久卷**：允许你将 AWS 弹性块存储 (EBS) 用于持久卷。

有关 Amazon 云提供商的所有信息，请参阅 [cloud-provider-aws 自述文件](https://kubernetes.github.io/cloud-provider-aws/)。

要设置 Amazon 云提供商：

1. [创建一个 IAM 角色并附加到实例](#1-create-an-iam-role-and-attach-to-the-instances)
2. [配置 ClusterID](#2-configure-the-clusterid)

### 1. 创建 IAM 角色并附加到实例

添加到集群的所有节点都必须能够与 EC2 交互，以便它们可以创建和删除资源。你可以使用附加到实例的 IAM 角色来启用交互。请参阅 [Amazon 文档：创建 IAM 角色](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#create-iam-role) 来创建 IAM 角色。有两个示例策略：

* 第一个策略适用于具有 `controlplane` 角色的节点。这些节点必须能够创建/删除 EC2 资源。以下 IAM 策略是一个示例，请根据你的实际用例移除不需要的权限。
* 第二个策略适用于具有 `etcd` 或 `worker` 角色的节点。这些节点只需能够从 EC2 检索信息。

在创建 [Amazon EC2 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/ec2/)时，你必须在创建**节点模板**时填写创建的 IAM 角色的 **IAM Instance Profile Name**（不是 ARN）。

创建[自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes)时，你必须手动将 IAM 角色附加到实例。

具有 `controlplane` 角色的节点的 IAM 策略：

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
    "Resource": [
      "*"
    ]
  }
]
}
```

具有 `etcd` 或 `worker` 角色的节点的 IAM 策略：

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

### 2. 创建 ClusterID

以下资源需要使用 `ClusterID` 进行标记：

- **Nodes**：Rancher 中添加的所有主机。
- **Subnet**：集群使用的子网。
- **Security Group**：用于你的集群的安全组。

> **注意**：不要标记多个安全组。创建弹性负载均衡器 (ELB) 时，标记多个组会产生错误。

创建 [Amazon EC2 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/ec2/)时，会自动为创建的节点配置 `ClusterID`。其他资源仍然需要手动标记。

使用以下标签：

**Key** = `kubernetes.io/cluster/CLUSTERID` **Value** = `owned`

`CLUSTERID` 可以是任何字符串，只要它在所有标签集中相同即可。

将标签的值设置为 `owned` 会通知集群带有该标签的所有资源都由该集群拥有和管理。如果你在集群之间共享资源，你可以将标签更改为：

**Key** = `kubernetes.io/cluster/CLUSTERID` **Value** = `shared`.

### 使用 Amazon Elastic Container Registry (ECR)

在将[创建 IAM 角色并附加到实例](#1-create-an-iam-role-and-attach-to-the-instances)中的 IAM 配置文件附加到实例时，kubelet 组件能够自动获取 ECR 凭证。使用低于 v1.15.0 的 Kubernetes 版本时，需要在集群中配置 Amazon 云提供商。从 Kubernetes 版本 v1.15.0 开始，kubelet 无需在集群中配置 Amazon 云提供商即可获取 ECR 凭证。