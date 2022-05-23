---
title: Horizontal Pod Autoscaler 介绍
weight: 3027
---

[Horizontal Pod Autoscaler（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)是一项 Kubernetes 功能，用于将集群配置为自动扩缩其运行的服务。本节介绍 HPA 如何与 Kubernetes 一起工作。

## 为什么要使用 Horizo​​ntal Pod Autoscaler？

你可以使用 HPA 来自动扩缩 ReplicationController、Deployment 或 ReplicaSet 中的 pod 数量。HPA 会自动扩缩正在运行的 pod 数量以实现最高效率。影响 pod 数量的因素包括：

- 允许运行的最小和最大 pod 数，由用户定义。
- 资源指标中报告的 CPU/内存使用情况。
- 第三方指标应用程序（如 Prometheus、Datadog 等）提供的自定义指标。

HPA 通过以下方式改进你的服务：

- 释放硬件资源，避免资源被过多的 pod 浪费。
- 按需提高/降低性能以达到服务级别协议。

## HPA 的工作原理

![HPA 架构]({{<baseurl>}}/img/rancher/horizontal-pod-autoscaler.jpg)

HPA 实现为一个控制循环，其周期由以下 `kube-controller-manager` 标志控制：

| 标志 | 默认 | 描述 |
---------|----------|----------|
| `--horizontal-pod-autoscaler-sync-period` | `30s` | HPA 在 deployment 中审核资源/自定义指标的频率。 |
| `--horizontal-pod-autoscaler-downscale-delay` | `5m0s` | 完成缩减操作后，HPA 必须等待多长时间才能启动另一个缩减操作。 |
| `--horizontal-pod-autoscaler-upscale-delay` | `3m0s` | 完成扩展操作后，HPA 必须等待多长时间才能启动另一个扩展操作。 |


有关 HPA 的完整文档，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)。

## Horizo​​ntal Pod Autoscaler API 对象

HPA 是 Kubernetes `autoscaling` API 组中的 API 资源。当前的稳定版本是 `autoscaling/v1`，它只支持对 CPU 自动扩缩。要获得内存和自定义指标的扩缩支持，请改用 beta 版本 `autoscaling/v2beta1`。

有关 HPA API 对象的更多信息，请参阅 [HPA GitHub 自述文件](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object)。
