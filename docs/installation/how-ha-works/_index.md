---
title: 关于高可用安装
description: 我们建议使用Helm（Kubernetes 包管理器）在专用的 Kubernetes 集群上安装 Rancher。这被称为高可用 Kubernetes 安装，因为通过在多个节点上运行 Rancher 可以提高可用性。在标准安装中，首先将 Kubernetes 安装在基础设施提供商（例如 Amazon 的 EC2 或 Google Compute Engine）中托管的三个节点上。然后使用 Helm 在 Kubernetes 集群上安装 Rancher。Helm 使用 Rancher 的 Helm chart 在 Kubernetes 集群的三个节点中的每个节点上安装 Rancher 的副本。我们建议使用负载均衡器将流量定向到集群中 Rancher 的每个副本，以提高 Rancher 的可用性。
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
  - 安装指南
  - 关于高可用安装
---

我们建议使用[Helm](/docs/overview/architecture/concepts/#about-helm) (Kubernetes 包管理器)在专用的 Kubernetes 集群上安装 Rancher。这被称为高可用 Kubernetes 安装，因为通过在多个节点上运行 Rancher 可以提高可用性。

在标准安装中，首先将 Kubernetes 安装在基础设施提供商（例如 Amazon 的 EC2 或 Google Compute Engine）中托管的三个节点上。

然后使用 Helm 在 Kubernetes 集群上安装 Rancher。Helm 使用 Rancher 的 Helm chart 在 Kubernetes 集群的三个节点中的每个节点上安装 Rancher 的副本。我们建议使用负载均衡器将流量定向到集群中 Rancher 的每个副本，以提高 Rancher 的可用性。

Rancher server 数据存储在 etcd 或 MySQL （适用于 v2.4.0+） 中。etcd 数据库可以在所有三个节点上运行，并且需要奇数个节点，这样它就可以由大多数节点的选举出 etcd 集群的 leader。如果 etcd 数据库不能选出 leader，则 etcd 可能会失败，从而需要从备份中还原集群。

有关 Rancher 如何工作的说明（与安装方法无关），请参阅[架构部分](/docs/overview/architecture)。

#### 推荐架构

- Rancher 的 DNS 应该解析为 4 层负载均衡器
- 负载均衡器应将端口 TCP/80 和 TCP/443 流量转发到 Kubernetes 集群中的所有 3 个节点。
- Ingress 控制器会将 HTTP 重定向到 HTTPS，并在端口 TCP/443 上终止 SSL/TLS。
- Ingress 控制器会将流量转发到 Rancher deployment 中 Pod 上的端口 TCP/80。

<figcaption>下图为使用 4 层负载均衡器在 Kubernetes 集群中安装的 Rancher 高可用，描述了 ingress 控制器的SSL终止</figcaption>

![High-availability Kubernetes Installation of Rancher](/img/rancher/ha/rancher2ha.svg)

<sup>Kubernetes Rancher 安装了 4 层负载均衡器（TCP），描述了 ingress 控制器的 SSL 终止</sup>
