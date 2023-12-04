---
title: 应用市场
description: 在本节中，您将学习如何在 Rancher 中管理 Helm Chart 和应用程序。
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
  - rancher 2.5
  - Helm Charts
  - 应用市场
---

_适用于 Rancher v2.5+_

## 概述

在 Rancher v2.5 中，应用程序和市场功能（Apps and Marketplace）取代了 catalog system。

在集群管理器中，Rancher 使用 catalog system 导入捆绑的图表，然后使用这些图表来部署自定义的 Helm 应用程序或 Rancher 的工具，如监控或 Istio。在 Rancher v2.5 中，catalog system 在集群管理器中仍然可用，但它已被废弃。

现在在集群资源管理器中，Rancher 使用了一个类似但简化的相同系统版本。可以以与目录相同的方式添加存储库，但是是针对当前集群的。Rancher 工具作为预加载的存储库，作为独立的 Helm chart 部署。

## Charts

从左上角菜单中选择**应用市场**，进入 Chart 页面。

Chart 页面包含所有 Rancher、合作伙伴和自定义 Chart。

- Rancher 工具，如日志或监控，都包含在 Rancher 标签下。
- 合作伙伴 Chart 位于合作伙伴标签下
- 自定义 Chart 将显示在版本库的名称下。

这三种类型都是以相同的方式部署和管理的。

## Helm 仓库

从左侧边栏选择**Repositories**。

这些项目代表了 Helm 仓库，可以是传统的 Helm 端点，它有一个 `index.yaml`；也可以是 git 仓库，它将被克隆，克隆时可以指定分支名称。只需在这里添加你的版本库，它们就会在版本库名称下的 Charts 选项卡中显示出来。

## Helm 兼容性

Cluster Explorer 只支持 Helm 3 兼容的 Chart。

## 部署和升级

从 **chart** 选项卡中选择一个 chart 进行安装。chart 可能会通过自定义页面或 `question.yaml` 文件提供额外的配置，但所 chart 安装都可以修改 `values.yaml` 和其他基本设置。一旦单击安装，就会部署一个 helm operation ，并显示这个 job 的控制台。

要查看最近的所有更改，请转到**最近的操作**标签。从那里你可以查看最近发出的请求、状态、事件和日志。

安装 chart 后，您可以在**已安装的应用程序**选项卡中找到它。在这个部分，你可以升级、删除或安装应用程序，并查看进一步的细节。选择升级时，所呈现的形式和数值将与安装相同。

大多数 Rancher 工具都有额外的页面，位于**应用程序和市场**部分下方的工具栏中，以帮助管理和使用功能。这些页面包括到仪表盘的链接、轻松添加自定义资源的表单以及其他信息。

> 如果您使用 _"升级前自定义 Helm 选项"_ 升级 chart，请注意，如果您的 chart 具有不可变字段，则使用 _"--force"_ 选项可能会导致错误。这是因为 Kubernetes 中的某些对象一旦创建就无法更改。为确保您不会收到此错误，您可以：

- 使用默认的升级选项（即不要使用*"--force"*选项）。
- 卸载现有的 chart 并安装升级后的图表
- 在执行*"--force"*升级之前，从集群中删除带有不可变字段的资源。
