---
title: Rancher Hetzner Cloud Quick Start Guide
description: Read this step by step Rancher Hetzner Cloud guide to quickly deploy a Rancher Server with a single node cluster attached.
weight: 100
---
你可以参考以下步骤，在 Hetzner Cloud 上快速部署 Rancher server，并附加一个单节点集群。

## 前提

> **注意**
> 部署到 Hetzner Cloud 会产生费用。

- [Hetzner Cloud 账号](https://www.hetzner.com)：用于运行服务器和集群。
- [Hetzner API 访问密钥](https://docs.hetzner.cloud/#getting-started)：如果你没有的话，请参考说明创建一个。
- [Terraform](https://www.terraform.io/downloads.html)：用于在 Hetzner 中配置服务器和集群。


## 操作步骤

1. 使用命令行工具，执行`git clone https://github.com/rancher/quickstart`把 [Rancher Quickstart](https://github.com/rancher/quickstart) 克隆到本地。

1. 执行`cd quickstart/hcloud`命令，进入包含 terraform 文件的 Hetzner 文件夹。

1. 把`terraform.tfvars.example`文件重命名为 `terraform.tfvars`。

1. 编辑`terraform.tfvars`文件，并替换以下变量：
   - `hcloud_token` - 替换为 Hetzner API 访问密钥。
   - `rancher_server_admin_password` - 替换为创建 Rancher server 的 admin 账号的密码

1. **可选**：修改`terraform.tfvars`中的可选参数。
   参见 [Quickstart Readme](https://github.com/rancher/quickstart) 以及 [Hetzner Quickstart Readme](https://github.com/rancher/quickstart/tree/master/hcloud) 了解更多信息。
   建议修改的参数包括：
   - `prefix` - 所有创建资源的前缀
   - `instance_type` - 实例类型，至少需要是 `cx21`。
   - `ssh_key_file_name` - 使用指定的 SSH 密钥而不是`~/.ssh/id_rsa`（假设公钥为`${ssh_key_file_name}.pub`）

1. 执行 `terraform init`。

2. 执行`terraform apply --auto-approve`以初始化环境。然后，等待命令行工具返回以下信息：

   ```
   Apply complete! Resources: 15 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = https://rancher.xx.xx.xx.xx.xip.io
   workload_node_ip = yy.yy.yy.yy
   ```

3. 将以上输出中的`rancher_server_url`粘贴到浏览器中。在登录页面中登录（默认用户名为 `admin`，密码为在`rancher_server_admin_password`中设置的密码）。

#### 结果

两个 Kubernetes 集群已部署到你的 Hetzner 账户中，一个运行 Rancher server，另一个为实验部署做好准备。

### 后续操作

使用 Rancher 创建 deployment。详情请参见[创建 Deployment]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/workload)。

## 清理环境

1. 进入`quickstart/hcloud`文件夹，然后执行`terraform destroy --auto-approve`。

2. 等待命令行界面显示资源已删除的消息。
