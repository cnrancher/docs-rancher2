---
title: 还原 Rancher
weight: 2
---

还原是通过创建 Restore 自定义资源实现的。

> **重要提示**
>
> * 请按照此页面上的说明在已备份的同一集群上还原 Rancher。要把 Rancher 迁移到新集群，请参照步骤[迁移 Rancher]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。
> * 在使用相同设置还原 Rancher 时，operator 将在还原开始时缩减 Rancher deployment，还原完成后又会扩展 deployment。因此，Rancher 在还原期间将不可用。
> * 如果你需要在升级后将 Rancher 还原到先前版本，请参见[回滚]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/rollbacks/)。

### 创建 Restore 自定义资源

1. 在左上角，单击**☰ > 集群管理**。
1. 在**集群**页面上，转到 `local` 集群并单击 **Explore**。Rancher Server 运行在 `local` 集群中。
1. 在左侧导航栏中，单击 **Rancher 备份 > 还原**。
1. 单击**创建**。
1. 使用表单或 YAML 创建 Restore。如需获取使用表单创建 Restore 资源的更多信息，请参见[配置参考]({{<baseurl>}}/rancher/v2.6/en/backups/configuration/restore-config)和[示例]({{<baseurl>}}/rancher/v2.6/en/backups/examples)。
1. 要使用 YAML 编辑器，单击**创建 > 使用 YAML 文件创建**。输入 Restore YAML。

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

   如需获得配置 Restore 的帮助，请参见[配置参考]({{<baseurl>}}/rancher/v2.6/en/backups/configuration/restore-config)和[示例]({{<baseurl>}}/rancher/v2.6/en/backups/examples)。

1. 单击**创建**。

**结果**：rancher-operator 在还原过程中将 Rancher deployment 缩容，并在还原完成后将它重新扩容。资源还原顺序如下：

1. 自定义资源定义（CRD）
2. 集群范围资源
3. 命名空间资源

### 日志

如需查看还原的处理方式，请检查 Operator 的日志。查看日志的命令如下：

```
kubectl logs -n cattle-resources-system -l app.kubernetes.io/name=rancher-backup -f
```

### 清理

如果你使用 kubectl 创建了 Restore 资源，请删除该资源以防止与未来的还原发生命名冲突。

### 已知问题
在某些情况下，恢复备份后，Rancher 日志会显示类似以下的错误：
```
2021/10/05 21:30:45 [ERROR] error syncing 'c-89d82/m-4067aa68dd78': handler rke-worker-upgrader: clusters.management.cattle.io "c-89d82" not found, requeuing
```
发生这种情况的原因是，刚刚还原的某个资源有 finalizer，但相关的资源已经被删除，导致处理程序无法找到该资源。

为了消除这些错误，你需要找到并删除导致错误的资源。详情请参见[此处](https://github.com/rancher/rancher/issues/35050#issuecomment-937968556)。
