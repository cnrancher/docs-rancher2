---
title: 分配CPU和内存
description: description
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
  - rancher 2.5
  - Istio
  - 分配CPU和内存
---

## 概述

本节适用于 Rancher v2.5.0 中的 Istio。如果您正在使用 Rancher v2.4.x，请参考[本节](/docs/rancher2/cluster-admin/tools/istio/_index)。

本节描述了集群中 Istio 组件的所需的最低计算资源。每个组件的 CPU 和内存分配是[可配置的](#配置资源分配)。在启用 Istio 之前，我们建议您确认您的 Rancher 工作节点有足够的 CPU 和内存来运行 Istio 的所有组件。

:::tip 提示
在较大规模的部署中，强烈建议通过为每个 Istio 组件添加节点选择器，将基础设施放在集群中的专用节点上。
:::

## 分配 CPU 和内存

下表显示了每个核心 Istio 组件的 CPU 和内存的最低推荐资源要求和限额的摘要。

在 Kubernetes 中，资源请求表示工作负载不会部署在节点上，除非该节点至少有指定的内存和 CPU 可用量。如果工作负载超过了 CPU 或内存的限制，就会被终止或从节点上驱逐。有关管理容器的资源限制的更多信息，请参考[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)。

| 工作负载             | CPU 要求  | Mem 要求   | CPU 限额    | Mem 限额     | 是否可配置 |
| :------------------- | :-------- | :--------- | :---------- | :----------- | :--------- |
| Istiod               | 610m      | 2186Mi     | 4000m       | 2048Mi       | 是         |
| Istio-policy         | 1000m     | 1024Mi     | 4800m       | 4096Mi       | 是         |
| Istio-telemetry      | 1000m     | 10214Mi    | 4800m       | 4096Mi       | 是         |
| Istio-ingressgateway | 2000m     | 1024Mi     | 10m         | 40Mi         | 是         |
| Others               | 500m      | 500Mi      | -           | -            | 是         |
| **总计**             | **4500m** | **5620Mi** | **>12300m** | **>14848Mi** | **-**      |

## 单独配置资源分配

您可以单独为每种类型的 Istio 组件配置资源分配。本节包括每个组件的默认资源分配。

为了更容易地将工作负载调度到节点上，集群管理员可以减少组件的 CPU 和内存资源请求。然而，默认的 CPU 和内存分配是我们推荐的最低限度。

你可以在[Istio 官方文档](https://istio.io/)中找到更多关于 Istio 配置的信息。

1. 在 Rancher **集群资源管理器**中，在**应用程序和市场**中导航到您的 Istio 安装。
1. 单击**升级**，通过修改数值来编辑`value.yaml` 或添加[覆盖文件](/docs/rancher2.5/istio/configuration-reference/_index)。
1. 更改 CPU 或内存分配，每个组件将被调度到的节点，或节点容忍度。
1. 单击**Upgrade**完成更改。

**结果：**Istio 组件的资源分配得到更新。
