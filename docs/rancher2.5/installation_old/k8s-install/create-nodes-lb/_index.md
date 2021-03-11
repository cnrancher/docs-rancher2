---
title: "1、配置基础设施"
description: 在本部分中，您将为 Rancher Server 配置基础设施。推荐基础设施会根据部署 Rancher 的方式而有所差异。具体取决于您要将 Rancher 安装在专用的 K3s Kubernetes 集群上，还是安装在专用的 RKE Kubernetes 集群上。
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
  - 安装指南
  - Rancher高可用安装
  - 配置基础设施
---

在本部分中，您将为 Rancher Server 配置基础设施。

推荐基础设施会根据部署 Rancher 的方式而有所差异。具体取决于您要将 Rancher 安装在专用的 K3s Kubernetes 集群上，还是安装在专用的 RKE Kubernetes 集群上。

有关每个安装选项的更多信息，请参阅[本页](/docs/rancher2.5/installation/_index)。

> **注意：** 您可以将这些用来创建 Kubernetes 集群的节点放在不同的可用区里，但这些节点必须位于相同的区域/数据中心。

## K3s 高可用集群

在 K3s 集群中安装 Rancher 高可用，我们建议为高可用安装配置以下基础设施：

- **2 个 Linux 节点**，通常是虚拟机，您可以自行选择的基础设施提供商，例如 Amazon EC2，阿里云，腾讯云或者 vShpere 等。
- **1 个外置数据库**，用于存储集群数据。我们建议使用 MySQL。
- **1 个负载均衡器**，用于将流量转发到这两个节点。
- **一条 DNS 记录**，用于将 URL 指向负载均衡器。这将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。

### 1、配置 Linux 节点

确保您的节点满足 [操作系统和容器运行时要求](/docs/rancher2.5/installation/requirements/_index)的常规安装要求。

要在 Amazon EC2 中的创建节点，请参考[这个教程](/docs/rancher2.5/installation/options/ec2-node/_index)。

### 2、配置外部数据库

对于高可用 K3s 安装，您将需要配置一个外部 [MySQL](https://www.mysql.com/) 数据库。我们已经针对 MySQL 5.7 版本对 K3s Kubernetes 集群进行了测试。

使用 K3s 安装脚本安装 Kubernetes 时，您需要将传入有关 K3s 连接数据库的详细信息。

要在 Amazon 的 RDS 服务上创建 MySQL 数据库。请参考此[教程](/docs/rancher2.5/installation/options/rds/_index)。

有关可用于配置 K3s 集群数据库的选项的完整列表，请参考[K3s 文档](/docs/k3s/installation/datastore/_index)。

### 3、配置负载均衡器

您还需要设置一个负载均衡器，以将流量定向到两个节点上的 Rancher 副本。这样可以在单个节点不可用时，继续保障与 Rancher 管理面的连接。

在后续步骤中配置 Kubernetes 时，K3s 工具将部署 Traefik Ingress 控制器。该控制器将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 时（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 Traefik Ingress 控制器侦听发往 Rancher 主机名的流量。Traefik Ingress 控制器在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

对于实现，请考虑是否要使用 4 层或 7 层负载均衡器：

- **4 层负载均衡器** 是两种选择中相对简单的一种，它将 TCP 流量转发到您到节点。我们建议使用 4 层负载均衡器，将流量从 TCP / 80 端口和 TCP / 443 端口转发到 Rancher 管理面的集群节点上。集群上的 Ingress 控制器会将 HTTP 流量重定向到 HTTPS，并在 TCP / 443 端口上终止 SSL / TLS。Ingress 控制器会将流量转发到 Rancher Server Pod 的 TCP / 443 端口。
- **7 层负载均衡器** 相对有些复杂，但可以提供您可能需要的功能。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处理 TLS 终止。如果要在基础设施中进行 TLS 终止，7 层负载均衡可能会很有用。7 层负载均衡还可以为您的负载均衡器提供基于 HTTP 属性（例如 cookie 等）做出决策的能力，而 4 层负载均衡器无法提供这种功能。如果决定在 7 层负载均衡器上终止 SSL / TLS 流量，则在安装 Rancher 时（后续步骤）需要使用`--set tls=external`选项。有关更多信息，请参阅[Rancher Helm Chart 选项](/docs/rancher2.5/installation/options/chart-options/_index)。

- 有关如何设置 NGINX 负载均衡器的示例，请参考[本页](/docs/rancher2.5/installation/options/nginx/_index)。

- 有关如何设置 Amazon ELB Network Load Balancer 的示例，请参考[本页](/docs/rancher2.5/installation/options/nlb/_index)。

- 有关如何配置 F5 作为 Rancher 前端 7 层负载均衡器的示例，请参考[本页](/docs/rancher2.5/installation/options/F5-7-layer-loadbalancer/_index)。

- 有关如何为 F5 启动 WAF 功能的示例，请参考[本页](/docs/rancher2.5/installation/options/F5-WAF/_index)。

:::important 重要提示
安装后，请勿使用 `local` 集群的 Ingress 对 Rancher 以外的应用进行负载均衡。与其他应用共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后，导致 Rancher 出现 websocket 错误。我们强烈建议将 `local` 集群专用于 Rancher，而不应在 `local` 集群内部署任何其他应用。
:::

### 4、配置 DNS 记录

配置完负载均衡器后，您将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据您的环境，可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论哪种情况，请确保该记录是您要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），您需要指定此主机名，并且在以后也无法更改它。确保您的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的指南，请参阅 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。

## RKE 高可用集群

在 RKE 集群中安装 Rancher 高可用，我们建议为高可用安装配置以下基础设施：

- **3 个 Linux 节点**，通常是虚拟机，您可以自行选择的基础设施提供商，例如 Amazon EC2，阿里云，腾讯云或者 vShpere。
- **1 个负载均衡器**，用于将流量转发到这三个节点。
- **一条 DNS 记录**，用于将 URL 指向负载均衡器。这将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。

您可以将这些服务器放在不同的可用区里，但这些节点必须位于相同的区域/数据中心。

#### 为什么要三个节点？

在 RKE 集群中，Rancher Server 数据存储在 etcd 中。这个 etcd 数据库在所有三个节点上运行。

etcd 数据库需要奇数个节点，因此它始终可以选举出被大多数 etcd 节点认可的集群的领导者。如果 etcd 数据库无法选出领导者，则 etcd 可能会遭受[脑裂](https://www.quora.com/What-is-split-brain-in-distributed-systems)的困扰，这时将需要从备份中恢复集群。如果三个 etcd 节点之一发生故障，则其余两个节点可以选择一个领导者，因为它们占 etcd 节点总数的大部分。

### 1、配置 Linux 节点

确保您的节点满足 [操作系统和容器运行时要求](/docs/rancher2.5/installation/requirements/_index)的常规安装要求。

要在 Amazon EC2 中的创建节点，请参考[这个教程](/docs/rancher2.5/installation/options/ec2-node/_index)。

### 2、配置负载均衡器

您还需要设置一个负载均衡器，以将流量定向到全部节点上的 Rancher 副本。这样可以在某个节点不可用时，继续保障与 Rancher 管理面的连接。

在后续步骤中配置 Kubernetes 时，RKE 工具将部署 NGINX Ingress 控制器。该控制器将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 时（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 NGINX Ingress 控制器侦听发往 Rancher 主机名的流量。NGINX Ingress 控制器在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

对于实现，请考虑是否要使用 4 层或 7 层负载均衡器：

- **4 层负载均衡器** 是两种选择中相对简单的一种，它将 TCP 流量转发到您到节点。我们建议使用 4 层负载均衡器，将流量从 TCP / 80 端口和 TCP / 443 端口转发到 Rancher 管理面的集群节点上。集群上的 Ingress 控制器会将 HTTP 流量重定向到 HTTPS，并在 TCP / 443 端口上终止 SSL / TLS。Ingress 控制器会将流量转发到 Rancher Server Pod 的 TCP / 443 端口。
- **7 层负载均衡器** 相对有些复杂，但可以提供您可能需要的功能。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处理 TLS 终止。如果要在基础设施中进行 TLS 终止，7 层负载均衡可能会很有用。7 层负载均衡还可以为您的负载均衡器提供基于 HTTP 属性（例如 cookie 等）做出决策的能力，而 4 层负载均衡器无法提供这种功能。如果决定在 7 层负载均衡器上终止 SSL / TLS 流量，则在安装 Rancher 时（后续步骤）需要使用`--set tls=external`选项。有关更多信息，请参阅[Rancher Helm Chart 选项](/docs/rancher2.5/installation/options/chart-options/_index)。

- 有关如何设置 NGINX 负载均衡器的示例，请参考[本页](/docs/rancher2.5/installation/options/nginx/_index)。

- 有关如何设置 Amazon ELB Network Load Balancer 的示例，请参考[本页](/docs/rancher2.5/installation/options/nlb/_index)。

- 有关如何配置 F5 作为 Rancher 前端 7 层负载均衡器的示例，请参考[本页](/docs/rancher2.5/installation/options/F5-7-layer-loadbalancer/_index)。

- 有关如何为 F5 启动 WAF 功能的示例，请参考[本页](/docs/rancher2.5/installation/options/F5-WAF/_index)。
  :::important 重要提示
  安装后，请勿使用 `local` 集群的 Ingress 对 Rancher 以外的应用进行负载均衡。与其他应用共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后，导致 Rancher 出现 websocket 错误。我们强烈建议将 `local` 集群专用于 Rancher，而不应在 `local` 集群内部署任何其他应用。
  :::

### 3、配置 DNS 记录

配置完负载均衡器后，您将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据您的环境，可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论哪种情况，请确保该记录是您要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），您需要指定此主机名，并且在以后也无法更改它。确保您的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的指南，请参阅 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。

## [下一步：安装 Kubernetes 集群](/docs/rancher2.5/installation/k8s-install/kubernetes-rke/_index)
