---
title: RKE 插件
description: RKE 支持在集群 yaml 文件中配置插件选项，这些插件用于部署多种集群组件，包括：网络插件、Ingress controller 插件、DNS 提供商插件和Metrics Server 插件。
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
---

RKE 支持在集群 yaml 文件中配置插件选项，这些插件用于部署多种集群组件，包括：

- [网络插件](/docs/rke/config-options/add-ons/network-plugins/)
- [Ingress controller 插件](/docs/rke/config-options/add-ons/ingress-controllers/)
- [DNS 提供商插件](/docs/rke/config-options/add-ons/dns/)
- [Metrics Server 插件](/docs/rke/config-options/add-ons/metrics-server/)

这些插件的镜像文件可以在[`system_images`](/docs/rke/config-options/system-images/)中找到。对于每个 Kubernetes 版本，都有与每个插件相关联的默认镜像版本，但这些镜像可以通过更改`system_images`中的镜像来覆盖。

注意：

- 除了这些 RKE 已有的插件外，您在集群部署完成，部署自定义插件，详情请参考[自定义插件](/docs/rke/config-options/add-ons/user-defined-add-ons/)。
- 从 v0.1.8 开始，如果插件名称相同，RKE 会执行更新。
- 在 v0.1.8 之前，您需要运行`kubectl edit`命令更新插件。

## 关键插件与非关键插件

从 v0.1.7 开始，插件被分为关键插件与非关键插件：

- **关键插件：** 如果部署失败，会导致 RKE 报错。
- **非关键插件：** 如果部署失败，RKE 会在日志中记录一条告警信息，并继续部署其他插件。

当前只有[网络插件](/docs/rke/config-options/add-ons/network-plugins/)是**关键插件**，其他插件都是**非关键插件**。

## 插件部署 job

RKE 使用 Kubernetes job 的方式部署插件。在某些情况下，部署插件的时间会比预期时间长。从 v0.1.7 开始，RKE 提供集群层级的`addon_job_timeout`选项，以检查 job 的连接是否超时，默认值为 30，单位是秒。

```yaml
addon_job_timeout: 30
```

## 插件位置

_v0.2.3 或更新版本可用_

| 组件           | nodeAffinity nodeSelectorTerms                                                     | nodeSelector                  | Tolerations                                                            |
| :------------- | :--------------------------------------------------------------------------------- | :---------------------------- | :--------------------------------------------------------------------- |
| Calico         | `beta.kubernetes.io/os:NotIn:windows`                                              | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`- `CriticalAddonsOnly:Exists` |
| Flannel        | `beta.kubernetes.io/os:NotIn:windows`                                              | none                          | - `operator:Exists`                                                    |
| Canal          | `beta.kubernetes.io/os:NotIn:windows`                                              | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`- `CriticalAddonsOnly:Exists` |
| Weave          | `beta.kubernetes.io/os:NotIn:windows`                                              | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`                              |
| CoreDNS        | `node-role.kubernetes.io/worker:Exists`                                            | `beta.kubernetes.io/os:linux` | - `NoSchedule:Exists`- `NoExecute:Exists`- `CriticalAddonsOnly:Exists` |
| kube-dns       | - `beta.kubernetes.io/os:NotIn:windows`- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`- `CriticalAddonsOnly:Exists` |
| nginx-ingress  | - `beta.kubernetes.io/os:NotIn:windows`- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`                              |
| metrics-server | - `beta.kubernetes.io/os:NotIn:windows`- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`- `NoExecute:Exists`                              |

## 容忍度

_从 v1.2.4 开始提供_

可根据每个附加组件配置容忍度，并适用于部署资源。已配置的容忍度将取代现有的容忍度，因此请确保配置了所有需要的容忍度。请参阅具体的附加组件文档页面了解更多信息。
