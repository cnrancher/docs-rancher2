---
title: 在 ARM64 上使用 Rancher (实验性)
---

_自 v2.2.0 起可用_

> **重要：**
>
> 在 ARM64 平台上运行目前是一项实验功能，Rancher 尚未正式支持该功能。因此，我们不建议在生产环境中使用基于 ARM64 的节点。

使用 ARM64 平台时，可以使用以下选项：

- 在基于 ARM64 的节点上运行 Rancher
  - 仅[安装 Docker](/docs/installation/other-installation-methods/single-node-docker/_index)
- 创建自定义集群并添加基于 ARM64 的节点
  - Kubernetes 集群版本必须为 1.12 或更高
  - CNI 网络插件必须为[Flannel](/docs/faq/networking/cni-providers/_index)
- 导入包含基于 ARM64 的节点的群集
  - Kubernetes 集群版本必须为 1.12 或更高

请参阅[集群选项](/docs/cluster-provisioning/rke-clusters/options/_index)如何配置集群选项。

以下功能未经测试：

- 监控、告警、通知、流水线和日志
- 从应用商店启动应用程序
