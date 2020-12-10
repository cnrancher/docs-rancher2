---
title: Istio
description: 随着微服务网络的变化和增长，微服务网络之间的交互会变得越来越难以管理。在这种情况下，使用服务网格作为一个独立的基础设施层是非常有用的。Istio 可以让你在不直接改变微服务的情况下控制微服务之间的流量。我们对 Istio 的集成设计为，Rancher 管理员或集群所有者，可以将 Istio 交付给开发人员团队。然后，开发人员可以使用 Istio 来执行安全策略，排除问题，或管理蓝绿部署、金丝雀部署或 A/B 测试。
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
  - Istio
  - rancher 2.5
---

## 概述

[Istio](https://istio.io/)是一个开源工具，它简化了 DevOps 团队查看、保护、控制和排除复杂的微服务网络中流量的过程。Istio 允许您连接、保护、控制和观察服务。

随着微服务网络的变化和增长，微服务网络之间的交互会变得越来越难以管理。在这种情况下，使用服务网格作为一个独立的基础设施层是非常有用的。Istio 可以让你在不直接改变微服务的情况下控制微服务之间的流量。

我们对 Istio 的集成设计为，Rancher 管理员或集群所有者，可以将 Istio 交付给开发人员团队。然后，开发人员可以使用 Istio 来执行安全策略，排除问题，或管理蓝绿部署、金丝雀部署或 A/B 测试。

该核心服务网提供的功能包括但不限于以下内容：

- **流量管理**，如入口和出口路由、断路、镜像。
- **安全**，有资源对流量和用户进行认证和授权，包括 mTLS。
- **可观察性**，观察日志、度量和分布式流量。

在[设置 istio](/docs/rancher2/cluster-admin/tools/istio/setup/_index)之后，您可以通过集群资源管理器、`kubectl`或`istioctl`来利用 Istio 的 controlplane 功能。

Rancher 集成的 Istio 带有一个全面的可视化辅助工具[Kiali](https://www.kiali.io/)。Kiali 提供了一个图表，显示了服务网状结构中的服务以及它们之间的连接方式，包括它们之间的流量速率和延迟。您可以检查服务网状结构的健康状况，或者深入查看对单个组件的传入和传出请求。

在项目中使用 Istio 之前，需要由`cluster-admin`（集群管理员）进行设置。

## Rancher 2.5 的新功能

Istio 的整体架构已被简化。通过合并 Pilot、Citadel、Galley 和 sidecar injector，创建了一个单一的组件 Istiod。节点代理功能也被合并到 istio-agent 中。

之前由 Istio 安装的插件（cert-manager、Grafana、Jaeger、Kiali、Prometheus、Zipkin）现在需要单独安装。Istio 将支持安装来自 Istio 项目的集成组件，并将保持与那些非集成组件的兼容性。

通过安装[Rancher 监控](/docs/rancher2/monitoring-alerting/_index)，或者自己安装的 Prometheus，仍然可以使用 Prometheus 集成。Rancher 的 Istio 图也会默认安装 Kiali，以确保你可以在开箱即获得微服务的全貌。

在 Rancher 2.5 中，安装 Istio 的方式发生了变化：Istio 已经脱离了 Helm 作为安装 Istio 的方式，现在通过 istioctl 二进制或 Istio Operator 安装 Istio。为了确保与 Istio 进行最简单的交互，Rancher 的 Istio 将维护一个利用 istioctl 二进制来管理您的 Istio 安装的 Helm chart。

这个 Helm chart 将通过 UI 中的应用市场提供。有权限访问 Rancher 应用市场的用户需要在项目中使用 Istio 之前对其进行设置。

## 前提条件

在启用 Istio 之前，我们建议您确认您的 Rancher 工作节点有足够的[CPU 和内存](/docs/rancher2/cluster-admin/tools/istio/resources/_index)来运行 Istio 的所有组件。

## 配置指南

参考[Istio 配置指南](/docs/rancher2/cluster-admin/tools/istio/setup/_index)了解如何设置 Istio 并在项目中使用 Istio。

## 移除 Istio

从集群、命名空间或工作负载中移除 Istio 组件，请参考 [卸载 Istio](/docs/rancher2/cluster-admin/tools/istio/disabling-istio/_index)。

## 从以前的 Istio 版本迁移

要在**集群资源管理器**中成功安装 Istio，您需要在**集群管理器**中禁用您现有的 Istio。

如果你有大量额外的 Istio CRD，你可以考虑手动迁移两个版本 Istio 都支持的 CRD。你可以通过运行`kubectl get <resource> -n istio-system -o yaml`，保存输出的 yaml 并在新版本中重新应用来实现。

另一种方法是每次手动卸载 istio 资源，但要保留两个版本的 Istio 都支持的资源，而最新版本不会安装的资源。这种方法容易导致安装新版本之后，在迁移资源的时候出现问题。如果新旧版本的 istio 兼容您的所有资源，这种方式可能是一个更好的选择。

## 查看可视化数据的权限

默认情况下，只有集群管理员才有权限访问 Kiali。关于如何允许管理员、编辑或视图角色访问它们的说明，请参阅[访问可视化](/docs/rancher2/cluster-admin/tools/istio/rbac/_index)。

在集群中设置 Istio 后，Grafana、Prometheus 和 Kiali 可在 Rancher UI 中使用。

要访问 Grafana 和 Prometheus 可视化，请从**集群资源管理器**导航到**监控**应用程序概览页，并单击**Grafana**或**Prometheus**。

要访问 Kiali 可视化，请从**集群资源管理器**导航到**Istio**应用程序概览页面，然后单击**Kiali**。从这里，您可以访问**流量图**选项卡或**流量指标**选项卡来查看网络可视化和指标。

默认情况下，所有命名空间将被 prometheus 拾取并使数据可用于 Kiali 图。如果你想为 prometheus 数据拉取使用不同的配置，请参考[选择器/刮取配置设置](/docs/rancher2/cluster-admin/tools/istio/setup/enable-istio-in-cluster/_index)。

您对可视化的访问权限由您的角色决定。Grafana 和 Prometheus 只适用于`cluster-admin`角色。Kiali UI 默认只对`cluster-admin`有效，但`cluster-admin`可以通过编辑 Istio values.yaml 允许其他角色访问它们。

## 架构

Istio 安装了一个服务网状结构，使用[Envoy](https://www.envoyproxy.io/learn/service-mesh)sidecar 代理来拦截每个工作负载的流量。这些 sidecars 拦截和管理服务到服务的通信，允许对集群内的流量进行细粒度的观察和控制。

只有注入了 Istio sidecar 的工作负载才能被 Istio 跟踪和控制。

当一个命名空间启用了 Istio 后，部署在该命名空间中的新工作负载将自动拥有 Istio sidecar。您需要在预先存在的工作负载中手动启用 Istio。

有关 Istio sidecar 的更多信息，请参考[Istio sidecare-injection docs](https://istio.io/docs/setup/kubernetes/additional-setup/sidecar-injection/)，有关 Istio 架构的更多信息，请参考[Istio Architecture docs](https://istio.io/latest/docs/ops/deployment/architecture/)。

## 多个 Ingresses

默认情况下，每个 Rancher 提供的集群都有一个 NGINX 入口控制器，允许流量进入集群。Istio 也默认安装一个入口网关到`istio-system`命名空间。其结果是，您的集群中会有两个入口。

![在启用Istio的集群中，你可以有两个入口：默认的Nginx入口和默认的Istio控制器。](/static/img/rancher/istio-ingress.svg)

通过[覆盖文件](/docs/rancher2/istio/2.5/setup/enable-istio-in-cluster/_index)可以启用额外的 Istio Ingress 网关。

## Egress 支持

默认情况下，Egress 网关是禁用的，但可以在安装或升级时通过 `values.yaml` 或[overlay 文件](/docs/rancher2/istio/2.5/setup/enable-istio-in-cluster/_index)启用。
