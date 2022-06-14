---
title: 常见问题
weight: 25
---

本文包含了用户常见的 Rancher 2.x 问题。

有关常见技术问题，请参阅[常见技术问题解答]({{<baseurl>}}/rancher/v2.6/en/faq/technical/)。

<br>

**Rancher 2.x 支持 Docker Swarm 和 Mesos 作为环境类型吗？**

如果你在 Rancher 2.x 中创建环境，Swarm 和 Mesos 将不再是可选的标准选项。但是，Swarm 和 Mesos 还能继续作为可以部署的商店应用程序。这是一个艰难的决定，但这是大势所趋。比如说，15,000 多个集群可能只有大约 200 个在运行 Swarm。

<br>

**是否可以使用 Rancher 2.x 管理 Azure Kubernetes 服务？**

是的。

<br>

**Rancher 是否支持 Windows？**

从 Rancher 2.3.0 开始，我们支持 Windows Server 1809 容器。有关如何使用 Windows Worker 节点设置集群的详细信息，请参阅[为 Windows 配置自定义集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/windows-clusters/)。

<br>

**Rancher 是否支持 Istio？**

从 Rancher 2.3.0 开始，我们支持 [Istio.]({{<baseurl>}}/rancher/v2.6/en/istio/)

此外，Istio 是在我们的微型 PaaS “Rio” 中实现的，它可以运行在 Rancher 2.x 以及任何符合 CNCF 的 Kubernetes 集群上。详情请参阅[这里](https://rio.io/)。

<br>

**Rancher 2.x 是否支持使用 Hashicorp 的 Vault 来存储密文？**

密文管理已在我们的 roadmap 上，但我们尚未将该功能分配给特定版本。

<br>

**Rancher 2.x 是否也支持 RKT 容器？**

目前，我们只支持 Docker。

<br>

**Rancher 2.x 是否支持将 Calico、Contiv、Contrail、Flannel、Weave net 等网络插件用于嵌入和已注册的 Kubernetes？**

Rancher 开箱即用地为 Kubernetes 集群提供了几个 CNI 网络插件，分别是 Canal、Flannel、Calico 和 Weave。有关官方支持的详细信息，请参阅 [Rancher 支持矩阵](https://rancher.com/support-maintenance-terms/)。

<br>

**Rancher 是否计划支持 Traefik？**

目前，我们不打算提供嵌入式 Traefik 支持，但我们仍在探索负载均衡方案。

<br>

**我可以将 OpenShift Kubernetes 集群导入 2.x 吗？**

我们的目标是运行任何上游 Kubernetes 集群。因此，Rancher 2.x 应该可以与 OpenShift 一起使用，但我们尚未对此进行测试。

<br>

**Rancher 会集成 Longhorn 吗？**

是的。Longhorn 已集成到 Rancher 2.5+ 中。
