---
title: 运行Rancher的技巧
description: 本指南面向的是使用 Rancher 管理下游 Kubernetes 集群的用例。高可用设置可以防止在 Rancher Server 不可用时失去对下游集群的访问。
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
  - 运行Rancher的技巧
---

本指南面向的是使用 Rancher 管理下游 Kubernetes 集群的用例。高可用设置可以防止在 Rancher Server 不可用时失去对下游集群的访问。

高可用 Rancher 安装，定义为在至少有三个节点的 Kubernetes 集群上安装 Rancher，应该适用于 Rancher 的任何生产安装，以及任何被认为 “重要”的安装。运行在多个节点上的多个 Rancher 实例可以确保单节点环境无法实现的高可用性。

如果您在 vSphere 环境中安装 Rancher，请参考[这里](/docs/rancher2.5/best-practices/rancher-server/rancher-in-vsphere/_index)的最佳实践。

当您设置高可用的 Rancher 安装时，请考虑以下问题：

### 在单独的集群上运行 Rancher

不要在 Rancher 安装的 Kubernetes 集群中运行其他工作负载或微服务。

### 确保 Kubernetes 节点配置正确

在部署节点时，遵循 K8s 和 etcd 的最佳实践是很重要的，包括禁用 swap，仔细检查集群中所有机器之间具有完整的网络连接，为每个节点使用唯一的主机名、MAC 地址和 product_uuids，检查所有正确的端口都被打开，以及使用 ssd 支持的 etcd 进行部署。更多细节可以参考 [kubernetes 文档](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)和 [etcd 的性能操作指南](https://github.com/etcd-io/website/blob/master/content/docs/current/op-guide/performance.md)。

### 使用 RKE 时：备份状态文件

RKE 在一个名为 `cluster.rkestate` 的文件中保留了集群状态的记录。这个文件对于集群的恢复和/或通过 RKE 继续维护集群是非常重要的。由于这个文件包含证书，我们强烈建议在备份前对这个文件进行加密。每次运行 `rke up` 后，你应该备份状态文件。

### 在同一数据中心中运行集群中的所有节点

为了获得最佳性能，请在同一地理数据中心中运行所有三个节点。如果您在云（如 AWS）中运行节点，请在一个单独的可用区中运行每个节点。例如，在 us-west-2a 中启动节点 1，在 us-west-2b 中启动节点 2，在 us-west-2c 中启动节点 3。

### 开发和生产环境应该相似

强烈建议拥有一个 Rancher 运行的 Kubernetes 集群的 “staging” 或 “pre-production” 环境。这个环境应该在软件和硬件配置方面尽可能的接近你的生产环境。

### 监控集群以规划容量

Rancher 服务器的 Kubernetes 集群应该尽可能满足[系统和硬件要求](/docs/rancher2.5/installation/requirements/_index)。你越是偏离系统和硬件要求，你所承担的风险就越大。

但是，基于度量的容量规划分析应该成为扩展 Rancher 的最终指南，因为已发布的需求考虑各种工作负载类型。

使用 Rancher，您可以通过与领先的开源监控解决方案 Prometheus 和 Grafana 的集成来监视集群节点、Kubernetes 组件和软件部署的状态和过程，从而可以可视化 Prometheus 的指标。

在集群中[启用监控](/docs/rancher2.5/cluster-admin/tools/cluster-monitoring/_index)后，可以设置[通知](/docs/rancher2.5/cluster-admin/tools/notifiers/_index)和[告警](/docs/rancher2.5/cluster-admin/tools/cluster-alerts/_index)来让您知道您的集群是否接近其容量。您还可以使用 Prometheus 和 Grafana 监控框架，在您扩展时建立关键指标的基线。
