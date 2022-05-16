---
title: 调试高内存用量
weight: 8
---

Prometheus 中的每个时间序列都由其[指标名称](https://prometheus.io/docs/practices/naming/#metric-names)和称为[标签](https://prometheus.io/docs/practices/naming/#labels)的可选键值对唯一标识。

标签允许过滤和聚合时间序列数据，但它们也使 Prometheus 收集的数据量成倍增加。

每个时间序列都有一组定义的标签，Prometheus 为所有唯一的标签组合生成一个新的时间序列。如果一个指标附加了两个标签，则会为该指标生成两个时间序列。更改任何标签值，包括添加或删除标签，都会创建一个新的时间序列。

Prometheus 经过了优化，可以存储基于索引的序列数据。它是为相对一致的时间序列数量和相对大量的样本而设计的，这些样本需要随时间从 exporter 处收集。

但是，Prometheus 没有就快速变化的时间序列数量进行对应的优化。因此，如果你在创建和销毁了大量资源的集群（尤其是多租户集群）上安装 Monitoring，可能会出现内存使用量激增的情况。

### 减少内存激增

为了减少内存消耗，Prometheus 可以通过抓取更少的指标或在时间序列上添加更少的标签，从而存储更少的时间序列。要查看使用内存最多的序列，你可以查看 Prometheus UI 中的 TSDB（时序数据库）状态页面。

分布式 Prometheus 解决方案（例如 [Thanos](https://thanos.io/) 和 [Cortex](https://cortexmetrics.io/)）使用了一个替代架构，该架构部署多个小型 Prometheus 实例。如果使用 Thanos，每个 Prometheus 的指标都聚合到通用的 Thanos 部署中，然后再将这些指标导出到 S3 之类的持久存储。这种架构更加健康，能避免给单个 Prometheus 实例带来过多时间序列，同时还能在全局级别查询指标。