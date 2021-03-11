---
title: 从 v1.6 迁移到 v2.x
description: Rancher v2.x 经过重新整理和编写，旨在为 Kubernetes 和 Docker 提供一个完整的管理解决方案。由于进行了较为广泛的更改，因此没有从版本 v1.6 直接升级到 v2.x 的途径，而是将 v1.6 服务迁移到 v2.x 作为 Kubernetes 的工作负载。在 v1.6 版本中，最常用的编排是 Rancher 自己的引擎 Cattle。以下指南将说明和指导我们的 Cattle 用户如何在 Kubernetes 环境中运行工作负载。
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
  - 版本迁移
  - 从 v1.6 迁移到 v2.x
---

Rancher v2.x 经过重新整理和编写，旨在为 Kubernetes 和 Docker 提供一个完整的管理解决方案。由于进行了较为广泛的更改，因此没有从版本 v1.6 直接升级到 v2.x 的途径，而是将 v1.6 服务迁移到 v2.x 作为 Kubernetes 的工作负载。在 v1.6 版本中，最常用的编排是 Rancher 自己的引擎 Cattle。以下指南将说明和指导我们的 Cattle 用户如何在 Kubernetes 环境中运行工作负载。

## 视频

该[视频](https://www.youtube.com/watch?time_continue=1002&v=OIifcqj5Srw&feature=emb_logo)演示了从 Rancher v1.6 到 v2.x 的完整迁移过程。

## 迁移计划

> **在开始之前想了解有关 Kubernetes 的更多信息?** 阅读我们的 [Kubernetes 介绍](/docs/rancher2/v1.6-migration/kub-intro/_index)。

- [1. 开始迁移](/docs/rancher2/v1.6-migration/get-started/_index)

  > **在版本 v1.6 时已经是 Kubernetes 的使用者?**
  >
  > _开始使用_ 是您为迁移到 v2.x 唯一需要看的部分。您可以跳过其他所有内容

* [2. 迁移服务](/docs/rancher2/v1.6-migration/run-migration-tool/_index)
* [3. 暴露服务](/docs/rancher2/v1.6-migration/expose-services/_index)
* [4. 健康检查](/docs/rancher2/v1.6-migration/monitor-apps/_index)
* [5. 调度服务](/docs/rancher2/v1.6-migration/schedule-workloads/_index)
* [6. 服务发现](/docs/rancher2/v1.6-migration/discover-services/_index)
* [7. 负载均衡](/docs/rancher2/v1.6-migration/load-balancing/_index)

## 迁移示例文件

在整个迁移指南中，我们将引用几个要从 Rancher v1.6 迁移到 v2.x 的的示例服务。这些服务是：

- 名为 `web` 的服务, 该服务运行 [Let's Chat](http://sdelements.github.io/lets-chat/), 一个为小团队的自托管聊天服务。
- 名为 `database` 的服务, 该服务运行 [Mongo DB](https://www.mongodb.com/), 一个开源文档数据库。
- 名为 `webLB`的服务, 该服务运行 [HAProxy](http://www.haproxy.org/), 一个 Rancher v1.6 中使用的开源负载均衡器。

在迁移过程中，我们将从 Rancher v1.6 中导出这些服务，为每个 Rancher v1.6 环境和堆栈导出生成一个唯一的目录，并且输出两个文件到每个堆栈的目录中:

- `docker-compose.yml`

  包含堆栈中每个服务的标准 Docker 指令文件。我们将把这些文件转换为 Rancher v2.x 可以读取的 Kubernetes 清单。

- `rancher-compose.yml`

  用于 Rancher 特定功能的文件，例如运行健康检查和负载均衡器。Rancher v2.x 无法读取这些文件，因此不必担心它们的内容--我们正丢弃它们，然后使用 v2.x UI 重新创建。

## [下一步: 开始迁移](/docs/rancher2/v1.6-migration/get-started/_index)
