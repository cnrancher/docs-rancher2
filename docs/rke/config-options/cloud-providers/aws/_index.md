---
title: AWS
---

## 概述

您只需要将名称设置为`aws`，就可以启用 AWS。所有集群节点必须已经配置了 [适当的 IAM 角色](#配置-IAM)，并且您的 AWS 资源必须 [标记 AWS 资源](#标记-AWS-资源)。

```yaml
cloud_provider:
  name: aws
```

## 配置 IAM

在启用了 AWS 云提供商的集群中，节点必须至少拥有`ec2:Describe*`动作。

为了使用 Kubernetes 的弹性负载均衡器(ELB)和 EBS 卷，节点需要拥有具有适当权限的 IAM 角色。

### 配置 controlplane 节点的 IAM 策略

请参考以下代码示例，配置具有 `controlplane`角色的节点的 IAM 策略：

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

### 配置 etcd 节点和 worker 节点的 IAM 策略

请参考以下代码示例，配置具有`etcd` or `worker`角色的节点的 IAM 策略：

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

## 标记 AWS 资源

AWS 云提供商使用标记来发现和管理资源，以下资源不会被 Kubernetes 或 RKE 自动标记，需要用户手动添加标记。

- **VPC**：集群使用的 VPC
- **子网**：集群使用的子网
- **EC2 实例**：为该集群启动的所有节点
- **安全组**：集群中各节点使用的安全组

> **注意：**如果创建`LoadBalancer`服务，且节点上连接有多个安全组，则必须仅将其中一个安全组标记为`owned`，以便 Kubernetes 知道要添加和删除哪个组的规则。允许使用一个未标记的安全组，但是，不建议在集群之间共享这个安全组。

[标记 Amazon EC2 资源](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)

`<CLUSTERID>`可以是你选择的任何字符串。但是，必须在标记的每个资源上使用相同的字符串。将标签值设置为`owned`会通知集群，所有用`<CLUSTERID>`标记的资源都只由这个集群拥有和管理。

| Key                                 | Value  |
| :---------------------------------- | :----- |
| kubernetes.io/cluster/`<CLUSTERID>` | shared |

如果您不在集群之间共享资源，您可以将标签改为：

| Key                                 | Value |
| :---------------------------------- | :---- |
| kubernetes.io/cluster/`<CLUSTERID>` | owned |

## 标记负载均衡器

在配置`LoadBalancer`服务时，Kubernetes 会尝试发现正确的子网，这也是通过标签来实现的，需要添加额外的子网标签，以确保在正确的子网中创建面向互联网和内部的 ELB。

[AWS 负载均衡器的子网标记](https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/load-balancing.html#subnet-tagging-for-load-balancers)
