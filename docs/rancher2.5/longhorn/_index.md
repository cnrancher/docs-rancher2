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

[Longhorn](https://longhorn.io/)是一个轻量级的、可靠的、易于使用的 Kubernetes 分布式块存储系统。

Longhorn 是一款免费的开源软件。它最初由 Rancher Labs 开发，现在作为云原生计算基金会的沙盒项目进行开发。它可以用 Helm、用 kubectl 或用 Rancher UI 安装在任何 Kubernetes 集群上。你可以了单击[这里](https://longhorn.io/docs/1.0.2/concepts/)了解更多关于它的架构。

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

### New in Rancher v2.5

Before Rancher v2.5, Longhorn could be installed as a Rancher catalog app. In Rancher v2.5, the catalog system was replaced by the **Apps & Marketplace,** and it became possible to install Longhorn as an app from that page.

The **Cluster Explorer** now allows you to manipulate Longhorn's Kubernetes resources from the Rancher UI. So now you can control the Longhorn functionality with the Longhorn UI, or with kubectl, or by manipulating Longhorn's Kubernetes custom resources in the Rancher UI.

These instructions assume you are using Rancher v2.5, but Longhorn can be installed with earlier Rancher versions. For documentation about installing Longhorn as a catalog app using the legacy Rancher UI, refer to the [Longhorn documentation.](https://longhorn.io/docs/1.0.2/deploy/install/install-with-rancher/)

### Installing Longhorn with Rancher

1. Go to the **Cluster Explorer** in the Rancher UI.
1. Click **Apps.**
1. Click `longhorn`.
1. Optional: To customize the initial settings, click **Longhorn Default Settings** and edit the configuration. For help customizing the settings, refer to the [Longhorn documentation.](https://longhorn.io/docs/1.0.2/references/settings/)
1. Click **Install.**

**Result:** Longhorn is deployed in the Kubernetes cluster.

### Accessing Longhorn from the Rancher UI

1. From the **Cluster Explorer," go to the top left dropdown menu and click **Cluster Explorer > Longhorn.\*\*
1. On this page, you can edit Kubernetes resources managed by Longhorn. To view the Longhorn UI, click the **Longhorn** button in the **Overview**section.

**Result:** You will be taken to the Longhorn UI, where you can manage your Longhorn volumes and their replicas in the Kubernetes cluster, as well as secondary backups of your Longhorn storage that may exist in another Kubernetes cluster or in S3.

### Uninstalling Longhorn from the Rancher UI

1. Click **Cluster Explorer > Apps & Marketplace.**
1. Click **Installed Apps.**
1. Go to the `longhorn-system` namespace and check the boxes next to the `longhorn` and `longhorn-crd` apps.
1. Click **Delete,** and confirm **Delete.**

**Result:** Longhorn is uninstalled.

### GitHub Repository

The Longhorn project is available [here.](https://github.com/longhorn/longhorn)

### Documentation

The Longhorn documentation is [here.](https://longhorn.io/docs/)

### Architecture

Longhorn creates a dedicated storage controller for each volume and synchronously replicates the volume across multiple replicas stored on multiple nodes.

The storage controller and replicas are themselves orchestrated using Kubernetes.

You can learn more about its architecture [here.](https://longhorn.io/docs/1.0.2/concepts/)

<figcaption>Longhorn Architecture</figcaption>
![Longhorn Architecture]({{}}/img/rancher/longhorn-architecture.svg)
