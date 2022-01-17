---
title: 为 Rancher 设置高可用的 RKE2 Kubernetes 集群
shortTitle: 为 Rancher 配置 RKE2
weight: 2
---
_已在 2.5.6 版本测试_

本文介绍了如何根据 [Rancher Server 环境的最佳实践]({{<baseurl>}}/rancher/v2.6/en/overview/architecture-recommendations/#environment-for-kubernetes-installations)安装 Kubernetes 集群。

# 前提

以下说明假设你已参见[此章节]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-rke2-ha)配置好三个节点，一个负载均衡器和一个 DNS 记录。

为了让 RKE2 与负载均衡器正常工作，你需要设置两个监听器，一个用于 9345 端口，另一个用于 6443 端口的 Kubernetes API。

Rancher 需要安装在支持的 Kubernetes 版本上。如需了解你使用的 Rancher 版本支持哪些 Kubernetes 版本，请参见[支持维护条款](https://rancher.com/support-maintenance-terms/)。如需指定 RKE2 版本，请在运行 RKE2 安装脚本时，使用 `INSTALL_RKE2_VERSION` 环境变量。
# 安装 Kubernetes

### 1. 安装 Kubernetes 并设置 RKE2 Server

RKE2 Server 使用嵌入式 etcd 运行。因此你不需要设置外部数据存储就可以在 HA 模式下运行。

在第一个节点上，使用你的预共享密文作为 Token 来设置配置文件。Token 参数可以在启动时设置。

如果你不指定预共享密文，RKE2 会生成一个预共享密文并将它放在 `/var/lib/rancher/rke2/server/node-token` 中。

为了避免固定注册地址的证书错误，请在启动服务器时设置 `tls-san` 参数。这个选项在服务器的 TLS 证书中增加一个额外的主机名或 IP 作为使用者可选名称。如果你想通过 IP 和主机名访问，你可以将它指定为一个列表。

首先，创建用于存放 RKE2 配置文件的目录：

```
mkdir -p /etc/rancher/rke2/
```

然后，参见以下示例在 `/etc/rancher/rke2/config.yaml` 中创建 RKE2 配置文件：

```
token: my-shared-secret
tls-san:
  - my-kubernetes-domain.com
  - another-kubernetes-domain.com
```
之后，运行安装命令并启用和启动 RKE2：

```
curl -sfL https://get.rke2.io | INSTALL_RKE2_CHANNEL=v1.20 sh -
systemctl enable rke2-server.service
systemctl start rke2-server.service
```
1. 要加入其余的节点，使用同一个共享或自动生成的 Token 来配置每个额外的节点。以下是配置文件的示例：

        token: my-shared-secret
        server: https://<DNS-DOMAIN>:9345
        tls-san:
          - my-kubernetes-domain.com
          - another-kubernetes-domain.com
运行安装程序，然后启用并启动 RKE2：

        curl -sfL https://get.rke2.io | sh -
        systemctl enable rke2-server.service
        systemctl start rke2-server.service


1. 在第三 RKE2 Server 节点上运行同样的命令。

### 2. 检查 RKE2 是否正常运行

在所有服务器节点上启动了 RKE2 服务器进程后，确保集群已经正常启动，请运行以下命令：

```
/var/lib/rancher/rke2/bin/kubectl \
        --kubeconfig /etc/rancher/rke2/rke2.yaml get nodes
现在，服务器节点的状态应该是 Ready。
```

测试集群 Pod 的健康状况：
```
/var/lib/rancher/rke2/bin/kubectl \
        --kubeconfig /etc/rancher/rke2/rke2.yaml get pods --all-namespaces
```

**结果**：你已成功配置 RKE2 Kubernetes 集群。

### 3. 保存并开始使用 kubeconfig 文件

在每个 Rancher Server 节点安装 RKE2 时，会在每个节点的 `/etc/rancher/rke2/rke2.yaml` 中生成一个 `kubeconfig`  文件。该文件包含访问集群的凭证。请将该文件保存在安全的位置。

如要使用该 `kubeconfig` 文件：

1. 安装 Kubernetes 命令行工具 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)：
2. 复制 `/etc/rancher/rke2/rke2.yaml` 文件并保存到本地机器的 `~/.kube/config` 目录上。
3. 在 kubeconfig 文件中，`server` 的参数为 localhost。你需要将 `server` 配置为负载均衡器的 DNS，并指定端口 6443（通过端口 6443 访问 Kubernetes API Server，通过端口 80 和 443 访问 Rancher Server）。以下是一个 `rke2.yaml` 示例：

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

**结果**：你可以开始使用 `kubectl` 来管理你的 RKE2 集群。如果你有多个 `kubeconfig` 文件，在使用 `kubectl` 时，你可以传入文件路径来指定要使用的 `kubeconfig` 文件：

```
kubectl --kubeconfig ~/.kube/config/rke2.yaml get pods --all-namespaces
```

有关 `kubeconfig` 文件的详情，请参见 [RKE2 官方文档](https://docs.rke2.io/cluster_access/)或 [ Kubernetes 官方文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用 `kubeconfig` 文件管理集群访问的部分。

### 4. 检查集群 Pod 的健康状况

现在你已经设置了 `kubeconfig` 文件。你可以使用 `kubectl` 在本地机器访问集群。

检查所有需要的 Pod 和容器是否健康：

```
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

**结果**：你可通过使用 `kubectl` 访问集群，并且 RKE2 集群能成功运行。现在，你可以在集群上安装 Rancher Management Server。

### 5. 将 NGINX 配置为 Daemonset

目前，RKE2 将 nginx-ingress 部署为一个 deployment，这可能会影响 Rancher 的部署，导致你不能使用所有的服务器来代理请求到 Rancher pod。

要解决这个问题，将以下文件放到所有服务器节点的 /var/lib/rancher/rke2/server/manifests 中：

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
