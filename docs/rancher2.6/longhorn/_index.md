---
title: Longhorn - Kubernetes 的云原生分布式块存储
shortTitle: Longhorn 存储
weight: 19
---

[Longhorn](https://longhorn.io/) 是一个轻量级、可靠、易用的 Kubernetes 分布式块存储系统。

Longhorn 是免费的开源软件。Longhorn 最初由 Rancher Labs 开发，现在正在作为云原生计算基金会的沙盒项目进行开发。它可以通过 Helm、kubectl 或 Rancher UI 安装在任何 Kubernetes 集群上。有关其架构的更多信息，请参阅[此处](https://longhorn.io/docs/1.0.2/concepts/)。

使用 Longhorn，你可以：

- 将 Longhorn 卷用作 Kubernetes 集群中分布式有状态应用程序的持久存储
- 将你的块存储分区为 Longhorn 卷，以便在有或没有云提供商的情况下使用 Kubernetes 卷
- 跨多个节点和数据中心复制块存储以提高可用性
- 将备份数据存储在 NFS 或 AWS S3 等外部存储中
- 创建跨集群灾难恢复卷，以便使用另一个 Kubernetes 集群中的备份快速恢复主 Kubernetes 集群中的数据
- 计划卷的定期快照，并将定期备份调度到 NFS 或兼容 S3 的辅助存储
- 使用备份来恢复卷
- 在不中断持久卷的情况下升级 Longhorn

<figcaption>Longhorn 仪表板</figcaption>
![Longhorn 仪表板]({{<baseurl>}}/img/rancher/longhorn-screenshot.png)

### 使用 Rancher 安装 Longhorn

1. 满足所有[安装要求](https://longhorn.io/docs/1.1.0/deploy/install/#installation-requirements)。
1. 转到要安装 Longhorn 的集群。
1. 单击**应用 & 应用市场**。
1. 单击 **Chart**。
1. 点击 **Longhorn**。
1. 可选：要自定义初始设置，请单击 **Longhorn 默认设置**并编辑配置。如需自定义设置的帮助，请参阅 [Longhorn 文档](https://longhorn.io/docs/1.0.2/references/settings/)。
1. 单击**安装**。

**结果**：Longhorn 已部署到 Kubernetes 集群中。

### 从 Rancher UI 访问 Longhorn

1. 转到安装了 Longhorn 的集群。在左侧导航菜单中，单击 **Longhorn**。
1. 在此页面上，你可以编辑 Longhorn 管理的 Kubernetes 资源。要查看 Longhorn UI，请单击**概述**中的 **Longhorn** 按钮。

**结果**：你将转到 Longhorn UI，你可以在那里管理 Longhorn 卷及其在 Kubernetes 集群中的副本，还可以查看位于另一个 Kubernetes 集群或 S3 中的 Longhorn 存储辅助备份。

### 从 Rancher UI 卸载 Longhorn

1. 转到安装了 Longhorn 的集群，然后单击**应用 & 应用市场**。
1. 点击**已安装的应用**。
1. 转到 `longhorn-system` 命名空间并选中 `longhorn` 和 `longhorn-crd` 应用程序旁边的框。
1. 单击**删除**并确认**删除**。

**结果**：Longhorn 已被卸载。

### GitHub 仓库

Longhorn 项目在[此处](https://github.com/longhorn/longhorn)。

### 文档

Longhorn 文档在[此处](https://longhorn.io/docs/)。

### 架构

Longhorn 为每个卷创建专用的存储控制器，并在存储在多个节点上的多个副本之间同步复制该卷。

存储控制器和副本本身是使用 Kubernetes 编排的。

有关其架构的更多信息，请参阅[此处](https://longhorn.io/docs/1.0.2/concepts/)。

<figcaption>Longhorn 架构</figcaption>
![Longhorn 架构]({{<baseurl>}}/img/rancher/longhorn-architecture.svg)
