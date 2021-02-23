---
title: 回滚必读
description: 本节包含有关如何将 Rancher Server 回滚到以前版本的信息。
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
  - 安装指南
  - 高可用安装指南
  - 回滚必读
---

## 回滚到 v2.5.0+

要回滚到 Rancher v2.5.0+，请使用`rancher-backup`应用程序并从备份中恢复 Rancher。

回滚后，Rancher 必须以较低/以前的版本启动。

通过创建 Restore 自定义资源进行还原。

:::important 重要

- 请按照此页面上的说明在已备份的同一集群上恢复 rancher。为了将 rancher 迁移到新的集群，请按照步骤进行[迁移 rancher](/docs/rancher2/backups/2.5/migrating-rancher/_index)。
- 在使用相同设置还原 Rancher 时，operator 将在还原开始时缩减 Rancher deployment，还原完成后又会扩展 deployment。因此，Rancher 在还原期间将不可用。

:::

### 创建 Restore 自定义资源

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，单击**Rancher Backups**。
1. 单击 **Restore**。
1. 使用表单或 YAML 创建 Restore。关于使用表单创建 Restore 资源，请参考[配置参考](./../configuration/restore-config/_index)和[示例](./../examples/_index#恢复)。
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

   有关配置 Restore 的帮助，请参阅[配置参考](./../configuration/restore-config/_index)和[示例](./../examples/_index#恢复)。

1. 单击 **Create**。

**结果：**rancher-operator 在还原过程中缩减了 rancher deployment，并在还原完成后将其扩展。资源的恢复顺序是这样的：

1. 自定义资源对象 (CRDs)
2. 集群范围内的资源
3. 命名空间资源

要查看还原的进展情况，可以查看 operator 的日志。请按照以下步骤来获取日志：

```yaml
kubectl get pods -n cattle-resources-system
kubectl logs <pod name from above command> -n cattle-resources-system -f
```

### 回滚到上一个版本

您可以使用 Rancher UI 回滚。

1. 在 Rancher UI 中，进入本地集群。
1. 进入系统项目。
1. 编辑 Rancher 部署，并将镜像修改为您要回滚到的版本。
1. 保存所做的更改。

## 回滚到 v2.2.x-v2.4.x

要回滚到 v2.5 之前的 Rancher，请按照这里的步骤进行。[恢复备份 - Kubernetes 安装](/docs/rancher2/backups/2.0-2.4/restorations/ha-restoration/_index) 恢复 Rancher 服务器集群的快照会将 Rancher 恢复到快照时的版本和状态。

有关如何回滚安装了 Docker 的 Rancher 的信息，请参考[本页](/docs/rancher2/installation_new/other-installation-methods/single-node-docker/single-node-rollbacks/_index)

> 受管集群对其状态具有权威性。这意味着恢复 rancher 服务器不会恢复工作负载部署或快照后在托管集群上所做的更改。

## 回滚到 v2.0.x-v2.1.x

不再支持回滚到 Rancher v2.0-v2.1。回滚到这些版本的说明保留在[这里](/docs/rancher2/backups/2.0-2.4/restorations/ha-restoration/2.0-2.1/_index)，仅用于升级到 Rancher v2.2+不可行的情况。
