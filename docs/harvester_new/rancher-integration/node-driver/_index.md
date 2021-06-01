---
title: 节点驱动
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
  - Harvester
  - 节点驱动
---

## 概述

_从 v0.2.0 开始可用_

Harvester 节点驱动用于配置 Harvester 集群中的虚拟机。在本节中，你将学习如何配置 Rancher 以使用 Harvester 节点驱动来启动和管理 Kubernetes 集群。

节点驱动与[Docker Machine Driver](https://docs.docker.com/machine/drivers/)是一样的，项目回放可以在[harvester/docker-machine-driver-harvester](https://github.com/harvester/docker-machine-driver-harvester)中找到。

## 添加 Harvester 节点驱动

### ISO 模式

在 ISO 模式下，Harvester 节点驱动程序是默认安装的，用户不需要手动添加它。

### App 模式

1. 导航到**Rancher**用户界面。
1. 从**全球**视图，在导航栏中选择**工具>驱动程序**。从**驱动程序**页面，选择**节点驱动程序**标签。在 v2.2.0 之前的版本中，您可以在导航栏中直接选择**节点驱动程序**。
1. 单击**添加节点驱动程序**。
1. 输入**下载 URL**([docker-machine-driver-harvester](https://github.com/harvester/docker-machine-driver-harvester/releases))和**Custom UI URL**([ui-driver-harvester](https://github.com/harvester/ui-driver-harvester/releases))。
1. 将域添加到**白名单域中**。
1. 单击**创建**。

## 创建集群

现在，用户可以从 Harvester 访问 Rancher 用户界面，在 Harvester 集群的顶部旋转 Kubernetes 集群，并在那里管理它们。

**前提条件：**收割机节点驱动需要 VLAN 网络。

1. 从**全球**视图中，单击**添加群集**。
1. 单击**收割机**。
1. 选择一个[模板](#创建集群模板)。
1. 填写创建集群的其余表格。
1. 点击**创建**。

更多信息请参见[在基础设施提供者中启动 kubernetes 和配置节点](/docs/rancher2.5/cluster-provisioning/_index)。

## 创建集群模板

你可以使用 Harvester 节点驱动为你的 Kubernetes 集群创建节点模板和最终的节点池。

1. 配置**账户访问**。对于嵌入 Rancher 的 Harvester，你可以选择**内部 Harvester**，它将使用`harvester.harvester-system`作为默认的`Host`，`8443`作为默认的`Port`。
1. 配置**实例选项**
   - 配置 CPU、内存、磁盘和磁盘总线。
   - 选择一个与 "cloud-init "配置兼容的操作系统镜像。
   - 选择一个节点驱动程序能够连接的网络，目前只支持`VLAN`。
   - 输入 SSH 用户，该用户名将被用于 ssh 到节点。例如，Ubuntu 云图像的默认用户将是`ubuntu`。
1. 输入一个**RANCHER TEMPLATE**名称。

更多信息请参见[由基础设施提供商托管的节点](/docs/rancher2.5/cluster-provisioning/rke-clusters/node-pools/_index)。
