---
title: 备份 Rancher
weight: 1
---

在本节中，你将学习如何备份运行在任何 Kubernetes 集群上的 Rancher。要备份通过 Docker 安装的 Rancher，请参见[单节点备份]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/docker-backups)。

`backup-restore` operator 需要安装在 local 集群上，并且只对 Rancher 应用进行备份。备份和恢复操作仅在本地 Kubernetes 集群中执行。

请知悉，`rancher-backup` operator 的 2.x.x 版本用于 Rancher v2.6.x。

> 当把备份恢复到一个新的 Rancher 设置中时，新设置的版本应该与备份的版本相同。在恢复备份时还应考虑 Kubernetes 的版本，因为集群中支持的 apiVersion 和备份文件中的 apiVersion 可能不同。

### 前提

Rancher 必须是 2.5.0 或更高版本。

请参见[此处]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher/#2-restore-from-backup-using-a-restore-custom-resource)获取在 Rancher 2.6.3 中将现有备份文件恢复到 v1.22 集群的帮助。

### 1. 安装 `rancher backup` operator

备份存储位置是 operator 级别的设置，所以需要在安装或升级 `rancher backup` 应用时进行配置。

备份文件的格式是 `.tar.gz`。这些文件可以推送到 S3 或 Minio，也可以存储在一个持久卷中。

1. 在左上角，单击**☰ > 集群管理**。
1. 在**集群**页面上，转到 `local` 集群并单击 **Explore**。Rancher Server 运行在 `local` 集群中。
1. 单击**应用 & 应用商店 > Chart**。
1. 点击 **Rancher 备份**。
1. 单击**安装**。
1. 配置默认存储位置。如需获取帮助，请参见[存储配置](../configuration/storage-config)。
1. 单击**安装**。

> **注意**：使用 `backup-restore` operator 执行恢复后，Fleet 中会出现一个已知问题：用于 `clientSecretName` 和 `helmSecretName` 的密文不包含在 Fleet 的 Git 仓库中。请参见[此处]({{<baseurl>}}rancher/v2.6/en/deploy-across-clusters/fleet/#troubleshooting)获得解决方法。

### 2. 执行备份

要执行备份，必须创建 Backup 类型的自定义资源。

1. 在左上角，单击**☰ > 集群管理**。
1. 在**集群**页面上，转到 `local` 集群并单击 **Explore**。
1. 在左侧导航栏中，点击 **Rancher 备份 > 备份**。
1. 点击**创建**。
1. 使用表单或 YAML 编辑器创建 Backup。
1. 要使用该表单配置 Backup 详细信息，请单击**创建**，然后参见[配置参考](../configuration/backup-config)和[示例](../examples/#backup)进行操作。
1. 要使用 YAML 编辑器，单击**创建 > 使用 YAML 文件创建**。输入 Backup YAML。这个示例 Backup 自定义资源将在 S3 中创建加密的定期备份。这个应用使用 `credentialSecretNamespace` 值来确定在哪里寻找 S3 备份的密文：

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
         folder: rancher
         region: us-west-2
         endpoint: s3.us-west-2.amazonaws.com
     resourceSetName: rancher-resource-set
     encryptionConfigSecretName: encryptionconfig
     schedule: "@every 1h"
     retentionCount: 10
   ```

   > **注意**：使用 YAML 编辑器创建 Backup 资源时，`resourceSetName` 必须设置为 `rancher-resource-set`。

   如需获得配置 Backup 的帮助，请参见[配置参考](../configuration/backup-config)和[示例](../examples/#backup)。

   > **重要提示**：`rancher-backup` operator 不保存 `EncryptionConfiguration` 文件。创建加密备份时，必须保存 `EncryptionConfiguration` 文件的内容，而且在使用备份还原时必须使用同一个文件。
1. 点击**创建**。

**结果**：备份文件创建在 Backup 自定义资源中配置的存储位置中。执行还原时使用该文件的名称。

