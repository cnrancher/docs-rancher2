---
title: 安装 Kubernetes
description: 本节描述了如何根据我们的Rancher Server 环境的最佳实践来安装 Kubernetes 集群。该集群应专用于运行 Rancher Server。对于 v2.4 之前的 Rancher，Rancher 应该安装在RKE（Rancher Kubernetes Engine）Kubernetes 集群上。RKE 是经过 CNCF 认证的 Kubernetes 发行版，并且全部组件完全在 Docker 容器内运行。从 Rancher v2.4 开始，Rancher Server 可以安装在 RKE Kubernetes 集群或 K3s Kubernetes 集群上。K3s 也是 Rancher 发布的经过完全认证的 Kubernetes 发行版，但比 RKE 更新。我们建议在 K3s 上安装 Rancher，因为 K3s 易于使用且更轻量，全部组件都打包在了一个二进制文件里。并且这个二进制文件小于 100 MB。注意：如果在 RKE 集群上安装了 Rancher 之后，目前没有办法将这个高可用迁移到 K3s 集群上。Rancher Server 只能在使用 RKE 或 K3s 安装的 Kubernetes 集群中运行。不支持在托管的 Kubernetes 集群（例如 EKS）上使用 Rancher。
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
  - Rancher高可用安装
  - 安装 Kubernetes
---

本节描述了如何根据我们的 [Rancher Server 环境的最佳实践](/docs/rancher2/overview/architecture-recommendations/_index)来安装 Kubernetes 集群。该集群应专用于运行 Rancher Server。

对于 v2.4 之前的 Rancher，Rancher 应该安装在 [RKE](/docs/rke/_index)（Rancher Kubernetes Engine）Kubernetes 集群上。RKE 是经过 CNCF 认证的 Kubernetes 发行版，并且全部组件完全在 Docker 容器内运行。

从 Rancher v2.4 开始，Rancher Server 可以安装在 RKE Kubernetes 集群或 K3s Kubernetes 集群上。K3s 也是 Rancher 发布的经过完全认证的 Kubernetes 发行版，但比 RKE 更新。我们建议在 K3s 上安装 Rancher，因为 K3s 易于使用且更轻量，全部组件都打包在了一个二进制文件里。并且这个二进制文件小于 100 MB。注意：如果在 RKE 集群上安装了 Rancher 之后，目前没有办法将这个高可用迁移到 K3s 集群上。

Rancher Server 只能在使用 RKE 或 K3s 安装的 Kubernetes 集群中运行。不支持在托管的 Kubernetes 集群（例如 EKS）上使用 Rancher。

对于无法直接访问 Internet 的系统，请参阅 [Rancher 离线安装指南](/docs/rancher2/installation/other-installation-methods/air-gap/_index)。

> **单节点 Kubernetes 集群安装提示：**
>
> 在单节点 Kubernetes 集群中，Rancher Server 不具有高可用性，但高可用性这对于在生产环境中运行 Rancher 至关重要。如果要在短期内通过使用单个节点来节省资源，同时保留高可用性迁移路径，则在单节点 Kubernetes 集群上安装 Rancher 可能会很有用。
>
> 要创建单节点 RKE 集群，只需在`cluster.yml`中配置一个节点。这个节点应该具有所有三个角色：`etcd`、`controlplane`和`worker`。
>
> 要创建单节点 K3s 集群，只需在一个节点上运行安装命令即可，并不需要像高可用集群一样在两个节点上安装。
>
> 配置完单节点的 Kubernetes 集群后，就可以像在其他高可用集群上安装一样，使用 Helm 安装 Rancher。

## 安装 Kubernetes

创建 Kubernetes 集群的步骤，根据是使用 RKE 还是使用 K3s 而不同。请选择一种适合您的方式安装 Kubernetes。

## 安装 K3s 集群

### 1、安装 Kubernetes 并配置 K3s Server

运行启动 K3s Kubernetes API Server 的命令时，您需要传入先前设置的外部数据库参数。

1. 连接到您准备运行 Rancher Server 的 Linux 节点之一。
2. 在 Linux 节点上，运行以下命令以启动 K3s Server 并将其连接到外部数据库：

   ```
   curl -sfL https://get.k3s.io | sh -s - server \
     --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
   ```

   注意：您也可以通过环境变量`$K3S_DATASTORE_ENDPOINT`来配置数据库端点。

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - server \
--datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

:::

3. 在您的另外一台 Linux 节点上执行同样的操作。

### 2、确认 K3s 是否创建成功

要确认已成功设置 K3s，请在任一 K3s Server 节点上运行以下命令：

```
sudo k3s kubectl get nodes
```

然后，您应该看到两个具有`master`角色的节点：

```
ubuntu@ip-172-31-60-194:~$ sudo k3s kubectl get nodes
NAME               STATUS   ROLES    AGE    VERSION
ip-172-31-60-194   Ready    master   44m    v1.17.2+k3s1
ip-172-31-63-88    Ready    master   6m8s   v1.17.2+k3s1
```

然后测试集群容器的运行状况：

```
sudo k3s kubectl get pods --all-namespaces
```

**结果：** 您已经成功设置了 K3s Kubernetes 集群。

### 3、保存并使用 kubeconfig 文件

在每个 Rancher Server 节点上安装 K3s 时，会在节点上`/etc/rancher/k3s/k3s.yaml`位置创建一个`kubeconfig`文件。该文件包含用于完全访问集群的凭据，您应该将此文件保存在安全的位置。

要使用此`kubeconfig`文件，

1. 安装 Kubernetes 命令行工具[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)。
2. 将文件`/etc/rancher/k3s/k3s.yaml`复制并保存到本地计算机上的`~/.kube/config`文件中。
3. 在这个 `kubeconfig` 文件中，`server`参数为 `localhost`。您需要手动更改这个地址为负载均衡器的 DNS，并且指定端口 6443。（Kubernetes API Server 的端口为 6443，Rancher Server 的端口为 80 和 443。）以下是一个示例`k3s.yaml`：

:::important 注意
如果需要在本地通过 `kubectl` 访问这个 K3s 集群，请确保在您的负载均衡器中配置将`6443`端口的流量也转发到这两个节点上。
:::

```
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

**结果：** 您现在可以使用`kubectl`来管理您的 K3s 集群。如果您有多个 kubeconfig 文件，可以在使用`kubectl`时通过传递文件路径来指定要使用的 kubeconfig 文件：

```
kubectl --kubeconfig ~/.kube/config/k3s.yaml get pods --all-namespaces
```

有关`kubeconfig`文件的更多信息，请参考 [K3s 集群访问](/docs/k3s/cluster-access/_index)或[官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用`kubeconfig`文件访问集群的部分。

### 4、检查集群 Pod 的运行状况

既然已经设置了`kubeconfig`文件，就可以使用`kubectl`从您的本地计算机访问集群了。

检查所有需要的 Pod 和容器是否状况良好：

```
ubuntu@ip-172-31-60-194:~$ sudo kubectl get pods --all-namespaces
NAMESPACE       NAME                                      READY   STATUS    RESTARTS   AGE
kube-system     metrics-server-6d684c7b5-bw59k            1/1     Running   0          8d
kube-system     local-path-provisioner-58fb86bdfd-fmkvd   1/1     Running   0          8d
kube-system     coredns-d798c9dd-ljjnf                    1/1     Running   0          8d
```

**结果：** 您已确认可以使用`kubectl`访问集群，并且 K3s 集群正在正确运行。现在，可以在集群上安装 Rancher Server 了。

## 安装 RKE 集群

### 1、安装需要的 CLI 工具

安装 Kubernetes 命令行工具 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)。

另外，安装[RKE](/docs/rke/installation/_index)，Rancher Kubernetes Engine，一种 Kubernetes 分发版和命令行工具。

请按照[RKE 文档](/docs/rke/installation/_index)中的说明安装 RKE。

:::tip 提示
国内用户，可以导航到 https://mirror.rancher.cn 下载所需资源
:::

### 2、创建 RKE 配置文件

在本节中，您将创建一个名为`rancher-cluster.yml`的 Kubernetes 集群配置文件。在后续步骤中，当使用 RKE 命令设置集群时，它将使用此文件在节点上安装 Kubernetes。

使用下面的示例，创建`rancher-cluster.yml`文件。将`nodes`列表中的 IP 地址替换为您创建的 3 个节点的 IP 地址或 DNS 名称。

如果您的节点具有公共和内部地址，建议设置`internal_address：`这样 Kubernetes 会将其用于集群内通信。某些服务（例如 AWS EC2）在使用自引用安全组或防火墙时需要设置`internal_address：`。

RKE 需要通过 SSH 连接到每个节点，并且它将在默认位置`~/.ssh/id_rsa`中寻找私钥。如果您的默认私钥与节点的私钥不在同一个位置，则还需要为该节点配置`ssh_key_path`选项。

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
    use-forwarded-headers: "true"
```

<figcaption>常用 RKE 节点选项</figcaption>

| 选项               | 必填 | 描述                                                             |
| :----------------- | :--- | :--------------------------------------------------------------- |
| `address`          | 是   | 公用 DNS 或 IP 地址                                              |
| `user`             | 是   | 可以运行 docker 命令的用户                                       |
| `role`             | 是   | 分配给节点的 Kubernetes 角色列表                                 |
| `internal_address` | 是   | 内部集群流量的专用 DNS 或 IP 地址                                |
| `ssh_key_path`     | 否   | 用于对节点进行身份验证的 SSH 私钥的路径（默认为`~/.ssh/id_rsa`） |

> **高级配置：** RKE 有许多配置选项可用于在您的特定环境中进行自定义安装。
>
> 请参阅[RKE 文档](/docs/rke/config-options/_index)来了解 RKE 的选项和功能的完整列表。
>
> 要为大规模 Rancher 安装 etcd 集群，请参阅[etcd 设置指南](/docs/rancher2/installation/resources/advanced/etcd/_index)。

### 3、运行 RKE

```
rke up --config ./rancher-cluster.yml
```

完成后，它应该以这样一行结束： `Finished building Kubernetes cluster successfully`.

### 4、测试集群

本节介绍如何在您的工作区进行设置，以便您可以在本地使用`kubectl`命令行工具与此集群进行交互。

如果您已经安装了`kubectl`，您需要将`kubeconfig`文件放置在`kubectl`可以访问的位置。`kubeconfig`文件包含使用`kubectl`访问集群所必需的凭证。

当您运行 rke up 时，RKE 应该已经创建了一个名为`kube_config_rancher-cluster.yml`的`kubeconfig`文件。该文件具有`kubectl`和`helm`的凭据。

> **注意：** 如果您使用了与`rancher-cluster.yml`不同的文件名，则 kubeconfig 文件将命名为`kube_config_<FILE_NAME>.yml`。

您可以将此文件复制到`$HOME/.kube/config`，或者如果您使用多个 Kubernetes 集群，请将`KUBECONFIG`环境变量设置为`kube_config_rancher-cluster.yml`的路径：

```
export KUBECONFIG=$(pwd)/kube_config_rancher-cluster.yml
```

使用`kubectl`测试您的连通性，并查看您的所有节点是否都处于`Ready`状态：

```
kubectl get nodes

NAME                          STATUS    ROLES                      AGE       VERSION
165.227.114.63                Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.116.167               Ready     controlplane,etcd,worker   11m       v1.13.5
165.227.127.226               Ready     controlplane,etcd,worker   11m       v1.13.5
```

### 5、检查集群 Pod 的运行状况

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

这确认您已经成功安装了可以运行 Rancher Server 的 Kubernetes 集群。

### 6、保存文件

:::important 重要
需要用以下文件来进行集群维护，集群升级和故障排查。
:::

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`: RKE 集群配置文件。
- `kube_config_rancher-cluster.yml`: 集群的[Kubeconfig 文件](/docs/rke/kubeconfig/_index)，此文件包含用于访问集群的凭据。
- `rancher-cluster.rkestate`: [Kubernetes 集群状态文件](/docs/rke/installation/_index)，此文件包含用于完全访问集群的凭据。_Kubernetes 集群状态文件仅在使用 RKE v0.2.0 或更高版本时创建。_

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

### 遇到问题或错误？

请参阅[故障排查](/docs/rancher2/installation/other-installation-methods/troubleshooting/_index)页面。

## [下一步：安装 Rancher](/docs/rancher2/installation/resources/advanced/helm2/helm-rancher/_index)
