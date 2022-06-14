---
title: Kubernetes 资源
weight: 101
---

本文列出的命令/步骤可用于检查最重要的 Kubernetes 资源，并应用于 [Rancher 启动的 Kubernetes]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/) 集群。

请确保你配置了正确的 kubeconfig（例如，为 Rancher HA 配置了 `export KUBECONFIG=$PWD/kube_config_cluster.yml`）或通过 UI 使用了嵌入式 kubectl。

- [节点](#nodes)
   - [获取节点](#get-nodes)
   - [获取节点状况](#get-node-conditions)
- [Kubernetes leader 选举](#kubernetes-leader-election)
   - [Kubernetes 控制器管理器 leader](#kubernetes-controller-manager-leader)
   - [Kubernetes 调度器 leader](#kubernetes-scheduler-leader)
- [Ingress Controller](#ingress-controller)
   - [Pod 详细信息](#pod-details)
   - [Pod 容器日志](#pod-container-logs)
   - [命名空间事件](#namespace-events)
   - [调试日志](#debug-logging)
   - [检查配置](#check-configuration)
- [Rancher Agent](#rancher-agents)
   - [cattle-node-agent](#cattle-node-agent)
   - [cattle-cluster-agent](#cattle-cluster-agent)
- [Job 和 Pod](#jobs-and-pods)
   - [检查 Pod 或 Job 的状态是否为 Running/Completed](#check-that-pods-or-jobs-have-status-running-completed)
   - [描述 Pod](#describe-pod)
   - [Pod 容器日志](#pod-container-logs)
   - [描述 Job](#describe-job)
   - [Job Pod 容器的日志](#logs-from-the-containers-of-pods-of-the-job)
   - [驱逐的 Pod](#evicted-pods)
   - [Job 未完成](#job-does-not-complete)

## 节点

### 获取节点

运行以下命令并检查以下内容：

- 集群中的所有节点都已列出，没有缺失的节点。
- 所有节点的状态都是 **Ready**（如果未处于 **Ready** 状态，请运行 `docker logs kubelet` 检查该节点上的 `kubelet` 容器日志)
- 检查所有节点是否报告了正确的版本。
- 检查 OS/Kernel/Docker 值是否按预期显示（此问题可能与升级 OS/Kernel/Docker 相关）。


```
kubectl get nodes -o wide
```

输出示例：

```
NAME             STATUS   ROLES          AGE   VERSION   INTERNAL-IP      EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
controlplane-0   Ready    controlplane   31m   v1.13.5   138.68.188.91    <none>        Ubuntu 18.04.2 LTS   4.15.0-47-generic   docker://18.9.5
etcd-0           Ready    etcd           31m   v1.13.5   138.68.180.33    <none>        Ubuntu 18.04.2 LTS   4.15.0-47-generic   docker://18.9.5
worker-0         Ready    worker         30m   v1.13.5   139.59.179.88    <none>        Ubuntu 18.04.2 LTS   4.15.0-47-generic   docker://18.9.5
```

### 获取节点状况

运行以下命令列出具有 [Node Conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition) 的节点：

```
kubectl get nodes -o go-template='{{range .items}}{{$node := .}}{{range .status.conditions}}{{$node.metadata.name}}{{": "}}{{.type}}{{":"}}{{.status}}{{"\n"}}{{end}}{{end}}'
```

运行以下命令，列出具有 active [Node Conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition) 的节点，这些节点可能阻止正常操作：

```
kubectl get nodes -o go-template='{{range .items}}{{$node := .}}{{range .status.conditions}}{{if ne .type "Ready"}}{{if eq .status "True"}}{{$node.metadata.name}}{{": "}}{{.type}}{{":"}}{{.status}}{{"\n"}}{{end}}{{else}}{{if ne .status "True"}}{{$node.metadata.name}}{{": "}}{{.type}}{{": "}}{{.status}}{{"\n"}}{{end}}{{end}}{{end}}{{end}}'
```

输出示例：

```
worker-0: DiskPressure:True
```

## Kubernetes leader 选举

### Kubernetes 控制器管理器 leader

Leader 由 Leader 选举确定。确定 Leader 后，Leader（`holderIdentity`）会保存在 `kube-controller-manager` 端点中（在本例中为 `controlplane-0`）。

```
kubectl -n kube-system get endpoints kube-controller-manager -o jsonpath='{.metadata.annotations.control-plane\.alpha\.kubernetes\.io/leader}'
{"holderIdentity":"controlplane-0_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","leaseDurationSeconds":15,"acquireTime":"2018-12-27T08:59:45Z","renewTime":"2018-12-27T09:44:57Z","leaderTransitions":0}>
```

### Kubernetes 调度器 Leader

Leader 由 Leader 选举确定。确定 Leader 后，Leader（`holderIdentity`）会保存在 `kube-scheduler` 端点中（在本例中为 `controlplane-0`）。

```
kubectl -n kube-system get endpoints kube-scheduler -o jsonpath='{.metadata.annotations.control-plane\.alpha\.kubernetes\.io/leader}'
{"holderIdentity":"controlplane-0_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","leaseDurationSeconds":15,"acquireTime":"2018-12-27T08:59:45Z","renewTime":"2018-12-27T09:44:57Z","leaderTransitions":0}>
```

## Ingress Controller

默认的 Ingress Controller 是 NGINX，作为 DaemonSet 部署在 `ingress-nginx` 命名空间中。Pod 仅会调度到具有 `worker` 角色的节点。

检查 pod 是否运行在所有节点上：

```
kubectl -n ingress-nginx get pods -o wide
```

输出示例：

```
kubectl -n ingress-nginx get pods -o wide
NAME                                    READY     STATUS    RESTARTS   AGE       IP               NODE
default-http-backend-797c5bc547-kwwlq   1/1       Running   0          17m       x.x.x.x          worker-1
nginx-ingress-controller-4qd64          1/1       Running   0          14m       x.x.x.x          worker-1
nginx-ingress-controller-8wxhm          1/1       Running   0          13m       x.x.x.x          worker-0
```

如果 pod 无法运行（即状态不是 **Running**，Ready 状态未显示 `1/1`，或者有大量 Restarts），请检查 pod 详细信息，日志和命名空间事件。

### Pod 详细信息

```
kubectl -n ingress-nginx describe pods -l app=ingress-nginx
```

### Pod 容器日志

```
kubectl -n ingress-nginx logs -l app=ingress-nginx
```

### 命名空间事件

```
kubectl -n ingress-nginx get events
```

### 调试日志

要启用调试日志：

```
kubectl -n ingress-nginx patch ds nginx-ingress-controller --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--v=5"}]'
```

### 检查配置

在每个 pod 中检索生成的配置：

```
kubectl -n ingress-nginx get pods -l app=ingress-nginx --no-headers -o custom-columns=.NAME:.metadata.name | while read pod; do kubectl -n ingress-nginx exec $pod -- cat /etc/nginx/nginx.conf; done
```

## Rancher Agent

Rancher Agent 用于实现与集群的通信（通过 `cattle-cluster-agent` 的 Kubernetes API）和与节点的通信（通过 `cattle-node-agent` 的集群配置）。

#### cattle-node-agent

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

检查 cattle-cluster-agent pod 是否存在于集群中，状态是否为 **Running**，并且重启次数不高：

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

## Job 和 Pod

### 检查 Pod 或 Job 的状态是否为 **Running**/**Completed**

运行以下命令进行检查：

```
kubectl get pods --all-namespaces
```

如果 Pod 的状态不是 **Running**，你可以通过运行命令来找到根本原因。

### 描述 Pod

```
kubectl describe pod POD_NAME -n NAMESPACE
```

### Pod 容器日志

```
kubectl logs POD_NAME -n NAMESPACE
```

如果 Job 的状态不是 **Completed**，你可以通过运行命令来找到根本原因。

### 描述 Job

```
kubectl describe job JOB_NAME -n NAMESPACE
```

### Job Pod 容器的日志

```
kubectl logs -l job-name=JOB_NAME -n NAMESPACE
```

### 驱逐的 Pod

可以根据 [eviction 信号](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#eviction-policy)来驱逐 Pod。

检索被驱逐的 Pod 列表（podname 和命名空间）：

```
kubectl get pods --all-namespaces -o go-template='{{range .items}}{{if eq .status.phase "Failed"}}{{if eq .status.reason "Evicted"}}{{.metadata.name}}{{" "}}{{.metadata.namespace}}{{"\n"}}{{end}}{{end}}{{end}}'
```

要删除所有被驱逐的 pod：

```
kubectl get pods --all-namespaces -o go-template='{{range .items}}{{if eq .status.phase "Failed"}}{{if eq .status.reason "Evicted"}}{{.metadata.name}}{{" "}}{{.metadata.namespace}}{{"\n"}}{{end}}{{end}}{{end}}' | while read epod enamespace; do kubectl -n $enamespace delete pod $epod; done
```

检索被驱逐的 pod 列表、调度节点以及原因：

```
kubectl get pods --all-namespaces -o go-template='{{range .items}}{{if eq .status.phase "Failed"}}{{if eq .status.reason "Evicted"}}{{.metadata.name}}{{" "}}{{.metadata.namespace}}{{"\n"}}{{end}}{{end}}{{end}}' | while read epod enamespace; do kubectl -n $enamespace get pod $epod -o=custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,MSG:.status.message; done
```

### Job 未完成

如果你启用了 Istio 而且你部署的 Job 未完成，你需要按照[这些步骤]({{<baseurl>}}/rancher/v2.6/en/istio/setup/enable-istio-in-namespace)将注释添加到 Pod 中。

由于 Istio Sidecars 会一直运行，因此即使任务完成了，也不能认为 Job 已完成。这是一个临时的解决方法，它禁止了 Istio 和添加了注释的 Pod 之间的通信。如果你使用了这个方法，由于这个 Job 无法访问服务网格，因此你将不能继续使用 Job 进行集成测试。