---
title: 设置容器的技巧
description: description
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
  - 最佳实践
  - Rancher管理集群的最佳实践
  - 设置容器的技巧
---

运行构建良好的容器会极大的影响环境的整体性能和安全性。

关于容器安全的详细信息，也可以参考 Rancher 的[容器安全指南](https://rancher.com/complete-guide-container-security)。以下是一些设置容器的技巧。

## 使用通用容器操作系统

在可能的情况下，你应该尽量在一个通用的容器基础操作系统上进行标准化。

Alpine 和 BusyBox 等较小的发行版减少了容器镜像的大小，并且通常具有较小的漏洞。

流行的发行版如 Ubuntu、Fedora 和 CentOS 等都经过了大量的测试，并提供了许多的功能。

## 从零开始的容器

如果你的微服务是一个独立的静态二进制，你应该使用`FROM scratch`容器。

`FROM scratch`容器是一个[官方 Docker 镜像](https://hub.docker.com/_/scratch)，它是空的，这样你就可以用它来设计最小的镜像。

这将具有最小的攻击层和最小的镜像。

## 以非特权方式运行容器进程

在可能的情况下，在容器内运行进程时使用非特权用户。虽然容器运行时提供了隔离，但仍然可能存在漏洞和攻击。如果容器以 root 身份运行，无意中或意外的主机挂载也会受到影响。有关为 pod 或容器配置安全上下文的详细信息，请参考 [Kubernetes 文档](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)。

## 定义资源限制

将 CPU 和内存限制应用于你的 Pod。这可以帮助管理工作节点上的资源，并避免发生故障的微服务影响其他微服务。

在标准 Kubernetes 中，您可以在命名空间级别上设置资源限制。在 Rancher 中，您可以在项目级别上设置资源限制，它们将继承到项目内的所有命名空间。详情请参考 Rancher 文档。

在设置资源配额时，如果您在项目或命名空间上设置了任何与 CPU 或内存相关的内容（即限制或保留），所有容器都需要在创建期间设置各自的 CPU 或内存字段。为了避免在创建工作负载期间对每个容器设置这些限制，可以在命名空间上指定一个默认的容器资源限制。

Kubernetes 文档中有许多关于如何在[容器级别](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)和命名空间级别设置资源限制的资料。

## 定义资源需求

你应该将 CPU 和内存需求应用到你的 pod 上。这对于通知调度器需要将你的 pod 放置在哪种类型的计算节点上，并确保它不会过度配置该节点资源至关重要。在 Kubernetes 中，你可以通过在 pod 的容器规范的资源请求字段中定义`resources.requests`来设置资源需求。详情请参考[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)。

> **注意：** 如果您为 pod 所部署的命名空间设置了资源限制，而容器没有特定的资源请求，则不允许启动 pod。为了避免在创建工作负载时对每个容器设置这些字段，可以在命名空间上指定一个默认的容器资源限制。

建议在容器级别上定义资源需求，否则，调度程序会做出一些假设，这些假设可能会在集群加载时对您的应用程序没有帮助。

## 配置存活和就绪探测器

为你的容器配置存活探针和就绪探针。除非你的容器完全崩溃，否则 Kubernetes 不会知道它是不健康的，除非你创建一个可以报告容器状态的端点或机制。或者，确保你的容器在不健康的情况下停止并崩溃。

Kubernetes 文档展示了如何[配置存活和就绪探测器](https://kubernetes.io/zh/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。
