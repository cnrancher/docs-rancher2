---
title: 管理 GKE 集群
shortTitle: Google Kubernetes Engine
weight: 2105
---

- [前提](#prerequisites)
- [配置 GKE 集群](#provisioning-a-gke-cluster)
- [私有集群](#private-clusters)
- [配置参考](#configuration-reference)
- [更新 Kubernetes 版本](#updating-kubernetes-version)
- [同步](#syncing)
- [以编程方式创建 GKE 集群](#programmatically-creating-gke-clusters)

## 前提

你需要在 Google Kubernetes Engine 中进行一些设置。

### 服务账号令牌

使用 [Google Kubernetes Engine](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts) 创建服务帐号。GKE 使用这个账号来操作你的集群。创建此账号还会生成用于身份验证的私钥。

该服务账号需要以下角色：

- **Compute Viewer:** `roles/compute.viewer`
- **Project Viewer:** `roles/viewer`
- **Kubernetes Engine Admin:** `roles/container.admin`
- **Service Account User:** `roles/iam.serviceAccountUser`

[Google 文档：创建和启用服务账号](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances)

有关获取服务账号的私钥的详细信息，请参阅[此 Google 云文档](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys)。你需要将密钥保存为 JSON 格式。

### Google 项目 ID

你的集群需要包括到谷歌项目中。

要创建新项目，请参阅[此 Google 云文档](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project)。

要获取现有项目的项目 ID，请参阅[此 Google 云文档](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)。

## 配置 GKE 集群

> **注意**：
> 部署到 GKE 会产生费用。

### 1. 创建云凭证

1. 点击 **☰ > 集群管理**。
1. 在左侧导航栏中，单击**云凭证**。
1. 单击**创建**。
1. 输入你 Google 云凭证的名称。
1. 在**服务账号**文本框中，粘贴你的服务账号私钥 JSON，或上传 JSON 文件。
1. 单击**创建**。

**结果**：你已创建 Rancher 用于配置新 GKE 集群的凭证。

### 2. 创建 GKE 集群

使用 Rancher 配置你的 Kubernetes 集群。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面上，单击**创建**。
1. 单击 **Google GKE**。
1. 输入**集群名称**。
1. 可选：使用**成员角色**为集群配置用户授权。点击**添加成员**添加可以访问集群的用户。使用**角色**下拉菜单为每个用户设置权限。
1. 可选：将 Kubernetes [标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)或[注释](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)添加到集群。
1. 输入你的 Google 项目 ID 和 Google 云凭证。
1. 完成表单的其余部分。如需帮助，请参阅 [GKE 集群配置参考]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference)。
1. 单击**创建**。

**结果**：你已成功部署 GKE 集群。

你已创建集群，集群的状态是**配置中**。Rancher 已在你的集群中。

当集群状态变为 **Active** 后，你可访问集群。

**Active** 状态的集群会分配到两个项目：

- `Default`：包含 `default` 命名空间
- `System`：包含 `cattle-system`，`ingress-nginx`，`kube-public` 和 `kube-system` 命名空间。

## 私有集群

支持私有 GKE 集群。注意，此高级设置可能涉及更多步骤。有关详细信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference/private-clusters/)。

## 配置参考

有关在 Rancher 中配置 GKE 集群的详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference)。

## 更新 Kubernetes 版本

集群的 Kubernetes 版本可以升级到 GKE 集群所在区域或地区中可用的任何版本。升级 Kubernetes 主版本不会自动升级 Worker 节点。节点可以独立升级。

> **注意**：
> GKE 在 1.19+ 中取消了基本身份验证。要将集群升级到 1.19+，必须在谷歌云中禁用基本身份认证。否则，在升级到 1.19+ 时，Rancher 会出现错误。你可以按照 [Google 文档](https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication#disabling_authentication_with_a_static_password)进行操作。然后，你就可以使用 Rancher 将 Kubernetes 版本更新到 1.19+。

## 同步

GKE 配置者可以在 Rancher 和提供商之间同步 GKE 集群的状态。有关其工作原理的技术说明，请参阅[同步]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/syncing)。

有关配置刷新间隔的信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/editing-clusters/gke-config-reference/#configuring-the-refresh-interval)。

## 以编程方式创建 GKE 集群

通过 Rancher 以编程方式部署 GKE 集群的最常见方法是使用 Rancher 2 Terraform Provider。详情请参见[使用 Terraform 创建集群](https://registry.terraform.io/providers/rancher/rancher2/latest/docs/resources/cluster)。
