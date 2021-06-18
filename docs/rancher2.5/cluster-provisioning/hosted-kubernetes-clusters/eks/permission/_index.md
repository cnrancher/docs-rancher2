---
title: Minimum EKS Permissions
---

这里记录的是在 Rancher 中使用 EKS 驱动的所有功能所需的最低权限。Rancher 需要额外的权限来配置 "服务角色 "和 "VPC "资源。这些资源可以选择在创建集群之前创建，并在定义集群配置时可以选择。

| 资源         | 描述                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Service Role | 服务角色为 Kubernetes 提供它代表你管理资源所需的权限。Rancher 可以通过以下[服务角色权限]（#service-role-permissions）创建服务角色。 |
| VPC          | 提供由 EKS 和 worker 节点利用的隔离网络资源。Rancher 可以通过以下[VPC 权限]（#vpc-permissions）创建 VPC 资源。                      |

资源定位使用`*`，因为在 Rancher 中创建 EKS 集群之前，许多创建的资源的 ARN 无法得知。

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

### Service Role 权限

Rancher 将创建一个具有以下信任策略的服务角色。

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

这个角色也将有两个角色策略附件，其策略 ARN 如下。

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

### VPC Permissions

Rancher 创建 VPC 和相关资源所需的权限。

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
