---
title: 调试高内存使用率
---

Prometheus 中的每个时间序列都由其 [metric 名称](https://prometheus.io/docs/practices/naming/#metric-names)和称为[标签](https://prometheus.io/docs/practices/naming/#labels)的可选键值对唯一标识。

标签允许过滤和汇总时间序列数据，但它们也会使 Prometheus 收集的数据量成倍增加。

每个时间序列都有一组定义的标签，Prometheus 为所有独特的标签组合生成一个新的时间序列。如果一个指标有两个附加标签，就会为该指标生成两个时间序列。改变任何标签值，包括增加或删除一个标签，都会产生一个新的时间序列。

Prometheus 经过优化，可以存储基于系列的索引数据。它是为数量相对一致的时间序列和相对大量的样本而设计的，这些样本需要随着时间的推移从 exporter 处收集。

反之，Prometheus 没有被优化以适应快速变化的时间序列数量。由于这个原因，当监控安装在有许多资源被创建和销毁的集群上时，特别是在多租户集群上，会出现大量的内存使用突发事件。

### 减少内存突发

为了减少内存消耗，Prometheus 可以被配置为存储更少的时间序列，通过抓取更少的指标或给时间序列附加更少的标签。要想知道哪些系列使用的内存最多，可以查看 Prometheus UI 中的 TSDB（时间序列数据库）状态页。

分布式 Prometheus 解决方案，如 [Thanos](https://thanos.io/) 和 [Cortex](https://cortexmetrics.io/) 使用另一种架构，在其中部署多个小型 prometheus 实例。在 Thanos 的情况下，每个 prometheus 的指标被汇总到共同的 Thanos deployment 中，然后这些指标被导出到持久性存储，如 S3。这种更稳健的架构避免了任何单一的 prometheus 实例承担过多的时间序列，同时也保留了在全局层面上查询指标的能力。
