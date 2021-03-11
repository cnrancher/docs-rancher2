---
title: Worker 节点和其他组件问题排查
description: 本节适用于每个节点，因为它包括在具有任何角色的节点上运行的组件。
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
  - Kubernetes组件
  - Worker 节点和其他组件问题排查
---

本节适用于每个节点，因为它包括在具有任何角色的节点上运行的组件。

## 检查容器是否正在运行

`worker`节点上应该运行以下两个容器：

- kubelet
- kube-proxy

这些容器的正常情况应该是 **Up** 状态。 并且 **Up** 状态应该是长时间运行，通过下面命令可以进行检查：

```
docker ps -a -f=name='kubelet|kube-proxy'
```

输出示例：

```
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS              PORTS               NAMES
158d0dcc33a5        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kube-proxy
a30717ecfb55        rancher/hyperkube:v1.11.5-rancher1   "/opt/rke-tools/en..."   3 hours ago         Up 3 hours                              kubelet
```

## 容器日志

通过下面命令查看容器日志信息可以查看到可能包含的错误信息：

```
docker logs kubelet
docker logs kube-proxy
```
