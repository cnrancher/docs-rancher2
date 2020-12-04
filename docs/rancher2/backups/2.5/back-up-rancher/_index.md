---
title: 备份 Rancher
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

在本节中，你将学习如何备份运行在任何Kubernetes集群上的Rancher。要备份通过Docker安装的Rancher，请参考[单节点备份](/docs/rancher2/backups/2.5/docker-installs/docker-backups/_index)的说明。

### 先决条件

Rancher版本必须是v2.5.0及以上

### 1. 安装 `rancher-backup` operator

备份存储位置是operator级别的设置，所以需要在安装或升级 `rancher-backup` 时进行配置。

备份创建为 `.tar.gz` 文件。这些文件可以推送到S3或Minio，也可以存储在一个持久卷中。

1. 在Rancher UI中，进入**Cluster Explorer.**
1. 点击 **Apps.**
1. 点击 `rancher-backup`.
1. 配置默认的存储位置。有关帮助，请参阅[存储配置部分](./../configuration/storage-config/_index)。

### 2. 执行备份

要执行备份，必须创建Backup类型的自定义资源。

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，点击**Rancher Backups.**
1. 点击 **Backup.**
1. 使用表单或YAML编辑器创建Backup。
1. 要使用该表单配置Backup详细信息，请单击**Create**，然后参考[配置参考](./../configuration/back-up-config/_index)和[范例](./../examples/_index#备份)。
1. 要使用YAML编辑器，我们可以点击**Create > Create from YAML.** 输入Backup YAML。这个例子备份自定义资源将在S3中创建加密的定期备份：

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
   :::note 注意
   使用YAML编辑器创建备份资源时，`resourceSetName` 必须设置为 `rancher-resource-set`。
   :::

   有关配置Backup的帮助，请参阅[配置参考](./../configuration/back-up-config/_index)和[示例](./../examples/_index#备份)

   :::important 重要
   `rancher-backup` operator 不保存EncryptionConfiguration文件。创建加密备份时必须保存EncryptionConfiguration文件的内容，从该备份中恢复时必须使用相同的文件。
   :::

1. 点击 **创建**

**结果：**在Backup自定义资源中配置的存储位置中创建了备份文件。执行还原时使用该文件的名称。
