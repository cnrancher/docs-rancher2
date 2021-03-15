---
title: Longhorn - Kubernetes的云端原生分布式块存储
description:
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
  - rancher 2.5
  - Longhorn
---

## 概述

[Longhorn](https://longhorn.io/)是一个轻量级的、可靠的、易于使用的 Kubernetes 分布式块存储系统。

Longhorn 是一款免费的开源软件。它最初由 Rancher Labs 开发，现在作为云原生计算基金会的沙盒项目进行开发。您可以用 Helm、kubectl 或 Rancher UI 将 Longhorn 安装在任何 Kubernetes 集群上。你可以了单击[这里](https://longhorn.io/docs/1.0.2/concepts/)了解更多关于它的架构。

Longhorn 具有以下功能：

- 使用 Longhorn 卷作为 Kubernetes 集群中分布式有状态应用程序的持久性存储。
- 将您的块存储分区为 Longhorn 卷，这样您就可以在有或没有云提供商的情况下使用 Kubernetes 卷。
- 在多个节点和数据中心之间复制块存储，以提高可用性。
- 将备份数据存储在外部存储中，如 NFS 或 AWS S3。
- 创建跨集群灾难恢复卷，以便从主 Kubernetes 集群中的数据可以快速从第二个 Kubernetes 集群的备份中恢复。
- 安排卷执行定时快照，并安排定时备份到 NFS 或 S3 兼容的二级存储。
- 从备份中恢复卷。
- 升级 Longhorn 而不破坏持久卷。

<figcaption>Longhorn Dashboard</figcaption>
![Longhorn Dashboard](/img/rancher/longhorn-screenshot.png)

## 在 Rancher v2.5.x 中安装 Longhorn

在 Rancher v2.5 之前，Longhorn 可以作为 Rancher 应用程序安装。在 Rancher v2.5 中，目录系统被**应用和市场**取代，并且可以从该页面将 Longhorn 作为应用安装。

现在，**集群资源管理器**允许你从 Rancher UI 中操作 Longhorn 的 Kubernetes 资源。因此，现在您可以使用 Longhorn UI、kubectl，或通过在 Rancher UI 中操作 Longhorn 的 Kubernetes 自定义资源来控制 Longhorn 功能。

这些说明假设您使用的是 Rancher v2.5，但 Longhorn 可以安装在早期的 Rancher 版本上。有关使用遗留的 Rancher UI 将 Longhorn 安装为目录应用程序的文档，请参阅[Longhorn 文档](https://longhorn.io/docs/1.0.2/deploy/install/install-with-rancher/)。

## 使用 Rancher 安装 Longhorn

1. 进入 Rancher UI 中的**Cluster Explorer**。
1. 单击**Apps**。
1. 单击 `longhorn`。
1. 可选：如果需要自定义初始设置，请单击**Longhorn Default Settings**并编辑配置。有关自定义设置的帮助，请参阅[Longhorn 文档](https://longhorn.io/docs/1.0.2/references/settings/)。
1. 单击**安装**。

**结果：**Longhorn 已部署在 Kubernetes 集群中。

## 从 Rancher UI 访问 Longhorn

1. 在 **Cluster Explorer**中，进入左上角下拉菜单，单击**群组资源管理器 > Longhorn**。
1. 在这个页面上，您可以编辑由 Longhorn 管理的 Kubernetes 资源。要查看 Longhorn UI，请单击**Overview**部分的**Longhorn**按钮。

**结果：**你将被带到 Longhorn UI，在这里你可以管理你的 Longhorn 卷和它们在 Kubernetes 集群中的副本，以及可能存在于另一个 Kubernetes 集群或 S3 中的 Longhorn 存储的二级备份。

## 从 Rancher UI 卸载 Longhorn

1. 单击**Cluster Explorer > Apps & Marketplace**。
1. 单击**Installed Apps**。
1. 进入 `longhorn-system`命名空间，选中`longhorn`和 `longhorn-crd`应用程序旁边的方框。
1. 单击**Delete**并确认。

**结果：**Delete 已被卸载。

## GitHub Repository

详情请参考[GitHub-Longhorn](https://github.com/longhorn/longhorn)

## 文档

详情请参考[Docs-Longhorn](https://longhorn.io/docs/)

## 架构

Longhorn 为每个卷创建一个专用的存储控制器，并在多个节点上存储的多个副本上同步复制该卷。

存储控制器和副本本身使用 Kubernetes 进行协调。

详情请参考[Longhorn 架构](https://longhorn.io/docs/1.0.2/concepts/)。

<figcaption>Longhorn Architecture</figcaption>
![Longhorn Architecture]({{}}/img/rancher/longhorn-architecture.svg)
