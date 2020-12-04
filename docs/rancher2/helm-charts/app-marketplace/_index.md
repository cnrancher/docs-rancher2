---
title: 应用市场
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

## 概述

_适用于 Rancher v2.5+_

在本节中，您将学习如何在 Rancher 中管理 Helm 图表库和应用程序。

在集群管理器中，Rancher 使用目录系统导入应用，然后使用这些 chart 部署自定义的 helm chart 应用程序或 Rancher 的工具，如监控或 Istio。现在，在群集资源管理器中，Rancher 使用了类似但简化版的同一系统。Repositories 可以以与目录相同的方式添加，但具体到当前集群。Rancher 工具作为预加载的存储库，作为独立的 helm chart 进行部署。

## Charts

从左上角菜单中选择**应用市场**，进入图表页面。

图表页面包含所有 Rancher、合作伙伴和自定义 Chart。

- Rancher 工具，如日志或监控，都包含在 Rancher 标签下。
- 合作伙伴图表位于合作伙伴标签下
- 自定义图表将显示在版本库的名称下。

这三种类型都是以相同的方式部署和管理的。

## helm 仓库

从左侧边栏选择**Repositories**。

这些项目代表了 helm 仓库，可以是传统的 helm 端点，它有一个 index.yaml；也可以是 git 仓库，它将被克隆，克隆时可以指定分支名称。只需在这里添加你的版本库，它们就会在版本库名称下的 Charts 选项卡中显示出来。

## Helm 兼容性

Cluster Explorer 只支持 Helm 3 兼容的图表。

## 部署和升级

从**图表**选项卡中选择一个 chart 进行安装。chart 可能会通过自定义页面或 question.yaml 文件提供额外的配置，但所 chart 安装都可以修改 values.yaml 和其他基本设置。一旦点击安装，就会部署一个 helm operation ，并显示这个 job 的控制台。

要查看最近的所有更改，请转到**最近的操作**标签。从那里你可以查看最近发出的请求、状态、事件和日志。

安装 chart 后，您可以在**已安装的应用程序**选项卡中找到它。在这个部分，你可以升级、删除或安装应用程序，并查看进一步的细节。选择升级时，所呈现的形式和数值将与安装相同。

大多数 Rancher 工具都有额外的页面，位于**应用程序和市场**部分下方的工具栏中，以帮助管理和使用功能。这些页面包括到仪表盘的链接、轻松添加自定义资源的表单以及其他信息。
