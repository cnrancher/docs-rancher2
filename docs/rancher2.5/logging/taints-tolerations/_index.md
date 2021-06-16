---
title: 关于污点和容忍度
description: 将一个 Kubernetes 节点标记为污点会导致 pods 排斥在该节点上运行。除非 pods 对该节点的污点有容忍度，否则它们会在集群中的其他节点上运行。
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
  - rancher 2.5
  - 日志服务
  - Rancher v2.5 的日志功能
  - 关于污点和容忍度
---

将一个 Kubernetes 节点标记为污点会导致 pods 排斥在该节点上运行。

除非 pods 对该节点的污点有容忍度，否则它们会在集群中的其他节点上运行。

[污点和容忍度](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)可以与`PodSpec`中的`nodeSelector`[字段](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)一起工作，它可以实现污点的相反效果。

使用 "nodeSelector "使 pod 对某些节点有亲和力。

两者都为 pod 运行的节点提供了选择。

## Rancher 的日志堆栈中的默认实现

### v2.5.8

默认情况下，Rancher 用`cattle.io/os=linux`玷污所有 Linux 节点，而不玷污 Windows 节点。
日志堆栈 pod 对这种污点有`toleration`，这使得它们能够在 Linux 节点上运行。
此外，大多数日志堆栈 pod 只在 Linux 上运行，并添加了一个`nodeSelector`以确保它们在 Linux 节点上运行。

### v2.5.0-2.5.7

默认情况下，Rancher 用`cattle.io/os=linux`玷污所有 Linux 节点，而不玷污 Windows 节点。
日志堆栈 pod 对这种污点有`toleration`，这使得它们能够在 Linux 节点上运行。
此外，我们可以填充 "nodeSelector"，以确保我们的 pods _只_ 运行在 Linux 节点上。

这个 Pod YAML 文件的例子显示了一个 nodeSelector 与一个 toleration 的使用。

```yaml
apiVersion: v1
kind: Pod
# metadata...
spec:
  # containers...
  tolerations:
    - key: cattle.io/os
      operator: "Equal"
      value: "linux"
      effect: NoSchedule
  nodeSelector:
    kubernetes.io/os: linux
```

在上面的例子中，我们确保我们的 pod 只在 Linux 节点上运行，我们为我们所有的 Linux 节点上的污点添加了一个`toleration`。

你可以用 Rancher 现有的污点，或者你自己的自定义污点做同样的事情。

## 为自定义污点添加 NodeSelector 设置和容忍度

如果你想添加自己的`nodeSelector`设置，或者你想为额外的污点添加`tolerations`，你可以向 chart 的数值传递以下内容。

```yaml
tolerations:
  # insert tolerations...
nodeSelector:
  # insert nodeSelector...
```

这些值将在`fluentd`、`fluentbit`和`logging-operator`容器中添加这两个设置。
从本质上讲，这些是对日志堆栈中所有 pod 的全局设置。

然而，如果你想只为`fluentbit`容器添加容忍度，你可以在图表的数值中添加以下内容。

```yaml
fluentbit_tolerations:
  # insert tolerations list for fluentbit containers only...
```
