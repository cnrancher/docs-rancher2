---
title: 在Linux操作系统上安装Rancher
---

_从 Rancher v2.5.4 开始提供。_

## 概述

RancherD 是一种新的、更简单的安装 Rancher 的方法，这是一个实验性功能。

RancherD 是一个二进制文件，它首先启动一个 RKE2 Kubernetes 集群，然后在集群上安装 Rancher 服务器 Helm Chart。

## 关于 RancherD 安装

当 RancherD 在主机上启动时，首先会安装一个 RKE2 Kubernetes 集群，然后将 Rancher 作为 Kubernetes 守护进程组部署在集群上。

在 RancherD 安装和 Helm CLI 安装中，Rancher 都是作为 Helm 图安装在 Kubernetes 集群上。

使用 RancherD 也简化了配置和升级。当您升级 RancherD 二进制时，Kubernetes 集群和 Rancher Helm 图表都会升级。

在本说明的第一部分，您将学习如何在单个节点上启动 RancherD。按照第一部分的步骤进行操作的结果是一个安装了 Rancher 服务器的单节点[RKE2](https://docs.rke2.io/)Kubernetes 集群。这个集群以后可以很容易地变成高可用性。如果 Rancher 只需要管理本地 Kubernetes 集群，那么安装就完成了。

第二部分介绍了如何将单节点的 Rancher 安装转换成高可用性安装。如果 Rancher 服务器将管理下游的 Kubernetes 集群，则必须遵循这些步骤。关于高可用 Rancher 部署的推荐架构的讨论可以在我们的[最佳实践指南](/docs/rancher2/best-practices/2.5/_index)中找到。

## 先决条件

### 节点要求

RancherD 必须在 Linux 操作系统上启动。目前只支持利用 systemd 的操作系统。

Linux 节点需要满足硬件和网络的[安装要求](/docs/rancher2/installation_new/requirements/_index)。RancherD 的安装不需要 Docker。

要在 SELinux Enforcing CentOS 8 节点或 RHEL 8 节点上安装 RancherD，需要一些[附加步骤](/docs/rancher2/installation_new/requirements/_index)。

### root 权限

在运行安装命令之前，你需要以 root 身份登录。

```
sudo -s
```

### 固定镜像地址

单节点安装时建议使用固定镜像地址，使用 RancherD 的高可用性安装时需要使用固定镜像地址。

固定镜像地址是一个端点，用于两个目的。

- 为了访问 Kubernetes API。因此，您可以，例如，修改您的[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件以指向它，而不是特定节点。
- 要向 Kubernetes 集群添加新节点。要在以后向集群中添加节点，你将在节点上运行一个命令，该命令将指定集群的固定镜像地址。

如果你是在单个节点上安装 Rancher，固定镜像地址使得你可以向集群添加更多的节点，这样你就可以将单节点安装转换为高可用性安装，而不会对集群造成停机。如果你在安装单节点 Kubernetes 集群时没有设置这个地址，那么你需要重新运行固定镜像地址的安装脚本，才能向集群中添加新节点。

固定镜像地址可以是服务器节点中任何一个节点的 IP 或主机名，但在很多情况下，随着时间的推移，这些节点可能会随着节点的创建和销毁而改变。因此，你应该在服务器节点前有一个稳定的端点。

这个端点可以使用任何数量的方法来设置，例如：

- 第四层（TCP）负载均衡器
- 循环的 DNS
- 虚拟或弹性 IP 地址

在配置负载均衡器或其他终端时，应考虑到以下问题：

- RancherD 服务器进程在 9345 端口监听新节点注册。
- Kubernetes API 与正常情况一样，在 6443 端口上服务。
- 在 RancherD 安装中，Rancher UI 默认在 8443 端口上服务。这与 Helm 图安装不同，Helm 图默认使用 443 端口）。

## 安装 Rancher

### 1. 设置配置

为了避免固定镜像仓库地址的证书错误，你应该在启动服务器时设置`tls-san`参数。这个参数应该是指你的固定镜像仓库地址。

这个选项在服务器的 TLS 证书中增加了一个额外的主机名或 IP 作为 Subject Alternative Name，如果你想通过 IP 和主机名访问 Kubernetes 集群，可以将其指定为一个列表。

在`/etc/rancher/rke2/config.yaml`创建 RancherD 配置文件。

```yaml
token: my-shared-secret
tls-san:
  - https://my-fixed-registration-address.com
  - Another-kubernetes-domain.com
```

第一个服务器节点建立密钥令牌，如果其他节点被添加到集群中，它们会用这个密钥令牌注册。

如果您没有指定预共享的密钥，RancherD 将生成一个密钥，并将其放在`/var/lib/rancher/rke2/server/node-token`中。

要指定自己的预共享密钥作为标记，请在启动时设置`token`参数。

以这种方式安装 Rancher 将使用 Rancher 生成的证书。要使用自己的自签名或受信任的证书，请参考[配置指南](/docs/rancher2/installation_new/install-rancher-on-linux/rancherd-configuration/_index)

关于自定义 RancherD Helm 图表值.yaml 的信息，请参考[本节](/docs/rancher2/installation_new/install-rancher-on-linux/rancherd-configuration/_index)

### 2. 启动第一个服务器节点

运行 RancherD 安装程序。

```
curl -sfL https://get.rancher.io | sh -
```

RancherD 的版本可以使用`INSTALL_RANCHERD_VERSION`环境变量来指定。

```
curl -sfL https://get.rancher.io | INSTALL_RANCHERD_VERSION=v2.5.4-rc6 sh -
```

安装完毕后，`rancherd`二进制文件将在你的 PATH 上。你可以查看它的帮助文本，如下所示。

```
rancherd --help
名称：Rancherd
   rancherd - Rancher Kubernetes引擎2
...
```

接下来，启动 RancherD。

```
systemctl enable rancherd-server.service。
systemctl start rancherd-server.service。
```

当 RancherD 启动时，它会安装一个 RKE2 Kubernetes 集群。使用下面的命令查看 Kubernetes 集群启动时的日志。

```
journalctl -eu rancherd-server -f
```

### 3. 用 kubectl 设置 kubeconfig 文件。

Kubernetes 集群建立后，设置 RancherD 的 kubeconfig 文件和`kubectl`。

```
export KUBECONFIG=/etc/rancher/rke2/rke2.yaml PATH=$PATH:/var/lib/rancher/rke2/bin
```

### 4. 验证 Rancher 是否安装在 Kubernetes 集群上。

现在，您可以开始发布`kubectl`命令。使用下面的命令来验证 Rancher 是否作为守护进程部署在集群上。

```
kubectl get daemonset rancher -n cattle-system.
kubectl get pod -n cattle-system
```

如果你注意观察 Pod，你会看到安装了以下 Pods：

- 在 "cattle-system "命名空间的 "helm-operation "pods。
- `cattle-system`命名空间中的`rancher`pod 和`rancher-webhook`pod。
- 在 "fleet-system "命名空间中的 `fleet-agent`、`fleet-controller`和 `gitjob`pod。
- `rancher-operator-system`命名空间中的`rancher-operator`pod。

### 5. 设置 Rancher 的初始密码

一旦`rancher` pod 启动并运行，运行以下内容。

```
rancherd reset-admin
```

这将为您提供登录 Rancher 所需的 URL、用户名和密码。按照这个 URL，插入凭证，你就可以使用 Rancher 了!

如果 Rancher 只会管理本地 Kubernetes 集群，那么安装就完成了。

## 高可用性

如果您计划使用 Rancher 服务器来管理下游的 Kubernetes 集群，Rancher 需要具有高可用性。在这些步骤中，您将添加更多节点以实现高可用性集群。由于 Rancher 是作为守护进程运行的，因此它将在您添加的节点上自动启动。

需要奇数的节点，因为包含集群数据的 etcd 集群需要大多数的活节点以避免失去法定人数。失去法定人数可能需要从备份中恢复集群。因此，我们建议使用三个节点。

当遵循这些步骤时，您仍应以 root 身份登录。

### 1. 在新节点上配置固定镜像仓库地址。

附加服务器节点的启动方式与第一个节点非常相似，只是您必须指定 "server "和 "token "参数，以便它们能够成功连接到初始服务器节点。

下面是附加服务器节点的 RancherD 配置文件的一个例子。默认情况下，这个配置文件应该位于`/etc/rancher/rke2/config.yaml`。

```yaml
server: https://my-fixed-registration-address.com:9345
token: my-shared-secret
tls-san:
  - my-fixed-registration-address.com.
  - Another-kubernetes-domain.com
```

### 2. 启动一个额外的服务器节点

在新节点上运行安装程序。

```
curl -sfL https://get.rancher.io | sh -
```

这将下载 RancherD，并将其安装为主机上的 systemd 单元。

接下来，启动 RancherD。

```
systemctl enable rancherd-server.service。
systemctl start rancherd-server.service。
```

### 3. 重复上述步骤

对另一个 Linux 节点重复步骤一和步骤二，使集群中的节点数量达到三个。

**结果：** Rancher 高度可用，安装完成。

## 升级

有关升级和回滚的信息，请参考[本页。](/docs/rancher2/installation_new/install-rancher-on-linux/upgrades/_index)

## 配置

有关如何配置证书、节点污点、Rancher Helm 图表选项或 RancherD CLI 选项的信息，请参考[配置参考](/docs/rancher2/installation_new/install-rancher-on-linux/rancherd-configuration/_index)

## 卸载

要从系统中卸载 RancherD，请运行以下命令。这将关闭进程，删除 RancherD 二进制文件，并清理 RancherD 使用的文件。

```
rancherd-uninstall.sh
```

## RKE2 文档

有关用于提供底层集群的 Kubernetes 发行版 RKE2 的更多信息，请参考文档[这里](https://docs.rke2.io/)
