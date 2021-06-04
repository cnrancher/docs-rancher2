---
title: 高可用安装
description: 本节介绍如何安装一个高可用性（HA）的 RKE2 集群。一个高可用的 RKE2 集群由以下部分组成
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
  - RKE2
  - 高可用安装
  - 高可用
  - HA
---


本节介绍如何安装一个高可用性（HA）的 RKE2 集群。一个高可用的 RKE2 集群由以下部分组成：

- 一个**固定的注册地址**，放在 server 节点的前面，允许其他节点在集群中注册。
- 一个奇数（推荐三个）的 `server节点`，将运行 etcd、Kubernetes API 和其他控制面服务。
- 零个或多个**agent 节点**，它们将运行你的应用程序和服务。

Agent 通过固定的注册地址进行注册。但是，当 RKE2 启动 kubelet 且必须连接到 Kubernetes api 服务器时，它通过`rke2 agent`进程（充当客户端负载均衡器）进行连接。

设置一个 HA 集群需要以下步骤：

1. 配置一个固定的注册地址
1. 启动第一个 server 节点
1. 加入其他 server 节点
1. 加入 agent 节点

### 1. 配置固定的注册地址

除了第一个 server 节点和所有 agent 节点之外，还需要一个 URL 来进行注册。这可以是任何一个 server 节点的 IP 或 hostname，但在许多情况下，随着节点的创建和销毁，这些可能会随着时间而改变。因此，你应该在 server 节点的前面有一个稳定的端点。

这个端点可以使用多种方法来设置，例如：

- 一个 4 层（TCP）负载均衡器
- 轮询的 DNS
- 虚拟或弹性 IP 地址

这个端点也可以用来访问 Kubernetes 的 API。因此，你可以修改你的[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)文件指向这个端点，而不是指向特定节点。

注意，`rke2 server` 进程在端口 `9345` 上监听新节点的注册。正常情况下，Kubernetes API 的服务端口是`6443`。相应地配置你的负载均衡器。

### 2. 启动第一个 server 节点

第一个 server 节点建立 token，其他 server 或 agent 节点在连接到集群时将用这个 token 来注册。

如果要指定自定义的 token，可以在启动时设置`token`参数。

如果你没有指定 token，RKE2 将生成一个 token 并放在`/var/lib/rancher/rke2/server/node-token`中。

为了避免固定注册地址的证书错误，你应该在启动 server 时设置`tls-san`参数。这个选项在 server 节点的 TLS 证书中增加了一个额外的 hostname 或 IP 作为备用名称，如果你希望同时通过 IP 和 hostname 访问，可以将其指定为一个列表。

如果你遵循本指南，则这是 RKE2 配置文件（位于`/etc/rancher/rke2/config.yaml`）的示例：

```yaml
token: my-shared-secret
tls-san:
  - my-kubernetes-domain.com
  - another-kubernetes-domain.com
```

#### 2a. 可选：server 节点的污点

默认情况下，server 节点是可调度的，因此你的工作负载可以在它们上面启动。如果你希望有一个专用的控制平面，没有用户工作负载运行，你可以使用 taints。参数 `node-taint` 将允许你配置带有污点的节点。下面是一个在配置文件中添加节点污点的例子:

```yaml
node-taint:
  - "CriticalAddonsOnly=true:NoExecute"
```

### 3. 启动其他 server 节点

其他的 server 节点的启动和第一个节点的启动很相似，只是你必须指定 `server` 和 `token` 参数，以便它们能够成功连接到初始 server 节点。

如果你遵循本指南，则以下示例显示了其他 server 节点的 RKE2 配置文件：

```yaml
server: https://my-kubernetes-domain.com:9345
token: my-shared-secret
tls-san:
  - my-kubernetes-domain.com
  - another-kubernetes-domain.com
```

如前所述，你必须有总数为奇数的 server 节点。

### 4. 确认集群是正常的

在所有 server 节点上启动`rke2 server`进程后，请确保群集已正常启动：

```bash
/var/lib/rancher/rke2/bin/kubectl \
        --kubeconfig /etc/rancher/rke2/rke2.yaml get nodes
```

你应该看到你的 server 节点处于`Ready`状态。

### 5. 可选：加入 agent 节点

因为 RKE2 server 节点默认是可调度的，所以一个 HA 的 RKE2 server 集群的最小节点数是 3 个 server 节点和 0 个 agent 节点。要添加指定的节点来运行你的应用程序和服务，请将 agent 节点加入你的集群。

在 HA 集群中加入 agent 节点与[在单个 server 集群中加入 agent 节点](/docs/rke2/quickstart/_index#agent-worker-node-installation)是一样的。你只需要指定 agent 应该注册的 URL 和它应该使用的 token。

```yaml
server: https://my-kubernetes-domain.com:9345
token: my-shared-secret
```
