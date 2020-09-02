---
title: 常见问题
description: 常见问题解答会定期更新，旨在回答我们的用户最关注的问题。
keywords:
  - Octopus中文文档
  - Octopus 中文文档
  - 边缘计算
  - IOT
  - edge computing
  - Octopus中文
  - Octopus 中文
  - Octopus
  - Octopus教程
  - Octopus中国
  - rancher
  - Octopus 中文教程
  - 常见问题
---

:::note 说明
常见问题解答会定期更新，旨在回答我们的用户最关注的问题。
:::

##### Octopus 可以在 k3s 或本地 Kubernetes 集群上运行吗？

Octopus 遵循 k8s api 扩展和 CRD 模型，它与 k3s 或原生 Kubernetes 都兼容，所以 Octopus 可以在 k3s 或本地 Kubernetes 集群上运行。

##### Octopus 是否支持 ARM 和 AMD64？

Octopus 的 multi-arch 的镜像支持 AMD64，ARM64 和 ARMv7，Octopus 可以在从像 Raspberry Pi 这样的微型计算机到 AWS a1.4xlarge 32GiB 大型服务器都可以很好地工作。

##### Octopus 是否支持 Windows？

目前，Octopus 不支持 Windows，但是我们对将来的想法持开放态度。

##### 如何从源代码构建 Octopus

请参考 [Octopus 开发指南](/docs/octopus/develop/_index)的说明。

##### 如何构建自定义设备适配器？

请参考[开发适配器](/docs/octopus/adaptors/develop/_index)的说明。

##### 是否支持本地离线访问 UI？

支持，如果是使用`master`镜像的用户可以通过编辑`kubectl edit settings ui-index`来添加使用`local`的配置：

```yaml
apiVersion: octopusapi.cattle.io/v1alpha1
kind: Setting
metadata:
  creationTimestamp: "2020-07-15T11:04:09Z"
  generation: 6
  name: ui-index
  resourceVersion: "5328065"
  selfLink: /apis/octopusapi.cattle.io/v1alpha1/settings/ui-index
  uid: 37e54cfa-ebd5-4d80-91dc-31959dfaf634
default: https://rancher-octopus.s3-accelerate.amazonaws.com/ui/latest/index.html
value: local # 添加local支持本地离线访问UI的js/css文件
```

如果用户使用的是`tag`镜像，例如`cnrancher/octopus-api-server:v1.0.2`则会默认使用离线文件。
