---
title: 创建 Amazon EC2 集群
shortTitle: Amazon EC2
description: 了解使用 Rancher 创建 Amazon EC2 集群所需的先决条件和步骤
weight: 2210
---
在本节中，你将学习如何使用 Rancher 在 Amazon EC2 中安装 [RKE](https://rancher.com/docs/rke/latest/en/) Kubernetes 集群。

首先，在 Rancher 中设置你的 EC2 云凭证。然后，使用云凭证创建一个节点模板，Rancher 将使用该模板在 EC2 中配置新节点。

然后，在 Rancher 中创建一个 EC2 集群，并在配置新集群时为集群定义节点池。每个节点池都有一个 etcd、controlplane 或 worker 的 Kubernetes 角色。Rancher 会在新节点上安装 RKE Kubernetes，并为每个节点设置节点池定义的 Kubernetes 角色。

### 前提

- **AWS EC2 访问密钥和密文密钥**，用于创建实例。请参阅 [Amazon 文档：创建访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)来创建访问密钥和密文密钥。
- **已创建 IAM 策略**，用于为用户添加的访问密钥和密文密钥。请参阅 [Amazon 文档：创建 IAM 策略（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html#access_policies_create-start)来创建 IAM 策略。参阅下面的三个示例 JSON 策略：
   - [IAM 策略示例](#example-iam-policy)
   - [带有 PassRole 的 IAM 策略示例](#example-iam-policy-with-passrole)（如果要使用 [Kubernetes 云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers)，或将 IAM 配置文件传递给实例，则需要）
   - [允许加密 EBS 卷的 IAM 策略示例](#example-iam-policy-to-allow-encrypted-ebs-volumes)
- 为用户添加 **IAM 策略权限**。请参阅 [Amazon 文档：为用户添加权限（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)，来将权限添加给用户。

## 创建 EC2 集群

创建集群的步骤因 Rancher 版本而异。

1. [创建云凭证](#1-create-your-cloud-credentials)
2. [使用云凭证和 EC2 的信息来创建节点模板](#2-create-a-node-template-with-your-cloud-credentials-and-information-from-ec2)
3. [使用节点模板创建具有节点池的集群](#3-create-a-cluster-with-node-pools-using-the-node-template)

### 1. 创建云凭证

1. 点击 **☰ > 集群管理**。
1. 单击**云凭证**。
1. 单击**创建**。
1. 单击 **Amazon**。
1. 输入云凭证的名称。
1. 在**默认区域**字段中，选择集群节点所在的 AWS 区域。
1. 输入 AWS EC2 **Access Key** 和 **Secret Key**。
1. 单击**创建**。

**结果**：已创建用于在集群中配置节点的云凭证。你可以在其他节点模板或集群中复用这些凭证。

### 2. 使用云凭证和 EC2 的信息来创建节点模板

为 EC2 创建[节点模板]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/#node-templates)会允许 Rancher 在 EC2 中配置新节点。其他集群可以复用节点模板。

1. 点击 **☰ > 集群管理**。
1. 单击 **RKE1 配置 > 节点模板**。
1. 单击**添加模板**。
1. 填写 EC2 的节点模板。有关填写表单的帮助，请参阅 [EC2 节点模板配置](./ec2-node-template-config)。
1. 单击**创建**。

   > **注意**：如果要使用[双栈](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)功能，请关注其他额外的[要求]({{<baseurl>}}/rke//latest/en/config-options/dual-stack#requirements)。

### 3. 使用节点模板创建具有节点池的集群

将一个或多个节点池添加到你的集群。有关节点池的更多信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击 **Amazon EC2**。
1. 为每个 Kubernetes 角色创建一个节点池。为每个节点池选择你已创建的节点模板。有关节点池的更多信息，包括为节点分配 Kubernetes 角色的最佳实践，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools)。
1. 点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 使用**集群选项**选择要安装的 Kubernetes 版本、要使用的网络提供商，以及是否启用项目网络隔离。参见[选择云提供商]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/cloud-providers/)来配置 Kubernetes 云提供商。如需获取配置集群的帮助，请参阅 [RKE 集群配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options)。

   > **注意**：如果要使用[双栈](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)功能，请关注其他额外的[要求]({{<baseurl>}}/rke//latest/en/config-options/dual-stack#requirements)。
1. 单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

### 可选的后续步骤

创建集群后，你可以通过 Rancher UI 访问集群。最佳实践建议你设置以下访问集群的备用方式：

- **通过 kubectl CLI 访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#accessing-clusters-with-kubectl-on-your-workstation)在你的工作站上使用 kubectl 访问集群。在这种情况下，你将通过 Rancher Server 的身份验证代理进行身份验证，然后 Rancher 会让你连接到下游集群。此方法允许你在没有 Rancher UI 的情况下管理集群。
- **通过 kubectl CLI 使用授权的集群端点访问你的集群**：按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/#authenticating-directly-with-a-downstream-cluster)直接使用 kubectl 访问集群，而无需通过 Rancher 进行身份验证。我们建议设置此替代方法来访问集群，以便在无法连接到 Rancher 时访问集群。

## IAM 策略

### IAM 策略示例

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:Describe*",
                "ec2:ImportKeyPair",
                "ec2:CreateKeyPair",
                "ec2:CreateSecurityGroup",
                "ec2:CreateTags",
                "ec2:DeleteKeyPair",
                "ec2:ModifyInstanceMetadataOptions"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:REGION::image/ami-*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:instance/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:placement-group/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:volume/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:subnet/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:key-pair/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:network-interface/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:security-group/*"
            ]
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "ec2:RebootInstances",
                "ec2:TerminateInstances",
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:instance/*"
        }
    ]
}
```

### 带有 PassRole 的 IAM 策略示例

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:Describe*",
                "ec2:ImportKeyPair",
                "ec2:CreateKeyPair",
                "ec2:CreateSecurityGroup",
                "ec2:CreateTags",
                "ec2:DeleteKeyPair",
                "ec2:ModifyInstanceMetadataOptions"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "iam:PassRole",
                "ec2:RunInstances"
            ],
            "Resource": [
                "arn:aws:ec2:REGION::image/ami-*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:instance/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:placement-group/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:volume/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:subnet/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:key-pair/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:network-interface/*",
                "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:security-group/*",
                "arn:aws:iam::AWS_ACCOUNT_ID:role/YOUR_ROLE_NAME"
            ]
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "ec2:RebootInstances",
                "ec2:TerminateInstances",
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:instance/*"
        }
    ]
}
```
### 允许加密 EBS 卷的 IAM 策略示例
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKeyWithoutPlaintext",
        "kms:Encrypt",
        "kms:DescribeKey",
        "kms:CreateGrant",
        "ec2:DetachVolume",
        "ec2:AttachVolume",
        "ec2:DeleteSnapshot",
        "ec2:DeleteTags",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:DeleteVolume",
        "ec2:CreateSnapshot"
      ],
      "Resource": [
        "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:volume/*",
        "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:instance/*",
        "arn:aws:ec2:REGION:AWS_ACCOUNT_ID:snapshot/*",
        "arn:aws:kms:REGION:AWS_ACCOUNT_ID:key/KMS_KEY_ID"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeTags",
        "ec2:DescribeVolumes",
        "ec2:DescribeSnapshots"
      ],
      "Resource": "*"
    }
  ]
}
```
