---
title: 自定义插件
description: RKE 支持添加用户自定义插件。
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
  - 自定义插件
---

除了[网络插件](/docs/rke/config-options/add-ons/network-plugins/)、[ingress controllers 插件](/docs/rke/config-options/add-ons/ingress-controllers/)、[DNS 插件](/docs/rke/config-options/add-ons/dns/)和[Metrics Server 插件](/docs/rke/config-options/add-ons/metrics-server/)之外，RKE 支持添加用户自定义插件。

添加自定义插件方式有两种：

- [在 cluster.yaml 文件中嵌入插件](#在-clusteryaml-文件中嵌入插件)
- [引用插件的 YAML 文件](#引用插件的-yaml-文件)

> **说明：**当使自定义的附加组件时，必须为你的所有资源定义一个命名空间，否则它们会进入`kube-system`命名空间。

RKE 将 YAML 清单作为 configmap 上传至 Kubernetes 集群。然后，它运行一个 Kubernetes job，挂载 configmap 并使用`kubectl apply -f`部署插件。

RKE 只有在多次使用`rke up`时才会添加额外的插件。当使用不同的附加组件列表进行`rke up`时，RKE 不支持删除集群附加组件。

从 v0.1.8 开始，RKE 会更新同名的插件。

在 v0.1.8 之前，使用`kubectl edit`更新任何插件。

## 在 cluster.yaml 文件中嵌入插件

如果要在 YAML 文件中直接定义一个插件，一定要使用 YAML 的 block indicator`|-`，因为`addons`指令是一个多行字符串选项。可以用`---`指令将多个 YAML 资源定义分开来指定。

```yaml
addons: |-
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-nginx
    namespace: default
  spec:
    containers:
    - name: my-nginx
      image: nginx
      ports:
      - containerPort: 80
```

## 引用插件的 YAML 文件

使用`addons_include`指令，提供自定义插件引用的本地文件路径或 URL 地址。

```yaml
addons_include:
  - https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/operator.yaml
  - https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/cluster.yaml
  - /opt/manifests/example.yaml
  - ./nginx.yaml
```
