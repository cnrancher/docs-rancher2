---
title: UI 管理 Istio Virtual Services 和 Istio Destination Rules
description: 此功能可以使用 UI 创建、读取、更新和删除虚拟服务和目标规则，他们负责 Istio 的流量管理功能。
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
  - 安装指南
  - 资料、参考和高级选项
  - 功能开关
  - UI 管理 Istio Virtual Services 和 Istio Destination Rules
---

_自 v2.3.0 起可用_

此功能可以使用 UI 创建、读取、更新和删除虚拟服务和目标规则，负责 Istio 的流量管理功能。

> **先决条件：** 打开此功能不会启用 Istio。集群管理员需要[为集群启用 Istio](/docs/cluster-admin/tools/istio/setup/_index)才能使用该功能。

要启用或禁用此功能，请参阅[关于启用实验性功能的主页](/docs/installation/options/feature-flags/_index)。

| 环境变量 Key               | 默认值  | 状态   | 可用版本 |
| :------------------------- | :------ | :----- | :------- |
| `istio-virtual-service-ui` | `false` | 实验性 | v2.3.0   |
| `istio-virtual-service-ui` | `true`  | GA     | v2.3.2   |

## 关于此功能

Istio 的流量管理功能的主要优势在于它们允许动态请求路由，对于金丝雀发布，蓝/绿发布或 A/B 测试非常有用。

启用后，此功能会打开一个页面，使您可以使用 Rancher UI 配置 Istio 的一些流量管理功能。如果没有此功能，您需要使用`kubectl`来管理 Istio 的流量。

该功能启用了两个 UI 选项卡：一个选项卡用于**虚拟服务** ，另一个选项卡用于**目标规则**

- **虚拟服务** 拦截流量并将其定向到您的 Kubernetes Services 上，从而使您可以将部分请求流量定向到其他服务上。您可以使用它们来定义一组路由规则，以在主机寻址时应用。有关详细信息，请参阅[Istio 文档](https://istio.io/docs/reference/config/networking/v1alpha3/virtual-service/)。
- **目标规则** 是关于哪些版本的服务可用于接收来自虚拟服务的流量的唯一受信任的来源。您可以使用这些资源来定义策略，该策略适用于路由发生后用于服务的流量。有关详细信息，请参阅[Istio 文档](https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule)。

查看这些选项卡，

1. 转到 Rancher 中的项目视图，然后单击**资源 > Istio**。
1. 您将看到以下选项卡：**流量图**（其中将 Kiali 网络可视化集成到 UI 中）和**流量指标**（这些指标显示了成功率和服务请求流量的指标以及其他指标）。在这些选项卡旁边，您应该会看到`虚拟服务`和`目标规则`的选项卡。
