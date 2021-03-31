---
title: 节点选项配置
---

## 概述

`nodes`是`cluster.yml`文件中唯一需要填写的部分，它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。

## 节点配置示例

下面的例子显示了`cluster.yml`中的节点配置：

```yaml
nodes:
  - address: 1.1.1.1
    user: ubuntu
    role:
      - controlplane
      - etcd
    ssh_key_path: /home/user/.ssh/id_rsa
    port: 2222
  - address: 2.2.2.2
    user: ubuntu
    role:
      - worker
    ssh_key: |-
      -----BEGIN RSA PRIVATE KEY-----

      -----END RSA PRIVATE KEY-----
  - address: 3.3.3.3
    user: ubuntu
    role:
      - worker
    ssh_key_path: /home/user/.ssh/id_rsa
    ssh_cert_path: /home/user/.ssh/id_rsa-cert.pub
  - address: 4.4.4.4
    user: ubuntu
    role:
      - worker
    ssh_key_path: /home/user/.ssh/id_rsa
    ssh_cert: |-
      ssh-rsa-cert-v01@openssh.com AAAAHHNza...
    taints: # Available as of v0.3.0
      - key: test-key
        value: test-value
        effect: NoSchedule
  - address: example.com
    user: ubuntu
    role:
      - worker
    hostname_override: node3
    internal_address: 192.168.1.6
    labels:
      app: ingress
```

## Kubernetes 角色

您可以指定您希望节点作为 Kubernetes 集群的一部分的角色列表。支持的角色有三种：`controlplane`、`etcd`和`worker`。`controlplane`、`etcd`和`worker`。节点角色不是相互排斥的。可以将任意角色组合分配给任何节点。也可以通过升级过程改变节点的角色。

> **注意：**在 v0.1.8 之前，工作负载/pod 可能在任何具有`worker`或`controlplane`角色的节点上运行，但从 v0.1.8 开始，它们将只被部署到任何 `worker`节点上。

### etcd

有了这个角色，`etcd`容器就会在这些节点上运行。Etcd 保存着您的集群的状态，是您集群中最重要的组件，是您集群的单一真相来源。虽然您可以只在一个节点上运行 etcd，但通常需要 3 个、5 个或更多的节点来创建一个 HA 配置。Etcd 是一个分布式的可靠键值存储，它存储了所有 Kubernetes 的状态。[在节点上设置污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)与**etcd**角色如下图所示。

| Taint Key                      | Taint Value | Taint Effect |
| ------------------------------ | ----------- | ------------ |
| `node-role.kubernetes.io/etcd` | `true`      | `NoExecute`  |

### Controlplane

通过这个角色，用于部署 Kubernetes 的无状态组件将在这些节点上运行。这些组件用于运行 API 服务器、调度器和控制器。[在节点上设置的污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)与**controlplane**角色如下图所示。

| Taint Key                              | Taint Value | Taint Effect |
| -------------------------------------- | ----------- | ------------ |
| `node-role.kubernetes.io/controlplane` | `true`      | `NoSchedule` |

### Worker

有了这个角色，部署的任何工作负载或 Pod 都会落在这些节点上。

## 节点选项

在每个节点内，可以使用多个指令。

### Address

`address`用于设置节点的主机名或 IP 地址。RKE 必须能够连接到这个地址。

### Internal Address

`internal_address`提供了让具有多个地址的节点设置一个特定的地址用于私有网络上的主机间通信的能力。如果没有设置`internal_address`，则使用`address`进行主机间通信。`internal_address`指令将设置用于 Kubernetes 组件的主机间通信的地址，例如 kube-apiserver 和 etcd。要改变 Canal 或 Flannel 网络插件的 vxlan 流量使用的接口，请参考[网络插件文档](/docs/rke/config-options/add-ons/network-plugins/_index)。

### Overriding the Hostname

`hostname_override`用于能够提供一个友好的名称，供 RKE 在 Kubernetes 中注册节点时使用。这个 hostname 不需要是可路由地址，但必须是一个有效的[Kubernetes 资源名](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names)。如果没有设置`hostname_override`，那么在 Kubernetes 中注册节点时就会使用`address`指令。

> **注意：**配置[云提供商](/docs/rke/config-options/cloud-providers/_index)时，可能需要覆盖主机名才能正确使用云提供商。[AWS 云提供商](https://v1-17.docs.kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#aws)有一个例外，其中`hostname_override`字段将被明确忽略。

### SSH Port

在每个节点中，您可以指定连接到这个节点时要使用的`端口`。默认的端口是`22`。

### SSH Users

对于每个节点，您指定连接到这个节点时要使用的`user`。这个用户必须是 Docker 组的成员，或者允许向节点的 Docker 套接字写入。

### SSH Key Path

对于每个节点，您可以指定路径，即`ssh_key_path`，用于连接到这个节点时要使用的 SSH 私钥。每个节点的默认密钥路径是`~/.ssh/id_rsa`。

> **Note:** If you have a private key that can be used across all nodes, you can set the [SSH key path at the cluster level](/docs/rke/config-options/_index) The SSH key path set in each node will always take precedence.

**注意：**如果您有一个可以在所有节点上使用的私钥，您可以设置[集群级的 SSH 密钥路径](/docs/rke/config-options/_index)。每个节点中设置的 SSH 密钥路径总是优先的。

### SSH Key

您可以不设置 SSH 密钥的路径，而是指定实际的密钥，即`ssh_key`，用来连接到节点。

### SSH Certificate Path

对于每个节点，您可以指定路径，即`ssh_cert_path`，用于连接到这个节点时要使用的签名 SSH 证书。

### SSH Certificate

您可以指定实际的证书，即`ssh_cert`，用来连接到节点，而不是设置签名的 SSH 证书的路径。

### Docker Socket

如果 Docker 套接字和默认的不一样，您可以设置`docker_socket`。默认是`/var/run/docker.sock`。

### Labels

您可以为每个节点添加一个任意的标签映射。当使用[入口控制器的](/docs/rke/config-options/add-ons/ingress-controllers/_index)`node_selector`选项时，可以使用它。

### Taints

您能够为每个节点添加[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)。
