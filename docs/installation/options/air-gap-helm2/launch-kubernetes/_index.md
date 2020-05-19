---
title: "3、安装 Kubernetes 集群"
description: 本节介绍如何准备启动 Kubernetes 集群，该集群用于为私有环境部署 Rancher Server。
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
  - 资料、参考和高级选项
  - Rancher 高可用 Helm2 离线安装
  - 安装 Kubernetes 集群
---

> Helm 3 已经发布，Rancher 离线安装指南已经更新成使用 Helm 3 来安装。
> 如果您使用的是 Helm 2，我们建议您[迁移到 Helm 3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)，因为 Helm 3 比 Helm 2 更安全，更容易使用。
> 本节提供了较早版本的使用 Helm 2 离线安装 Rancher 的方法，如果无法升级到 Helm 3，可以使用此方法。

使用 RKE 安装 Kubernetes（仅限使用 Kubernetes 安装 Rancher）

本节介绍如何准备启动 Kubernetes 集群，该集群用于为私有环境部署 Rancher Server。

因为 Rancher 高可用安装需要 Kubernetes 集群。所以，我们需要使用[Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)（RKE）来部署 Kubernetes 集群。在安装 Kubernetes 之前，您需要先[安装 RKE](https://rancher.com/docs/rke/latest/en/installation/)，并且创建一个 RKE 配置文件。

## A. 创建 RKE 配置文件

在可以访问主机节点上的端口 22 / tcp 和 6443 / tcp 的系统上，使用以下示例创建一个名为`rancher-cluster.yml`的新文件。该文件是 Rancher Kubernetes Engine 的配置文件（RKE 配置文件）。

使用您创建的[3 个节点](/docs/installation/options/air-gap-helm2/prepare-nodes/_index)的 IP 地址或 DNS 名称，替换下面的代码示例中的值。

> **提示：**有关可用选项的更多详细信息，请参见 RKE [配置选项](https://rancher.com/docs/rke/latest/en/config-options/)。

<figcaption>RKE 选项</figcaption>

| 选项               | 必选             | 描述                                                       |
| ------------------ | ---------------- | ---------------------------------------------------------- |
| `address`          | ✓                | 离线环境中节点的 DNS 或 IP                                 |
| `user`             | ✓                | 可以在节点上执行 docker 命令的用户                         |
| `role`             | ✓                | 给节点分配的 Kubernetes 角色列表                 |
| `internal_address` | 可选<sup>1</sup> | 离线环境中节点的内部 DNS 或内网 IP                         |
| `ssh_key_path`     |                  | 用来登录节点的 SSH 私钥文件路径（默认值为`~/.ssh/id_rsa`） |

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

## B. 执行 RKE

配置完`rancher-cluster.yml`之后，启动您的 Kubernetes 集群：

```
rke up --config ./rancher-cluster.yml
```

## C. 保存您的文件

> **重要**
> 以下文件需要被维护，用来故障排查和升级集群。

将以下文件的副本保存在安全的位置：

- `rancher-cluster.yml`: RKE 配置文件
- `kube_config_rancher-cluster.yml`: [Kubeconfig 文件](https://rancher.com/docs/rke/latest/en/kubeconfig/)
- `rancher-cluster.rkestate`：[Kubernetes 集群状态文件](https://rancher.com/docs/rke/latest/en/installation/#kubernetes-cluster-state)

> **注意：** 后两个文件名的“rancher-cluster”部分取决于您如何命名 RKE 集群的配置文件。

## 遇到了问题？

请查看[问题排查](/docs/installation/options/troubleshooting/_index)页面。

## [下一步：安装 Rancher](/docs/installation/options/air-gap-helm2/install-rancher/_index)
