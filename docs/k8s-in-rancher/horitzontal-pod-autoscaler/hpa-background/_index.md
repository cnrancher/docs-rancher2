---
title: HPA 工作原理
---

[Pod 弹性伸缩器](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)（HPA）是 Kubernetes 的一项功能，可以对您的应用进行自动扩容和自动缩容。本节将介绍 HPA 在 Kubernetes 集群中是如何工作的。

### 为什么要使用 HPA？

使用 HPA，您可以自动缩放在 Replication Controller，Deployment 或者 Replica Set 中的 Pod。 HPA 将自动缩放正在运行的 Pod 的数量，以实现最高效率。HPA 中影响 Pod 数量的因素包括：

- 用户定义的允许运行的 Pod 的最小和最大数量。
- 资源指标中报告的观察到的 CPU 或内存使用情况。
- 第三方指标应用程序（例如 Prometheus，Datadog 等）提供的自定义指标。

HPA 通过以下方式改善您的服务：

- 释放将因过多的 Pod 而浪费的硬件资源。
- 按照应用需要的性能，自动提高或降低 Pod 数量。

### HPA 是如何工作的？

![HPA Schema](/img/rancher/horizontal-pod-autoscaler.jpg)

HPA 是通过循环控制来实现的，其循环周期由下面的 `kube-controller-manager` 启动参数控制：

| 参数                                          | 默认值 | 描述                                                           |
| --------------------------------------------- | ------ | -------------------------------------------------------------- |
| `--horizontal-pod-autoscaler-sync-period`     | `30s`  | HPA 审核应用使用资源情况或自定义指标的频率。                   |
| `--horizontal-pod-autoscaler-downscale-delay` | `5m0s` | 缩容操作完成后，HPA 必须等待多长时间才能进行另外一次缩容操作。 |
| `--horizontal-pod-autoscaler-upscale-delay`   | `3m0s` | 扩容操作完成后，HPA 必须等待多长时间才能进行另外一次扩容操作。 |

有关 HPA 的完整文档，请参考[Kubernetes 文档](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)。

### Horizontal Pod Autoscaler API 对象

HPA 是 Kubernetes `autoscaling` API 组中的 API 资源。当前的稳定版本是 `autoscaling/v1` ，仅支持 CPU 自动缩放。为了获得更多基于内存和自定义指标的扩展支持，请改用 beta 版本： `autoscaling / v2beta1` 。

有关 HPA API 对象的更多信息，请参见[HPA GitHub Readme](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object)。
