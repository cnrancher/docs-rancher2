---
title: 在 ARM64 上使用 Rancher (实验性)
description: 在 ARM64 平台上运行目前是一项实验功能，Rancher 尚未正式支持该功能。因此，我们不建议在生产环境中使用基于 ARM64 的节点。使用 ARM64 平台时，可以使用以下选项：在基于 ARM64 的节点上运行 Rancher、创建自定义集群并添加基于 ARM64 的节点、导入包含基于 ARM64 的节点的集群
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
  - 资料、参考和高级选项
  - 在 ARM64 上使用 Rancher (实验性)
---

_自 v2.2.0 起可用_

> **重要：**
>
> 在 ARM64 平台上运行目前是一项实验功能，Rancher 尚未正式支持该功能。因此，我们不建议在生产环境中使用基于 ARM64 的节点。

使用 ARM64 平台时，可以使用以下选项：

- 在基于 ARM64 的节点上运行 Rancher
  - 仅[安装 Docker](/docs/installation/other-installation-methods/single-node-docker/_index)
- 创建自定义集群并添加基于 ARM64 的节点
  - Kubernetes 集群版本必须为 1.12 或更新版本
  - CNI 网络插件必须为[Flannel](/docs/faq/networking/cni-providers/_index)
- 导入包含基于 ARM64 的节点的集群
  - Kubernetes 集群版本必须为 1.12 或更新版本

请参考[集群选项](/docs/cluster-provisioning/rke-clusters/options/_index)，配置集群选项。

以下功能未经测试，请慎用：

- 监控、告警、通知、流水线和日志
- 从应用商店启动应用程序
