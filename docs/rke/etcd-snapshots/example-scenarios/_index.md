---
title: 示例场景
---

## 概述

本文提供了使用 RKE 备份和恢复集群的场景。示例场景使用的是部署在两个 AWS 节点上的 Kubernetes 集群：`node1` 和`node2`。我们会模拟`node2`失效的场景，创建一个新的节点`node3`并将`node2`的快照备份迁移到`node3`。具体的操作步骤因 RKE 版本而异，请按照您使用的 RKE 版本阅读对应的章节。节点的详细信息如下表所示：

| 名称  | IP 地址  | 节点角色              |
| :---- | :------- | :-------------------- |
| node1 | 10.0.0.1 | [controlplane,worker] |
| node2 | 10.0.0.2 | [etcd]                |
| node3 | 10.0.0.3 | [etcd]                |

![备份集群](/img/rke/rke-etcd-backup.png)

## RKE v0.2.0 或更新的版本

### 概述

本章节提供了使用 RKE v0.2.0 或更新的版本进行备份和恢复集群的操作指导，分为以下五个步骤：

1. [备份集群](#备份集群)
1. [模拟节点 failure](#模拟节点-failure)
1. [新建 etcd 节点](#新建-etcd-节点)
1. [使用备份恢复新建节点的数据](#使用备份恢复新建节点的数据)
1. [确认恢复后的集群处于正常状态](#确认恢复后的集群处于正常状态)

### 备份集群

运行以下命令，备份集群。如果您配置了 AWS S3 相关的参数，RKE 会将快照上传到 S3 Backend。AWS S3 相关的参数的详细信息请参考本文最后一个章节。

```shell
rke etcd snapshot-save --name snapshot.db --config cluster.yml
```

### 模拟节点失效的场景

运行以下命令，关闭`node2`，模拟节点失效的场景。运行命令后，`node2`的状态变更为不可用：

```shell
root@node2:~# poweroff
```

### 新建 etcd 节点

升级和恢复 etcd 节点之前，您需要将新建的节点添加到 Kubernetes 集群内，并为其分配`etcd`角色。请打开`cluster.yml`文件，将`node2`相关的参数变更为注释，然后添加新节点`node3`的参数，如下所示。

```yaml
nodes:
  - address: 10.0.0.1
    hostname_override: node1
    user: ubuntu
    role:
      - controlplane
      - worker
  #    - address: 10.0.0.2
  #      hostname_override: node2
  #      user: ubuntu
  #      role:
  #       - etcd
  - address: 10.0.0.3
    hostname_override: node3
    user: ubuntu
    role:
      - etcd
```

### 使用备份恢复新建节点的数据

**先决条件：**开始恢复节点前，请确保您的`cluster.rkestate`文件有效，因为该文件包含了集群所需的证书数据。

将新建的节点添加到`cluster.yml`中后，运行 `rke etcd snapshot-restore`命令，从备份中启动`etcd`：

```shell
rke etcd snapshot-restore --name snapshot.db --config cluster.yml
```

默认配置下，RKE 将快照保存在`/opt/rke/etcd-snapshots`路径。

如果您想直接从 S3 获取快照，可以在以上代码示例的基础上添加配置参数，详情请参考本文的最后一个章节。

> **说明：**从 v0.2.0 开始，恢复集群所需的证书信息存储在`cluster.rkestate`中，所以`pki.bundle.tar.gz`不再是恢复集群时的必备文件。

### 确认恢复后的集群处于正常状态

`rke etcd snapshot-restore`命令触发了使用新的`cluster.yml`运行`rke up`命令。请运行`kubectl get pods`确认您的 Kubernetes 集群处于正常状态。如果状态正常，返回的信息应该与以下代码示例相似：

```shell
> kubectl get pods
NAME                     READY     STATUS    RESTARTS   AGE
nginx-65899c769f-kcdpr   1/1       Running   0          17s
nginx-65899c769f-pc45c   1/1       Running   0          17s
nginx-65899c769f-qkhml   1/1       Running   0          17s
```

## RKE v0.2.0 之前的版本

### 概述

本章节提供了使用 RKE v0.2.0 之前的版本进行备份和恢复集群的操作指导，分为以下 8 个步骤：

1. [创建集群的本地快照](#创建集群的本地快照)
1. [将集群快照保存到外部](#将集群快照保存到外部)
1. [模拟节点失效的场景](#模拟节点失效的场景)
1. [移除 Kubernetes 集群并清理节点](#移除-Kubernetes-集群并清理节点)
1. [获取备份信息并将其存储在新建的节点上](#获取备份信息并将其存储在新建的节点上)
1. [为 Kubernetes 集群添加新节点](#为-Kubernetes-集群添加新节点)
1. [使用备份在新节点上恢复 etcd 节点信息](#使用备份在新节点上恢复-etcd-节点信息)
1. [恢复集群操作](#恢复集群操作)

### 创建集群的本地快照

运行以下命令，创建集群快照并保存至本地：

```shell
rke etcd snapshot-save --name snapshot.db --config cluster.yml
```

### 将集群快照保存到外部

创建 `node2`的快照后，建议将这个快照保存在安全的地方，例如将备份和`pki.bundle.tar.gz`信息在一个 S3 的 bucket 里面或是磁带备份。如果您使用的是 AWS 主机并且有可用的 S3 存储，请执行以下步骤：

```shell
root@node2:~# s3cmd mb s3://rke-etcd-backup
root@node2:~# s3cmd \
  /opt/rke/etcd-snapshots/snapshot.db \
  /opt/rke/etcd-snapshots/pki.bundle.tar.gz \
  s3://rke-etcd-backup/
```

### 模拟节点失效的场景

运行以下命令，关闭`node2`，模拟节点失败的场景。运行命令后，`node2`的状态变更为不可用

```shell
root@node2:~# poweroff
```

### 移除 Kubernetes 集群并清理节点

运行以下命令，移除集群并清理节点。

```shell
rke remove --config rancher-cluster.yml
```

### 获取备份信息并将其存储在新建的节点上

在原有的集群中创建一个新的节点`node3`。获取保存在 S3 里面的备份数据，将其迁移到新节点中。

```shell
# Make a Directory
root@node3:~# mkdir -p /opt/rke/etcdbackup

# Get the Backup from S3
root@node3:~# s3cmd get \
  s3://rke-etcd-backup/snapshot.db \
  /opt/rke/etcd-snapshots/snapshot.db

# Get the pki bundle from S3
root@node3:~# s3cmd get \
  s3://rke-etcd-backup/pki.bundle.tar.gz \
  /opt/rke/etcd-snapshots/pki.bundle.tar.gz
```

> **说明：** 如果您有多个 etcd 节点，您需要手动同步为所有 etcd 节点同步快照数据和`pki.bundle.tar.gz`文件。

### 为 Kubernetes 集群添加新节点

升级和恢复 etcd 节点之前，您需要将新建的节点添加到 Kubernetes 集群内，并为其分配`etcd`角色。请打开`cluster.yml`文件，将`node2`相关的参数变更为 comment，然后添加新节点的参数，如下所示。

```yaml
nodes:
  - address: 10.0.0.1
    hostname_override: node1
    user: ubuntu
    role:
      - controlplane
      - worker
  #    - address: 10.0.0.2
  #      hostname_override: node2
  #      user: ubuntu
  #      role:
  #       - etcd
  - address: 10.0.0.3
    hostname_override: node3
    user: ubuntu
    role:
      - etcd
```

### 使用备份在新节点上恢复 etcd 节点信息

在`cluster.yml`文件中添加了 node3 作为新节点后，运行 `rke etcd snapshot-restore`命令，从备份中启动`etcd`：

```shell
rke etcd snapshot-restore --name snapshot.db --config cluster.yml
```

每个 etcd 节点对应的快照和`pki.bundle.tar.gz` 会被保存在`/opt/rke/etcd-snapshots`路径下。

### 恢复集群操作

最后我们需要将集群的状态恢复为正常。我们需要使用修改后的`cluster.yml`运行`rke up` 命令，将 Kubernetes API 指向新建的`etcd`节点，

```shell
rke up --config cluster.yml
```

请运行`kubectl get pods`确认您的 Kubernetes 集群处于正常状态。如果状态正常，返回的信息应该与以下代码示例相似：

```shell
> kubectl get pods
NAME                     READY     STATUS    RESTARTS   AGE
nginx-65899c769f-kcdpr   1/1       Running   0          17s
nginx-65899c769f-pc45c   1/1       Running   0          17s
nginx-65899c769f-qkhml   1/1       Running   0          17s
```

## Etcd-Snapshot 服务的可配置参数

| 参数               | 说明                                                                                                                                                                                                            | S3 相关 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| **interval_hours** | 创建快照的间隔时间。如果您使用 RKE v0.2.0 定义了`creation`参数，`interval_hours`会覆盖这个参数。如果不输入这个值，默认间隔是 5 分钟。支持输入正整数表示小时，如 1 表示间隔时间为 1 小时，每小时会创建一个快照。 |         |
| **retention**      | 快照的存活时间，当快照存活的时间超过这个限制后，会自动删除快照。如果在`etcd.retention`和`etcd.backup_config.retention`都配置了限制，RKE 会以`etcd.backup_config.retention`为准。                                |         |
| **bucket_name**    | S3 的 桶名称（bucket name）                                                                                                                                                                                     | \*      |
| **folder**         | 指定 S3 存储节点快照的文件夹（可选）， RKE v0.3.0 及以上版本可用                                                                                                                                                | \*      |
| **access_key**     | S3 的 accessKey                                                                                                                                                                                                 | \*      |
| **secret_key**     | S3 的 secretKey                                                                                                                                                                                                 | \*      |
| **region**         | S3 的 桶所在的区域（可选）                                                                                                                                                                                      | \*      |
| **endpoint**       | 指定 S3 端点 URL 地址，默认值为 **s3.amazonaws.com**                                                                                                                                                            | \*      |
| **custom_ca**      | 自定义证书认证，用于连接 S3 端点。使用私有存储时必填，RKE v0.2.5 及以上版本可用。                                                                                                                               | \*      |

> **说明：**
>
> - 如果 AWS EC2 示例配置了 IAM 认证，则`--access-key`和`--secret-key`不是必填项。
> - 表格第三列标记为"\* "的参数，是 S3 相关的参数。
