---
title: "1、准备节点"
description: 本节介绍如何为离线安装 Rancher 准备您的节点。Rancher Server可能会离线安装在防火墙或代理之后的封闭环境。这里有两个选择，用于高可用性安装（推荐）或 单节点 Docker 安装。
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
  - 资料、参考和高级选项
  - Rancher 高可用 Helm2 离线安装
  - 准备节点
---

> Helm 3 已经发布，Rancher 提供了使用 Helm 3 安装 Rancher 的操作指导。
> Helm 3 的易用性和安全性都比 Helm 2 更高，如果您使用的是 Helm 2，我们建议您首先将 Helm 2[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，然后使用 Helm3 安装 Rancher。
> 本文提供了较早版本的使用 Helm 2 安装 Rancher 高可用的安装方法，如果无法升级到 Helm 3，可以使用此方法。

本节介绍如何为离线安装 Rancher 准备您的节点。Rancher Server 可能会离线安装在防火墙或代理之后的封闭环境。这里有两个选择：Kubernetes 安装（高可用安装）或 Docker 安装（单节点安装）。

## 先决条件

### Kubernetes 安装 (推荐)

#### 操作系统、Docker、硬件和网络

确保您的节点满足[安装要求](/docs/rancher2/installation/requirements/_index)。

#### 私有仓库

Rancher 支持使用私有仓库进行离线安装。您必须具有自己的私有仓库或其他将 Docker 镜像分发到计算机的方法。

如果需要有关创建私有仓库的帮助，请参考[Docker 文档](https://docs.docker.com/registry/)。

#### CLI 工具

Kubernetes 安装需要以下 CLI 工具。确保这些工具已安装在您的工作环境上，并且在`$PATH`中可用。

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具。
- [rke](/docs/rke/installation/_index) - Rancher Kubernetes 引擎，用于构建 Kubernetes 集群的 cli。
- [helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 的软件包管理。请参阅[Helm 版本要求](/docs/rancher2/installation/options/helm-version/_index)以选择 Helm 的版本来安装 Rancher。

### Docker 安装

#### 操作系统、Docker、硬件和网络

确保您的节点满足[安装要求](/docs/rancher2/installation/requirements/_index)。

#### 私有仓库

Rancher 支持使用私有仓库进行离线安装。您必须具有自己的私有仓库或其他将 Docker 镜像分发到计算机的方法。

请参考[Docker 文档](https://docs.docker.com/registry/)，获取创建私有仓库的操作指导。

## 设置基础架构

### Kubernetes 安装 (推荐)

Rancher 建议在 Kubernetes 集群上安装 Rancher。一个高可用的 Kubernetes 安装由三个节点组成，这些节点在 Kubernetes 集群上运行 Rancher Server 组件。持久性层(etcd)也复制到这三个节点上，在其中一个节点发生故障时提供冗余和数据复制。

#### 推荐架构

- Rancher 的 DNS 应该解析为 4 层负载均衡器。
- 负载均衡器应将端口 TCP/80 和 TCP/443 转发到 Kubernetes 集群中的所有 3 个节点。
- Ingress 控制器会将 HTTP 重定向到 HTTPS，并在端口 TCP/443 上终止 SSL/TLS。
- Ingress 控制器会将流量转发到 Rancher 部署中 Pod 上的端口 TCP/80。

<figcaption>Rancher安装在具有4层负载均衡器的Kubernetes集群上，描绘了Ingress控制器处的SSL终止。</figcaption>

![Rancher HA](/img/rancher/ha/rancher2ha.svg)

#### A. 根据我们的要求配置三台离线的 Linux 主机

这些主机将与 Internet 断开连接，但需要能够与您的私有仓库连接。

在[需求](/docs/rancher2/installation/requirements/_index)中查看每个集群节点的硬件和软件需求。

#### B. 设置您的负载均衡器

在设置运行 Rancher Server 组件的 Kubernetes 集群时，将在每个节点上部署一个 ingress 控制器 pod。Ingress 控制器 pod 绑定到主机网络上的 TCP/80 和 TCP/443 端口，并且是到 Rancher Server 的 HTTPS 流量的入口点。

您需要将负载均衡器配置为基本的 4 层 TCP 转发器，以将流量定向到这些 ingress 控制器 pod。确切的配置将取决于您的环境。

> **重要：**
> 仅使用此负载均衡器（即`local` 集群 Ingress）对 Rancher Server 进行负载均衡。与其他应用程序共享此 Ingress 可能会在其他应用的 Ingress 配置重新加载后导致 Rancher 出现 websocket 错误。

**负载均衡器配置示例：**

- 有关如何设置 NGINX 负载均衡器的示例，请参考[本页](/docs/rancher2/installation/options/nginx/_index)。

- 有关如何设置 Amazon ELB Network Load Balancer 的示例，请参考[本页](/docs/rancher2/installation/options/nlb/_index)。

- 有关如何配置 F5 作为 Rancher 前端 7 层负载均衡器的示例，请参考[本页](/docs/rancher2/installation/options/F5-7-layer-loadbalancer/_index)。

- 有关如何为 F5 启动 WAF 功能的示例，请参考[本页](/docs/rancher2/installation/options/F5-WAF/_index)。

### Docker 安装

Docker 安装适用于想要测试 Rancher 的 Rancher 用户。您可以使用`docker run`命令在单个节点上安装 Rancher Server 组件，而不是在 Kubernetes 集群上运行。由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，则其他节点上没有可用的 etcd 数据副本，您将丢失 Rancher Server 的所有数据。

> **重要：** 如果您按照 Docker 安装指南安装 Rancher，则没有升级路径可将 Docker 安装过渡到 Kubernetes 安装。

仅使用一个节点来安装 Rancher，您可以选择遵循 Kubernetes 安装指南，而不必运行 Docker 安装。之后，您可以扩展 Kubernetes 集群中的 etcd 节点，使其成为 Kubernetes 安装。

#### A. 根据我们的要求配置单个离线的 Linux 主机

这些主机将与 Internet 断开连接，但需要能够与您的私有仓库连接。

在[需求](/docs/rancher2/installation/requirements/_index)中查看每个集群节点的硬件和软件需求。

## 后续步骤

[同步镜像到私有镜像仓库](/docs/rancher2/installation/options/air-gap-helm2/populate-private-registry/_index)
