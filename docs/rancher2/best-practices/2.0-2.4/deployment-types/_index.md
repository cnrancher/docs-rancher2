---
title: 运行 Rancher 的建议
description: 运行在多个节点上的多个 Rancher 实例确保了单节点环境无法实现的高可用性，所以在生产环境或者一些很重要的环境中部署 Rancher 时，应该使用至少有三个节点的高可用 Kubernetes 集群，并在这个集群上面安装 Rancher。
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
  - 最佳实践
  - 运行 Rancher 的建议
---

运行在多个节点上的多个 Rancher 实例确保了单节点环境无法实现的高可用性，所以在生产环境或者一些很重要的环境中部署 Rancher 时，应该使用至少有三个节点的高可用 Kubernetes 集群，并在这个集群上面安装 Rancher。

## 在专用的集群上运行 Rancher

不要在安装 Rancher 的 Kubernetes 集群中运行其他工作负载或微服务。

## 不要在托管的 Kubernetes 环境中运行 Rancher

当 Rancher Server 安装在 Kubernetes 集群上时，它不应该在托管的 Kubernetes 环境中运行，比如谷歌的 GKE、Amazon 的 EKS 或 Microsoft 的 AKS。这些托管的 Kubernetes 解决方案没有将 etcd 开放到 Rancher 可以管理的程度，并且它们的自定义设置可能会干扰 Rancher 的操作。

建议使用托管的基础设施，如 Amazon 的 EC2 或谷歌的 GCE。在基础设施提供者上使用 RKE 创建集群时，您可以配置集群创建 etcd 快照作为备份。然后，您可以使用 [RKE](/docs/rke/etcd-snapshots/recurring-snapshots/_index) 或 [Rancher](/docs/rancher2/backups/restorations/_index) 从这些快照之一恢复您的集群。在托管的 Kubernetes 环境中，不支持这种备份和恢复功能。

## 确保 Kubernetes 的节点配置正确

当您部署节点时需要遵循 Kubernetes 和 etcd 最佳实践，比如：禁用 swap、反复检查集群中的所有机器之间的网络连接、使用唯一的主机名、使用唯一的 MAC 地址、使用唯一的 product_uuids、检查所有需要的端口被打开，部署使用 ssd 的 etcd。更多的细节可以在 [Kubernetes 文档](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm) 和 [etcd 的性能操作指南](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/performance.md) 中找到。

## 使用 RKE 备份状态文件

对于`RKE v0.2`之前的版本，ETCD 备份会自动将`/etc/kubernetes/ssl/`目录下的所有证书打包为`pki.bundle.tar.gz`文件，然后保存在`/opt/rke/etcd-snapshot`目录中。

对于`RKE v0.2`之后的版本，RKE 将集群状态记录在一个名为`cluster.rkestate`的文件中，这个文件存放于与 RKE 配置文件相同目录。这个文件保存了集群的 SSL 证书信息，对于通过 RKE 恢复集群`和/或`集群的后期维护非常重要。由于该文件包含证书信息，我们强烈建议在备份之前对该文件进行加密，并且每次运行`rke up`之后，您都应该备份此状态文件。

## 集群中所有节点在同一个数据中心

为了获得最佳性能，请在同一个的数据中心中运行所有集群节点。

如果您正在使用云中的节点，例如：AWS，请在单独的可用区域中运行每个节点。例如，启动 us-west-2a 中的节点，us-west-2b 中的节点 2，us-west-2c 中的节点 3。

## 开发和生产环境应该类似

强烈建议使用 Rancher 创建`staging`或`pre-production`环境的 Kubernetes 集群，这个环境应该在软件和硬件配置方面尽可能的与生产环境相同。

## 监视集群以计划容量

Rancher Server 的 Local Kubernetes 集群应该尽可能符合[系统和硬件需求](/docs/rancher2/installation/requirements/_index)。您越偏离系统和硬件需求，您承担的风险就越大。

但是，基于指标的容量规划分析应该是扩展 Rancher 的最终指导，因为我们发布的需求建议考虑了各种工作负载类型。

使用 Rancher，您可以通过与领先的开源监控解决方案 Prometheus 和 Grafana 的集成来监控集群节点、Kubernetes 组件和软件部署的状态和过程，Grafana 可以可视化来自 Prometheus 的指标。

在集群中[启用监控](/docs/rancher2/cluster-admin/tools/monitoring/_index)之后，您可以设置[通知](/docs/rancher2/monitoring-alerting/2.0-2.4/notifiers/_index)和[告警](/docs/rancher2/monitoring-alerting/2.0-2.4/cluster-alerts/_index)，让您知道您的集群是否接近其容量。您还可以使用 Prometheus 和 Grafana 监控框架来建立适合您的规模的关键指标基准。
