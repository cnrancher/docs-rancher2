---
title: 全局私有镜像库
description: 您可能想要使用私有的 Docker 镜像仓库在组织内共享您的自定义系统镜像。借助私有镜像仓库，您可以让集群使用私有的、一致的、且来源可信的、集中的系统镜像。这些镜像将用来创建 RKE 集群和 Rancher 提供的工具服务，例如监控告警等。在 Rancher 中设置私有镜像仓库的主要方法有两种：通过全局视图中的`设置`选项卡设置全局默认镜像仓库，以及在集群级别设置的高级选项中设置私有镜像仓库。全局默认镜像仓库旨在用于离线环境设置，不需要凭据的镜像仓库。集群级私有镜像仓库旨在用于所有需要凭据的私有镜像仓库。本部分是关于配置全局默认私有镜像仓库的，并且重点介绍在安装 Rancher 之后如何从 Rancher UI 配置默认镜像仓库。
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
  - 系统管理员指南
  - 全局私有镜像库
---

您可能想要使用私有的 Docker 镜像仓库在组织内共享您的自定义系统镜像。借助私有镜像仓库，您可以让集群使用私有的、一致的、且来源可信的、集中的系统镜像。这些镜像将用来创建 RKE 集群和 Rancher 提供的工具服务，例如监控告警等。

在 Rancher 中设置私有镜像仓库的主要方法有两种：通过全局视图中的`设置`选项卡设置全局默认镜像仓库，以及在集群级别设置的高级选项中设置私有镜像仓库。全局默认镜像仓库旨在用于离线环境设置，不需要凭据的镜像仓库。集群级私有镜像仓库旨在用于所有需要凭据的私有镜像仓库。

本部分是关于配置全局默认私有镜像仓库的，并且重点介绍在安装 Rancher 之后如何从 Rancher UI 配置默认镜像仓库。

有关在 Rancher 的安装过程中使用命令行选项设置私有镜像仓库的说明，请参阅[单节点离线安装](/docs/installation/other-installation-methods/air-gap/_index)或[高可用离线安装](/docs/installation/other-installation-methods/air-gap/_index)说明。

如果您的私有镜像仓库需要凭据，则不能将其设置为全局默认镜像仓库。没有全局的方法来为每个 Rancher 所配置的集群设置具有授权认证的私有镜像仓库。因此，如果您希望由 Rancher 配置的集群从具有授权认证的私有镜像仓库中拉取镜像，则必须通过高级集群选项传递镜像仓库凭据。

## 将不需要认证的私有镜像仓库设置为默认镜像仓库

1. 登录到 Rancher 并配置默认的管理员密码。

2. 进入`设置`视图。

   ![设置](/img/rancher/airgap/settings.png)

3. 查找名为`system-default-registry`的设置，然后选择`编辑`。

   ![编辑](/img/rancher/airgap/edit-system-default-registry.png)

4. 将该值更改为您的镜像仓库(例如`registry.yourdomain.com：port`)。不要在镜像仓库前面加上`http://`或`https://`。点击**保存**。

   ![保存](/img/rancher/airgap/enter-system-default-registry.png)

**结果：** Rancher 将使用您的私有镜像仓库拉取系统镜像。

## 在部署集群时使用带有认证的私有镜像仓库

使用 Rancher 设置集群时，可以按照以下步骤配置私有镜像仓库：

1. 通过 Rancher UI 创建集群时，转到`私有镜像仓库`部分。
2. 在**启用私有镜像仓库**部分中，单击 **启用**。
3. 输入镜像仓库 URL 和凭据。
4. 点击 **保存**。

**结果：** 新集群将能够从私有镜像仓库中拉取镜像。
