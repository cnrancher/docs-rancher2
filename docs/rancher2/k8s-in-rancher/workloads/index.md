---
title: 工作负载类型
description: 您可以使用以下两种基本结构在 Kubernetes 中构建任何复杂的容器化应用程序：Pod 和工作负载。构建应用程序后，可以使用第三个结构：服务（Kubernetes Service）将其暴露以供在同一集群中或外网上访问。
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
  - 用户指南
  - 工作负载
  - 工作负载类型
---

您可以使用以下两种基本结构在 Kubernetes 中构建任何复杂的容器化应用程序：Pod 和工作负载。构建应用程序后，可以使用第三个结构：服务（Kubernetes Service）将其暴露以供在同一集群中或外网上访问。

## Pods

[Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) 是共享网络命名空间和存储卷的一个或多个容器。大多数 Pod 只有一个容器。因此，当我们讨论 **Pod** 时，该术语通常与**容器**同义。您可以通过扩容 Pod 来增加这个 Pod 中定义的那组容器的实例。这些容器就是您的业务实现。通常，Pod 由工作负载进行扩缩容和管理。

## 工作负载

**工作负载** 是设置 Pod 部署规则的对象。根据这些规则，Kubernetes 将执行部署并使用应用程序的当前状态更新工作负载对应字段。工作负载使您可以定义应用程序的调度，扩展和升级规则。

### 工作负载类型

Kubernetes 将工作负载分为不同类型。Kubernetes 支持的最受欢迎的类型是：

- [部署](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

  **部署**最好用于无状态应用程序（即，您不必维护工作负载的状态）。由**部署**工作负载管理的 Pod 被视为独立且可处理的。如果 Pod 发生了问题，Kubernetes 会将其删除，然后重新创建一个新的 Pod。一个示例应用程序是 Nginx Web 服务器。

- [有状态程序集](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

  **有状态集**与部署相反，当您的应用程序需要维护其身份并存储数据时，最好使用它。类似的应用程序如 Zookeeper，即，需要存储状态的应用程序。

- [守护程序集](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)

  **守护程序集**确保集群中的每个节点都运行一个 Pod 副本。对于要收集日志或监控节点性能的用例，这种类似于守护进程的工作负载效果最佳。

- [任务](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)

  **任务**启动一个或多个 Pod，并确保指定数量的 Pod 已成功终止。与管理需要一直运行的应用程序相反，**任务**最好用于完成特定任务，例如生成报表等。

- [定时任务](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

  **定时任务**与**任务**相似。但是，**定时任务**会按基于定义的`cron`时间表自动运行。

## 服务

在许多用例中，工作负载须是：

- 由集群中的其他工作负载访问。
- 暴露给外界。

您可以通过创建**服务**来实现这些目标。服务使用[选择器/标签方法（查看代码示例）](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#service-and-replicationcontroller)将服务映射到工作负载底层所对应的 Pod。在您通过 Rancher UI 创建工作负载时，Rancher 会根据您选择的服务端口和类型自动创建服务，从而简化了此映射过程。当然，您也可以手动创建自己的**服务**。

### 服务类型

Rancher 中有几种可用的服务。以下说明来自 [Kubernetes 文档](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)。

- **ClusterIP**

  通过集群内部 IP 暴露服务。选择此类型的服务时，服务仅可从集群内部访问。这是默认的`ServiceType`。

- **NodePort**

  通过静态端口（`NodePort`）在每个节点的 IP 上暴露服务。创建`NodePort`时，Kubernetes 也会自动分配一个`ClusterIP`供集群内部使用。您可以通过请求`<NodeIP>:<NodePort>`从集群外部访问 `NodePort`服务。

- **LoadBalancer**

  使用云提供商的负载均衡器对外公开服务。不是所有的云提供商都支持这种类型的服务。如果您在自己的数据中心中部署的集群，那么您需要提供您自己的负载均衡实现，例如[MetalLB](https://metallb.universe.tf/)。

### 工作负载选项

文档的此部分包含有关部署工作负载和使用工作负载选项的说明。

- [部署工作负载](/docs/rancher2/k8s-in-rancher/workloads/deploy-workloads/)
- [升级工作负载](/docs/rancher2/k8s-in-rancher/workloads/upgrade-workloads/)
- [回滚工作负载](/docs/rancher2/k8s-in-rancher/workloads/rollback-workloads/)

## 其他链接

- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
