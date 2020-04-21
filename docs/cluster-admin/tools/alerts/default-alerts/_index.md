---
title: 内置集群告警
description: 创建集群时，Rancher 已经内置了一些告警规则。这些告警会通知您有关集群可能不正常的迹象。为它们配置接受者就可以收到这些告警。一些告警使用 Prometheus 表达式作为触发指标。表达式如何工作的详情，参考 Rancher Prometheus 表达式有关文档或者查询Prometheus 表达式文档。
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
  - 集群访问控制
  - 告警
  - 内置集群告警
---

创建集群时，Rancher 已经内置了一些告警规则。这些告警会通知您有关集群可能不正常的迹象。为它们配置[接受者](/docs/cluster-admin/tools/notifiers/_index)就可以收到这些告警。

一些告警使用 Prometheus 表达式作为触发指标。表达式如何工作的详情，参考 [Rancher Prometheus 表达式有关文档](/docs/cluster-admin/tools/monitoring/expression/_index)或者查询 [Prometheus 表达式文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)。

## etcd 告警

Etcd 是键值存储数据库，它存储了 Kubernetes 集群状态。Rancher 提供 Etcd 健康状态告警和表达式告警，健康状态告警不必启用监控即可接收这些告警。

leader 是处理所有需要集群达成共识的客户端请求的节点。详情参考[etcd 工作原理](https://rancher.com/blog/2019/2019-01-29-what-is-etcd/#how-does-etcd-work)。

集群的 leader 可以改变。leader 改变是正常的，但是改变太多可能表示网络出现问题或 CPU 负载过高。延迟较长时，默认的 etcd 配置可能会导致频繁的心跳超时，从而触发新的 leader 选举。

| 告警                                                                  | 说明                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------ |
| A high number of leader changes within the etcd cluster are happening | 当 leader 在一小时内更换三次以上时，将触发告警。       |
| Database usage close to the quota 500M                                | 当 etcd 的大小超过 500M 时，将触发告警。               |
| Etcd is unavailable                                                   | etcd 变得不可用时，将触发严重告警。                    |
| Etcd member has no leader                                             | 当 etcd 集群至少三分钟没有 leader 时，将触发严重告警。 |

## Kubernetes 系统组件告警

当核心 Kubernetes 系统组件变得不正常时，Rancher 会发出告警。

控制器根据 etcd 中的改变更新 Kubernetes 资源。[控制器](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)通过 Kubernetes API Server 监控集群期望状态，并对当前状态进行必要的更改以达到期望状态。

[调度器](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)服务是 Kubernetes 的核心组件。它负责根据各种配置，指标，资源需求和特定工作负载的需求，将集群工作负载调度到节点。

| 告警                              | 说明                                     |
| --------------------------------- | ---------------------------------------- |
| Controller Manager is unavailable | 当集群的控制器不可用时，将触发严重警告。 |
| Scheduler is unavailable          | 当集群的调度器不可用时，将触发严重警告。 |

## 事件告警

Kubernetes 事件是可以深入了解集群内部事件的对象，例如调度程序做出了哪些决定或为什么从节点上驱逐了某些 Pod。在 Rancher UI 中，从项目视图中，您可以查看每个工作负载的事件。

| 告警                         | 说明                                     |
| ---------------------------- | ---------------------------------------- |
| Get warning deployment event | 当部署中发生警告事件时，将触发警告告警。 |

## 节点告警

可以基于节点指标触发告警。Kubernetes 集群中的每个计算资源都称为一个节点。[节点](/docs/cluster-admin/_index)可以是物理机或虚拟机。

| 告警                                      | 说明                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| High CPU load                             | 如果节点在至少三分钟内使用了超过 100％的 CPU 时间，则会触发警告告警。                               |
| High node memory utilization              | 如果节点至少在三分钟内使用了其 80％以上的可用内存，则会触发警告告警。                               |
| Node disk is running full within 24 hours | 如果根据过去 6 个小时的磁盘增长情况，预期节点的磁盘空间在接下来的 24 小时内用完，则会触发严重告警。 |

## 项目级别告警

启用对项目的监视时，将提供一些项目级别的告警。有关详细信息，请参阅[项目级别告警](/docs/project-admin/tools/alerts/_index)。
