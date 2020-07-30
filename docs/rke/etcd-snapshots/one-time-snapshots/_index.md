---
title: 创建一次性快照
---

## 概述

v0.2.0 或以上的版本和 v0.2.0 之前的版本创建一次性快照的方式不同，请阅读下文对应的章节获取创建一次性快照的信息。

## RKE v0.2.0 或以上的版本

打开命令行工具，输入`rke etcd snapshot-save`命令，运行后即可保存 cluster config 文件内每个 etcd 节点的快照。RKE 会将节点快照保存在`/opt/rke/etcd-snapshots`路径下。运行上述命令时，RKE 会创建一个用于备份快照的容器。完成备份后，RKE 会删除该容器。您可以将一次性快照适配 S3 的后端主机。具体过程如下：

1. 首先，运行以下命令，在本地创建一个一次性快照：

   ```
   $ rke etcd snapshot-save --config cluster.yml --name snapshot-name
   ```

   **结果：** 创建了一个快照，保存在 `/opt/rke/etcd-snapshots`路径下。

2. 然后，运行以下命令，将这个快照保存到 S3。

   ```
   $ rke etcd snapshot-save \
   --config cluster.yml \
   --name snapshot-name \
   --s3 \
   --access-key S3_ACCESS_KEY \
   --secret-key S3_SECRET_KEY \
   --bucket-name s3-bucket-name \
   --folder s3-folder-name \ # Optional - Available as of v0.3.0
   --s3-endpoint s3.amazonaws.com
   ```

   **结果：** 保存在 `/opt/rke/etcd-snapshots`路径下的快照已经上传至 S3。

### rke etcd snapshot-save 命令的可配置参数

创建一次性快照时，可配置的参数如下表所示：

| 参数                      | 描述                                                                         | S3 相关参数 |
| :------------------------ | :--------------------------------------------------------------------------- | :---------- |
| `--name`                  | 指定快照名称                                                                 |             |
| `--config`                | 指定 YAML 文件名称，如果不指定，则会使用`cluster.yml`文件                    |             |
| `--s3`                    | 启用 S3 存储服务备份节点快照                                                 | \*          |
| `--s3-endpoint`           | 指定 S3 端点 URL 地址，默认值为 **s3.amazonaws.com**                         | \*          |
| `--s3-endpoint-ca`        | 指定 CA 证书文件的路径连接自定义 S3 端点（可选）， RKE v0.2.5 及以上版本可用 | \*          |
| `--access-key`            | S3 的 accessKey                                                              | \*          |
| `--secret-key`            | S3 的 secretKey                                                              | \*          |
| `--bucket-name`           | S3 的 桶名称（bucket name）                                                  | \*          |
| `--folder`                | 指定 S3 存储节点快照的文件夹（可选）， RKE v0.3.0 及以上版本可用             | \*          |
| `--region`                | S3 的 桶所在的区域（可选）                                                   | \*          |
| `--ssh-agent-auth`        | [使用 SSH_AUTH_SOCK 定义的 SSH Agent Auth](/docs/rke/config-options/_index)  |             |
| `--ignore-docker-version` | [禁用 Docker 版本检查](/docs/rke/config-options/_index)                      |

> **说明：**
>
> - 如果 AWS EC2 示例配置了 IAM 认证，则`--access-key`和`--secret-key`不是必填项。
> - 表格第三列标记为"\* "的参数，是 S3 相关的参数。

### 使用自定义 CA 证书认证 S3

_v0.2.0 或以上的版本可用_

备份快照可以被存储在自定义`S3`备份机器，如[minio](https://min.io/)上。如果 S3 Backend 使用的是自签名证书或自定义证书，需要使用`--s3-endpoint-ca`将自定义证书验证并连接到 S3 Backend。

### 使用 IAM 认证 S3 并储存节点快照

RKE 支持使用 IAM 角色权限管理进行 S3 认证。集群的 etcd 节点必须分配有 IAM 角色，并且这个角色需要有读写 S3 存储节点快照的桶的权限。节点必须有权限访问 S3 端点。

以下是[IAM 策略示例代码](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html)，给节点开放了在 S3 上读取和写入备份快照的权限。

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListObjectsInBucket",
            "Effect": "Allow",
            "Action": ["s3:ListBucket"],
            "Resource": ["arn:aws:s3:::bucket-name"]
        },
        {
            "Sid": "AllObjectActions",
            "Effect": "Allow",
            "Action": "s3:*Object",
            "Resource": ["arn:aws:s3:::bucket-name/*"]
        }
    ]
}
```

关于如何为应用开放访问 S3 的权限，请查看 AWS 的文档[使用 IAM 角色向在 Amazon EC2 实例上运行的应用程序授予权限](https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)。

## RKE v0.2.0 之前的版本

打开命令行工具，输入`rke etcd snapshot-save`命令，运行后即可保存 cluster config 文件内每个 etcd 节点的快照。

运行上述命令时，RKE 会创建一个用于备份快照的容器。完成备份后，RKE 会删除该容器。

RKE 会为证书生成备份，在同一路径下将证书保存为`pki.bundle.tar.gz`文件。恢复集群时，会用到快照和 pki 文件。

运行以下命令，在本地创建一次性快照：

```
$ rke etcd snapshot-save --config cluster.yml --name snapshot-name
```

**结果：** RKE 会将节点快照保存在`/opt/rke/etcd-snapshots`路径下。

### rke etcd snapshot-save 命令的可参数

| 参数                      | 描述                                                                        |
| :------------------------ | :-------------------------------------------------------------------------- |
| `--name`                  | 指定快照名称                                                                |
| `--config`                | 指定 YAML 文件名称，如果不指定，则会使用`cluster.yml`文件 [$RKE_CONFIG]     |
| `--ssh-agent-auth`        | [使用 SSH_AUTH_SOCK 定义的 SSH Agent Auth](/docs/rke/config-options/_index) |
| `--ignore-docker-version` | [禁用 Docker 版本检查](/docs/rke/config-options/_index)                     |
