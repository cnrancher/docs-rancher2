---
title: Pod 安全策略
weight: 5600
---

> 本文介绍的集群选项仅适用于 [Rancher 已在其中启动 Kubernetes 的集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)。

你可以在创建项目的时候设置 Pod 安全策略（PSP）。如果在创建项目期间没有为项目分配 PSP，你也随时可以将 PSP 分配给现有项目。

### 前提

- 在 Rancher 中创建 Pod 安全策略。在将默认 PSP 分配给现有项目之前，你必须有一个可分配的 PSP。有关说明，请参阅[创建 Pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。
- 将默认 Pod 安全策略分配给项目所属的集群。如果 PSP 还没有应用到集群，你无法将 PSP 分配给项目。有关详细信息，请参阅[将 pod 安全策略添加到集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/pod-security-policy)。

### 应用 Pod 安全策略

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到需要移动命名空间的集群，然后单击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 找到要添加 PSP 的项目。在该项目中选择 **⋮ > 编辑配置**。
1. 从 **Pod 安全策略**下拉列表中，选择要应用于项目的 PSP。
   将 PSP 分配给项目将：

- 覆盖集群的默认 PSP。
- 将 PSP 应用于项目。
- 将 PSP 应用到后续添加到项目中的命名空间。

1. 单击**保存**。

**结果**：已将 PSP 应用到项目以及项目内的命名空间。

> **注意**：对于在分配 PSP 之前已经在集群或项目中运行工作负载，Rancher 不会检查它们是否符合 PSP。你需要克隆或升级工作负载以查看它们是否通过 PSP。
