---
title: 实时迁移
description: 实时迁移是指在不停机的情况下将虚拟机移动到不同的主机。
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
  - 虚拟机管理
  - 实时迁移
---

## 概述

实时迁移是指在不停机的情况下将虚拟机移动到不同的主机。

:::note

- 当虚拟机使用桥接口类型的管理网络时，不允许实时迁移。
- 为了支持实时迁移，由于[一个已知的问题](https://github.com/harvester/harvester/issues/798)，需要 Harvester 集群中的 3 台或更多的主机。

:::

## 开始迁移

1. 转到**虚拟机**页。
1. 找到要迁移的虚拟机，并选择**Vertical &#8942; (...) > Migrate**。
1. 选择你要迁移的虚拟机的节点。点击**应用**。

## 停止迁移

1. 转到**虚拟机**页面。
1. 找到处于迁移状态的虚拟机，并且你想中止迁移。选择**Vertical &#8942; (...) > Abort Migration**。

## 迁移超时报错及处理方法

### Completion timeout

实时迁移过程将把虚拟机的内存页和磁盘块复制到目的地。在某些情况下，虚拟机对不同内存页或磁盘块的写入速度会高于这些被复制的速度，这将使迁移过程无法在合理的时间内完成。如果超过完成时间，实时迁移将被中止，完成时间是每 GiB 数据 800s。例如，一个拥有 8 GiB 内存的虚拟机将在 6400 秒后超时。

### Progress timeout

当发现复制内存在 150 秒内没有任何进展时，实时迁移也会被终止。
