---
title: Rancher 2 常见问题
description: 本章 FAQ 将回答用户关于 Rancher v2.x 常见的问题，我们将保持持续更新。关于常见的技术问题，请参阅[常见的技术问题](/docs/faq/technical/_index)。
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
  - 常见问题
  - Rancher 2 常见问题
---

本章 FAQ 将回答用户关于 Rancher v2.x 常见的问题，我们将保持持续更新。

关于常见的技术问题，请参阅[常见的技术问题](/docs/faq/technical/_index)。

**Rancher v2.x 支持 Docker Swarm 和 Mesos 作为环境类型吗？**

当您在 Rancher v2.x 创建环境时，Swarm 和 Mesos 已不在是您可选择的标准项。不再使用 Cattle，Swarm 和 Mesos 是一项艰难的决定，但这是大势所趋。比如，在 15000 个集群当中，可能只有大约 200 个左右在运行 Swarm。

**Rancher v2.x 可以管理 Azure Kubernetes Services 吗？**

可以。

**Rancher 支持 Windows 容器吗？**

自 Rancher 2.3.0 起，我们支持在 Windows Server 1809 服务器上运行 Windows 容器。关于如何创建一个包含 Windows Workder 节点的集群，请参见[配置自定义 Windows 集群](/docs/cluster-provisioning/rke-clusters/windows-clusters/_index)章节。

**Rancher 支持 Istio 服务网格吗？**

自 Rancher 2.3.0 起，我们支持 [Istio](/docs/cluster-admin/tools/istio/_index)。

另外，Istio 也可以通过 Rancher 的 mico-PaaS 产品 Rio 来使用。Rio 可以在 Rancher 或者任何通过 CNCF 一致性审核的 Kubernetes 集群上运行。详细信息可以参考 [Rio 网站](https://rio.io/)。

**Rancher 支持 Istio 的新版本吗？**

是的，我们有专门的团队负责 Istio 的集成，我们在经过严格的测试后，会在 Rancher 中支持新的 Istio 版本。

**Rancher v2.x 支持采用 Hashicorp 的 Vault 来存储密文吗**

使用 Vault 进行密文管理在我们的产品 Roadmap 里，但目前还没有确定在具体哪个版本发布。

**Rancher v2.x 也支持 RKT 容器吗？**

当前我们仅支持 Docker。

**对于自定义集群和导入的集群，Rancher v2.x 支持 Calico、Contiv、Contrail、Flannel、Weave 等网络方案吗？**

网络方案相对解耦，Rancher 支持 Kubernetes 集群常见 CNI 网络方案：Canal、Flannel、Calico 和 Weave（自 v2.2.0 版本支持 Weave）。请参阅 [Rancher 支持矩阵](https://rancher.com/support-maintenance-terms/)以查看 Rancher 官方支持的网络方案。

**Rancher 计划支持 Trakfik 吗**

目前我们不支持开箱即用的 Treafik 部署和支持，您可以手动部署，但我们仍然在探索更多的负载均衡方案。

**我能导入 Openshift Kubernetes 集群到 Rancher v2.x 吗？**

我们的目标是运行任何原生的 Kubernetes 集群。因此，Rancher 2.x 应该能够支持 Openshift，但我们目前没有进行严格测试。

**Rancher 将会集成 Longhorn 吗？**

是的。Longhorn 在社区正在快速发展中，不久您将看到 Longhorn 的正式发布和在 Rancher 2 中的集成。
