---
title: UI 管理 Istio 虚拟服务和目标规则
weight: 2
---

此功能可启动一个 UI，用于管理 Istio 的流量，其中包括创建、读取、更新和删除虚拟服务（Virtual Service）和目标规则（Destination Rule）。

> :::note 注意
> 启用此功能并不会启用 Istio。集群管理员需要[为集群启用 Istio]({{<baseurl>}}/rancher/v2.6/en/istio/setup) 才能使用该功能。
> :::

如需启用或禁用此功能，请参见[启用实验功能主页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/)中的说明。

| 环境变量键 | 默认值 | 状态 | 可用于 |
---|---|---|---
| `istio-virtual-service-ui` | `false` | 实验功能 | v2.3.0 |
| `istio-virtual-service-ui` | `true` | GA | v2.3.2 |

# 功能介绍

Istio 流量管理功能的主要优势时允许动态请求路由，这对于金丝雀发布，蓝/绿发布或 A/B 测试都非常有用。

启用此功能后，一个页面会打开，让你通过 Rancher UI 配置 Istio 的某些流量管理功能。如果不使用此功能，你可以通过 `kubectl` 来使用 Istio 管理流量。

此功能会启用两个选项卡，一个用于**虚拟服务**，另一个用于**目标规则**。

- **虚拟服务**：拦截并将流量重定向到你的 Kubernetes Service 上。这样，你可以将部分请求流量定向到不同的服务上。你可以使用这些服务来定义一组路由规则，用于主机寻址。详情请参见 [Istio 官方文档](https://istio.io/docs/reference/config/networking/v1alpha3/virtual-service/)。
- **目标规则**：哪些服务版本可用于接收虚拟服务的流量的唯一可信来源。你可以使用这些资源来定义策略，这些策略适用于路由发生后用于服务的流量。详情请参见 [Istio 官方文档](https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule)。

如需查看选项卡：

1. 点击 **☰ > 集群管理**。
1. 转到安装了 Istio 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **Istio**。
1. 你将看到 **Kiali** 和 **Jaeger** 的选项卡。在左侧导航栏中，你可查看和配置**虚拟服务**和**目标规则**。