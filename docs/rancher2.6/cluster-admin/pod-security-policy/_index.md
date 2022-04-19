---
title: 添加 Pod 安全策略
weight: 80
---

> **先决条件**：以下选项仅适用于[使用 RKE 启动的集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)。

当你的集群上运行了具有安全敏感配置的 pod 时，请为其分配 [pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)，这是一组用于监控 pod 中的状态和设置的规则。如果 pod 不符合你的策略中指定的规则，则该策略会阻止它运行。

你可以在配置集群时分配 pod 安全策略。如果你以后需要放松或限制 pod 的安全性，你可以在编辑集群时更新策略：

1. 点击 **☰ > 集群管理**。
1. 转到要应用 pod 安全策略的集群，然后单击 **⋮ > 编辑配置**。
1. 在 **Pod 安全策略支持**中，选择**启用**。

   > **注意**：此选项仅适用于[由 RKE 配置的集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)。

1. 从**默认 Pod 安全策略**下拉列表中，选择要应用于集群的策略。

   Rancher 支持了`受限`和`不受限`的[策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/#default-pod-security-policies)，你也可以[创建自定义策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/#default-pod-security-policies)。

1. 单击**保存**。

**结果**：pod 安全策略应用于集群和集群内的任何项目。

> **注意**：在分配 pod 安全策略之前已经运行的工作负载是不受限制的。即使它们不符合你的 pod 安全策略，在分配策略之前运行的工作负载也会继续运行。
>
> 要检查正在运行的工作负载是否通过了你的 pod 安全策略，请克隆或升级它。
