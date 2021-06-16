---
title: 备份 Rancher
description: 在本节中，你将学习如何备份运行在任何 Kubernetes 集群上的 Rancher。
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
  - 备份和恢复
  - rancher 2.5
  - 备份 Rancher
---

在本节中，你将学习如何备份运行在任何 Kubernetes 集群上的 Rancher。要备份通过 Docker 安装的 Rancher，请参考[单节点备份](/docs/rancher2.5/backups/docker-installs/docker-backups/_index)的说明。

## 先决条件

Rancher 版本必须是 v2.5.0 及以上。

## 步骤 1：安装 `rancher-backup` operator

备份存储位置是 operator 级别的设置，所以需要在安装或升级 `rancher-backup` 时进行配置。

备份创建为 `.tar.gz` 文件。这些文件可以推送到 S3 或 Minio，也可以存储在一个持久卷中。

1. 在 Rancher UI 中，进入**Cluster Explorer**。
1. 单击 **Apps**。
1. 单击 `Rancher Backups`。
1. 配置默认的存储位置。有关帮助，请参阅[存储配置部分](/docs/rancher2.5/backups/configuration/storage-config/_index)。

## 步骤 2：执行备份

要执行备份，必须创建 Backup 类型的自定义资源。

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，单击**Rancher Backups**。
1. 单击 **Backup**。
1. 使用表单或 YAML 编辑器创建 Backup。
1. 要使用该表单配置 Backup 详细信息，请单击**Create**，然后参考[配置参考](/docs/rancher2.5/backups/configuration/back-up-config/_index)和[范例](/docs/rancher2.5/backups/examples/_index)。
1. 要使用 YAML 编辑器，我们可以单击**Create > Create from YAML**，输入 Backup YAML。这个例子备份自定义资源将在 S3 中创建加密的定期备份。该应用程序使用`credentialSecretNamespace`值来确定在哪里寻找 S3 备份的密钥：

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
   使用 YAML 编辑器创建备份资源时，`resourceSetName` 必须设置为 `rancher-resource-set`。
   :::

   有关配置 Backup 的帮助，请参阅[配置参考](./../configuration/back-up-config/_index)和[示例](./../examples/_index#备份)

   :::important 重要
   `rancher-backup` operator 不保存 EncryptionConfiguration 文件。创建加密备份时必须保存 EncryptionConfiguration 文件的内容，从该备份中恢复时必须使用相同的文件。
   :::

1. 单击 **创建**

**结果：**在 Backup 自定义资源中配置的存储位置中创建了备份文件。执行还原时使用该文件的名称。
