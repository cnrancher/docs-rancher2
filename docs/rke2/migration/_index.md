---
title: 从 RKE1 迁移到 RKE2
description: 本节包含了当前 rke2 的已知问题和限制。如果你遇到这里没有记录的 rke2 的问题，请在[这里](https://github.com/rancher/rke2/issues)打开一个新问题。
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
  - 从 RKE1 迁移到 RKE2
---

*实验功能* / *不支持*

为了从 Rancher Kubernetes Engine（RKE1）迁移到 RKE2，你需要两个东西：

- ETCD 数据目录
- 集群 CA 证书

这两样东西都可以在 RKE1 的快照中找到，因为 RKE1 的快照中包含两样东西：etcd 快照和集群的 `.rkestate`。

## Migration Agent 介绍

migration-agent 是一个为 RKE1 节点迁移到 RKE2 的工具。它主要通过两个步骤完成迁移工作：

- 将 etcd 节点上的 etcd 快照恢复到 RKE2 的 etcd db 数据目录。
- 从 `.rkestate` 文件中复制 CA 证书和服务账户令牌密钥到 RKE2 数据目录。

该工具在运行 RKE2 之前先在 RKE1 节点上运行。

### 使用方法

1. 为了运行迁移，你需要先在 RKE1 节点上做一个快照。

```
rke etcd snapshot-save --s3 --name rke1snapshot --access-key <access-key> --secret-key <secret-key> --region <region> --folder <folder> --bucket-name <bucket name>
```

更多信息，请参考 RKE1[官方文档](/docs/rke/etcd-snapshots/one-time-snapshots/_index)

2. 现在你可以直接在节点上运行 migration-agent，或者使用下面的 [manifest](https://github.com/rancher/migration-agent/blob/master/deploy/daemonset.yaml) 将 migration-agent 作为 daemonset 部署在 RKE1 集群上。在应用 manifest 文件之前，你需要编辑该文件，加入 RKE1 的 s3 快照信息：

```shell
command:
- "sh"
- "-c"
- "migration-agent --s3-region <region> --s3-bucket <s3 bucket> --s3-folder <s3 folder> --s3-access-key <access-key> --s3-secret-key <secret-key>  --snapshot rke1db.zip && sleep 9223372036854775807"
```

3. 运行该工具后，你应该看到在控制平面和 etcd 节点上已经创建了以下路径：

```yaml
/etc/rancher/rke2/config.yaml.d/10-migration.yaml
/var/lib/rancher/rke2/server/
/var/lib/rancher/rke2/server/db/
/var/lib/rancher/rke2/server/manifests/
/var/lib/rancher/rke2/server/tls/
/var/lib/rancher/rke2/server/cred
```

4. 下一步是停止 rke1 的 docker 容器：

```shell
systemctl disable docker
systemctl stop docker
```

5. 最后一步是安装和运行 rke2 server 或 agent，取决于节点的类型：

```
curl -sfL https://get.rke2.io | sh -
systemctl start rke2-server
systemctl enable rke2-server
```

### 集群配置

migration-agent 的功能之一是将集群配置从 rkestate 文件复制到 `/etc/rancher/rke2/config.yaml.d/10-migration.yaml`，这包括：

- Cluster CIDR
- Service CIDR
- Service Node Port Range
- Cluster DNS
- Cluster Domain
- Extra API Args
- Extra Scheduler Args
- Extra Controller Manager Args

### 附加组件的迁移

RKE2 将 addons 部署为 Helm Chart，所以 migration-agent 创建了一个 manifest，删除了旧的 RKE1 addons，让 RKE2 将 addons 部署为 Helm Chart。

### 集群附加组件配置迁移

migration-agent 的一个功能是将集群附加组件的所有配置迁移到 RKE2 中，这包括：

- CoreDNS 配置
- Metrics-Server 配置
- Ingress Nginx 配置

#### CoreDNS 配置

RKE1 为 CoreDNS 增加了几个配置选项，migration-agent 确保这些配置被迁移到 HelmchartConfig 中，该配置将用于配置 CoreDNS helmChart：

| CoreDNS Optinos                            |
| ------------------------------------------ |
| PriorityClassName                          |
| NodeSelector                               |
| RollingUpdate                              |
| Tolerations                                |
| AutoScalerConfig.Enabled                   |
| AutoScalerConfig.PriorityClassName         |
| AutoScalerConfig.Min                       |
| AutoScalerConfig.Max                       |
| AutoScalerConfig.CoresPerReplica           |
| utoScalerConfig.NodesPerReplica            |
| AutoScalerConfig.PreventSinglePointFailure |

#### Metrics Server 配置

migration-agent 对 Metrics Server 也做了同样的配置

| Metrics Server Options |
| :--------------------: |
|   PriorityClassName    |
|      NodeSelector      |
|          RBAC          |
|      Tolerations       |

#### Ingress Nginx 配置

| Nginx Ingress Config |
| :------------------: |
|      ConfigMap       |
|     NodeSelector     |
|      ExtraArgs       |
|      ExtraEnvs       |
|     ExtraVolumes     |
|  ExtraVolumeMounts   |
|     Tolerations      |
|      DNSPolicy       |
|       HTTPPort       |
|      HTTPSPort       |
|  PriorityClassName   |
| DefaultBackendConfig |

### 云提供商支持

migration-agent 能够迁移云提供商的配置，这是通过将 rke1 的配置文件复制到 rke2 的配置目录中，然后向 RKE2 传递标志，包括云提供商配置的名称和路径：

```yaml
--cloud-provider-config
--cloud-provider-name
```

### 私有注册表支持

Agent 还增加了迁移私有注册表配置的能力，这通过复制 rke1 中 cluster.yaml 文件中配置的私有注册表来实现。不幸的是，RKE1 缺乏将 TLS 配置传递给私有注册表的功能，而是依赖于每个节点上手动的 Docker TLS 配置，所以为了解决这个问题，migration-agent 支持一个标志 --registry，它可以配置私有注册表的 TLS 路径，语法应该是`<registry url>,<ca cert path>,<cert path>,<key path>`。

### CNI 配置迁移

RKE1 和 RKE2 都支持 Calico 和 Canal CNI，所以只有在使用 Canal 或 Calico 时，migration-agent 才能迁移 CNI。
