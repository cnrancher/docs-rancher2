---
title: Rancher GCP 快速入门指南
description: 阅读此分步 Rancher GCP 指南，以快速部署带有单节点下游 Kubernetes 集群的 Rancher Server。
weight: 100
---
你可以参考以下步骤，在 GCP 的单节点 K3s Kubernetes 集群中快速部署 Rancher server，并附加一个单节点下游 Kubernetes 集群。

## 前提

> **注意**
> 部署到 Google GCP 会产生费用。

- [Google GCP Account](https://console.cloud.google.com/)：用于创建部署 Rancher 和 Kubernetes 的资源。
- [Google GCP 项目](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/creating-project)：如果你没有的话，请访问此链接查看如何创建 GCP 项目。
- [Google GCP 服务账号](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)：请访问此链接查看如何创建 GCP 服务账号和 Token 文件。
- [Terraform](https://www.terraform.io/downloads.html)：用于在 Google GCP 中配置服务器和集群。


## 操作步骤

1. 使用命令行工具，执行`git clone https://github.com/rancher/quickstart`把 [Rancher Quickstart](https://github.com/rancher/quickstart) 克隆到本地。

2. 执行`cd quickstart/gcp`命令，进入包含 terraform 文件的 GCP 文件夹。

3. 把`terraform.tfvars.example`文件重命名为 `terraform.tfvars`。

4. 编辑`terraform.tfvars`文件，并替换以下变量：
   - `gcp_account_json` - 替换为 GCP 服务账号文件路径和文件名。
   - `rancher_server_admin_password` - 替换为创建 Rancher server 的 admin 账号的密码

5. **可选**：修改`terraform.tfvars`中的可选参数。
   参见 [Quickstart Readme](https://github.com/rancher/quickstart) 以及 [GCP Quickstart Readme](https://github.com/rancher/quickstart/tree/master/gcp) 了解更多信息。
   建议修改的参数包括：
   - `gcp_region` - Google GCP 地域。GCP 的默认地域 (`us-east4`) 不一定是距离你最近的地域。建议修改为距离你最近的地域。
   - `gcp_zone` - Google GCP 区域。GCP 的默认区域 (`us-east4-a`) 不一定是距离你最近的区域。建议修改为距离你最近的区域。
   - `prefix` - 所有创建资源的前缀
   - `machine_type` - 使用的计算实例大小，最小规格为 `n1-standard-1`。如果在预算范围内，可以使用 `n1-standard-2` 或 `n1-standard-4`。

6. 执行 `terraform init`。

7. 执行`terraform apply --auto-approve`以初始化环境。然后，等待命令行工具返回以下信息：

   ```
   Apply complete! Resources: 16 added, 0 changed, 0 destroyed.

   Outputs:

   rancher_node_ip = xx.xx.xx.xx
   rancher_server_url = https://rancher.xx.xx.xx.xx.sslip.io
   workload_node_ip = yy.yy.yy.yy
   ```

8. 将以上输出中的`rancher_server_url`粘贴到浏览器中。在登录页面中登录（默认用户名为 `admin`，密码为在`rancher_server_admin_password`中设置的密码）。
9. 使用 `quickstart/gcp` 中生成的 `id_rsa` 密钥 SSH 到 Rancher server。

#### 结果

两个 Kubernetes 集群已部署到你的 GCP 账户中，一个运行 Rancher server，另一个为实验部署做好准备。请注意，虽然这种设置是探索 Rancher 功能的好方法，但在生产环境中，应遵循我们的高可用设置指南。用于虚拟机的 SSH 密钥是自动生成的，存储在模块目录中。

### 后续操作

使用 Rancher 创建 deployment。详情请参见 [创建 Deployment]({{< baseurl >}}/rancher/v2.6/en/quick-start-guide/workload)。

## 清理环境

1. 进入`quickstart/gcp`文件夹，然后执行`terraform destroy --auto-approve`。

2. 等待命令行界面显示资源已删除的消息。
