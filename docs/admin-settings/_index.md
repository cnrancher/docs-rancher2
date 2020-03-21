---
title: 身份验证、权限和全局配置
---

安装完成后，[系统管理员](/docs/admin-settings/rbac/global-permissions/_index)应当对 Rancher 平台的身份验证、授权、安全、默认设置、安全策略、驱动程序和全局 DNS 等项目进行配置。

## 首次登录

第一次登录 Rancher 后，Rancher 将提示您输入一个**Rancher Server URL**。您应该将 URL 设置为 Rancher Server 的主入口点。当负载均衡器位于 Rancher Server 集群前面时，URL 应该设置为负载均衡地址。系统将自动尝试从运行 Rancher Server 的主机的 IP 地址或主机名推断 Rancher Server 的 URL。但只有在运行单个节点的 Rancher Server 安装时才，上述推断才正确。因此，在大多数情况下，您需要自己将 Rancher Server URL 设置为正确的值。

:::important 非常重要！
Rancher Server URL 在设置后不支持更新修改操作。务必确保设置正确的 URL。
:::

## 身份验证

Rancher 向 Kubernetes 添加的关键特性之一是集中式用户身份验证。该特性允许设置本地用户和/或连接到外部身份验证系统。通过连接到外部身份验证系统，您可以利用该系统的用户和组。

有关身份验证如何工作以及如何配置不同身份验证系统的更多信息，请参见[身份验证](/docs/admin-settings/authentication/_index)。

## 授权

在 Rancher 中，每个人都认证为一个*用户*，这是一个允许您访问 Rancher 的登录名。一旦用户登录到 Rancher，用户在系统中的*授权*或访问权限就由用户的角色决定。Rancher 提供了内置的角色，允许您轻松地配置用户对资源的权限，同时 Rancher 还提供了为每个 Kubernetes 资源定制角色的能力。

有关授权如何工作以及如何自定义角色的更多信息，请参见[基于角色的访问控制（RBAC）](/docs/admin-settings/rbac/_index)。

## Pod 安全策略

_Pod 安全策略_（或 PSP）是控制安全敏感相关对象的 pod 规范，例如 root 特权。如果一个 pod 不符合 PSP 中指定的条件，Kubernetes 将不允许它启动，在 Rancher UI 中将显示一个错误消息。

有关如何创建和使用 psp 的更多信息，请参见[Pod 安全策略](/docs/admin-settings/pod-security-policies/_index)。

## 配置驱动程序

Rancher 中的驱动程序允许您管理可以使用哪些供应商来创建[托管 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index) 或者 [云主机节点](/docs/cluster-provisioning/rke-clusters/node-pools/_index) ，从而允许 Rancher 部署和管理 Kubernetes。

相关更多信息，请参考[配置驱动程序](/docs/admin-settings/drivers/_index)。

## 添加 Kubernetes 版本到 Rancher

_v2.3.0 版本可用_

基于此特性，您可以在 Kubernetes 发布后立即升级到最新版本，而无需升级 Rancher。这个功能可以让你轻松升级 Kubernetes 的补丁版本（例如：`v1.15.X`)，但不升级 Kubernetes 的小版本(例如：`v1.X.0`)。因为 Kubernetes 倾向于在较小的版本之间添加或删除 API。

Rancher 用于配置[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)的信息位于 Rancher Kubernetes 元数据中。有关元数据配置和如何更改用于配置 RKE 集群的 Kubernetes 版本的详细信息，请参见[Rancher Kubernetes 元数据 ](/docs/admin-settings/k8s-metadata/_index)。

Rancher Kubernetes 元数据包含 Rancher 用于配置[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)的 Kubernetes 版本信息。

有关元数据如何工作以及如何配置元数据配置的更多信息，请参见[Rancher Kubernetes 元数据](/docs/admin-settings/k8s-metadata/_index)。

## 启用试验性功能

_v2.3.0 版本可用_

Rancher 包含一些在默认情况下禁用的试验性特性。引入功能开关能够让您能够尝试这些特性。有关更多信息，请参考关于[功能开关](/docs/installation/options/feature-flags/_index)的章节。
