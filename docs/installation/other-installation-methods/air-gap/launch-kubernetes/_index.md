---
title: "3、安装 Kubernetes 集群"
description: 本节描述了如何根据我们的Rancher Server 环境的最佳实践来安装 Kubernetes 集群。该集群应仅用于运行 Rancher Server。
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
  - 其他安装方法
  - 离线安装
  - 安装 Kubernetes 集群
---

:::important 提示！
如果要使用 Docker 在单个节点上安装 Rancher，请跳过本节。
:::

本节描述了如何根据 [Rancher Server 环境的最佳实践](/docs/overview/architecture-recommendations/_index)来安装 Kubernetes 集群。该集群应仅用于运行 Rancher Server。

对于 v2.4 之前的 Rancher，Rancher 应该安装在 [RKE](https://rancher.com/docs/rke/latest/en/)（Rancher Kubernetes Engine）Kubernetes 集群上。RKE 是经过 CNCF 认证的 Kubernetes 发行版，并且全部组件完全在 Docker 容器内运行。

从 Rancher v2.4 开始，Rancher Server 可以安装在 RKE Kubernetes 集群或 K3s Kubernetes 集群上。K3s 也是 Rancher 发布的经过完全认证的 Kubernetes 发行版，但比 RKE 更新。我们建议在 K3s 上安装 Rancher，因为 K3s 易于使用且更轻量，全部组件都打包在了一个二进制文件里。并且这个二进制文件小于 100 MB。注意：如果在 RKE 集群上安装了 Rancher 之后，目前没有办法将这个高可用部署迁移到 K3s 集群上。

Rancher Server 只能在使用 RKE 或 K3s 安装的 Kubernetes 集群中运行。不支持在托管的 Kubernetes 集群（例如 EKS）上使用 Rancher。

在离线环境中安装 Kubernetes 集群的步骤会根据是在 RKE 上安装 Rancher 还是在 K3s 上安装 Rancher 有所不同。

## 安装 K3s 集群

### 先决条件

- 已经在离线环境中创建了节点
- 已经部署了 Docker 私有镜像仓库

### 1、准备镜像目录

1. 从[版本发布](https://github.com/rancher/k3s/releases)页面获取要运行的 K3s 版本的镜像`tar`文件。

2. 在每个节点上启动 K3s 之前，将这个`tar`文件放在 `images` 目录中，例如：

```bash
sudo mkdir -p /var/lib/rancher/k3s/agent/images/
sudo cp ./k3s-airgap-images-$ARCH.tar /var/lib/rancher/k3s/agent/images/
```

### 2、创建镜像库 YAML

在`/etc/rancher/k3s/registries.yaml`创建`registries.yaml`文件。这将告诉 K3s 如何连接到您的私有镜像仓库。

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

有关 K3s 的私有镜像仓库配置文件的更多信息，请参考[K3s 文档](https://rancher.com/docs/k3s/latest/en/installation/private-registry/)。

### 3、安装 K3s 集群

1. 从[版本发布](https://github.com/rancher/k3s/releases)页面获取 K3s 二进制文件，找到与版本对应的镜像`tar`文件包，并通过 https://get.k3s.io 获取 K3s 安装脚本。

2. 将二进制文件放在每个节点上的`/usr/local/bin`中。

3. 将安装脚本放置在每个节点上的任何位置，并将其命名为`install.sh`。

4. 请根据您的准备好的数据库，替换以下命令中的数据库连接字符串，并在准备好的两台 Linux 节点中运行命令来安装 K3s：

```
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"' ./install.sh
```

> **注意：** K3s 还为 kubelet 提供了一个`--resolv-conf` 参数，这可能有助于在离线环境中配置 DNS。

### 4、保存并使用 kubeconfig 文件

在每个 Rancher Server 节点上安装 K3s 时，会在节点上`/etc/rancher/k3s/k3s.yaml`位置创建一个`kubeconfig`文件。该文件包含用于完全访问集群的凭据，您应该将此文件保存在安全的位置。

要使用此`kubeconfig`文件，

1. 安装 Kubernetes 命令行工具[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)。
2. 将文件`/etc/rancher/k3s/k3s.yaml`复制并保存到本地计算机上的目录`~/.kube/config`中。
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

有关`kubeconfig`文件的更多信息，请参考 [K3s 文档](https://rancher.com/docs/k3s/latest/en/cluster-access/)或[官方 Kubernetes 文档](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)中关于使用`kubeconfig`文件访问集群的部分。

### 升级提示

可以通过以下方式完成离线环境的升级：

- 从[版本发布](https://github.com/rancher/k3s/releases)页面下载要升级的 K3s 版本的新镜像包（`tar`文件）。将`tar`包放在每个节点上的`/var/lib/rancher/k3s/agent/images/`目录中。删除旧的 `tar` 文件。
- 复制并替换每个节点上`/usr/local/bin`中的旧的 K3s 二进制文件。因为自上一发行以来，脚本可能已更改，单击[这里](https://raw.githubusercontent.com/rancher/k3s/master/install.sh)获取新的二进制文件。与过去一样，使用相同的环境变量再次运行脚本。
- 重新启动 K3s 服务（如果安装程序未自动重启 K3s）。

## 安装 RKE 集群

### 先决条件

- 已安装 RKE
- 已创建 RKE 配置文件

### 1、安装 RKE

请按照[RKE 文档](https://rancher.com/docs/rke/latest/en/installation/)中的说明安装 RKE。

### 2、创建 RKE 配置文件

在可以访问 Linux 节点上的 22 / tcp 端口和 6443 / tcp 端口的系统上，使用以下示例创建一个名为`rancher-cluster.yml`的新文件。

该文件是 RKE 配置文件，其中包括了您将要部署的集群的配置。

使用您创建的[3 个节点](/docs/installation/other-installation-methods/air-gap/prepare-nodes/_index)的 IP 地址或 DNS 名称，替换下面的代码示例中的值。

> **提示：**有关可用选项的更多详细信息，请参见 RKE [配置选项](https://rancher.com/docs/rke/latest/en/config-options/)。

<figcaption>RKE 选项</figcaption>

| 选项               | 是否必选       | 描述                                                       |
| :----------------- | :------------- | :--------------------------------------------------------- |
| `address`          | 是             | 离线环境中节点的 DNS 或 IP                                 |
| `user`             | 是             | 可以在节点上执行 docker 命令的用户                         |
| `role`             | 否             | 想要给节点分配的一个或多个 Kubernetes 角色                 |
| `internal_address` | 否<sup>1</sup> | 离线环境中节点的内部 DNS 或内网 IP                         |
| `ssh_key_path`     | 否             | 用来登录节点的 SSH 私钥文件路径（默认值为`~/.ssh/id_rsa`） |

> <sup>1</sup> 如果您想使用自引用安全组或防火墙，某些服务（如 AWS EC2）需要设置`internal_address`。

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

### 3、执行 RKE

配置完`rancher-cluster.yml`之后，启动您的 Kubernetes 集群：

```
rke up --config ./rancher-cluster.yml
```

### 4、保存您的文件

> **重要**
> 以下文件需要被维护，用来故障排查和升级集群。

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`：RKE 配置文件
- `kube_config_rancher-cluster.yml`：[Kubeconfig 文件](https://rancher.com/docs/rke/latest/en/kubeconfig/)
- `rancher-cluster.rkestate`：[Kubernetes 集群状态文件](https://rancher.com/docs/rke/latest/en/installation/#kubernetes-cluster-state)

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 问题排查

请查看[问题排查](/docs/installation/options/troubleshooting/_index)页面，获取常见问题和解决方法。

## 后续操作

[安装 Rancher](/docs/installation/other-installation-methods/air-gap/install-rancher/_index)
