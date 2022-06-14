---
title: "在 ARM64 上运行 Rancher（实验性）"
weight: 3
---

> **重要提示**：
>
> 在使用 ARM64 架构的节点上运行 Rancher 目前还处在实验阶段，Rancher 尚未正式支持该功能。因此，我们不建议你在生产环境中使用 ARM64 架构的节点。

如果你的节点使用 ARM64 架构，你可以使用以下选项：

- 在 ARM64 架构的节点上运行 Rancher
   - 此选项仅适用于 Docker 安装。请知悉，以下安装命令取代了 [Docker 安装]({{<baseurl>}}/rancher/v2.0-v2.4/en/installation/other-installation-methods/single-node-docker)链接中的示例：

   ```
   # 在最后一行 `rancher/rancher:vX.Y.Z` 中，请务必将 "X.Y.Z" 替换为包含 ARM64 版本的发布版本。例如，如果你的匹配版本是 v2.5.8，请在此行填写 `rancher/rancher:v2.5.8`。
   docker run -d --restart=unless-stopped \
     -p 80:80 -p 443:443 \
     --privileged \
     rancher/rancher:vX.Y.Z  
   ```
> **注意**：
> 要检查你的发布版本是否与 ARM64 架构兼容。你可以使用以下两种方式找到对应版本的发行说明：
>
> - 访问 [Rancher 发行版本](https://github.com/rancher/rancher/releases)自行查询。
> - 根据标签和版本号直接找到你的版本。例如，你使用的版本为 2.5.8，你可以访问 [Rancher 发行版本 - 2.5.8](https://github.com/rancher/rancher/releases/tag/v2.5.8)。

- 创建自定义集群并添加使用 ARM64 架构的节点
   - Kubernetes 集群必须为 1.12 或更高版本
   - CNI 网络插件必须是 [Flannel]({{<baseurl>}}/rancher/v2.6/en/faq/networking/cni-providers/#flannel)
- 导入包含使用 ARM64 架构的节点的集群
   - Kubernetes 集群必须为 1.12 或更高版本

如需了解如何配置集群选项，请参见[集群选项]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/options/)。

以下是未经测试的功能：

- 监控、告警、通知、管道和日志管理
- 通过应用商店发布应用
