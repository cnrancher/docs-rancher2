---
title: 示例
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

本节包含Backup和Restore自定义资源的示例。

默认的备份存储位置是在安装或升级`rancher-backup` operator时配置的。

只有Restore自定义资源使用与创建备份相同的加密配置secret时，才能还原加密的备份。

- [备份](#备份)
  - [在默认位置进行加密备份](#在默认位置进行加密备份)
  - [在默认位置进行定期备份](#在默认位置进行定期备份)
  - [在默认位置进行加密的定期备份](#在默认位置进行加密的定期备份)
  - [Minio中的加密备份](#minio中的加密备份)
  - [使用AWS Credential Secret在S3中备份](#使用aws-credential-secret在s3中备份)
  - [使用AWS Credential Secret在S3中进行定期备份](#使用aws-credential-secret在s3中进行定期备份)
  - [从具有访问S3的IAM权限的EC2节点进行备份](#从具有访问s3的iam权限的ec2节点进行备份)
- [恢复](#恢复)
  - [使用默认备份文件位置还原](#使用默认备份文件位置还原)
  - [恢复Rancher迁移](#恢复rancher迁移])
  - [从加密的备份中恢复](#从加密的备份中恢复)
  - [从Minio恢复加密的备份](#从minio恢复加密的备份)
  - [使用AWS凭证Secre访问S3从备份中还原](#使用aws凭证secre访问s3从备份中还原)
  - [从具有IAM权限的EC2节点还原以访问S3](#从具有iam权限的ec2节点还原以访问s3)
- [在S3中存储备份的凭证Secret示例](#在s3中存储备份的凭证secret示例)
- [EncryptionConfiguration示例](#encryptionconfiguration示例)

## 备份

本节包含Backup自定义资源的示例。

### 在默认位置进行加密备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: default-location-encrypted-backup
spec:
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
```

### 在默认位置进行定期备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: default-location-recurring-backup
spec:
  resourceSetName: rancher-resource-set
  schedule: "@every 1h"
  retentionCount: 10
```

### 在默认位置进行加密的定期备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: default-enc-recurring-backup
spec:
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
  schedule: "@every 1h"
  retentionCount: 3
```

### Minio中的加密备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: minio-backup
spec:
  storageLocation:
    s3:
      credentialSecretName: minio-creds
      credentialSecretNamespace: default
      bucketName: rancherbackups
      endpoint: minio.xip.io
      endpointCA: LS0tLS1CRUdJTi3VUFNQkl5UUT.....pbEpWaVzNkRS0tLS0t
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
```

### 使用AWS Credential Secret在S3中备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: s3-backup
spec:
  storageLocation:
    s3:
      credentialSecretName: s3-creds
      credentialSecretNamespace: default
      bucketName: rancher-backups
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
```

### 使用AWS Credential Secret在S3中进行定期备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: s3-recurring-backup
spec:
  storageLocation:
    s3:
      credentialSecretName: s3-creds
      credentialSecretNamespace: default
      bucketName: rancher-backups
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
  schedule: "@every 1h"
  retentionCount: 10
```

### 从具有访问S3的IAM权限的EC2节点进行备份

这个例子表明，如果运行 `rancher-backup` 的节点拥有[这些访问S3的权限](./../configuration/back-up-config/_index#ec2节点访问s3的iam权限设置)，就不必提供AWS的凭证secret来创建备份。

```yaml
apiVersion: resources.cattle.io/v1
kind: Backup
metadata:
  name: s3-iam-backup
spec:
  storageLocation:
    s3:
      bucketName: rancher-backups
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
  resourceSetName: rancher-resource-set
  encryptionConfigSecretName: encryptionconfig
```

## 恢复

本节包含Restore自定义资源的示例。

### 使用默认备份文件位置还原

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-default
spec:
  backupFilename: default-location-recurring-backup-752ecd87-d958-4d20-8350-072f8d090045-2020-09-26T12-29-54-07-00.tar.gz
#  encryptionConfigSecretName: test-encryptionconfig
```

### 恢复Rancher迁移

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-migration
spec:
  backupFilename: backup-b0450532-cee1-4aa1-a881-f5f48a007b1c-2020-09-15T07-27-09Z.tar.gz
  prune: false
  storageLocation:
    s3:
      credentialSecretName: s3-creds
      credentialSecretNamespace: default
      bucketName: rancher-backups
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
```

### 从加密的备份中恢复

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-encrypted
spec:
  backupFilename: default-test-s3-def-backup-c583d8f2-6daf-4648-8ead-ed826c591471-2020-08-24T20-47-05Z.tar.gz
  encryptionConfigSecretName: encryptionconfig
```

### 从Minio恢复加密的备份

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-minio
spec:
  backupFilename: default-minio-backup-demo-aa5c04b7-4dba-4c48-9ac4-ab7916812eaa-2020-08-30T13-18-17-07-00.tar.gz
  storageLocation:
    s3:
      credentialSecretName: minio-creds
      credentialSecretNamespace: default
      bucketName: rancherbackups
      endpoint: minio.xip.io
      endpointCA: LS0tLS1CRUdJTi3VUFNQkl5UUT.....pbEpWaVzNkRS0tLS0t
  encryptionConfigSecretName: test-encryptionconfig
```

### 使用AWS凭证Secre访问S3从备份中还原

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-s3-demo
spec:
  backupFilename: test-s3-recurring-backup-752ecd87-d958-4d20-8350-072f8d090045-2020-09-26T12-49-34-07-00.tar.gz.enc
  storageLocation:
    s3:
      credentialSecretName: s3-creds
      credentialSecretNamespace: default
      bucketName: rancher-backups
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
  encryptionConfigSecretName: test-encryptionconfig
```

### 从具有IAM权限的EC2节点还原以访问S3

这个例子表明，如果运行 `rancher-backup` 的节点拥有[这些访问S3的权限](./../configuration/back-up-config/_index#ec2节点访问s3的iam权限设置)，就不必提供AWS的凭证secret来从备份中还原。

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-s3-demo
spec:
  backupFilename: default-test-s3-recurring-backup-84bf8dd8-0ef3-4240-8ad1-fc7ec308e216-2020-08-24T10#52#44-07#00.tar.gz
  storageLocation:
    s3:
      bucketName: rajashree-backup-test
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
  encryptionConfigSecretName: test-encryptionconfig
```

## 在S3中存储备份的凭证Secret示例

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: creds
type: Opaque
data:
  accessKey: <Enter your access key>
  secretKey: <Enter your secret key>
```

## EncryptionConfiguration示例

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aesgcm:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - aescbc:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - secretbox:
          keys:
            - name: key1
              secret: YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=
```
