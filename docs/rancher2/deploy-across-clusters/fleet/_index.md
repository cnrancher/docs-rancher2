---
title: Fleet 介绍
description: Fleet 是轻量级的集群管理工具，您可以使用 Fleet 管理多达一百万个集群。Fleet 是一个独立于 Rancher 的项目，可以用 Helm 安装在任何 Kubernetes 集群上。Fleet 可以从 git 管理原始 Kubernetes YAML、Helm chart 或 Kustomize 或三者的任意组合的部署。无论来源如何，所有的资源都会被动态地转化为 Helm chart，并以 Helm 作为引擎，来实现部署集群中的一切。这给了一个高度的控制，一致性和可审计性。Fleet 不仅关注于扩展能力，还关注于给人高度的控制和可视性，以确切地了解集群上安装了什么。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 跨集群部署应用
  - Fleet
---

_适用于 Rancher v2.5+_

## 概述

Fleet 是轻量级的集群管理工具，您可以使用 Fleet 管理多达一百万个集群。对于[单个集群](https://fleet.rancher.io/single-cluster-install/)也很好用，但当你达到[大规模](https://fleet.rancher.io/multi-cluster-install/)时，它才真正发挥出它的威力。

Fleet 是一个独立于 Rancher 的项目，可以用 Helm 安装在任何 Kubernetes 集群上。Fleet 的架构如下图所示：

![架构](/img/rancher/fleet-architecture.png)

Fleet 可以从 git 管理原始 Kubernetes YAML、Helm chart 或 Kustomize 或三者的任意组合的部署。无论来源如何，所有的资源都会被动态地转化为 Helm chart，并以 Helm 作为引擎，来实现部署集群中的一切。这给了一个高度的控制，一致性和可审计性。Fleet 不仅关注于扩展能力，还关注于给人高度的控制和可视性，以确切地了解集群上安装了什么。

## 在 Rancher 用户界面中访问 Fleet

Rancher v2.5 中预装了 Fleet。要访问它，请进入 Rancher 用户界面中的**集群资源管理器**。在左上角的下拉菜单中，单击**集群资源管理器 > Fleet**在这个页面上，你可以编辑 Kubernetes 资源和由 Fleet 管理的集群组。

## GitHub 仓库

Fleet 的 Helm chart 可在[这里](https://github.com/rancher/fleet/releases/latest)查阅。

## 文档

Fleet 的文档请参考见[Fleet 文档](https://fleet.rancher.io/)。
