---
title: RKE 插件
---

RKE 支持在集群 yaml 文件中配置插件选项，这些插件用于部署多种集群组件，包括：

- [网络插件](/docs/rke/config-options/add-ons/network-plugins/_index)
- [Ingress controller 插件](/docs/rke/config-options/add-ons/ingress-controllers/_index)
- [DNS 提供商插件](/docs/rke/config-options/add-ons/dns/_index)
- [Metrics Server 插件](/docs/rke/config-options/add-ons/metrics-server/_index)

这些插件的镜像文件可以在[`system_images`](/docs/rke/config-options/system-images/_index)中找到。对于每个 Kubernetes 版本，都有与每个插件相关联的默认镜像版本，但这些镜像可以通过更改`system_images`中的镜像来覆盖。

注意：

- 除了这些 RKE 已有的插件外，您在集群部署完成，部署自定义插件，详情请参考[自定义插件](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)。
- 从 v0.1.8 开始，如果插件名称相同，RKE 会执行更新。
- 在 v0.1.8 之前，您需要运行`kubectl edit`命令更新插件。

## 关键插件与非关键插件

从 v0.1.7 开始，插件被分为关键插件与非关键插件：

- **关键插件：** 如果部署失败，会导致 RKE 报错
- **非关键插件：** 如果部署失败，RKE 会在日志中记录一个告警，并继续部署其他插件

当前只有[网络插件](/docs/rke/config-options/add-ons/network-plugins/_index)是**关键插件**，其他插件都是**非关键插件**。

## 插件部署 job

RKE 使用 Kubernetes job 的方式部署插件。在某些情况下，部署插件的时间会比预期时间长。从 v0.1.7 开始，RKE 提供集群层级的`addon_job_timeout`选项，以检查 job 的连接是否超时，默认值为 30，单位是秒。

```yaml
addon_job_timeout: 30
```

## Add-on 位置

_v0.2.3 或更新版本可用_

| 组件           | nodeAffinity nodeSelectorTerms                                                          | nodeSelector                  | Tolerations                                                                      |
| :------------- | :-------------------------------------------------------------------------------------- | :---------------------------- | :------------------------------------------------------------------------------- |
| Calico         | `beta.kubernetes.io/os:NotIn:windows`                                                   | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`<br/>- `CriticalAddonsOnly:Exists` |
| Flannel        | `beta.kubernetes.io/os:NotIn:windows`                                                   | none                          | - `operator:Exists`                                                              |
| Canal          | `beta.kubernetes.io/os:NotIn:windows`                                                   | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`<br/>- `CriticalAddonsOnly:Exists` |
| Weave          | `beta.kubernetes.io/os:NotIn:windows`                                                   | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`                                   |
| CoreDNS        | `node-role.kubernetes.io/worker:Exists`                                                 | `beta.kubernetes.io/os:linux` | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`<br/>- `CriticalAddonsOnly:Exists` |
| kube-dns       | - `beta.kubernetes.io/os:NotIn:windows`<br/>- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`<br/>- `CriticalAddonsOnly:Exists` |
| nginx-ingress  | - `beta.kubernetes.io/os:NotIn:windows`<br/>- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`                                   |
| metrics-server | - `beta.kubernetes.io/os:NotIn:windows`<br/>- `node-role.kubernetes.io/worker` `Exists` | none                          | - `NoSchedule:Exists`<br/>- `NoExecute:Exists`                                   |
