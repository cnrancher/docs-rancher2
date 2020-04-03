---
title: Helm 版本要求
---

本节包含对 Helm 的版本要求。Helm 是用于在 Kubernetes 集群上安装 Rancher 高可用的工具。

> 我们已针对 Helm 3 更新了安装指南。有关从 Helm 2 开始的安装迁移，请参阅官方的[从 Helm 2 迁移到 Helm3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)文档，[本节](/docs/installation/options/helm2)提供了使用 Helm 2 的较早的 Rancher 高可用安装指南的副本，如果无法升级到 Helm 3，可以使用这个说明安装。

- Helm v2.16.0 或更高版本需要 Kubernetes v1.16 版本。对于默认的 Kubernetes 版本，请参考[发布说明](https://github.com/rancher/rke/releases)以获取所使用的 RKE 的版本。
- 不能使用 Helm v2.15.0，因为这个版本中有一些关于转换/比较数字的问题。
- 不能使用 Helm v2.12.0，因为这个版本和`cert-manager`一起使用时会有问题。
