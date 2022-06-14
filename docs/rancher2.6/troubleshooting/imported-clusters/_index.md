---
title: 注册集群
weight: 105
---

本文列出的命令/步骤可用于检查你正在注册或已在 Rancher 中注册的集群。

请确保你配置了正确的 kubeconfig（例如，`export KUBECONFIG=$PWD/kubeconfig_from_imported_cluster.yml`）。

### Rancher Agent

Rancher Agent 用于实现与集群的通信（通过 cattle-cluster-agent 的 Kubernetes API）和与节点的通信。

如果 cattle-cluster-agent 无法连接到配置的 `server-url`，集群将保持在 **Pending** 状态并显示 `Waiting for full cluster configuration`。

#### cattle-node-agent

> 注意：cattle-node-agents 只会在使用 RKE 在 Rancher 创建的集群中显示。

检查每个节点上是否存在 cattle-node-agent pod，状态是否为 **Running**，并且重启次数不多：

```
kubectl -n cattle-system get pods -l app=cattle-agent -o wide
```

输出示例：

```
NAME                      READY     STATUS    RESTARTS   AGE       IP                NODE
cattle-node-agent-4gc2p   1/1       Running   0          2h        x.x.x.x           worker-1
cattle-node-agent-8cxkk   1/1       Running   0          2h        x.x.x.x           etcd-1
cattle-node-agent-kzrlg   1/1       Running   0          2h        x.x.x.x           etcd-0
cattle-node-agent-nclz9   1/1       Running   0          2h        x.x.x.x           controlplane-0
cattle-node-agent-pwxp7   1/1       Running   0          2h        x.x.x.x           worker-0
cattle-node-agent-t5484   1/1       Running   0          2h        x.x.x.x           controlplane-1
cattle-node-agent-t8mtz   1/1       Running   0          2h        x.x.x.x           etcd-2
```

检查特定或所有 cattle-node-agent pod 的日志记录：

```
kubectl -n cattle-system logs -l app=cattle-agent
```

#### cattle-cluster-agent

检查 cattle-cluster-agent pod 是否存在于集群中，状态是否为 **Running**，并且重启次数不多：

```
kubectl -n cattle-system get pods -l app=cattle-cluster-agent -o wide
```

输出示例：

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP           NODE
cattle-cluster-agent-54d7c6c54d-ht9h4   1/1       Running   0          2h        x.x.x.x      worker-1
```

检查 cattle-cluster-agent pod 的日志记录：

```
kubectl -n cattle-system logs -l app=cattle-cluster-agent
```
