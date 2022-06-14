---
title: 架构
weight: 1
---

本节介绍了 Rancher Logging 应用程序的架构。

有关 Banzai Cloud Logging Operator 工作原理的更多详细信息，请参阅[官方文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)。

### Banzai Cloud Logging Operator 工作原理

Logging Operator 自动部署和配置 Kubernetes 日志管道。它会在每个节点上部署和配置一个 Fluent Bit DaemonSet，从而收集节点文件系统中的容器和应用程序日志。

Fluent Bit 查询 Kubernetes API 并使用 pod 的元数据来丰富日志，然后将日志和元数据都传输到 Fluentd。Fluentd 会接收和过滤日志并将日志传输到多个`Output`。

以下自定义资源用于定义了如何过滤日志并将日志发送到 `Output`：

- `Flow` 是一个命名空间自定义资源，它使用过滤器和选择器将日志消息路由到对应的 `Output`。
- `ClusterFlow` 用于路由集群级别的日志消息。
- `Output` 是一个命名空间资源，用于定义发送日志消息的位置。
- `ClusterOutput` 定义了一个所有 `Flow` 和 `ClusterFlow` 都可用的 `Output`。

每个 `Flow` 都必须引用一个 `Output`，而每个 `ClusterFlow` 都必须引用一个 `ClusterOutput`。

[Banzai 文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)中的下图显示了新的 Logging 架构：

<figcaption>Banzai Cloud Logging Operator 如何与 Fluentd 和 Fluent Bit 一起使用</figcaption>

![Banzai Cloud Logging Operator 如何与 Fluentd 一起使用]({{<baseurl>}}/img/rancher/banzai-cloud-logging-operator.png)
