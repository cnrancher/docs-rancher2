---
title: HTTP代理安装
description: 在很多企业环境中，运行在企业内部的服务器或虚拟机不能直接访问互联网，但出于安全考虑，必须通过 HTTP(S)代理连接到外部服务。本教程将逐步介绍如何在这样的环境中设置高可用的 Rancher 安装。
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
  - 安装指南
  - 其他安装方法
  - HTTP代理安装
---

## 概述

在很多企业环境中，运行在企业内部的服务器或虚拟机不能直接访问互联网，但出于安全考虑，必须通过 HTTP(S)代理连接到外部服务。本教程将逐步介绍如何在这样的环境中设置高可用的 Rancher 安装。

另外，也可以在没有任何互联网访问的情况下，在完全离线的环境中安装并且使用 Rancher，详情请参考[离线安装指南](/docs/rancher2.5/installation/other-installation-methods/air-gap/_index)中有详细描述。

## 安装概要

1. [配置基础设施](/docs/rancher2.5/installation/other-installation-methods/behind-proxy/prepare-nodes/_index)
2. [设置 Kubernetes 集群](/docs/rancher2.5/installation/other-installation-methods/behind-proxy/launch-kubernetes/_index)
3. [安装 Rancher](/docs/rancher2.5/installation/other-installation-methods/behind-proxy/install-rancher/_index)