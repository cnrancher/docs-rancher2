---
title: 在 Amazon EKS 上安装 Rancher
description: Chart 安装选项
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 安装指南
  - 高可用安装指南
  - 在 Amazon EKS 上安装 Rancher
---

## 概述

本文介绍了在 EKS 上安装 Rancher 的两种方法。

第一种方法是使用 CloudFormation 在 EKS 集群上部署 Rancher Server的指南。本指南是与 Amazon Web Services 合作创建的，旨在展示如何按照最佳实践部署 Rancher。

第二种方法是使用命令行工具安装带有入口的 EKS 集群的指南。如果您想在 EKS 上使用 Rancher 时使用较少的资源，请使用这种方式部署 Rancher。

如果您已经有一个 EKS Kubernetes 集群，请跳转到[安装 Ingress](#5-安装-ingress)章节。然后按照[高可用安装指南](/docs/rancher2.5/installation/install-rancher-on-k8s/#安装-Rancher-Helm-Chart)上的说明安装 Rancher Helm Chart。

- [使用 AWS 最佳实践的快速入门](#使用-aws-最佳实践的快速入门)
- [为 Rancher Server 创建 EKS 集群](#为-rancher-server-创建-eks-集群)

## 使用 AWS 最佳实践的快速入门

Rancher 和 AWS 合作编写了一份快速入门指南，用于按照 AWS 最佳实践在 EKS 集群上部署 Rancher，详情请参考[部署指南](https://aws-quickstart.github.io/quickstart-eks-rancher/)。

快速入门指南提供了在 EKS 上部署 Rancher 的三个选项。

- **将 Rancher 部署到新的 VPC 和新的 Amazon EKS 集群中**：该选项构建了一个由 VPC、子网、NAT 网关、安全组、堡垒主机、Amazon EKS 集群和其他基础设施组件组成的全新 AWS 环境。然后将 Rancher 部署到这个新的 EKS 集群中。
- **将 Rancher 部署到现有 VPC 和新的 Amazon EKS 集群中**：此选项在现有 AWS 基础架构中提供 Rancher。
- **将 Rancher 部署到现有的 VPC 和现有的 Amazon EKS 集群中**：此选项可在您现有的 AWS 基础架构中提供 Rancher。

使用默认参数为新的虚拟私有云 (VPC) 和新的 Amazon EKS 集群部署此快速入门，可在 AWS 云中构建以下 Rancher 环境。

- 跨越三个可用区的高可用架构。\*
- 根据 AWS 最佳实践，配置了公共和私有子网的 VPC，为您提供 AWS 上自己的虚拟网络。\*
- 公共子网
  - 在公共子网中： 管理网络地址转换（NAT）网关，以允许资源的外向互联网访问。\*
  - 自动扩展组中的 Linux 堡垒主机，允许对公共和私有子网中的 Amazon Elastic Compute Cloud (Amazon EC2) 实例进行入站安全 Shell (SSH) 访问。\*
- 私有子网中
  - 自动扩展组中的 Kubernetes 节点。\*
  - 网络负载均衡器（未显示），用于访问 Rancher 控制台。
- 使用 AWS Systems Manager 自动化进行 Rancher 部署。
- 用于 EKS 集群的 Amazon EKS 服务，它提供了 Kubernetes controlplane 一个用于访问 Rancher 控制台的 Amazon Route 53 DNS 记录（未显示）。\*
- 用于访问 Rancher 部署的 Amazon Route 53 DNS 记录。

:::note 说明
将快速启动部署到现有亚马逊 EKS 集群中的 CloudForm 模板会跳过标有星号（\*）的组件，并提示您查看现有 VPC 配置。
:::

## 为 Rancher Server 创建 EKS 集群

在本节中，您将使用命令行工具安装一个带有入口的 EKS 集群。如果您想在 EKS 上试用 Rancher 时使用较少的资源，本指南会很有用。

### 前提条件

1. 已有一个 AWS 账户。
1. 建议使用 IAM 用户而不是 AWS 根账户。您将需要 IAM 用户的访问密钥和秘钥来配置 AWS 命令行界面。
1. IAM 用户需要官方[eksctl 文档](https://eksctl.io/usage/minimum-iam-policies/)中描述的最低 IAM 策略。

### 1. 准备好您的工作站

请在工作站上安装以下命令行工具：

- **AWS CLI v2**：如需帮助，请参考这些[安装步骤](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)。
- **eksctl**：如需帮助，请参考这些[安装步骤](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)。
- **kubectl**：如需帮助，请参考这些[安装步骤](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)。
- **helm**：如需帮助，请参考以下[安装步骤](https://helm.sh/docs/intro/install/)。

### 2. 配置 AWS CLI

运行以下命令，配置 AWS CLI：

```bash
aws configure
```

然后输入以下参数：

| 变量                  | 描述                                                                                                                                                                      |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AWS Access Key ID     | 具有 EKS 权限的 IAM 用户的访问密钥凭证。                                                                                          |
| AWS Secret Access Key | 具有 EKS 权限的 IAM 用户的密文密钥凭证。                                                                                                                                      |
| Default region name   | 集群节点所在的[AWS Region ](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html#Concepts.RegionsAndAvailabilityZones.Regions)。 |
| Default output format | 输入 `json`。                                                                                                                                                             |

### 3. 创建 EKS 集群

请运行以下命令，创建 EKS 集群，请使用适用于您的用例的 AWS Region。 在选择 Kubernetes 版本时，请务必先查阅 [支持矩阵](https://rancher.com/support-matrix/) 找到针对你的 Rancher 版本进行验证的 Kubernetes 最高版本。

```
eksctl create cluster \
  --name rancher-server \
  --version 1.20 \
  --region us-west-2 \
  --nodegroup-name ranchernodes \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

集群需要一些时间才能使用 CloudFormation 进行部署。

### 4. 验证集群是否可用

请运行以下命令，验证集群是否可用：

```
eksctl get cluster
```

返回结果应该是这样的：

```
eksctl get cluster
2021-03-18 15:09:35 [ℹ]  eksctl version 0.40.0
2021-03-18 15:09:35 [ℹ]  using region us-west-2
NAME		REGION		EKSCTL CREATED
rancher-server-cluster		us-west-2	True
```

### 5. 安装 Ingress

集群需要一个 Ingress，这样就可以从集群外部访问 Rancher。

下面的命令安装了一个`nginx-ingress-controller`和一个 LoadBalancer 服务。这将导致在 NGINX 前面有一个 ELB（Elastic Load Balancer）。

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install \
  ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --version 3.12.0 \
  --create-namespace
```

### 6. 获取负载均衡器的 IP 地址

运行以下命令获取负载均衡器的 IP 地址：

```
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

返回结果跟下方示例代码类似：

```
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP                                                              PORT(S)
 AGE
ingress-nginx-controller   LoadBalancer   10.100.90.18   a904a952c73bf4f668a17c46ac7c56ab-962521486.us-west-2.elb.amazonaws.com   80:31229/TCP,443:31050/TCP
 27m
```

`EXTERNAL-IP`就是负载均衡器的 IP 地址，请妥善保存。

### 7. 配置 DNS

到 Rancher Server的外部流量需要指向您创建的负载均衡器。

设置一个 DNS，指向您保存的外部 IP。这个 DNS 将被用作 Rancher Server的 URL。

设置 DNS 的有效方法有很多。有关帮助，请参考 AWS 文档中关于[将流量路由到 ELB 负载均衡器](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html)的内容。

### 8. 安装 Rancher Helm Chart

按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/)上的说明安装 Rancher Helm Chart。Helm 说明与在任何 Kubernetes 发行版上安装 Rancher 相同。

安装 Rancher 时，使用上一步中的那个 DNS 名称作为 Rancher Server的 URL。它可以作为 Helm 选项传递进来。例如，如果 DNS 名是`rancher.my.org`，你可以用`--set hostname=rancher.my.org`这个选项运行 Helm 安装命令。
