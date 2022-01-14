---
title: Helm 版本要求
weight: 3
---

本文介绍 Helm 的要求。Helm 是用于把 Rancher 安装在高可用 Kubernetes 集群上的工具。

> 我们已针对 Helm 3 更新了安装指南。如果你使用 Helm 2 进行安装，请参见 [Helm 2 迁移到 Helm 3 文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。[本文]({{<baseurl>}}/rancher/v2.0-v2.4/en/installation/resources/advanced/helm2/)提供了较早的使用 Helm 2 的Rancher 高可用安装指南的副本。如果你如果无法升级到 Helm 3，可以使用这个说明安装。

- 如需安装或升级 Rancher 2.5，请使用 Helm 3.2.x 或更高版本。
- Kubernetes 1.16 要求 Helm 2.16.0 或更高版本。如果使用的是默认 Kubernetes 版本，请参见[发行说明](https://github.com/rancher/rke/releases)获取所使用的 RKE 版本。
- 请不要使用 Helm 2.15.0，因为这个版本有转换/比较数字的问题。
- 请不要使用 Helm 2.12.0，因为该版本有 `cert-manager` 的兼容问题。
