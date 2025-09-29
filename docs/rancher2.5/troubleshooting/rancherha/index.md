---
title: Rancher 高可用
description: 此页面上列出的命令/步骤可用于检查 Rancher Kubernetes 的安装。确保您配置了正确的 kubeconfig(例如，`export KUBECONFIG=$PWD/kube_config_cluster.yml`) 或者通过 Rancher UI 使用内嵌的 kubectl。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 常见故障排查
  - Rancher 高可用
---

此页面上列出的命令/步骤可用于检查 Rancher Kubernetes 的安装。

确保您配置了正确的 kubeconfig(例如，`export KUBECONFIG=$PWD/kube_config_cluster.yml`) 或者通过 Rancher UI 使用内嵌的 kubectl。

## 检查 Rancher Pods

Rancher Server Pods 作为 Deployment 类型部署在 `cattle-system` 命名空间中。

检查 Pod 是否在所有节点上运行：

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

检查是否每个节点都正常运行了 cattle-node-agent，正确运行的状态应该是 **Running** 并且重启的次数应该不多，如果有任何问题。应该检查 Pod 的详细信息，日志和 namespaces 事件。

### 检查 Pod 详细信息

```
kubectl -n cattle-system describe pods -l app=rancher
```

### 检查 Pod 容器日志

```
kubectl -n cattle-system logs -l app=rancher
```

### 检查 Namespace 事件

```
kubectl -n cattle-system get events
```

## 检查 Ingress

Ingress 应具有正确的 `HOSTS`（显示已配置的 FQDN）和 `ADDRESS`（将被路由到的主机地址）。

```
kubectl -n cattle-system get ingress
```

输出示例：

```
NAME      HOSTS                    ADDRESS                   PORTS     AGE
rancher   rancher.yourdomain.com   x.x.x.x,x.x.x.x,x.x.x.x   80, 443   2m
```

## 检查 Ingress Controller 日志

访问已配置的 Rancher FQDN 时，如果没有显示 UI，请检查 Ingress 控制器日志以查看尝试访问 Rancher 时发生的情况：

```
kubectl -n ingress-nginx logs -l app=ingress-nginx
```

## Leader 选举

leader 选举由选举程序决定。在确定了 leader 节点之后，leader 状态(`holderIdentity`) 将会保存在 `cattle-controllers` ConfigMap 中 (在本示例中，leader Pod 是 `rancher-7dbd7875f7-qbj5k`).

```
kubectl -n kube-system get configmap cattle-controllers -o jsonpath='{.metadata.annotations.control-plane\.alpha\.kubernetes\.io/leader}'
{"holderIdentity":"rancher-7dbd7875f7-qbj5k","leaseDurationSeconds":45,"acquireTime":"2019-04-04T11:53:12Z","renewTime":"2019-04-04T12:24:08Z","leaderTransitions":0}
```
