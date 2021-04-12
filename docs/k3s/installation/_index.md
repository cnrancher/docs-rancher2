---
title: "安装介绍"
description: Helm 是 Kubernetes 的首选包管理工具。Helm Chart为 Kubernetes YAML 清单文件提供了模板化语法。通过 Helm，我们可以创建可配置的部署，而不仅仅是使用静态文件。
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
  - 安装介绍
---

本节包含了在各种环境下安装 K3s 的说明，请在开始安装 K3s 之前，确保满足[安装要求](/docs/k3s/installation/installation-requirements/_index)

[安装和配置选项](/docs/k3s/installation/install-options/_index) 提供了安装 K3s 时可用选项的指导。

[外部数据库的高可用](/docs/k3s/installation/ha/_index)详细介绍了如何设置一个由外部数据存储（如 MySQL、PostgreSQL 或 etcd）支持的 K3s HA 集群。

[嵌入式 DB 的高可用](/docs/k3s/installation/ha-embedded/_index)详细介绍了如何建立一个利用内置分布式数据库的 K3s HA 集群。

[离线安装](/docs/k3s/installation/airgap/_index) 详细介绍了如何在不能直接接入互联网的环境中设置 K3s。
[禁用组件标志](docs/k3s/installation/disable-flags/_index) 详细介绍了如何在 K3s 上单独设置 etcd 节点和 controlplane 节点。

## 卸载 K3s

如果你使用`install.sh`脚本安装了 K3s，那么在安装过程中会生成一个卸载脚本。该脚本在您的节点上的`/usr/local/bin/k3s-uninstall.sh`上创建（或者是`k3s-agent-uninstall.sh`）。
