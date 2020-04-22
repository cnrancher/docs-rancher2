---
title: Amazon EC2
description: 使用 Rancher 在 Amazon EC2 中创建 Kubernetes 集群。
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
  - 创建节点和集群
  - Amazon EC2
---

使用 Rancher 在 Amazon EC2 中创建 Kubernetes 集群。

## 先决条件

- 创建实例时会使用**AWS EC2 访问密钥**。请参照[Amazon 文档: 创建访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)。

- 为用户的访问密钥**创建 IAM 策略**。请参照[Amazon 文档: 创建 IAM 策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html#access_policies_create-start)。下面是三个 JSON 策略的实例：
  - [IAM 策略示例](#iam-策略示例)
  - [包含 PassRole 的 IAM 策略示例](#包含-passrole-的-iam-策略示例) (如果您想要使用 [Kubernetes Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index) 或 IAM 实例配置文件)
  - [允许加密 EBS 卷的 IAM 策略示例](#允许加密-ebs-卷的-iam-策略示例)
- 为用户添加**IAM 策略许可**。请参照[Amazon 文档：为用户添加许可](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console)。

## 创建 EC2 集群

创建集群的步骤因您的 Rancher 版本而异。

### Rancher v2.2.0+ 版本

1. [创建云凭证](#1-创建云凭证)
2. [使用云凭证和 EC2 信息创建节点模板](#2-使用云凭证和-ec2-信息创建节点模板)
3. [使用节点模板创建带节点池的集群](#3-使用节点模板创建带节点池的集群)

#### 1. 创建云凭证

1. 在 Rancher 用户界面中，点击右上角的用户个人资料按钮，然后点击**云凭证**。
1. 点击**添加云凭证**。
1. 为云凭证填写名称。
1. 在**云凭证类型**选项中，选择**Amazon**。
1. 在**区域**选项中，选择您将要创建节点的 AWS 区域。
1. 填写您的 AWS EC2 访问密钥：**Access Key** 和**Secret Key**。
1. 点击**创建**。

**结果：** 您已经创建了用于配置集群中节点的云凭证。您可以将这些云凭证用于其他节点模板或其他集群。

#### 2. 使用云凭证和 EC2 信息创建节点模板

使用[EC2 管理控制台](https://aws.amazon.com/ec2)中可用的信息来完成以下内容。

1. 在 Rancher 用户界面中，点击右上角的用户个人资料按钮，然后点击**节点模板**。
1. 点击**添加模板**。
1. 在**区域**选项中，选择您创建云凭证相同的区域。
1. 在**云凭证**选项中，选择您创建的云凭证。
1. 点击**下一步：认证 & 设置节点**
1. 选择您的集群的可用区和网络设置。点击 **下一步: 选择安全组**。
1. 选择默认的安全组或配置一个新的安全组。请根据文档 [Amazon EC2 使用节点驱动时的安全组](/docs/cluster-provisioning/node-requirements/_index) 来查看 `rancher-nodes` 安全组创建的规则。然后点击**下一步: 设置实例选项**。
1. 配置将要创建的实例。确保为选择的 AMI 配置正确的**SSH 用户**。

> 如果您需要设定 <b>IAM 实例配置名称</b> (不是 ARN)，例如当您需要使用 [Kubernetes Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)，在您的策略中需要额外的许可。请参照[包含 PassRole 的 IAM 策略示例](#包含-passrole-的-iam-策略示例)。

可选：在节点模板的**引擎选项**部分中，您可以配置 Docker 守护程序。您可能需要指定 Docker 版本或 Docker 镜像仓库地址。

#### 3. 使用节点模板创建带节点池的集群

将一个或多个节点池添加到您的集群。

**节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

:::important 注意：

- 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
- 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。至少两个。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

:::

1. 在**集群列表**界面中，点击**添加集群**。

1. 选择**Amazon EC2**。

1. 填写**集群名称**。

1. 为每个 Kubernetes 角色创建一个节点池。对于每个节点池，选择您创建的节点模板。

1. 点击**添加成员**来添加能够访问集群的用户。

1. 使用**角色**下拉菜单来为每个用户设定权限。

1. 通过**集群选项**来选择 Kubernetes 版本，网络插件及是否开启网络隔离。请参照[选择 Cloud Providers](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index) 来设置 Kubernetes Cloud Provider。

1. [Docker 守护进程](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

   - **标签：** 有关标签的信息，请参阅 [Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
   - **Docker 引擎安装 URL：** 决定将在实例上安装哪个 Docker 版本。注意：如果您使用的是 RancherOS，因为配置的默认 Docker 版本可能不可用，请先确认要使用的 RancherOS 版本上可用的 Docker 版本。可以使用 `sudo ros engine list` 检查。如果您在其他操作系统上安装 Docker 时遇到问题，请尝试使用配置的 Docker Engine 安装 URL 手动安装 Docker 进行故障排查。
   - **镜像仓库加速器：** Docker 守护进程使用的 Docker 镜像仓库加速器。
   - **其他高级选项：** 请参阅 [Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)

1. 点击**创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果存在）。

### Rancher v2.2.0+ 之前的版本

1. 在**集群列表**界面中，点击**添加集群**。

1. 选择**Amazon EC2**。

1. 填写**集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 使用**集群选项**设置 Kubernetes 的版本，网络插件以及是否要启用项目网络隔离。要查看更多集群选项，请单击**显示高级选项**。请参照[选择 Cloud Providers](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index) 来设置 Kubernetes Cloud Provider。

1. 将一个或多个节点池添加到您的集群。

   **节点池**是基于节点模板的节点的集合。节点模板定义节点的配置，例如要使用的操作系统，CPU 数量和内存量。每个节点池必须分配一个或多个节点角色。

   :::important 注意：

   - 每个节点角色（即 `etcd`，`Control Plane` 和 `Worker`）应分配给不同的节点池。尽管可以为一个节点池分配多个节点角色，但是不应对生产集群执行此操作。
   - 推荐的设置是拥有一个具有`etcd`节点角色且数量为 3 的节点池，一个具有`Control Plane`节点角色且数量至少为 2 的节点池，以及具有`Worker`节点角色且数量为 1 的节点池。至少两个。关于 `etcd` 节点角色，请参考 [etcd 管理指南](https://etcd.io/#optimal-cluster-size)。

   :::

1. 点击**添加节点模板**。

1. 使用[EC2 管理控制台](https://aws.amazon.com/ec2)中可用的信息来完成以下内容。

   - **账户许可** 选项用于配置创建节点的区域及云凭证。关于如何创建访问密钥和权限，请参照[先决条件](#先决条件)。
   - **区域和网络** 选项用于配置您的集群可用区和网络设置。
   - **安全组** 选项用于配置您的节点的安全组。请参照 [Amazon EC2 使用节点驱动的安全组](/docs/cluster-provisioning/node-requirements/_index) 来查看`rancher-nodes`安全组中创建了哪些规则。
   - **实例** 选项用于配置将要创建的实例。确保为选择的 AMI 配置正确的**SSH 用户**。

   如果您需要设定 **IAM 实例配置名称** (不是 ARN)，例如当您需要使用[Kubernetes Cloud Provider](/docs/cluster-provisioning/rke-clusters/cloud-providers/_index)，在您的策略中需要额外的许可。请参照[包含 PassRole 的 IAM 策略示例](#包含-passrole-的-iam-策略示例)。

1. [Docker 守护进程](https://docs.docker.com/engine/docker-overview/#the-docker-daemon)配置选项包括：

   - **标签：** 有关标签的信息，请参阅 [Docker 对象标签文档](https://docs.docker.com/config/labels-custom-metadata/)。
   - **Docker 引擎安装 URL：** 决定将在实例上安装哪个 Docker 版本。注意：如果您使用的是 RancherOS，因为配置的默认 Docker 版本可能不可用，请先确认要使用的 RancherOS 版本上可用的 Docker 版本。可以使用 `sudo ros engine list` 检查。如果您在其他操作系统上安装 Docker 时遇到问题，请尝试使用配置的 Docker Engine 安装 URL 手动安装 Docker 进行故障排查。
   - **镜像仓库加速器：** Docker 守护进程使用的 Docker 镜像仓库加速器。
   - **其他高级选项：** 请参阅 [Docker 守护进程选项参考](https://docs.docker.com/engine/reference/commandline/dockerd/)

1. 点击**创建**。
1. **可选：** 添加其他节点池。
1. 检查您填写的信息以确保填写正确，然后点击 **创建**。

结果：

- 您的集群已创建并进入为 **Provisioning** 的状态。Rancher 正在启动您的集群。
- 您可以在集群的状态更新为 **Active** 后访问它。
- Rancher 为活动的集群分配了两个项目，即 `Default`（包含命名空间 `default`）和 `System`（包含命名空间 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果存在）。

## 可选步骤

创建集群后，您可以通过 Rancher UI 访问它。作为最佳实践，我们建议同时设置以下访问集群的替代方法：

- **通过 kubectl CLI 访问集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 访问您的集群。在这种情况下，您将通过 Rancher 服务器的身份验证代理进行身份验证，然后 Rancher 会将您连接到下游集群。此方法使您无需 Rancher UI 即可管理集群。

- **通过 kubectl CLI 和授权的集群地址访问您的集群：** 请按照[这些步骤](/docs/cluster-admin/cluster-access/kubectl/_index)来通过 kubectl 直接访问您的集群，而不需要通过 Rancher 进行认证。我们建议您设定此方法访问集群，这样在您无法连接 Rancher 时您仍然能够访问集群。

## IAM 策略示例

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
        "ec2:DeleteKeyPair"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": ["ec2:RunInstances"],
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

## 包含 PassRole 的 IAM 策略示例

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
        "ec2:DeleteKeyPair"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": ["iam:PassRole", "ec2:RunInstances"],
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

## 允许加密 EBS 卷的 IAM 策略示例

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
