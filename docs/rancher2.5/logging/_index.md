---
title: Rancher v2.5 的日志功能
description: 本文描述了日志功能在Rancher2.5中的变化，提供了启用和卸载日志的操作指导。
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
---

## 日志优化

在 Rancher v2.5 中，日志有以下变化：

- [Banzai Cloud Logging operator](https://banzaicloud.com/docs/one-eye/logging-operator/)现在是 Rancher 日志记录的动力，取代了以前的内部日志记录解决方案。
- [Fluent Bit](https://fluentbit.io/)用于汇总日志。[Fluentd](https://www.fluentd.org/)用于过滤消息并将其路由到输出。以前只使用 Fluentd。
- 日志记录可以用 Kubernetes 清单配置，因为现在日志记录使用的是 Kubernetes 操作符与自定义资源定义。
- 我们现在支持过滤日志。
- 我们现在支持将日志写入多个输出。
- 我们现在总是收集 Control Plane 和 etcd 日志。

下图来自[Banzai 文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)，展示了新的日志架构。

![How the Banzai Cloud Logging Operator Works with Fluentd](/img/rancher/banzai-cloud-logging-operator.png)

## 启用日志

您可以通过进入“应用市场”页面并安装日志应用程序，为 Rancher 管理的集群启用日志记录。

1. 在 Rancher UI 中，进入要安装日志记录的集群，然后单击 **集群资源管理器**。
1. 单击**应用**。
1. 单击`rancher-logging`应用程序。
1. 滚动到 Helm chart README 底部，单击**安装**。

**结果：**日志应用部署在`cattle-logging-system`命名空间中。

## 卸载日志

1. 从**群组资源管理器**中，单击**应用市场**。
1. 单击**安装的应用程序**。
1. 进入`cattle-logging-system`命名空间，选中`rancher-logging`和`rancher-logging-crd`的方框。
1. 单击**删除**。
1. 确认 **删除**。

**结果：** `rancher-logging`被卸载。

## Windows 集群日志功能增强

### v2.5.0- v2.5.7

带有 Windows worker 节点的集群支持从 Linux 节点导出日志，但 Windows 节点的日志目前无法导出。只有 Linux 节点的日志能够被导出。

为了允许在 Linux 节点上调度日志 Pod，必须向 Pod 添加容错。请参阅 "使用污点和容忍度 "一节，以了解细节和例子。

### v2.5.8 及之后

从 Rancher v2.5.8 开始，增加了对 Windows 集群的日志支持，可以从 Windows 节点收集日志。

#### 启用和禁用 Windows 节点日志记录

你可以通过在 values.yaml 中设置 `global.cattle.windows.enabled` 为 `true` 或 `false` 来启用或禁用 Windows 节点日志记录。默认情况下，如果使用 Cluster Explorer 用户界面在 Windows 集群上安装日志应用程序，Windows 节点日志将被启用。在这种情况下，将 `global.cattle.windows.enabled` 设置为 false 将禁用集群上的 Windows 节点日志记录。当禁用时，仍然会从 Windows 集群内的 Linux 节点收集日志。

注意：目前存在一个问题，即在 Windows 集群中禁用 Windows 日志后执行 Helm 升级时，Windows nodeAgents 不会被删除。在这种情况下，如果已经安装了 Windows nodeAgents，用户可能需要手动删除它们。

## 基于角色的访问控制

Rancher 日志记录有两个角色，`logging-admin`和`logging-view`。

`logging-admin`允许用户完全访问命名间隔的流量和输出。

`logging-view`角色允许用户查看命名间隔流和输出，以及集群流和输出。

对集群流和集群输出资源的编辑访问是非常强大的，因为它允许任何具有编辑访问权限的用户控制集群中的所有日志。

在 Rancher 中，集群管理员角色是唯一对所有 rancher-logging 资源具有完全访问权限的角色。

集群成员无法编辑或读取任何日志资源。

项目所有者能够在其项目下的命名空间中创建命名空间的流和输出。这意味着项目所有者可以从其项目命名空间中的任何东西收集日志。项目成员能够查看其项目下命名空间中的流程和输出。项目所有者和项目成员需要在他们的项目中至少有一个命名空间才能使用日志记录。如果他们的项目中没有至少一个命名空间，他们可能看不到顶部导航下拉菜单中的日志记录按钮。

## 配置记录应用程序

要配置日志应用，请转到 Rancher UI 中的 **集群资源管理器**。在左上角，单击**集群资源管理器 > 日志**。

## 日志自定义资源概述

以下自定义资源定义用于配置日志记录。

- [Flow 和 ClusterFlow](https://banzaicloud.com/docs/one-eye/logging-operator/crds/#flows-clusterflows)
- [Output and ClusterOutput](https://banzaicloud.com/docs/one-eye/logging-operator/crds/#outputs-clusteroutputs)

根据[banzaicloud 文档](https://banzaicloud.com/docs/one-eye/logging-operator/#architecture)

你可以定义 "输出"（你想发送日志消息的目的地，例如 Elasticsearch 或 Amazon S3 bucket）和 "流"，使用过滤器和选择器将日志消息路由到适当的输出。你也可以定义集群范围内的输出和流，例如，使用一个集中的输出，而名字间隔的用户不能修改。

## 示例

### 将集群中的所有日志发送到 elasticsearch

假设你想把集群中的所有日志发送到 elasticsearch 集群。

首先让我们创建我们的集群输出。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: "example-es"
  namespace: "cattle-logging-system"
spec:
  elasticsearch:
    host: elasticsearch.example.com
    port: 9200
    scheme: http
```

我们已经创建了一个集群输出，没有弹性搜索配置，与我们的操作符`cattle-logging-system.`在同一个命名空间。任何时候我们创建一个集群流或集群输出，我们都必须把它放在`cattle-logging-system`命名空间中。

现在我们已经配置好了我们想要的日志的去向，让我们配置好所有的日志都去那个输出。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: "all-logs"
  namespace: "cattle-logging-system"
spec:
  globalOutputRefs:
    - "example-es"
```

### 将集群中的所有日志发送到 splunk

现在我们应该看到我们配置的索引，里面有日志。

如果我们有一个应用团队只想把来自特定命名空间的日志发送到 splunk 服务器上，怎么办？对于这种情况，可以使用命名空间的输出和流。

在开始之前，我们先设置一个场景。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devteam
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coolapp
  namespace: devteam
  labels:
    app: coolapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: coolapp
  template:
    metadata:
      labels:
        app: coolapp
    spec:
      containers:
        - name: generator
          image: paynejacob/loggenerator:latest
```

像之前我们开始输出一样，与集群输出不同的是，我们在应用程序的命名空间中创建我们的输出。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: Output
metadata:
  name: "devteam-splunk"
  namespace: "devteam"
spec:
  SplunkHec:
    host: splunk.example.com
    port: 8088
    protocol: http
```

让我们给我们的输出一些日志。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
kind: Flow
metadata:
  name: "devteam-logs"
  namespace: "devteam"
spec:
  localOutputRefs:
    - "devteam-splunk"
```

在最后一个例子中，我们创建了一个输出，将日志写入一个不支持的目标（如 syslog）。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: syslog-config
  namespace: cattle-logging-system
type: Opaque
stringData:
  fluent-bit.conf: |
    [INPUT]
        Name              forward
        Port              24224

    [OUTPUT]
        Name              syslog
        InstanceName      syslog-output
        Match             *
        Addr              syslog.example.com
        Port              514
        Cluster           ranchers

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fluentbit-syslog-forwarder
  namespace: cattle-logging-system
  labels:
    output: syslog
spec:
  selector:
    matchLabels:
      output: syslog
  template:
    metadata:
      labels:
        output: syslog
    spec:
      containers:
        - name: fluentbit
          image: paynejacob/fluent-bit-out-syslog:latest
          ports:
            - containerPort: 24224
          volumeMounts:
            - mountPath: "/fluent-bit/etc/"
              name: configuration
      volumes:
        - name: configuration
          secret:
            secretName: syslog-config
---
apiVersion: v1
kind: Service
metadata:
  name: syslog-forwarder
  namespace: cattle-logging-system
spec:
  selector:
    output: syslog
  ports:
    - protocol: TCP
      port: 24224
      targetPort: 24224
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: all-logs
  namespace: cattle-logging-system
spec:
  globalOutputRefs:
    - syslog
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: syslog
  namespace: cattle-logging-system
spec:
  forward:
    servers:
      - host: "syslog-forwarder.cattle-logging-system"
    require_ack_response: false
    ignore_network_errors_at_startup: false
```

### 将集群中的所有日志发送到 Syslog

假设你想把集群中的所有日志发送到一个`syslog`服务器。首先，我们创建一个集群输出。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
    kind: ClusterOutput
    metadata:
      name: "example-syslog"
      namespace: "cattle-logging-system"
    spec:
      syslog:
        buffer:
          timekey: 30s
          timekey_use_utc: true
          timekey_wait: 10s
          flush_interval: 5s
        format:
          type: json
          app_name_field: test
        host: syslog.example.com
        insecure: true
        port: 514
        transport: tcp
```

现在我们已经配置好了我们想要的日志去向，让我们把所有的日志都配置到该输出端。

```yaml
apiVersion: logging.banzaicloud.io/v1beta1
    kind: ClusterFlow
    metadata:
      name: "all-logs"
      namespace: cattle-logging-system
    spec:
      globalOutputRefs:
        - "example-syslog"
```

### 不支持的 Output

在最后一个例子中，我们创建了一个输出，将日志写到一个不支持开箱的目的地。

> **关于 syslog 的说明**从 Rancher v2.5.4 开始，`syslog`是一个支持的输出。然而，这个例子仍然提供了一个关于使用不支持的插件的概述。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: syslog-config
  namespace: cattle-logging-system
type: Opaque
stringData:
  fluent-bit.conf: |
    [INPUT]
        Name              forward
        Port              24224

    [OUTPUT]
        Name              syslog
        InstanceName      syslog-output
        Match             *
        Addr              syslog.example.com
        Port              514
        Cluster           ranchers

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fluentbit-syslog-forwarder
  namespace: cattle-logging-system
  labels:
    output: syslog
spec:
  selector:
    matchLabels:
      output: syslog
  template:
    metadata:
      labels:
        output: syslog
    spec:
      containers:
        - name: fluentbit
          image: paynejacob/fluent-bit-out-syslog:latest
          ports:
            - containerPort: 24224
          volumeMounts:
            - mountPath: "/fluent-bit/etc/"
              name: configuration
      volumes:
        - name: configuration
          secret:
            secretName: syslog-config
---
apiVersion: v1
kind: Service
metadata:
  name: syslog-forwarder
  namespace: cattle-logging-system
spec:
  selector:
    output: syslog
  ports:
    - protocol: TCP
      port: 24224
      targetPort: 24224
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterFlow
metadata:
  name: all-logs
  namespace: cattle-logging-system
spec:
  globalOutputRefs:
    - syslog
---
apiVersion: logging.banzaicloud.io/v1beta1
kind: ClusterOutput
metadata:
  name: syslog
  namespace: cattle-logging-system
spec:
  forward:
    servers:
      - host: "syslog-forwarder.cattle-logging-system"
    require_ack_response: false
    ignore_network_errors_at_startup: false
```

如果我们分解一下发生了什么，首先我们创建一个容器的部署，该容器有额外的 syslog 插件，并接受从另一个 fluentd 转发的日志。接下来，我们创建一个输出配置为我们的部署的转发者。然后，部署的 fluentd 会将所有日志转发到配置的 syslog 目的地。

Rancher 官方的`syslog`支持将在 Rancher v2.5.4 中出现。然而，这个例子仍然提供了一个关于使用不支持的插件的概述。

## 使用自定义的 Docker 根目录

_适用于 v2.5.6 以上版本_

如果使用自定义的 Docker 根目录，你可以在 `values.yaml` 中设置 `global.dockerRootDirectory`。这将确保创建的日志 CR 将使用你指定的路径，而不是默认的 Docker 数据根目录。注意，这只影响到 Linux 节点。如果集群中存在任何 Windows 节点，该更改将不适用于这些节点。

## 污点和容忍度

`taint`一个 Kubernetes 节点会导致 pods 排斥在该节点上运行。
除非 pods 对该节点的污点有`tolerance`，否则它们将在集群中的其他节点上运行。
[污点和容忍](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)可以与`PodSpec`中的`nodeSelector`[字段](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)一起工作，它可以实现污点的\_相反效果。
使用`nodeSelector`使 Pod 对某些节点有亲和力。
两者都为 pod 运行的节点提供了选择。

## Rancher 日志堆栈中的默认实现

**2.5.8**：默认情况下，Rancher 会用`cattle.io/os=linux`污染所有 Linux 节点，而不会污染 Windows 节点。
日志堆栈 pods 对这个污点有`tolerations`，这使得它们可以在 Linux 节点上运行。
此外，我们可以填充`nodeSelector`来确保我们的 pods*only*运行在 Linux 节点上。

**2.5.0-2.5.7**：默认情况下，Rancher 会用`cattle.io/os=linux`污染所有 Linux 节点，而不会污染 Windows 节点。日志堆栈的 pods 对这种污点有容忍度，这使得它们能够在 Linux 节点上运行。此外，我们可以填充 nodeSelector 以确保我们的 pod 只在 Linux 节点上运行。

让我们看看一个带有这些设置的示例 pod YAML 文件：

```yaml
apiVersion: v1
kind: Pod
# metadata:
spec:
  # containers:
  tolerations:
    - key: cattle.io/os
      operator: "Equal"
      value: "linux"
      effect: NoSchedule
  nodeSelector:
    kubernetes.io/os: linux
```

在上面的例子中，我们确保我们的 pod 只运行在 Linux 节点上，并且我们为我们所有的 Linux 节点上的污点添加一个 "toleration"。
你可以用 Rancher 现有的污点做同样的事情，或者用你自己的自定义污点。

## 为自定义污点添加 NodeSelector 设置和容忍度

如果你想添加你自己的 "节点选择器 "设置，或者如果你想为额外的污点添加 "容忍"，你可以将以下内容传递给 chart 的值。

```yaml
tolerations:
  # insert tolerations list
nodeSelector:
  # insert nodeSelector settings
```

这些值将把这两个设置添加到`fluentd`、`fluentbit`和`logging-operator`容器中。
本质上，这些都是日志堆栈中所有 pods 的全局设置。

但是，如果你想只为`fluentbit`容器添加容忍度，你可以在 chart 的值中添加以下内容。

```yaml
fluentbit_tolerations:
  # insert tolerations list for fluentbit containers only
```

## 带有 SELinux 的日志 V2

_从 v2.5.8 开始可用_

> **要求：** Logging v2 在 RHEL/CentOS 7 和 8 上用 SELinux 测试。

[安全增强型 Linux（SELinux）](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)是对 Linux 的安全增强。在历史上被政府机构使用后，SELinux 现在是行业标准，在 CentOS 7 和 8 上默认启用。

要在 SELinux 下使用 Logging v2，我们建议按照[本页](/docs/rancher2.5/security/selinux/_index)上的说明安装`rancher-selinux` RPM。

然后你需要配置日志应用程序，使其与 SELinux 一起工作，如[本节](/docs/rancher2.5/security/selinux/_index)

## 额外的日志来源

默认情况下，Rancher 为所有集群类型的[控制平面组件](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)和[节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)收集日志。
在某些情况下，Rancher 可能会收集额外的日志。

下表总结了每个节点类型可能收集额外日志的来源。

| 日志来源 | Linux 节点（包括在 Windows 集群中的节点） | Windows 节点 |
| -------- | ----------------------------------------- | ------------ |
| RKE      | ✓                                         | ✓            |
| RKE2     | ✓                                         |              |
| K3s      | ✓                                         |              |
| AKS      | ✓                                         |              |
| EKS      | ✓                                         |              |
| GKE      | ✓                                         |              |

要启用托管的 Kubernetes 提供商作为额外的日志来源，请到**集群资源管理器>日志>图表选项**，选择**启用增强的云提供商日志**选项。
启用后，Rancher 会收集供应商提供的所有额外的节点和控制平面日志，不同的供应商可能会有所不同。

如果你已经在使用云提供商自己的日志解决方案，如 AWS CloudWatch 或谷歌云操作套件（以前的 Stackdriver），就没有必要启用这个选项，因为本地解决方案将不受限制地访问所有日志。

## 常见问题及解决方法

### The `cattle-logging` Namespace Being Recreated

如果你的集群之前从集群管理器用户界面部署了日志记录，你可能会遇到一个问题，就是它的`cattle-logging`命名空间不断被重新创建。

解决办法是删除管理集群中集群特定命名空间中的所有`clusterloggings.management.cattle.io`和`projectloggings.management.cattle.io`自定义资源。

这些自定义资源的存在导致 Rancher 在下游集群中创建`cattle-logging`命名空间。

集群命名空间与集群 ID 相匹配，所以我们需要找到每个集群的集群 ID。

1. 在您的 Web 浏览器中，在集群管理器用户界面或集群资源管理器用户界面中导航到您的集群。
2. 从下面的一个 URL 中复制`<cluster-id>`部分。`<cluster-id>`部分是集群命名空间名称。

```bash
# Cluster Management UI
https://<your-url>/c/<cluster-id>/
# Cluster Explorer UI (Dashboard)
https://<your-url>/dashboard/c/<cluster-id>/
```

现在我们有了`<cluster-id>`命名空间，我们可以删除导致`cattle-logging`不断被重新创建的 CR。

:::warning 警告
确保日志，从集群管理器用户界面安装的版本，目前没有在使用。
:::

```bash
kubectl delete clusterloggings.management.cattle.io -n <cluster-id>
kubectl delete projectloggings.management.cattle.io -n <cluster-id>
```
