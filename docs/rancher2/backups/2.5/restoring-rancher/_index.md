---
title: 恢复 Rancher
description: 通过创建 Restore 自定义资源来进行还原
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
  - 备份和恢复
  - rancher 2.5
  - 恢复 Rancher
---

通过创建 Restore 自定义资源来进行还原。请按照以下步骤恢复 Rancher：首先，创建 Restore 自定义资源。然后使用之前的 Rancher 版本重新启动 Rancher。

:::important 重要

- 请按照此页面上的说明在已备份的同一集群上恢复 rancher。为了将 rancher 迁移到新的集群，请按照步骤进行[迁移 rancher](/docs/rancher2/backups/2.5/migrating-rancher/_index)。
- 在使用相同设置还原 Rancher 时，operator 将在还原开始时缩减 Rancher deployment，还原完成后又会扩展 deployment。因此，Rancher 在还原期间将不可用。

:::

## 创建 Restore 自定义资源

1. 在**Cluster Explorer**中，进入左上角的下拉菜单，单击**Rancher Backups.**。
1. 单击 **Restore.**
1. 使用表单或 YAML 创建 Restore。关于使用表单创建 Restore 资源，请参考[配置参考](./../configuration/restore-config/_index)和[示例](./../examples/_index#恢复)。
1. 使用 YAML 编辑器，我们可以单击**Create > Create from YAML。** 进入 Restore YAML。

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

   有关配置 Restore 的帮助，请参阅[配置参考](./../configuration/restore-config/_index)和[示例.](./../examples/_index#恢复)。

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

### 重启 Rancher

Rancher 必须在使用 Rancher 备份操作员进行回滚后，以较低/以前的版本启动。它应该用与前次安装相同的 Helm 图表值启动。

从当前安装的 Rancher Helm 图表中获取用`--set`传递的值。

```
helm get values rancher -n cattle-system
hostname: rancher.my.org
```

:::note
这个命令会列出更多的值。这只是其中一个值的例子。
另外，也可以将当前的值导出到一个文件中，并在升级时引用该文件。例如，要只改变 Rancher 的版本。
:::

```
helm get values rancher -n cattle-system -o yaml > values.yaml。
```

然后将舵手图升级到以前的 Rancher 版本，使用以前的值。在这个例子中，这些值是从文件中提取的。

```
helm upgrade rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system
  -f values.yaml ．
  --version=X.Y.Z
```
