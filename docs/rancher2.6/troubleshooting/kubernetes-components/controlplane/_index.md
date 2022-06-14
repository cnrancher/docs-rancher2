---
title: Control Plane 节点故障排除
weight: 2
---

本文适用于具有 `control plane` 角色的节点。

## 检查 Control Plane 容器是否正在运行

具有 `control plane` 角色的节点上启动了三个容器：

* `kube-apiserver`
* `kube-controller-manager`
* `kube-scheduler`

容器的状态应该是 **Up**。**Up** 后面显示的时间指的是容器运行的时间。

```
docker ps -a -f=name='kube-apiserver|kube-controller-manager|kube-scheduler'
```

输出示例：
```
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS              PORTS               NAMES
26c7159abbcc        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kube-apiserver
f3d287ca4549        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kube-scheduler
bdf3898b8063        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kube-controller-manager
```

## Control plane 容器日志记录

> **注意**：如果你添加了多个具有 `control plane` 角色的节点，`kube-controller-manager` 和 `kube-scheduler` 会通过 leader 选举来确定 leader。只有当前 leader 会记录执行的操作。有关检索当前的 leader 的更多信息，请参阅 [Kubernetes leader 选举]({{<baseurl>}}/rancher/v2.6/en/troubleshooting/kubernetes-resources/#kubernetes-leader-election)。

容器的日志记录可能包含问题的信息。

```
docker logs kube-apiserver
docker logs kube-controller-manager
docker logs kube-scheduler
```

## RKE2 Server 日志

如果 Rancher 配置的 RKE2 集群无法与 Rancher 通信，你可以在下游集群中的 Server 节点上运行此命令，从而获取 RKE2 Server 日志：

```
journalctl -u rke2-server -f
```
