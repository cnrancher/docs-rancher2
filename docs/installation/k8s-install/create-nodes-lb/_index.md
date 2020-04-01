---
title: '配置说明'
---

使用您选择的基础架构提供商为 RKE 安装设置三个节点和一个负载均衡器。

> **注意：** 这些节点必须位于相同的区域/数据中心中，您可以将这些服务器放在单独的可用区中。

## 操作系统，Docker，硬件和网络的要求

确保您的节点满足[安装要求。](/docs/installation/requirements/_index)

在[RKE 要求](https://rancher.com/docs/rke/latest/en/os/)中查看 RKE 的操作系统要求。

## 负载均衡器

RKE 将在每个节点上配置一个 Ingress 控制器的 Pod。Ingress 控制器 Pod 会绑定到主机网络上的 TCP/80 和 TCP/443 端口，这也是到 Rancher Server 的 HTTPS 流量的入口点。

将负载均衡器配置为基本的 4 层 TCP 转发器。确切的配置将根据您的环境而有所不同。

> **重要提示：**
> 安装后，请不要使用这个负载均衡器（即 `local` 集群的 Ingress）对 Rancher 以外的应用程序进行负载均衡。与其他应用程序共享这个 Ingress 可能会在其他应用的 Ingress 配置重新加载后导致 Rancher 出现 websocket 错误。我们建议将`local`集群专用于 Rancher，不要部署其他应用程序。

### 入门指南

- 有关如何设置 NGINX 负载均衡器的示例，请参阅[此页面。](/docs/installation/k8s-install/create-nodes-lb/nginx/_index)
- 有关显示如何设置 Amazon NLB 负载均衡器的示例，请参阅[此页面。](/docs/installation/k8s-install/create-nodes-lb/nlb/_index)

## [下一步：使用 RKE 安装 Kubernetes](/docs/installation/k8s-install/kubernetes-rke/_index)
