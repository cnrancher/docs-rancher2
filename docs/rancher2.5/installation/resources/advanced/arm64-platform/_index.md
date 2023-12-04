---
title: 在 ARM64 上使用 Rancher (实验性)
description: 在 ARM64 平台上运行目前是一项实验功能，Rancher 尚未正式支持该功能。因此，我们不建议在生产环境中使用基于 ARM64 的节点。使用 ARM64 平台时，可以使用以下选项：在基于 ARM64 的节点上运行 Rancher、创建自定义集群并添加基于 ARM64 的节点、导入包含基于 ARM64 的节点的集群
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
  - 在 ARM64 上使用 Rancher (实验性)
---

_自 v2.2.0 起可用_

> **重要：**
>
> 在 ARM64 平台上运行目前是一项实验功能，Rancher 尚未正式支持该功能。因此，我们不建议在生产环境中使用基于 ARM64 的节点。

使用 ARM64 平台时，可以使用以下选项：

- 在基于 ARM64 的节点上运行 Rancher
  - 仅适用于 Docker 安装。请注意，以下安装命令取代了[Docker 安装](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)链接中的例子：

  ```
  # In the last line `rancher/rancher:vX.Y.Z`, be certain to replace "X.Y.Z" with a released version in which ARM64 builds exist. For  example, if your matching version is v2.5.8, you would fill in this line with `rancher/rancher:v2.5.8`.
  docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    --privileged \
    rancher/rancher:vX.Y.Z
  ```

  > **注意：**要检查您的特定发布版本是否与 ARM64 架构兼容，您可以导航到您的版本的发行说明，有以下两种方式：
  >
  > - 使用 https://github.com/rancher/rancher/releases 手动查找您的版本。
  > - 使用标签和具体的版本号直接进入你的版本。例如，如果你打算使用 v2.5.8，你可以导航到 https://github.com/rancher/rancher/releases/tag/v2.5.8 。

- 创建自定义集群并添加基于 ARM64 的节点
  - Kubernetes 集群版本必须为 1.12 或更新版本
  - CNI 网络插件必须为[Flannel](/docs/rancher2.5/faq/networking/cni-providers/_index)
- 导入包含基于 ARM64 的节点的集群
  - Kubernetes 集群版本必须为 1.12 或更新版本

请参考[集群选项](/docs/rancher2.5/cluster-provisioning/rke-clusters/options/_index)，配置集群选项。

以下功能未经测试，请慎用：

- 监控、告警、通知、流水线和日志
- 从应用商店启动应用程序
