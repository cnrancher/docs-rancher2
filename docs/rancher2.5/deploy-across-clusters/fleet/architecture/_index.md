---
title: 架构
description: Fleet 可以管理来自 git 的原始 Kubernetes YAML、Helm chart、Kustomize 或三者的任何组合的部署。无论来源如何，所有的资源都被动态地转化为 Helm chart，Helm 被用作引擎来将所有资源部署到集群中。这给了你高度的控制、一致性和可审计性。Fleet 不仅注重扩展能力，而且让人对集群上安装的东西有高度的控制和可见性。
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
  - 跨集群部署应用
  - Fleet
  - 架构
---

Fleet 可以管理来自 git 的原始 Kubernetes YAML、Helm chart、Kustomize 或三者的任何组合的部署。无论来源如何，所有的资源都被动态地转化为 Helm chart，Helm 被用作引擎来将所有资源部署到集群中。这给了你高度的控制、一致性和可审计性。Fleet 不仅注重扩展能力，而且让人对集群上安装的东西有高度的控制和可见性。

![Architecture](/img/rancher/fleet-architecture.svg)
