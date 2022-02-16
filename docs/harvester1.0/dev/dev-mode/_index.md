---
title: 开发者模式安装
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - 开发者模式安装
description: 开发者模式用于测试和开发。
---

## 概述

开发者模式可用于测试和开发。

> 注意
> 开发者模式用于本地测试和开发。

## 要求

- Kubernetes 节点必须通过 [host-check](https://raw.githubusercontent.com/harvester/harvester/master/hack/host-check.sh)。
- 如果 Kubelet 的根目录不是 `/var/lib/kubelet`，你必须把一个`绑定挂载`创建到 `/var/lib/kubelet`，如下：

  ```bash
  KUBELET_ROOT_DIR="path to your kubelet root dir"
  echo "${KUBELET_ROOT_DIR} /var/lib/kubelet none bind 0 0" >> /etc/fstab
  mkdir -p /var/lib/kubelet && mount -a
  ```

- [**Multus**](https://kubernetes.io/docs/concepts/cluster-administration/networking/#multus-a-multi-network-plugin) 在你的集群中安装，而且会创建一个对应的 `NetworkAttachmentDefinition` CRD。
- Harvester Chart 已经包含 Kubevirt 和 Longhorn。

## 安装

如果是用于开发，你可以使用 [Helm](https://helm.sh/) CLI 把 Harvester 安装到 Kubernetes 集群上。

如需了解安装和配置 Helm Chart 的更多信息，请参见 Harvester [Helm Chart](https://github.com/harvester/harvester/blob/master/deploy/charts/harvester/README.md)。

1. 创建 cattle-system 命名空间：

   ```bash
   kubectl create ns cattle-system
   ```

1. 添加 rancher-latest Helm 仓库：

   ```bash
   helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
   ```

1. 安装 Rancher Chart：

   ```bash
   helm install rancher rancher-latest/rancher \
   --namespace cattle-system \
   --set tls=external \
   --set rancherImagePullPolicy=IfNotPresent \
   --set rancherImage=rancher/rancher \
   --set rancherImageTag=v2.6.3-harvester1 \
   --set noDefaultAdmin=false \
   --set features="multi-cluster-management=false\,multi-cluster-management-agent=false" \
   --set useBundledSystemChart=true \
   --set bootstrapPassword=admin
   ```

1. 把本地集群对象的 'status.provider' 修改为 "harvester"：

   ```bash
   kubectl edit clusters.management.cattle.io local
   ```

1. 克隆 GitHub 仓库：

   ```bash
   git clone https://github.com/harvester/harvester.git --depth=1
   ```

1. 前往 Helm Chart：

   ```bash
   cd harvester/deploy/charts
   ```

1. 创建 harvester-system 命名空间：

   ```bash
   kubectl create ns harvester-system
   ```

1. 安装 Harvester CRD Chart：

   ```bash
   helm install harvester-crd ./harvester-crd --namespace harvester-system
   ```

1. 安装 Harvester Chart：

   ```bash
   ## 为了使用服务类型的 LoadBalancer 以及在 control-plane 节点创建一个 VIP，你需要启用 kubevip。
   VIP_IP="replace with your vip ip, such as 192.168.5.10"
   VIP_NIC="replace with your vip interface name, such as eth0"
   helm install harvester ./harvester --namespace harvester-system \
   --set harvester-node-disk-manager.enabled=true \
   --set harvester-network-controller.enabled=true \
   --set harvester-load-balancer.enabled=true \
   --set kube-vip.enabled=true \
   --set kube-vip.config.vip_interface=${VIP_NIC} \
   --set kube-vip.config.vip_address=${VIP_IP} \
   --set service.vip.enabled=true \
   --set service.vip.ip=${VIP_IP}
   ```

   ```bash
   ## 在某些 Kubernetes 发行版（例如 kubeadm）中，我们需要修改 kube-vip nodeSelector 来匹配 control-plane 节点。
   --set kube-vip.nodeSelector."node-role\.kubernetes\.io/master"=""
   ```

1. 暴露 Harvester UI。

   ```bash
   ## 参见 https://kube-vip.chipzoller.dev/docs/usage/cloud-provider/Add `cidr-cattle-system: ${VIP_IP}/32` to kubevip configMap.
   kubectl -n kube-system edit cm kubevip

   ## 将 Rancher 服务类型从 ClusterIP 修改为 LoadBalancer，然后你就可以通过 https://${VIP_IP} 访问 Harvester UI。
   kubectl -n cattle-system edit svc rancher
   ```

### DigitalOcean 测试环境

你可以使用 [DigitalOcean](https://www.digitalocean.com/) 作为云提供商（支持嵌套虚拟化），在 Rancher 中创建一个测试 Kubernetes 环境。

我们推荐使用 `8 核, 16 GB RAM` droplet，这将默认启用嵌套虚拟化。

下图显示了如何创建一个 Rancher 节点模板，让 Rancher 在 DigitalOcean 中配置这样的节点：

![do.png](./do.png)

有关如何使用 Rancher 启动 DigitalOcean 节点的更多信息，请参见 [Rancher 官方文档](https://rancher.com/docs/rancher/v2.x/en/cluster-provisioning/rke-clusters/node-pools/digital-ocean/)。
