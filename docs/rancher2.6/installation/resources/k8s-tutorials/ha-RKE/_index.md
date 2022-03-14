---
title: 配置高可用的 RKE Kubernetes 集群
shortTitle: 配置 RKE Kubernetes
weight: 3
---


本文介绍如何安装 Kubernetes 集群。该集群应专用于运行 Rancher Server。

> Rancher 可以运行在任何 Kubernetes 集群上，包括托管的 Kubernetes，例如 Amazon EKS。以下说明只是安装 Kubernetes 其中一种方式。

如果系统无法直接访问互联网，请参见[离线环境：Kubernetes 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/)。

> **单节点安装提示**：
> 在单节点 Kubernetes 集群中，Rancher Server 不具备高可用性，而高可用性对在生产环境中运行 Rancher 非常重要。但是，如果你想要短期内使用单节点节省资源，同时又保留高可用性迁移路径，把 Rancher 安装到单节点集群也是合适的。
>
> 要设置单节点 RKE 集群，在 `cluster.yml` 中配置一个节点。该节点需具备所有三个角色，分别是`etcd`，`controlplane`和`worker`。
>
> 在这两种单节点设置中，Rancher 可以与 Helm 一起安装在 Kubernetes 集群上，安装方法与安装到其他集群上一样。

## 安装 Kubernetes

### 所需的 CLI 工具

安装 Kubernetes 命令行工具 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)。

安装 [RKE]({{<baseurl>}}/rke/latest/en/installation/)（Rancher Kubernetes Engine，是一个 Kubernetes 发行版和命令行工具）。

### 1. 创建集群配置文件

在这部分，你将创建一个名为 `rancher-cluster.yml`的 Kubernetes 集群配置文件。在后续使用 RKE 命令设置集群的步骤中，此文件会用于在节点上安装 Kubernetes。

使用下面的示例作为指南，创建 `rancher-cluster.yml` 文件。将 `nodes` 列表中的 IP 地址替换为你创建的 3 个节点的 IP 地址或 DNS 名称。

如果你的节点有公共地址和内部地址，建议设置 `internal_address:` 以便 Kubernetes 使用它实现集群内部通信。如果你想使用引用安全组或防火墙，某些服务（如 AWS EC2）要求设置 `internal_address:`。

RKE 需要通过 SSH 连接到每个节点，它会在 `~/.ssh/id_rsa`的默认位置查找私钥。如果某个节点的私钥不在默认位置中，你还需要为该节点配置 `ssh_key_path` 选项。

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

# Required for external TLS termination with
# ingress-nginx v0.22+
ingress:
  provider: nginx
  options:
    use-forwarded-headers: "true"
```

<figcaption>通用 RKE 节点选项</figcaption>

| 选项 | 是否必填 | 描述 |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| `address` | 是 | 公共 DNS 或 IP 地址 |
| `user` | 是 | 可以运行 docker 命令的用户 |
| `role` | 是 | 分配给节点的 Kubernetes 角色列表 |
| `internal_address` | 否 | 内部集群流量的私有 DNS 或 IP 地址 |
| `ssh_key_path` | 否 | 用来验证节点的 SSH 私钥文件路径（默认值为 `~/.ssh/id_rsa`） |

> **高级配置**：RKE 提供大量配置选项，用于针对你的环境进行自定义安装。
>
> 如需了解选项和功能的完整列表，请参见 [RKE 官方文档]({{<baseurl>}}/rke/latest/en/config-options/)。
>
> 要为大规模 Rancher 安装优化 etcd 集群，请参见 [etcd 设置指南]({{<baseurl>}}/rancher/v2.6/en/installation/resources/advanced/etcd/)。
>
> 有关 Dockershim 支持的详情，请参见[此页面]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/dockershim/)。

### 2. 运行 RKE

```
rke up --config ./rancher-cluster.yml
```

完成后，结束行应该是：`Finished build Kubernetes cluster succeeded`。

### 3. 测试集群

本节介绍如何设置工作区，以便你可以使用 `kubectl` 命令行工具与此集群进行交互。

如果你已安装 `kubectl`，你需要将 `kubeconfig` 文件放在 `kubectl` 可访问的位置。`kubeconfig` 文件包含使用 `kubectl` 访问集群所需的凭证。

你在运行 `rke up` 时，RKE 应该已经创建了一个名为 `kube_config_cluster.yml`的 `kubeconfig` 文件。该文件具有 `kubectl` 和 `helm`的凭证。

> **注意**：如果你的文件名不是 `rancher-cluster.yml`，kubeconfig 文件将命名为 `kube_config_<FILE_NAME>.yml`。

将此文件移动到 `$HOME/.kube/config`。如果你使用多个 Kubernetes 集群，将 `KUBECONFIG` 环境变量设置为 `kube_config_cluster.yml` 的路径:

```
export KUBECONFIG=$(pwd)/kube_config_cluster.yml
```

用 `kubectl` 测试你的连接性，并查看你的所有节点是否都处于 `Ready` 状态：

```
kubectl get nodes

NAME                          STATUS    ROLES                      AGE       VERSION
165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.13.5
```

### 4. 检查集群 Pod 的健康状况

检查所有需要的 Pod 和容器是否健康。

- Pod 处于 `Running` 或 `Completed` 状态。
- `READY` 表示运行 `STATUS` 为 `Running` 的 Pod 的所有容器（例如， `3/3`）。
- `STATUS` 为 `Completed` 的 Pod 是一次运行的 Job。这些 Pod `READY` 列的值应该为 `0/1`。

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

这表示你已成功安装了可运行 Rancher Server 的 Kubernetes 集群。

### 5. 保存你的文件

> **重要提示**：请妥善保管以下文件，以对集群进行维护，故障排查和升级。

将以下文件的副本保存在安全位置：

- `rancher-cluster.yml`：RKE 集群配置文件。
- `kube_config_cluster.yml`：集群的 [Kubeconfig 文件]({{<baseurl>}}/rke/latest/en/kubeconfig/)。该文件包含可完全访问集群的凭证。
- `rancher-cluster.rkestate`：[Kubernetes 状态文件]({{<baseurl>}}/rke/latest/en/installation/#kubernetes-cluster-state)。此文件包括用于完全访问集群的凭证。<br/><br/>_Kubernetes 集群状态文件仅在 RKE 版本是 0.2.0 或更高版本时生成。_

> **注意**：后两个文件名中的 `rancher-cluster` 部分取决于你命名 RKE 集群配置文件的方式。

### 故障排查

参见[故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/resources/troubleshooting/)页面。


### 后续操作
[安装 Rancher]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/)

