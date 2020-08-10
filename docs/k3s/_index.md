---
title: "K3s - 轻量级 Kubernetes"
shortTitle: K3s
name: "menu"
---

轻量级Kubernetes。安装简单，内存只有一半，所有的二进制都不到100MB。

适用于:

* 边缘计算-Edge
* 物联网-IoT
* CI
* Development
* ARM
* 嵌入K8s
* 不想深陷k8s运维管理的人

## 什么是K3s?

K3s是一个完全符合Kubernetes的发行版，有以下增强功能。

* 打包为单个二进制文件。
* 基于sqlite3的轻量级存储后端作为默认存储机制。 etcd3，MySQL，Postgres仍然可用。
* 封装在简单的启动程序中，该启动程序处理很多复杂的TLS和选项。
* 默认情况下是安全的，对轻量级环境有合理的默认值。
* 添加了简单但功能强大的“batteries-included”功能，例如：本地存储提供程序，服务负载均衡器，Helm controller和Traefik ingress controller。
* 所有Kubernetes控制平面组件的操作都封装在单个二进制文件和进程中。这使K3s可以自动化和管理复杂的集群操作，例如分发证书。
* 外部依赖性已最小化（仅需要现代内核和cgroup挂载）。 K3s软件包需要依赖项，包括：
    * containerd
    * Flannel
    * CoreDNS
    * CNI
    * 主机实用程序 (iptables, socat, etc)
    * Ingress controller (traefik)
    * 嵌入式 service loadbalancer
    * 嵌入式 network policy controller

## 为什么叫K3s?

我们希望安装的Kubernetes在内存占用方面只是一半的大小。Kubernetes是一个10个字母的单词，简写为K8s。所以，有Kubernetes一半大的东西就是一个5个字母的单词，简写为K3s。K3s没有全称，也没有官方的发音。