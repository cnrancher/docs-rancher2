---
title: 在集群中启用Istio
description: 只有分配了cluster-admin Kubernetes默认角色的用户才能在 Kubernetes 集群中配置和安装 Istio
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
  - rancher 2.5
  - Istio
  - 配置 Istio
  - 在集群中启用Istio
---

> **前提条件：**
>
> - 只有分配了`cluster-admin`[Kubernetes 默认角色](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)的用户才能在 Kubernetes 集群中配置和安装 Istio。
> - 如果你有 pod 安全策略，你需要在启用 CNI 的情况下安装 Istio。有关详细信息，请参阅[本节](/docs/rancher2/istio/2.5/configuration-reference/enable-istio-with-psp/_index)。
> - 要在 RKE2 集群上安装 Istio，需要额外的步骤。详情请参见[本节](/docs/rancher2/istio/2.5/configuration-reference/rke2/_index)
> - 要在使用 Canal 网络插件且启用 Project 网络隔离选项的集群中安装 Istio，还需要其他步骤。详情请参阅[本节](/docs/rancher2/istio/2.5/configuration-reference/canal-and-project-network/_index)

## 安装 Istio

1. 从**集群资源管理器**导航到**应用市场**中的可用**Chart**。
1. 选择 Istio chart。
1. 如果您还没有安装自己的监控应用，系统会提示您安装`rancher-monitoring-app`。可选：在安装 rancher-monitoring 应用时设置您的选择器或 Scrape 配置选项。
1. 可选：配置成员权限和资源限额。为 Istio 组件配置成员访问和[资源限额](/docs/rancher2/istio/2.5/resources/_index)。确保你的工作节点上有足够的资源来启用 Istio。
1. 可选：如果需要，对 values.yaml 进行额外的配置更改。
1. 可选：通过[覆盖文件](/docs/rancher2/istio/2.5/configuration-reference/_index)添加额外的资源或配置。
1. 单击**安装**。

**结果：** 已在集群内安装了 Istio。

## 额外的配置选项

关于配置 Istio 的更多信息，请参考[配置参考](/docs/rancher2/istio/2.5/configuration-reference/_index)。
