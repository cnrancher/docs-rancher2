---
title: 回滚
weight: 3
---

- [回滚到 Rancher 2.5.0+](#rolling-back-to-rancher-v2-5-0)
- [回滚到 Rancher 2.2-2.4+](#rolling-back-to-rancher-v2-2-v2-4)
- [回滚到 Rancher 2.0-2.1](#rolling-back-to-rancher-v2-0-v2-1)

# 回滚到 Rancher 2.5.0+

要回滚到 Rancher 2.5.0+，使用 **Rancher 备份**应用并通过备份来恢复 Rancher。

回滚后，Rancher 必须以较低/较早的版本启动。

还原是通过创建 Restore 自定义资源实现的。

> :::important 重要提示
>
> * 请按照此页面上的说明在已备份的同一集群上恢复 Rancher。要把 Rancher 迁移到新集群，请参照步骤[迁移 Rancher]({{<baseurl>}}/rancher/v2.6/en/backups/migrating-rancher)。
> * 在使用相同设置恢复 Rancher 时，Rancher deployment 在恢复开始前被手动缩减，然后 Operator 将在恢复完成后将其缩回。因此，在恢复完成之前，Rancher 和 UI 都将不可用。如果 UI 不可用时，你可使用 `kubectl create -f restore.yaml`YAML 恢复文件来使用初始的集群 kubeconfig。

### 将 Rancher Deployment 规模扩展到 0

1. 在左上角，点击 **☰ > local**。
1. 在左侧主菜单中，点击**工作负载**。
1. 在**工作负载**下，点击 **Deployments**。
1. 点击上方下拉菜单以调整筛选条件。选择 **cattle-system** 作为筛选条件。
1. 找到 `rancher` deployment 的行，并点击**⋮ > 编辑配置**。
1. 将**副本数量**改为 0。
1. 滚动到底部并点击**保存**。

### 创建 Restore 自定义资源

1. 点击 **☰ > 集群管理**。
1. 找到你的本地集群，并点击 **Explore**。
1. 在左侧导航栏中，点击 **Rancher 备份 > 恢复**。
   * **注意**：如果 Rancher Backups 应用不可见，你需要到**应用 & 应用市场**的 Charts 页面中安装应用。详情请参见[此处]({{<baseurl>}}/rancher/v2.6/en/helm-charts/#charts)。
1. 点击**创建**。
1. 使用表单或 YAML 创建 Restore。如需获取使用在线表单创建 Restore 资源的帮助，请参见[配置参考]({{<baseurl>}}/rancher/v2.6/en/backups/configuration/restore-config)并查看[示例]({{<baseurl>}}/rancher/v2.6/en/backups/examples)。
1. 如需使用 YAML 编辑器，点击**创建 > 使用 YAML 文件创建**。然后输入 Restore YAML。以下是 Restore 自定义资源示例：

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
   如需获得配置 Restore 的帮助，请参见[配置参考]({{<baseurl>}}/rancher/v2.6/en/backups/configuration/restore-config)并查看[示例]({{<baseurl>}}/rancher/v2.6/en/backups/examples)。

1. 点击**创建**。

**结果**：已创建备份文件并更新到目标存储位置。资源恢复顺序如下：

1. 自定义资源定义（CRD）
2. 集群范围资源
3. 命名空间资源

如需查看恢复的处理方式，请检查 Operator 的日志。按照如下步骤获取日志：

```yaml
kubectl get pods -n cattle-resources-system
kubectl logs -n cattle-resources-system -f
```

### 回滚到上一个 Rancher 版本

你可以使用 Helm CLI 回滚 Rancher。要回滚到上一个版本：

```yaml
helm rollback rancher -n cattle-system
```

如果你不是想回滚到上一个版本，你也可以指定回滚的版本。查看部署历史记录：

```yaml
helm history rancher -n cattle-system
```

确定目标版本后，执行回滚。此示例回滚到版本 `3`：

```yaml
helm rollback rancher 3 -n cattle-system
```

# 回滚到 Rancher 2.2-2.4

要回滚到 2.5 之前的 Rancher 版本，参考此处的步骤[恢复备份  — Kubernetes 安装]({{<baseurl>}}/rancher/v2.0-v2.4/en/backups/restore/rke-restore/)。如果恢复 Rancher Server 的集群的某个快照，Rancher 的版本以及状态均会恢复回到快照时的版本和状态。

有关回滚 Docker 安装的 Rancher，请参见[本页]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-rollbacks)。

> 托管集群对其状态具有权威性。因此，恢复 Rancher Server 不会恢复快照后对托管集群进行的工作负载部署或更改。

# 回滚到 Rancher 2.0-2.1

我们不再支持回滚到 Rancher 2.0-2.1。回滚到这些版本的说明保留在[此处]({{<baseurl>}}/rancher/v2.0-v2.4/en/backups/restore/rke-restore/v2.0-v2.1)，仅用于无法升级到 v2.2 的情况。
