---
title: 导入集群
---

此页面上列出的命令/步骤可用于检查要导入的集群或在 Rancher 中导入的集群。

确保您配置了正确的 kubeconfig (例如，`export KUBECONFIG=$PWD/kubeconfig_from_imported_cluster.yml`)

## Rancher Agents

Rancher 通过 cluster-agent 与集群进行通信（通过`cattle-cluster-agent`调用 Kubernetes API 与集群通讯），并通过`cattle-node-agent`与节点进行通信。

如果 cattle-cluster-agent 无法连接到已有的 Rancher Server 也就是`server-url`，集群将保留在 **Pending** 状态，错误显示为 `Waiting for full cluster configuration`。

### cattle-node-agent

检查是否每个节点都正常运行了 cattle-node-agent，正确运行的状态应该是 **Running** 并且重启的次数应该不多。

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

检查特定节点上 cattle-node-agent 或者所有节点上 cattle-node-agent pods 的日志是否有错误：

```
kubectl -n cattle-system logs -l app=cattle-agent
```

### cattle-cluster-agent

检查集群中是否正确运行了 cattle-cluster-agent，正确运行的状态应该是 **Running** 并且重启的次数应该不多。

```
kubectl -n cattle-system get pods -l app=cattle-cluster-agent -o wide
```

输出示例：

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP           NODE
cattle-cluster-agent-54d7c6c54d-ht9h4   1/1       Running   0          2h        x.x.x.x      worker-1
```

检查 cattle-cluster-agent pod 的日志是否有错误：

```
kubectl -n cattle-system logs -l app=cattle-cluster-agent
```
