---
title: 安装 Kubernetes
description: 可以使用 Kubernetes 的 helm 包管理工具来管理 Rancher 的安装。使用 `helm` 来可以一键安装 Rancher 及其依赖组件。
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
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装 Kubernetes
  - 安装 Kubernetes
---

使用 RKE 安装具有高可用 etcd 配置的 Kubernetes。

> **注意事项:** 对于无法直接访问互联网的系统请参考[离线环境安装](/docs/installation/other-installation-methods/air-gap/_index)。

## 创建 `rancher-cluster.yml` 文件

使用以下示例创建 `rancher-cluster.yml` 文件。将`节点`列表中的 IP 地址替换为您创建的 3 个节点的 IP 地址或 DNS 名称。

> **注意事项:** 如果您的节点具有公共和内部地址，建议设置`internal_address:`，以便 Kubernetes 将其用于集群内部通信。如果使用自身安全组或防火墙，则某些服务例如 AWS EC2 需要设置 `internal_address:`。

```yaml
nodes:
  - address: 165.227.114.63
    internal_address: 172.16.22.12
    user: ubuntu
    role:[controlplane, worker, etcd]
  - address: 165.227.116.167
    internal_address: 172.16.32.37
    user: ubuntu
    role:[controlplane, worker, etcd]
  - address: 165.227.127.226
    internal_address: 172.16.42.73
    user: ubuntu
    role:[controlplane, worker, etcd]

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24
```

### RKE 节点通用选项

| 选项               | 必选项 | 描述                                                   |
| ------------------ | ------ | ------------------------------------------------------ |
| `address`          | 是     | 公共 DNS 或 IP 地址                                    |
| `user`             | 是     | 可以执行 docker 命令的用户                             |
| `role`             | 是     | 一列给这个节点分配的 Kubernetes 角色                   |
| `internal_address` | 否     | 给集群内部流量使用的私有 DNS 或者 IP 地址              |
| `ssh_key_path`     | 否     | 用来登录节点的 SSH 私钥路径 (默认值为 `~/.ssh/id_rsa`) |

### 高级配置

RKE 有许多配置选项可用于自定义安装以适合您的特定环境。

有关选项和功能的完整列表，请参阅[RKE 文档](https://rancher.com/docs/rke/latest/en/config-options/)。

有关为大型 Rancher 安装而调整 etcd 集群的信息，请参见[etcd 配置文档](/docs/installation/options/etcd/_index)。

## 运行 RKE

```
rke up --config ./rancher-cluster.yml
```

正常运行结束会打印: `Finished building Kubernetes cluster successfully`。

## 测试您的集群

RKE 应该已经创建了 `kube_config_rancher-cluster.yml` 文件. 该文件具有 `kubectl` and `helm` 访问集群的凭证。

> **注意事项:** 如果您使用了不同的文件名例如 `rancher-cluster.yml`， 那么 kube config 文件将被命名为 `kube_config_<FILE_NAME>.yml`。

您可以拷贝这个文件到 `$HOME/.kube/config` 或者 如果使用多个 Kubernetes 集群，请将环境变量 `KUBECONFIG` 设置为 `kube_config_rancher-cluster.yml` 的路径。

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

检查所有必须的 pods 和容器是否处于健康状态。

- Pods 是 `Running` 或者 `Completed` 状态。
- `READY` 列显示 Pod 中 `STATUS` 列是 `Running` 状态容器的数量。
- Pods 的 `STATUS` 字段是 `Completed` 代表运行一次的任务。这些 Pods 的 `READY`列应该是 `0/1`。

```
kubectl get pods --all-namespaces

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

> **重要**
> 以下文件也需要维护用于问题诊断和升级集群。

将以下文件拷贝并保存在安全的位置:

- `rancher-cluster.yml`: RKE 集群配置文件。
- `kube_config_rancher-cluster.yml`: 集群的[Kubeconfig 文件](https://rancher.com/docs/rke/latest/en/kubeconfig/)， 此文件包含用于完全访问集群的凭据。
- `rancher-cluster.rkestate`:[Kubernetes 集群状态文件](https://rancher.com/docs/rke/latest/en/installation/#kubernetes-cluster-state)， 此文件包含用于完全访问集群的凭据.<br/><br/>_Kubernetes 集群状态文件 只会在 RKE v0.2.0 或更高版本中被创建。_

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 遇到的问题或错误?

参阅[常见问题](/docs/installation/options/helm2/kubernetes-rke/troubleshooting/_index)。

## [下一步: 初始化 Helm (安装 tiller)](/docs/installation/options/helm2/helm-init/_index)
