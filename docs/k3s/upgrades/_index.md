---
title: "升级介绍"
description: 本节介绍如何升级 K3s 集群。
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
  - 升级介绍
---

本节介绍如何升级 K3s 集群。

[基础升级](/docs/k3s/upgrades/basic/_index)描述了手动升级集群的几种技术。它也可以作为通过第三方基础设施即代码工具（如[Terraform](https://www.terraform.io/)）进行升级的基础。

[自动升级](/docs/k3s/upgrades/automated/_index)描述了如何使用 Rancher 的[system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)执行 Kubernetes 原生的自动升级。

> 实验性嵌入式 Dqlite 数据存储在 K3s v1.19.1 中被废弃。请注意，不支持从实验性 Dqlite 升级到实验性嵌入式 etcd。如果您尝试升级，将不会成功，数据将丢失。
