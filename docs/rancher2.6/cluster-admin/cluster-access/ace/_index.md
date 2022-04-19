---
title: 授权集群端点的工作原理
weight: 2015
---

本文介绍 kubectl CLI、kubeconfig 文件和授权集群端点如何协同工作，使你可以直接访问下游 Kubernetes 集群，而无需通过 Rancher Server 进行身份验证。本文旨在为[设置 kubectl 以直接访问集群的说明](../kubectl/#authenticating-directly-with-a-downstream-cluster)提供背景信息和上下文。

### kubeconfig 文件说明

_kubeconfig 文件_ 是与 kubectl 命令行工具（或其他客户端）结合使用时用于配置 Kubernetes 访问的文件。

此 kubeconfig 文件及其内容特定于你正在查看的集群。你可以从 Rancher 的**集群**视图中下载该文件。在 Rancher 中可以访问的每个集群都需要一个单独的 kubeconfig 文件。

下载 kubeconfig 文件后，你将能够使用 kubeconfig 文件及其 Kubernetes [上下文](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#kubectl-context-and-configuration)访问下游集群。

如果管理员[在 kubeconfig token 上强制执行 TTL]({{<baseurl>}}/rancher/v2.6/en/api/api-tokens/#setting-ttl-on-kubeconfig-tokens)，则 kubeconfig 文件要求 [rancher cli]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/ace) 存在于你的 PATH 中。

### RKE 集群的两种身份验证方法

如果集群不是 [RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)，kubeconfig 文件只允许你以一种方式访问集群，即通过 Rancher Server 进行身份验证，然后 Rancher 允许你在集群上运行 kubectl 命令。

对于 RKE 集群，kubeconfig 文件允许你通过两种方式进行身份验证：

- **通过 Rancher Server 身份验证代理**：Rancher 的身份验证代理会验证你的身份，然后将你连接到要访问的下游集群。
- **直接使用下游集群的 API Server**：RKE 集群默认启用授权集群端点。此端点允许你使用 kubectl CLI 和 kubeconfig 文件访问下游 Kubernetes 集群，且 RKE 集群默认启用该端点。在这种情况下，下游集群的 Kubernetes API server 通过调用 Rancher 设置的 webhook（`kube-api-auth` 微服务）对你进行身份验证。

第二种方法（即直接连接到集群的 Kubernetes API server）非常重要，因为如果你无法连接到 Rancher，这种方法可以让你访问下游集群。

要使用授权集群端点，你需要配置 kubectl，从而使用 Rancher 在创建 RKE 集群时生成的 kubeconfig 文件中的额外 kubectl 上下文。该文件可以从 Rancher UI 的**集群**视图中下载，配置 kubectl 的说明在[此页面](../kubectl/#authenticating-directly-with-a-downstream-cluster)。

[架构介绍]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#communicating-with-downstream-user-clusters)也详细解释了这些与下游 Kubernetes 集群通信的方法，并介绍了 Rancher 的工作原理以及 Rancher 如何与下游集群通信的详细信息。

### 关于 kube-api-auth 身份验证 Webhook

`kube-api-auth` 微服务是为[授权集群端点]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/#4-authorized-cluster-endpoint)提供用户认证功能而部署的，该功能仅适用于[RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)。当你使用 `kubectl`访问下游集群时，集群的 Kubernetes API server 会使用 `kube-api-auth` 服务作为 webhook 对你进行身份验证。

在集群配置期间会部署 `/etc/kubernetes/kube-api-authn-webhook.yaml` 文件，并使用 `--authentication-token-webhook-config-file=/etc/kubernetes/kube-api-authn-webhook.yaml` 配置 `kube-apiserver`。这会将 `kube-apiserver` 配置为通过查询 `http://127.0.0.1:6440/v1/authenticate` 来确定持有者 token 的身份验证。

`kube-api-auth` 的调度规则如下：

| 组件          | nodeAffinity nodeSelectorTerms                                                             | nodeSelector | 容忍度            |
| ------------- | ------------------------------------------------------------------------------------------ | ------------ | ----------------- |
| kube-api-auth | `beta.kubernetes.io/os:NotIn:windows`<br/>`node-role.kubernetes.io/controlplane:In:"true"` | none         | `operator:Exists` |
