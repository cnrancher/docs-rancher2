---
title: 高可用安装
weight: 1
---

我们建议使用 Helm（ Kubernetes 包管理器 ）在专用的 Kubernetes 集群上安装 Rancher。由于 Rancher 运行在多个节点上提升了可用性，因此这种安装方式叫做高可用 Kubernetes 安装。

在标准安装中，先将 Kubernetes 安装在托管在云提供商（例如 Amazon 的 EC2 或 Google Compute Engine）中的三个节点上。

然后使用 Helm 在 Kubernetes 集群上安装 Rancher。Helm 使用 Rancher 的 Helm Chart 在 Kubernetes 集群的三个节点中均安装 Rancher 的副本。我们建议使用负载均衡器将流量转发到集群中的每个 Rancher 副本中，以提高 Rancher 的可用性。

Rancher Server 的数据存储在 etcd 中。etcd 数据库可以在所有三个节点上运行。为了选举出大多数 etcd 节点认同的 etcd 集群 leader，节点的数量需要是奇数。如果 etcd 数据库不能选出 leader，etcd 可能会失败。这时候就需要使用备份来还原集群。

有关 Rancher 如何工作的详情（与安装方法无关），请参见[架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture)。

### 推荐架构

- Rancher 的 DNS 应该解析为 4 层负载均衡器。
- 负载均衡器应该把 TCP/80 端口和 TCP/443 端口的流量转发到 Kubernetes 集群的全部 3 个节点上。
- Ingress Controller 会把 HTTP 重定向到 HTTPS，在 TCP/443 端口终结 SSL/TLS。
- Ingress Controller 会把流量转发到 Rancher deployment 的 Pod 上的 TCP/80 端口。

<figcaption>使用 4 层负载均衡器在 Kubernetes 集群中安装 Rancher：Ingress Controller 的 SSL 终止：</figcaption>
![Rancher 的高可用 Kubernetes 安装]({{<baseurl>}}/img/rancher/ha/rancher2ha.svg)

<sup>使用 4 层负载均衡器在 Kubernetes 集群中安装 Rancher：Ingress Controller 的 SSL 终止</sup>
