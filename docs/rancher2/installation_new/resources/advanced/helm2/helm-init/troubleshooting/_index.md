---
title: 问题排查
description: 大部分常见问题排查都将在这 3 个命名空间中的对象上进行。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - Helm初始化
  - 问题排查
---

## Helm 命令显示禁止

在集群中初始化 Helm 时，如果没有指定正确的 `ServiceAccount`，虽然`helm init` 命令会成功执行，可以初始化 Helm，但是当您执行大部分 `helm` 命令的时候，会显示如下错误信息：

```
Error: configmaps is forbidden: User "system:serviceaccount:kube-system:default" cannot list configmaps in the namespace "kube-system"
```

为了解决这个问题，需要卸载服务器组件(`tiller`)，您可以使用 `helm reset --force` 来删除集群中的 `tiller` 组件，然后使用 `helm version --server` 来检查该组件是否已经被删除，如果返回的结果和下方的代码示例相似，报错提示“could not find tiller”，则表示已经删除了 tiller 组件。

```
helm reset --force
Tiller (the Helm server-side component) has been uninstalled from your Kubernetes Cluster.
helm version --server
Error: could not find tiller
```

当您确认已经删除 `tiller` 后，请按照 [Helm 初始化(安装 Tiller)](/docs/rancher2/installation_new/options/helm2/helm-init/_index) 中提供的步骤，使用正确的 `ServiceAccount` 来安装 `tiller` 。
