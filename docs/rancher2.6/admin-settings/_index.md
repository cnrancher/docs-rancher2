---
title: 身份验证、权限和全局配置
weight: 6
---

安装完成后，[系统管理员]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/global-permissions/)需要配置 Rancher 来配置身份验证，安全，默认设定，安全策略，驱动和全局 DNS 条目。

## 首次登录

首次登录 Rancher 后，Rancher 会提示你输入 **Rancher Server URL**。你需要将 URL 设置为 Rancher Server 的主要入口点。当负载均衡器位于 Rancher Server 集群前面时，URL 需要设置为负载均衡器地址。系统会自动尝试从运行 Rancher Server 的主机的 IP 地址或主机名推断 Rancher Server 的URL，上述推断仅在你运行单节点 Rancher Server 时才正确。因此，在大多数情况下，你需要自己将 Rancher Server 的 URL 设置为正确的值。

> **重要提示**：
> Rancher Server 的 URL 在设置后不可再更新。因此，你需要谨慎设置该 URL。

## 身份验证

Rancher 向 Kubernetes 添加的关键功能之一，就是集中式用户身份验证。此功能允许将本地用户连接到外部身份验证系统，使用该系统的用户和组进行身份验证。

有关身份验证如何工作及如何设置外部身份认证系统，请参见[身份验证]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/)。

## 授权

Rancher 通过 _用户_ 进行授权管理。用户的 _授权_ 或系统访问权限由用户角色决定。Rancher 提供了预设角色，让你轻松配置用户对资源的权限，还提供了为每个 Kubernetes 资源定制角色的能力。

有关授权如何工作及如何自定义角色，请参见[基于角色的访问控制 (RBAC)]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/)。

## Pod 安全策略

_Pod 安全策略（PSP）_ 是用来控制安全敏感相关 Pod 规范（例如 root 特权）的对象。如果某个 Pod 不满足 PSP 指定的条件，Kubernetes 将不允许它启动，并在 Rancher 中显示错误消息。

有关如何创建和使用 PSP，请参见[Pod 安全策略]({{<baseurl>}}/rancher/v2.6/en/admin-settings/pod-security-policies/)。

## 配置驱动

使用 Rancher 中的驱动，你可以管理可以使用哪些供应商来配置[托管的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/)或[云服务器节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)，以允许 Rancher 部署和管理 Kubernetes。

详情请参考[配置驱动]({{<baseurl>}}/rancher/v2.6/en/admin-settings/drivers/)。

## 添加 Kubernetes 版本到 Rancher

你可以通过这个功能，在不升级 Rancher 的情况下，升级到最新发布的 Kubernetes 版本。Kubernetes 倾向于在次要版本删除或新增 API 接口。本功能让你轻松升级 Kubernetes 补丁版本（即 `v1.15.X`），但不升级 Kubernetes 次要版本（即 `v1.X.0`）。

Rancher 用于配置 [RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 的信息现在位于 Rancher Kubernetes 元数据中。有关元数据配置以及如何更改用于配置 RKE 集群的 Kubernetes 版本，请参见 [Rancher Kubernetes 元数据。]({{<baseurl>}}/rancher/v2.6/en/admin-settings/k8s-metadata/)

Rancher 用于配置 [RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)的 Kubernetes 版本信息包含在 Rancher Kubernetes 元数据中。

有关元数据如何工作以及如何配置元数据，请参见 [Rancher Kubernetes 元数据]({{<baseurl>}}/rancher/v2.6/en/admin-settings/k8s-metadata/)。

## 启用实验功能

Rancher 包含一些默认关闭的实验功能。我们引入了功能开关，让你试用这些新功能。详情请参见[功能开关]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/)的章节。
