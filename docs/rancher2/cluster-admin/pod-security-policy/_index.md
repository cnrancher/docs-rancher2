---
title: 配置 Pod 安全策略
description: 以下选项仅对使用 RKE 启动的集群可用。当您的集群运行具有安全敏感配置的 pods 时，为它分配一个pod 安全策略，这是一组用于监视 pods 中的条件和设置的规则。如果 pods 不符合策略中指定的规则，策略将不允许它继续运行。
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
  - 集群管理员指南
  - 集群访问控制
  - 配置 Pod 安全策略
---

> **说明：** 以下选项仅对使用 RKE 启动的集群可用。

**Pod 安全策略** (PSP) 是控制 Pod 安全的规范（如是否可以使用 root 权限等）的对象。如果 Pod 不符合 PSP 中指定的条件，Kubernetes 将不允许其启动，并且 Rancher 中将显示错误消息`Pod <NAME> is forbidden: unable to validate...`。

当您的集群运行具有安全敏感配置的 pods 时，请为它分配一个[pod 安全策略](/docs/rancher2/admin-settings/pod-security-policies/_index)，监视 pods 中的条件和设置的规则。如果 pods 不符合策略中指定的规则，策略将不允许它继续运行。

在创建集群时，您可以为集群分配 pod 安全策略。如果您需修改 pod 的安全性，可以在编辑集群时更新 pod 安全策略。

1. 访问 **全局** 视图，找到要应用 Pod 安全策略的集群，单击 **省略号 (...) > 编辑**。

2. 展开 **集群选项**。

3. 启用**Pod 安全策略支持**。

   > **注意：** 此选项仅适用于[有 RKE 创建](/docs/rancher2/luster-provisioning/rke-clusters/_index)的集群。

4. 从 **默认 Pod 安全策略** 下拉列表中，选择要应用到集群的策略。

   Rancher 提供了`受限` 和 `不受限`两种默认[策略](/docs/rancher2/admin-settings/pod-security-policies/_index)，您也可以自行创建自定义策略，详情请参考[创建自定义策略](/docs/rancher2/admin-settings/pod-security-policies/_index)。

5. 单击 **保存**。

**结果：**pod 安全策略应用于集群和集群中的任何项目。

> **注意：** 在分配 pod 安全策略之前就已经运行的工作负载是不受限制的。即使它们不符合您的 pod 安全策略，在分配策略之前运行的工作负载也会继续运行。
>
> 要检查正在运行的工作负载是否通过您的 pod 安全策略，请克隆或升级它。
