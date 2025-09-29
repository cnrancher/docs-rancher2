---
title: 为高可用 RKE2 Kubernetes 集群设置基础设施
---

本教程可以帮助你为 Rancher 管理服务器配置基础架构。

Rancher Kubernetes 集群的推荐基础架构取决于 Rancher 是安装在 RKE2 Kubernetes 集群、RKE Kubernetes 集群还是单个 Docker 容器上。

> **注意：**这些节点必须在同一个 region。你可以将这些服务器放置在不同的可用区（数据中心）。

要在一个高可用的 RKE2 集群上安装 Rancher 管理服务器，我们建议设置以下基础设施：

- **三个 Linux 节点，**通常是虚拟机，在你选择的基础架构提供商中。
- **一个负载均衡器，** 将流量引导到这三个节点。
- **一个 DNS 记录，**用于将一个 URL 映射到负载均衡器。这将成为 Rancher Server 的 URL，下游的 Kubernetes 集群需要访问这个 Rancher Server 地址。

### 1. 设置 Linux 节点

确保你的节点满足[操作系统、容器运行时、硬件和网络](/docs/rancher2.5/installation/requirements/)的安装要求

关于设置 Linux 节点的例子，请参考这个[教程](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/)，将节点设置为 Amazon EC2 的实例。

### 2. 设置负载均衡器

你还需要设置一个负载均衡器来引导流量到所有节点上的 Rancher 副本。这将防止任何单个节点的故障导致与 Rancher 管理服务器的通信中断。

在后面的步骤中设置 Kubernetes 时，RKE2 将部署 Nginx Ingress 控制器。该控制器将侦听工作节点的端口 80 和 443，用来应答发往特定主机名的流量。

安装 Rancher 后（也是在后面的步骤中），Rancher 会创建一个 Ingress 资源。该 Ingress 告诉 Nginx Ingress 控制器监听发往 Rancher 主机名的流量。 Nginx Ingress 控制器在接收到以 Rancher 主机名为目的地的流量时，会将流量转发到集群中正在运行的 Rancher Pod。

你还需要考虑你是否想要或需要使用 4 层或 7 层负载均衡器：

- **4 层负载均衡器，**是两种选择中比较简单的一种，你可以转发 TCP 流量到你的节点。我们建议将你的负载均衡器配置为 4 层均衡器，将流量转发到 Rancher 管理集群节点的 TCP/80 和 TCP/443 端口。集群上的 Ingress 控制器将把 HTTP 流量重定向到 HTTPS 并终止 TCP/443 端口的 SSL/TLS。Ingress 控制器将把 TCP/80 端口的流量转发给 Rancher 部署中的 Ingress pod。

- **7 层负载均衡器，**稍微复杂一些，但可以提供你可能想要的功能。例如，7 层负载均衡器能够处理负载均衡器的 TLS 终止，而不是 Rancher 自己进行 TLS 终止。如果你想在你的基础设施中集中处理你的 TLS 终止，这是非常适合的。7 层负载均衡还为你的负载均衡器提供了基于 HTTP 属性（如 cookie 等）做出决策的能力，而 4 层负载均衡器是无法完成这些特性的。如果你决定在 7 层负载均衡器上终止 SSL/TLS 流量，你需要在后面安装 Rancher 的步骤中使用 `--set tls=external` 选项。更多信息请参考[Rancher Helm Chart 选项。](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#外部-tls-termination)

关于显示如何设置 NGINX 负载均衡器的例子，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/nginx/)

关于设置 Amazon ELB 网络负载均衡器的方法指南，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/nlb/)

> **重要：**
> 请不要在安装后使用该负载均衡器（即 `local` 集群 Ingress）来配置 Rancher 以外的应用程序。与其他应用程序共享这个 Ingress 可能会导致其他应用程序的 Ingress 配置重新加载后，Rancher 出现 websocket 错误。我们建议将 `local` 集群专用于 Rancher，而不是其他应用程序。

### 4. 设置 DNS 记录

一旦你设置了你的负载均衡器，你将需要创建一个 DNS 记录来发送流量到这个负载均衡器。

根据你的环境，这可能是一个指向负载均衡器 IP 的 A 记录，也可能是指向负载均衡器主机名的 CNAME。无论哪种情况，都要确保这个记录是你希望 Rancher 响应的主机名。

当你安装 Rancher 时，你将需要在以后的步骤中指定这个主机名，而且以后不可能改变它。请确保你的决定是最终决定。

关于设置 DNS 记录将域名流量路由到 Amazon ELB 负载均衡器的方法指南，请参考 [AWS 官方文档。](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)
