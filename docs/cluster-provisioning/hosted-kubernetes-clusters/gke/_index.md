---
title: 创建谷歌 GKE 集群
description: 使用Google Kubernetes Engine创建服务账户。GKE 使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。
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
  - 创建谷歌 GKE 集群
---

### 先决条件

> **注意**
> 部署到 GKE 将会产生费用。

使用[Google Kubernetes Engine](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts)创建服务账户。GKE 使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。

服务帐户需要以下角色:

- **Compute Viewer:** `roles/compute.viewer`
- **Project Viewer:** `roles/viewer`
- **Kubernetes Engine Admin:** `roles/container.admin`
- **Service Account User:** `roles/iam.serviceAccountUser`

[谷歌文档：创建和启用服务帐户](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)

### 创建 GKE 集群

使用 Rancher 来设置和配置您的 Kubernetes 集群。

1. 从 **集群** 页面, 单击 **添加集群**。

2. 选择 **Google Kubernetes Engine**。

3. 输入 **集群名称**。

4. 通过**成员角色**来设置用户访问集群的权限。

   - 点击**添加成员**将需要访问这个集群的用户添加到成员中。
   - 在**角色**下拉菜单中选择每个用户的权限。

5. 将您的服务帐户私钥粘贴在`服务帐户`文本框中,或者`从文件中读取`。然后单击`下一步：配置节点`。

   > **注意:** 在提交您的私钥之后，您可能必须启用 GKE API。如果出现提示，您需要浏览到 Rancher UI 中显示的 URL 来启用 GKE API。

6. 选择您的**集群选项**, 自定义您的**节点**，并自定义 GKE 集群的**安全性**。检查您的选项并确认它们是正确的。然后单击**创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，默认会有两个项目。`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system`，如果这些命名空间存在的话）
