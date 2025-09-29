---
title: 配置备份存储位置
description: 配置一个默认保存所有备份的存储位置。您可以选择对每个备份进行覆盖，但仅限于使用与 S3 兼容的对象存储。在 operator 级别只能配置一个存储位置。
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
  - 备份与恢复
  - rancher2.5
  - 配置备份存储位置
---

配置一个默认保存所有备份的存储位置。您可以选择对每个备份进行覆盖，但仅限于使用与 S3 兼容的对象存储。在 operator 级别只能配置一个存储位置。

## 配置存储位置

### 无默认存储位置

您可以选择不配置任何 operator 级别存储位置。如果选择此选项，您必须配置一个与 S3 兼容的对象存储作为每个单独备份的存储位置。

### S3 兼容的对象存储

| 参数                  | 说明                                                                                                                        |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| Credential Secret     | 从 Rancher 的 secret 中选择 S3 的凭证。                                                                                     |
| Bucket Name           | 存储备份的 [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html) 的名称。默认值：`rancherbackups`。 |
| Region                | S3 桶所在的 [AWS 区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。                                |
| Folder                | 存储备份的 [S3 bucket 中的文件夹](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html)。              |
| Endpoint              | [S3 端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)，例如，`s3.us-west-2.amazonaws.com`。                      |
| Endpoint CA           | 用于 S3 端点的 CA 证书。默认值：base64 编码的 CA 证书                                                                       |
| insecureTLSSkipVerify | 如果你不使用 TLS ，则设置为 true。                                                                                          |

### 现有的 StorageClass

通过选择 StorageClass 选项安装 `rancher-backup` chart，将创建一个 Persistent Volume Claim(PVC)，Kubernetes 又会动态地提供一个 Persistent Volume(PV)，所有的备份都将默认保存在这个 PV 中。

关于创建存储类的信息，请参考[本节](/docs/rancher2.5/cluster-admin/volumes-and-storage/provisioning-new-storage/#1-add-a-storage-class-and-configure-it-to-use-your-storag-provider)

:::important 重要：
强烈建议使用回收策略为 "Retain" 的 StorageClass。否则，如果 `rancher-backup` chart 创建的 PVC 被删除（无论是在应用程序升级期间，还是意外），PV 也会被删除，这意味着所有保存在其中的备份都会被删除。
如果没有这样的 StorageClass，则在设置 PV 之后，一定要编辑其回收策略，并将其设置为 "Retain"，然后再将备份存储在其中。
:::

### 现有的持久卷

选择一个将用于存储备份的现有持久卷（PV）。有关在 Rancher 中创建 PersistentVolumes 的信息，请参阅[本节。](/docs/rancher2.5/cluster-admin/volumes-and-storage/attaching-existing-storage/#2-add-a-persistent-volume-that-refers-to-the-persistent-storage)

:::important 重要：
强烈建议使用回收策略为 "Retain" 的持久卷。否则，如果 `rancher-backup` chart 创建的 PVC 被删除（无论是在应用程序升级期间，还是意外），PV 也会被删除，这意味着所有保存在其中的备份都会被删除。
:::

## Rancher-backup Helm Chart 的 values.yaml 示例

当使用 Helm CLI 安装时，这个 values.yaml 文件可以用来配置 `rancher-backup` operator。

关于 `values.yaml` 文件和安装过程中配置 Helm chart 的更多信息，请参阅 [Helm 文档](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing)

```yaml
image:
  repository: rancher/backup-restore-operator
  tag: v1.0.3

## 默认的s3桶，用于存储所有由rancher-backup operator创建的备份文件
s3:
  enabled: false
  ## credentialSecretName如果设置，应该是包含AWS凭证的Secret名称
  ## 要使用IAM角色，不要设置这个字段
  credentialSecretName: creds
  credentialSecretNamespace: ""
  region: us-west-2
  bucketName: rancherbackups
  folder: base folder
  endpoint: s3.us-west-2.amazonaws.com
  endpointCA: base64 encoded CA cert
  # insecureTLSSkipVerify: optional

## 参考: http://kubernetes.io/docs/user-guide/persistent-volumes/
## 如果启用了持久化，operator将创建一个PVC，mountPath为/var/lib/backups。
persistence:
  enabled: false

  ## 如果定义, storageClassName: <storageClass>
  ## 如果设置为"-", storageClassName: "", 这禁用 dynamic provisioning
  ## 如果未定义（默认）或设置为空，则不设置storageClassName spec，
  ##   选择默认的供应者。 （AWS上的gp2, GKE上的standard，AWS和OpenStack）。
  ## 参考：https://kubernetes.io/docs/concepts/storage/persistent-volumes/#class-1
  ##
  storageClass: "-"

  ## 如果您想通过将StorageClasses设置为"-"来禁用动态配置，
  ## 并想针对某个特定的PV，请提供目标卷的名称。
  volumeName: ""

  ## 只有某些StorageClass允许调整PV的大小；
  ##   请参考：https://kubernetes.io/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/。

  size: 2Gi

global:
  cattle:
    systemDefaultRegistry: ""

nodeSelector: {}

tolerations: []

affinity: {}
```
