---
title: "3. 安装 Kubernetes 集群"
description: 本节描述了如何根据我们的Rancher Server 环境的最佳实践来安装 Kubernetes 集群。该集群应仅用于运行 Rancher Server。
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
  - 其他安装方法
  - 离线安装
  - 安装 Kubernetes 集群
---

:::important 提示
如果要使用 Docker 在单个节点上安装 Rancher，请跳过本节。
:::

本节描述了如何根据 [Rancher Server 环境的最佳实践](/docs/rancher2.5/overview/architecture-recommendations/#kubernetes-的安装环境)来安装 Kubernetes 集群。该集群应专用于运行 Rancher Server。

从 Rancher v2.5 开始，Rancher 可以安装在任何 Kubernetes 集群上，包括托管的 Kubernetes。

在 RKE 或 K3s 上离线安装 Kubernetes 集群的步骤如下所示：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="k3s"
values={[
{ label: 'K3s', value: 'k3s', },
{ label: 'RKE', value: 'rke', },
]}>

<TabItem value="k3s">

在本指南中，我们假设你已经在离线环境中创建了节点，并且在堡垒机上有一个安全的 Docker 私有镜像仓库。

## 安装概要

1. 准备镜像目录
2. 创建镜像库 YAML
3. 安装 K3s 集群
4. 保存并使用 kubeconfig 文件

## 1、准备镜像目录

从[版本发布](https://github.com/rancher/k3s/releases)页面获取要运行的 K3s 版本的镜像`tar`文件。

:::note 提示
国内用户，可以导航到 https://mirror.rancher.cn 下载所需资源
:::

在每个节点上启动 K3s 之前，将这个`tar`文件放在 `images` 目录中，例如：

```bash
sudo mkdir -p /var/lib/rancher/k3s/agent/images/
sudo cp ./k3s-airgap-images-$ARCH.tar /var/lib/rancher/k3s/agent/images/
```

## 2、创建镜像库 YAML

在`/etc/rancher/k3s/registries.yaml`创建`registries.yaml`文件。这将告诉 K3s 如何连接到你的私有镜像仓库。

下面是一个`registries.yaml`文件的示例：

```yaml
---
mirrors:
  customreg:
    endpoint:
      - "https://ip-to-server:5000"
configs:
  customreg:
    auth:
      username: xxxxxx # 镜像仓库用户名
      password: xxxxxx # 镜像仓库密码
    tls:
      cert_file: <镜像仓库所用的客户端证书文件路径>
      key_file: <镜像仓库所用的客户端密钥文件路径>
      ca_file: <镜像仓库所用的ca文件路径>
```

请注意，目前，K3s 仅支持安全的镜像仓库（HTTPS）。

有关 K3s 的私有镜像仓库配置文件的更多信息，请参考 [K3s 文档](/docs/k3s/installation/private-registry/)。

## 3、安装 K3s 集群

Rancher 需要安装在支持的 Kubernetes 版本上。要了解你的 Rancher 版本支持哪些版本的 Kubernetes，请参考[支持维护条款。](https://rancher.com/support-matrix/)

要指定 K3s 的版本，在运行 K3s 安装脚本时使用 INSTALL_K3S_VERSION 环境变量。

从 [release](https://github.com/rancher/k3s/releases) 页面获取 K3s 二进制文件，匹配用于获取离线镜像 tar 的相同版本。
同时在 https://get.k3s.io ，获得 K3s 的安装脚本。

将二进制文件放在每个节点的`/usr/local/bin`中。将安装脚本放在每个节点的任何地方，并命名为`install.sh`。

在每个 server 上安装 K3s:

```
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

在每个 agent 上安装 K3s:

```
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken ./install.sh
```

注意，注意确保用 server 节点的 IP 或有效 DNS 替换 `myserver`，用 server 节点的 token 替换 `mynodetoken`。
节点 token 位于 server 节点上的 `/var/lib/rancher/k3s/server/node-token`。

> **注意：** K3s 还为 kubelets 提供了一个 `--resolv-conf` 标志，这可能有助于在离线网络中配置 DNS。

## 4、保存并使用 kubeconfig 文件

在每个 Rancher Server 节点上安装 K3s 时，会在节点上 `/etc/rancher/k3s/k3s.yaml` 创建一个 `kubeconfig` 文件。该文件包含访问集群的凭据，你应该将此文件保存在安全的位置。

要使用此`kubeconfig`文件，

1. 安装 Kubernetes 命令行工具 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)。
2. 将文件`/etc/rancher/k3s/k3s.yaml`复制并保存到本地计算机上的目录`~/.kube/config`中。
3. 在这个 `kubeconfig` 文件中，`server`参数为 `localhost`。你需要手动更改这个地址为负载均衡器的 DNS，并且指定端口 6443。（Kubernetes API Server 的端口为 6443，Rancher Server 的端口为 80 和 443。）以下是一个示例`k3s.yaml`：

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

**结果：** 你现在可以使用 `kubectl` 来管理你的 K3s 集群。如果你有多个 kubeconfig 文件，可以在使用 `kubectl` 时通过传递文件路径来指定要使用的 kubeconfig 文件：

```
kubectl --kubeconfig ~/.kube/config/k3s.yaml get pods --all-namespaces
```

有关`kubeconfig`文件的更多信息，请参考 [K3s 文档](/docs/k3s/cluster-access/)或[官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用 `kubeconfig` 文件访问集群的部分。

## 升级提示

可以通过以下方式完成离线环境的升级：

- 从[版本发布](https://github.com/rancher/k3s/releases)页面下载要升级的 K3s 版本的新镜像包（`tar`文件）。将`tar`包放在每个节点上的 `/var/lib/rancher/k3s/agent/images/` 目录中。删除旧的 `tar` 文件。

  :::note 提示
  国内用户，可以导航到 https://mirror.rancher.cn 下载资源
  :::

- 复制并替换每个节点上 `/usr/local/bin` 中的旧的 K3s 二进制文件。复制 https://get.k3s.io 上的安装脚本（因为它可能自上次发布以来已更改）。就像你过去使用相同的环境变量所做的那样再次运行脚本。
- 重新启动 K3s 服务（如果安装程序没有自动重启 K3s）。

</TabItem>

<TabItem value="rke">

我们将使用 Rancher Kubernetes Engine (RKE) 创建一个 Kubernetes 集群。在启动 Kubernetes 集群之前，你需要安装 RKE 并创建 RKE 配置文件。

## 1、安装 RKE

请按照 [RKE 文档](/docs/rke/installation/)中的说明安装 RKE。

## 2、创建 RKE 配置文件

在可以访问你的 Linux 节点上的 22/tcp 端口和 6443/tcp 端口的系统上，使用以下示例创建一个名为 `rancher-cluster.yml` 的新文件。

该文件是 RKE 配置文件，其中包括了你将要部署的集群的配置。

使用你创建的 [3 个节点](/docs/rancher2.5/installation/other-installation-methods/air-gap/prepare-nodes/)的 IP 地址或 DNS 名称，替换下面的代码示例中的值。

> **提示：**有关可用选项的更多详细信息，请参见 RKE [配置选项](/docs/rke/config-options/)。

<figcaption>RKE 选项</figcaption>

| 选项               | 是否必选       | 描述                                                       |
| :----------------- | :------------- | :--------------------------------------------------------- |
| `address`          | 是             | 离线环境中节点的 DNS 或 IP                                 |
| `user`             | 是             | 可以在节点上执行 docker 命令的用户                         |
| `role`             | 否             | 想要给节点分配的一个或多个 Kubernetes 角色                 |
| `internal_address` | 否<sup>1</sup> | 离线环境中节点的内部 DNS 或内网 IP                         |
| `ssh_key_path`     | 否             | 用来登录节点的 SSH 私钥文件路径（默认值为`~/.ssh/id_rsa`） |

> <sup>1</sup> 如果你想使用引用安全组或防火墙，某些服务（如 AWS EC2）需要设置 `internal_address`。

```yaml
nodes:
  - address: 10.10.3.187 # 离线环境节点 IP
    internal_address: 172.31.7.22 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa
  - address: 10.10.3.254 # 离线环境节点 IP
    internal_address: 172.31.13.132 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa
  - address: 10.10.3.89 # 离线环境节点 IP
    internal_address: 172.31.3.216 # 节点内网 IP
    user: rancher
    role: ["controlplane", "etcd", "worker"]
    ssh_key_path: /home/user/.ssh/id_rsa

private_registries:
  - url: <REGISTRY.YOURDOMAIN.COM:PORT> # 私有镜像库地址
    user: rancher
    password: "*********"
    is_default: true
```

## 3、执行 RKE

配置完`rancher-cluster.yml`之后，启动你的 Kubernetes 集群：

```
rke up --config ./rancher-cluster.yml
```

## 4、保存你的文件

> **重要**  
> 以下文件需要保存好，可以用来故障排查和升级集群。

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`：RKE 配置文件
- `kube_config_cluster.yml`：集群的 [Kubeconfig 文件](/docs/rke/kubeconfig/)，该文件包含对集群的完全访问权限的凭据。
- `rancher-cluster.rkestate`：[Kubernetes 集群状态文件](/docs/rke/installation/#kubernetes-集群状态文件)，该文件包含集群的当前状态，包括 RKE 配置和证书。

  *Kubernetes 集群状态文件仅在使用 RKE v0.2.0 或更高版本时创建。*

> 后两个文件名的 `rancher-cluster` 部分取决于你如何命名 RKE 集群配置文件。

</TabItem>

</Tabs>



## 问题排查

请查看[问题排查](/docs/rancher2.5/installation/other-installation-methods/troubleshooting/)页面，获取常见问题和解决方法。

## 后续操作

[安装 Rancher](/docs/rancher2.5/installation/other-installation-methods/air-gap/install-rancher/)
