---
title: 为 Rancher 设置高可用 K3s Kubernetes 集群
shortTitle: 为 Rancher 配置 K3s
weight: 2
---

本文介绍了如何根据 [Rancher Server 环境的最佳实践]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#environment-for-kubernetes-installations)安装 Kubernetes 集群。

如果你的系统无法直接访问互联网，请参见离线安装说明。

> **单节点安装提示**：
> 在单节点 Kubernetes 集群中，Rancher Server 不具备高可用性，而高可用性对在生产环境中运行 Rancher 非常重要。但是，如果你想要短期内使用单节点节省资源，同时又保留高可用性迁移路径，把 Rancher 安装到单节点集群也是合适的。
>
> 要配置单节点 K3s 集群，你只需要在单个节点上运行 Rancher Server 安装命令（不需要在两个节点上运行命令）。
>
> 在这两种单节点设置中，Rancher 可以与 Helm 一起安装在 Kubernetes 集群上，安装方法与安装到其他集群上一样。

## 前提

以下说明假设你已参见[此章节]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha-with-external-db/)配置好两个节点，一个负载均衡器，一个 DNS 记录和一个外部 MySQL 数据库。

Rancher 需要安装在支持的 Kubernetes 版本上。如需了解你使用的 Rancher 版本支持哪些 Kubernetes 版本，请参见[支持维护条款](https://rancher.com/support-maintenance-terms/)。如需指定 K3s 版本，请在运行 K3s 安装脚本时，使用 `INSTALL_K3S_VERSION` 环境变量。
## 安装 Kubernetes

### 1. 安装 Kubernetes 并设置 K3s Server

在运行启动 K3s Kubernetes API Server 的命令时，你会传入使用之前设置的外部数据存储的选项。

1. 连接到你准备用于运行 Rancher Server 的其中一个 Linux 节点。
1. 在 Linux 节点上，运行以下命令来启动 K3s Server，并将其连接到外部数据存储。
```
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```
要指定 K3s 版本，使用 `INSTALL_K3S_VERSION` 环境变量：
```sh
curl -sfL https://get.k3s.io |  INSTALL_K3S_VERSION=vX.Y.Z sh -s - server \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
  ```
注意：你也可以使用 `$K3S_DATASTORE_ENDPOINT` 环境变量来传递数据存储端点。

1. 在第二个 K3s Server 节点上运行同样的命令。

### 2. 确认 K3s 正在运行

在其中一个 K3s Server 节点上运行以下命令，来确认 K3s 是否已经设置成功：
```
sudo k3s kubectl get nodes
```

然后你会看到两个具有 master 角色的节点。
```
ubuntu@ip-172-31-60-194:~$ sudo k3s kubectl get nodes
NAME               STATUS   ROLES    AGE    VERSION
ip-172-31-60-194   Ready    master   44m    v1.17.2+k3s1
ip-172-31-63-88    Ready    master   6m8s   v1.17.2+k3s1
```

测试集群 Pod 的健康状况：
```
sudo k3s kubectl get pods --all-namespaces
```

**结果**：你已成功配置一个 K3s Kubernetes 集群。

### 3. 保存并开始使用 kubeconfig 文件

你在每个 Rancher Server 节点上安装 K3s 时，会在每个节点中的 `/etc/rancher/k3s/k3s.yaml` 位置上创建一个`kubeconfig` 文件。该文件包含访问集群的凭证。请将该文件保存在安全的位置。

要使用此 `kubeconfig` 文件：

1. 安装 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)（Kubernetes 命令行工具）。
2. 复制 `/etc/rancher/k3s/k3s.yaml` 文件并保存到你本地机器的 `~/.kube/config` 目录中。
3. 在 `kubeconfig` 文件中，`server` 的参数为 localhost。你需要将 `server` 配置为负载均衡器的 DNS，并指定端口 6443（通过端口 6443 访问 Kubernetes API Server 会通过端口 6443，通过端口 80 和 443 访问 Rancher Server）。以下是一个 `k3s.yaml` 示例：

```yml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: [CERTIFICATE-DATA]
    server: [LOAD-BALANCER-DNS]:6443 # 编辑此行
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    password: [PASSWORD]
    username: admin
```

**结果**：你可以开始使用 `kubectl` 来管理你的 K3s 集群。如果你有多个 `kubeconfig` 文件，在使用 `kubectl` 时，你可以传入文件路径来指定要使用的 `kubeconfig` 文件：

```
kubectl --kubeconfig ~/.kube/config/k3s.yaml get pods --all-namespaces
```

有关 `kubeconfig` 文件的详情，请参见 [K3s 官方文档]({{<baseurl>}}/k3s/latest/en/cluster-access/) 或 [ Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用 `kubeconfig` 文件管理集群访问的部分。

### 4. 检查集群 Pod 的健康状况

现在你已经设置了 `kubeconfig` 文件。你可以使用 `kubectl` 在本地机器访问集群。

检查所有需要的 Pod 和容器是否健康：

```
ubuntu@ip-172-31-60-194:~$ sudo kubectl get pods --all-namespaces
NAMESPACE       NAME                                      READY   STATUS    RESTARTS   AGE
kube-system     metrics-server-6d684c7b5-bw59k            1/1     Running   0          8d
kube-system     local-path-provisioner-58fb86bdfd-fmkvd   1/1     Running   0          8d
kube-system     coredns-d798c9dd-ljjnf                    1/1     Running   0          8d
```

**结果**：你可通过使用 `kubectl` 访问集群，并且 K3s 集群能成功运行。现在，你可以在集群上安装 Rancher Management Server。
