---
title: Rancher DigitalOcean 快速入门指南
description: 阅读此分步 Rancher DigitalOcean 指南，以快速部署带有单节点下游 Kubernetes 集群的 Rancher Server。
weight: 100
---
你可以参考以下步骤，在 DigitalOcean 的单节点 K3s Kubernetes 集群中快速部署 Rancher Server，并附加一个单节点下游 Kubernetes 集群。

## 前提

> :::note 注意
> 部署到 DigitalOcean 会产生费用。
> :::

- [DigitalOcean 账号](https://www.digitalocean.com)：用于运行服务器和集群。
- [DigitalOcean 访问密钥](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key)：如果你没有的话，请访问此链接创建一个。
- [Terraform](https://www.terraform.io/downloads.html)：用于在 DigitalOcean 中配置服务器和集群。


## 操作步骤

1. 使用命令行工具，执行 `git clone https://github.com/rancher/quickstart` 把 [Rancher Quickstart](https://github.com/rancher/quickstart) 克隆到本地。

2. 执行 `cd quickstart/do` 命令，进入包含 terraform 文件的 DigitalOcean 文件夹。

3. 把 `terraform.tfvars.example` 文件重命名为 `terraform.tfvars`。

4. 编辑 `terraform.tfvars` 文件，并替换以下变量：
   - `do_token` - 替换为 DigitalOcean 访问密钥
   - `rancher_server_admin_password` - 替换为创建 Rancher Server 的 admin 账号的密码

5. **可选**：修改 `terraform.tfvars` 中的可选参数。
   参见 [Quickstart Readme](https://github.com/rancher/quickstart) 以及 [DO Quickstart Readme](https://github.com/rancher/quickstart/tree/master/do) 了解更多信息。
   建议修改的参数包括：
   - `do_region` - DigitalOcean 地域。DigitalOcean 的默认地域不一定是距离你最近的地域。建议修改为距离你最近的地域。
   - `prefix` - 所有创建资源的前缀
   - `droplet_size` - 使用的计算实例规格，最小规格为`s-2vcpu-4gb`。如果在预算范围内，可以使用 `s-4vcpu-8gb`。

6. 执行 `terraform init`。

7. 执行 `terraform apply --auto-approve` 以初始化环境。然后，等待命令行工具返回以下信息：

   ```
   Apply complete! Resources: 15 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = https://rancher.xx.xx.xx.xx.sslip.io
   workload_node_ip = yy.yy.yy.yy
   ```

8. 将以上输出中的 `rancher_server_url` 粘贴到浏览器中。在登录页面中登录（默认用户名为 `admin`，密码为在 `rancher_server_admin_password` 中设置的密码）。
9. 使用 `quickstart/do` 中生成的 `id_rsa` 密钥 SSH 到 Rancher Server。

#### 结果

两个 Kubernetes 集群已部署到你的 DigitalOcean 账户中，一个运行 Rancher Server，另一个为实验部署做好准备。请注意，虽然这种设置是探索 Rancher 功能的好方法，但在生产环境中，应遵循我们的高可用设置指南。用于虚拟机的 SSH 密钥是自动生成的，存储在模块目录中。

### 后续操作

使用 Rancher 创建 deployment。详情请参见[创建 Deployment]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/workload)。

## 清理环境

1. 进入`quickstart/do`文件夹，然后执行 `terraform destroy --auto-approve`。

2. 等待命令行界面显示资源已删除的消息。
