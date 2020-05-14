---
title: ETCD
description: kubectl是一个对 Kubernetes 运行命令的 CLI 命令行工具。您将在 Rancher 2.x 的诸多运维和管理任务上需要使用它。
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
  - 常见问题
  - ETCD
---

_原文链接: https://coreos.com/etcd/docs/latest/faq.html_

## 1. 客户端必须向etcd leader发送请求吗?

Raft is leader-based， leader处理所有需要一致性的客户机请求。但客户端不需要知道哪个节点是leader，所有发送给跟随者的一致性请求都会自动转发给leader。不需要协商一致的请求(例如，序列化读取)可以由任何集群成员处理。

## 2. 系统要求

由于etcd将数据写入磁盘，因此强烈建议使用SSD或者超高速磁盘来运行etcd服务。为防止性能下降或无意中存储空间耗尽，etcd强制设置2GB默认存储大小配额，可以通过`--quota-backend-bytes`配置配额，最高可配置为8GB。空间配额用来保障集群可靠运行，如果没有限制配额，当键空间变大之后，直到耗尽磁盘空间。当任意节点超出空间配额，那么当前etcd服务将进入维护状态，只接受`读/删`操作。只有释放了足够空间、去碎片化了后端数据库并且清理了空间配额之后，集群才能继续正常操作。

## 3. etcd集群大小

从理论上讲，没有硬性限制。但是，一个etcd集群不应该超过七个节点。
