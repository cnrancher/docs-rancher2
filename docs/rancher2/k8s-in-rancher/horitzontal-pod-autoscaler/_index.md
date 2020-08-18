---
title: Pod 弹性伸缩（HPA）
description: Pod 弹性伸缩（HPA）是 Kubernetes 的一项功能，可以对您的应用进行自动扩容和自动缩容。Rancher 提供了一些额外功能来帮助您管理 HPA，具体取决于 Rancher 的版本。您可以在 Rancher v2.3.0 或更高版本中的 Rancher UI 创建，管理和删除 HPA。Rancher UI 仅支持 `autoscaling/v2beta2` 版本的 HPA。
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
  - 用户指南
  - Pod 弹性伸缩
  - Pod 弹性伸缩（HPA）
---

[Pod 弹性伸缩器](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)（HPA）是 Kubernetes 的一项功能，可以对您的应用进行自动扩容和自动缩容。

Rancher 提供了一些额外功能来帮助您管理 HPA，具体取决于 Rancher 的版本。

您可以在 Rancher v2.3.0 或更高版本中的 Rancher UI 创建，管理和删除 HPA。Rancher UI 仅支持 `autoscaling/v2beta2` 版本的 HPA。

## 管理 HPA

根据您的 Kubernetes API 版本，管理 HPA 的方式有所不同：

- **对于 Kubernetes API autoscaling/V2beta1：** 使用此版本的 Kubernetes API，您可以根据应用的 CPU 和内存使用量自动缩放 Pod。
- **对于 Kubernetes API autoscaling/V2beta2：** 使用此版本的 Kubernetes API，除了可以根据应用的 CPU 和内存使用量自动缩放 Pod 外，还可以使用“自定义指标”进行自动缩放。

根据您的 Rancher 版本，HPA 的管理方式也不同：

- **对于 Rancher v2.3.0+ ：** 您可以使用 Rancher UI 创建，管理和删除 HPA。在 Rancher UI 中，您可以配置以 CPU 和内存使用量进行扩缩容的 HPA。有关更多信息，请参阅[使用 Rancher UI 管理 HPA](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui/_index)。要基于自定义指标进行扩缩容的 HPA，您仍然有部分操作需要使用 `kubectl` 。有关更多信息，请参阅[使用基于 Prometheus 自定义指标配置 HPA 进行缩放](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index)。
- **对于 Rancher v2.3.0 之前的版本：** 要管理和配置 HPA，您需要使用 `kubectl` 。有关如何创建，管理和扩展 HPA 的说明，请参阅[使用 kubectl 管理 HPA](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index)。

如果使用的是较旧版本的 Rancher，则可能需要其他 HPA 安装步骤：

- **对于 Rancher v2.0.7+：** 在 Rancher v2.0.7 及更高版本中创建的集群自动具有使用 HPA 所需的所有先决条件（metrics-server 和 Kubernetes 集群配置）。
- **对于 Rancher v2.0.7 之前的版本：** 在 Rancher v2.0.7 之前版本中创建的集群不会自动具有使用 HPA 所需的全部先决条件。有关为这些集群安装 HPA 的说明，请参阅[为 Rancher v2.0.7 之前创建的集群手动安装 HPA](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/hpa-for-rancher-before-2_0_7/_index)。

## 通过部署服务测试 HPA

在 Rancher v2.3.0+ 中，您可以导航到项目并单击 **资源 > HPA** 来查看 HPA 当前的副本数。有关更多信息，请参阅[获取 HPA 指标和状态](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui/_index)。

您也可以使用 `kubectl` 获取使用压测工具测试的 HPA 的状态。有关更多信息，请参阅[使用 kubectl 测试 HPA](/docs/rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/testing-hpa/_index)。
