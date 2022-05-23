---
title: 禁用 Istio
weight: 4
---

本文介绍如何在集群中卸载 Istio，以及如何在命名空间或工作负载中禁用 Istio。

## 在集群中卸载 Istio

要卸载 Istio：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击**应用 & 应用市场 > 已安装的应用**。
1. 在 `istio-system` 命名空间中，转到 `rancher-istio` 并单击 **⋮ > 删除**。
1. 删除 `rancher-istio` 后，选择 `istio-system` 命名空间中所有剩余的应用，然后单击**删除**。

**结果**：已删除集群中的 `rancher-istio` 应用。Istio sidecar 不能部署在集群中的任何工作负载上。

**注意**：你不能再禁用和重新启用你的 Istio 安装。如果你想保存设置以供将来的安装使用，请查看并保存各个 YAML，以便在之后的安装中参考/重复使用。

**卸载疑难解答**：如果你没有按照卸载步骤操作，则可能会在卸载过程中遇到以下警告：

`Error: uninstallation completed with 1 error(s): unable to build kubernetes objects for delete: unable to recognize "": no matches for kind "MonitoringDashboard" in version "monitoring.kiali.io/v1alpha1"`

这可能意味着几种情况。第一种情况是你选择了 `istio-system` 命名空间中的所有应用并同时删除了它们，另一种情况是你在删除 `rancher-istio` Chart 之前删除了`rancher-istio` Chart 依赖项。由于卸载未正确完成，你将需要手动清理 `istio-system` 命名空间中剩余的资源。如果不想进行手动清理，你可以重新安装 `rancher-istio`，然后按照正确的顺序卸载它。

## 在命名空间中禁用 Istio

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 转到要启用 Istio 的命名空间，然后单击**⋮ > 启用 Istio 自动注入**。或者，你也可以单击命名空间，然后在命名空间详情页面上，单击**⋮ > 启用 Istio 自动注入**。

**结果**：如果工作负载部署到此命名空间，它们将没有 Istio sidecar。

## 从工作负载中移除 Istio Sidecar

在命名空间中禁用 Istio，然后重新部署其中的工作负载。这些工作负载将在没有 Istio sidecar 的情况下部署。
