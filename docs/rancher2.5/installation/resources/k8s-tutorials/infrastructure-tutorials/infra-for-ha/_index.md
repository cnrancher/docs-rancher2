---
title: 为高可用 RKE 集群配置基础设施
---

## 概述

本教程旨在帮助你创建一个高可用的 RKE 集群，可用于安装 Rancher 服务器。

**注意：**这些节点必须在同一区域。但你可以将这些服务器放置在不同的可用性区域（数据中心）中。

要在高可用 RKE 集群上安装 Rancher 管理服务器，我们建议设置以下基础设施。

- **三个 Linux 节点，**通常是虚拟机，在基础设施提供商中，如 Amazon 的 EC2、Google Compute Engine 或 vSphere。
- **一个负载均衡器**，将前端流量引导到三个节点。
- **一个 DNS 记录**，将一个 URL 映射到负载均衡器。这将成为 Rancher 服务器的 URL，下游的 Kubernetes 集群需要到达它。

这些节点必须在同一个区域/数据中心。你可以将这些服务器放置在不同的可用性区域。

## 为什么需要三个节点？

在 RKE 集群中，Rancher 服务器数据存储在 etcd 上。这个 etcd 数据库运行在所有三个节点上。

etcd 数据库需要奇数的节点，这样它总能选出一个 leader，并占到 etcd 集群的大多数。如果 etcd 数据库不能选出一个 leader，etcd 就会[脑裂](https://www.quora.com/What-is-split-brain-in-distributed-systems)，需要从备份中恢复集群。如果三个 etcd 节点中的一个节点失效，剩下的两个节点可以选出一个 leader，因为它们拥有 etcd 节点总数的多数。

## 步骤 1：配置 Linux 节点

确保你的节点满足[操作系统、容器运行时、硬件和网络的一般安装要求。](/docs/rancher2.5/installation/requirements/_index)

关于设置 Linux 节点的一种方法的例子，请参考这个[教程](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/_index)，在 Amazon EC2 中设置节点为实例。

## 步骤 2：配置负载均衡

你还需要设置一个负载均衡器，将流量引导到三个节点中任何一个节点上的 Rancher 副本。这将防止任何一个单一节点的中断导致与 Rancher 管理服务器的通信中断。

当 Kubernetes 在后面的步骤中得到设置时，RKE 工具将部署一个 NGINX Ingress 控制器。这个控制器将监听工人节点的 80 和 443 端口，回答指向特定主机名的流量。

当安装 Rancher 时（也在后面的步骤中），Rancher 系统会创建一个 Ingress 资源。该 Ingress 告诉 NGINX Ingress 控制器监听指向 Rancher 主机名的流量。NGINX Ingress 控制器在接收到指向 Rancher 主机名的流量时，会将该流量转发到集群中正在运行的 Rancher pod。

对于你的实施，请考虑你是否想要或需要使用第 4 层或第 7 层负载均衡器。

- **4 层负载均衡器**是两种选择中比较简单的一种，其中你是将 TCP 流量转发到你的节点上。我们建议将你的负载均衡器配置为第 4 层均衡器，将流量转发到 TCP/80 和 TCP/443 端口，再转发到 Rancher 管理集群节点。集群上的 Ingress 控制器将把 HTTP 流量重定向到 HTTPS，并在 TCP/443 端口上终止 SSL/TLS。Ingress 控制器将把 TCP/80 端口的流量转发到 Rancher 部署中的 Ingress pod。
- **第 7 层负载均衡器**比较复杂，但可以提供你可能需要的功能。例如，第 7 层负载均衡器能够在负载均衡器上处理 TLS 终止，而不是 Rancher 自己做 TLS 终止。如果你想在你的基础设施中集中处理 TLS 终止，这可能是有益的。第 7 层负载均衡还为你的负载均衡器提供了基于 HTTP 属性（如 Cookie 等）的决策能力，而第 4 层负载均衡器是无法关注这些属性的。如果你决定在第 7 层负载均衡器上终止 SSL/TLS 流量，在后面的步骤中安装 Rancher 时，你需要使用`--set tls=external`选项。更多信息请参考[Rancher Helm Chart 选项](/docs/rancher2.5/installation/resources/chart-options/_index)

关于如何设置 NGINX 负载均衡器的例子，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/nginx/_index)

有关如何设置 Amazon ELB 网络负载均衡器的指南，请参阅[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/nlb/_index)

**重要：**
不要在安装后使用此负载均衡器（即 `local`集群 Ingress）来平衡 Rancher 以外的应用程序。与其他应用程序共享此 Ingress 可能会导致其他应用程序的 Ingress 配置重载后 Rancher 出现 websocket 错误。我们建议将`local`集群专用于 Rancher，而不是其他应用程序。

## 步骤 3：配置 DNS 记录

一旦你设置了负载均衡器，你将需要创建一个 DNS 记录来向该负载均衡器发送流量。

根据你的环境，这可能是指向 LB IP 的 A 记录，也可能是指向负载均衡器主机名的 CNAME。无论哪种情况，都要确保此记录是你打算让 Rancher 响应的主机名。

你需要在以后安装 Rancher 时指定此主机名，以后无法更改。确保你的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的操作指南，请参考 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。
