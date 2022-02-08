---
title: 示例
weight: 5
---

本节包含 Backup 和 Restore 自定义资源的示例。

默认的备份存储位置是在安装或升级 `rancher-backup` operator 时配置的。

只有 Restore 自定义资源使用创建备份时使用的加密配置密文时，才能还原加密的备份。

- [备份](#backup)
   - [在默认位置进行加密备份](#backup-in-the-default-location-with-encryption)
   - [在默认位置进行定期备份](#recurring-backup-in-the-default-location)
   - [在默认位置进行加密的定期备份](#encrypted-recurring-backup-in-the-default-location)
   - [Minio 中的加密备份](#encrypted-backup-in-minio)
   - [使用 AWS 凭证密文在 S3 中备份](#backup-in-s3-using-aws-credential-secret)
   - [使用 AWS 凭证密文在 S3 中进行定期备份](#recurring-backup-in-s3-using-aws-credential-secret)
   - [从具有访问 S3 的 IAM 权限的 EC2 节点进行备份](#backup-from-ec2-nodes-with-iam-permission-to-access-s3)
- [还原](#restore)
   - [使用默认备份文件位置还原](#restore-using-the-default-backup-file-location)
   - [为 Rancher 迁移进行还原](#restore-for-rancher-migration)
   - [从加密的备份中还原](#restore-from-encrypted-backup)
   - [从 Minio 还原加密的备份](#restore-an-encrypted-backup-from-minio)
   - [使用 AWS 凭证密文访问 S3 从备份中还原](#restore-from-backup-using-an-aws-credential-secret-to-access-s3)
   - [从具有访问 S3 的 IAM 权限的 EC2 节点进行还原](#restore-from-ec2-nodes-with-iam-permissions-to-access-s3)
- [在 S3 中存储备份的凭证密文示例](#example-credential-secret-for-storing-backups-in-s3)
- [EncryptionConfiguration 示例](#example-encryptionconfiguration)

## 备份

本节包含 Backup 自定义资源的示例。

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

### Minio 中的加密备份

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

### 使用 AWS 凭证密文在 S3 中备份

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

### 使用 AWS 凭证密文在 S3 中进行定期备份

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

### 从具有访问 S3 的 IAM 权限的 EC2 节点进行备份

这个例子表明，如果运行 `rancher-backup` 的节点拥有这些[访问 S3 的权限](../configuration/backup-config/#iam-permissions-for-ec2-nodes-to-access-s3)，就不必提供 AWS 的凭证密文来创建备份。

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

## 还原

本节包含 Restore 自定义资源的示例。

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

### 为 Rancher 迁移进行还原
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

### 从加密的备份中还原

```yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-encrypted
spec:
  backupFilename: default-test-s3-def-backup-c583d8f2-6daf-4648-8ead-ed826c591471-2020-08-24T20-47-05Z.tar.gz
  encryptionConfigSecretName: encryptionconfig
```

### 从 Minio 还原加密的备份

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

### 使用 AWS 凭证密文访问 S3 从备份中还原

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

### 从具有访问 S3 的 IAM 权限的 EC2 节点进行还原

这个例子表明，如果运行 `rancher-backup` 的节点拥有这些[访问 S3 的权限](../configuration/backup-config/#iam-permissions-for-ec2-nodes-to-access-s3)，就不必提供 AWS 的凭证密文来从备份中还原。

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

## 在 S3 中存储备份的凭证密文示例

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: creds
type: Opaque
data:
  accessKey: <Enter your base64-encoded access key>
  secretKey: <Enter your base64-encoded secret key>
```

## EncryptionConfiguration 示例

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



