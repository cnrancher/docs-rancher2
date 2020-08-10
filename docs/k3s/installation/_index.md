---
title: "安装介绍"
weight: 20
---

本节包含了在各种环境下安装K3s的说明，请在开始安装K3s之前，确保满足[安装要求](/docs/k3s/installation/installation-requirements/_index)

[安装和配置选项](/docs/k3s/installation/install-options/_index) 提供了安装K3s时可用选项的指导。

[外部数据库的高可用](/docs/k3s/installation/ha/_index)详细介绍了如何设置一个由外部数据存储（如MySQL、PostgreSQL或etcd）支持的K3s HA集群。

[嵌入式DB的高可用（实验）](/docs/k3s/installation/ha-embedded/_index)详细介绍了如何建立一个利用内置分布式数据库的K3s HA集群。

[离线安装](/docs/k3s/installation/airgap/_index) 详细介绍了如何在不能直接接入互联网的环境中设置K3s。

## 卸载K3s

如果你使用`install.sh`脚本安装了K3s，那么在安装过程中会生成一个卸载脚本。该脚本在您的节点上的`/usr/local/bin/k3s-uninstall.sh`上创建（或者是`k3s-agent-uninstall.sh`）。
