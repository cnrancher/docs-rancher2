---
title: Worker 节点和通用组件故障排除
weight: 4
---

本文包括了运行在所有角色节点上的组件，因此适用于每个节点。

## 检查容器是否正在运行

具有 `worker` 角色的节点上启动了两个容器：

* kubelet
* kube-proxy

容器的状态应该是 `Up`。`Up` 后面显示的时间指的是容器运行的时间。

```
docker ps -a -f=name='kubelet|kube-proxy'
```

输出示例：
```
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS              PORTS               NAMES
158d0dcc33a5        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kube-proxy
a30717ecfb55        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kubelet
```

## 容器日志记录

容器的日志记录可能包含问题的信息。

```
docker logs kubelet
docker logs kube-proxy
```
