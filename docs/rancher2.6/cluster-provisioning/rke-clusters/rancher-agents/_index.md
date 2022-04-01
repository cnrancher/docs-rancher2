---
title: Rancher Agent
weight: 2400
---

Rancher 管理的集群上部署了两种不同的 Agent 资源：

- [cattle-cluster-agent](#cattle-cluster-agent)
- [cattle-node-agent](#cattle-node-agent)

有关 Rancher Server 如何配置集群并与集群通信的概述，请参阅[产品架构]({{<baseurl>}}/rancher/v2.6/en/overview/architecture/)。

### cattle-cluster-agent

`cattle-cluster-agent` 用于连接 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群的 Kubernetes API。`cattle-cluster-agent` 使用 Deployment 资源进行部署。

### cattle-node-agent

`cattle-node-agent` 用于在执行集群操作时与 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群中的节点进行交互。集群操作包括升级 Kubernetes 版本和创建/恢复 etcd 快照。`cattle-node-agent` 使用 DaemonSet 资源进行部署，以确保能在每个节点上运行。当 `cattle-cluster-agent` 不可用时，`cattle-node-agent` 可以作为备选方案，用来连接 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群的 Kubernetes API。

### 调度规则

`cattle-cluster-agent` 使用如下一组固定的容忍度（如果集群中没有可见的 controlplane 节点），或基于应用于 controlplane 节点的污点动态添加的容忍度。这种结构允许[基于污点进行驱逐](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)为 `cattle-cluster-agent` 正常工作。默认的容忍度如下。如果集群中存在 controlplane 节点，则容忍度将替换为与 controlplane 节点的污点匹配的容忍度。

| 组件                   | nodeAffinity nodeSelectorTerms        | nodeSelector | 容忍度                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cattle-cluster-agent` | `beta.kubernetes.io/os:NotIn:windows` | none         | **注意**：这些是默认容忍度，并将替换为与 controlplane 节点的污点匹配的容忍度。<br/><br/>`effect:NoSchedule`<br/>`key:node-role.kubernetes.io/controlplane`<br/>`value:true`<br/><br/>`effect:NoSchedule`<br/>`key:node-role.kubernetes.io/control-plane`<br/>`operator:Exists`<br/><br/>`effect:NoSchedule`<br/>`key:node-role.kubernetes.io/master`<br/>`operator:Exists` |
| `cattle-node-agent`    | `beta.kubernetes.io/os:NotIn:windows` | none         | `operator:Exists`                                                                                                                                                                                                                                                                                                                                                          |

`cattle-cluster-agent` Deployment 使用 `preferredDuringSchedulingIgnoredDuringExecution` 的首选调度规则，倾向于在具有 `controlplane` 节点的节点上进行调度。当集群中没有可见的 controlplane 节点时（通常是使用[提供商托管的 Kubernetes 的集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/)），你可以在节点上添加 `cattle.io/cluster-agent=true` 标签，从而优先将 `cattle-cluster-agent` pod 调度到该节点。

有关调度规则的更多信息，请参阅 [Kubernetes：将 Pod 分配给节点](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)。

`preferredDuringSchedulingIgnoredDuringExecution` 配置如下表所示：

| 权重 | 表达式                                            |
| ---- | ------------------------------------------------- |
| 100  | `node-role.kubernetes.io/controlplane:In:"true"`  |
| 100  | `node-role.kubernetes.io/control-plane:In:"true"` |
| 100  | `node-role.kubernetes.io/master:In:"true"`        |
| 1    | `cattle.io/cluster-agent:In:"true"`               |
