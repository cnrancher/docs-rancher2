---
title: Host Gateway（L2bridge）的网络要求
description: 本节介绍如何配置使用 _Host Gateway（L2bridge）_ 模式的自定义 Windows 集群.
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
  - 创建RKE集群
  - Windows 集群
  - 创建 Windows 集群
  - Host Gateway（L2bridge）的网络要求
---

本节介绍如何配置使用 _Host Gateway（L2bridge）_ 模式的自定义 Windows 集群.

## 禁用私有 IP 地址检查

如果您使用 _Host Gateway（L2bridge）_ 模式。并且您的节点托管在下面列出的任何云服务上，那么您必须在启动时禁用 Linux 和 Windows 主机的私有 IP 地址检查。请按照下面每个服务提供的操作说明，禁用 Windows 集群中每个节点的此项检查。

| 服务          | 禁用私有 IP 地址检查的说明                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon EC2    | [禁用源/目标检查](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck)                             |
| Google 谷歌云 | [为实例启用 IP 转发](https://cloud.google.com/vpc/docs/using-routes#canipforward) (默认情况下，虚拟机无法转发由另一个虚拟机发出的数据包。)     |
| Azure VM      | [启用或禁用 IP 转发](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface#enable-or-disable-ip-forwarding) |

## 配置云托管的虚拟机的路由

如果您使用的 Flannel 后端是[**Host Gateway（L2bridge）**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)模式，那么同一节点上的所有容器都属于一个私有子网，子网会通过主机网络和另一个节点上的子网进行通信。

- 如果您的节点在 AWS、私有数据中心或裸金属服务器上，请确保这些节点都在相同的 2 层子网中。如果节点不属于同一个 2 层子网，那么`host-gw`网络将无法正常工作。

- 如果您的节点在谷歌云或 Azure 上，那么它们会在不同的 2 层子网中。谷歌云和 Azure 上的节点属于一个可路由的 3 层网络。请按照下面的说明，来配置谷歌云和 Azure，以便云网络知道如何在每个节点上路由主机子网。

要在谷歌云或 Azure 上配置主机子网路由，首先运行以下命令来查找每个工作节点上的主机子网：

```bash
kubectl get nodes -o custom-columns=nodeName:.metadata.name,nodeIP:status.addresses[0].address,routeDestination:.spec.podCIDR
```

然后按照每个云提供商的说明为每个节点配置路由规则：

| 服务   | 说明                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 谷歌云 | 如果节点在谷歌云，您需要为每个节点添加一个静态路由：[添加静态路由](https://cloud.google.com/vpc/docs/using-routes#addingroute)。                                   |
| Azure  | 如果节点在 Azure，您需要创建一个路由表：[自定义路由:用户定义](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#user-defined)。 |
