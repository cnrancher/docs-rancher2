---
title: Istio
weight: 14
---

[Istio](https://istio.io/) 是一种开源工具，可以让 DevOps 团队更轻松地观察、控制、排查并保护复杂的微服务网络中的流量。

随着微服务网络的变化和增长，微服务网络之间的交互变得越来越难以管理和理解。在这种情况下，将服务网格作为单独的基础设施层是非常有用的。Istio 的服务网格可以让你在不直接更改微服务的情况下控制微服务之间的流量。

Rancher 与 Istio 集成，使得管理员或集群所有者可以将 Istio 交给开发者团队，然后开发者使用 Istio 执行安全策略，排查问题，或为蓝绿部署，金丝雀部署，和 A/B 测试进行流量管理。

此核心服务网格支持但不限于以下功能：

- **管理流量**：例如入口和出口路由、断路、镜像。
- **安全**：具有用于验证和授权流量和用户的资源，包括 mTLS。
- **可观察性**：观察日志、指标和分布式流量。

[设置 Istio]({{<baseurl>}}/rancher/v2.6/en/istio/setup) 后，你可以通过 Rancher UI、`kubectl` 或 ` Istioctl` 来使用 Istio 的 control plane 功能。

Istio 需要由 `cluster-admin` 设置后才能在项目中使用。

- [Rancher 2.5 的新功能](#what-s-new-in-rancher-v2-5)
- [Istio 附带的工具](#tools-bundled-with-istio)
- [前提](#prerequisites)
- [设置指南](#setup-guide)
- [卸载 Istio](#remove-istio)
- [迁移旧 Istio 版本](#migrate-from-previous-istio-version)
- [访问可视化](#accessing-visualizations)
- [架构](#architecture)
- [在 RKE2 集群上安装 Istio 的其他步骤](#additional-steps-for-installing-istio-on-an-rke2-cluster)

## Rancher 2.5 的新功能

Istio 已简化了整体架构。结合 Pilot、Citadel、Galley 和 sidecar injector 创建了一个单独的组件 Istiod。Node Agent 功能也已合并到 istio-agent 中。

以前由 Istio 安装的插件（cert-manager、Grafana、Jaeger、Kiali、Prometheus、Zipkin）现在需要单独安装。Istio 支持安装来自 Istio 项目的集成，并保持与非 Istio 项目的兼容性。

你仍然可以通过安装 [Rancher Monitoring]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/) 或安装你自己的 Prometheus operator 来使用 Prometheus 集成。Rancher 的 Istio chart 还默认安装 Kiali，确保你可以开箱即用地全面了解微服务。

Istio 已经脱离了使用 Helm 安装的方式，现在通过 Istioctl 二进制文件或 Istio Operator 进行安装。为了使用最简单的方式与 Istio 交互，Rancher 的 Istio 会维护一个 Helm Chart，该 Chart 使用 Istioctl 二进制文件来管理你的 Istio 安装。

此 Helm Chart 将在 UI 的**应用 & 市场市场**中提供。有权访问 Rancher Chart 应用商店的用户需要先设置 Istio，然后才能在项目中使用它。

## Istio 附带的工具

我们的 [Istio](https://istio.io/) 安装程序将 istioctl 二进制命令包装在一个 Helm chart 中，其中包括一个覆盖文件的选项，用来支持复杂的自定义配置。

它还包括以下内容。

### Kiali

Kiali 是一个全面的可视化辅助工具，用于绘制整个服务网格中的流量图。它允许你查看它们的连接方式，包括它们之间的流量速率和延迟。

你可以检查服务网格的运行状况，或深入查看单个组件的传入和传出请求。

### Jaeger

Jaeger 是用于跟踪分布式系统的工具。我们的 Istio 安装程序包括能快速启动的一体化 [Jaeger](https://www.jaegertracing.io/) 安装。

请注意，这不是符合 Jaeger 生产要求的部署。此部署使用在内存中的存储组件，而 Jaeger 推荐在生产环境中使用持久存储组件。有关你所需的部署策略的更多信息，请参阅 [Jaeger 文档](https://www.jaegertracing.io/docs/latest/operator/#production-strategy)。

## 前提

在启用 Istio 之前，建议你先确认你的 Rancher worker 节点是否有足够的 [CPU 和内存]({{<baseurl>}}/rancher/v2.6/en/istio/resources)来运行 Istio 的所有组件。

如果要在 RKE2 集群上安装 Istio，则需要执行一些额外的步骤。有关详细信息，请参阅[本节](#additional-steps-for-installing-istio-on-an-rke2-cluster)。

请注意，Istio v2（上游 Istio v1.7+）无法在离线环境中升级。

## 设置指南

如需了解如何设置 Istio 并在项目中使用它，请参阅[设置指南]({{<baseurl>}}/rancher/v2.6/en/istio/setup)。

## 卸载 Istio

要从集群、命名空间或工作负载中删除 Istio 组件，请参阅[卸载 Istio]({{<baseurl>}}/rancher/v2.6/en/istio/disabling-istio/)。

## 迁移旧 Istio 版本

如果你的 Istio 版本低于 1.7.x，则没有升级路径。要在**应用 & 应用市场**页面安装 Istio，你需要在旧版 Rancher UI 的全局视图中禁用现有的 Istio。

如果你有大量其他的 Istio CRD，你可能需要手动迁移两个 Istio 版本都支持的 CRD。为此，你可以运行 `kubectl get <resource> -n istio-system -o yaml`，保存输出的 yaml，并在新版本中重新应用。

另一种选择是一次手动卸载一个 Istio 资源，但保留两个 Istio 版本都支持且最新版本不会安装的资源。此方法有可能导致安装新版本时出现问题。你可以根据你的实际情况选择是否采用该方法。

## 访问可视化

> 默认情况下，只有 cluster-admin 可以访问 Kiali。有关如何允许具有管理员、编辑或查看权限的角色访问它们的说明，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/istio/rbac/)。

在集群中设置 Istio 后，你可以在 Rancher UI 中使用 Grafana、Prometheus 和 Kiali。

要访问 Grafana 和 Prometheus 可视化：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要可视化的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**监控**。
1. 点击 **Grafana** 或任何其他仪表板。

要访问 Kiali 可视化：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要查看 Kiali 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **Istio**。
1. 单击 **Kiali**。从这里，你可以访问**流量图**或**流量指标**选项卡，从而可视化网络指标。

默认情况下，prometheus 会拾取所有命名空间，并将数据用于 Kiali 图。如果你想使用不同的配置进行 prometheus 数据抓取，请参阅[选择器/抓取配置](./configuration-reference/selectors-and-scrape)。

你的角色决定了你对可视化的访问。只有 `cluster-admin` 角色可以使用 Grafana 和 Prometheus。默认情况下，只有 `cluster-admin` 可以使用 Kiali UI，但是 `cluster-admin` 可以通过编辑 Istio values.yaml 来允许其他角色进行访问。

## 架构

Istio 安装了一个服务网格，它使用 [Envoy](https://www.envoyproxy.io/learn/service-mesh) Sidecar 代理来拦截到每个工作负载的流量。这些 sidecar 拦截并管理服务之间的通信，从而实现精细化观察并控制集群内的流量。

只有注入了 Istio sidecar 的工作负载可以通过 Istio 进行跟踪和控制。

如果命名空间启用了 Istio，部署到命名空间的新工作负载会自动具有 Istio sidecar。你需要为之前的工作负载手动启用 Istio。

有关 Istio sidecar 的更多信息，请参阅 [Istio sidecare-injection 文档](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/)。有关 Istio 架构的更多信息，请参阅 [Istio 架构文档](https://istio.io/latest/docs/ops/deployment/architecture/)。

### 多个 Ingress

默认情况下，每个 Rancher 配置的集群都有一个 NGINX Ingress Controller 来允许流量进入集群。Istio 还在 `istio-system` 命名空间中默认安装一个 Ingress Gateway。因此，你的集群将有两个 ingress。

![启用 Istio 的集群可以有两个 ingress，分别是默认的 Nginx ingress 和默认的 Istio controller]({{<baseurl>}}/img/rancher/istio-ingress.svg)

可以通过[覆盖文件]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/#overlay-file)来启用其他 Istio Ingress Gateway。

### Egress 支持

默认情况下，Egress 网关是禁用的，但你可以在安装或升级时使用 values.yaml 或[覆盖文件]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/#overlay-file)启用它。

## 在 RKE2 集群上安装 Istio 的其他步骤

要在 RKE2 集群上安装 Istio，请按照[步骤]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/rke2/)进行操作。
