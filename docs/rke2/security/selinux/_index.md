---
title: SELinux
description: RKE2 可以在支持 SELinux 的系统上运行，这是在 CentOS/RHEL 7/8 上安装时的默认设置。支持该策略的[policy](https://github.com/rancher/rke2-selinux)是针对 containerd 的[container-selinux](https://github.com/containers/container-selinux)策略的一个特殊版本。它说明了 containerd 安装的非标准位置，并将持久性和短暂性的状态。
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
  - RKE2
  - SELinux
---


RKE2 可以在支持 SELinux 的系统上运行，这是在 CentOS/RHEL 7/8 上安装时的默认设置。支持该策略的[policy](https://github.com/rancher/rke2-selinux)是针对 containerd 的[container-selinux](https://github.com/containers/container-selinux)策略的一个特殊版本。它说明了 containerd 安装的非标准位置，并将持久性和短暂性的状态。

#### 自定义上下文标签

RKE2 将 control-plane 服务作为静态 pod 运行，需要访问多个[`container_var_lib_t`](https://github.com/containers/container-selinux/blob/RHEL7.5/container.te#L59)位置。`etcd`容器必须能够在`/var/lib/rancher/rke2/server/db`下读写，并与`kube-apiserver`、`kube-controller-manager`和`kube-scheduler`一起从`/var/lib/rancher/rke2/server/tls`读取。为了不过度授权，例如[`spc_t`](https://github.com/containers/container-selinux/blob/RHEL7.5/container.te#L47-L49)，RKE2 SELinux 策略引入了[`rke2_service_db_t`](https://github.com/rancher/rke2-selinux/blob/v0.3.latest.1/rke2.te#L15-L21)和[`rke2_service_t`](https://github.com/rancher/rke2-selinux/blob/v0.3.latest.1/rke2.te#L9-L13)上下文标签，分别为读写和只读访问。这些标签将仅应用于 RKE2 control-plane 的静态 pod。

#### 配置

RKE2 对 SELinux 的支持只有一个配置项，即`--selinux`布尔标志。这是一个通向[containerd/cri toml 的 cri 部分的`enable_selinux`布尔值](https://github.com/containerd/cri/blob/release/1.4/docs/config.md)的通道。如果 RKE2 是通过 tarball 安装的，那么如果不进行额外的配置，SELinux 将不会被启用。推荐的配置方法是在 RKE2 的 `config.yaml` 中加入一个条目，例如：

```yaml
# /etc/rancher/rke2/config.yaml 是默认位置
selinux: true
```

这相当于在`rke2 server`或`rke2 agent`命令行中传递`--selinux`标志，或者设置 `RKE2_SELINUX=true` 环境变量。
