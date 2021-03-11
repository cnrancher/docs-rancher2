---
title: Kubernetes 介绍
description: Rancher v2.x 建立在[Kubernetes](https://kubernetes.io/docs/home/?path=users&persona=app-developer&level=foundational)上的容器调度编排。v2.x 底层技术与 v1.6 有很大的不同，后者支持了几种流行的容器编排工具。由于 Rancher v2.x 现在完全基于 Kubernetes，因此学习 Kubernetes 基础很有帮助。下表介绍并定义了一些关键的 Kubernetes 概念。
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
  - Kubernetes 介绍
---

Rancher v2.x 建立在[Kubernetes](https://kubernetes.io/docs/home/?path=users&persona=app-developer&level=foundational)上的容器调度编排。v2.x 底层技术与 v1.6 有很大的不同，后者支持了几种流行的容器编排工具。由于 Rancher v2.x 现在完全基于 Kubernetes，因此学习 Kubernetes 基础很有帮助。

下表介绍并定义了一些关键的 Kubernetes 概念。

| **概念**   | **定义**                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 集群       | 运行 Kubernetes 管理的容器化应用程序的机器的集合。                                                                                                           |
| 命名空间   | 一个虚拟集群，单个物理集群可以支持多个集群。                                                                                                                 |
| 节点       | 组成集群的物理机或虚拟机之一。                                                                                                                               |
| Pod        | 最小最简单的 Kubernetes 对象。一个 pod 代表一套正在您的集群上运行的[容器](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/#why-containers)。 |
| Deployment | 管理复制的应用程序的 API 对象。                                                                                                                              |
| 工作负载   | 工作负载是为 pods 各项设置部署规则的对象。                                                                                                                   |

## 迁移备忘录

由于 Rancher v1.6 默认为我们的的 Cattle 容器编排器，因此它主要使用与 Cattle 相关的术语。但是，由于 Rancher v2.x 使用 Kubernetes，因此符合 Kubernetes 命名标准。对于不熟悉 Kubernetes 的人来说，这种转变可能会令人困惑，因此我们创建了一个表，该表将 Rancher v1.6 中常用的术语映射到 Rancher v2.x 中的等效术语。

| **Rancher v1.6** | **Rancher v2.x**                      |
| ---------------- | ------------------------------------- |
| 容器             | Pod                                   |
| 服务             | 工作负载                              |
| 负载均衡         | Ingress                               |
| 堆栈             | 命名空间                              |
| 环境             | 项目 (管理) / 集群 (计算)             |
| 主机             | 节点                                  |
| 应用商店         | Helm                                  |
| 端口映射         | HostPort (单节点) / NodePort (多节点) |

有关 Kubernetes 概念的更多详细信息，请参见[Kubernetes 概念文档](https://kubernetes.io/docs/concepts/).

## [下一步: 开始使用](/docs/rancher2.5/v1.6-migration/get-started/_index)
