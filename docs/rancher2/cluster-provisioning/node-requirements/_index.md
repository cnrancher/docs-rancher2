---
title: Rancher 管理的 Kubernetes 集群节点要求
description: 本页描述了安装您的应用和服务所在节点的要求。在本章节，`下游集群` 是指运行您的应用程序的集群，它应该与运行 Rancher Server 的集群（或单个节点）分开。如果 Rancher 安装在 Kubernetes 集群上，Rancher Server 集群和下游集群有不同的要求。有关 Rancher Server 安装要求，请参阅高可用安装要求。请确保 Rancher Server 的节点满足以下要求。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 创建集群
  - 下游集群节点要求
---

本页描述了 Rancher 管理的 Kubernetes 集群的要求，您的应用程序和服务将安装在这些集群中。这些下游集群应该与运行 Rancher 的集群（或单节点）分开。
如果 Rancher 安装在 Kubernetes 集群上，Rancher Server 集群和下游集群有不同的要求。有关 Rancher Server 安装要求，请参阅[高可用安装要求](/docs/rancher2/installation_new/requirements/_index)。

请确保 Rancher Server 的节点满足以下要求。

## 操作系统和 Container Runtime 运行要求

Rancher 理论上可以任何通用的 Linux 发行版和任何通用的 Docker 版本一起工作。所有下游集群的 etcd 和 controlplane 节点都需要运行在 Linux 上。Worker 节点可以运行在 Linux 或 Windows 上。在 Rancher v2.3.0 中添加了在下游集群中使用 Windows Worker 节点的功能。

Rancher 已经过测试，并官方支持在 Ubuntu，CentOS，Oracle Linux，RancherOS 和 RedHat Enterprise Linux 上运行下游集群。关于每个 Rancher 版本所测试过的操作系统和 Docker 版本的详细信息，请参阅[支持维护条款](https://rancher.cn/support-maintenance-terms/)。

所有受支持的操作系统都是 64-bit x86 系统。

如果您计划使用 ARM64，请参阅[在 ARM64 上运行（实验性）](/docs/rancher2/installation_new/resources/advanced/arm64-platform/_index)。

有关如何安装 Docker 的信息，请参阅官方[Docker 文档](https://docs.docker.com/)。

### Oracle Linux 和 RHEL 衍生的 Linux 节点

一些从 RHEL 衍生出来的 Linux 发行版，包括 Oracle Linux，可能有默认的防火墙规则，会阻止与 Helm 的通信。我们建议禁用 firewalld。对于 Kubernetes 1.19，必须关闭 firewalld。

### SUSE Linux 节点

SUSE Linux 可能有一个默认屏蔽所有端口的防火墙。在这种情况下，请参考[端口要求-打开 SUSE Linux Portslink](/docs/rancher2/installation_new/requirements/ports/_index)，打开向自定义集群添加主机所需的端口。

### Flatcar Container Linux 节点

当使用 Flatcar Container Linux 节点使用 Rancher 启动 Kubernetes 时，需要在 Cluster Config 文件中使用以下配置。

#### Canal

```
rancher_kubernetes_engine_config:
  network:
    plugin: canal
    options:
      canal_flex_volume_plugin_dir: /opt/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds
      flannel_backend_type: vxlan

  services:
    kube-controller:
      extra_args:
        flex-volume-plugin-dir: /opt/kubernetes/kubelet-plugins/volume/exec/
```

#### Calico

```
rancher_kubernetes_engine_config:
  network:
    plugin: calico
    options:
      calico_flex_volume_plugin_dir: /opt/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds
      flannel_backend_type: vxlan

  services:
    kube-controller:
      extra_args:
        flex-volume-plugin-dir: /opt/kubernetes/kubelet-plugins/volume/exec/
```

#### 启用 Docker 服务

还需要启用 Docker 服务，你可以使用以下命令启用 Docker 服务：

```
systemctl enable docker.service
```

当使用 Node Drivers 时，Docker 服务会自动启用。

### Windows 节点要求

_Rancher v2.3.0 可以使用 Windows Worker 节点_

Windows Server 的节点必须使用 Docker 企业版。这是 Kubernetes 的限制。

Windows 节点只能用于工作节点。详情请参阅[配置自定义 Windows 集群](/docs/rancher2/cluster-provisioning/rke-clusters/windows-clusters/_index)。

## 硬件要求

具有`worker`角色的节点的硬件要求主要取决于您的工作负载。运行 Kubernetes 节点组件的最小值是 1 个 CPU（核心）和 1GB 内存。

关于 CPU 和内存，建议将不同平面的 Kubernetes 集群组件（etcd、controlplane 和 worker）托管在不同的节点上，以便它们可以彼此分开扩展。

有关大型 Kubernetes 集群的硬件建议，请参阅关于[构建大型集群](https://kubernetes.io/docs/setup/best-practices/cluster-large/)的官方 Kubernetes 文档。

有关生产中 etcd 集群的硬件建议，请参阅官方[etcd 文档](https://etcd.io/docs/v3.4.0/op-guide/hardware/)。

## 网络要求

对于生产集群，我们建议您仅开放下文端口要求中定义的端口来限制流量。

需要开放的端口根据下游集群的启动方式而有所不同。下面的每个部分列出了在不同的[集群创建选项](/docs/rancher2/cluster-provisioning/_index)下需要开放的端口。

有关 kubernetes 集群中 etcd 节点、controlplane 节点和 worker 节点的端口要求的详细信息，请参阅 [Rancher Kubernetes Engine 的端口要求](/docs/rke/os/_index)。

有关在每种情况下使用哪些端口的详细信息，请参阅[端口要求](/docs/rancher2/cluster-provisioning/node-requirements/_index)。

## 可选：安全加固指南

如果你想配置一个符合 CISKubernetes 基准的 集群，我们建议在安装 Kubernetes 之前，按照我们的加固指南来配置你的节点。

有关加固指南的更多信息，以及指南的哪个版本与您的 Rancher 和 Kubernetes 版本相对应的详细信息，请参阅安全加固指南。
