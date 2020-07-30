---
title: 添加或删除节点
---

## 添加或删除节点

RKE 支持为 worker 和 controlplane 主机添加或删除[节点](/docs/rke/config-options/nodes/_index)。

您可以通过修改`cluster.yml`文件的内容，添加额外的节点，并指定它们在 Kubernetes 集群中的角色；或从`cluster.yml`中的节点列表中删除节点信息，以达到删除节点的目的。

## 添加或删除 worker 节点。

通过运行`rke up --update-only`，您可以运行`rke up --update-only`命令，只添加或删除工作节点。这将会忽略除了`cluster.yml`中的工作节点以外的其他内容。

:::note 注意
使用`--update-only`添加或删除 worker 节点时，可能会触发[插件](/docs/rke/config-options/add-ons/_index)或其他组件的重新部署或更新。
:::

## 移除节点中的 Kubernetes 组件

您可以使用`rke remove`命令从节点中移除 Kubernetes 组件。

:::warning 警告
这个命令是**不可逆**的，这个命令会毁坏 Kubernetes 集群，包括 S3 上的 etcd 集群快照。如果发生灾难，将无法访问您的集群，请参考[从快照恢复集群](/docs/rke/etcd-snapshots/_index)的流程。
:::

- `rke remove`命令会删除`cluster.yml`中的每个节点上面的 Kubernetes 组件，包括：

  - `etcd`
  - `kube-apiserver`
  - `kube-controller-manager`
  - `kubelet`
  - `kube-proxy`
  - `nginx-proxy`

- `rke remove`命令会删除集群的 etcd 快照，包括：
  - 本地快照
  - 存储在 S3 上的快照

> **注意：** `rke remove`命令不会从节点上删除 Pods。如果节点被重复使用，那么在创建新的 Kubernetes 集群时，将自动删除 pod。

- `rke remove`命令会从服务留下的目录中清理每个主机。
  - /etc/kubernetes/ssl
  - /var/lib/etcd
  - /etc/cni
  - /opt/cni
  - /var/run/calico
