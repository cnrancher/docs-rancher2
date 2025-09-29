---
title: 使用 RKE2 安装 Kubernetes
description: 本文描述了如何根据Rancher Server 环境的最佳实践来安装 Kubernetes 集群。
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

## 概述

_v2.5.6 开始可用_

本文描述了如何根据[Rancher Server 环境的最佳实践](/docs/rancher2.5/overview/architecture-recommendations/#kubernetes-的安装环境)来安装 Kubernetes 集群。

## 前提条件

这些说明假定你已经设置了三个节点、一个负载均衡器和一个 DNS record.

注意，为了让 RKE2 与负载均衡器正常工作，你需要设置两个监听端口：一个是 9345 端口的监管者，另一个是 6443 端口的 Kubernetes API。

Rancher 需要安装在支持的 Kubernetes 版本上。要想知道你的 Rancher 版本支持哪些版本的 Kubernetes，请参考[支持维护条款](https://rancher.com/support-maintenance-terms/)。要想指定 RKE2 版本，在运行 RKE2 安装脚本时使用 `INSTALL_RKE2_VERSION` 环境变量。

## 安装 Kubernetes

### 1. 安装 Kubernetes 并配置 RKE2 Server

RKE2 服务器使用嵌入式 etcd 运行，所以你不需要设置外部数据存储就可以在 HA 模式下运行。

在第一个节点上，你应该用你自己的预共享密钥作为令牌来设置配置文件。令牌参数可以在启动时设置。

如果你没有指定预共享密钥，RKE2 将生成一个预共享密钥并将其放在`/var/lib/rancher/rke2/server/node-token` 中。

为了避免固定注册地址的证书错误，你应该在启动服务器时设置 `tls-san` 参数。这个选项在服务器的 TLS 证书中增加了一个额外的主机名或 IP 作为主题替代名，如果你想通过 IP 和主机名访问，可以将其指定为一个列表。

首先，你需要创建要存放 RKE2 配置文件的目录：

```
mkdir -p /etc/rancher/rke2/
```

接下来，使用以下示例在 `/etc/rancher/rke2/config.yaml` 中创建 RKE2 配置文件：

```
token: my-shared-secret
tls-san:
  - my-kubernetes-domain.com
  - another-kubernetes-domain.com
```

然后，你需要运行安装命令并启用和启动 RKE2：

```
curl -sfL https://get.rke2.io | INSTALL_RKE2_CHANNEL=v1.20 sh -
systemctl enable rke2-server.service
systemctl start rke2-server.service
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn INSTALL_RKE2_CHANNEL=v1.20 sh - 
```
:::

1. 要加入其余的节点，你需要用相同的共享令牌或自动生成的令牌来配置每个额外的节点。下面是一个配置文件的例子：

```
token: my-shared-secret
server: https://<DNS-DOMAIN>:9345
tls-san:
  - my-kubernetes-domain.com
  - another-kubernetes-domain.com
```

之后，你需要运行安装程序并启用，然后启动 RKE2：

```
curl -sfL https://get.rke2.io | sh -
systemctl enable rke2-server.service
systemctl start rke2-server.service
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn sh - 
```
:::

1. 在你的第三个 RKE2 服务器节点上重复同样的命令。

### 2. 检查 RKE2 是否正常运行

一旦你在所有服务器节点上启动了 rke2 服务器进程，确保集群已经正常启动，请运行以下命令：

```
/var/lib/rancher/rke2/bin/kubectl \
        --kubeconfig /etc/rancher/rke2/rke2.yaml get nodes
```

你应该看到你的服务器节点处于就绪状态。然后测试集群 Pod 的健康状况。

```
/var/lib/rancher/rke2/bin/kubectl \
        --kubeconfig /etc/rancher/rke2/rke2.yaml get pods --all-namespaces
```

**结果：**你已经成功建立了一个 RKE2 Kubernetes 集群。

### 3. 保存上述修改并开始使用 kubeconfig 文件

当你在每个 Rancher 服务器节点上安装 RKE2 时，在节点上创建了一个`kubeconfig`文件，地址是`/etc/rancher/rke2/rke2.yaml`。这个文件包含了完全访问集群的凭证，你应该把这个文件保存在一个安全的地方。

要使用这个`kubeconfig`文件，请参考以下步骤：

1. 安装[kubectl]（https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl）。
2. 复制`/etc/rancher/rke2/rke2.yaml`的文件，并保存到本地机器上的`~/.kube/config`目录。
3. 在 kubeconfig 文件中，`server`指令被定义为 localhost。将该服务器配置为你的负载均衡器的 DNS，参考端口 6443。(Kubernetes API 服务器将在 6443 端口到达，而 Rancher 服务器将在 80 和 443 端口到达)。下面是一个`rke2.yaml`的例子：

```yml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: [CERTIFICATE-DATA]
    server: [LOAD-BALANCER-DNS]:6443 # 请编辑此行
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

**结果：**你现在可以使用`kubectl`来管理你的 RKE2 集群。如果你有一个以上的 kubeconfig 文件，你可以在使用`kubectl`时通过传递文件的路径来指定你要使用的文件：

```bash
kubectl --kubeconfig ~/.kube/config/rke2.yaml get pods --all-namespaces
```

关于`kubeconfig`文件的更多信息，请参考[RKE2 文档](https://docs.rke2.io/cluster_access/)或[Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)关于使用`kubeconfig`文件组织集群访问。

### 4. 检查集群 Pods 的健康状态

现在你已经设置了`kubeconfig`文件，你可以使用`kubectl`从你的本地机器访问集群。

检查所有需要的 pod 和容器是否健康，准备继续：

```bash
 /var/lib/rancher/rke2/bin/kubectl         --kubeconfig /etc/rancher/rke2/rke2.yaml get pods -A
NAMESPACE     NAME                                                 READY   STATUS      RESTARTS   AGE
kube-system   etcd-ip-172-31-18-145                                1/1     Running     0          4m37s
kube-system   etcd-ip-172-31-25-73                                 1/1     Running     0          20m
kube-system   etcd-ip-172-31-31-210                                1/1     Running     0          9m12s
kube-system   helm-install-rke2-canal-th9k9                        0/1     Completed   0          21m
kube-system   helm-install-rke2-coredns-6njr6                      0/1     Completed   0          21m
kube-system   helm-install-rke2-ingress-nginx-vztsd                0/1     Completed   0          21m
kube-system   helm-install-rke2-kube-proxy-6std5                   0/1     Completed   0          21m
kube-system   helm-install-rke2-metrics-server-9sl7m               0/1     Completed   0          21m
kube-system   kube-apiserver-ip-172-31-18-145                      1/1     Running     0          4m22s
kube-system   kube-apiserver-ip-172-31-25-73                       1/1     Running     0          20m
kube-system   kube-apiserver-ip-172-31-31-210                      1/1     Running     0          9m8s
kube-system   kube-controller-manager-ip-172-31-18-145             1/1     Running     0          4m8s
kube-system   kube-controller-manager-ip-172-31-25-73              1/1     Running     0          21m
kube-system   kube-controller-manager-ip-172-31-31-210             1/1     Running     0          8m55s
kube-system   kube-proxy-57twm                                     1/1     Running     0          10m
kube-system   kube-proxy-f7pc6                                     1/1     Running     0          5m24s
kube-system   kube-proxy-rj4t5                                     1/1     Running     0          21m
kube-system   kube-scheduler-ip-172-31-18-145                      1/1     Running     0          4m15s
kube-system   kube-scheduler-ip-172-31-25-73                       1/1     Running     0          21m
kube-system   kube-scheduler-ip-172-31-31-210                      1/1     Running     0          8m48s
kube-system   rke2-canal-4x972                                     2/2     Running     0          10m
kube-system   rke2-canal-flh8m                                     2/2     Running     0          5m24s
kube-system   rke2-canal-zfhkr                                     2/2     Running     0          21m
kube-system   rke2-coredns-rke2-coredns-6cd96645d6-cmstq           1/1     Running     0          21m
kube-system   rke2-ingress-nginx-controller-54946dd48f-6mp76       1/1     Running     0          20m
kube-system   rke2-ingress-nginx-default-backend-5795954f8-p92xx   1/1     Running     0          20m
kube-system   rke2-metrics-server-5f9b5757dc-k5sgh                 1/1     Running     0          20m
```

**结果：**你已经确认可以用`kubectl`访问集群，并且 RKE2 集群已经成功运行。现在可以在集群上安装 Rancher 管理服务器了。

### 5. 配置 nginx 成为一个 daemonset

目前，RKE2 将 nginx-ingress 作为一个部署，这可能会影响 Rancher 的部署，所以你不能使用所有的服务器来代理请求到 Rancher pods。

为了纠正这个问题，在任何一个服务器节点的`/var/lib/rancher/rke2/server/manifests` 中放置以下文件。

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-ingress-nginx
  namespace: kube-system
spec:
  valuesContent: |-
    controller:
      kind: DaemonSet
      daemonset:
        useHostPort: true
```
