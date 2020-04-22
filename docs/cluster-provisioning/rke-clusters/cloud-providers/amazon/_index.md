---
title: Amazon
description: 使用`Amazon`Cloud Provider 时，您可以使用以下功能：负载均衡：** 在**端口映射**中选择`4 层负载均衡`时或在启动带有`typeLoadBalancer`的`Service`时，自动启动 AWS Elastic Load Balancer(ELB)。持久卷：允许您将 AWS Elastic Block Store(EBS) 用于持久卷。请参阅 [Cloud Provider AWS 自述文档](https://github.com/kubernetes/cloud-provider-aws/blob/master/README.md)获取有关 Amazon Cloud Provider 的所有信息。设置 Amazon Cloud Provider。
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
  - 配置 Cloud Provider
  - Amazon
---

使用`Amazon`Cloud Provider 时，您可以使用以下功能：

- **负载均衡：** 在**端口映射**中选择`4 层负载均衡`时或在启动带有`type: LoadBalancer`的`Service`时，自动启动 AWS Elastic Load Balancer(ELB)。
- **持久卷：** 允许您将 AWS Elastic Block Store(EBS) 用于持久卷。

请参阅 [Cloud Provider AWS 自述文档](https://github.com/kubernetes/cloud-provider-aws/blob/master/README.md)获取有关 Amazon Cloud Provider 的所有信息。

设置 Amazon Cloud Provider。

## 1、创建 IAM 角色并附加到实例

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

## 2、配置 ClusterID

以下资源需要标记上`ClusterID`:

- **节点**：在 Rancher 中添加的所有主机。
- **子网**：用于集群的子网
- **安全组**：用于集群的安全组。

  > **注意：** 不要标记多个安全组。创建弹性负载均衡器时，标记多个组会产生错误。

创建 [Amazon EC2 集群](/docs/cluster-provisioning/rke-clusters/node-pools/ec2/_index)时，Rancher 将为创建的节点自动设置`ClusterID`。其他资源仍然需要手动标记。

应该使用的标签是:

```
Key=kubernetes.io/cluster/<CLUSTERID>, Value=owned
```

`<CLUSTERID>`可以是您选择的任何字符串。但是，必须在您标记的每个资源上使用相同的字符串。

将标记值设置为`owned`会通知集群，使用`<CLUSTERID>`标记的所有资源都由该集群拥有和管理。如果在集群之间共享资源，则可以将标记更改为:

```
Key=kubernetes.io/cluster/CLUSTERID, Value=shared
```

## 使用 Amazon Elastic Container Registry (ECR)

将上面提到的 IAM 配置文件附加到实例时，kubelet 组件能够自动获取 ECR 凭据。当使用早于 v1.15.0 的 Kubernetes 版本时，需要在集群中配置 Amazon Cloud Provider。从 Kubernetes 版本 v1.15.0 开始，kubelet 可以自动获取 ECR 凭据，而无需在集群中配置 Amazon Cloud Provider。
