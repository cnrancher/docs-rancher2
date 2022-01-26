---
title: Rancher 运行技巧
weight: 100
---

本指南适用于使用 Rancher 管理下游 Kubernetes 集群的用例。高可用设置可以防止 Rancher Server 不可用时无法访问下游集群。

高可用 Rancher 安装指将 Rancher 安装到至少有三个节点的 Kubernetes 集群上，适用于所有生产环境以及重要的安装场景。在多个节点上运行多个 Rancher 实例能够实现单节点安装无法提供的高可用性。

如果你在 vSphere 环境中安装 Rancher，请参见[最佳实践文档](../rancher-in-vsphere)。

在设置高可用 Rancher 安装时，请考虑以下事项。

### 在单独的集群上运行 Rancher
不要在安装了 Rancher 的 Kubernetes 集群上运行其他工作负载或微服务。

### 确保 Kubernetes 节点配置正确

在部署节点时，请遵循 K8s 和 etcd 的最佳实践，其中包括禁用 swap，检查集群中的所有机器之间是否有良好的网络连接，为每个节点使用唯一的主机名、MAC 地址和 `product_uuids`，检查所需端口是否已经打开，并使用配置 SSD 的 etcd 进行部署。详情请参见 [kubernetes 官方文档](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)和 [etcd 性能操作指南](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/performance.md)。

### 使用 RKE 时：备份状态文件（Statefile）
RKE 将集群状态记录在一个名为 `cluster.rkestate` 的文件中，该文件对集群的恢复和/或通过 RKE 维护集群非常重要。由于这个文件包含证书材料，我们强烈建议在备份前对该文件进行加密。请在每次运行 `rke up` 后备份状态文件。

### 在同一个数据中心运行集群中的所有节点
为达到最佳性能，请在同一地理数据中心运行所有三个节点。如果你在云（如 AWS）上运行节点，请在不同的可用区（AZ）中运行这三个节点。例如，在 us-west-2a 中运行节点 1，在 us-west-2b 中运行节点 2，在 us-west-2c 中运行节点 3。

### 保证开发和生产环境的相似性
强烈建议为运行 Rancher 的 Kubernetes 集群配备 “staging” 或 “pre-production” 环境。这个环境的软件和硬件配置应该尽可能接近你的生产环境。

### 监控集群以规划容量
Rancher Server 的 Kubernetes 集群应该尽可能满足[系统和硬件要求]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)。越偏离系统和硬件要求，你可能面临的风险就越大。

但是，已发布的要求已经考虑了各种工作负载类型，因此，基于指标来规划容量应该是扩展 Rancher 的最佳实践。

你可以将 Rancher 集成业界领先的开源监控解决方案 Prometheus 以及能可视化 Prometheus 指标的 Grafana，来监控集群节点、Kubernetes 组件和软件部署的状态和过程。

在集群中[启用监控]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting)后，你可以通过设置告警通知，来了解集群容量的使用情况。你还可以使用 Prometheus 和 Grafana 监控框架，在你扩容时建立关键指标的基线。
