---
title: 在 Azure Kubernetes Service 上安装 Rancher
shortTitle: AKS
weight: 4
---

本文介绍了如何在微软的 Azure Kubernetes Service (AKS) 上安装 Rancher。

本指南使用命令行工具来配置一个带有 Ingress 的 AKS 集群。如果你更喜欢使用 Azure 门户来配置集群，请参见[官方文档](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal)。

如果你已有一个 AKS Kubernetes 集群，请直接跳到[安装 Ingress](#5-install-an-ingress) 的步骤，然后按照[此页]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/#install-the-rancher-helm-chart)的说明安装 Rancher Helm Chart。

# 前提

> **注意**
> 部署到 Microsoft Azure 会产生费用。

- [Microsoft Azure 账号](https://azure.microsoft.com/en-us/free/)：用于创建部署 Rancher 和 Kubernetes 的资源。
- [Microsoft Azure 订阅](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription#create-a-subscription-in-the-azure-portal)：如果你没有的话，请访问此链接查看如何创建 Microsoft Azure 订阅。
- [Micsoroft Azure 租户](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant)：访问此链接并参考教程以创建 Microsoft Azure 租户。
- 你的订阅有足够的配额，至少有 2 个 vCPU。有关 Rancher Server 资源要求的详情，请参见[此节]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/#rke-and-hosted-kubernetes)。
- 在 Azure 中用 Helm 安装 Rancher 时，请使用 L7 负载均衡器来避免网络问题。详情请参见 [Azure 负载均衡器限制](https://docs.microsoft.com/en-us/azure/load-balancer/components#limitations)。

# 1. 准备你的工作站

在工作站上安装以下命令行工具：

- Azure CLI，**az**：如需获得帮助，请参见[安装步骤](https://docs.microsoft.com/en-us/cli/azure/)。
- **kubectl**：如需获得帮助，请参见[安装步骤](https://kubernetes.io/docs/tasks/tools/#kubectl)。
- **helm**：如需获取帮助，请参见[安装步骤](https://helm.sh/docs/intro/install/)。

# 2. 创建资源组

安装 CLI 后，你需要用你的 Azure 账户登录。

```
az login
```

创建一个 [资源组](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal) 来保存集群的所有相关资源。使用一个适用于你实际情况的位置。

```
az group create --name rancher-rg --location eastus
```

# 3. 创建 AKS 群集

运行以下命令创建一个 AKS 集群。选择适用于你实际情况的虚拟机大小。如需获得可用的大小和选项，请参见[此处](https://docs.microsoft.com/en-us/azure/virtual-machines/sizes)。在选择 Kubernetes 版本时，请务必先查阅[支持矩阵](https://rancher.com/support-matrix/)，以找出已针对你的 Rancher 版本验证的最新 Kubernetes 版本。

```
az aks create \
  --resource-group rancher-rg \
  --name rancher-server \
  --kubernetes-version 1.20.7 \
  --node-count 3 \
  --node-vm-size Standard_D2_v3
```

集群部署需要一些时间才能完成。

# 4. 获取访问凭证

集群部署完成后，获取访问凭证。

```
az aks get-credentials --resource-group rancher-rg --name rancher-server
```

此命令把集群的凭证合并到现有的 kubeconfig 中，并允许 `kubectl` 与集群交互。

# 5. 安装 Ingress

集群需要一个 Ingress，以从集群外部访问 Rancher。要 Ingress，你需要分配一个公共 IP 地址。请确保你有足够的配额，否则它将无法分配 IP 地址。公共 IP 地址的限制在每个订阅的区域级别生效。

以下命令安装了带有 Kubernetes 负载均衡器服务的 `nginx-ingress-controller`。

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install \
  ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --version 3.12.0 \
  --create-namespace
```

# 6. 获取负载均衡器的 IP

运行以下命令获取负载均衡器的 IP 地址：

```
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

返回的结果应与以下内容类似：

```
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)
 AGE
ingress-nginx-controller   LoadBalancer   10.0.116.18    40.31.180.83   80:31229/TCP,443:31050/TCP
 67s
```

保存 `EXTERNAL-IP`。

# 7. 设置 DNS

到 Rancher Server 的外部流量需要重定向到你创建的负载均衡器。

创建指向你保存的 `EXTERNAL-IP` 的 DNS。这个 DNS 会用作 Rancher Server 的 URL。

设置 DNS 的有效方法有很多。如需获取帮助，请参见 [Azure DNS 文档中心](https://docs.microsoft.com/en-us/azure/dns/)。

# 8. 安装 Rancher Helm Chart

按照[本页]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/#install-the-rancher-helm-chart)的说明安装 Rancher Helm Chart。任何 Kubernetes 发行版上安装的 Rancher 的 Helm 说明都是一样的。

安装 Rancher 时，使用上一步获取的 DNS 名称作为 Rancher Server 的 URL。它可以作为 Helm 选项传递进来。例如，如果 DNS 名称是 `rancher.my.org`，你需要使用 `--set hostname=rancher.my.org` 选项来运行 Helm 安装命令。
