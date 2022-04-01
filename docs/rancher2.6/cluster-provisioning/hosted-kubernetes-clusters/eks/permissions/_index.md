---
title: 最小 EKS 权限
weight: 1
---

此处提供在 Rancher 中使用 EKS 驱动所有功能所需的最小权限。Rancher 需要额外的权限来配置`服务角色`和 `VPC` 资源。你可以选择在创建集群**之前**创建这些资源，以便在定义集群配置时选择这些资源。

| 资源     | 描述                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------- |
| 服务角色 | 服务角色向 Kubernetes 提供管理资源所需的权限。Rancher 可以使用以下[服务角色权限](#service-role-permissions)来创建服务角色。 |
| VPC      | 提供 EKS 和 Worker 节点使用的隔离网络资源。Rancher 使用以下 [VPC 权限](#vpc-permissions)创建 VPC 资源。                     |

资源定位使用 `*` 作为在 Rancher 中创建 EKS 集群之前，无法已知创建的资源的名称（ARN）。

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
        "ec2:DescribeRegions",
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
      "Sid": "CloudFormationPermisssions",
      "Effect": "Allow",
      "Action": [
        "cloudformation:ListStacks",
        "cloudformation:ListStackResources",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackResources",
        "cloudformation:DescribeStackResource",
        "cloudformation:DeleteStack",
        "cloudformation:CreateStackSet",
        "cloudformation:CreateStack"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "iam:ListRoles",
        "iam:ListRoleTags",
        "iam:ListInstanceProfilesForRole",
        "iam:ListInstanceProfiles",
        "iam:ListAttachedRolePolicies",
        "iam:GetRole",
        "iam:GetInstanceProfile",
        "iam:DetachRolePolicy",
        "iam:DeleteRole",
        "iam:CreateRole",
        "iam:AttachRolePolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "KMSPermisssions",
      "Effect": "Allow",
      "Action": "kms:ListKeys",
      "Resource": "*"
    },
    {
      "Sid": "EKSPermisssions",
      "Effect": "Allow",
      "Action": [
        "eks:UpdateNodegroupVersion",
        "eks:UpdateNodegroupConfig",
        "eks:UpdateClusterVersion",
        "eks:UpdateClusterConfig",
        "eks:UntagResource",
        "eks:TagResource",
        "eks:ListUpdates",
        "eks:ListTagsForResource",
        "eks:ListNodegroups",
        "eks:ListFargateProfiles",
        "eks:ListClusters",
        "eks:DescribeUpdate",
        "eks:DescribeNodegroup",
        "eks:DescribeFargateProfile",
        "eks:DescribeCluster",
        "eks:DeleteNodegroup",
        "eks:DeleteFargateProfile",
        "eks:DeleteCluster",
        "eks:CreateNodegroup",
        "eks:CreateFargateProfile",
        "eks:CreateCluster"
      ],
      "Resource": "*"
    }
  ]
}
```

### 服务角色权限

指的是 Rancher 在 EKS 集群创建过程中，代表用户创建服务角色所需的权限。

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

创建 EKS 集群时，Rancher 将创建具有以下信任策略的服务角色：

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

此角色还将具有两个角色策略，其中包含以下策略 ARN：

```
arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
arn:aws:iam::aws:policy/AmazonEKSServicePolicy
```

### VPC 权限

Rancher 创建 VPC 和关联资源所需的权限。

```json
{
  "Version": "2012-10-17",
  "Statement": [
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
  ]
}
```
