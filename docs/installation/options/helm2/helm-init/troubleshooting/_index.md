---
title: 问题排查
---

## Helm 命令显示禁止

在集群中初始化 Helm 时，没有指定正确的 `ServiceAccount`，`helm init` 命令会成功执行，但是您将无法执行大部分 `helm` 命令，会显示如下错误信息：

```
Error: configmaps is forbidden: User "system:serviceaccount:kube-system:default" cannot list configmaps in the namespace "kube-system"
```

为了解决这个问题，需要删除服务器组件(`tiller`)，并且添加正确的 `ServiceAccount`。您可以使用 `helm reset --force` 来删除集群中的 `tiller` 组件。请使用 `helm version --server` 来检查该组件是否已经被删除。

```
helm reset --force
Tiller (the Helm server-side component) has been uninstalled from your Kubernetes Cluster.
helm version --server
Error: could not find tiller
```

当您确认已经删除 `tiller` 后，请按照[初始化 Helm (安装 tiller)](/docs/installation/options/helm2/helm-init/_index) 中提供的步骤，使用正确的 `ServiceAccount` 来安装 `tiller` 。
