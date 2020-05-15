---
title: 轮换证书
description: 轮换 Kubernetes 证书可能会导致集群在重新启动组件时暂时不可用。对于生产环境，建议在维护时段内执行此操作。默认情况下，Kubernetes 集群需要证书，并且 Rancher 启动的 Kubernetes 集群会自动为 Kubernetes 组件生成证书。在证书过期之前以及证书被泄露之后，轮换这些证书非常重要。轮换证书后，Kubernetes 组件将自动重新启动。可以为以下服务轮换证书：etcd、kubelet、kube-apiserver、kube-proxy、kube-scheduler、kube-controller-manager。
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
  - 集群管理员指南
  - 轮换证书
---

:::note 警告
轮换 Kubernetes 证书可能会导致集群在重新启动组件时暂时不可用。对于生产环境，建议在维护时段内执行此操作。
:::

默认情况下，Kubernetes 集群需要证书，并且 Rancher 启动的 Kubernetes 集群会自动为 Kubernetes 组件生成证书。在证书过期之前以及证书被泄露之后，轮换这些证书非常重要。轮换证书后，Kubernetes 组件将自动重新启动。

可以为以下服务轮换证书：

- etcd
- kubelet
- kube-apiserver
- kube-proxy
- kube-scheduler
- kube-controller-manager

## Rancher v2.2.x 中的证书轮换

Rancher 启动的 Kubernetes 集群（RKE 集群）能够通过 UI 轮换自动生成的证书。

1. 在**全局**视图中，导航到要轮换证书的集群。

2. 选择**省略号（...）>轮换证书**。

3. 选择要轮换的证书。

   - 轮换所有服务证书（保持相同的 CA）
   - 轮换单个服务，然后从下拉菜单中选择一项服务

4. 单击**保存**。

**结果：**所选证书将被轮换，相关服务将重新启动以开始使用新证书。

> **注意：** 尽管 RKE CLI 可以为 Kubernetes 集群组件使用自定义证书，但目前 Rancher 不支持在 Rancher UI 中创建 RKE 集群时上传这些证书。

## Rancher v2.1.x 和 v2.0.x 中的证书轮换

_在版本 v2.0.14 以及 v2.1.9 中支持_

Rancher 启动的 Kubernetes 集群能够通过 API 轮换自动生成的证书。

1.在**全局**视图中，导航到要轮换证书的集群。

2.选择**省略号（...）>在 API 中查看**。

3.单击 **RotateCertificates**。

4.单击**显示请求**。

5.单击**发送请求**。

**结果：**所有 Kubernetes 证书将被轮换。

## 升级较旧的 Rancher 版本后轮换过期的证书

如果要从 Rancher v2.0.13 或更早版本或 v2.1.8 或更早版本升级，并且您的集群已过期证书，则需要一些手动步骤来完成证书轮换。

1. 对于 `controlplane` 和 `etcd` 节点，登录到每个对应的主机，并检查证书 `kube-apiserver-requestheader-ca.pem` 是否在以下目录中：

   ```bash
   cd /etc/kubernetes/.tmp
   ```

   如果证书不在目录中，请执行以下命令：

   ```bash
   cp kube-ca.pem kube-apiserver-requestheader-ca.pem
   cp kube-ca-key.pem kube-apiserver-requestheader-ca-key.pem
   cp kube-apiserver.pem kube-apiserver-proxy-client.pem
   cp kube-apiserver-key.pem kube-apiserver-proxy-client-key.pem
   ```

   如果`.tmp`目录不存在，则可以将整个 SSL 证书复制到`.tmp`中：

   ```bash
   cp -r /etc/kubernetes/ssl /etc/kubernetes/.tmp
   ```

1. 轮换证书。对于 Rancher v2.0.x 和 v2.1.x，请使用 [Rancher API](#rancher-v21x-和-v20x-中的证书轮换)，对于 Rancher 2.2.x 请使用[Rancher UI](#rancher-v22x-中的证书轮换)。

1. 命令完成后，检查 `worker` 节点是否处于活动状态。如果不是，请登录到每个 `worker` 节点，然后重新启动 kubelet 和 agent。
