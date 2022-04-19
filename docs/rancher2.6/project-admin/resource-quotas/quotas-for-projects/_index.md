---
title: Rancher 项目中资源配额的工作原理
weight: 1
---

Rancher 中的资源配额包含与 [Kubernetes 原生版本](https://kubernetes.io/docs/concepts/policy/resource-quotas/)相同的功能。Rancher 还扩展了资源配额的功能，让你将资源配额应用于项目。

在标准 Kubernetes deployment 中，资源配额会应用于各个命名空间。但是，你不能通过单次操作将配额应用到多个命名空间，而必须多次应用资源配额。

在下图中，Kubernetes 管理员试图在没有 Rancher 的情况下强制执行资源配额。管理员想要使用一个资源配额来为集群中的每个命名空间配置统一的 CPU 和内存限制 (`Namespace 1-4`)。但是，在 Kubernetes 的基础版本中，每个命名空间都需要单独设置资源配额。因此，管理员必须创建四个配置相同规格的不同资源配额（`Resource Quota 1-4`）并单独应用这些配额。

<sup>Kubernetes 基础版本：每个命名空间都需要独立设置资源配额</sup>
![原生 Kubernetes 资源配额实现]({{<baseurl>}}/img/rancher/kubernetes-resource-quota.svg)

和原生 Kubernetes 相比，Rancher 的资源配额有不同。在 Rancher 中，你可以把资源配额应用到项目层级，进而让项目的资源配额沿用到项目内的每一个命名空间，然后 Kubernetes 会使用原生的资源配额来强制执行你设置的限制。如果要更改特定命名空间的配额，你也可以覆盖设置。

项目配额包括你在创建或编辑集群时设置的两个限制：
<a id="project-limits"></a>

- **项目限制**：

   配置了项目中所有命名空间共享的每个指定资源的总限制。

- **命名空间默认限制**：

   配置了每个命名空间对每个指定资源的默认配额。
   如果项目中的命名空间配置没有被覆盖，那么此限制会自动绑定到命名空间并强制执行。


在下图中，Rancher 管理员想使用资源配额来为项目中的每个命名空间（`命名空间 1-4`）设置相同的 CPU 和内存限制。在 Rancher 中，管理员可以为项目设置资源配额（`项目资源配额`），而不需要为命名空间单独进行设置。此配额包括整个项目（`项目限制`）和单个命名空间（`命名空间默认限制`）的资源限制。然后，Rancher 会将`命名空间默认限制`的配额沿用到每个命名空间（`命名空间资源配额`）。

<sup>Rancher：资源配额沿用到每个命名空间</sup>
![Rancher 资源配额实现]({{<baseurl>}}/img/rancher/rancher-resource-quota.png)

以下介绍在 Rancher UI **_中_** 创建的命名空间的更细微的功能。如果你删除了项目级别的资源配额，无论命名空间层级是否有自定义的资源配额，项目内的所有命名空间也会移除这个资源配额。在项目层级修改已有的命名空间默认资源配额，不会影响命名空间内的资源配额，修改后的项目层级资源配额只会对以后新建的命名空间生效。要修改多个现有命名空间的默认限制，你可以在项目层级删除该限制，然后再使用新的默认值重新创建配额。这种方式会将新的默认值应用于项目中的所有现有命名空间。

在项目中创建命名空间之前，Rancher 会使用默认限制和覆盖限制来对比项目内的可用资源和请求资源。
如果请求的资源超过了项目中这些资源的剩余容量，Rancher 将为命名空间分配该资源的剩余容量。

但是，在 Rancher 的 UI **_外_** 创建的命名空间的处理方法则不一样。对于通过 `kubectl` 创建的命名空间，如果请求的资源量多余项目内的余量，Rancher 会分配一个数值为 **0** 的资源配额。

要使用 `kubectl` 在现有项目中创建命名空间，请使用 `field.cattle.io/projectId` 注释。要覆盖默认的请求配额限制，请使用 `field.cattle.io/resourceQuota` 注释。
```
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    field.cattle.io/projectId: [your-cluster-ID]:[your-project-ID]
    field.cattle.io/resourceQuota: '{"limit":{"limitsCpu":"100m", "limitsMemory":"100Mi", "configMaps": "50"}}'
  name: my-ns
```

下表对比了 Rancher 和 Kubernetes 资源配额的主要区别：

| Rancher 资源配额 | Kubernetes 资源配额 |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| 应用于项目和命名空间。 | 仅应用于命名空间。 |
| 为项目中的所有命名空间创建资源池。 | 将静态资源限制应用到单独的命名空间。 |
| 通过沿用的模式，将资源配额应用于各个命名空间。 | 仅应用于指定的命名空间。 |
