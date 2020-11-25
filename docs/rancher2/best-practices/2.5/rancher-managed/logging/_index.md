---
title: 日志最佳实践
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

在本指南中，我们推荐了集群级别日志记录和应用日志记录的最佳实践。

- [Rancher v2.5 中日志记录的变化](#rancher-v25-中日志记录的变化)
- [集群级别日志](#集群级别日志)
- [应用程序日志](#应用程序日志)
- [通用最佳实践](#通用最佳实践)

## Rancher v2.5 中日志记录的变化

在Rancher v2.5 之前，Rancher中的日志记录是一个非常静态的集成。有一个固定的聚合器列表可供选择（ElasticSearch、Splunk、Kafka、Fluentd和Syslog），而且只有两个配置点可供选择（集群级别和项目级别）。

2.5中的日志记录已经被彻底改写，为日志聚合提供了更灵活的体验。通过新的日志记录功能，管理员和用户都可以部署符合细粒度收集标准的日志记录，同时提供更多的目的地和配置选项。

Rancher日志使用的是Banzai Cloud logging operator。我们提供了这个operator（及其资源）的可管理性，并将这种经验与管理你的Rancher集群联系起来。

## 集群级别日志

### 抓取集群范围内日志

对于一些用户来说，最好是从集群中运行的每个容器中抓取日志。这通常与你的安全团队从所有容器收集所有日志的请求（或要求）相吻合。

在这种情况下，建议至少创建两个 _ClusterOutput_ 对象，一个用于你的安全团队（如果有此要求），另一个用于你自己（集群管理员）。在创建这些对象时要注意选择一个能够处理来自整个集群的大量日志流量的输出端点。同时要确保选择一个合适的索引来接收所有这些日志。

一旦创建了这些 _ClusterOutput_ 对象，请创建一个 _ClusterFlow_ 来收集所有的日志。不要在这个 flow 上定义任何 _Include_ 或 _Exclude_ 规则。这将确保整个集群的所有日志都被收集。如果您有两个 _ClusterOutputs_ ，请确保将日志发送到它们两个。

### Kubernetes 组件

_ClusterFlows_ 可以收集Kubernetes集群中所有主机上所有容器的日志。在这些容器是Kubernetes pod的一部分的情况下，这很好用；但是，RKE容器存在于Kubernetes的范围之外。

目前(从v2.5.1开始)，RKE容器的日志被收集，但不能轻易过滤。这是因为这些日志不包含源容器的信息（如`etcd`或`kube-apiserver`）。

Rancher的未来版本将包含源容器名称，这将使这些组件日志的过滤成为可能。进行更改后，您将能够自定义 _ClusterFlow_ 以**仅**检索Kubernetes组件日志，并将它们引导到一个适当的输出。

## 应用程序日志

不仅在Kubernetes中，而且在所有基于容器的应用程序中的最佳做法是将应用程序日志引导到`stdout`/`stderr`。然后，容器运行时将捕获这些日志，并对它们进行处理--通常将它们写入一个文件。根据容器运行时（及其配置）的不同，这些日志可以放置在任意位置。

在将日志写入文件的情况下，Kubernetes通过在每个主机上创建一个`/var/log/containers`目录来提供帮助。这个目录将日志文件symlinks到它们的实际目的地（可以根据配置或容器运行时而有所不同）。

Rancher日志记录将读取`/var/log/containers`中的所有日志条目，确保来自所有容器的所有日志条目（假设默认配置）将有机会被收集和处理。

### 特定日志文件

日志收集只能从Kubernetes中的pod中检索`stdout`/`stderr`日志。但是，如果我们想从应用程序生成的其他文件中收集日志呢？这里，一个（或两个）日志流sidecar可能会派上用场。

设置日志流sidecar的目的是获取写入磁盘的日志文件，并将其内容传输到`stdout`。这样一来，Banzai Logging Operator就可以接收这些日志，并把它们发送到你想要的输出。

要设置这一点，请编辑您的工作负载资源（如Deployment）并添加以下sidecar定义：

```
...
containers:
- args:
  - -F
  - /path/to/your/log/file.log
  command:
  - tail
  image: busybox
  name: stream-log-file-[name]
  volumeMounts:
  - mountPath: /path/to/your/log
    name: mounted-log
...
```

这将为你的工作负载添加一个容器，现在将把`/path/to/your/log/file.log`的内容（在本例中）传输到`stdout`。

然后根据您设置的任何 _Flows_ 或 _ClusterFlows_ 自动收集该日志流。您还可以考虑通过针对容器的名称，专门为该日志文件创建一个 _Flow_。请参见示例：

```
...
spec:
  match:
  - select:
      container_names:
      - stream-log-file-name
...
```

## 通用最佳实践

- 在可能的情况下，输出结构化的日志条目（例如`syslog`，JSON）。这使得日志条目的处理更容易，因为已经有了为这些格式编写的解析器。
- 尽量提供创建日志条目的应用程序的名称。这可以使故障排除更容易，因为Kubernetes对象并不总是将应用程序的名称作为对象名称。例如，一个pod ID可能是像`myapp-098kjhsdf098sdf98`这样的东西，它并没有提供太多关于容器内运行的应用程序的信息。
- 除了在整个集群范围内收集所有日志的情况下，尽量将您的 _Flow_ 和 _ClusterFlow_ 对象严格限定范围。这使得在出现问题时更容易进行故障排除，也有助于确保不相关的日志条目不会出现在您的聚合器中。严格限定范围的一个例子是将 _Flow_ 限制在一个命名空间中的单个 _Deployment_ ，甚至可能是一个 _Pod_ 中的单个容器。
- 除非故障排查，否则不要让日志太长。冗长的日志会带来许多问题，其中最主要的是**干扰**：重要事件可能会被淹没在海量的 "DEBUG "消息中。这种情况在一定程度上可以通过自动告警和脚本得到缓解，但高度啰嗦的日志记录仍然会给日志记录基础设施带来过大的压力。
- 在可能的情况下，尽量在日志条目中提供一个事务或请求ID。这可以使跨多个日志源追踪应用程序活动变得更容易，特别是在处理分布式应用程序时。
