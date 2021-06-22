---
title: 在AKS上安装Rancher
---

## 概述

本页介绍了如何在微软的 Azure Kubernetes Servcice（AKS）上安装 Rancher。

本指南使用命令行工具来配置一个带有入口的 AKS 集群。如果你喜欢使用 Azure 门户来配置你的集群，请参考[官方文档](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough-portal)。

如果你已经有一个 AKS Kubernetes 集群，请跳到关于[安装入口](#5-安装-Ingress)的步骤。 然后按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)上的说明安装 Rancher Helm Chart。

## 前提条件

- [Microsoft Azure Account](https://azure.microsoft.com/en-us/free/)。创建部署 Rancher 和 Kubernetes 的资源需要一个 Microsoft Azure 账户。
- [Microsoft Azure 订阅](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription#create-a-subscription-in-the-azure-portal)。如果你还没有微软 Azure 订阅，请使用此链接，按照教程创建一个微软 Azure 订阅。
- [Micsoroft Azure Tenant](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant)。使用此链接并按照说明创建一个 Microsoft Azure 租户。
- 你的订阅有足够的配额，至少有 2 个 vCPU。关于 Rancher 服务器资源要求的详细信息，请参阅[本节](/docs/rancher2.5/installation/requirements/_index)

部署到微软 Azure 将产生费用。

## 1. 准备好你的工作站

在你的工作站上安装以下命令行工具。

- Azure CLI 是、**az:** 如需帮助，请参考这些[安装步骤](https://docs.microsoft.com/en-us/cli/azure/)。
- **kubectl:** 如需帮助，请参考这些[安装步骤](https://kubernetes.io/docs/tasks/tools/#kubectl)。
- **helm:** 有关帮助，请参考这些[安装步骤](https://helm.sh/docs/intro/install/)。

## 2. 创建资源组

安装 CLI 后，你需要用你的 Azure 账户登录。

```bash
az login
```

创建一个[资源组](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)来容纳你的集群的所有相关资源。使用一个适用于你的使用情况的位置。

```bash
az group create --name rancher-rg --location eastus
```

## 3. 创建 AKS 集群

要创建一个 AKS 集群，运行以下命令。使用适用于你的使用情况的虚拟机大小。关于可用的尺寸和选项，请参考[本文](https://docs.microsoft.com/en-us/azure/virtual-machines/sizes)。

```bash
az aks create \
  --resource-group rancher-rg
  --name rancher-server \
  --kubernetes-version 1.18.14 \
  --node-count 3 \
  --node-vm-size Standard_D2_v3
```

该集群将需要一些时间来部署。

## 4. 获取访问凭证

在集群部署完毕后，获得访问证书。

```bash
az aks get-credentials --resource-group rancher-rg --name rancher-server
```

这个命令将你的集群的证书合并到现有的 kubeconfig 中，并允许`kubectl`与集群互动。

## 5. 安装 Ingress

集群需要一个 Ingress，以便 Rancher 可以从集群外部被访问。安装一个 Ingress 需要分配一个公共 IP 地址。确保你有足够的配额，否则它将无法分配 IP 地址。公共 IP 地址的限制适用于每个订阅的区域级别。

下面的命令安装了一个`nginx-ingress-controller`与 Kubernetes 负载平衡器服务。

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install \
  ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --version 3.12.0 \
  --create-namespace
```

## 6. 获取负载均衡器 IP

要获得负载平衡器的地址，请运行：

```bash
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

结果应该与下面类似。

```bash
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)
 AGE
ingress-nginx-controller   LoadBalancer   10.0.116.18    40.31.180.83   80:31229/TCP,443:31050/TCP
 67s
```

保存 `EXTERNAL-IP`。

## 7. 配置 DNS

到 Rancher 服务器的外部流量将需要指向你创建的负载均衡器。

设置一个 DNS 来指向你保存的`EXTERNAL-IP`。这个 DNS 将被用作 Rancher 服务器的 URL。

有许多有效的方法来设置 DNS。如需帮助，请参考[Azure DNS 文档](https://docs.microsoft.com/en-us/azure/dns/)

## 8. 安装 Rancher Helm Chart

接下来，按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)上的说明，安装 Rancher Helm chart，在任何 Kubernetes 发行版上安装 Rancher 都是一样的。

当你安装 Rancher 时，使用上一步的 DNS 名称作为 Rancher Server 的 URL。它可以作为一个 Helm 选项传入。例如，如果 DNS 名称是`rancher.my.org`，你可以用`--set hostname=rancher.my.org`选项运行 Helm 安装命令。
