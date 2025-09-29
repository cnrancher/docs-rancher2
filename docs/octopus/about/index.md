---
title: 关于 Octopus
description: Octopus 是基于Kubernetes或k3s的开源和云原生的设备管理系统，它非常轻巧，也不需要替换 Kubernetes 集群的任何基础组件。 部署了 Octopus，集群可以将边缘设备作为自定义 k8s 资源进行管理。
keywords:
  - Octopus中文文档
  - Octopus 中文文档
  - 边缘计算
  - IOT
  - edge computing
  - Octopus中文
  - Octopus 中文
  - Octopus
  - Octopus教程
  - Octopus中国
  - rancher
  - Octopus 中文教程
  - 关于 Octopus
---

## Octopus 简介

Octopus 是基于 Kubernetes 或[k3s](/docs/k3s/)的开源和云原生的设备管理系统，它非常轻巧，也不需要替换 Kubernetes 集群的任何基础组件。 部署了 Octopus，集群可以将边缘设备作为自定义 k8s 资源进行管理。

## 核心概念

如同八爪鱼一样，Octopus 由大脑（Brain）和触角（Limbs）组成。 大脑只需部署一个领导者，或在 HA 模式下自动选择一个领导者，它只要负责处理相对集中的信息，例如验证节点是否存在以及设备模型（类型）是否存在。
而 Limbs 则需要部署在可以连接设备的各个边缘节点上，它们通过协议适配器（Adaptors）与实际设备通信。 因此，Octopus 是通过一种 DeviceLink 的 YAML 文件（k8s 资源对象）配置和管理设备。

## 基于 k3s 集群的架构图

![Architecture](/img/octopus/architecture.png)
