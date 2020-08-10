---
title: 常见问题
weight: 60
---

常见问题定期更新，旨在回答用户最常问到的关于K3s的问题。

### K3s是否适合替代k8s？

K3s几乎可以胜任k8s的所有工作, 它只是一个更轻量级的版本。有关更多详细信息，请参见[主要](/docs/k3s/_index)文档页面。

### 如何用自己的Ingress代替Traefik？

只需用`--disable traefik`启动K3s server，然后部署你需要的ingress。

### K3s是否支持Windows？

目前，K3s本身不支持Windows，但是我们对将来的想法持开放态度。

### 如何通过源码构建？

请参考K3s [BUILDING.md](https://github.com/rancher/k3s/blob/master/BUILDING.md)的说明。

### K3s的日志在哪里？

安装脚本会自动检测你的操作系统是systemd或openrc并启动服务。

当使用openrc运行时，日志将在`/var/log/k3s.log`中创建。

当使用systemd运行时，日志将在`/var/log/syslog`中创建，并使用`journalctl -u k3s`查看。