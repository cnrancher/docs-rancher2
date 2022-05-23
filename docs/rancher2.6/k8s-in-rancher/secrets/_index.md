---
title: 密文
weight: 3062
---

[密文（secret）](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets)存储敏感数据，例如密码、令牌或密钥。它们可能包含一个或多个键值对。

> 本文介绍密文的概述。有关设置私有镜像仓库的详细信息，请参阅[镜像仓库]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/registries)。

配置工作负载时，你能够选择要包含的密文。与 ConfigMap 一样，工作负载可以将密文引用为环境变量或卷挂载。

除非作为子路径卷挂载，否则挂载的密文会自动更新。有关如何传播更新的密文，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/secret/#mounted-secrets-are-updated-automatically)。

## 在命名空间中创建密文

1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加密文的集群，然后单击 **Explore**。
1. 要导航到密文，单击**存储 > 密文**或**更多资源 > 核心 > 密文**。
1. 单击**创建**。
1. 选择要创建的密文类型。
1. 为密文选择一个**命名空间**。
1. 输入密文的**名称**。

   > **注意**：Kubernetes 将密文、证书和镜像仓库都归类为[密文](https://kubernetes.io/docs/concepts/configuration/secret/)，命名空间中的密文名称不能重复。因此，为了避免冲突，密文的名称必须与工作空间中的其他密文不一样。

1. 在**数据**中，单击**添加**以添加键值对。你可以根据需要添加任意数量的值。

   > **提示**：你可以通过复制和粘贴的方式将多个键值对添加到密文中。
   >
   > {{< img "/img/rancher/bulk-key-values.gif" "Bulk Key Value Pair Copy/Paste">}}

1. 单击**保存**。

**结果**：密文已添加到你选择的命名空间中。你可以在 Rancher UI 中单击**存储 > 密文**或**更多资源 > 核心 > 密文**来查看密文。

除非作为子路径卷挂载，否则挂载的密文会自动更新。有关如何传播更新的密文，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/secret/#mounted-secrets-are-updated-automatically)。


## 在项目中创建密文

在 Rancher 2.6 之前，密文必须创建在项目级别。现在不再需要项目级别，你可以采用命名空间级别。因此，Rancher UI 进行了更新以反映这一新功能。但是，你仍然可以按照需要创建项目级别的密文。请注意，你必须先启用`旧版`功能开关并查看单个项目。执行以下步骤设置你的项目级别密文：

1. 在左上角，单击下拉菜单中的 **☰ > 全局设置**。
1. 单击**功能开关**。
1. 转到`旧版应用`功能开关并单击**激活**。
1. 点击左上角下拉菜单中的 **☰ > 集群管理**。
1. 转到你创建的集群，然后单击 **Explore**。
1. 单击**旧版 > 项目**。
1. 在顶部导航栏中进行过滤，从而仅查看一个项目。
1. 在左侧导航栏中，单击**密文**。
1. 单击**添加密文**。

**结果**：密文已添加到你选择的项目中。你可以在 Rancher UI 中单击**存储 > 密文**或**更多资源 > 核心 > 密文**来查看密文。

> **注意**：local 集群上的项目级别密文仅在选择单个项目时可见。

## 后续操作

现在你已将密文添加到命名空间，你可以将其添加到你部署的工作负载中。

有关将密文添加到工作负载的更多信息，请参阅[部署工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/deploy-workloads/)。
