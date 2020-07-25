---
title: 网络插件
---

RKE 提供了以下网络插件，作为附加组件部署：

- Flannel
- Calico
- Canal
- Weave

> **注意：**启动集群后，不能更改网络提供商。因此，请仔细选择您要使用的网络提供商，因为 Kubernetes 不允许切换网络提供商之。一旦使用网络提供商创建集群，更换网络提供商就需要重建整个集群及其所有应用。

默认情况下，RKE 使用的网络插件是`canal`。如果你想使用另一个网络插件，你需要在`cluster.yml`中指定在集群级别启用哪个网络插件。

```yaml
# 设置flannel网络插件
network:
  plugin: flannel
```

网络插件使用的镜像在[`system_images`](/docs/rke/config-options/system-images/_index)中。每个 Kubernetes 版本，都有与每个网络插件相关联的默认镜像，但这些镜像可以通过更改`system_images`中的镜像标签来覆盖。

## 禁用网络插件 Deployment

您可以将群集配置中的 `plugin`设置为`none`，禁用默认的 网络插件 Deployment。

```yaml
network:
  plugin: none
```

## 网络排插件选项

除了可以用来部署网络插件的不同镜像外，有些网络插件还支持配置其他选项。

### Canal 插件选项

```yaml
network:
  plugin: canal
  options:
    canal_iface: eth1
    canal_flannel_backend_type: vxlan
```

### Canal 接口

通过设置`canal_iface`，可以配置主机间通信使用的接口。
`canal_flannel_backend_type`选项允许你指定要使用的[flannel backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md)的类型。默认情况下使用`vxlan`后端。

### Flannel 插件选项

```yaml
network:
  plugin: flannel
  options:
    flannel_iface: eth1
    flannel_backend_type: vxlan
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
```

### Calico 云服务提供商

Calico 目前只支持 2 个云提供商，AWS 或 GCE，可以使用`calico_cloud_provider`进行设置。

**可选值**

- `aws`
- `gce`

### Weave 插件选项

```yaml
network:
  plugin: weave
  weave_network_provider:
    password: "Q]SZ******oijz"
```

### Weave 加密

Weave 加密可以通过向网络提供商配置传递一个字符串密码来启用。

### 自定义网络插件

可以通过 RKE 的[用户自定义插件功能](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)来添加自定义网络插件。可以在 `addons`字段中添加网络插件的集群的加载清单，如[自定义的网络插件示例](/docs/rke/config-options/add-ons/network-plugins/custom-network-plugin-example/_index)所示。
