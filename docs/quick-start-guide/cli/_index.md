---
title: 命令行工具
---

从您的工作站使用命令行工具（CLI）与 Rancher 交互。

## Rancher 命令行工具（Rancher CLI)

详情请参考[Rancher 命令行工具](../cli/_index)。请确保您可以成功运行 `rancher kubectl get pods` 命令。

## kubectl

请先安装`kubectl` ，详情请参考[install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/_index)。

通过 Rancher UI 访问您的集群，然后单击`Kubeconfig`，配置 kubectl，把内容复制粘贴到`~/.kube/config`文件内即可。

成功运行`kubectl cluster-info` 或 `kubectl get pods`命令。
