---
title: CPU 和内存分配
weight: 1
---

本文介绍我们建议在集群中分配给 Istio 组件的最少计算资源。

每个组件的 CPU 和内存分配是[可配置](#configuring-resource-allocations)的。

在启用 Istio 之前，建议你先确认你的 Rancher worker 节点是否有足够的 CPU 和内存来运行 Istio 的所有组件。

> **提示**：在规模较大的部署中，我们强烈建议通过为每个 Istio 组件添加节点选择器，来将基础设施放置在集群中的专用节点上。

下表总结了每个核心 Istio 组件推荐配置的 CPU 和内存的最低资源请求和限制。

Kubernetes 中的资源请求指的是，除非该节点至少具有指定数量的可用内存和 CPU，否则工作负载不会部署在节点上。如果工作负载超过 CPU 或内存的限制，则可以将其从节点中终止或驱逐。有关管理容器资源限制的更多信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

| 工作负载 | CPU - 请求 | 内存 - 请求 | CPU - 限制 | 内存 - 限制 |
|----------------------|---------------|------------|-----------------|-------------------|
| 入口网关 | 100m | 128mi | 2000m | 1024mi |
| 出口网关 | 100m | 128mi | 2000m | 1024mi |
| istiod | 500m | 2048mi | 没有限制 | 没有限制 |
| proxy | 10m | 10mi | 2000m | 1024mi |
| **总计：** | **710m** | **2314Mi** | **6000m** | **3072Mi** |

## 配置资源分配

你可以为每种类型的 Istio 组件单独配置资源分配。本节介绍了每个组件默认分配的资源。

为了更轻松地将工作负载调度到节点，集群管理员可以降低组件的 CPU 和内存资源请求。默认 CPU 和内存分配是我们推荐的最小值。

关于 Istio 配置的更多信息，请参阅 [Istio 官方文档](https://istio.io/)。

要配置分配给 Istio 组件的资源：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，点击**应用 & 应用市场**。
1. 点击**已安装的应用**。
1. 转到 `istio-system` 命名空间。在某个 Istio 工作负载中（例如 `rancher-istio`），点击**⋮ > 编辑/升级**。
1. 点击**升级**，然后通过更改 values.yaml 或添加[覆盖文件]({{<baseurl>}}/rancher/v2.6/en/istio/configuration-reference/#overlay-file)来编辑基本组件。有关编辑覆盖文件的更多信息，请参阅[本节](./#editing-the-overlay-file)。
1. 更改 CPU 或内存分配、调度各个组件的节点，或节点容忍度。
1. 点击**升级**。然后，更改就能启用。

**结果**：已更新 Istio 组件的资源分配。

### 编辑覆盖文件

覆盖文件可以包含 [Istio Operator 规范](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/#IstioOperatorSpec)中的任意值。包含 Istio 应用的覆盖文件只是覆盖文件潜在配置的一个示例。

只要文件包含 `kind: IstioOperator` 且 YAML 选项有效，文件就可以用作覆盖。

在 Istio 应用提供的示例覆盖文件中，以下部分能让你更改 Kubernetes 资源：

```
#      k8s:
#        resources:
#          requests:
#            cpu: 200m
```
