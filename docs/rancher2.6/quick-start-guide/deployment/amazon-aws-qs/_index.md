---
title: Rancher AWS Quick Start Guide
description: Read this step by step Rancher AWS guide to quickly deploy a Rancher Server with a single node cluster attached.
weight: 100
---
你可以参考以下步骤，在 AWS 上快速部署 Rancher server，并附加一个单节点集群。

## 前提

> **注意**
> 部署到 Amazon AWS 会产生费用。

- [Amazon AWS 账号](https://aws.amazon.com/account/): 用于创建部署 Rancher Server 和 Kubernetes 的资源。
- [Amazon AWS 访问密钥](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)：如果你没有的话，请访问此链接查看相关指南。
- [Terraform](https://www.terraform.io/downloads.html): 用于在 Amazon AWS 中配置服务器和集群。


## 操作步骤

1. 使用命令行工具，执行`git clone https://github.com/rancher/quickstart`把 [Rancher Quickstart](https://github.com/rancher/quickstart) 克隆到本地。

1. 执行`cd quickstart/aws`命令，进入包含 terraform 文件的 AWS 文件夹。

1. 把`terraform.tfvars.example`文件重命名为 `terraform.tfvars`。

1. 编辑`terraform.tfvars`文件，并替换以下变量：
   - `aws_access_key` - 替换为 Amazon AWS 访问密钥
   - `aws_secret_key` - 替换为 Amazon AWS Secret 密钥
   - `rancher_server_admin_password` - 替换为创建 Rancher server 的 admin 账号的密码

1. **可选**：修改`terraform.tfvars`中的可选参数。
   参见 [Quickstart Readme](https://github.com/rancher/quickstart) 以及 [AWS Quickstart Readme](https://github.com/rancher/quickstart/tree/master/aws) 了解更多信息。
   建议修改的参数包括：
   - `aws_region` - Amazon AWS 地域。AWS 的默认地域不一定是距离你最近的地域。建议修改为距离你最近的地域。
   - `prefix` - 所有创建资源的前缀
   - `instance_type` - EC2 使用的实例规格，最小规格为 `t3a.medium` 。如果在预算范围内，可以使用 `t3a.large` 或 `t3a.xlarge`。

1. 执行 `terraform init`。

1. 执行 `terraform apply --auto-approve`以初始化环境。然后，等待命令行工具返回以下信息：

   ```
   Apply complete!Resources: 16 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = https://rancher.xx.xx.xx.xx.xip.io
   workload_node_ip = yy.yy.yy.yy
   ```

1. 将以上输出中的`rancher_server_url`粘贴到浏览器中。在登录页面中登录（默认用户名为 `admin`，密码为在`rancher_server_admin_password`中设置的密码）。

#### 结果

两个 Kubernetes 集群已部署到你的 AWS 账户中，一个运行 Rancher server，另一个为实验部署做好准备。请注意，虽然这种设置是探索 Rancher 功能的好方法，但在生产环境中，应遵循我们的高可用设置指南。

### 后续操作

使用 Rancher 创建 deployment。详情请参见[创建 Deployment]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/workload)。

## 清理环境

1. 进入`quickstart/aws`文件夹，然后执行`terraform destroy --auto-approve`。

2. 等待命令行界面显示资源已删除的消息。
