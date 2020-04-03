---
title: 配置容器的技巧
---

运行构建良好的容器会极大地提高环境的整体性能和安全性。

下面是设置容器的一些技巧。

## 使用通用容器操作系统

如果可能，您应该尝试在通用的容器基础操作系统上进行标准化。

较小的发布版本，如 Alpine 和 BusyBox，减少了容器镜像的大小，通常具有较小的攻击/漏洞。

Ubuntu、Fedora 和 CentOS 等流行的发行版经过了更多的实地测试，提供了更多的功能。

## 容器的 scratch 基础镜像

如果您的微服务是一个独立的静态二进制文件，那么应该使用 scratch 作为基础镜像。

scratch 是一个[官方 Docker 镜像](https://hub.docker.com/_/scratch)，它是空的，因此您可以使用它来设计最小的镜像。

这将有最小的攻击面和最小的镜像大小。

## 使用非特权模式运行容器

如果可能，在容器中运行进程时使用非特权用户。虽然容器运行时提供隔离，但是仍然可能存在漏洞和攻击。如果容器作为 root 运行，有意或无意的主机挂载也会影响你的环境。有关为 Pod 或容器配置安全上下文的详细信息，请参考[Kubernetes 文档](https://kubernetes.io/docs/tasks/configu-po-container/secur-context/)。

## 资源限制

给你的 Pod 配置 CPU 和内存限制，这可以帮助你管理工作节点上的资源，并避免异常的微服务（比如内存溢出）影响其他微服务。

在标准 Kubernetes 中，可以在命名空间级别设置资源限制。在 Rancher 中，您可以在项目级别设置资源限制，它们将同步到项目中的所有命名空间，具体配置请查阅 Rancher 文档。

在设置资源配额时，如果您在一个项目或命名空间上设置任何与 CPU 或内存相关的内容(即限制或预留)，那么所有容器都需要在创建的过程中设置相应的 CPU 或内存字段。为了避免在创建工作负载期间对每个容器设置这些限制，您可以在命名空间上指定默认的容器资源限制。

Kubernetes 文档提供了更多关于如何在[容器级别](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)和命名空间级别上设置资源限制的说明。

## 资源预留

你应该将 CPU 和内存需求配置到你的 Pod 上。这对于通知调度器需要将 Pod 放置在哪种类型的计算节点上，并确保它不会过度调度到该节点非常重要。在 Kubernetes 中，您可以在 Pods 容器的`spec`的`resources.requests` 请求字段中配置资源请求。有关详细信息，请参考[Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)。

> **注意：** 如果您为部署 Pod 的命名空间设置了资源限制，而 Pod 没有设置资源预留和资源限制，那么将不允许启动 Pod。为了避免在工作负载创建期间在每个容器上设置这些字段，可以在命名空间上指定默认资源预留和资源限制。

建议为容器/Pod 定义资源预留，这样可以相对精确的进行调度。否则，可能会出现调度不均匀导致某些节点资源使用率过高，从而无法充分利用机器资源。

## 配置健康检查（存活检查和就绪检查）

为您的 Pod 配置健康检查（存活检查和就绪检查）。如果不配置健康检查，除非您的 Pod 完全崩溃，否则 Kubernetes 不会知道它是不健康的。

有关如何[配置活性和就绪探测器](https://kubernetes.io/docs/tasks/configurepo-container/configu-livenreadinprobes/)的更详细说明，请参考 Kubernetes 文档。
