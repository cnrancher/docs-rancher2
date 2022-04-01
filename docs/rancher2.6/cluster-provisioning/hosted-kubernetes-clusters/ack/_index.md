---
title: 创建阿里云 ACK 集群
shortTitle: 阿里云 Kubernetes 容器服务
weight: 2120
---

你可以使用 Rancher 创建托管在阿里云 Alibaba Cloud Kubernetes (ACK) 中的集群。Rancher 已经为 ACK 实现并打包了针对 ACK 的[集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/)，但是默认情况下，这个集群驱动的状态是 `inactive`。为了启动 ACK 集群，你需要[启用 ACK 集群驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/cluster-drivers/#activating-deactivating-cluster-drivers)。启用集群驱动后，你可以开始配置 ACK 集群。

## Rancher 之外的先决条件

> **注意**：
> 部署到 ACK 会产生费用。

1. 在阿里云中，在对应的控制台中激活以下服务。

   - [容器服务](https://cs.console.aliyun.com)
   - [资源编排服务](https://ros.console.aliyun.com)
   - [RAM](https://ram.console.aliyun.com)

2. 确保你用于创建 ACK 集群的账号具有适当的权限。详见阿里云[角色授权](https://www.alibabacloud.com/help/doc-detail/86483.htm)和[使用容器服务控制台作为 RAM 用户](https://www.alibabacloud.com/help/doc-detail/86484.htm)官方文档。

3. 在阿里云中，创建[访问密钥](https://www.alibabacloud.com/help/doc-detail/53045.html)。

4. 在阿里云中，创建 [SSH 密钥对](https://www.alibabacloud.com/help/doc-detail/51793.html)。该密钥用于访问 Kubernetes 集群中的节点。

## Rancher 先决条件

你需要启用阿里云 ACK 集群驱动：

1. 点击 **☰ > 集群管理**。
1. 点击**驱动**。
1. 在**集群驱动**选项卡中，转到 **Alibaba ACK** 集群驱动并单击 **⋮ > 激活**。

集群驱动下载完成后，就可以在 Rancher 中创建阿里云 ACK 集群了。

## 创建 ACK 集群

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面，点击**创建**。
1. 单击 **Alibaba ACK**。
1. 输入**集群名称**。
1. 使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 为 ACK 集群配置**账号访问**。选择要在其中构建集群的地理区域，并输入在先决条件步骤中创建的访问密钥。
1. 点击**下一步：配置集群**，然后选择集群类型、Kubernetes 版本和可用区。
1. 如果选择 **Kubernetes** 作为集群类型，请单击**下一步：配置主节点**，然后填写**主节点**表单。
1. 单击**下一步：配置 Worker 节点**，然后填写 **Worker 节点**表单。
1. 检查并确认你的选项。然后单击**创建**。

**结果**：

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。
