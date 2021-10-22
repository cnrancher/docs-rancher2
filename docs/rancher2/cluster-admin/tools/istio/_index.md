---
title: 功能介绍
description: Istio是一种开源工具，可使 DevOps 团队更轻松地观察，控制，故障排查和保护复杂的微服务网络中的流量。随着微服务网络的变化和增长，它们之间的交互会变得更加难以管理和理解。在这种情况下，将服务网格作为单独的基础结构层很有用。 Istio 的服务网格使您可以管理微服务之间的流量，而无需直接更改微服务。我们与 Istio 的集成旨在使 Rancher 运维（例如管理员或集群所有者）可以将 Istio 交付给开发人员。然后，开发人员可以使用 Istio 实施安全策略，解决问题或管理绿色/蓝色部署，金丝雀部署或 A / B 测试的流量。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - 功能介绍
---

_从 v2.3.0 版本开始支持_

[Istio](https://istio.io/) 是一种开源工具，可以让 DevOps 团队更轻松地监控保护微服务网络中的流量。

随着微服务网络的变化和增长，它们之间的交互会变得更加难以管理。在这种情况下，将 Istio 服务网格作为单独的基础结构，可以操纵微服务之间的流量，而无需直接更改微服务。

Rancher 与 Istio 的集成旨在使 Rancher 运维人员（例如管理员或集群所有者）可以将 Istio 交付给开发人员。然后，开发人员可以使用 Istio 实施安全策略，解决问题或管理绿色/蓝色部署，金丝雀部署或 A / B 测试的流量。

服务网格提供的功能包括但不限于以下功能：

- 流量管理功能
- 增强的监视和跟踪
- 服务发现和路由
- 使用双向 TLS 的安全连接和服务到服务的身份验证
- 负载均衡
- 自动重试，退避和断路

在集群中启用 Istio 之后，您可以通过 `kubectl` 来使用 Istio 的 control-plane 功能。

Rancher 的 Istio 集成附带了全面的可视化辅助工具：

- **使用 Jaeger 跟踪错误的根本原因。** [Jaeger](https://www.jaegertracing.io/) 是一个开放源代码工具，它为分布式跟踪系统提供 UI，这对于根本原因分析和确定导致性能下降的原因很有用。分布式跟踪使您可以查看整个调用链，这些调用可能源于用户请求并遍历数十个微服务。
- **使用 Kiali 全面了解您的微服务架构。** [Kiali](https://www.kiali.io/) 提供了一个 Chart，显示了服务网格中的服务及其连接方式，包括流量速率和它们之间的延迟。您可以检查服务网格的运行状况，或深入查看单个组件的传入和传出请求。
- **使用 Grafana 仪表盘从时间序列分析中获得见解。** [Grafana](https://grafana.com/) 是一个分析平台，可让您查询，可视化，警告和了解 Prometheus 收集的数据。
- **使用 Prometheus UI 编写时间序列数据的自定义查询。** [Prometheus](https://prometheus.io/) 是系统监视和警报工具包。Prometheus 会从您的集群中抓取数据，然后由 Grafana 使用。Prometheus UI 也集成到 Rancher 中，使您可以编写时间序列数据的自定义查询并在 UI 中查看结果。

## 先决条件

在启用 Istio 之前，我们建议您确认 Rancher worker 节点具有足够的 [CPU 和内存](/docs/rancher2/cluster-admin/tools/istio/resources/_index)以运行 Istio 的所有组件。

## 设定指南

有关如何设置 Istio 并将其在项目中使用的说明，请参考[设定指南](/docs/rancher2/cluster-admin/tools/istio/setup/_index)。

## 禁用 Istio

要从集群，命名空间或工作负载中删除 Istio 组件，请参阅[禁用 Istio](/docs/rancher2/cluster-admin/tools/istio/disabling-istio/_index)。

## 访问可视化

> 默认情况下，只有集群所有者才能访问 Jaeger 和 Kiali。关于如何允许项目成员访问它们的说明，请参阅[访问可视化](/docs/rancher2/cluster-admin/tools/istio/rbac/_index)。

在集群中设置 Istio 之后，Rancher UI 中将提供 Grafana，Prometheus，Jaeger 和 Kiali 访问。

您对可视化的访问取决于您的角色。Grafana 和 Prometheus 仅适用于集群所有者。默认情况下，Kiali 和 Jaeger UI 仅对集群所有者可用，但是集群所有者可以通过编辑 Istio 设置来允许项目成员访问它们。当您转到项目并单击**资源> Istio**时，您可以通过单击页面右上角的图标来转到 Kiali，Jaeger，Grafana 和 Prometheus 各自的 UI。

要查看可视化效果，请转到设置 Istio 的集群，然后单击**工具 > Istio**。您能在页面顶部看到每个 UI 的链接。

您还可以从项目视图访问可视化工具。

## 查看 Kiali 流量图

1. 在 Rancher 的项目视图中，单击**资源 > Istio**。
1. 如果您是集群所有者，则可以转到**流量图**标签页。该标签页将 Kiali 网络可视化集成到 UI 中。

## 查看流量指标

Istio 的监控功能使您可以查看所有服务的性能。

1. 在 Rancher 中的项目视图中，单击**资源 > Istio**。
1. 转到**流量指标**标签。在集群中生成流量之后，您应该能够看到**成功率，请求量，4xx 响应计数，项目 5xx 响应计数**和**请求持续时间**的指标。集群所有者可以查看所有指标 ，而项目成员可以查看指标的一部分。

## 架构

Istio 安装了一个服务网格，该网格使用 [Envoy](https://www.envoyproxy.io/docs/envoy/v1.15.0/intro/arch_overview/upstream/service_discovery.html/) sidecar 代理来拦截到每个工作负载的流量。这些 sidecar 拦截并管理服务到服务的通信，从而可以对集群内的流量进行细粒度的观察和控制。

Istio 只能跟踪和控制已注入 Istio sidecar 的工作负载。

在 Rancher 中启用 Istio 将启用集群监控，并在集群中创建的所有新命名空间中启用 Istio。您需要在预先存在的命名空间中手动启用 Istio。

当命名空间启用 Istio 时，在命名空间中部署的新工作负载将自动具有 Istio sidecar。您需要在预先存在的工作负载中手动启用 Istio。

有关 Istio sidecar 的更多信息，请参阅 [Istio 文档](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/)。

## 两个入口

默认情况下，每个 Rancher 配置的集群都有一个 NGINX ingress 控制器，允许流量进入集群。要允许 Istio 接收外部流量，您需要为集群启用 Istio ingress 网关。结果是您的集群将有两个入口。

![在启用Istio的集群中，您可以有两个入口：默认的Nginx ingress控制器和默认的Istio控制器。](/img/rancher/istio-ingress.svg)
