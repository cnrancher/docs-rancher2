---
title: "Kubernetes 工作负载和 Pod"
description: "了解在 Kubernetes 中构建复杂容器化应用程序的两种结构：Kubernetes 工作负载和 Pod"
weight: 3025
---

你可以使用两种基本结构（pod 和工作负载）在 Kubernetes 中构建复杂的容器化应用程序。构建应用程序后，你可以使用第三种结构（service）在集群中或互联网上公开应用程序。

### Pod

[_Pod_](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) 是一个或多个共享网络命名空间和存储卷的容器。大多数 pod 只有一个容器。因此，我们讨论的 _pod_ 通常等同于 _容器_。扩展 pod 的方式与扩展容器的方式相同，即配置实现服务的同一 pod 的多个实例。通常，Pod 会根据工作负载进行扩展和管理。

### 工作负载

_工作负载_ 是为 pod 设置部署规则的对象。Kubernetes 基于这些规则执行部署，并根据应用程序的当前状态来更新工作负载。
工作负载让你可以定义应用程序调度、扩展和升级的规则。

#### 工作负载类型

Kubernetes 将工作负载分为不同的类型。Kubernetes 支持的最流行的类型是：

- [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

   _Deployment_ 最适合用于无状态应用程序（即不需要维护工作负载的状态）。由 Deployment 类型工作负载管理的 Pod 是独立且一次性的。如果 pod 中断了，Kubernetes 会删除该 pod 然后重新创建它。一个示例应用程序是 Nginx Web 服务器。

- [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

   与 Deployment 相比，_StatefulSet_ 最适合在需要维护身份和存储数据的应用程序中使用。适用的应用程序类似于 Zookeeper（一个需要数据库进行存储的应用程序）。

- [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)

   _Daemonset_ 确保集群中的每个节点都运行 pod 的副本。如果你需要收集日志或监控节点性能，这种类似 daemon 的工作负载效果是最好的。

- [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)

   _Job_ 启动一个或多个 Pod 并确保指定数量的 Pod 能成功终止。Job 最好用于运行有限任务至完成状态，而不是管理正在进行的应用程序的所需状态。

- [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

   _CronJobs_ 与 Job 类似。但是，CronJob 会基于 cron 的计划运行到完成状态。

### Services

在许多用例中，工作负载必须：

- 由集群中的其他工作负载访问。
- 暴露给外部。

你可以通过创建一个 _Service_ 实现这些目的。Service 使用[选择器/标签（查看代码示例）](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#service-and-replicationcontroller)来映射到底层工作负载的 pod。Rancher UI 使用你选择的服务端口和类型来自动创建 service 以及工作负载，从而简化此映射过程。

#### Service 类型

Rancher 中有几种可用的 Service 类型。以下描述来自 [Kubernetes 文档](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)。

- **ClusterIP**

   > 在集群内部 IP 上公开 Service。如果你选择此值，Service 只能从集群内访问。这是默认的 `ServiceType`。

- **NodePort**

   > 在每个节点 IP 上的静态端口（`NodePort`）上暴露 Service。`ClusterIP` service 是自动创建的，而 `NodePort` service 会路由到 ClusterIP service。你可以通过请求 `<NodeIP>:<NodePort>` 在集群外部联系 `NodePort` service。

- **LoadBalancer**

   > 使用云提供商的负载均衡器向外部公开服务。`NodePort` 和 `ClusterIP` service 是自动创建的，外部负载均衡器会路由到这些 service。

## 工作负载选项

以下文档介绍了如何部署工作负载和使用工作负载选项。

- [部署工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/deploy-workloads/)
- [升级工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/upgrade-workloads/)
- [回滚工作负载]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/rollback-workloads/)

## 相关链接

### 外部链接

- [Service](https://kubernetes.io/docs/concepts/services-networking/service/)
