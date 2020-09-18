---
title: AWS 快速部署
description: 您可以参考以下步骤将在 Amazon AWS 上创建一个单节点的 RKE Kubernetes 集群，并在其中部署 Rancher Server，并附加一个单节点的下游 Kubernetes 集群。
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
  - 快速入门
  - 部署Rancher Server
  - AWS 快速部署
---

您可以参考以下步骤将在 Amazon AWS 上创建一个单节点的 RKE Kubernetes 集群，并在其中部署 Rancher Server，并附加一个单节点的下游 Kubernetes 集群。

## 先决条件

- [Amazon AWS 账号](https://aws.amazon.com/account/)：您需要一个 Amazon AWS 账号来创建部署 Rancher Server 和 Kubernetes 所需要的资源。
- [Amazon AWS 访问密钥](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)：如果您还没有 Amazon AWS 访问密钥，请使用这个链接查看相关指南。
- 安装 [Terraform](https://www.terraform.io/downloads.html)：用于在 Amazon AWS 中配置服务器和集群。

> **注意：**
> Amazon AWS 会向您收取一定的费用。

## 操作步骤

1. 打开命令行工具，执行`git clone https://github.com/rancher/quickstart`命令，把 Rancher 快速入门需要用的到的文件克隆到本地。

1. 执行`cd quickstart/aws`命令，进入 AWS 快速部署文件夹。

1. 重命名`terraform.tfvars.example`文件为`terraform.tfvars`。

1. 编辑`terraform.tfvars`文件，替换以下变量。

   - `aws_access_key` - 替换为 Amazon AWS Access Key
   - `aws_secret_key` - 替换为 Amazon AWS Secret Key
   - `rancher_server_admin_password` - 替换为 Rancher Server 的默认 admin 账户的密码

1. **可选：** 修改文件`terraform.tfvars`中的可选参数。

   请参阅[快速启动说明](https://github.com/rancher/quickstart)和 [AWS 快速启动说明](https://github.com/rancher/quickstart/tree/master/aws)了解更多信息。

   建议修改的参数包括：

   - `aws_region` - Amazon AWS 区域，默认的 Amazon AWS 区域不一定是距离您最近的区域，建议选择距离您最近的区域，降低延迟。
   - `prefix` - 全部创建资源的前缀。
   - `instance_type` - 使用的计算实例规格，最小规格为`t3a.medium`。如果在预算范围内，建议使用`t3a.large`或`t3a.xlarge`。

1. 执行`terraform init`。

1. 执行 `terraform apply --auto-approve` 开始初始化环境，命令行工具返回以下信息时，表示命令执行成功，完成了初始化环境配置。

   ```
   Apply complete! Resources: 16 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = rancher.xx.xx.xx.xx.xip.io
   workload_node_ip = yy.yy.yy.yy
   ```

1. 将以上输出中的`rancher_server_url`粘贴到浏览器中。在登录页面中登录（默认用户名为`admin`，密码为在`rancher_server_admin_password`中设置的密码）。

**结果：**两个 Kubernetes 集群部署到您的 AWS 账户中，一个运行 Rancher 服务器，另一个为实验部署做好准备。请注意，虽然这种设置是探索 Rancher 功能的好方法，但生产设置应遵循我们的高可用性设置指南。

## 后续操作

使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/rancher2/quick-start-guide/workload/_index)。

## 清理环境

1. 进入`quickstart/aws`文件夹，执行`terraform destroy --auto-approve`。

1. 等待命令行界面显示完成了资源删除的信息。
