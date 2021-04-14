---
title: 自定义参数、Docker挂载绑定和额外的环境变量
description: RKE 支持用户添加自定义参数、挂载存储卷和添加额外的环境变量。
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
  - 默认的Kubernetes服务
  - 自定义参数、Docker挂载绑定和额外的环境变量
---

RKE 支持用户添加自定义参数、挂载存储卷和添加额外的环境变量。

## 自定义参数

对于任何一个 Kubernetes 服务，您可以更新`extra_args`来改变现有的默认值。

从`v0.1.3`开始，使用`extra_args`将添加新的参数，并**覆盖**任何现有的默认值。例如，如果您需要修改默认的录取插件列表，您需要包括默认列表，并编辑它与您的变化，所以所有的变化都包括在内。

在 "v0.1.3 "之前，使用 "extra_args "只能向列表中添加新的参数，而无法更改默认列表。

所有的服务默认值和参数都是根据[`kubernetes_version`](/docs/rke/config-options/_index)定义的。

- 对于 RKE v0.3.0+，服务默认值和参数定义在[`kubernetes_version`](/docs/rke/config-options/_index)。服务默认值位于[这里](https://github.com/rancher/kontainer-driver-metadata/blob/master/rke/k8s_service_options.go)。默认的接纳插件列表对于所有 Kubernetes 版本都是一样的，位于[这里](https://github.com/rancher/kontainer-driver-metadata/blob/master/rke/k8s_service_options.go#L11)。

- 对于 v0.3.0 之前的 RKE，服务默认值和接纳插件是根据[`kubernetes_version`](/docs/rke/config-options/_index)定义的，位于[here](https://github.com/rancher/types/blob/release/v2.2/apis/management.cattle.io/v3/k8s_defaults.go)。

```yaml
services:
  kube-controller:
    extra_args:
      cluster-name: "mycluster"
```

## Docker 挂载绑定

可以使用`extra_binds`参数为服务添加额外的存储卷绑定。

```yaml
services:
  kubelet:
    extra_binds:
      - "/host/dev:/dev"
      - "/usr/libexec/kubernetes/kubelet-plugins:/usr/libexec/kubernetes/kubelet-plugins:z"
```

## 环境变量

可以通过使用`extra_env`参数为服务添加额外的环境变量。

```yaml
services:
  kubelet:
    extra_env:
      - "HTTP_PROXY=http://your_proxy"
```
