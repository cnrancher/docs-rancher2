---
title: 创建阿里云 ACK 集群
description: 您可以使用 Rancher 创建一个托管于 阿里云Alibaba Cloud Kubernetes (ACK) 中的集群。Rancher 已经为ACK实现并打包了针对ACK的集群驱动，但是默认情况下，这个集群驱动是`未启用的`。为了启动 ACK 集群，您需要先启用 ACK 集群驱动程序。启用集群驱动后，可以开始配置 ACK 集群。
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
  - 创建托管集群
  - 创建阿里云 ACK 集群
---

_从 v2.2.0 开始可用_

您可以使用 Rancher 创建一个托管于阿里云 Alibaba Cloud Kubernetes (ACK) 中的集群。Rancher 已经为 ACK 实现并打包了针对 ACK 的[集群驱动](/docs/admin-settings/drivers/cluster-drivers/_index)，但是默认情况下，这个集群驱动是`未启用的`。为了启动 ACK 集群，您需要先[启用 ACK 集群驱动程序](/docs/admin-settings/drivers/cluster-drivers/_index)。启用集群驱动后，可以开始配置 ACK 集群。

### 先决条件

> **注意**
> 部署到 ACK 将会产生费用。

1. 在阿里云中，通过控制台激活以下服务。

   - [容器服务](https://cs.console.aliyun.com)
   - [资源编排管理服务](https://ros.console.aliyun.com)
   - [RAM 服务](https://ram.console.aliyun.com)

2. 确保您将用于创建 ACK 集群的帐户具有适当的权限。从阿里巴巴云的官方文档[角色授权](https://www.alibabacloud.com/help/doc-detail/86483.htm)和[使用容器服务控制台作为 RAM 用户](https://www.alibabacloud.com/help/doc-detail/86484.htm)获得详细信息。

3. 在阿里云里，创建一个[访问密钥](https://www.alibabacloud.com/help/doc-detail/53045.html)。

4. 在阿里云里，创建一个[SSH 密钥对](https://www.alibabacloud.com/help/doc-detail/51793.html)。这个密钥用于访问 Kubernetes 集群中的节点。

### 创建一个 ACK 集群

1. 在 **集群** 页，点击 **添加**。

1. 选择 **Alibaba ACK**。

1. 输入 **集群名称**。

1. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

1. 为 ACK 集群配置 **访问账户**. 选择构建集群的地理区域，并输入之前创建的访问密钥。

1. 单击 **下一步: 配置集群**，然后选择集群类型、Kubernetes 版本和可用的区域。

1. 如果您选择 **Kubernetes** 作为集群类型，单击 **下一步: 配置主节点**，然后完成 **主节点** 表单的配置。

1. 点击 **下一步: 配置 Worker 节点**，完成 **Worker 节点** 表单。

1. 检查您的选项是否正确. 然后点击 **创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）
