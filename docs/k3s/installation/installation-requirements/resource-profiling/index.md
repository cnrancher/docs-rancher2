---
title: K3s资源分析
description: K3s 非常轻巧，但有一些最低要求，如下所述。无论您是将 K3s 集群配置为在 Docker 还是 Kubernetes 设置中运行，运行 K3s 的每个节点都应该满足以下最低要求。你可能需要更多的资源来满足你的需求。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - K3s资源分析
---

本节介绍了为确定 K3s 的最低资源需求，而进行的测试结果。

结果概述如下：

| 组件                       | 处理器                                        | 最小 CPU      | Kine/SQLite 的最小内存 | 嵌入式 ETCD 的最小内存 |
| -------------------------- | --------------------------------------------- | ------------- | ---------------------- | ---------------------- |
| 具有工作负载的 K3s server  | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz | 10% of a core | 768 M                  | 896 M                  |
| 具有单个 agent 的 K3s 集群 | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz | 10% of a core | 512 M                  | 768 M                  |
| K3s agent                  | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz | 5% of a core  | 256 M                  | 256 M                  |
| 具有工作负载的 K3s server  | Pi4B BCM2711, 1.50 GHz                        | 20% of a core | 768 M                  | 896 M                  |
| 具有单个 agent 的 K3s 集群 | Pi4B BCM2711, 1.50 GHz                        | 20% of a core | 512 M                  | 768 M                  |
| K3s agent                  | Pi4B BCM2711, 1.50 GHz                        | 10% of a core | 256 M                  | 256 M                  |

- [资源测试的范围](#资源测试的范围)
- [基准测试包含的组件](#基准测试包含的组件)
- [方法](#方法)
- [环境](#环境)
- [基准资源需求](#基准资源需求)
  - [具有工作负载的 K3s server](#具有工作负载的-k3s-server)
  - [具有单个 agent 的 K3s 集群](#具有单个-agent-的-k3s-集群)
  - [K3s Agent](#k3s-agent)
- [分析](#分析)
  - [影响资源利用率的因素](#影响资源利用率的因素)
  - [防止 agent 和工作负载干扰集群数据存储](#防止-agent-和工作负载干扰集群数据存储)

## 资源测试的范围

资源测试的目的是为了解决以下问题：

- 在单节点集群上，确定运行整个 K3s server 堆栈所应预留的 CPU、内存和 IOPs 的合法最小值，假设真正的工作负载将部署在集群上。
- 在 agent（worker）节点上，确定应该为 Kubernetes 和 K3s 控制平面组件（kubelet 和 k3s agent）预留的 CPU、内存和 IOPs 的合法最小值。

## 基准测试包含的组件

测试的组件有：

- 已启用所有打包组件的 K3s 1.19.2
- Prometheus + Grafana 监控堆栈
- Kubernetes PHP Guestbook 应用示例

这些是一个稳定系统的基准数据，只使用 K3s 打包的组件（Traefik Ingress，Klipper lb，local-path 存储），运行一个标准的监控栈（Prometheus 和 Grafana）和 Guestbook 示例应用程序。

包括 IOPS 在内的资源仅适用于 Kubernetes 数据存储和控制平面，不包括系统级管理 agent 或日志记录、容器镜像管理或任何特定工作负载要求的开销。

## 方法

使用独立的 Prometheus v2.21.0 实例，通过 apt 安装的`prometheus-node-exporter`来收集主机 CPU、内存和磁盘 IO 统计数据。

`systemd-cgtop`用于抽查 systemd cgroup 级别的 CPU 和内存利用率。`system.slice/k3s.service`跟踪 K3s 和 containerd 的资源利用率情况，而单个 pod 则在`kubepods`层次结构下。

使用集成到 server 和 agent 进程中的 kubelet exporter，从 `process_resident_memory_bytes`和 `go_memstats_alloc_bytes` 指标中收集了额外的详细 K3s 内存利用率数据。

## 环境

OS: Ubuntu 20.04 x86_64, aarch64

硬件:

- AWS c5d.xlarge - 4 core, 8 GB RAM, NVME SSD
- Raspberry Pi 4 Model B - 4 core, 8 GB RAM, Class 10 SDHC

## 基准资源需求

本节捕获了确定 K3s agent、带工作负载的 K3s server 和带一个 agent 的 K3s server 的最低资源需求的测试结果。

### 具有工作负载的 K3s server

这些是对单节点集群的要求，其中 K3s server 与工作负载共享资源。

对 CPU 的要求是：

| 所需资源      | 测试处理器                                         |
| ------------- | -------------------------------------------------- |
| 10% of a core | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz      |
| 20% of a core | Low-power processor such as Pi4B BCM2711, 1.50 GHz |

IOPS 和内存的要求是：

| 测试数据存储  | IOPS | KiB/sec | 延时    | RAM   |
| ------------- | ---- | ------- | ------- | ----- |
| Kine/SQLite   | 10   | 500     | < 10 ms | 768 M |
| Embedded etcd | 50   | 250     | < 5 ms  | 896 M |

### 具有单个 agent 的 K3s 集群

这些是 K3s 集群的基本要求，它有一个 K3s server 节点和一个 K3s agent，但没有工作负载。

对 CPU 的要求是：

| 所需资源      | 测试处理器                                    |
| ------------- | --------------------------------------------- |
| 10% of a core | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz |
| 20% of a core | Pi4B BCM2711, 1.50 GHz                        |

IOPS 和内存的要求是：

| 测试数据存储  | IOPS | KiB/sec | 延时    | RAM   |
| ------------- | ---- | ------- | ------- | ----- |
| Kine/SQLite   | 10   | 500     | < 10 ms | 512 M |
| Embedded etcd | 50   | 250     | < 5 ms  | 768 M |

### K3s Agent

对 CPU 的要求是：

| 所需资源      | 测试处理器                                    |
| ------------- | --------------------------------------------- |
| 5% of a core  | Intel(R) Xeon(R) Platinum 8124M CPU, 3.00 GHz |
| 10% of a core | Pi4B BCM2711, 1.50 GHz                        |

需要 256M 的内存。

## 分析

本节介绍了对 K3s server 和 agent 利用率产生最大影响的因素，以及如何保护集群数据存储免受 agent 和工作负载的干扰。

### 影响资源利用率的因素

K3s server 的利用率数据主要是由支持 Kubernetes 数据存储（kine 或 etcd）、API Server、Controller-Manager 和 Scheduler 控制，以及实现系统状态变化所需的任何管理任务所驱动。给 Kubernetes 控制平面带来额外负载的操作，如创建/修改/删除资源，将导致暂时的利用率上升。使用大量使用 Kubernetes 数据存储的 operators 或应用程序（如 Rancher 或其他 operators 类型的应用程序）将增加 server 的资源需求。通过添加额外的节点或创建许多集群资源来扩展集群，将增加 server 的资源需求。

K3s agent 的利用率数据主要是由支持容器生命周期管理控制驱动的。涉及管理镜像、提供存储或创建/销毁容器的操作将导致利用率的暂时上升。拉取镜像通常会影响 CPU 和 IO，因为它们涉及将镜像内容解压到磁盘。如果可能的话，工作负载存储(pod 临时存储和卷)应该与 agent 组件(/var/lib/rancher/k3s/agent)隔离，以确保不会出现资源冲突。

### 防止 agent 和工作负载干扰集群数据存储

在 server 节点运行工作负载 pod 时，应确保 agent 和工作负载 IOPS 不干扰数据存储。

最好的办法是将 server 组件（/var/lib/rancher/k3s/server）与 agent 组件（/var/lib/rancher/k3s/agent）放在不同的存储介质上，后者包括 containerd 镜像存储。

工作负载存储（pod 临时存储和卷）也应该与数据存储隔离。

如果不能满足数据存储的吞吐量和延迟要求，可能会导致控制平面的延迟响应或控制平面无法维持系统状态。
