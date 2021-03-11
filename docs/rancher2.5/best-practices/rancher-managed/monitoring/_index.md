---
title: 监控最佳实践
description: description
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
  - 最佳实践
  - 监控最佳实践
---

配置合理的监控和告警规则对于安全、可靠地运行生产工作负载至关重要。在使用 Kubernetes 和 Rancher 时也是如此。幸运的是，集成的监控和告警功能使整个过程变得更加简单。

[Rancher 文档](/docs/rancher2.5/monitoring-alerting/2.5/_index)详细描述了如何设置一个完整的 Prometheus 和 Grafana。开箱即用，它将从集群中的所有系统和 Kubernetes 组件中抓取监控数据，并提供合理的仪表盘和告警。但为了实现可靠的设置，您还需要监控自己的工作负载并使 Prometheus 和 Grafana 适应您自己的特定用例和集群大小。本文档将为您提供这方面的最佳实践。

## 需要监测的内容

Kubernetes 本身以及运行在其内部的应用，构成了一个分布式系统，不同的组件之间相互影响。对于整个系统和每个单独的组件，你必须确保性能、可用性、可靠性和可扩展性。更多细节和信息的参考 Google 免费的[Site Reliability Engineering Book](https://sre.google/)，尤其是关于[监控分布式系统](https://sre.google/)这一章。

## 配置 Prometheus 资源使用

在安装集成监控时，Rancher 允许配置一些设置，这些设置取决于您的集群的大小和其中运行的工作负载。本章将详细介绍这些设置。

### 存储和数据保留

Prometheus 所需的存储空间与您存储的时间序列和标签的数量以及您配置的数据保留量直接相关。需要注意的是，Prometheus 并不是用来作为长期指标存储的。数据保留时间通常只有几天，而不是几周或几个月。原因是，Prometheus 不会对其存储的指标进行任何聚合。这很好，因为聚合会稀释数据，但这也意味着所需的存储空间随着时间的推移线性增长而没有保留。

计算所需存储空间的一种方法是通过以下查询来查看 Prometheus 中存储块的平均大小：

```
rate(prometheus_tsdb_compaction_chunk_size_bytes_sum[1h]) / rate(prometheus_tsdb_compaction_chunk_samples_sum[1h])
```

接下来，找出你每秒的数据摄取率：

```
rate(prometheus_tsdb_head_samples_appended_total[1h])
```

然后与保留时间相乘，并添加几个百分点作为缓冲区：

```
平均块大小（以字节为单位）*每秒的摄取速率*保留时间（以秒为单位）* 1.1 =必需的存储空间（以字节为单位）
```

你可以在这篇[博客文章](https://www.robustperception.io/how-much-disk-space-do-prometheus-blocks-use)中找到更多关于如何计算必要存储的信息。

你可以在[Prometheus 文档](https://prometheus.io/docs/prometheus/latest/storage)中阅读更多关于 Prometheus 存储概念的内容。

### CPU 和内存的请求和限制

在较大的 Kubernetes 集群中，Prometheus 会消耗大量内存。 Prometheus 需要的内存直接与它存储的时间序列和标签的数量以及填充这些标签的 scrape 间隔有关。

你可以在这个[博客文章](https://www.robustperception.io/how-much-ram-does-prometheus-2-x-need-for-cardinality-and-ingestion)中找到更多关于如何计算所需内存的信息。

所需的 CPU 数量与您正在执行的查询数量相关。

### 长期储存

Prometheus 并不是为了长期存储指标，而只用于短期存储。

为了长期存储一些或所有的指标，你可以利用 Prometheus 的[远程读/写](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations)功能将其连接到存储系统，如[Thanos](https://thanos.io/)、[InfluxDB](https://www.influxdata.com/)、[M3DB](https://www.m3db.io/)或其他系统。你可以在这篇[博客文章](https://rancher.com/blog/2020/prometheus-metric-federation)中找到一个示例设置。

## 抓取自定义工作负载

虽然集成的 Rancher Monitoring 已经可以从集群的节点和系统组件中抓取系统指标，但你部署在 Kubernetes 上的自定义工作负载也应该被抓取数据。为此，你可以配置 Prometheus 在一定的时间间隔内对你的应用程序的端点进行 HTTP 请求。然后，这些端点应该以 Prometheus 格式返回它们的指标。

一般来说，您要从集群中运行的所有工作负载中抓取数据，以便可以将它们用于告警或调试问题。很多时候，你会认识到，只有当你在事件中真正需要指标的时候，你才需要一些数据。如果它已经被抓取并存储了，那就好办了。由于 Prometheus 只是为了成为一个短期的指标存储，所以抓取和保存大量数据通常并不那么昂贵。如果你使用的是 Prometheus 的长期存储方案，那么你仍然可以决定数据的存储位置。

### 关于 Prometheus Exporters

许多第三方工作负载，如数据库、队列或 Web 服务器，要么已经支持以 Prometheus 格式公开指标，要么有所谓的 exporter，可以在工具的指标和 Prometheus 理解的格式之间进行转换。通常，您可以将这些 exporter 作为额外的 sidecar 容器添加到工作负载的 Pods 中。很多 helm charts 已经包含了部署 exporter 的选项。此外，你还可以在[promcat.io](https://promcat.io/)和[ExporterHub](https://exporterhub.io/)上找到一个由 SysDig 策划的 exporter 列表。

### Prometheus 在编程语言和框架中的支持

要想把自己的自定义应用指标放到 Prometheus 中，你必须直接从你的应用代码中收集和暴露这些指标。幸运的是，对于大多数流行的编程语言和框架来说，已经有一些库和集成可以帮助解决这个问题。其中一个例子是[Spring 框架](https://docs.spring.io/spring-metrics/docs/current/public/prometheus)中的 Prometheus 支持。

### ServiceMonitors 和 PodMonitors

一旦所有工作负载都以 Prometheus 格式公开了指标后，你必须配置 Prometheus 来获取它。 Rancher 使用[prometheus-operator](https://github.com/prometheus-operator/prometheus-operator)，这使得使用 ServiceMonitors 和 PodMonitors 添加额外的目标变得容易。很多 helm charts 已经包含了一个选项来直接创建这些监控器。你也可以在 Rancher 文档中找到更多信息。

### Prometheus Push Gateway

有些工作负载的指标很难被 Prometheus 获取。就像 Jobs 和 CronJobs 这样的短期工作负载，或者是不允许在单个处理的传入请求之间共享数据的应用程序，如 PHP 应用程序。

要想获得这些用例的指标，你可以设置 [prometheus-pushgateways](https://github.com/prometheus/pushgateway)。CronJob 或 PHP 应用程序将把指标更新推送到 pushgateway。pushgateway 汇总并通过 HTTP 端点暴露它们，然后可以由 Prometheus 获取。

### Prometheus Blackbox Monitor

有时，从外部监控工作负载是很有用的。为此，您可以使用[Prometheus blackbox-exporter](https://github.com/prometheus/blackbox_exporter)，它允许通过 HTTP、HTTPS、DNS、TCP 和 ICMP 探测任何类型的端点。

## （微）服务架构中的监控

如果你有一个（微）服务架构，集群中的多个单独的工作负载相互通信，那么拥有关于这些流量的详细指标和跟踪非常很重要，这是为了解所有这些工作负载是如何相互通信的，以及问题或瓶颈可能在哪里。

当然，你可以监控所有工作负载中的所有内部流量，并将这些指标暴露给 Prometheus，但这相当耗费精力。像 Istio 这样的服务网格，可以通过[单击](https://rancher.com/docs/rancher/v2.x/en/cluster-admin/tools/istio/)在 Rancher 中安装，可以自动完成这项工作，并提供关于所有服务之间的流量的丰富的遥测数据。

## 真实用户监控

监控所有内部工作负载的可用性和性能对于运行稳定、可靠和快速的应用程序至关重要。但这些指标只能向你展示部分情况。要想获得一个完整的视图，还必须知道你的最终用户是如何实际感知的。为此，你可以研究各种[真实用户监控解决方案](https://en.wikipedia.org/wiki/Real_user_monitoring)。

## 安全监控

除了监控工作负载以检测性能、可用性或可扩展性的问题外，还应该监控集群和运行到集群中的工作负载，这可以发现一些潜在的安全问题。一个好的起点是经常运行[CIS 扫描](/docs/rancher2.5/cis-scans/_index)并发出告警，检查集群是否按照安全最佳实践进行配置。

对于工作负载，你可以看看 Kubernetes 和 Container 安全解决方案，比如[Falko](https://falco.org/)、[Aqua Kubernetes Security](https://www.aquasec.com/solutions/kubernetes-container-security/)、[SysDig](https://sysdig.com/)。

## 设置告警

将所有的指标纳入监控系统并在仪表盘中可视化是很棒的做法，但你也希望在出现问题时能主动提醒。

集成的 Rancher 监控已经配置了一套合理的告警，这些告警在任何 Kubernetes 集群中都是可用的。您应该扩展这些内容并且覆盖您的特定工作负载和用例。

在设置告警时，应为所有至关重要的工作负载配置告警。但也要确保它们不会太频发送告警通知。理想情况下，你收到的每一个告警都应该是因为一个需要你关注并需要解决的问题。如果你的告警一直在发送，但并不是那么关键，那么你就有可能开始完全忽略你的告警，然后错过真正重要的告警。先开始关注真正重要的指标，比如说如果你的应用离线了就发出告警。修复所有开始出现的问题，然后开始创建更详细的告警。

如果告警开始发送，但你暂时无法处理，也可以将告警静默一定时间，以便以后查看。

您可以在[Rancher 文档](/docs/rancher2.5/monitoring-alerting/2.5/_index)中找到更多关于如何设置告警和通知的信息。
