---
title: 从 RKE Add-on 安装迁移到 Helm 安装
description: 以下说明将帮助您从 RKE add-on 安装迁移到使用 Helm 软件包管理器管理 Rancher。
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
  - 升级和回滚
  - 升级高可用Rancher
  - 高可用升级指南
  - 从 RKE Add-on 安装迁移到 Helm 安装
---

> **重要提示：Rancher v2.0.8 之前仅支持 RKE add-on 安装**
>
> 如果您当前正在使用 RKE add-on 安装方法，请按照以下说明迁移到 Helm 安装。

以下说明将帮助您从 RKE add-on 安装迁移到使用 Helm 软件包管理器管理 Rancher。

您将需要安装[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)和由 RKE 生成的 kubeconfig YAML 文件(`kube_config_rancher-cluster.yml`)。

> **注意：**
>
> - 本指南假定安装了标准的 Rancher。如果您修改了任何对象名称或命名空间，请进行相应的调整。
> - 如果要从 Rancher v2.0.13 或更早版本或 v2.1.8 或更早版本升级，并且集群的证书已过期，则需要执行[其他步骤](/docs/cluster-admin/certificate-rotation/_index) 以轮换证书。

## 将 kubectl 指向 Rancher 集群

确保`kubectl`使用的是正确的 kubeconfig YAML 文件。将环境变量`KUBECONFIG`设置为指向`kube_config_rancher-cluster.yml`:

```
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```

设置环境变量 `KUBECONFIG` 之后，请验证其是否包含正确的 `server` 参数。它应直接指向端口 `6443`上的集群节点之一。

```
kubectl config view -o=jsonpath='{.clusters[*].cluster.server}'
https://NODE:6443
```

如果命令的输出显示后缀为 `/k8s/clusters`的 Rancher 主机名，则说明配置了错误的 kubeconfig YAML 文件。它应该是您使用 RKE 创建集群以运行 Rancher 时创建的文件。

## 保存您的证书

如果您已在 Rancher Cluster Ingress 上终止了 ssl，找回证书和密钥以在 Helm 安装中使用。

使用`kubectl`来获取密文，解码值并将输出到文件。

```
kubectl -n cattle-system get secret cattle-keys-ingress -o jsonpath --template='{ .data.tls\.crt }' | base64 -d > tls.crt
kubectl -n cattle-system get secret cattle-keys-ingress -o jsonpath --template='{ .data.tls\.key }' | base64 -d > tls.key
```

如果您指定了私有 CA 根证书

```
kubectl -n cattle-system get secret cattle-keys-server -o jsonpath --template='{ .data.cacerts\.pem }' | base64 -d > cacerts.pem
```

## 删除以前的 Kubernetes 对象

删除由 RKE 安装创建的 Kubernetes 对象。

> **注意：** 删除这些 Kubernetes 组件不会影响 Rancher 的配置或数据库，但是在进行任何维护后，最好事先创建数据备份。有关详细信息，请参见[备份高可用 Rancher](/docs/backups/backups/ha-backups/_index)。

```
kubectl -n cattle-system delete ingress cattle-ingress-http
kubectl -n cattle-system delete service cattle-service
kubectl -n cattle-system delete deployment cattle
kubectl -n cattle-system delete clusterrolebinding cattle-crb
kubectl -n cattle-system delete serviceaccount cattle-admin
```

## 从`rancher-cluster.yml`中删除 addons 部分

来自`rancher-cluster.yml` 的 addons 部分包含使用 RKE 部署 Rancher 所需的所有资源。通过切换到 Helm，集群配置文件中不再需要这一部分。在您喜欢的文本编辑器中打开`rancher-cluster.yml`并删除 addons 部分：

> **重要：** 确保从集群配置文件中仅删除 addons 部分。

```
nodes:
  - address: <IP> # hostname or IP to access nodes
    user: <USER> # root user (usually 'root')
    role: [controlplane,etcd,worker] # K8s roles for node
    ssh_key_path: <PEM_FILE> # path to PEM file
  - address: <IP>
    user: <USER>
    role: [controlplane,etcd,worker]
    ssh_key_path: <PEM_FILE>
  - address: <IP>
    user: <USER>
    role: [controlplane,etcd,worker]
    ssh_key_path: <PEM_FILE>

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24

## 从此处开始删除addons部分到文件结尾
addons: |-
  ---
  ...
## 文件结尾
```

## 按照 Helm 和 Rancher 安装步骤继续安装

从这里开始执行标准安装步骤。

- [3 - 初始化 Helm](/docs/installation/options/helm2/helm-init/_index)
- [4 - 安装 Rancher](/docs/installation/options/helm2/helm-rancher/_index)
