---
title: 2、安装 Kubernetes
---

本节介绍如何根据[Rancher Server 环境的最佳实践](/docs/overview/architecture-recommendations/_index)在您的三个节点上安装 Kubernetes 集群。这个集群应该专用于运行 Rancher Server。我们建议使用 RKE 在这个集群上安装 Kubernetes。不应将 Rancher 安装在提供商托管的 Kubernetes 集群中，例如 EKS。

对于无法直接访问 Internet 的系统，请参阅[Rancher 离线安装指南](/docs/installation/other-installation-methods/air-gap/_index)。

> **单节点安装提示：**
> 在单节点 Kubernetes 集群中，Rancher Server 不具有高可用性，但高可用性这对于在生产环境中运行 Rancher 至关重要。如果要在短期内通过使用单个节点来节省资源，同时保留高可用性迁移路径，则在单节点集群上安装 Rancher 可能会很有用。
>
> 要设置单节点集群，在使用 RKE 配置集群时，只需在`cluster.yml`中配置一个节点。单个节点应该具有所有三个角色:`etcd`、`controlplane`和`worker`。然后，Rancher 就可以像安装在其他集群上一样，使用 Helm 安装集群。

## 创建`rancher-cluster.yml`文件

使用下面的示例，创建`rancher-cluster.yml`文件。将`nodes`列表中的 IP 地址替换为您创建的 3 个节点的 IP 地址或 DNS 名称。

如果您的节点具有公共和内部地址，建议设置`internal_address：`这样 Kubernetes 会将其用于集群内通信。某些服务（例如 AWS EC2）在使用自引用安全组或防火墙时需要设置`internal_address：`。

```yaml
nodes:
  - address: 165.227.114.63
    internal_address: 172.16.22.12
    user: ubuntu
    role: [controlplane, worker, etcd]
  - address: 165.227.116.167
    internal_address: 172.16.32.37
    user: ubuntu
    role: [controlplane, worker, etcd]
  - address: 165.227.127.226
    internal_address: 172.16.42.73
    user: ubuntu
    role: [controlplane, worker, etcd]

services:
  etcd:
    snapshot: true
    creation: 6h
    retention: 24h

# 当使用外部 TLS 终止，并且使用 ingress-nginx v0.22或以上版本时，必须。
ingress:
  provider: nginx
  options:
    use-forwarded-headers: 'true'
```

### RKE 节点选项

| 选项               | 必填 | 描述                                                             |
| ------------------ | ---- | ---------------------------------------------------------------- |
| `address`          | 是   | 公用 DNS 或 IP 地址                                              |
| `user`             | 是   | 可以运行 docker 命令的用户                                       |
| `role`             | 是   | 分配给节点的 Kubernetes 角色列表                                 |
| `internal_address` | 是   | 内部集群流量的专用 DNS 或 IP 地址                                |
| `ssh_key_path`     | 否   | 用于对节点进行身份验证的 SSH 私钥的路径（默认为`~/.ssh/id_rsa`） |

### 高级配置

RKE 有许多配置选项可用于自定义安装在您的特定环境。

请参阅[RKE 文档](https://rancher.com/docs/rke/latest/en/config-options/)来了解 RKE 的选项和功能的完整列表。

要为大规模 Rancher 安装 etcd 集群，请参阅[etcd 设置指南](/docs/installation/options/etcd/_index)。

## 运行 RKE

```
rke up --config ./rancher-cluster.yml
```

完成后，它应该以这样一行结束： `Finished building Kubernetes cluster successfully`.

## 测试集群

RKE 应该已经创建了一个文件`kube_config_rancher-cluster.yml`。该文件具有`kubectl`和`helm`的凭据。

> **注意：** 如果您使用了与`rancher-cluster.yml`不同的文件名，则 kubeconfig 文件将命名为`kube_config_<FILE_NAME>.yml`。

您可以将此文件复制到`$HOME/.kube/config`，或者如果您使用多个 Kubernetes 集群，请将`KUBECONFIG`环境变量设置为`kube_config_rancher-cluster.yml`的路径。

```
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```

使用`kubectl`测试您的连通性，并查看您的所有节点是否都处于`Ready`状态。

```
kubectl get nodes

NAME                          STATUS    ROLES                      AGE       VERSION
165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.13.5
```

## 检查集群 Pod 的运行状况

检查所有必需的 Pod 和容器是否状况良好，然后可以继续进行。

- Pod 是`Running`或`Completed`状态。
- `STATUS` 为 `Running` 的 Pod，`READY` 应该显示所有容器正在运行 (例如，`3/3`)。
- `STATUS` 为 `Completed`的 Pod 是一次运行的作业。对于这些 Pod，`READY`应为`0/1`。

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

## 保存文件

:::important 重要
需要用以下文件来进行集群维护，集群升级和故障排查。
:::

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`: RKE 集群配置文件。
- `kube_config_rancher-cluster.yml`: 集群的[Kubeconfig 文件](https://rancher.com/docs/rke/latest/en/kubeconfig/)，此文件包含用于访问集群的凭据。
- `rancher-cluster.rkestate`: [Kubernetes 集群状态文件](https://rancher.com/docs/rke/latest/en/installation/#kubernetes-cluster-state)，此文件包含用于完全访问集群的凭据。<br/><br/>_Kubernetes 集群状态文件仅在使用 RKE v0.2.0 或更高版本时创建。_

## 问题或错误？

请参阅[故障排查](/docs/installation/options/troubleshooting/_index)页面。

## [下一步：安装 Rancher](/docs/installation/k8s-install/helm-rancher/_index)
