---
title: AWS 快速部署
---

您可以按照以下操作步骤部署单节点集群的 Rancher Server。

## 前提条件

- [AWS 账户](https://aws.amazon.com/account/)：您需要一个 AWS 账户创建资源，创建 Rancher Server 和 Kubernetes 集群。
- [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)： 您需要 AWS Access Key 完成 AWS 快速部署。单击链接查看如何获取或创建 AWS Access Key。
- [AWS 秘钥对](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair) ：您需要 AWS 秘钥对完成 AWS 快速部署。单击链接查看如何获取或创建 AWS 秘钥对。
- [Terraform](https://www.terraform.io/downloads.html)：在 AWS 中启动 Rancher Server 和 Kubernetes 集群的工具。

> **说明：**
> 在 AWS 上部署 Rancher Server，Amazon 会向您收取一定的费用

## 操作步骤

1. 打开命令行工具，执行`git clone https://github.com/rancher/quickstart`命令，把 Rancher 快速入门需要用的到的文件复制到 AWS 机器上。

1. 执行`cd quickstart/aws`命令，进入 AWS 快速部署文件夹。

1. 重命名`terraform.tfvars.example`文件为`terraform.tfvars`。

1. 编辑`terraform.tfvars`文件，您至少需要修改以下四个参数。 如果您需要修改节点数量，请在文件中找到 `node sizes`，输入您需要的节点数量。

   - `aws_access_key` - AWS Access Key
   - `aws_secret_key` - AWS Secret Key
   - `ssh_key_name` - AWS 秘钥对名称
   - `prefix` - 资源名称前缀。

1. **可选：** 在 `terraform.tfvars`文件中编辑节点种类的数量，详情请参考[快速入门 Readme](https://github.com/rancher/quickstart) 。

1. 执行`terraform init` 命令，初始化工作目录。

1. 执行 `terraform apply` 运行初始化环境，命令行工具返回以下信息时，表示命令执行成功，完成初始化环境配置。

   ```
     Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
       Outputs:
       rancher-url = [
               https://xxx.xxx.xxx.xxx
       ]
   ```

1. 打开浏览器，使用`rancher-url`对应的地址访问 Rancher UI。

1. 输入默认用户名和密码，用户名是`admin`，密码是`admin`。如果您已经修改了密码，请输入修改后的密码登录 Rancher UI。为了保证安全性，我们建议您定期修改登录密码。

**结果：**完成 AWS 快速入门，在 AWS 中安装了 Rancher Server 和 Kubernetes 集群。

## 后续操作

完成安装 Rancher Server 和 Kubernetes 集群的步骤后，您可以使用 Rancher 部署工作负载，详情请参考[部署工作负载](/docs/quick-start-guide/workload/_index)。

## 数据清理

快速入门为您创建了一个使用 Rancher 的沙盒，我们建议您在完成试用后清理环境内 Rancher 相关的资源和数据。具体步骤如下：

1. 执行`cd quickstart/aws`命令，进入 AWS 快速部署文件夹。

1. 执行`terraform destroy --auto-approve`命令，删除相关的资源和数据。

1. 命令行界面显示确认信息，完成所有资源的删除。
