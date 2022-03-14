---
title: '为高可用 K3s Kubernetes 集群设置基础设施'
weight: 1
---

本教程旨在帮助你为 Rancher Management Server 配置底层基础设施。

我们根据 Rancher 的安装位置（K3s Kubernetes 集群、RKE Kubernetes 集群或单个 Docker 容器）为专用于 Rancher 的 Kubernetes 集群推荐不同基础设施。

有关每个安装选项的详情，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation)。

> **注意**：这些节点必须位于同一个区域。但是你可以把这些服务器放在不同的可用区（数据中心）。

如需在高可用 K3s 集群中安装 Rancher Management Server，我们建议配置以下基础设施：

- **2 个 Linux 节点**：可以是你的云提供商中的虚拟机。
- **1 个外部数据库**：用于存储集群数据。建议使用 MySQL。
- **1 个负载均衡器**：用于将流量转发到这两个节点中。
- **1 个 DNS 记录**：用于将 URL 映射到负载均衡器。此 DNS 记录将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。

### 1. 配置 Linux 节点

请确保你的节点满足[操作系统，容器运行时，硬件和网络]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/)的常规要求。

如需获取配置 Linux 节点的示例，请参见[在 Amazon EC2 中配置节点]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/ec2-node)的教程。

### 2. 配置外部数据库

K3s 与其他 Kubernetes 发行版不同，在于其支持使用 etcd 以外的数据库来运行 Kubernetes。该功能让 Kubernetes 运维更加灵活。你可以根据实际情况选择合适的数据库。

对于 K3s 高可用安装，你需要配置一个 [MySQL](https://www.mysql.com/) 外部数据库。Rancher 已在使用 MySQL 5.7 作为数据存储的 K3s Kubernetes 集群上进行了测试。

在使用 K3s 安装脚本安装 Kubernetes 时，你需要传入 K3s 连接数据库的详细信息。

如需获取配置 MySQL 数据库示例，请参见[在 Amazon RDS 服务中配置 MySQL]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/rds/) 的教程。

如需获取配置 K3s 集群数据库的所有可用选项，请参见 [K3s 官方文档]({{<baseurl>}}/k3s/latest/en/installation/datastore/)。

### 3. 配置负载均衡器

你还需要设置一个负载均衡器，来将流量重定向到两个节点上的 Rancher 副本。配置后，当单个节点不可用时，继续保障与 Rancher Management Server 的通信。

在后续步骤中配置 Kubernetes 时，K3s 工具会部署一个 Traefik Ingress Controller。该 Controller 将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 后（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 Traefik Ingress Controller 监听发往 Rancher 主机名的流量。Traefik Ingress Controller 在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

在你的实现中，你可以考虑是否需要使用 4 层或 7 层的负载均衡器：

- **4 层负载均衡器**：两种选择中较为简单的一种，它将 TCP 流量转发到你的节点中。我们建议使用 4 层负载均衡器，将流量从 TCP/80 端口和 TCP/443 端口转发到 Rancher Management 集群节点上。集群上的 Ingress Controller 会将 HTTP 流量重定向到 HTTPS，并在 TCP/443 端口上终止 SSL/TLS。Ingress Controller 会将流量转发到 Rancher deployment 中 Ingress Pod 的 TCP/80 端口。
- **7 层负载均衡器**：相对比较复杂，但功能更全面。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处处理 TLS 终止。如果你需要集中在基础设施中进行 TLS 终止，7 层负载均衡可能会很适合你。7 层负载均衡还能让你的负载均衡器基于 HTTP 属性（例如 cookie 等）做出决策，而 4 层负载均衡器则不能。如果你选择在 7 层负载均衡器上终止 SSL/TLS 流量，则在安装 Rancher 时（后续步骤）需要使用 `--set tls=external` 选项。详情请参见 [Rancher Helm Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/#external-tls-termination)。

如需获取配置 NGINX 负载均衡器的示例，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/nginx/)。

如需获取如何配置 Amazon ELB 网络负载均衡器的指南，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/nlb/)。

> **重要提示**：
> 安装后，请勿将此负载均衡（例如 `local` 集群 Ingress）用于 Rancher 以外的应用。如果此 Ingress 与其他应用共享，在其他应用的 Ingress 配置重新加载后，可能导致 Rancher 出现 websocket 错误。我们建议把 `local` 集群专用给 Rancher，不要在集群内部署其他应用。

### 4. 配置 DNS 记录

配置完负载均衡器后，你将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据你的环境，DNS 记录可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论是哪种情况，请确保该记录是你要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），你需要指定此主机名。请知悉，此主机名无法修改。请确保你设置的主机名是你想要的。

有关设置 DNS 记录以将域流量转发到 Amazon ELB 负载均衡器的指南，请参见 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。
