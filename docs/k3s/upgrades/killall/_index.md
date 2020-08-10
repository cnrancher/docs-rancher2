---
title: k3s-killall.sh 脚本
weight: 4
---

为了在升级期间实现高可用性，当K3s服务停止时，K3s容器会继续运行。

要停止所有的K3s容器并重置容器的状态，可以使用`k3s-killall.sh`脚本。

killall脚本清理容器、K3s目录和网络组件，同时也删除了iptables链和所有相关规则。集群数据不会被删除。

要从server节点运行 killall 脚本，请运行:

```
/usr/local/bin/k3s-killall.sh
```