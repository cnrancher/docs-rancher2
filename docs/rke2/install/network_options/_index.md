---
title: 网络选项
description: 默认情况下，RKE2 将 Canal 作为 cni 运行，VXLAN 作为默认后端，Canal 在主要组件启动并运行后通过 Helm Chart安装，可以通过修改 helm chart 选项进行自定义。
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
  - 网络选项
---

RKE2 需要一个 CNI 插件来连接 pod 和 services。Canal CNI 插件是默认的，从一开始就被支持。从 RKE2 v1.21 开始，有两个额外支持的 CNI 插件：Calico 和 Cilium。 所有的 CNI 插件都是在主要组件运行后通过 Helm Chart 安装的，可以通过修改 Helm Chart 的选项进行自定义。

本页主要介绍设置 RKE2 时可用的网络选项：

- [安装 CNI 插件](#安装-cni-插件)
- [Dual-stack 配置](#dual-stack-配置)
- [使用 Multus](#使用-multus)

## 安装 CNI 插件

接下来的标签告知如何部署每个 CNI 插件并覆盖默认选项。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="canal"
values={[
{ label: 'Canal CNI 插件', value: 'canal', },
{ label: 'Cilium CNI 插件', value: 'cilium', },
{ label: 'Calico CNI 插件', value: 'calico', },
]}>

<TabItem value="canal">

Canal 意味着使用 Flannel 处理节点间流量，使用 Calico 处理节点内流量和网络策略。默认情况下，它将使用 vxlan 封装在节点之间创建一个 overlay 网络。Canal 默认部署在 RKE2 中的，因此不需要配置就可以激活它。要覆盖默认的 Canal 选项，你应该创建一个 HelmChartConfig 资源。HelmChartConfig 资源必须与其对应的 HelmChart 的名称和命名空间相匹配。例如，要覆盖 flannel 接口，你可以应用以下配置:

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-canal
  namespace: kube-system
spec:
  valuesContent: |-
    flannel:
      iface: "eth1"
```

从 RKE2 v1.23 开始，可以使用 flannel [wireguard backend](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#wireguard) 进行内核内 WireGuard 封装和加密（[内核<5.6 的用户需要安装一个模块](https://www.wireguard.com/install/)）。这可以使用以下配置来实现：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-canal
  namespace: kube-system
spec:
  valuesContent: |-
    flannel:
      backend: "wireguard"
```

之后，通过执行 `kubectl rollout restart ds rke2-canal -n kube-system` 重新启动 canal daemonset 以使用较新的配置。

关于 Canal 配置的全部选项的更多信息，请参考[rke2-charts](https://github.com/rancher/rke2-charts/blob/main-source/packages/rke2-canal/charts/values.yaml)。

目前 RKE2 的 Window 安装中不支持 Canal。

如果你遇到 IP 分配问题，请参阅[已知的问题和限制](https://docs.rke2.io/known_issues/)。

</TabItem>

<TabItem value="cilium">

从 RKE2 v1.21 开始，Cilium 可以作为 CNI 插件被部署。要做到这一点，请将 `cilium` 作为 `--cni` 标志的值。要覆盖默认选项，请使用 HelmChartConfig 资源。HelmChartConfig 资源必须符合对应的 HelmChart 的名称和命名空间。例如，要启用 eni:

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-cilium
  namespace: kube-system
spec:
  valuesContent: |-
    eni:
      enabled: true
```

有关 Cilium chart 中可用值的更多信息，请参考[rke2-charts repository](https://github.com/rancher/rke2-charts/blob/main/charts/rke2-cilium/rke2-cilium/1.11.201/values.yaml)

Cilium 包括高级功能，可以完全取代 kube-proxy，使用 eBPF 而不是 iptables 实现服务的路由。如果你的内核不是 v5.8 或更新版本，不建议用 Cilium 取代 kube-proxy，因为重要的 bug 修复和功能会丢失。要激活这种模式，请在部署 rke2 时加入 `--disable-kube-proxy` 标志和以下 cilium 配置：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-cilium
  namespace: kube-system
spec:
  valuesContent: |-
    kubeProxyReplacement: strict
    k8sServiceHost: REPLACE_WITH_API_SERVER_IP
    k8sServicePort: REPLACE_WITH_API_SERVER_PORT
```

更多信息请查看[上游文档](https://docs.cilium.io/en/v1.11/gettingstarted/kubeproxy-free/)

目前 RKE2 的 Windows 安装中不支持 Cilium。

</TabItem>

<TabItem value="calico">

从 RKE2 v1.21 开始，Calico 可以作为 CNI 插件被部署。要做到这一点，请将 `calico` 作为 `--cni` 标志的值。要覆盖默认选项，请使用 HelmChartConfig 资源。HelmChartConfig 资源必须符合对应的 HelmChart 的名称和命名空间。例如，要改变 mtu：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-calico
  namespace: kube-system
spec:
  valuesContent: |-
    installation:
      calicoNetwork:
        mtu: 9000
```

关于 Calico chart 的可用值的更多信息，请参考[rke2-charts 资源库](https://github.com/rancher/rke2-charts/blob/main/charts/rke2-calico/rke2-calico/v3.19.2-204/values.yaml)

</TabItem>
</Tabs>

## Dual-stack 配置

IPv4/IPv6 dual-stack 网络可以为 Pod 和 Service 同时分配 IPv4 和 IPv6 地址。RKE2 从 v1.21 版（从 v1.23 开始稳定）开始支持该功能，但默认情况下并未激活。为了正确激活它，RKE2 和所选的 CNI 插件都必须进行相应的配置。要在 dual-stack 模式下配置 RKE2，你必须在 controlplane 节点中为 pods 和 service 设置一个有效的 IPv4/IPv6 dual-stack cidr。此外，你还需要在 controlplane 和 worker 节点上设置包含节点 IPv4 和 IPv6 地址的 dual-stack node-ip。要做到这一点，请使用标志 `--cluster-cidr`、`--service-cidr` 和 `--node-ip`，例如：

```bash
--cluster-cidr 10.42.0.0/16,2001:cafe:42:0::/56
--service-cidr 10.43.0.0/16,2001:cafe:42:1::/112
--node-ip 10.0.10.40,2a02:d091:a6f:4691:58c6:8609:a6d5:d1c3
```

每个 CNI 插件都需要不同的配置来实现 dual-stack：

<Tabs
defaultValue="canal"
values={[
{ label: 'Canal CNI 插件', value: 'canal', },
{ label: 'Cilium CNI 插件', value: 'cilium', },
{ label: 'Calico CNI 插件', value: 'calico', },
]}>

<TabItem value="canal">

Canal 自动检测 dual-stack 的 RKE2 配置，不需要任何额外的配置。 RKE2 的 windows 安装目前不支持双栈。

</TabItem>

<TabItem value="cilium">

Cilium 自动检测 dual-stack 的 RKE2 配置，不需要任何额外的配置。

</TabItem>

<TabItem value="calico">

Calico 自动检测 dual-stack 的 RKE2 配置，不需要任何额外配置。当以 dual-stack 模式部署时，它会创建两个不同的 ippool 资源。注意，当使用 dual-stack 时，Calico 利用 BGP 而不是 VXLAN 封装。目前 RKE2 的 windows 系统不支持 dual-stack 和 BGP。

</TabItem>
</Tabs>

## IPv6 设置

在只配置 IPv6 的情况下，RKE2 需要使用 `localhost` 来访问 ETCD pod 的 liveness URL。检查你的操作系统是否正确配置了 `/etc/hosts` 文件：

```
::1       localhost
```

## 使用 Multus

从 RKE2 v1.21 开始，可以部署 Multus CNI meta-plugin。请注意，这是为高级用户准备的。

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni)是一个 CNI 插件，能够将多个网络接口附加到 pod 上。Multus 并不取代 CNI 插件，相反，它充当了 CNI 插件的复用器。Multus 在某些用例中很有用，特别是当 pod 是网络密集型的，需要额外的网络接口来支持数据平面加速技术，如 SR-IOV。

Multus 不能独立部署。它总是需要至少一个传统的 CNI 插件，以满足 Kubernetes 集群的网络要求。该 CNI 插件成为 Multus 的默认插件，并将被用来为所有的 pod 提供主接口。

要启用 Multus，请将`multus`作为第一个值传给`--cni`标志，然后是你想和 Multus 一起使用的插件名称（如果你将只用自己的默认插件，则为`none`）。注意，Multus 必须总是在列表的第一个位置。例如，要使用 Multus 和 `canal` 作为默认插件，你可以指定 `--cni=multus,canal` 或 `--cni=multus --cni=canal`。

关于 Multus 的更多信息，请参考[multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs)文档。

### 使用 Multus 与 containernetworking 插件

任何 CNI 插件都可以作为 Multus 的次要 CNI 插件，以提供连接到一个 pod 的额外网络接口。然而，最常见的是使用由 containernetworking 团队维护的 CNI 插件（bridge、host-device、macvlan 等）作为 Multus 的辅助 CNI 插件。这些 containernetworking 插件会在安装 Multus 时自动部署。关于这些插件的更多信息，请参阅 [containernetworking plugins](https://www.cni.dev/plugins/current) 文档。

要使用这些插件中的任何一个，需要创建一个适当的 NetworkAttachmentDefinition 对象来定义二级网络的配置。然后，该定义被 pod 注释所引用，Multus 将使用这些注释来为该 pod 提供额外的接口。[multus-cni 存储库](https://github.com/k8snetworkplumbingwg/multus-cni/blob/master/docs/quickstart.md#storing-a-configuration-as-a-custom-resource)中提供了将 Macvlan cni 插件与 Mu 一起使用的示例。

## 使用 Multus 与 Whereabouts CNI

[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) 是一个 IP 地址管理（IP Address Management,IPAM）CNI 插件，用于分配整个集群的 IP 地址。
RKE2 1.22 开始支持使用 Whereabouts 与 Multus 来管理通过 Multus 创建的额外接口的 IP 地址。
为了做到这一点，你需要使用 [HelmChartConfig](/docs/rke2/helm/_index#使用-helmchartconfig-自定义打包的组件)来配置 Multus CNI 以使用 Whereabouts。

你可以创建一个名为 `/var/lib/rancher/rke2/server/manifests/rke2-multus-config.yml` 的文件，文件内容如下：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-multus
  namespace: kube-system
spec:
  valuesContent: |-
    rke2-whereabouts:
      enabled: true
```

这会将 Multus 的 chart 配置为使用 `rke2-whereabouts` 作为依赖。

如果你需要自定义 Whereabouts 镜像，配置类似如下：
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-multus
  namespace: kube-system
spec:
  valuesContent: |-
    rke2-whereabouts:
      enabled: true
      image:
        repository: ghcr.io/k8snetworkplumbingwg/whereabouts
        tag: latest-amd64
```

:::note 注意：
在启动 RKE2 之前，你需要写入该文件。
:::

### 使用 Multus 与 SR-IOV （实验性）

:::note 注意：
这是一个实验性的功能，在 v1.21.2+rke2r1 中引入。
:::

将 SR-IOV CNI 与 Multus 一起使用可以帮助解决数据平面加速的用例，在 Pod 中提供一个额外的接口，可以实现非常高的吞吐量。SR-IOV 并非在所有环境中都有效，并且必须满足一些要求才能将节点视为具有 SR-IOV 功能的节点：

- 物理网卡必须支持 SR-IOV（例如通过检查/sys/class/net/$NIC/device/sriov_totalvfs）
- 主机操作系统必须激活 IOMMU 虚拟化
- 主机操作系统包括能够进行 SR-IOV 的驱动程序（如 i40e，vfio-pci 等）

SR-IOV CNI 插件不能作为 Multus 的默认 CNI 插件使用；它必须与 Multus 和传统的 CNI 插件一起部署。SR-IOV CNI 的 helm chart 可以在 `rancher-charts` helm repo 中找到。更多信息见[Rancher Helm Charts 文档](https://rancher.com/docs/rancher/v2.x/en/helm-charts/)。

在安装完 SR-IOV CNI chart 后，将部署 SR-IOV operator。然后，用户必须指定集群中的哪些节点具有 SR-IOV 能力，给它们贴上`feature.node.kubernetes.io/network-sriov.cable=true`：

```
kubectl label node $NODE-NAME feature.node.kubernetes.io/network-sriov.capable=true
```

一旦贴上标签，sriov-network-config Daemonset 将部署一个 Pod 到节点上，以收集网络接口的信息。这些信息可以通过 `sriovnetworknodestates` 自定义资源定义获得。部署几分钟后，每个节点将有一个 `sriovnetworknodestates` 资源，节点的名称是资源名称。

关于如何使用 SR-IOV operator 的更多信息，请参考[sriov-network-operator](https://github.com/k8snetworkplumbingwg/sriov-network-operator/blob/master/doc/quickstart.md#configuration)
