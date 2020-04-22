---
title: Amazon EBS 存储
description: 本章节描述的是如何在 EC2 里启用 Amazon EBS。
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
  - 集群管理员指南
  - 存储卷和存储类
  - 创建存储示例
  - Amazon EBS 存储
---

本章节描述的是如何在 EC2 里启用 Amazon EBS。

1. 在 EC2 的控制台里，在左边的面板中找到**弹性块存储**，然后点击**卷**。
1. 点击**创建卷**。
1. 可选：配置卷的大小或其他选项。该卷应与其将连接到的 EC2 实例在相同的可用区。
1. 点击**创建卷**。
1. 点击**关闭**。

**结果：**持久化存储创建了 EBS 持久化存储。

关于如何在 Rancher 里创建新的存储，可以浏览[配置现有的存储](/docs/cluster-admin/volumes-and-storage/attaching-existing-storage/_index)。
