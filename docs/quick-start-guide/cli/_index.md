---
title: 命令行工具
---

从您的电脑使用命令行工具（CLI）与 Rancher 交互。

## Rancher CLI

Rancher CLI(命令行界面)是一个命令行工具，可用于与 Rancher 进行交互。使用此工具，您可以用命令行而不是 GUI 来操作 Rancher，详情请参考 [Rancher 命令行工具](/docs/cli/_index)。

请确保您可以成功运行 `rancher kubectl get pods` 命令。

## kubectl

请先安装`kubectl`，详情请参考[安装 kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl)。

通过 Rancher UI 访问您的集群，然后单击集群仪表盘页面右上角的`Kubeconfig 文件`，配置 kubectl，把内容复制粘贴到`~/.kube/config`文件内即可。

检查是否可以成功运行`kubectl cluster-info` 或 `kubectl get pods`命令。
