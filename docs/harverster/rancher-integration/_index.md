---
title: Rancher 集成
description: 用户可以通过进入 Harvester 的 "Settings "页面来启用 Rancher 仪表板。
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
  - 产品介绍
---

## Rancher 集成

_从 0.2.0 版起可用_

[Rancher](https://github.com/rancher/rancher)是一个开源的多集群管理平台。Harvester 默认将 Rancher 集成到其 HCI 模式安装中。

## 启用 Rancher 仪表板

用户可以通过进入 Harvester 的 "Settings "页面来启用 Rancher 仪表板。

1. 点击`rancher-enabled`设置的动作。
1. 选择 "启用 "选项并点击保存按钮。
1. 在右上角会出现 Rancher 仪表板按钮。
1. 点击 Rancher 按钮，它将打开一个新的标签，导航到 Rancher 仪表板。

关于如何使用 Rancher 的更多细节，你可以参考这篇[文档](/docs/rancher2.5/_index)。

## 使用 Harvester 节点驱动创建 K8s 集群

Harvester 节点驱动用于在 Harvester 集群中配置虚拟机，Rancher 用它来启动和管理 Kubernetes 集群。

在 ISO 模式下，Harvester 驱动已经被默认添加。用户可以参考这篇[文档](/docs/harverster/rancher-integration/node-driver/_index)了解更多细节。
