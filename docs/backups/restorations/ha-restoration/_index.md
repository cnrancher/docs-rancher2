---
title: RKE Rancher 高可用恢复
description: 此过程描述了如何使用 RKE 还原 Rancher Kubernetes 集群的快照。集群快照将包括 Kubernetes 配置以及 Rancher 数据库和状态。此外，由于 v0.2.0 更改了Kubernetes 集群状态的存储方式，因此不再需要使用 `pki.bundle.tar.gz` 文件。
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
  - 备份和恢复指南
  - 恢复
  - RKE Rancher 高可用恢复
---

此过程描述了如何使用 RKE 根据快照还原 Rancher Kubernetes 集群的数据。集群快照将包括 Kubernetes 配置以及 Rancher 数据库和状态。

此外，由于 v0.2.0 更改了 [Kubernetes 集群状态的存储方式](https://rancher.com/docs/rke/latest/en/installation/#kubernetes-cluster-state)，因此不再需要使用 `pki.bundle.tar.gz` 文件。

## 1. 准备

您需要安装 [RKE](https://rancher.com/docs/rke/latest/en/installation/) 和 [kubectl](https://rancher.com/docs/rancher/v2.x/en/faq/kubectl/) CLI 工具。

准备 3 个新节点作为还原的 Rancher 实例的目标。请参阅[高可用安装](/docs/installation/k8s-install/create-nodes-lb/_index)以了解节点要求。

我们建议您从新节点和干净状态开始。或者，您可以从现有节点清除 Kubernetes 和 Rancher 配置。这将破坏这些节点上的数据。有关过程，请参阅[节点清理](/docs/cluster-admin/cleaning-cluster-nodes/_index)。

> **重要:** 在开始还原之前，请确保旧集群节点上的所有 Kubernetes 服务都已停止。我们建议关闭这些旧的节点。

## 2. 放置快照

根据您的 RKE 版本，用于还原 etcd 集群的快照的处理方式有所不同。

#### RKE v0.2.0+

从 RKE v0.2.0 开始，快照可以保存在与 S3 兼容的后端中。要从存储在 S3 兼容后端中的快照还原集群，可以跳过此步骤，并在[步骤 4：还原数据库](#4-还原数据库)中检索快照。否则，您将需要直接将快照放置在节点上。

选择一个干净的节点。该节点将成为初始还原的“目标节点”。将快照放在目标节点上的`/opt/rke/etcd-snapshots`中。

#### RKE v0.1.x

拍摄快照时，RKE 将证书的备份（即名为 `pki.bundle.tar.gz` 的文件）保存在同一位置。快照和 PKI 捆绑包文件是还原过程所必需的，它们应位于同一位置。

选择一个干净的节点。该节点将成为初始还原的“目标节点”。将快照和 PKI 证书捆绑文件放在目标节点上的`/opt/rke/etcd-snapshots`目录中。

- 快照 - `<snapshot>.db`
- PKI 捆绑包 - `pki.bundle.tar.gz`

## 3. 配置 RKE

复制您原始的`rancher-cluster.yml`文件。

```
cp rancher-cluster.yml rancher-cluster-restore.yml
```

修改副本并进行以下更改。

- 删除或注释掉整个`addons:`部分。Rancher 的部署和支持配置已经在`etcd`数据库中。
- 更改您的`nodes:`部分以指向还原节点。
- 注释掉不是您的“目标节点”的节点。我们希望集群仅在该节点上启动。

_示例_ `rancher-cluster-restore.yml`

```yaml
nodes:
  - address: 52.15.238.179 # 新目标节点
    user: ubuntu
    role: [etcd, controlplane, worker]
# - address: 52.15.23.24
#   user: ubuntu
#   role: [ etcd, controlplane, worker ]
# - address: 52.15.238.133
#   user: ubuntu
#   role: [ etcd, controlplane, worker ]

# addons: |-
#   ---
#   kind: Namespace
#   apiVersion: v1
#   metadata:
#     name: cattle-system
#   ---
```

## 4. 还原数据库

将 RKE 与新的 `rancher-cluster-restore.yml` 配置一起使用，并将数据库还原到单个“目标节点”。

RKE 将使用目标节点上已还原的数据库创建一个 `etcd` 容器。在下一步中完集群启动前，该容器将不会完成 `etcd` 初始化并保持运行状态。

### 从本地快照还原

从本地快照还原 etcd 时，假定快照位于目录`/opt/rke/etcd-snapshots`中的目标节点上。

> **注意：** 对于 RKE v0.1.x，`pki.bundle.tar.gz` 文件也应该位于同一位置。

```bash
rke etcd snapshot-restore --name <snapshot>.db --config ./rancher-cluster-restore.yml
```

### 从 S3 中的快照还原

_自 RKE v0.2.0 起可用_

从位于兼容 S3 的后端中的快照还原 etcd 时，该命令需要 S3 信息才能连接到 S3 后端并检索快照。

> **注意：** 开始还原之前，请确保您的`cluster.rkestate`存在，因为其中包含集群的证书数据。

```bash
$ rke etcd snapshot-restore --config cluster.yml --name snapshot-name \
--s3 --access-key S3_ACCESS_KEY --secret-key S3_SECRET_KEY \
--bucket-name s3-bucket-name --s3-endpoint s3.amazonaws.com \
--folder folder-name # 自 v2.3.0 起可用
```

### `rke etcd snapshot-restore`的选项

S3 特定选项仅适用于 RKE v0.2.0 +。

| 选项                      | 描述                                                                                                           | S3 特定选项 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| `--name` 值               | 指定快照名称                                                                                                   |             |
| `--config` 值             | 指定集群 YAML 文件（默认为：“cluster.yml”）[$RKE_CONFIG]                                                       |             |
| `--s3`                    | 启用备份到 s3                                                                                                  | \*          |
| `--s3-endpoint` 值        | 指定 s3 端点 url (默认值："s3.amazonaws.com")                                                                  | \*          |
| `--access-key` 值         | 指定 s3 accessKey                                                                                              | \*          |
| `--secret-key` 值         | 指定 s3 secretKey                                                                                              | \*          |
| `--bucket-name` 值        | 指定 s3 桶名称                                                                                                 | \*          |
| `--folder` 值             | 指定 s3 在桶中到文件夹 _自 v2.3.0 起可用_                                                                      | \*          |
| `--region` 值             | 指定 s3 桶位置 (可选)                                                                                          | \*          |
| `--ssh-agent-auth`        | [使用 SSH_AUTH_SOCK 定义的 SSH 代理身份验证](https://rancher.com/docs/rke/latest/en/config-options/#ssh-agent) |             |
| `--ignore-docker-version` | [禁用 Docker 版本检查](https://rancher.com/docs/rke/latest/en/config-options/#supported-docker-versions)       |

## 5. 启动集群

使用 RKE 并在单个“目标节点”上启动集群。

> **注意：** 对于运行 RKE v0.2.0 +的用户，在开始还原之前，请确保存在您的`cluster.rkestate`，因为其中包含集群的证书数据。

```
rke up --config ./rancher-cluster-restore.yml
```

### 测试集群

RKE 完成后，它将在本地目录中创建一个凭证文件。配置`kubectl`以使用`kube_config_rancher-cluster-restore.yml`凭据文件并检查集群的状态。有关详细信息，请参见[安装和配置 kubectl](/docs/faq/kubectl/_index)）。

您的新集群将需要几分钟才能稳定下来。一旦看到新的“目标节点”过渡到`Ready`，并在`NotReady`中看到三个旧节点，您就可以继续。

```
kubectl get nodes

NAME            STATUS    ROLES                      AGE       VERSION
52.15.238.179   Ready     controlplane,etcd,worker    1m       v1.10.5
18.217.82.189   NotReady  controlplane,etcd,worker   16d       v1.10.5
18.222.22.56    NotReady  controlplane,etcd,worker   16d       v1.10.5
18.191.222.99   NotReady  controlplane,etcd,worker   16d       v1.10.5
```

### 清理旧节点

使用`kubectl`从集群中删除旧节点。

```
kubectl delete node 18.217.82.189 18.222.22.56 18.191.222.99
```

### 重新启动目标节点

重新启动目标节点以确保集群网络和服务处于干净状态，然后再继续。

### 检查 Kubernetes Pods

等待在`kube-system`, `ingress-nginx`中运行的 Pod 和在`cattle-system`中运行的`rancher` Pod 返回到 `Running` 状态。

> **注意：** `cattle-cluster-agent` 和 `cattle-node-agent` Pod 将处于 `Error` 或 `CrashLoopBackOff` 状态，直到 Rancher Server 启动且 DNS /负载均衡器已指向新集群为止。

```
kubectl get pods --all-namespaces

NAMESPACE       NAME                                    READY     STATUS    RESTARTS   AGE
cattle-system   cattle-cluster-agent-766585f6b-kj88m    0/1       Error     6          4m
cattle-system   cattle-node-agent-wvhqm                 0/1       Error     8          8m
cattle-system   rancher-78947c8548-jzlsr                0/1       Running   1          4m
ingress-nginx   default-http-backend-797c5bc547-f5ztd   1/1       Running   1          4m
ingress-nginx   nginx-ingress-controller-ljvkf          1/1       Running   1          8m
kube-system     canal-4pf9v                             3/3       Running   3          8m
kube-system     cert-manager-6b47fc5fc-jnrl5            1/1       Running   1          4m
kube-system     kube-dns-7588d5b5f5-kgskt               3/3       Running   3          4m
kube-system     kube-dns-autoscaler-5db9bbb766-s698d    1/1       Running   1          4m
kube-system     metrics-server-97bc649d5-6w7zc          1/1       Running   1          4m
kube-system     tiller-deploy-56c4cf647b-j4whh          1/1       Running   1          4m
```

### 添加其他节点

编辑`rancher-cluster-restore.yml` RKE 配置文件，并取消其他节点的注释。

_示例_ `rancher-cluster-restore.yml`

```yaml
nodes:
  - address: 52.15.238.179 # 新目标节点
    user: ubuntu
    role: [etcd, controlplane, worker]
  - address: 52.15.23.24
    user: ubuntu
    role: [etcd, controlplane, worker]
  - address: 52.15.238.133
    user: ubuntu
    role: [etcd, controlplane, worker]
# addons: |-
#   ---
#   kind: Namespace
```

运行 RKE 并将节点添加到新集群。

```
rke up --config ./rancher-cluster-restore.yml
```

## 完成

Rancher 现在应该正在运行，并且可以用来管理 Kubernetes 集群。查看高可用安装的[推荐架构](/docs/installation/k8s-install/_index)并更新 Rancher DNS 或负载均衡器的端点，从而定位到新集群。端点更新后，纳管的集群上的代理应自动重新连接。由于重新连接回退超时，这可能需要 10 到 15 分钟。

:::important 重要
请记住将新的 RKE 配置 `rancher-cluster-restore.yml` 和 Kubectl 凭据 `kube_config_rancher-cluster-restore.yml` 保存在安全的地方，以备将来维护。
:::
