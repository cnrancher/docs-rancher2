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

默认情况下，RKE2 将 Canal 作为 cni 运行，VXLAN 作为默认后端，Canal 在主要组件启动并运行后通过 Helm Chart 安装，可以通过修改 helm chart 选项进行自定义。

也可以选择用 Cilium 代替 Canal 作为 cni。

## Canal 选项

要覆盖 Canal 选项，你应该能够创建 HelmChartConfig 资源，HelmChartConfig 资源必须与其对应的 HelmChart 的名称和命名空间相匹配，例如，要覆盖 Canal 选项，您可以创建以下配置：

```
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

在安装 rke2 之前，需要将该配置复制到 manifests 目录：

```
mkdir -p /var/lib/rancher/rke2/server/manifests/
cp rke2-canal-config.yml /var/lib/rancher/rke2/server/manifests/
```

关于 Canal 配置的全部选项的更多信息，请参考[rke2-charts](https://github.com/rancher/rke2-charts/blob/main-source/packages/rke2-canal/charts/values.yaml)。

## 用 Cilium 或 Calico 代替 Canal

从 RKE2 v1.21 开始，不同的 CNI 插件可以代替 Canal 进行部署。要做到这一点，需要传递`cilium`或`calico`作为`--cni`标志的值。要覆盖默认选项，请使用 HelmChartConfig 资源，如上节所述。请注意，HelmChartConfig 资源名称必须与你所选择的 CNI 的 chart 名称相匹配 - `rke2-cilium`，`rke2-calico`，等等。

有关 Cilium chart 可用 value 的更多信息，请参考[rke2-charts 资源库](https://github.com/rancher/rke2-charts/blob/main-source/packages/rke2-cilium/charts/values.yaml)

## 使用 Multus

从 RKE2 v1.21 开始，可以部署 Multus CNI meta-plugin。请注意，这是为高级用户准备的。

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni)是一个 CNI 插件，能够将多个网络接口附加到 pod 上。Multus 并不取代 CNI 插件，相反，它充当了 CNI 插件的复用器。Multus 在某些用例中很有用，特别是当 pod 是网络密集型的，需要额外的网络接口来支持数据平面加速技术，如 SR-IOV。

Multus 不能独立部署。它总是需要至少一个传统的 CNI 插件，以满足 Kubernetes 集群的网络要求。该 CNI 插件成为 Multus 的默认插件，并将被用来为所有的 pod 提供主接口。

要启用 Multus，请将`multus`作为第一个值传给`--cni`标志，然后是你想和 Multus 一起使用的插件名称（如果你将只用自己的默认插件，则为`none`）。注意，Multus 必须总是在列表的第一个位置。例如，要使用 Multus 和 `canal` 作为默认插件，你可以指定 `--cni=multus,canal` 或 `--cni=multus --cni=canal`。

关于 Multus 的更多信息，请参考[multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs)文档。

### 使用 Multus 与 containernetworking 插件

任何 CNI 插件都可以作为 Multus 的次要 CNI 插件，以提供连接到一个 pod 的额外网络接口。然而，最常见的是使用由 containernetworking 团队维护的 CNI 插件（bridge、host-device、macvlan 等）作为 Multus 的辅助 CNI 插件。这些 containernetworking 插件会在安装 Multus 时自动部署。关于这些插件的更多信息，请参阅 [containernetworking plugins](https://www.cni.dev/plugins/current) 文档。

要使用这些插件中的任何一个，需要创建一个适当的 NetworkAttachmentDefinition 对象来定义二级网络的配置。然后，该定义被 pod 注释所引用，Multus 将使用这些注释来为该 pod 提供额外的接口。[multus-cni 存储库](https://github.com/k8snetworkplumbingwg/multus-cni/blob/master/docs/quickstart.md#storing-a-configuration-as-a-custom-resource)中提供了将 Macvlan cni 插件与 Mu 一起使用的示例。

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
