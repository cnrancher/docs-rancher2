---
title: 使用 Rancher UI 管理 HPA
weight: 3028
---

Rancher UI 支持创建、管理和删除 HPA。你可以将 CPU 或内存使用情况配置为用于 HPA 扩缩的指标。

如果你想使用 CPU/内存之外的其他指标创建 HPA，请参阅[配置 HPA 以使用 Prometheus 的自定义指标进行扩缩]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/#configuring-hpa-to-scale-using-custom-metrics-with-prometheus)。

## 创建 HPA

1. 点击左上角 **☰ > 集群管理**。
1. 转到要创建 HPA 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**服务发现 > Horizo​​ntalPodAutoscalers**。
1. 单击**创建**。
1. 为 HPA 选择 **命名空间**。
1. 输入 HPA 的**名称**。
1. 选择**目标引用**作为 HPA 的扩缩目标。
1. 为 HPA 指定**最小副本数**和**最大副本数**。
1. 配置 HPA 的指标。你可以将内存或 CPU 使用率作为让 HPA 扩缩服务的指标。在**数量**字段中，输入让 HPA 扩缩服务的工作负载内存/CPU 使用率的百分比。要配置其他 HPA 指标，包括 Prometheus 提供的指标，你需要[使用 kubectl 管理 HPA]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/#configuring-hpa-to-scale-using-custom-metrics-with-prometheus)。

1. 单击**创建**以创建HPA。

> **结果**：HPA 已被部署到选定的命名空间。你可以在项目的**资源 > HPA** 视图中查看 HPA 的状态。

## 获取 HPA 指标和状态

1. 点击左上角 **☰ > 集群管理**。
1. 转到具有 HPA 的集群并单击 **Explore**。
1. 在左侧导航栏中，单击**服务发现 > Horizo​​ntalPodAutoscalers**。**Horizo​​ntalPodAutoscalers** 页面显示当前副本的数量。

有关特定 HPA 的更详细指标和状态，请单击 HPA 的名称。你会转到 HPA 的详情页面。


## 删除 HPA

1. 点击左上角 **☰ > 集群管理**。
1. 转到要删除的 HPA 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**服务发现 > Horizo​​ntalPodAutoscalers**。
1. 单击**资源 > HPA**。
1. 找到要删除的 HPA，然后单击 **⋮ > 删除**。
1. 单击**删除**以进行确认。

> **结果**：HPA 已从当前集群中删除。
