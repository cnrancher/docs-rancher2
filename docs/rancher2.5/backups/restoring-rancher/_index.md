---
title: 恢复 Rancher
description: 通过创建 Restore 自定义资源来进行还原
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
  - 恢复 Rancher
---

请按照以下步骤恢复 Rancher。

:::important 重要

- 请按照此页面上的说明在已备份的同一集群上恢复 rancher。为了将 rancher 迁移到新的集群，请按照步骤进行[迁移 rancher](/docs/rancher2.5/backups/migrating-rancher/_index)。
- 在使用相同设置还原 Rancher 时，operator 将在还原开始时缩减 Rancher deployment，还原完成后又会扩展 deployment。因此，Rancher 在还原期间将不可用。

:::

## 创建 Restore 自定义资源

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，单击**Rancher Backups**。
1. 单击 **Restore**。
1. 使用表单或 YAML 创建 Restore。关于使用表单创建 Restore 资源，请参考[配置参考](/docs/rancher2.5/backups/configuration/restore-config/_index)和[示例](/docs/rancher2.5/backups/examples/_index)。
1. 使用 YAML 编辑器，我们可以单击**Create > Create from YAML** 进入 Restore YAML。

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

   有关配置 Restore 的帮助，请参阅[配置参考](/docs/rancher2.5/backups/configuration/restore-config/_index)和[示例](/docs/rancher2.5/backups/examples/_index)。

1. 单击 **Create**。

**结果：**rancher-operator 在还原过程中缩减了 rancher deployment，并在还原完成后将其扩展。资源的恢复顺序是这样的：

1. 自定义资源对象 (CRDs)
2. 集群范围内的资源
3. 命名空间资源

## 日志

要查看还原的进展情况，可以查看 operator 的日志。请按照以下步骤来获取日志：

```yaml
kubectl logs -n cattle-resources-system -l app.kubernetes.io/name=rancher-backup -f
```

## Cleanup

如果你用 kubectl 创建了还原资源，请删除该资源以防止与未来的还原发生命名冲突。

## 已知问题

在某些情况下，恢复备份后，Rancher 日志会显示类似以下的错误：

```
2021/10/05 21:30:45 [ERROR] error syncing 'c-89d82/m-4067aa68dd78': handler rke-worker-upgrader: clusters.management.cattle.io "c-89d82" not found, requeuing
```

发生这种情况的原因是，刚刚恢复的一个资源有终结器，但相关的资源已经被删除，所以处理程序无法找到它。

为了消除这些错误，我们需要找到并删除导致错误的资源。查看更多信息[这里](https://github.com/rancher/rancher/issues/35050#issuecomment-937968556)。
