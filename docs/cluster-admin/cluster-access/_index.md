---
title: 访问集群
description: 您可以通过多种方式与由 Rancher 管理的 Kubernetes 集群进行交互，例如，Rancher UI、kubectl、Rancher kubectl shell、终端远程连接、Rancher CLI、Rancher API等。
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
  - 集群管理员指南
  - 集群访问控制
  - 访问集群
---

您可以通过多种方式与由 Rancher 管理的 Kubernetes 集群进行交互：

## Rancher UI

Rancher 为与集群交互提供了直观的用户界面。UI 中所有可用的选项都调用 Rancher API。因此，在 UI 中任何可行的操作在 Rancher CLI 或 Rancher API 中也是可行的。

## kubectl

您可以使用 Kubernetes 命令行工具[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)来管理您的集群，使用 kubectl 有两种选择：

### Rancher kubectl Shell

通过启动 Rancher UI 中可用的 kubectl Shell 与集群进行交互。此选项不需要您进行任何配置操作。

有关更多信息，请参见 [使用 kubectl Shell 访问集群](/docs/cluster-admin/cluster-access/kubectl/_index).

### 终端远程连接

您还可以通过在本地桌面安装 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 来与集群进行交互，然后将集群的 kubeconfig 文件复制到本地 `~/.kube/config` 目录中。

有关更多信息，请参见[使用 kubectl 和 kubeconfig 文件访问集群](/docs/cluster-admin/cluster-access/kubectl/_index)。

## Rancher CLI

您可以使用 Rancher CLI 控制集群，[Rancher CLI](/docs/cli/_index)。 这个 CLI 工具可以直接与不同的集群和项目交互，或者向它们传递 `kubectl` 命令。

## Rancher API

您可以通过 Rancher API 与集群进行交互。在使用 API 之前，您必须获得一个 [API Key](/docs/user-settings/api-keys/_index)，要查看 API 对象的不同资源字段和操作，请打开 API UI，可以通过单击 **View in API** 来访问任何 Rancher UI 对象
