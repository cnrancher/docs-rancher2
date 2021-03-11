---
title: 重要指标
---

_自 v2.2.0 起可用_

集群指标用于展示集群内所有节点的硬件资源利用率，它们可以让您洞悉集群的全局状况。

> **注意：** 持续的监控需要"指标基准"。确立"指标基准"的方式往往是结合实践和经验：首先对组件进行一段时间的操作并观察相关指标，然后评估出能描述其"健康"的指标值，最后建立可供日后度量的参考系。

以下是 Rancher 集群指标的说明：

- **CPU 利用率**

  当集群的 CPU 利用率处于高水平时，这表明集群可能在高效的运行，也可能是 CPU 资源不足。

- **磁盘利用率**

  当某个节点快满时，需要特别留意这个节点的磁盘读写速率。这一点对于部署运行了 etcd 的节点尤为重要，因为集群会由于这类节点的存储空间不足而崩溃。

- **内存利用率**

  内存利用率的异常增量通常意味着内存泄露。

- **平均负载**

  理想的情况下，平均负载与集群的逻辑 CPU 数量应该保持一致。例如，如果集群有 8 个逻辑 CPU，则理想的平均负载也应该等于 8。如果平均负载远低于集群的逻辑 CPU 数量，则可能需要减少集群资源。相反，集群可能需要更多资源。

## 查看某个集群的节点指标

1. 在**全局**页面找到需要查看节点指标的目标集群。
1. 在导航栏中选择**节点**。
1. 点选对应的节点。
1. 展开**节点指标**查看。

[_获取具体的指标表达式_](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)

### Etcd 指标

> **注意：** 仅支持通过 [Rancher 安装的 Kubernetes 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)。

Etcd 指标用于展示 etcd 数据库的操作情况。当确立了 etcd 数据库操作的"基准指标"后，您就可以通过这些"基准指标"来观察异常的增量。当出现异常的增量时，这表明 etcd 集群可能存在问题，您应该尽快予以解决。

另外，您还需要关注位于 Etcd 指标顶部的文本。这些文本代表着 etcd 集群领导者选举的信息，描述了当前 etcd 集群是否具有领导者，即协调集群中其他 etcd 实例的 etcd 实例。如果出现大幅度的 etcd 领导者变化，那将意味着 etcd 集群处于不稳定的状态。

需要对下面几个重要的指标做些说明：

- **Etcd 有领导者**

  etcd 通常以集群形式部署，部署到多个节点上并选举出一个领导者来协调集群操作。如果 ectd 集群没有领导者，集群的操作将无法被协调。

- **领导者变更次数**

  如果该统计数字突然增长，通常表明网络通信问题不断迫使 etcd 集群选举新的领导者。

[_获取具体的指标表达式_](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)

### Kubernetes 组件指标

Kubernetes 组件指标用于展示集群里各个 Kubernetes 组件的监控数据。它表示每个组件的链接和延迟的信息：API Server，Controller Manager，Scheduler 以及 Ingress Controller。

> **注意：** 仅支持通过 [Rancher 安装的 Kubernetes 集群](/docs/rancher2.5/cluster-provisioning/rke-clusters/_index)。

当分析 Kubernetes 组件指标时，不能仅关注 Chart 内的某时刻的单个独立指标。相反，您应该观察一段时间以确立"指标基准"，通过它们来观察异常的增量。这些增量通常表明集群可能存在问题，您需要进行调查。

下面几个重要的组件指标需要做些说明：

- **API Server 请求延迟**

  API 响应时间的增加表明存在普遍的问题，需要进行调查。

- **API Server 请求率**

  API 请求率的上升通常和响应时间的增加相吻合。请求率的增加也表明存在普片的问题，需要进行调查。

- **Scheduler 抢占请求**

  如果看到 Scheduler 抢占请求 Chart 内出现高峰，则表明硬件资源已消耗完，Kubernetes 没有足够的资源来运行所有 Pod，只能优先处理更重要的 Pod。

- **Pods 调度失败次数**

  Pods 调度失败可能有很多原因，例如未绑定的 PVC，耗尽的硬件资源，无响应的节点等。

- **Ingress Controller 请求处理时长**

  Ingress 路由请求到集群内的速度。

[_获取具体的指标表达式_](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)

## Rancher 日志指标

Rancher 日志指标可以展示日志服务相关组件的操作情况，前提是您需要[为 Rancher 启用日志服务](/docs/rancher2.5/logging/2.0.x-2.4.x/project-logging/_index)。

[_获取具体的指标表达式_](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)

## 查看某个工作负载的指标

工作负载的指标用于展示某个 Kubernetes 工作负载的硬件资源利用率。您可以查看关于 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)，[StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) 等工作负载的指标。

1. 在**全局**页面找到需要查看工作负载指标的目标项目。

1. 在导航栏中下拉**资源**菜单，选择**工作负载**（在早于 v2.3.0 的版本中，可直接在导航栏中选择**工作负载**）。

1. 点选对应的工作负载。

1. 展开**工作负载指标**查看。

1. 如果需要进一步查看 **Pod 指标**，可以点选该工作负载的 **Pod** 部分，

   - 展开 **Pod 指标**查看。

   - 如果需要再进一步查看 **容器指标**，可以点选该 Pod 的**容器**部分，
     - 展开**容器指标**查看。

[_获取具体的指标表达式_](/docs/rancher2.5/monitoring-alerting/2.0-2.4/cluster-monitoring/expression/_index)
