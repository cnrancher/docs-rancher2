---
title: 安装 Kubernetes
description: 可以使用 Kubernetes 的 helm 包管理工具来管理 Rancher 的安装。使用 `helm` 来可以一键安装 Rancher 及其依赖组件。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装 Kubernetes
  - 安装 Kubernetes
---

本文讲述了使用 RKE 安装具有高可用 etcd 配置的 Kubernetes 的操作步骤。请检查您的网络环境是否可以直接访问互联网，如果您使用的局域网或离线环境，请参考[离线环境安装](/docs/rancher2.5/installation/other-installation-methods/air-gap/_index)。

## 创建 `rancher-cluster.yml` 文件

使用以下 yaml 模板创建 `rancher-cluster.yml` 文件。将`nodes`列表中的`<IP_Address>` 替换为您创建的 3 个节点的 IP 地址或 DNS 名称。

> **注意事项:** 如果您的节点具有公网和内网地址，建议在`internal_address`一栏输入内网地址，以便 Kubernetes 将其用于集群内部通信。如果使用自身安全组或防火墙，则某些云服务供应商强制要求设置 `internal_address:`。

```yaml
nodes:
  - address: <IP_Address>
    internal_address: <IP_Address>
    user: ubuntu
    role:[controlplane, worker, etcd]
  - address: <IP_Address>
    internal_address: <IP_Address>
    user: ubuntu
    role:[controlplane, worker, etcd]
  - address: <IP_Address>
    internal_address: <IP_Address>
    user: ubuntu
    role:[controlplane, worker, etcd]

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24
```

### RKE 节点通用选项

| 选项               | 是否必选 | 描述                                                   |
| :----------------- | :------- | :----------------------------------------------------- |
| `address`          | 是       | 公共 DNS 或 IP 地址                                    |
| `user`             | 是       | 可以执行 docker 命令的用户                             |
| `role`             | 是       | 给节点分配的 Kubernetes 角色列表                       |
| `internal_address` | 否       | 给集群内部流量使用的私有 DNS 或者 IP 地址              |
| `ssh_key_path`     | 否       | 用来登录节点的 SSH 私钥路径 ，默认值为 `~/.ssh/id_rsa` |

### RKE 节点高级配置

RKE 有许多配置选项可用于自定义安装以适合您的特定环境。选项和功能的完整列表，请参考[RKE 文档](/docs/rke/config-options/_index)。为大型 Rancher 安装而调整 etcd 集群的信息，请参考[etcd 配置文档](/docs/rancher2.5/installation/options/etcd/_index)。

## 运行 RKE

输入以下命令，运行 RKE 节点。

```
rke up --config ./rancher-cluster.yml
```

运行结束后返回 `Finished building Kubernetes cluster successfully`，表示正常运行。

## 测试您的集群

RKE 创建了 `kube_config_rancher-cluster.yml` 文件，该文件具有 `kubectl` and `helm` 访问集群的凭证。 如果您使用了不同的文件名例如 `rancher-cluster.yml`， 那么 kube config 文件将被命名为 `kube_config_<FILE_NAME>.yml`。

您可以拷贝这个文件到 `$HOME/.kube/config`路径下。如果您使用的多个 Kubernetes 集群环境，请将环境变量 `KUBECONFIG` 设置为 `kube_config_rancher-cluster.yml` 的路径。

```
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```

使用 `kubectl` 测试连通性并检查是否所有节点都处于 `Ready` 状态。

```
kubectl get nodes

NAME                          STATUS    ROLES                      AGE       VERSION
165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.13.5
```

## 检查您的集群中 Pods 的健康情况

输入以下命令，检查所有必须的 pods 和容器是否处于健康状态。

```
kubectl get pods --all-namespaces
```

返回的信息如下：

- `STATUS`一列显示是 `Running`表示集群正在运行，`Completed` 表示集群已经完成运行。这两种状态的集群都是健康的。
- `READY` 一列显示 Pod 中 `STATUS` 列是 `Running` 状态容器的数量。
- Pods 的 `STATUS` 字段是 `Completed` 代表运行一次的任务。这些 Pods 的 `READY`列应该是 `0/1`。

```

NAMESPACE       NAME                                      READY     STATUS      RESTARTS   AGE
ingress-nginx   nginx-ingress-controller-tnsn4            1/1       Running     0          30s
ingress-nginx   nginx-ingress-controller-tw2ht            1/1       Running     0          30s
ingress-nginx   nginx-ingress-controller-v874b            1/1       Running     0          30s
kube-system     canal-jp4hz                               3/3       Running     0          30s
kube-system     canal-z2hg8                               3/3       Running     0          30s
kube-system     canal-z6kpw                               3/3       Running     0          30s
kube-system     kube-dns-7588d5b5f5-sf4vh                 3/3       Running     0          30s
kube-system     kube-dns-autoscaler-5db9bbb766-jz2k6      1/1       Running     0          30s
kube-system     metrics-server-97bc649d5-4rl2q            1/1       Running     0          30s
kube-system     rke-ingress-controller-deploy-job-bhzgm   0/1       Completed   0          30s
kube-system     rke-kubedns-addon-deploy-job-gl7t4        0/1       Completed   0          30s
kube-system     rke-metrics-addon-deploy-job-7ljkc        0/1       Completed   0          30s
kube-system     rke-network-plugin-deploy-job-6pbgj       0/1       Completed   0          30s
```

## 保存您的文件

以下文件也需要维护用于问题诊断和升级集群，请将它们保存在安全的路径下。

- `rancher-cluster.yml`: RKE 集群配置文件。
- `kube_config_rancher-cluster.yml`: 集群的[Kubeconfig 文件](/docs/rke/kubeconfig/_index)， 此文件包含用于完全访问集群的凭据。
- `rancher-cluster.rkestate`:[Kubernetes 集群状态文件](/docs/rke/installation/_index)， 此文件包含用于完全访问集群的凭据.<br/><br/>_Kubernetes 集群状态文件 只会在 RKE v0.2.0 或更高版本中被创建。_

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 遇到的问题或错误?

如果您在安装 Kubernetes 的过程中遇到问题，请参考[问题排查](/docs/rancher2.5/installation/options/helm2/kubernetes-rke/troubleshooting/_index)。

## 后续操作

[下一步: 初始化 Helm (安装 tiller)](/docs/rancher2.5/installation/options/helm2/helm-init/_index)
