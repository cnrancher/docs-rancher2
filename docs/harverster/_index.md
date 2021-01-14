---
title: 产品介绍
description:
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
  - Harvester
  - 产品介绍
---

## 概述

Harvester 是由 Rancher 提供的基于 Kubernetes 构建的 100%开源的超融合基础架构（HCI）软件。 它是 vSphere 和 Nutanix 的开源替代方案。

![harvester-ui](/img/harvester/harvester-ui.png)

## 功能

Harvester 支持在裸机服务器上实施 HCI。以下是 Harvester 的一些主要功能：

- 虚拟机生命周期管理，包括 SSH-Key 注入、Cloud-init 和图形、串行端口控制台。
- 分布式块存储。
- 支持管理网络与 VLAN 的多网卡管理
- 内置镜像仓库。
- 虚拟机模板。

下图为 Harvester 的概览架构：

![](/img/harvester/architecture.png)

- [MinIO](https://min.io/) 是一个与 Amazon S3 兼容的云存储服务器。
- [Longhorn](https://longhorn.io/) 是一个轻量级、可靠、易用的 Kubernetes 分布式块存储系统。
- [KubeVirt](https://kubevirt.io/) 是一个 Kubernetes 的虚拟机管理插件。
- [K3OS](https://k3os.io/) 是一个 Linux 发行版，旨在尽可能地消除 Kubernetes 集群中的操作系统维护。该操作系统被设计为由 kubectl 管理。

## 硬件要求

硬件需要满足以下要求，才可以启动和运行 Harvester。

| 硬件类型 | 要求                                                    |
| :------- | :------------------------------------------------------ |
| CPU      | 至少 4 核，首选 16 核或以上。                           |
| 内存     | 至少 8 GB，首选 32 GB 或以上 。                         |
| 磁盘     | 至少 120 GB ，首选 500 GB 或以上 。                     |
| 网卡     | 至少 1 Gbps Ethernet，建议选择 10Gbps Ethernet 或以上。 |
| 网关     | VLAN 支持所需的端口中继。                               |

## 安装方式

Harvester 支持两种安装模式：ISO 模式和 App 模式（开发模式）。

### ISO 模式

在 `Bare-metal` 模式下，用户可以使用 ISO 直接在裸金属服务器上安装 Harvester，创建 Harvester 集群，然后添加一个或多个计算节点到现有的集群。

请访问[Harvester releases](https://github.com/rancher/harvester/releases)，下载 Harvester 镜像。

在安装过程中，你可以选择组建一个新的集群，或者将节点加入到现有的集群中。

:::note
请观看这个[视频](https://youtu.be/97ADieBX6bE)，快速了解 ISO 安装的过程。
:::

### App 模式（开发模式）

在`App`模式下，如果 Kubernetes 节点支持硬件辅助虚拟化，用户可以使用[Helm](https://github.com/rancher/harvester/tree/master/deploy/charts/harvester)将 Harvester 部署到现有的 Kubernetes 集群中。

## 代码库

Harvester 是 100%开源的软件。项目的源代码分布在多个代码仓库中，如下表所示：

| 代码仓库名称                 | 代码仓库地址                                            |
| :--------------------------- | :------------------------------------------------------ |
| Harvester                    | https://github.com/rancher/harvester                    |
| Harvester UI                 | https://github.com/rancher/harvester-ui                 |
| Harvester Installer          | https://github.com/rancher/harvester-installer          |
| Harvester Network Controller | https://github.com/rancher/harvester-network-controller |

请参考[Harvester UI 展示](https://youtu.be/wVBXkS1AgHg)，了解 Harvester UI 的功能。

## 社区

如果你需要任何关于 Harvester 的帮助，请加入我们的[Rancher 论坛](https://forums.rancher.com/)或[Slack](https://slack.rancher.io/)。

如果你有任何反馈或问题，请随时[提交问题](https://github.com/rancher/harvester/issues/new/choose)。
