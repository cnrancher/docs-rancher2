---
title: 日志管理最佳实践
weight: 1
---
本指南介绍了集群级别日志和应用日志的最佳实践。

- [集群级别日志](#cluster-level-logging)
- [应用日志](#application-logging)
- [通用最佳实践](#general-best-practices)

在 Rancher 2.5 之前，Rancher 的日志管理是一个静态集成。可供选择的聚合器是固定的（包括 ElasticSearch、Splunk、Kafka、Fluentd 和 Syslog），而且只有两个配置级别可供选择（集群级别和项目级别）。

现在，Rancher 的日志聚合更加灵活。通过新的日志管理的功能，管理员和用户都可以部署符合细粒度收集标准的日志记录，同时提供更多的目标和配置选项。

Rancher 的日志管理使用的是 Banzai Cloud logging operator。我们让你可以管理这个 operator 及其资源，并将它的管理功能和 Rancher 集群管理联系起来。

## 集群级别日志

### 抓取集群内日志

某些用户可能想从集群中运行的每个容器中抓取日志。但是你的安全团队可能要求你从所有执行点收集所有日志。

在这种情况下，我们建议你至少创建两个 _ClusterOutput_ 对象 - 一个用于安全团队（如果需要），另一个用于你自己，即集群管理员。创建这些对象时，请选择一个可以处理整个集群的大量日志的输出端点。此外，你还需要选择合适的索引来接收这些日志。

创建这些 _ClusterOutput_ 对象后，创建一个 _ClusterFlow_ 来收集所有日志。不要在此 flow 上定义任何 _Include_ 或 _Exclude_ 规则。这可以确保你能收集整个集群的所有日志。如果你有两个 _ClusterOutputs_，请确保它们都能收到日志。

### Kubernetes 组件

_ClusterFlows_ 能够收集 Kubernetes 集群中所有主机上所有容器的日志。如果这些容器包含在 Kubernetes Pod 中，这个方法是适用的。但是，RKE 容器不存在于 Kubernetes 内。

目前，Rancher 能搜集 RKE 容器的日志，但不能轻易过滤。这是因为这些日志不包含源容器的信息（例如 `etcd` 或 `kube-apiserver`）。

Rancher 的未来版本将包含源容器名称，来支持过滤这些组件的日志。该功能实现之后，你将能够自定义 _ClusterFlow_ 来**仅**检索 Kubernetes 组件日志，并将日志发送到适当的输出位置。

## 应用日志

对于 Kubernetes 和所有基于容器的应用而言，最佳实践是将应用日志引导到 `stdout`/`stderr`。容器运行时将捕获这些日志并用它们进行**某些操作** - 通常是将它们写入文件。根据容器运行时（及其配置），这些日志可以放置在任意数量的位置。

在将日志写入文件的情况下，Kubernetes 通过在每个主机上创建一个 `/var/log/containers` 目录来提供帮助。这个目录将日志文件符号链接到它们的实际目的地（可能因为配置或容器运行时而有所不同）。

Rancher 的日志管理将读取 `/var/log/containers` 中的所有日志条目，确保所有容器的所有日志条目（假设使用默认配置）均能被收集和处理。

### 特定日志文件

日志收集仅从 Kubernetes 中的 Pod 中检索 `stdout`/`stderr` 日志。但是，我们也可能想从应用生成的其他文件中收集日志。在这种情况下，你可以使用一个（或两个）日志流 Sidecar。

设置日志流 Sidecar 的目的是获取写入磁盘的日志文件，并将其内容传输到 `stdout`。这样一来，Banzai Logging Operator 就可以接收这些日志，并把日志发送到目标输出位置。

要进行设置，编辑你的工作负载资源（例如 Deployment）并添加以下 Sidecar 定义：

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

这将添加一个容器到你的工作负载定义中，用于将 `/path/to/your/log/file.log` 的内容（在本示例中）传输到 `stdout`。

然后将根据你设置的 _Flows_ 或 _ClusterFlows_ 自动收集该日志流。你还可以通过使用容器的名称，专门为该日志文件创建一个 _Flow_。示例如下：

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

- 尽量输出结构化日志条目（例如 `syslog`、JSON）。这些格式已经有了解析器，因此你可以更轻松地处理日志条目。
- 尽量在日志条目内提供创建该日志条目的应用的名称。这可以使故障排查更容易。这是因为 Kubernetes 并不总是将应用的名称作为对象名称。例如，某个 Pod ID 可能是 `myapp-098kjhsdf098sdf98`，从这个 ID 中我们不能获取运行在容器内的应用的太多信息。
- 除了在集群范围内收集所有日志的情况外，尽量严格限定 _Flow_ 和 _ClusterFlow_ 对象的范围。这使得在出现问题时更容易进行故障排查，并且还有助于确保不相关的日志条目不会出现在你的聚合器中。严格限定范围的一个例子是将 _Flow_ 限制在命名空间中的单个 _Deployment_，甚至是 _Pod_ 中的单个容器。
- 除非要进行故障排查，否则不要让日志太详细。太详细的日志会带来许多问题，其中最主要的是**带来干扰**，即重要事件可能会淹没在海量 `DEBUG` 信息中。你可以通过使用自动告警和脚本来缓解这种问题，但太详细的日志仍然给日志管理基础设施带来过大的压力。
- 如果可能，尽量在日志条目中提供事务或请求 ID。这可以使跨日志源追踪应用活动变得更容易，尤其是在处理分布式应用时。
