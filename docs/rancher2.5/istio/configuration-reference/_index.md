---
title: 配置选项
---

## 启用 Egress 网关

默认情况下，Rancher 禁用了 Egress 网关。您可以在安装或升级 Rancher 时，通过 编辑`values.yaml` 或通过 overlay file 启用 Egress 网关。

## 启用自动 Sidecar 注入

默认情况下，Rancher 禁用了自动 sidecar 注入功能。

您可以在安装或升级 Rancher 时，将`values.yaml` 中的`sidecarInjectorWebhook.enableNamespacesByDefault`参数的布尔值修改为`true`，以启用这个功能。启用后，Rancher 会自动 注入 Istio sidecar 到所有新部署的命名空间中。

## overlay file

overlay file 的设计是为了支持您的 Istio 安装的广泛配置。它允许您对[IstioOperator API](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/)中的任何值进行更改。这将确保您可以自定义默认安装以适应任何情况。

overlay file 将在 Istio Chart 安装提供的默认安装之上添加配置。这意味着你不需要重新定义已经定义安装的组件。

有关 Overlay 文件的更多信息，请参考[Istio 文档](https://istio.io/latest/docs/setup/install/istioctl/#configure-component-settings)。

## 选择器和拉取配置

监控应用程序设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=false`，默认情况下可以跨所有命名空间进行监控。这确保您可以查看部署在带有`istio-injection=enabled`标签的命名空间中的资源的流量、指标和 Chart。

如果你想将 Prometheus 限制在特定的命名空间，请设置`prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。一旦你这样做，你将需要添加额外的配置来继续监控你的资源。

详情请参考[本节](/docs/rancher2.5/istio/configuration-reference/selectors-and-scrape/_index)

## 启用 Istio 与 Pod 安全策略

参考[本节](/docs/rancher2.5/istio/configuration-reference/enable-istio-with-psp/_index)

## 在 RKE2 集群上安装 Istio 的额外步骤

参见[本节](/docs/rancher2.5/istio/configuration-reference/rke2/_index)

## Canal 网络插件与项目网络隔离的额外步骤

参见[本节](/docs/rancher2.5/istio/configuration-reference/canal-and-project-network/_index)
