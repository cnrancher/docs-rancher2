---
title: "自动升级"
weight: 20
---

>**注意:** 此功能从[v1.17.4+k3s1](https://github.com/rancher/k3s/releases/tag/v1.17.4%2Bk3s1)开始提供支持。

## 概述

你可以使用Rancher的system-upgrad-controller来管理K3s集群升级。这是一种Kubernetes原生的集群升级方法。它利用[自定义资源定义(CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`计划`和[控制器](https://kubernetes.io/docs/concepts/architecture/controller/)，根据配置的计划安排升级。

计划定义了升级策略和要求。本文档将提供适合升级 K3s 集群的默认计划。有关更多高级计划配置选项，请查阅[CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go)。

控制器通过监控计划和选择要在其上运行升级[ job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的节点来调度升级。计划通过[标签选择器](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)定义哪些节点应该升级。当一个job成功运行完成后，控制器会给它运行的节点打上相应的标签。

>**注意:** 启动的升级job必须是高权限的。它的配置如下：
>
- 主机 `IPC`, `NET` 和 `PID` 命名空间
- `CAP_SYS_BOOT` 能力
- 挂载在`/host`的主机根目录，具有读写权限

关于 system-upgrade-controller 的设计和架构或其与K3s集成的更多细节，请参见以下Git仓库：

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/rancher/k3s-upgrade)

要以这种方式进行自动升级，你必须:

1. 将 system-upgrade-controller 安装到您的集群中
1. 配置计划


## 安装 system-upgrade-controller
System-upgrade-controller 可以作为deployment安装到您的集群中。Deployment需要一个service-account、clusterRoleBinding和一个configmap。要安装这些组件，请运行以下命令:
```
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/download/v0.4.0/system-upgrade-controller.yaml
```
控制器可以通过前面提到的configmap进行配置和定制，但控制器必须重新部署才能应用更改。


## 配置计划
建议您最少创建两个计划：升级server（master）节点的计划和升级agent（worker）节点的计划。根据需要，您可以创建其他计划来控制跨节点的滚动升级。以下两个示例计划将把您的集群升级到 K3s v1.17.4+k3s1。创建计划后，控制器将接收这些计划并开始升级您的集群。
```
# Server plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: server-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/master
      operator: In
      values:
      - "true"
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.17.4+k3s1
---
# Agent plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: agent-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/master
      operator: DoesNotExist
  prepare:
    args:
    - prepare
    - server-plan
    image: rancher/k3s-upgrade:v1.17.4-k3s1
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.17.4+k3s1
```
关于这些计划，有几个重要的事情需要提醒:

首先，必须在部署控制器的同一命名空间中创建计划。

其次，`concurrency`字段表示可以同时升级多少个节点。

第三，`server-plan`通过指定一个标签选择器来选择带有`node-role.kubernetes.io/master`标签的节点，从而锁定server节点。`agent-plan`通过指定一个标签选择器来选择没有该标签的节点，以agent节点为目标。

第四，`agent-plan`中的 `prepare` 步骤会使该计划等待`server-plan`完成后再执行升级jobs。

第五，两个计划的`version`字段都设置为v1.17.4+k3s1。或者，你可以省略 `version` 字段，将 `channel` 字段设置为解析到K3s版本的URL。这将导致控制器监控该URL，并在它解析到新版本时随时升级集群。这与 [release channels](/docs/k3s/upgrades/basic/_index#发布-channels) 配合得很好。因此，你可以用下面的channel配置你的计划，以确保你的集群总是自动升级到K3s的最新稳定版本。
```
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

如上所述，一旦控制器检测到计划已创建，升级就会立即开始。更新计划将使控制器重新评估计划并确定是否需要再次升级。

您可以通过 kubectl 查看plans和jobs来监控升级的进度:
```
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```

