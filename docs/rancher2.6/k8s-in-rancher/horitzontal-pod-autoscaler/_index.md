---
title: Horizontal Pod Autoscaler
description: 了解 Pod 水平自动扩缩 (HPA)。如何管理 HPA 以及如何使用服务部署来进行测试
weight: 3026
---

[Horizontal Pod Autoscaler（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)是一项 Kubernetes 功能，用于将集群配置为自动扩缩其运行的服务。

Rancher 提供了一些附加功能来帮助管理 HPA，具体取决于 Rancher 的版本。

你可以使用 Rancher UI 创建、管理和删除 HPA。仅在 `autoscaling/v2beta2` API 中支持 HPA。

## 管理 HPA

管理 HPA 的方式因你的 Kubernetes API 版本而异：

- **Kubernetes API 版本 autoscaling/V2beta1**：允许根据应用程序的 CPU 和内存利用率自动扩缩 pod。
- **Kubernetes API 版本 autoscaling/V2beta2**：允许根据 CPU 和内存利用率以及自定义指标自动扩缩 pod。

你可以使用 Rancher UI 创建、管理和删除 HPA。在 Rancher UI 中，你可以将 HPA 配置为根据 CPU 和内存利用率进行扩缩。有关详细信息，请参阅[使用 Rancher UI 管理 HPA]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui)。如需根据自定义指标进行 HPA，你仍然需要使用 `kubectl`。有关详细信息，请参阅[配置 HPA 以使用 Prometheus 自定义指标进行扩缩]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/#configuring-hpa-to-scale-using-custom-metrics-with-prometheus)。

在 Rancher 2.0.7 及更高版本中创建的集群自动满足使用 HPA 的所有要求（metrics-server 和 Kubernetes 集群配置）。
## 使用服务部署测试 HPA

你可以转到你的项目并单击**资源 > HPA**来查看​​ HPA 当前的副本数。有关详细信息，请参阅[获取 HPA 指标和状态]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui/)。

你还可以使用 `kubectl` 来获取你使用负载测试工具测试的 HPA 的状态。有关详细信息，请参阅[使用 kubectl 测试 HPA]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/horitzontal-pod-autoscaler/testing-hpa/).
