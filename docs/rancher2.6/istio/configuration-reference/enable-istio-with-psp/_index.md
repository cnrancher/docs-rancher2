---
title: 在具有 Pod 安全策略的情况下启用 Istio
weight: 1
---

如果你启用了限制性 Pod 安全策略（Pod Security Policy），由于 Istio 需要某些权限才能自行安装和管理 pod 基础设施，因此 Istio 可能无法正常运行。在本文中，我们将配置一个为 Istio 启用了 PSP 的集群，并设置 Istio CNI 插件。

Istio CNI 插件不再要求每个应用 pod 具有特权 `NET_ADMIN` 容器。如需更多信息，请参阅 [Istio CNI 插件文档](https://istio.io/docs/setup/additional-setup/cni)。请注意，[Istio CNI 插件处于 alpha 阶段](https://istio.io/about/feature-stages/)。

> **前提**：
>
> - 集群必须是 RKE Kubernetes 集群。
> - 必须使用默认 PodSecurityPolicy 创建集群。
>
> 要在使用 Rancher UI 创建 Kubernetes 集群时启用 Pod 安全策略支持，请转到<b>高级选项</b>。在 <b>Pod 安全策略支持</b>中，单击<b>启用</b>，然后选择一个默认的 pod 安全策略。

1. [将 PodSecurityPolicy 设置为不受限制](#1-set-the-podsecuritypolicy-to-unrestricted)
2. [启用 CNI](#2-enable-the-cni)
3. [验证 CNI 是否正常工作](#3-verify-that-the-cni-is-working)

### 1. 将 PodSecurityPolicy 设置为不受限制

不受限制的 PSP 支持安装 Istio。

在安装 Istio 的项目或计划安装 Istio 的项目中，将 PSP 设置为 `unrestricted`。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 单击**集群 > 项目/命名空间**。
1. 找到**项目: System**，然后选择 **⋮ > 编辑配置**。
1. 将 Pod 安全策略选项更改为不受限制，然后单击**保存**。

### 2. 启用 CNI

通过**应用 & 应用市场**安装或升级 Istio 时：

1. 单击**组件**。
2. 选中**启用 CNI**旁边的框。
3. 完成 Istio 的安装或升级。

你也可以通过编辑 `values.yaml` 来启用 CNI：

```
istio_cni.enabled: true
```

在集群中启用 CNI 后，Istio 应该能成功安装。

### 3. 验证 CNI 是否正常工作

通过部署[示例应用](https://istio.io/latest/docs/examples/bookinfo/)或部署你自己的应用，来验证 CNI 是否正常工作。

