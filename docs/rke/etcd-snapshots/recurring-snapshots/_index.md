---
title: 创建定时快照
---

## 概述

RKE v0.2.0 或以上的版本和 v0.2.0 之前的版本创建定时快照的方式不同，请阅读下文对应的章节获取对应信息。

## RKE v0.2.0 或以上的版本

您可以启用`etcd-snapshot`服务，使用相关的[配置参数](#Etcd-Snapshot-服务的可配置参数)，以开启定时备份 etcd 节点快照功能。`etcd-snapshot`在`etcd`容器之外的服务容器中运行。默认设置下，`etcd-snapshot`服务会为每一个具有`etcd`角色的节点创建快照，然后将这些快照储存在本地的`/opt/rke/etcd-snapshots`路径下。如果您配置了[AWS S3 相关的参数](#Etcd-Snapshot-服务的可配置参数)，RKE 会将快照上传到 S3 Backend。可配置的参数在下文的表格中有详细的描述。

### 快照服务日志

运行已经启用`etcd-snapshot`的集群时，您可以在命令行工具中输入`docker logs etcd-rolling-snapshots`，查看`etcd-rolling-snapshots`日志，确认集群是否已开启定时快照功能。如果集群已经开启定时快照功能，输入该命令后，返回的消息包含了每个快照的创建时间、创建信息、名称和运行时间，与下方代码示例相似。

```
$ docker logs etcd-rolling-snapshots

time="2018-05-04T18:39:16Z" level=info msg="Initializing Rolling Backups" creation=1m0s retention=24h0m0s
time="2018-05-04T18:40:16Z" level=info msg="Created backup" name="2018-05-04T18:40:16Z_etcd" runtime=108.332814ms
time="2018-05-04T18:41:16Z" level=info msg="Created backup" name="2018-05-04T18:41:16Z_etcd" runtime=92.880112ms
time="2018-05-04T18:42:16Z" level=info msg="Created backup" name="2018-05-04T18:42:16Z_etcd" runtime=83.67642ms
time="2018-05-04T18:43:16Z" level=info msg="Created backup" name="2018-05-04T18:43:16Z_etcd" runtime=86.298499ms
```

### Etcd-Snapshot 服务的可配置参数

创建定时快照时，可配置的参数如下表所示。

| 参数               | 说明                                                                                                                                                                                                                                                                                   | S3 相关 |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| **interval_hours** | 创建快照的间隔时间。如果您使用 RKE v0.2.0 定义了`creation`参数，`interval_hours`会覆盖这个参数。如果不输入这个值，默认间隔是 5 分钟。支持输入正整数表示小时，如 1 表示间隔时间为 1 小时，每小时会创建一个快照；也支持输入正整数+m，表示分钟，如 1m 表示 1 分钟，每分钟会创建一个快照。 |         |
| **retention**      | 快照的存活时间，当快照存活的时间超过这个限制后，会自动删除快照。如果在`etcd.retention`和`etcd.backup_config.retention`都配置了限制，RKE 会以`etcd.backup_config.retention`为准。                                                                                                       |         |
| **bucket_name**    | S3 的 桶名称（bucket name）                                                                                                                                                                                                                                                            | \*      |
| **folder**         | 指定 S3 存储节点快照的文件夹（可选）， RKE v0.3.0 及以上版本可用                                                                                                                                                                                                                       | \*      |
| **access_key**     | S3 的 accessKey                                                                                                                                                                                                                                                                        | \*      |
| **secret_key**     | S3 的 secretKey                                                                                                                                                                                                                                                                        | \*      |
| **region**         | S3 的 桶所在的区域（可选）                                                                                                                                                                                                                                                             | \*      |
| **endpoint**       | 指定 S3 端点 URL 地址，默认值为 **s3.amazonaws.com**                                                                                                                                                                                                                                   | \*      |
| **custom_ca**      | 自定义证书认证，用于连接 S3 端点。使用私有存储时必填，RKE v0.2.5 及以上版本可用。                                                                                                                                                                                                      | \*      |

> **说明：**
>
> - 如果 AWS EC2 示例配置了 IAM 认证，则`--access-key`和`--secret-key`不是必填项。
> - 表格第三列标记为"\* "的参数，是 S3 相关的参数。

### 使用自定义 CA 证书认证 S3

备份快照可以被存储在自定义`S3`备份机器，如[minio](https://min.io/)上。如果 S3 Backend 使用的是自签名证书或自定义证书，需要使用`--s3-endpoint-ca`将自定义证书验证并连接到 S3 Backend。

### 使用 IAM 认证 S3 并储存节点快照

RKE 支持使用 IAM 角色权限管理进行 S3 认证，请确认集群和节点具有以下权限：

- 集群的 etcd 节点必须分配有 IAM 角色，并且这个角色需要有读写 S3 存储节点快照的桶的权限。
- 节点必须有权限访问 S3 端点。

以下是[IAM 策略示例代码](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html)，给节点开放了在 S3 上读取和写入备份快照的权限。

```json
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

### 配置快照服务的 YAML 示例

```yaml
services:
  etcd:
    backup_config:
      interval_hours: 12 # 创建快照的间隔时间，单位是小时，12表示每12个小时创建一个快照，也可以用1m表示一分钟
      retention: 6 # 快照的存活时间，单位是小时，也可以用1m表示一分钟
      s3backupconfig:
        access_key: S3_ACCESS_KEY
        secret_key: S3_SECRET_KEY
        bucket_name: s3-bucket-name
        region: "" # 可选填
        folder: "" # 可选填，RKE v0.3.0开始可用
        endpoint: s3.amazonaws.com #默认值为：s3.amazonaws.com
        custom_ca: |-
          -----BEGIN CERTIFICATE-----
          $CERTIFICATE
          -----END CERTIFICATE-----
```

## RKE v0.2.0 之前的版本

您可以启用`etcd-snapshot`服务和相关的[配置参数](#options-for-the-etcd-snapshot-service)，以开启定时备份 etcd 节点快照功能。`etcd-snapshot`在`etcd`容器之外的服务容器中运行。默认设置下，`etcd-snapshot`服务会为每一个具有`etcd`角色的节点创建快照，然后将这些快照储存在本地的`/opt/rke/etcd-snapshots`路径下。

RKE 会为证书生成备份，在同一路径下将证书保存为`pki.bundle.tar.gz`文件。恢复集群时，会用到快照和 pki 文件。

### 快照服务日志

运行已经启用`etcd-snapshot`的集群时，您可以在命令行工具中输入`docker logs etcd-rolling-snapshots`，查看`etcd-rolling-snapshots`日志，确认集群是否开启定时快照功能。输入该命令后，返回的消息包含了创建时间、创建信息、快照名称和 runtime，与下方代码示例相似。

```
$ docker logs etcd-rolling-snapshots

time="2018-05-04T18:39:16Z" level=info msg="Initializing Rolling Backups" creation=1m0s retention=24h0m0s
time="2018-05-04T18:40:16Z" level=info msg="Created backup" name="2018-05-04T18:40:16Z_etcd" runtime=108.332814ms
time="2018-05-04T18:41:16Z" level=info msg="Created backup" name="2018-05-04T18:41:16Z_etcd" runtime=92.880112ms
time="2018-05-04T18:42:16Z" level=info msg="Created backup" name="2018-05-04T18:42:16Z_etcd" runtime=83.67642ms
time="2018-05-04T18:43:16Z" level=info msg="Created backup" name="2018-05-04T18:43:16Z_etcd" runtime=86.298499ms
```

### 本地`Etcd-Snapshot` 的可配置参数

| 参数          | 描述                                                                                        |
| :------------ | :------------------------------------------------------------------------------------------ |
| **snapshot**  | 布尔值，默认为`false`，不启动定时备份功能。将它设置为`true`时，会启动定时备份功能。         |
| **creation**  | 创建快照的间隔时间，默认间隔是`5m0s`，即 5 分钟。                                           |
| **retention** | 保存快照的时间，默认值为`24h`，即 24 小时。当快照存活的时间超过这个限制后，会自动删除快照。 |

### 配置快照服务的 YAML 示例

```yaml
services:
  etcd:
    snapshot: true
    creation: 5m0s
    retention: 24h
```
