---
title: 功能介绍
description: 安装 Rancher 后，系统管理员需要配置 Rancher Server URL、全局私有镜像仓库、身份验证、用户访问权限、Pod 安全策略、节点和集群驱动程序、RKE 元数据和实验性功能。第一次登录 Rancher 后，Rancher 将提示您输入一个Rancher Server URL。您应该将 URL 设置为 Rancher Server 的主入口点。当负载均衡器位于 Rancher Server 集群前面时，URL 应该设置为负载均衡地址。系统将自动尝试从运行 Rancher Server 的主机的 IP 地址或主机名推断 Rancher Server 的 URL。但只有在运行单个节点的 Rancher Server 安装时才，上述推断才正确。因此，在大多数情况下，您需要自己将 Rancher Server URL 设置为正确的值。
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
  - 功能介绍
---

安装 Rancher 后，[系统管理员](/docs/admin-settings/rbac/global-permissions/_index)需要配置 Rancher Server URL、全局私有镜像仓库、身份验证、用户访问权限、Pod 安全策略、节点和集群驱动程序、RKE 元数据和实验性功能。

## 配置 Rancher Server URL

第一次登录 Rancher 后，Rancher 将提示您输入一个**Rancher Server URL**。您应该将 URL 设置为 Rancher Server 的主入口点。当负载均衡器位于 Rancher Server 集群前面时，URL 应该设置为负载均衡地址。系统会自动尝试从运行 Rancher Server 的主机的 IP 地址或主机名推断 Rancher Server 的 URL，但只有在运行单节点的 Rancher Server 时，上述推断才会正确。因此，在大多数情况下，您需要自己将 Rancher Server URL 设置为正确的值。

:::important 注意
Rancher Server URL 在设置后不支持更新修改操作。务必确保设置正确的 URL。
:::

## 全局私有镜像仓库

公共镜像仓库有以下几个潜在问题：

- 需要通过公网连接本地和公有镜像仓库，数据传输速度比较慢，导致上传和下载镜像的速度也比较慢。
- 公有仓库将镜像存放在公共硬盘上，访问限制比较宽松。
- 镜像版本不一致，镜像来源也不完全可信。

而私有镜像仓库的特性恰好解决了公有镜像仓库的潜在问题：

- 通过局域网连接本地和私有镜像仓库，数据传输速度快。
- 私有仓库将镜像存放在私有服务器硬盘上，组织可以自行配置每个人的访问权限。
- 组织可以把控镜像的版本和来源，确保仓库内的镜像版本一致，来源可信。

您可以将自定义系统镜像上传到私有镜像仓库，使用这些私有的，版本一致且来源可信的镜像，创建 RKE 集群和使用 Rancher 提供的工具服务。您也可以通过私有镜像仓库和组织内的同事共享自定义系统镜像。

在 Rancher 中设置私有镜像仓库的主要方法有两种：通过全局视图中的设置选项卡设置全局默认镜像仓库，以及在集群级别设置的高级选项中设置私有镜像仓库。全局默认镜像仓库用于离线环境设置，不需要凭据的镜像仓库。集群级私有镜像仓库用于所有需要凭据的私有镜像仓库。

有关全局私有镜像库更多信息，请参考[全局私有镜像库](/docs/admin-settings/config-private-registry/_index)。

## 验证用户身份

Rancher 向 Kubernetes 添加的关键特性之一是集中式用户身份验证。该特性允许设置本地用户连接到外部身份认证系统，使用该系统的用户和组进行身份验证。

有关身份认证如何工作以及如何配置不同身份认证系统的更多信息，请参考[身份验证](/docs/admin-settings/authentication/_index)。

## 授予用户访问权限

Rancher 通过用户名区分用户，每一个用户名都对应了一个独立的用户。用户在 Rancher 系统中的*授权*或访问权限由用户的角色决定。Rancher 提供了预先设置好的角色，允许您轻松地配置用户对资源的权限，也提供了为每个 Kubernetes 资源定制角色的功能。

有关授权如何工作以及如何自定义角色的更多信息，请参考[基于角色的访问控制（RBAC）](/docs/admin-settings/rbac/_index)。

## 配置 Pod 安全策略

_Pod 安全策略_（PSP）是控制安全敏感相关对象的 pod 规范，例如 root 特权。如果一个 pod 不符合 PSP 中指定的条件，Kubernetes 将不允许它启动，在 Rancher UI 中将显示错误消息。

有关如何创建和使用 Pod 安全策略的更多信息，请参考[Pod 安全策略](/docs/admin-settings/pod-security-policies/_index)。

## 配置 RKE 集群模板

RKE 的全称是[Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)，它是 Rancher 用来创建 Kubernetes 集群的工具。RKE 集群模板制定了 DevOps 和安全团队的标准，简化了 Kubernetes 集群的创建过程。

多集群管理面临着如何强制实施安全策略和附加配置的挑战，在将集群移交给最终用户之前，管理员需要标准化这些配置。RKE 集群模板提供了标准化集群配置的方式。无论是使用 Rancher UI、Rancher API 还是自动化流程创建的集群，Rancher 都将保证从 RKE 集群模板创建的每个集群在生成方式上是一致的。

配置 RKE 集群模板时，管理员具有以下权限：

- 决定用户可以修改的和不可修改的集群选项。
- 指定的用户是否可以与其他用户或和用户组共享 RKE 集群模板。
- 为不同的用户组创建 RKE 集群模板。

集群和模板之间存在多对一的关系，用户可以使用一个模板创建多个集群，而每个集群有且只有一个对应的模板。确认使用的模板后，无法修改。例如，“集群 A”是用户使用“模板 a”创建的，那么在编辑集群时，用户不能将集群 A”对应的“模板 a”，修改为其他模板。管理员可以通过编辑集群模板的方式更新集群模板，应用该模板创建的集群就会自动适配新模板的参数。

## 配置驱动程序

Rancher 可以自动部署和管理云服务器中的 Kubernetes 集群， 您可以通过驱动程序管理提供托管服务的供应商，来创建[托管 Kubernetes 集群](/docs/cluster-provisioning/hosted-kubernetes-clusters/_index) 或者通过管理支持的云服务器，使用[云主机](/docs/cluster-provisioning/rke-clusters/node-pools/_index)创建 kubernetes 集群。详情请参考[驱动介绍](/docs/admin-settings/drivers/_index)。

## 添加 Kubernetes 版本到 Rancher

_v2.3.0 版本可用_

Kubernetes 的版本更新速度比 Rancher 快，在 Rancher 大版本的周期内（如 v2.3.0~v2.3.7），Kubernetes 可能会发布包括补丁版和正式版在内的多个的版本；而且 Kubernetes 倾向于在正式版本之间添加和删除 API 接口，这就造成了 Kubernetes 升级正式版本后，新旧 API 接口对应不上，调用 API 返回异常失等问题。

RKE 元数据功能允许用户在获取新的可用 Kubernetes 版本的同时，保持 Rancher 的版本不变，您可以轻松升级 Kubernetes 的补丁版本（例如：`v1.15.X`)，而不需要不升级 Kubernetes 的正式版本(例如：`v1.X.0`)。

Rancher 用于配置[RKE 集群](/docs/cluster-provisioning/rke-clusters/_index)的信息位于 Rancher Kubernetes 元数据中。有关元数据配置和如何更改用于配置 RKE 集群的 Kubernetes 版本的详细信息，请参考[获取新的 Kubernetes 版本](/docs/admin-settings/k8s-metadata/_index)。

## 启用实验性功能

_v2.3.0 版本可用_

Rancher 包含一些在默认情况下禁用的实验性功能。该功能开关让您能够尝试这些新功能。有关更多信息，请参考关于[功能开关](/docs/installation/options/feature-flags/_index)的章节。
