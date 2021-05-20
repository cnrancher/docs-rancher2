---
title: 网络插件
description: RKE 提供了以下网络插件，作为附加组件部署：Flannel、Calico、Canal和Weave。默认情况下，RKE 使用的网络插件是`canal`。如果你想使用另一个网络插件，你需要在`cluster.yml`中指定在集群级别启用哪个网络插件。
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
  - RKE
  - 配置选项
  - 插件
  - RKE 插件
  - 网络插件
---

RKE 提供了以下网络插件，作为附加组件部署：

- Flannel
- Calico
- Canal
- Weave

在你启动集群后，你不能改变你的网络供应商。因此，仔细选择你要使用的网络供应商，因为 Kubernetes 不允许在网络供应商之间切换。一旦用网络提供商创建了一个集群，改变网络提供商将需要你拆掉整个集群及其所有的应用程序。

## 修改默认插件

默认情况下，RKE 使用的网络插件是`canal`。如果你想使用另一个网络插件，你需要在`cluster.yml`中指定在集群级别启用哪个网络插件。

```yaml
# 设置flannel网络插件
network:
  plugin: flannel
```

网络插件使用的镜像在[`system_images`](/docs/rke/config-options/system-images/_index)中。每个 Kubernetes 版本，都有与每个网络插件相关联的默认镜像，但这些镜像可以通过更改`system_images`中的镜像标签来覆盖。

## 禁用网络插件 Deployment

您可以将集群配置中的 `plugin`设置为`none`，禁用默认的 网络插件 Deployment。

```yaml
network:
  plugin: none
```

## 网络插件选项

除了可以用来部署网络插件的不同镜像外，有些网络插件还支持配置其他选项。

### Canal 插件选项

```yaml
network:
  plugin: canal
  options:
    canal_iface: eth1
    canal_flannel_backend_type: vxlan
    canal_autoscaler_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
    canal_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
```

### Canal 接口

通过设置`canal_iface`，可以配置主机间通信使用的接口。
`canal_flannel_backend_type`选项允许你指定要使用的[flannel backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md)的类型。默认情况下使用`vxlan`后端。

## Canal 网络插件容忍度

_从 v1.2.4 开始提供_

配置的容忍度适用于`calico-kube-controllers`部署。

```yaml
network:
  plugin: canal
  tolerations:
    - key: "node.kubernetes.io/unreachable"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
    - key: "node.kubernetes.io/not-ready"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
```

要检查 `calico-kube-controllers`部署上的应用容忍度，请使用以下命令。

```bash
kubectl -n kube-system get deploy calico-kube-controllers -o jsonpath='{.spec.template.spec.tolerations}'
```

### Flannel 插件选项

```yaml
network:
  plugin: flannel
  options:
    flannel_iface: eth1
    flannel_backend_type: vxlan
    flannel_autoscaler_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
    flannel_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
```

### Flannel 接口

通过设置`flannel_iface`，可以配置主机间通信使用的接口。
`flannel_backend_type`选项允许你指定要使用的[flannel backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md)的类型。默认情况下使用`vxlan`后端。

### Calico 插件选项

```yaml
network:
  plugin: calico
  options:
    calico_cloud_provider: aws
    calico_autoscaler_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
    calico_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
```

### Calico 云服务提供商

Calico 目前只支持 2 个云提供商，AWS 或 GCE，可以使用`calico_cloud_provider`进行设置。

**可选值**

- `aws`
- `gce`

## Canal 网络插件容忍度

_从 v1.2.4 开始提供_

配置的容忍度适用于`calico-kube-controllers`部署。

```yaml
network:
  plugin: canal
  tolerations:
    - key: "node.kubernetes.io/unreachable"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
    - key: "node.kubernetes.io/not-ready"
      operator: "Exists"
      effect: "NoExecute"
      tolerationseconds: 300
```

要检查 `calico-kube-controllers`部署上的应用容忍度，请使用以下命令。

```bash
kubectl -n kube-system get deploy calico-kube-controllers -o jsonpath='{.spec.template.spec.tolerations}'
```

### Weave 插件选项

```yaml
network:
  plugin: weave
  options:
    weave_autoscaler_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
    weave_priority_class_name: system-cluster-critical # Available as of RKE v1.2.6+
  weave_network_provider:
    password: "Q]SZ******oijz"
```

### Weave 加密

Weave 加密可以通过向网络提供商配置传递一个字符串密码来启用。

### 自定义网络插件

可以通过 RKE 的[用户自定义插件功能](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)来添加自定义网络插件。可以在 `addons`字段中添加网络插件的集群的加载清单，如[自定义的网络插件示例](/docs/rke/config-options/add-ons/network-plugins/custom-network-plugin-example/_index)所示。
