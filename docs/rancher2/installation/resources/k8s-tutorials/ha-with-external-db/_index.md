---
title: 为 Rancher 设置高可用 K3s Kubernetes 集群
---

本节介绍了如何根据[Rancher 服务器环境的最佳实践](/docs/rancher2/overview/architecture-recommendations/_index)安装 Kubernetes 集群。

如果你的系统处于离线环境，不能直接上网，请参考离线安装说明。

**单节点安装提示**
在单节点 Kubernetes 集群中，Rancher 服务器不具备高可用性，这对于在生产中运行 Rancher 非常重要。然而，如果你想在短期内通过使用单节点来节省资源，同时保留高可用性的迁移路径，在单节点集群上安装 Rancher 是很有用的。

要建立单节点 K3s 集群，只需在一个节点上运行 Rancher 服务器安装命令，而不是两个节点。

在这两种单节点设置中，Rancher 可以与 Helm 一起安装在 Kubernetes 集群上，就像安装在任何其他集群上一样。

## 先决条件

这些说明假设你已经设置了两个节点、一个负载均衡器、一个 DNS 记录和一个外部 MySQL 数据库，如[本节所述](/docs/rancher2/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha-with-external-db/_index)。

Rancher 需要安装在支持的 Kubernetes 版本上。要了解您的 Rancher 版本支持哪些版本的 Kubernetes，请参考[支持维护条款](https://rancher.com/support-maintenance-terms/)。要指定 K3s 版本，请在运行 K3s 安装脚本时使用 INSTALL_K3S_VERSION 环境变量。

## 安装 Kubernetes

### 步骤 1：安装 Kubernetes 并设置 K3s 服务器

在运行命令启动 K3s Kubernetes API 服务器时，会传入使用之前设置的外部数据存储的选项。

1. 连接到你准备运行 Rancher 服务器的一个 Linux 节点。
1. 在 Linux 节点上，运行此命令来启动 K3s 服务器，并将其连接到外部数据存储。

   ```
   curl -sfL https://get.k3s.io | sh -s - server \
   --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
   ```

   要指定 K3s 版本，请在运行 K3s 安装脚本时使用 INSTALL_K3S_VERSION 环境变量：

   ```sh
   curl -sfL https://get.k3s.io |  INSTALL_K3S_VERSION=vX.Y.Z sh -s - server \
     --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
   ```

注意：也可以使用环境变量`$K3S_DATASTORE_ENDPOINT`来传递数据存储端点。

1. 在你的第二个 K3s 服务器节点上重复同样的命令。

### 步骤 2：确认 K3s 正在运行

请在 K3s 服务器节点上运行以下命令，确认 K3s 已经设置成功。

````

sudo k3s kubectl get nodes

```

然后你应该看到两个具有 master role 的节点。

```

ubuntu@ip-172-31-60-194:~$ sudo k3s kubectl get nodes
NAME STATUS ROLES AGE VERSION
ip-172-31-60-194 Ready master 44m v1.17.2+k3s1
ip-172-31-63-88 Ready master 6m8s v1.17.2+k3s1

```

然后测试集群 pods 的健康状况。

```

sudo k3s kubectl get pods --all-namespaces

````

**结果：** 您已经成功建立了一个 K3s Kubernetes 集群。

### 步骤 3：保存并开始使用 kubeconfig 文件

当您在每个 Rancher server 节点上安装 K3s 时，会在节点上创建了一个`/etc/rancher/k3s/k3s.yaml`的`kubeconfig`文件。这个文件包含了完全访问集群的凭证，你应该把这个文件保存在一个安全的位置。

1. 安装[kubectl]（https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl）。
2. 复制`/etc/rancher/k3s/k3s.yaml`处的文件，并保存到本地机器上的`~/.kube/config`目录下。
3. 在 kubeconfig 文件中，`server`指令定义为 localhost。将服务器配置为你的负载均衡器的 DNS，参考端口 6443。Kubernetes API 服务器将通过端口 6443 到达，而 Rancher 服务器将通过端口 80 和 443 到达）。下面是一个例子`k3s.yaml`：

```yml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: [CERTIFICATE-DATA]
    server: [LOAD-BALANCER-DNS]:6443 # Edit this line
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

**结果：** 现在你可以使用`kubectl`来管理你的 K3s 集群。如果你有多个的 kubeconfig 文件，你可以在使用`kubectl`时通过传递文件的路径来指定你要使用的文件。

```
kubectl --kubeconfig ~/.kube/config/k3s.yaml get pods --all-namespaces
```

关于`kubeconfig`文件的更多信息，请参考[K3s 文档](/docs/k3s/cluster-access/_index)或[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用`kubeconfig`文件组织集群访问的内容。

### 4. 检查您集群内 Pods 的健康状况

现在你已经设置了`kubeconfig`文件，你可以使用`kubectl`从你的本地机器访问集群。

检查所有需要的 pods 和容器是否健康，准备继续：

```
ubuntu@ip-172-31-60-194:~$ sudo kubectl get pods --all-namespaces
NAMESPACE       NAME                                      READY   STATUS    RESTARTS   AGE
kube-system     metrics-server-6d684c7b5-bw59k            1/1     Running   0          8d
kube-system     local-path-provisioner-58fb86bdfd-fmkvd   1/1     Running   0          8d
kube-system     coredns-d798c9dd-ljjnf                    1/1     Running   0          8d
```

**结果：** 您已经可以使用`kubectl`访问集群，并且 K3s 集群正在运行。现在可以在集群上安装 Rancher 管理服务器。
