---
title: 简介
description: 本文提供了使用 AWS EC2 自动缩放组在 Rancher 自定义集群上安装和使用Kubernetes cluster-autoscaler的操作指导。群集自动缩放器是一个工具，当集群满足以下条件之中的任意一条时，Rancher 会自动调整 Kubernetes 集群的大小：集群中存在因资源不足而无法运行的 pod，或集群中存在长时间未被充分利用的节点，其 pod 可以放在其他现有节点上。
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
  - 集群弹性伸缩
  - 简介
---

## 概述

本文提供了使用 AWS EC2 自动缩放组在 Rancher 自定义集群上安装和使用[Kubernetes cluster-autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/)的操作指导。

集群自动缩放器是一个工具，当集群满足以下条件之中的任意一条时，Rancher 会自动调整 Kubernetes 集群的大小

- 集群中存在因资源不足而无法运行的 pod。
- 集群中存在长时间未被充分利用的节点，其 pod 可以放在其他现有节点上。

为了防止 pod 被驱逐，您需要在 pod 规范上设置`priorityClassName: system-cluster-critical`属性。

Cluster Autoscaler 在 Kubernetes 主节点上运行。它可以运行在`kube-system`命名空间中。Cluster Autoscaler 不会缩减在其上运行非镜像`kube-system`pod 的节点。

您可以在 worker 节点上运行 Cluster Autoscaler 的定制部署，但需要格外小心，以确保 Cluster Autoscaler 保持运行。

## 支持此功能的云供应商

Cluster Autoscaler 提供对不同云提供商的支持。有关更多信息，请访问[cluster-autoscaler 支持的云提供商。](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)。

### 在 AWS 上设置集群 autoscaler

有关在 AWS 上运行集群弹性伸缩的详细操作指导，请参考[本页](/docs/cluster-admin/cluster-autoscaler/amazon/_index)。
