---
title: 处理污点和容忍度
weight: 6
---

在 Kubernetes 节点上添加污点会导致 pod 排斥在该节点上运行。

除非 pod 对该节点的污点具有`容忍度`（toleration），否则 Pod 将在集群中的其他节点上运行。

[污点和容忍度](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)可以与 `PodSpec` 中的 `nodeSelector` [字段](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)一起使用，从而实现*相反的*污点效果。

`nodeSelector` 可以使 pod 被吸引到某类节点。

两者都能让 pod 选择在哪个节点上运行。

- [Rancher Logging 堆栈中的默认实现](#default-implementation-in-rancher-s-logging-stack)
- [为自定义污点添加 NodeSelector 设置和容忍度](#adding-nodeselector-settings-and-tolerations-for-custom-taints)


### Rancher 日志堆栈中的默认实现

默认情况下，Rancher 使用 `cattle.io/os=linux` 来将污点应用到所有 Linux 节点，而不影响 Windows 节点。
日志堆栈 pod 具有针对此污点的`容忍度`，因此它们能够运行在 Linux 节点上。
此外，大多数日志堆栈 pod 仅在 Linux 上运行，并添加了 `nodeSelector` 以确保它们在 Linux 节点上运行。

此示例 Pod YAML 文件显示了与容忍度一起使用的 nodeSelector：

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

在上面的示例中，我们确保了的 pod 仅在 Linux 节点上运行，并且为所有 Linux 节点上的污点添加了`容忍度`。

你可以对 Rancher 现有的污点或你自己的自定义污点执行相同的操作。

### 为自定义污点添加 NodeSelector 设置和容忍度

如果要添加你自己的 `nodeSelector` 设置，或者要为其他污点添加 `容忍度`，你可以将以下内容传递给 Chart 的值：

```yaml
tolerations:
  # insert tolerations...
nodeSelector:
  # insert nodeSelector...
```

这些值会将这两个设置添加到 `fluentd`、`fluentbit`和 `logging-operator` 容器中。
本质上，这些是日志堆栈中所有 pod 的全局设置。

但是，如果你想*仅*为 `fluentbit` 容器添加容忍度，你可以将以下内容添加到 Chart 的值中：

```yaml
fluentbit_tolerations:
  # insert tolerations list for fluentbit containers only...
```
