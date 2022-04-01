---
title: Host Gateway (L2bridge) 的网络要求
weight: 1000
---

本节介绍如何配置使用 _Host Gateway (L2bridge)_ 模式的自定义 Windows 集群。

### 禁用私有 IP 地址检查

如果你使用 _Host Gateway (L2bridge)_ 模式，并将节点托管在下面列出的云服务上，则必须在启动时禁用 Linux 或 Windows 主机的私有 IP 地址检查。要为每个节点禁用此检查，请按照以下各个云服务对应的说明进行操作：

| 服务       | 禁用私有 IP 地址检查的说明                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon EC2 | [禁用源/目标检查](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck)                             |
| Google GCE | [为实例启用 IP 转发](https://cloud.google.com/vpc/docs/using-routes#canipforward)（默认情况下，VM 无法转发由另一个 VM 发起的数据包）           |
| Azure VM   | [启用或禁用 IP 转发](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface#enable-or-disable-ip-forwarding) |

### 云托管虚拟机的路由配置

如果是使用 Flannel 的 [**Host Gateway (L2bridge)**](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) 后端，同一节点上的所有容器都属于私有子网，流量通过主机网络从一个节点上的子网路由到在另一个节点上的子网。

- 在 AWS、虚拟化集群或裸机服务器上配置 worker 节点时，请确保它们属于同一个第 2 层子网。如果节点不属于同一个第 2 层子网，`host-gw` 网络将不起作用。

- 在 GCE 或 Azure 上配置 worker 节点时，节点不在同一个第 2 层子网上。GCE 和 Azure 上的节点属于可路由的第 3 层网络。按照以下说明配置 GCE 和 Azure，以便云网络知道如何在每个节点上传送主机子网。

要在 GCE 或 Azure 上配置主机子网路由，首先运行以下命令，以找出每个 worker 节点上的主机子网：

```bash
kubectl get nodes -o custom-columns=nodeName:.metadata.name,nodeIP:status.addresses[0].address,routeDestination:.spec.podCIDR
```

然后按照各个云提供商的说明，为每个节点配置路由规则：

| 服务       | 说明                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Google GCE | 为每个节点添加静态路由：[添加静态路由](https://cloud.google.com/vpc/docs/using-routes#addingroute)。                                        |
| Azure VM   | 创建一个路由表：[自定义路由：用户定义](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#user-defined)。 |
