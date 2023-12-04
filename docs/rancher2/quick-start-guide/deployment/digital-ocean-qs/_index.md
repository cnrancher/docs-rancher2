---
title: DigitalOcean 快速部署
description: 以下步骤将在 DigitalOcean 上创建一个单节点的 RKE Kubernetes 集群，并在其中部署 Rancher Server，并附加一个单节点的下游 Kubernetes 集群。
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
  - 快速入门
  - 部署Rancher Server
  - DigitalOcean 快速部署
---

以下步骤将在 DigitalOcean 上创建一个单节点的 RKE Kubernetes 集群，并在其中部署 Rancher Server，并附加一个单节点的下游 Kubernetes 集群。

## 先决条件

- [DigitalOcean 账号](https://www.digitalocean.com)：in 需要一个 DigitalOcean 账号来创建部署 Rancher Server 和 Kubernetes 所需要的资源。
- [DigitalOcean Access Key](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key)：如果您还没有 DigitalOcean Access Key，请使用这个链接查看相关指南。
- 安装 [Terraform](https://www.terraform.io/downloads.html)：用于在 DigitalOcean 中配置服务器和集群。

> **注意：**
> Google DigitalOcean 会向您收取一定的费用。

## 操作步骤

1. 打开命令行工具，执行`git clone https://github.com/rancher/quickstart`命令，把 Rancher 快速入门需要用的到的文件克隆到本地。

1. 执行`cd quickstart/do`命令，进入 DigitalOcean 快速部署文件夹。

1. 重命名`terraform.tfvars.example`文件为`terraform.tfvars`。

1. 编辑`terraform.tfvars`文件，替换以下变量。

   - `do_token` - DigitalOcean Access Key
   - `rancher_server_admin_password` - Rancher Server 的默认 admin 账户的密码

1. **可选：** 修改文件`terraform.tfvars`中的可选参数。

   请参阅[快速启动说明](https://github.com/rancher/quickstart)和 [DO 快速启动说明](https://github.com/rancher/quickstart/tree/master/do)了解更多信息。

   建议包括：

   - `do_region` - DigitalOcean 区域，默认的 DigitalOcean 区域不一定是距离您最近的区域，建议选择距离您最近的区域，降低延迟。
   - `prefix` - 全部创建资源的前缀。
   - `droplet_size` - 使用的计算实例规格，最小规格为`s-2vcpu-4gb`。如果在预算范围内，建议使用`s-4vcpu-8g`。
   - `ssh_key_file_name` - 使用指定的 SSH 密钥而不是`~/.ssh/id_rsa`（假设公共密钥为`${ssh_key_file_name}.pub`）

1. 执行`terraform init`。

1. 执行 `terraform apply --auto-approve` 开始初始化环境，命令行工具返回以下信息时，表示命令执行成功，完成了初始化环境配置。

   ```
   Apply complete! Resources: 15 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = https://rancher.xx.xx.xx.xx.sslip.io
   workload_node_ip = yy.yy.yy.yy
   ```

1. 将以上输出中的`rancher_server_url`粘贴到浏览器中。在登录页面中登录（默认用户名为`admin`，密码为在`rancher_server_admin_password`中设置的密码）。

**结果：**两个 Kubernetes 集群已部署到您的 DigitalOcean 帐户中，一个正在运行 Rancher Server，另一个可以用来部署您的实验应用。

## 后续操作

使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/rancher2/quick-start-guide/workload/_index)。

## 清理环境

1. 进入`quickstart/do`文件夹，执行`terraform destroy --auto-approve`。

1. 等待命令行界面显示完成了资源删除的信息。
