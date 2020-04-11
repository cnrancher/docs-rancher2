---
title: DigitalOcean 快速部署
---

您可以按照以下操作步骤部署 Rancher Server 和一个单节点的 Kubernetes 集群。

## 先决条件

- [DigitalOcean 账户](https://www.digitalocean.com)：您需要一个 DigitalOcean 账户创建资源，创建和运行 Rancher Server 和 Kubernetes 集群。
- [DigitalOcean Access Key](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key)：您需要 DigitalOcean Access Key 完成 DigitalOcean 快速部署。单击链接查看如何获取或创建 DigitalOcean Access Key。
- [Terraform](https://www.terraform.io/downloads.html)：在 DigitalOcean 中启动 Rancher Server 和 Kubernetes 集群的工具。

> **说明：**
> 在 DigitalOcean 上部署 Rancher Server，DigitalOcean 会向您收取一定的费用。

## 操作步骤

1. 打开命令行工具，执行`git clone https://github.com/rancher/quickstart`命令，把 Rancher 快速入门需要用的到的文件复制到一个文件夹里面。

2. 执行`cd quickstart/do`命令，进入 DigitalOcean 快速部署文件夹

3. 重命名`terraform.tfvars.example`文件为`terraform.tfvars`。

4. 编辑`terraform.tfvars`文件，在文件中输入 DigitalOcean Access Key 相关信息。

5. **可选：** 编辑 `terraform.tfvars`内的其他参数：

- 修改节点数量( `count_agent_all_nodes` )
- 修改管理员用户登录 Rancher 使用的密码( `admin_password` )

6. 执行`terraform init` 命令，初始化工作目录。

7. 执行 `terraform apply` 运行初始化环境，命令行工具返回以下信息时，表示命令执行成功，完成初始化环境配置。

```
   Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
     Outputs:
     rancher-url = [
             https://xxx.xxx.xxx.xxx
     ]
```

8. 打开浏览器，使用`rancher-url`对应的地址访问 Rancher UI。

9. 输入默认用户名和密码，用户名是`admin`，密码是`admin`。如果您已经修改了密码，请输入修改后的密码登录 Rancher UI。为了保证安全性，我们建议您定期修改登录密码。

**结果：**完成 DigitalOcean 快速入门，在 DigitalOcean 中安装了 Rancher Server 和 Kubernetes 集群。

## 后续操作

完成安装 Rancher Server 和 Kubernetes 集群的步骤后，您可以使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/quick-start-guide/workload/_index)。

## 数据清理

快速入门为您创建了一个使用 Rancher 的沙盒，我们建议您在完成试用后清理环境内 Rancher 相关的资源和数据。具体步骤如下：

1. 执行`cd quickstart/do`命令，进入 Vagrant 快速部署文件夹。

1. 执行`terraform destroy --force`命令，删除相关的资源和数据。

1. 命令行界面显示确认信息，完成所有资源的删除。
