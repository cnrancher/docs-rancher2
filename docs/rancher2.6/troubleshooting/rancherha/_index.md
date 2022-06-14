---
title: Rancher HA
weight: 104
---

本文列出的命令/步骤可用于检查你的 Rancher Kubernetes 安装。

请确保你配置了正确的 kubeconfig（例如，`export KUBECONFIG=$PWD/kube_config_cluster.yml`）。

### 检查 Rancher Pod

Rancher pod 会部署为 `cattle-system` 命名空间中的一个 Deployment。

检查 pod 是否运行在所有节点上：

```
kubectl -n cattle-system get pods -l app=rancher -o wide
```

输出示例：

```
NAME                       READY   STATUS    RESTARTS   AGE   IP          NODE
rancher-7dbd7875f7-n6t5t   1/1     Running   0          8m    x.x.x.x     x.x.x.x
rancher-7dbd7875f7-qbj5k   1/1     Running   0          8m    x.x.x.x     x.x.x.x
rancher-7dbd7875f7-qw7wb   1/1     Running   0          8m    x.x.x.x     x.x.x.x
```

如果 pod 无法运行（即状态不是 **Running**，Ready 状态未显示 `1/1`，或者有大量 Restarts），请检查 pod 详细信息，日志和命名空间事件。

#### Pod 详细信息

```
kubectl -n cattle-system describe pods -l app=rancher
```

#### Pod 容器日志

```
kubectl -n cattle-system logs -l app=rancher
```

#### 命名空间事件

```
kubectl -n cattle-system get events
```

### 检查 Ingress

Ingress 应该具有正确的 `HOSTS`（显示配置的 FQDN）和 `ADDRESS`（将被路由到该主机地址）：

```
kubectl -n cattle-system get ingress
```

输出示例：

```
NAME      HOSTS                    ADDRESS                   PORTS     AGE
rancher   rancher.yourdomain.com   x.x.x.x,x.x.x.x,x.x.x.x   80, 443   2m
```

### 检查 Ingress Controller 日志

如果访问你配置的 Rancher FQDN 时没有显示 UI，请检查 Ingress Controller 日志以查看尝试访问 Rancher 时发生了什么：

```
kubectl -n ingress-nginx logs -l app=ingress-nginx
```

### Leader 选举

Leader 由 Leader 选举确定。确定 Leader 后，Leader（`holderIdentity`）会保存在 `cattle-controllers` ConfigMap 中（在本例中为 `rancher-7dbd7875f7-qbj5k`）。

```
kubectl -n kube-system get configmap cattle-controllers -o jsonpath='{.metadata.annotations.control-plane\.alpha\.kubernetes\.io/leader}'
{"holderIdentity":"rancher-7dbd7875f7-qbj5k","leaseDurationSeconds":45,"acquireTime":"2019-04-04T11:53:12Z","renewTime":"2019-04-04T12:24:08Z","leaderTransitions":0}
```

