---
title: 恢复 Rancher
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

通过创建Restore自定义资源来进行还原。

:::important 重要：
- 请按照此页面上的说明在已备份的同一群集上恢复rancher。为了将rancher迁移到新的集群，请按照步骤进行[迁移rancher.](./../migrating-rancher/_index)
- 在使用相同设置还原Rancher时，operator将在还原开始时缩减Rancher deployment，还原完成后又会扩展deployment。因此，Rancher在还原期间将不可用。
:::

### 创建 Restore 自定义资源

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，点击**Rancher Backups.**。
1. 点击 **Restore.**
1. 使用表单或YAML创建Restore。关于使用表单创建Restore资源，请参考[配置参考](./../configuration/restore-config/_index)和[示例.](./../examples/_index#恢复)。
1. 使用YAML编辑器，我们可以点击**Create > Create from YAML。** 进入Restore YAML。

   ```yaml
   apiVersion: resources.cattle.io/v1
   kind: Restore
   metadata:
     name: restore-migration
   spec:
     backupFilename: backup-b0450532-cee1-4aa1-a881-f5f48a007b1c-2020-09-15T07-27-09Z.tar.gz
     encryptionConfigSecretName: encryptionconfig
     storageLocation:
       s3:
         credentialSecretName: s3-creds
         credentialSecretNamespace: default
         bucketName: rancher-backups
         folder: rancher
         region: us-west-2
         endpoint: s3.us-west-2.amazonaws.com
   ```

   有关配置Restore的帮助，请参阅[配置参考](./../configuration/restore-config/_index)和[示例.](./../examples/_index#恢复)。

1. 点击 **Create.**

**结果：**rancher-operator在还原过程中缩减了rancher deployment，并在还原完成后将其扩展。资源的恢复顺序是这样的：

1. 自定义资源对象 (CRDs)
2. 集群范围内的资源
3. 命名空间资源

要查看还原的进展情况，可以查看operator的日志。请按照以下步骤来获取日志：

```yaml
kubectl get pods -n cattle-resources-system
kubectl logs <pod name from above command> -n cattle-resources-system -f
```
