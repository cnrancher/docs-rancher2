---
title: "K3s - 轻量级 Kubernetes"
description: 轻量级Kubernetes。安装简单，内存只有一半，所有的二进制都不到100MB。
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
  - 产品介绍
---

轻量级 Kubernetes。安装简单，内存只有一半，所有的二进制都不到 100MB。

适用于：

- 边缘计算-Edge
- 物联网-IoT
- CI
- Development
- ARM
- 嵌入 K8s
- 不想深陷 k8s 运维管理的人

## 什么是 K3s?

K3s 是一个完全符合 Kubernetes 的发行版，有以下增强功能。

- 打包为单个二进制文件。
- 基于 sqlite3 的轻量级存储后端作为默认存储机制。 etcd3，MySQL，Postgres 仍然可用。
- 封装在简单的启动程序中，该启动程序处理很多复杂的 TLS 和选项。
- 默认情况下是安全的，对轻量级环境有合理的默认值。
- 添加了简单但功能强大的“batteries-included”功能，例如：本地存储提供程序，服务负载均衡器，Helm controller 和 Traefik ingress controller。
- 所有 Kubernetes 控制平面组件的操作都封装在单个二进制文件和进程中。这使 K3s 可以自动化和管理复杂的集群操作，例如分发证书。
- 外部依赖性已最小化（仅需要现代内核和 cgroup 挂载）。 K3s 软件包需要依赖项，包括：
  - containerd
  - Flannel
  - CoreDNS
  - CNI
  - 主机实用程序 (iptables, socat, etc)
  - Ingress controller (traefik)
  - 嵌入式 service loadbalancer
  - 嵌入式 network policy controller

## 为什么叫 K3s?

我们希望安装的 Kubernetes 在内存占用方面只是一半的大小。Kubernetes 是一个 10 个字母的单词，简写为 K8s。所以，有 Kubernetes 一半大的东西就是一个 5 个字母的单词，简写为 K3s。K3s 没有全称，也没有官方的发音。
