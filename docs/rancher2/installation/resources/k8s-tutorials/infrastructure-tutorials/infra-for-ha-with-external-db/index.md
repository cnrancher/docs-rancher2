---
title: 为高可用K3s集群配置基础设施
---

## 概述

本教程旨在帮助您为 Rancher 管理服务器配置底层基础设施。

根据 Rancher 将安装在 K3s Kubernetes 集群、RKE Kubernetes 集群或单个 Docker 容器上，只用于 Rancher 的 Kubernetes 集群的推荐基础设施有所不同。

有关安装选项的更多信息，请参考[本页](/docs/rancher2/installation/)。

**注意：**这些节点必须在同一区域。您可以将这些服务器放置在不同的可用区域（数据中心）。

要在高可用性 K3s 集群上安装 Rancher 管理服务器，我们建议设置以下基础设施。

- **两个 Linux 节点**，通常是虚拟机，在您选择的基础设施提供商中。
- **一个外部数据库**，用于存储集群数据。建议使用 MySQL。
- **一个负载均衡器**，将流量引导到两个节点。
- **一个 DNS 记录**，用于将一个 URL 映射到负载均衡器。这将成为 Rancher 服务器的 URL，下游的 Kubernetes 集群将需要到达它。

## 步骤 1：配置 Linux 节点

确保你的节点满足[操作系统、容器运行时、硬件和网络的一般安装要求](/docs/rancher2/installation/requirements/)。

关于设置 Linux 节点的一种方法的例子，请参考这个[教程](/docs/rancher2/installation/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/)，在 Amazon EC2 中设置节点为实例。

## 步骤 2：配置外部存储

使用 etcd 以外的数据存储运行 Kubernetes 的能力使 K3s 区别于其他 Kubernetes 发行版。该功能为 Kubernetes 运营商提供了灵活性。可用选项允许您选择最适合您的用例的数据存储。

对于高可用性的 K3s 安装，您需要设置一个[MySQL](https://www.mysql.com/)外部数据库。Rancher 已经在 K3s Kubernetes 集群上进行了测试，使用 MySQL 5.7 版本作为数据存储。

当你使用 K3s 安装脚本安装 Kubernetes 时，你会传入 K3s 连接到数据库的详细信息。

关于设置 MySQL 数据库的一种方法的例子，请参考这个[教程](/docs/rancher2/installation/resources/k8s-tutorials/infrastructure-tutorials/rds/)，在 Amazon 的 RDS 服务上设置 MySQL。

关于配置 K3s 集群数据存储的完整选项列表，请参考[K3s 文档](/docs/k3s/installation/datastore/)

## 步骤 3：配置负载均衡

您还需要设置一个负载均衡器，将流量引导到两个节点上的 Rancher 副本。这将防止任何一个单一节点的中断导致与 Rancher 管理服务器的通信中断。

当 Kubernetes 在后面的步骤中得到设置时，K3s 工具将部署一个 Traefik Ingress 控制器。这个控制器将监听工人节点的 80 和 443 端口，回答指向特定主机名的流量。

当安装 Rancher 时（也在后面的步骤中），Rancher 系统会创建一个 Ingress 资源。该 Ingress 告诉 Traefik Ingress 控制器监听指向 Rancher 主机名的流量。Traefik Ingress 控制器在接收到指向 Rancher 主机名的流量时，将把该流量转发给集群中正在运行的 Rancher pod。

对于您的实施，请考虑您是否想要或需要使用第 4 层或第 7 层负载均衡器。

- **4 层负载均衡器**是两种选择中比较简单的一种，其中你是将 TCP 流量转发到你的节点上。我们建议将您的负载均衡器配置为第 4 层均衡器，将流量转发到 TCP/80 和 TCP/443 端口，再转发到 Rancher 管理集群节点。集群上的 Ingress 控制器将把 HTTP 流量重定向到 HTTPS，并在 TCP/443 端口上终止 SSL/TLS。Ingress 控制器将把 TCP/80 端口的流量转发到 Rancher 部署中的 Ingress pod。
- **第 7 层负载均衡器**比较复杂，但可以提供您可能需要的功能。例如，第 7 层负载均衡器能够在负载均衡器上处理 TLS 终止，而不是 Rancher 自己做 TLS 终止。如果你想在你的基础设施中集中处理 TLS 终止，这可能是有益的。第 7 层负载均衡还为您的负载均衡器提供了基于 HTTP 属性（如 Cookie 等）的决策能力，而第 4 层负载均衡器是无法关注这些属性的。如果你决定在第 7 层负载均衡器上终止 SSL/TLS 流量，在后面的步骤中安装 Rancher 时，你需要使用`--set tls=external`选项。更多信息请参考[Rancher Helm Chart 选项](/docs/rancher2/installation/resources/chart-options/)

关于如何设置 NGINX 负载均衡器的例子，请参考[本页](/docs/rancher2/installation/resources/k8s-tutorials/infrastructure-tutorials/nginx/)

有关如何设置 Amazon ELB 网络负载均衡器的指南，请参阅[本页](/docs/rancher2/installation/resources/k8s-tutorials/infrastructure-tutorials/nlb/)

**重要：**
不要在安装后使用此负载均衡器（即 "本地 "集群 Ingress）来平衡 Rancher 以外的应用程序。与其他应用程序共享此 Ingress 可能会导致其他应用程序的 Ingress 配置重载后 Rancher 出现 websocket 错误。我们建议将`local`集群专用于 Rancher，而不是其他应用程序。

## 步骤 4：配置 DNS 记录

一旦您设置了负载均衡器，您将需要创建一个 DNS 记录来将流量发送到该负载均衡器。

根据您的环境，这可能是指向负载均衡器 IP 的 A 记录，也可能是指向负载均衡器主机名的 CNAME。无论哪种情况，都要确保此记录是您希望 Rancher 响应的主机名。

您需要在以后安装 Rancher 时指定这个主机名，而且以后不可能更改它。确保您的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的操作指南，请参考 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。
