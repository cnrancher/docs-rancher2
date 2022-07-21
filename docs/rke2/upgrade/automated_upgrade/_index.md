---
title: 自动升级
description: 你可以使用 Rancher 的 system-upgrade-controller 来管理 rke2 集群的升级。这是一种 Kubernetes 原生的集群升级方法。它利用[自定义资源定义（CRD）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`计划` 和[控制器](https://kubernetes.io/docs/concepts/architecture/controller/)，根据配置的计划来安排升级。
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
  - RKE2
  - 自动升级
---

## 概述

你可以使用 Rancher 的 system-upgrade-controller 来管理 rke2 集群的升级。这是一种 Kubernetes 原生的集群升级方法。它利用[自定义资源定义（CRD）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`计划` 和[控制器](https://kubernetes.io/docs/concepts/architecture/controller/)，根据配置的计划来安排升级。

一个计划定义了升级策略和要求。本文档将提供适合升级 rke2 集群的默认计划。对于更高级的计划配置选项，请查阅[CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go)。

控制器通过监控计划和选择节点来运行升级[job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)来安排升级。一个计划通过一个[标签选择器](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)定义哪些节点应该被升级。当一个 job 成功运行完成后，控制器将对运行该 job 的节点进行相应的标记。

:::note 注意：
**启动的升级 job 必须具有高权限。它配置如下:**

- 主机`IPC`、`NET`和`PID`命名空间
- `CAP_SYS_BOOT`能力
- 主机根目录安装在`/host`，有读写权限
  :::

关于 system-upgrade-controller 的设计和架构或其与 rke2 集成的更多细节，请参见以下 Git 仓库。

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [rke2-upgrade](https://github.com/rancher/rke2-upgrade)

要以这种方式自动升级，你必须：

1. 在你的集群中安装 system-upgrade-controller
1. 配置计划

## 安装 system-upgrade-controller

system-upgrade-controller 可以通过 deployment 的方式安装到你的集群中。该 deployment 需要一个 service-account、clusterRoleBinding 和 configmap。要安装这些组件，请运行以下命令：

```
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/download/v0.9.1/system-upgrade-controller.yaml
```

可以通过前面提到的 configmap 来配置和自定义控制器，但必须重新部署控制器才能应用这些变化。

## 配置计划

建议你至少创建两个计划：一个用于升级 server(master/control-plane)节点的计划，一个用于升级 agent(worker)节点的计划。根据需要，你可以创建额外的计划来控制各节点的升级。下面的两个计划例子将把你的集群升级到 rke2 v1.23.1+rke2r2。一旦计划被创建，控制器将接收它们并开始升级你的集群。

```
# Server plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: server-plan
  namespace: system-upgrade
  labels:
    rke2-upgrade: server
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
       - {key: rke2-upgrade, operator: Exists}
       - {key: rke2-upgrade, operator: NotIn, values: ["disabled", "false"]}
       # When using k8s version 1.19 or older, swap control-plane with master
       - {key: node-role.kubernetes.io/control-plane, operator: In, values: ["true"]}
  serviceAccountName: system-upgrade
  tolerations:
  - key: CriticalAddonsOnly
    operator: Exists  
  cordon: true
#  drain:
#    force: true
  upgrade:
    image: rancher/rke2-upgrade
  version: v1.23.1-rke2r2
---
# Agent plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: agent-plan
  namespace: system-upgrade
  labels:
    rke2-upgrade: agent
spec:
  concurrency: 2
  nodeSelector:
    matchExpressions:
      - {key: rke2-upgrade, operator: Exists}
      - {key: rke2-upgrade, operator: NotIn, values: ["disabled", "false"]}
      # When using k8s version 1.19 or older, swap control-plane with master
      - {key: node-role.kubernetes.io/control-plane, operator: NotIn, values: ["true"]}
  prepare:
    args:
    - prepare
    - server-plan
    image: rancher/rke2-upgrade
  serviceAccountName: system-upgrade
  cordon: true
  drain:
    force: true
  upgrade:
    image: rancher/rke2-upgrade
  version: v1.23.1-rke2r2
```

关于这些计划，有几件重要的事情需要指出。

1. 计划必须在部署控制器的同一命名空间中创建。

2. `concurrency` 字段表明有多少节点可以同时被升级。

3. server-plan 通过指定一个标签选择器，选择具有 `node-role.kubernetes.io/control-plane` 标签的节点(`node-role.kubernetes.io/master` 适用于 1.19 或更早的版本)，来锁定 server 节点。agent-plan 通过指定一个标签选择器，选择没有这个标签的节点，来锁定 agent 节点。可以选择包括额外的标签，就像上面的例子，它要求存在标签 "rke2-upgrade"，并且不具有 "disabled" 或 "false" 的值。

4. agent 计划中的 `prepare` 步骤将导致该计划的升级作业在执行前等待 server 计划的完成。

5. 两个计划的 `version` 字段都设置为 v1.23.1+rke2r2。另外，你可以省略`version`字段，将`channel`字段设置为一个 URL，该 URL 可解析为 rke2 的一个版本。这将导致控制器监控该 URL，并在它解析到新版本时升级集群。这与[release channels](/docs/rke2/upgrade/basic_upgrade/_index/#release-channels)配合得很好。因此，你可以用以下 channels 配置你的计划，以确保你的集群总是自动升级到最新的 rke2 稳定版本。

```
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.rke2.io/v1-release/channels/stable

```

如前所述，一旦控制器检测到计划被创建，升级就会开始。更新计划将导致控制器重新评估计划，并决定是否需要再次升级。

你可以通过 kubectl 查看计划和 job 来监控升级的进度。

```
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```
