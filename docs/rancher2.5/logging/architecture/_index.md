---
title: 日志架构
description: 本节总结了 Rancher 日志应用程序的架构。
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
  - rancher 2.5
  - 日志服务
  - Rancher v2.5 的日志功能
  - 配置自定义资源
  - 日志架构
---

## 概述

本节总结了 Rancher 日志应用程序的架构。

更多关于 Banzai Cloud 日志运营商的工作细节，请参见[Banzai Cloud 官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)。

## Rancher v2.5 的日志优化

在 Rancher v2.5 中，日志有以下变化：

- [Banzai Cloud Logging operator](https://banzaicloud.com/docs/one-eye/logging-operator/)现在是 Rancher 日志记录的动力，取代了以前的内部日志记录解决方案。
- [Fluent Bit](https://fluentbit.io/)用于汇总日志。[Fluentd](https://www.fluentd.org/)用于过滤消息并将其路由到输出。以前只使用 Fluentd。
- 日志记录可以用 Kubernetes 清单配置，因为现在日志记录使用的是 Kubernetes 操作符与自定义资源定义。
- 我们现在支持过滤日志。
- 我们现在支持将日志写入多个输出。
- 我们现在总是收集 Control Plane 和 etcd 日志。

## Banzai Cloud 日志 Operator 的工作原理

日志操作员可以自动部署和配置 Kubernetes 日志管道。它在每个节点上部署和配置 Fluent Bit DaemonSet，从节点文件系统中收集容器和应用程序的日志。

Fluent Bit 查询 Kubernetes API，用关于 pod 的元数据丰富日志，并将日志和元数据传输给 Fluentd。Fluentd 接收、过滤并将日志传输到多个`Outputs`。

以下的自定义资源用于定义日志如何被过滤和发送至其`Outputs`。

- 一个`Flow`是一个命名的自定义资源，它使用过滤器和选择器将日志信息发送到适当的`Output`。
- `ClusterFlow`用于路由集群级日志信息。
- 一个 `Output`是一个命名的资源，定义了日志信息的发送位置。
- 一个`ClusterOutput`定义了一个`Output`，可以从所有的`Flows`和`ClusterFlows`获得。

每个`Flow`必须引用一个`Output`，每个`ClusterFlow`必须引用一个`ClusterOutput`。

下图来自[Banzai 文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)，展示了新的日志架构。

![How the Banzai Cloud Logging Operator Works with Fluentd](/img/rancher/banzai-cloud-logging-operator.png)
