---
title: 升级指南
description: Harvester 提供了两种升级的方式。用户可以使用 ISO 镜像进行升级，或者通过用户界面进行升级。
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
  - 升级指南
---

## 概述

_从 v0.2.0 起可用_

Harvester 提供了两种升级的方式。用户可以使用 ISO 镜像进行升级，或者通过用户界面进行升级。

:::note

- 不支持从 v0.1.0 升级。
- 不支持从当前版本升级到任何 RC 版本，也不支持从任何 RC 版本升级到 0.2.0。
- 由于路线图中的操作系统变化尚未完成，目前不能保证升级到 GA 版本。
- 当 Harvester 集群包括 3 个或更多节点时，支持零停机时间升级。如果集群的节点少于 3 个，你仍然可以执行升级，但在升级过程中会有停机时间。
- 一个一个地升级节点。

:::

## 使用 ISO 镜像升级

要获得较新版本的 Harvester ISO，请从 Github 版本中下载。

1. 进入 Harvester 用户界面中的**主机**页面。
1. 找到你要升级的节点。点击动作下拉菜单。点击 "启用维护模式 "动作。
1. 等到该节点上的所有虚拟机都迁移到其他节点，并且该节点处于 "维护模式 "状态。
1. 关闭服务器，并从较新的 Harvester 版本的 ISO 盘启动服务器。
1. 在 grub 菜单中选择 "Harvester Installer"。
1. 选择 "Upgrade Harvester "并在提示中确认。
   ！[iso-mod-upgrade](/img/harvester/iso-mod-upgrade.png)
1. 等待，直到升级完成。节点将被重新启动并在终端控制台再次显示 "Ready"。
1. 进入 Harvester UI 中的 **Hosts** 页面。
1. 找到刚刚完成升级的节点。点击动作下拉菜单。点击 "禁用维护模式 "的动作。
1. 对于集群的其他节点，重复步骤 2 到 9，逐一进行升级。

## 使用 UI 升级

_先决条件：要在用户界面中进行实时升级，需要互联网接入。_

1. 进入 Harvester UI 中的**Dashboard**页面。
1. 当较新的版本可用时，右上角将显示一个升级按钮。点击升级。
   ![upgrade-ui](/img/harvester/upgrade-ui.png)
1. 选择一个要升级的版本。点击升级。
1. 等待，直到升级完成。你可以通过点击顶部导航栏的圆形图标来查看升级进度。
