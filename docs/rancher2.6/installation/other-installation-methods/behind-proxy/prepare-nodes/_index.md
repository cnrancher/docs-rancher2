---
title: '1. 配置基础设施'
weight: 100
---

在本节中，你将为 Rancher Management Server 配置底层基础设施，并使其通过 HTTP 代理访问互联网。

如需在高可用 RKE 集群中安装 Rancher Management Server，我们建议配置以下基础设施：

- **3 个 Linux 节点**：可以是你的云提供商（例如 Amazon EC2，GCE 或 vSphere）中的虚拟机。
- **1 个负载均衡器**：用于将前端流量转发到这三个节点中。
- **1 个 DNS 记录**：用于将 URL 映射到负载均衡器。此 DNS 记录将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。

这些节点必须位于同一个区域或数据中心。但是你可以把这些服务器放在不同的可用区。

### 为什么使用三个节点？

在 RKE 集群中，Rancher Server 的数据存储在 etcd 中。而这个 etcd 数据库在这三个节点上运行。

为了选举出大多数 etcd 节点认可的 etcd 集群 leader，etcd 数据库需要奇数个节点。如果 etcd 数据库无法选出 leader，etcd 可能会出现[脑裂（split brain）](https://www.quora.com/What-is-split-brain-in-distributed-systems)的问题，此时你需要使用备份恢复集群。如果三个 etcd 节点之一发生故障，其余两个节点可以选择一个 leader，因为它们是 etcd 节点总数的大多数部分。

### 1. 配置 Linux 节点

这些主机将通过 HTTP 代理连接到互联网。

请确保你的节点满足[操作系统，容器运行时，硬件和网络]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)的常规要求。

如需获取配置 Linux 节点的示例，请参见[在 Amazon EC2 中配置节点]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/)的教程。

### 2. 配置负载均衡器

你还需要设置一个负载均衡器，来将流量重定向到两个节点上的 Rancher 副本。配置后，当单个节点不可用时，继续保障与 Rancher Management Server 的通信。

在后续步骤中配置 Kubernetes 时，RKE 工具会部署一个 NGINX Ingress Controller。该 Controller 将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 后（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 NGINX Ingress Controller 监听发往 Rancher 主机名的流量。NGINX Ingress Controller 在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

在你的实现中，你可以考虑是否需要使用 4 层或 7 层的负载均衡器：

- **4 层负载均衡器**：两种选择中较为简单的一种，它将 TCP 流量转发到你的节点中。我们建议使用 4 层负载均衡器，将流量从 TCP/80 端口和 TCP/443 端口转发到 Rancher Management 集群节点上。集群上的 Ingress Controller 会将 HTTP 流量重定向到 HTTPS，并在 TCP/443 端口上终止 SSL/TLS。Ingress Controller 会将流量转发到 Rancher deployment 中 Ingress Pod 的 TCP/80 端口。
- **7 层负载均衡器**：相对比较复杂，但功能更全面。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处处理 TLS 终止。如果你需要集中在基础设施中进行 TLS 终止，7 层负载均衡可能会很适合你。7 层负载均衡还能让你的负载均衡器基于 HTTP 属性（例如 cookie 等）做出决策，而 4 层负载均衡器则不能。如果你选择在 7 层负载均衡器上终止 SSL/TLS 流量，则在安装 Rancher 时（后续步骤）需要使用 `--set tls=external` 选项。详情请参见 [Rancher Helm Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)。

如需获取配置 NGINX 负载均衡器的示例，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/nginx/)。

如需获取如何配置 Amazon ELB 网络负载均衡器的指南，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/nlb/)。

> **重要提示**：
> 安装后，请勿将此负载均衡（例如 `local` 集群 Ingress）用于 Rancher 以外的应用。如果此 Ingress 与其他应用共享，在其他应用的 Ingress 配置重新加载后，可能导致 Rancher 出现 websocket 错误。我们建议把 `local` 集群专用给 Rancher，不要在集群内部署其他应用。

### 3. 配置 DNS 记录

配置完负载均衡器后，你将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据你的环境，DNS 记录可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论是哪种情况，请确保该记录是你要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），你需要指定此主机名。请知悉，此主机名无法修改。请确保你设置的主机名是你想要的。

有关设置 DNS 记录以将域流量转发到 Amazon ELB 负载均衡器的指南，请参见 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。


### 后续操作
[配置 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/behind-proxy/launch-kubernetes/)
