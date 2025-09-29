---
title: 密文
description: 密文用于存储敏感数据，例如密码，令牌或密钥。它们可能包含一个或多个键值对。配置工作负载时，您将能够选择要包括的密文。与配置映射一样，工作负载可以将密文引用为环境变量或以数据卷挂载的方式使用。
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
  - 用户指南
  - 密文
---

[密文](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets)用于存储敏感数据，例如密码，令牌或密钥。它们可能包含一个或多个键值对。

> 本页主要是关于密文的文档。有关设置私有镜像库的详细信息，请参阅[镜像仓库凭证](/docs/rancher2.5/k8s-in-rancher/registries/)。

配置工作负载时，您可以选择要包括的密文。与配置映射一样，工作负载可以将密文引用为环境变量或以数据卷挂载的方式使用。

如果您是将密文通过`subPath`的方式挂载的，那么对正在使用的密文的任何更新，都不会自动更新到正在使用它的 Pod 里。所以您需要重新启动这些 Pod，以使新密文生效。更多信息请参阅[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/secret/#mounted-secrets-are-updated-automatically)。

## 创建密文

创建密文时，您可以将其用于项目中的任何部署，也可以将其限制为单个命名空间。

1. 从 **全局** 视图，选择您想要添加密文的命名空间所在的项目。

2. 通过主菜单，选择 **资源 > 密文**。单击 **添加密文**。

3. 输入这个密文的**名称** 。

   > **注意:** Kubernetes 将密文，证书和镜像库凭证分类为[Secret](https://kubernetes.io/docs/concepts/configuration/secret/)，并且项目或命名空间中的两个 secret 都不能有重复的名称。因此，为防止冲突，镜像库凭证必须在工作空间内的所有 secret 中具有唯一的名称。

4. 为这个密文选择一个**范围**。您可以设置此密文作用于此项目所有命名空间或单个命名空间。

5. 从 **密文**，单击 **添加密文** 去添加一个键值对。也可以根据需要添加任意多个值。

   > **提示:** 您可以通过复制和粘贴为密文添加多个键值对。
   >
   > ![Bulk Key Value Pair Copy/Paste](/img/rancher/bulk-key-values.gif)

6. 单击 **保存**。

**效果:** 您的密文是被添加到项目或者命名空间，具体取决于您的选择，您可以从 Rancher UI 的 **资源 > 密文** 视图中查看到该密文。

如果您是将密文通过`subPath`的方式挂载的，那么对正在使用的密文的任何更新，都不会自动更新到正在使用它的 Pod 里。所以您需要重新启动这些 Pod，以使新密文生效。更多信息请参阅[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/secret/#mounted-secrets-are-updated-automatically)。

## 下一步是什么?

现在您已经有一个密文被添加到项目或命名空间，您可以添加它到部署的工作负载中。

有关向工作负载添加密文的更多信息，请查看[部署工作负载](/docs/rancher2.5/k8s-in-rancher/workloads/deploy-workloads/)。
