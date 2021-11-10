---
title: 安装和配置 kubectl
description: kubectl是一个对 Kubernetes 运行命令的 CLI 命令行工具。您将在 Rancher 2.x 的诸多运维和管理任务上需要使用它。
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
  - 常见问题
  - 安装和配置 kubectl
---

`kubectl`是一个对 Kubernetes 运行命令的 CLI 命令行工具。您将在 Rancher 2.x 的诸多运维和管理任务上使用 kubectl。

## 安装

查看 [kubectl 安装指南](https://kubernetes.io/docs/tasks/tools/install-kubectl/)来在您的操作系统上安装 kubectl 工具。

## 配置

当您采用 RKE 工具创建一个 Kubernets 集群，RKE 会自动在本地目录创建一个 `kube_config_cluster.yml` 文件，文件里面包含通过`kubectl`或`helm`连接到新创建的集群所需的凭证。

您可以复制文件到 `$HOME/.kube/config` 或者如果您同时管理多个集群，可通过 `KUBECONFIG` 环境变量指向到 `kube_config_cluster.yml` 文件。

```
export KUBECONFIG=$(pwd)/kube_config_cluster.yml
```

通过`kubectl`测试连通性，确定是否能获得节点列表。

```
kubectl get nodes
 NAME                          STATUS    ROLES                      AGE       VERSION
165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.10.1
165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.10.1
165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.10.1
```
