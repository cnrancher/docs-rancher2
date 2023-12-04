---
title: 回滚指南
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

- [回滚到 Rancher v2.5.0+](#回滚到-rancher-v250)
- [回滚到 Rancher v2.2-v2.4+](#回滚到-rancher-v22x-v24x)
- [回滚到 Rancher v2.0-v2.1](#回滚到-rancher-v20x-v21x)

## 回滚到 Rancher v2.5.0+

要回滚到 Rancher v2.5.0+，请使用 **Rancher Backups** 应用程序并从备份中恢复 Rancher。

回滚后，Rancher 必须以较低/以前的版本启动。

通过创建 Restore 自定义资源进行还原。

:::important 重要

- 请按照此页面上的说明在已备份的同一集群上恢复 rancher。为了将 rancher 迁移到新的集群，请按照步骤进行[迁移 rancher](/docs/rancher2.5/backups/migrating-rancher/_index)。
- 在使用相同设置还原 Rancher 时，Rancher deployment 在还原开始前被手动缩减，然后操作员将在还原完成后将其缩回。因此，在恢复完成之前，Rancher 和 UI 将不可用。当 UI 不可用时，可使用 kubectl 创建还原：`kubectl create -f restore.yaml`。
:::

### 将 Rancher Deployment 的规模扩展到 0

1. 在**全局**视图中，将鼠标悬停在 **local** 集群上。
1. 在 **local** 的项目下，点击**System**。
1. 从**cattle-system**命名空间部分，找到 `rancher` deployment。
1. 选择**&#8942;> Edit**。
1. 将**Scalable deployment of \_ pods**改为`0`。
1. 滚动到底部并点击 **Save**。

### 创建 Restore 自定义资源

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，单击**Rancher Backups**。  
   **注意：** 如果 Rancher Backups 应用程序在下拉列表中不可见，您需要从 **Apps & Marketplace** 中的 Charts 页面安装它。请参阅[此处](/docs/rancher2.5/helm-charts/_index#charts)了解更多信息。 
1. 单击 **Restore**。
1. 使用表单或 YAML 创建 Restore。关于使用在线表单创建 Restore 资源，请参考[配置参考](/docs/rancher2.5/backups/configuration/restore-config/_index)和[示例](/docs/rancher2.5/backups/examples/_index)。
1. 使用 YAML 编辑器，你可以单击**Create > Create from YAML** 进入 Restore YAML。以下是还原自定义资源的示例：

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

**结果：**备份文件被创建并更新到目标存储位置。资源按以下顺序恢复：

1. 自定义资源对象 (CRDs)
2. 集群范围内的资源
3. 命名空间资源

要查看还原的进展情况，可以查看 operator 的日志。请按照以下步骤来获取日志：

```yaml
kubectl get pods -n cattle-resources-system
kubectl logs <pod name from above command> -n cattle-resources-system -f
```

### 回滚到以前的 Rancher 版本

Rancher 可以使用 Helm CLI 进行回滚。要回滚到以前的版本：

```yaml
helm rollback rancher -n cattle-system
```

如果以前的版本不是预定目标，你可以指定一个版本来回滚。要查看部署历史：

```yaml
helm history rancher -n cattle-system
```

当目标版本确定后，执行回滚。这个例子将回滚到修订版 `3`：

```yaml
helm rollback rancher 3 -n cattle-system
```

### 回滚到上一个版本

您可以使用 Rancher UI 回滚。

1. 在 Rancher UI 中，进入本地集群。
1. 进入系统项目。
1. 编辑 Rancher 部署，并将镜像修改为您要回滚到的版本。
1. 保存所做的更改。

## 回滚到 Rancher v2.2.x-v2.4.x

要回滚到 v2.5 之前的 Rancher，请按照这里的步骤进行。[恢复备份 - Kubernetes 安装](/docs/rancher2/backups/restore/ha-restore/_index) 恢复 Rancher Server 集群的快照会将 Rancher 恢复到快照时的版本和状态。

有关如何回滚安装了 Docker 的 Rancher 的信息，请参考[本页](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/single-node-rollbacks/_index)

> 受管集群对其状态具有权威性。这意味着恢复 rancher server 不会恢复工作负载部署或快照后在托管集群上所做的更改。

## 回滚到 Rancher v2.0.x-v2.1.x

不再支持回滚到 Rancher v2.0-v2.1。回滚到这些版本的说明保留在[这里](/docs/rancher2/backups/restore/ha-restore/2.0-2.1/_index)，仅用于升级到 Rancher v2.2+不可行的情况。
