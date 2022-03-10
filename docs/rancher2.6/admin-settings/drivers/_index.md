---
title: 配置驱动
weight: 70
---

使用 Rancher 中的驱动，你可以管理可以使用哪些供应商来部署[托管的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/)或[云服务器节点]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/)，以允许 Rancher 部署和管理 Kubernetes。

### Rancher 驱动

你可以启用或禁用 Rancher 中内置的驱动。如果相关驱动 Rancher 尚未实现，你可以添加自己的驱动。

Rancher 中有两种类型的驱动：

- [集群驱动](#cluster-drivers)
- [主机驱动](#node-drivers)

### 集群驱动

集群驱动用于配置[托管的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/)，例如 GKE、EKS、AKS 等。创建集群时可以显示的集群驱动，是由集群驱动的状态定义的。只有 `active` 集群驱动将显示为为托管 Kubernetes 集群创建集群的选项。默认情况下，Rancher 与几个现有的集群驱动打包在一起，但你也可以创建自定义集群驱动并添加到 Rancher。

默认情况下，Rancher 已激活多个托管 Kubernetes 云提供商，包括：

- [Amazon EKS]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/eks/)
- [Google GKE]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/gke/)
- [Azure AKS]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/aks/)

还有几个托管的 Kubernetes 云提供商是默认禁用的，但也打包在 Rancher 中：

- [Alibaba ACK]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/ack/)
- [Huawei CCE]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/cce/)
- [Tencent]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/tke/)

### 主机驱动

主机驱动用于配置主机，Rancher 使用这些主机启动和管理 Kubernetes 集群。主机驱动与 [Docker Machine 驱动](https://docs.docker.com/machine/drivers/)相同。创建主机模板时可以显示的主机驱动，是由主机驱动的状态定义的。只有 `active` 主机驱动将显示为创建节点模板的选项。默认情况下，Rancher 与许多现有的 Docker Machine 驱动打包在一起，但你也可以创建自定义主机驱动并添加到 Rancher。

如果你不想向用户显示特定的主机驱动，则需要停用这些主机驱动。

Rancher 支持几家主要的云提供商，但默认情况下，这些主机驱动处于 active 状态并可供部署：

- [Amazon EC2]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/ec2/)
- [Azure]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/azure/)
- [Digital Ocean]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/digital-ocean/)
- [vSphere]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/vsphere/)

还有其他几个默认禁用的主机驱动，但打包在 Rancher 中：

- [Harvester]({{<baseurl>}}/rancher/v2.6/en/virtualization-admin/#harvester-node-driver/)，在 Rancher 2.6.1 中可用
