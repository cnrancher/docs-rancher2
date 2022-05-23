---
title: 配置选项
weight: 3
---

- [Egress 支持](#egress-support)
- [启用自动 Sidecar 注入](#enabling-automatic-sidecar-injection)
- [覆盖文件](#overlay-file)
- [选择器和抓取配置](#selectors-and-scrape-configs)
- [在具有 Pod 安全策略的情况下启用 Istio](#enable-istio-with-pod-security-policies)
- [在 RKE2 集群上安装 Istio 的其他步骤](#additional-steps-for-installing-istio-on-an-rke2-cluster)
- [项目网络隔离的其他步骤](#additional-steps-for-project-network-isolation)

### Egress 支持

默认情况下，Egress 网关是禁用的，但你可以在安装或升级时使用 values.yaml 或[覆盖文件](#overlay-file)启用它。

### 启用自动 Sidecar 注入

默认情况下，自动 sidecar 注入是禁用的。要启用此功能，请在安装或升级时在 values.yaml 中设置 `sidecarInjectorWebhook.enableNamespacesByDefault=true`。这会自动将 Istio sidecar 注入到所有已部署的新命名空间。

### 覆盖文件

覆盖文件用于为 Istio 进行更广泛的配置。它允许你更改 [IstioOperator API](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/) 中可用的任何值。你可以自定义默认安装以满足你的需求。

覆盖文件将在 Istio Chart 默认安装的基础上添加配置。换言之，你不需要为安装中已定义的组件进行重新定义。

有关覆盖文件的更多信息，请参阅 [Istio 文档](https://istio.io/latest/docs/setup/install/istioctl/#configure-component-settings)。

### 选择器和抓取配置

Monitoring 应用设置了 `prometheus.prometheusSpec.ignoreNamespaceSelectors=false`，即在默认情况下跨所有命名空间进行监控。这样，你可以查看部署在具有 `istio-injection=enabled` 标签的命名空间中的资源的流量、指标和图。

如果你想将 Prometheus 限制为特定的命名空间，请设置 `prometheus.prometheusSpec.ignoreNamespaceSelectors=true`。完成此操作后，你需要添加其他配置来继续监控你的资源。

详情请参阅[本节](./selectors-and-scrape)。

### 在具有 Pod 安全策略的情况下启用 Istio

详情请参阅[本节](./enable-istio-with-psp)。

### 在 RKE2 集群上安装 Istio 的其他步骤

详情请参阅[本节](./rke2)。

### 项目网络隔离的其他步骤

详情请参阅[本节](./canal-and-project-network)。