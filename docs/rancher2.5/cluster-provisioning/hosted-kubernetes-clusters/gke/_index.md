---
title: 创建和管理谷歌 GKE 集群
description: 使用Google Kubernetes Engine创建服务账户。GKE 使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。
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
  - 创建集群
  - 创建托管集群
  - 创建和管理谷歌 GKE 集群
---

## 2.5.8 及之后

### 先决条件

需要在 GKE 中进行一些设置，以满足先决条件。

#### Service Account 令牌

使用[Google Kubernetes Engine](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts)创建一个服务账户。GKE 使用这个账户来操作你的集群。创建这个账户也会生成一个用于认证的私钥。

该服务账户需要以下角色：

- **Compute Viewer:** `roles/compute.viewer`
- **Project Viewer:** `roles/viewer`
- **Kubernetes Engine Admin:** `roles/container.admin`
- **Service Account User:** `roles/iam.serviceAccountUser`

[谷歌文档：创建和启用服务账户](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)

关于为你的服务账户获取私钥的帮助，请参考[谷歌云文档](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys) 你将需要以 JSON 格式保存密钥。

#### Google 项目 ID

你的集群将需要成为一个谷歌项目的一部分。

要创建一个新的项目，请参考谷歌云文档[这里。](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project)

要获得一个现有项目的项目 ID，请参考谷歌云文档[这里。](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)

### 配置 GKE 集群

:::note
部署集群会产生费用，请谨慎操作
:::

#### 1. 创建一个云证书

1. 在右上角，点击用户配置文件的下拉菜单，并点击云凭证。
1. 点击**添加云证书**。
1. 为你的谷歌云凭证输入一个名称。
1. 在**云凭证类型**栏中，选择谷歌。
1. 在**服务账户**文本框中，粘贴你的服务账户私钥 JSON，或上传 JSON 文件。
1. 单击 "创建"。

**结果：**你已经创建了凭证，Rancher 将用它来配置新的 GKE 集群。

#### 2. 创建 GKE 集群

使用 Rancher 来设置和配置你的 Kubernetes 集群。

1. 在**集群**页面，点击**添加集群**。
1. 在**托管 Kubernetes 提供商下，**点击**Google GKE**。
1. 输入一个**集群名称**。
1. 可选的。使用**成员角色**来配置集群的用户授权。点击**添加成员**来添加可以访问集群的用户。使用**角色**下拉菜单，为每个用户设置权限。
1. 可选的。将 Kubernetes 的[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[注释](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)添加到集群。
1. 输入你的谷歌项目 ID 和你的谷歌云凭证。
1. 填写表格的其余部分。如需帮助，请参考[GKE 集群配置参考](/docs/rancher2.5/cluster-admin/editing-clusters/gke-config-reference/_index)。
1. 点击**创建**。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，有两个默认项目：`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。

### 私有集群

Rancher 支持部署私有 GKE 集群。注意：这种高级设置在集群配置过程中可能需要更多步骤。详情请见[本节](/docs/rancher2.5/cluster-admin/editing-clusters/gke-config-reference/_index)。

### 配置参考

v2.5.8 版有更多配置选项。关于在 Rancher 中配置 GKE 集群的细节，请参见[本页](/docs/rancher2.5/cluster-admin/editing-clusters/gke-config-reference/_index)。

### Updating Kubernetes Version

集群的 Kubernetes 版本可以升级到 GKE 集群所在区域或地区的任何可用版本。升级主 Kubernetes 版本不会自动升级工人节点。节点可以独立升级。

> **注意**
> GKE 在 1.19+版本中取消了基本认证。为了将集群升级到 1.19+，必须在谷歌云中禁用基本认证。否则，当尝试升级到 1.19+时，Rancher 中会出现错误。你可以按照【谷歌文档】（https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication#disabling_authentication_with_a_static_password）。之后，可以通过Rancher将Kubernetes版本升级到1.19+。

### 同步

GKE 供应者可以在 Rancher 和供应商之间同步 GKE 集群的状态。关于这项工作的深入技术解释，请参见[同步](/docs/rancher2.5/cluster-admin/editing-clusters/syncing/_index)。

### 配置刷新间隔

配置刷新间隔的操作步骤请参考[GKE 配置参考](/docs/rancher2.5/cluster-admin/editing-clusters/gke-config-reference/_index)。

## 2.5.8 之前

### 先决条件

> **注意**
> 创建 GKE 集群会产生费用。

使用[Google Kubernetes Engine](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts)创建服务账户，然后使用这个帐户来操作您的集群。创建此帐户还将生成用于身份验证的私钥。

服务帐户需要以下角色：

- **Compute Viewer：** `roles/compute.viewer`
- **Project Viewer：** `roles/viewer`
- **Kubernetes Engine Admin：** `roles/container.admin`
- **Service Account User：** `roles/iam.serviceAccountUser`

[谷歌文档：创建和启用服务帐户](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)

### 创建 GKE 集群

使用 Rancher 来设置和配置您的 Kubernetes 集群。

1. 登录 **集群** 页面，单击 **添加集群**。

2. 选择 **Google Kubernetes Engine**。

3. 输入 **集群名称**。

4. 单击**成员角色**，设置用户访问集群的权限。

   - 单击**添加成员**，把需要访问这个集群的用户添加到成员列表中。
   - 单击**角色**下拉菜单，选择每个用户的权限。

5. 将您的服务帐户私钥粘贴在`服务帐户`文本框中，或者`从文件中读取`。然后单击`下一步：配置节点`。

   > **注意：** 在提交您的私钥之后，您可能必须启用 GKE API。如果出现提示，您需要浏览到 Rancher UI 中显示的 URL 来启用 GKE API。

6. 选择您的**集群选项**， 我们不建议为节点启用自动升级功能。
7. 自定义您的**节点**。
8. 并自定义 GKE 集群的**安全性**。检查您的选项并确认它们是正确的。
9. 然后单击**创建**，完成 GKE 集群创建。

**结果：**

- 您的集群创建成功并进入到**Provisioning**（启动中）的状态。Rancher 正在拉起您的集群。
- 在集群状态变为**Active**（激活）状态后，您将可以开始访问您的集群。
- 在**Active**的集群中，有两个默认项目：`Default`项目（包括`default`命名空间）和`System`项目（包括`cattle-system`、`ingress-nginx`、`kube-public` 和 `kube-system`）。
