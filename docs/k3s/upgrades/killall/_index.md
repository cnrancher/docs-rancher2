---
title: k3s-killall.sh 脚本
description: 本节介绍如何基础升级 K3s 集群。你可以通过使用安装脚本升级K3s，或者手动安装所需版本的二进制文件。
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
  - 基础升级
---

为了在升级期间实现高可用性，当 K3s 服务停止时，K3s 容器会继续运行。

要停止所有的 K3s 容器并重置容器的状态，可以使用`k3s-killall.sh`脚本。

killall 脚本清理容器、K3s 目录和网络组件，同时也删除了 iptables 链和所有相关规则。集群数据不会被删除。

要从 server 节点运行 killall 脚本，请运行：

```
/usr/local/bin/k3s-killall.sh
```
