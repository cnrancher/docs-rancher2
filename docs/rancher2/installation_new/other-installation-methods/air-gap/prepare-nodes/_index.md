---
title: "1、配置基础设施和私有镜像仓库"
description: 离线环境是指在没有外网访问的环境，或在防火墙后安装 Rancher Server 的环境。本文提供了在离线环境中为 Rancher Server 配置基础设施和私有 Docker 镜像仓库的操作指导。基础设施取决于安装 Rancher 的方式：K3s Kubernetes 集群、RKE Kubernetes 集群或单个 Docker 容器上安装 Rancher。
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
  - 其他安装方法
  - 离线安装
  - 配置基础设施和私有镜像仓库
---

离线环境是指在没有外网访问的环境，或在防火墙后安装 Rancher Server 的环境。本文提供了在离线环境中为 Rancher Server 配置基础设施和私有 Docker 镜像仓库的操作指导。

基础设施取决于安装 Rancher 的方式：K3s Kubernetes 集群、RKE Kubernetes 集群或单个 Docker 容器上安装 Rancher。有关每个安装选项的更多信息，请参考[安装介绍](/docs/rancher2/installation_new/_index)。

## K3s 高可用集群

在 K3s 集群中安装 Rancher 高可用，我们建议为高可用安装配置以下基础设施：

- **2 个 Linux 节点**：通常是虚拟机，您可以自行选择的基础设施提供商，例如 Amazon EC2、阿里云、腾讯云或者 vShpere 等。
- **1 个外置数据库**：用于存储集群数据。我们支持 PostgreSQL，MySQL 和 etcd。
- **1 个负载均衡器**：用于将流量转发到这两个节点。
- **1 条 DNS 记录**：用于将 URL 指向负载均衡器。这将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。
- **私有 Docker 镜像仓库**：用于为您的节点分发 Docker 镜像。

### 1、配置 Linux 节点

这些主机可以与 Internet 断开连接，但需要能够与您的私有镜像仓库连接。

确保您的节点满足 [OS、Docker、硬件和网络](/docs/rancher2/installation_new/requirements/_index)的常规安装要求。

要在 Amazon EC2 中的创建节点，请参考[在 Amazon EC2 中配置节点](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/_index)。

### 2、配置外部数据库

支持使用 etcd 以外的数据库来运行 Kubernetes 的能力使 K3s 与其他 Kubernetes 发行版区分开来。该功能为 Kubernetes 运维人员供了灵活性。您可以选择最适合您的实际情况的数据库。

对于 K3s 高可用安装，您将需要配置以下外部数据库之一：

- [PostgreSQL](https://www.postgresql.org/) (10.7 和 11.5 )
- [MySQL](https://www.mysql.com/) (5.7)
- [etcd](https://etcd.io/) (3.3.15 )

Rancher 对上述特定版本的数据库进行过测试和验证，如果您使用其他版本，可能会碰到问题。

在安装 Kubernetes 时，您需要传入有关 K3s 数据库连接的详细信息。

要在 Amazon 的 RDS 服务上创建 MySQL 数据库。请参考此[教程](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/rds/_index)。

有关可用于配置 K3s 集群数据库的选项的完整列表，请参考[K3s 文档](/docs/k3s/installation/datastore/_index)。

### 3、配置负载均衡器

您还需要设置一个负载均衡器，以将流量定向到两个节点上的 Rancher 副本。这样可以在单个节点不可用时，继续保障与 Rancher 管理面的连接。

在后续步骤中配置 Kubernetes 时，K3s 工具将部署 Traefik Ingress 控制器。该控制器将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 时（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 Traefik Ingress 控制器侦听发往 Rancher 主机名的流量。Traefik Ingress 控制器在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

对于实现，请考虑是否要使用 4 层或 7 层负载均衡器：

- **4 层负载均衡器** 是一种相对简单的负载均衡，它将 TCP 流量转发到您到节点。我们建议使用 4 层负载均衡器，将流量从 TCP / 80 端口和 TCP / 443 端口转发到 Rancher 管理面的集群节点上。集群上的 Ingress 控制器会将 HTTP 流量重定向到 HTTPS，并在 TCP / 443 端口上终止 SSL / TLS。Ingress 控制器会将流量转发到 Rancher Server Pod 的 TCP / 443 端口。
- **7 层负载均衡器** 是一种相对复杂的负载均衡，但功能更加全面。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处处理 TLS 终止。如果要在基础设施中进行 TLS 终止，7 层负载均衡可能会很有用。7 层负载均衡还可以为您的负载均衡器提供基于 HTTP 属性（例如 cookie 等）做出决策的能力，而 4 层负载均衡器不提供这种功能。如果决定在 7 层负载均衡器上终止 SSL / TLS 流量，则在安装 Rancher 时（后续步骤）需要使用`--set tls=external`选项。有关更多信息，请参阅[Rancher Helm Chart 选项](/docs/rancher2/installation_new/resources/chart-options/_index)。

- 有关如何设置 NGINX 负载均衡器的示例，请参考[本页](/docs/rancher2/installation_new/resources/advanced/helm2/create-nodes-lb/nginx/_index)。

- 有关如何设置 Amazon ELB Network Load Balancer 的示例，请参考[本页](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/nlb/_index)。

- 有关如何配置 F5 作为 Rancher 前端 7 层负载均衡器的示例，请参考[本页](/docs/rancher2/installation_new/resources/F5-7-layer-loadbalancer/_index)。

- 有关如何为 F5 启动 WAF 功能的示例，请参考[本页](/rancher2/installation_new/resources/advanced/F5-WAF/_index)。

:::important 重要提示
安装后，请勿使用 `local` 集群的 Ingress 对 Rancher 以外的应用进行负载均衡。与其他应用共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后，导致 Rancher 出现 websocket 错误。我们强烈建议将 `local` 集群专用于 Rancher，而不应在 `local` 集群内部署任何其他应用。
:::

### 4、配置 DNS 记录

配置完负载均衡器后，您将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据您的环境，DNS 记录可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论哪种情况，请确保该记录是您要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），您需要指定此主机名，并且在以后也无法更改它。确保您的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的指南，请参阅 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。

### 5、配置私有 Docker 镜像仓库

Rancher 支持使用私有镜像仓库进行离线安装。您必须有自己的私有镜像仓库或使用其他方式将 Docker 镜像分发到节点。

在后续步骤中，当您设置 K3s Kubernetes 集群时，您将创建一个[私有镜像仓库配置文件](/docs/k3s/installation/private-registry/_index)，其中包含有关此镜像仓库的信息。

如果您需要有关创建私有 Docker 镜像仓库的帮助，请参阅 [官方 Docker 文档](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)。

## RKE 高可用集群

在 RKE 集群中安装 Rancher 高可用，我们建议为高可用安装配置以下基础设施：

- **3 个 Linux 节点**，通常是虚拟机，您可以自行选择的基础设施提供商，例如 Amazon EC2、阿里云、腾讯云或者 vShpere。
- **1 个负载均衡器**，用于将流量转发到这三个节点。
- **1 条 DNS 记录**，用于将 URL 指向负载均衡器。这将成为 Rancher Server 的 URL，下游集群需要可以访问到这个地址。
- **私有 Docker 镜像仓库**，用于为您的节点分发 Docker 镜像。

您可以将这些服务器放在不同的可用区里，但这些节点必须位于相同的区域/数据中心。

#### 为什么要三个节点？

在 RKE 集群中，Rancher Server 数据存储在 etcd 中。这个 etcd 数据库在所有三个节点上运行。

etcd 数据库需要奇数个节点，因此它始终可以选举出被大多数 etcd 节点认可的集群的领导者。如果 etcd 数据库无法选出领导者，则 etcd 可能会遭受[脑裂](https://www.quora.com/What-is-split-brain-in-distributed-systems)的困扰，这时将需要从备份中恢复集群。如果三个 etcd 节点之一发生故障，则其余两个节点可以选择一个领导者，因为它们占 etcd 节点总数的大部分。

### 1、配置 Linux 节点

这些主机可以与 Internet 断开连接，但需要能够与您的私有镜像仓库连接。

确保您的节点满足 [操作系统和容器运行时要求](/docs/rancher2/installation_new/requirements/_index)的常规安装要求。

要在 Amazon EC2 中的创建节点，请参考[这个教程](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/_index)。

### 2、配置负载均衡器

您还需要设置一个负载均衡器，以将流量定向到全部节点上的 Rancher 副本。这样可以在某个节点不可用时，继续保障与 Rancher 管理面的连接。

在后续步骤中配置 Kubernetes 时，RKE 工具将部署 NGINX Ingress 控制器。该控制器将侦听 worker 节点的 80 端口和 443 端口，以响应发送给特定主机名的流量。

在安装 Rancher 时（也是在后续步骤中），Rancher 系统将创建一个 Ingress 资源。该 Ingress 通知 NGINX Ingress 控制器侦听发往 Rancher 主机名的流量。NGINX Ingress 控制器在收到发往 Rancher 主机名的流量时，会将其转发到集群中正在运行的 Rancher Server Pod。

对于实现，请考虑是否要使用 4 层或 7 层负载均衡器：

- **4 层负载均衡器** 是一种相对简单的负载均衡，它将 TCP 流量转发到您到节点。我们建议使用 4 层负载均衡器，将流量从 TCP / 80 端口和 TCP / 443 端口转发到 Rancher 管理面的集群节点上。集群上的 Ingress 控制器会将 HTTP 流量重定向到 HTTPS，并在 TCP / 443 端口上终止 SSL / TLS。Ingress 控制器会将流量转发到 Rancher Server Pod 的 TCP / 443 端口。
- **7 层负载均衡器** 是一种相对复杂的负载均衡，但功能更加全面。例如，与 Rancher 本身进行 TLS 终止相反，7 层负载均衡器能够在负载均衡器处处理 TLS 终止。如果要在基础设施中进行 TLS 终止，7 层负载均衡可能会很有用。7 层负载均衡还可以为您的负载均衡器提供基于 HTTP 属性（例如 cookie 等）做出决策的能力，而 4 层负载均衡器不提供这种功能。如果决定在 7 层负载均衡器上终止 SSL / TLS 流量，则在安装 Rancher 时（后续步骤）需要使用`--set tls=external`选项。有关更多信息，请参阅[Rancher Helm Chart 选项](/docs/rancher2/installation_new/resources/chart-options/_index)。

- 有关如何设置 NGINX 负载均衡器的示例，请参考[本页](/docs/rancher2/installation_new/resources/advanced/helm2/create-nodes-lb/nginx/_index)。

- 有关如何设置 Amazon ELB Network Load Balancer 的示例，请参考[本页](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/nlb/_index)。

- 有关如何配置 F5 作为 Rancher 前端 7 层负载均衡器的示例，请参考[本页](/docs/rancher2/installation_new/resources/F5-7-layer-loadbalancer/_index)。

- 有关如何为 F5 启动 WAF 功能的示例，请参考[本页](/rancher2/installation_new/resources/advanced/F5-WAF/_index)。

:::important 重要提示
安装后，请勿使用 `local` 集群的 Ingress 对 Rancher 以外的应用进行负载均衡。与其他应用共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后，导致 Rancher 出现 websocket 错误。我们强烈建议将 `local` 集群专用于 Rancher，而不应在 `local` 集群内部署任何其他应用。
:::

### 3、配置 DNS 记录

配置完负载均衡器后，您将需要创建 DNS 记录，以将流量发送到该负载均衡器。

根据您的环境，DNS 记录可以是指向负载均衡器 IP 的 A 记录，也可以是指向负载均衡器主机名的 CNAME。无论哪种情况，请确保该记录是您要 Rancher 进行响应的主机名。

在安装 Rancher 时（后续步骤），您需要指定此主机名，并且在以后也无法更改它。确保您的决定是最终决定。

有关设置 DNS 记录以将域流量路由到 Amazon ELB 负载均衡器的指南，请参阅 [AWS 官方文档](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer)。

### 4、配置私有 Docker 镜像仓库

Rancher 支持使用私有镜像仓库进行离线安装。您必须有自己的私有镜像仓库或使用其他方式将 Docker 镜像分发到节点。

如果您需要有关创建私有 Docker 镜像仓库的帮助，请参阅 [官方 Docker 文档](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)。

## Docker 单节点

安装适用于想要测试 Rancher 的用户。由于只有一个节点和一个 Docker 容器，因此如果该节点发生故障，您将丢失 Rancher Server 的所有数据。

为了在生产环境中运行 Rancher，我们建议在 Kubernetes 集群上安装 Rancher 高可用。没有将 Docker 安装迁移到 Kubernetes 安装的方法。

如果您想在短期内通过使用单个节点来节省资源，同时保留向高可用安装的迁移路径，我们建议在单节点的 Kubernetes 集群上安装 Rancher。

### 1、配置 Linux 节点

这些主机可以与 Internet 断开连接，但需要能够与您的私有镜像仓库连接。

确保您的节点满足 [操作系统和容器运行时要求](/docs/rancher2/installation_new/requirements/_index)的常规安装要求。

要在 Amazon EC2 中的创建节点，请参考[这个教程](/docs/rancher2/installation_new/resources/k8s-tutorials/infrastructure-tutorials/ec2-node/_index)。

### 2、配置私有 Docker 镜像仓库

Rancher 支持使用私有镜像仓库进行离线安装。您必须有自己的私有镜像仓库或使用其他方式将 Docker 镜像分发到节点。

如果您需要有关创建私有 Docker 镜像仓库的帮助，请参阅 [Docker 官方 文档](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)。

## 后续操作

[同步镜像到私有镜像仓库](/docs/rancher2/installation_new/other-installation-methods/air-gap/populate-private-registry/_index)
