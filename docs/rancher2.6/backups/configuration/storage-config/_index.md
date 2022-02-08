---
title: 备份存储位置配置
shortTitle: 存储
weight: 3
---

配置一个用于保存所有备份的默认存储位置。你可以选择对每个备份进行覆盖，但仅限于使用 S3 对象存储。

在 operator 级别只能配置一个存储位置。

- [存储位置配置](#storage-location-configuration)
   - [无默认存储位置](#no-default-storage-location)
   - [与 S3 兼容的对象存储](#s3-compatible-object-store)
   - [使用现有的 StorageClass](#existing-storageclass)
   - [使用现有的 PersistentVolume](#existing-persistent-volume)
- [rancher-backup Helm Chart 的示例 values.yaml](#example-values-yaml-for-the-rancher-backup-helm-chart)

## 存储位置配置

### 无默认存储位置

你可以选择不配置 operator 级别的存储位置。如果选择此选项，你必须配置一个与 S3 兼容的对象存储作为每个备份的存储位置。

### S3 兼容的对象存储

| 参数 | 描述 |
| -------------- | -------------- |
| Credential Secret | 从 Rancher 的密文中选择 S3 的凭证。[示例]({{<baseurl>}}/rancher/v2.6/en/backups/examples/#example-credential-secret-for-storing-backups-in-s3)。 |
| Bucket Name | 存储备份的 [S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html)的名称。默认值：`rancherbackups`。 |
| Region | S3 存储桶所在的 [AWS 区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。 |
| Folder | 存储备份的 [S3 存储桶中的文件夹](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/using-folders.html)。 |
| Endpoint | [S3 端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)，例如 `s3.us-west-2.amazonaws.com`。 |
| Endpoint CA | 用于 S3 端点的 CA 证书。默认值：base64 编码的 CA 证书。 |
| insecureTLSSkipVerify | 如果你不使用 TLS，则设置为 `true`。 |

### 使用现有的 StorageClass

如果你通过选择 StorageClass 选项来安装 `rancher-backup` Chart，将会创建一个持久卷说明（Persistent Volume Claim，PVC），而且 Kubernetes 会动态配置一个持久卷（Persistent Volume，PV），所有备份都会默认保存到该持久卷中。

关于创建存储类的信息，请参见[本章节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/provisioning-new-storage/)。

> **重要提示**：
> 强烈建议使用回收策略为 "Retain" 的 StorageClass。否则，如果 `rancher-backup` Chart 创建的 PVC 在应用升级期间或意外被删除后，PV 也会被删除，也就是说所有保存在其中的备份都会被删除。  
> 如果没有这样的 StorageClass，则在设置 PV 之后，一定要将它的回收策略设置为 "Retain"，然后再将备份存储在其中。

### 使用现有的持久卷

选择一个用于存储备份的现有持久卷。有关在 Rancher 中创建 PersistentVolumes 的更多信息，请参见[本节]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/attaching-existing-storage/#2-add-a-persistent-volume-that-refers-to-the-persistent-storage)。

> **重要提示**：
> 强烈建议使用回收策略为 "Retain" 的 Persistent Volume。否则，如果 `rancher-backup` Chart 创建的 PVC 在应用升级期间或意外被删除后，PV 也会被删除，也就是说所有保存在其中的备份都会被删除。


## rancher-backup Helm Chart 的示例 values.yaml


当使用 Helm CLI 进行安装时，`values.yaml` 文件可以用来配置 `rancher-backup` operator。

有关 `values.yaml` 文件和在安装时配置 Helm Charts 的更多信息，请参见 [Helm 文档](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing)。

```yaml
image:
  repository: rancher/rancher-backup
  tag: v0.0.1-rc10

## 默认的 S3 存储桶，用于存储所有由 rancher-backup operator 创建的备份文件
s3:
  enabled: false
  ## 如果要设置 credentialSecretName，则需要是包含 AWS 凭证的密文的名称
  ## 要使用 IAM 角色，不要设置这个字段
  credentialSecretName: creds
  credentialSecretNamespace: ""
  region: us-west-2
  bucketName: rancherbackups
  folder: base folder
  endpoint: s3.us-west-2.amazonaws.com
  endpointCA: base64 encoded CA cert
  # insecureTLSSkipVerify: optional

## 参考：http://kubernetes.io/docs/user-guide/persistent-volumes/
## 如果启用了持久化，operator 将创建一个 PVC，mountPath 为/var/lib/backups
persistence:
  enabled: false

  ## 如果要定义，则 storageClassName：<storageClass>
  ## 如果设为 "-", storageClassName: ""，将禁用动态配置
  ## 如果不定义（默认）或设为 null，则不设置 storageClassName 规格
  ##   而是选择默认的 provisioner（AWS 上的 gp2，GKE，AWS & OpenStack 上的
  ##   standard）
  ## 参考：https://kubernetes.io/docs/concepts/storage/persistent-volumes/#class-1
  ##
  storageClass: "-"

  ## 如果你想通过把 storageClass 设为 "-" 来禁用动态配置，
  ## 而且想使用某个特定的 PV，你需要提供该目标卷的名称
  volumeName: ""

  ## 只有某些 StorageClasses 支持调整 PV 的大小。参考：https://kubernetes.io/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/
  size: 2Gi


global:
  cattle:
    systemDefaultRegistry: ""

nodeSelector: {}

tolerations: []

affinity: {}
```
