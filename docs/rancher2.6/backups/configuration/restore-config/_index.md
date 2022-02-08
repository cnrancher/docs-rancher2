---
title: 还原配置
shortTitle: 还原
weight: 2
---

你可以在还原创建页面提供还原备份的详细信息。

{{< img "/img/rancher/backup_restore/restore/restore.png" "">}}

- [备份源](#backup-source)
   - [使用已有的备份配置恢复](#an-existing-backup-config)
   - [使用默认存储目标恢复](#the-default-storage-target)
   - [使用与 S3 兼容的对象存储恢复](#an-s3-compatible-object-store)
- [加密](#encryption)
- [还原过程中修剪](#prune-during-restore)
- [从 S3 获取备份文件名](#getting-the-backup-filename-from-s3)

## 备份源
你需要提供备份文件和备份文件存储位置的详细信息，operator 会使用这些信息执行还原。选择以下其中一个选项来提供这些详细信息。




### 使用已有的备份配置恢复

如果你选择这个选项，**目标备份**下拉菜单中会出现集群中可用的备份。从下拉菜单中选择 Backup，选择后**备份文件名**字段会自动填写，而且所选 Backup 的信息会传递给 operator

{{< img "/img/rancher/backup_restore/restore/existing.png" "">}}

如果 Backup 自定义资源在集群中不存在，你需要获取准确的文件名，并使用默认存储目标或与 S3 兼容的对象存储来提供备份源的详细信息。


### 使用默认存储目标恢复

如果你要从 operator 级别配置的默认存储位置中的备份文件进行恢复，请选择此选项。operator 级别的配置是指安装或升级 `rancher-backup` operator 时配置的存储位置。在**备份文件名**字段中提供准确的文件名。

{{< img "/img/rancher/backup_restore/restore/default.png" "">}}

### 使用与 S3 兼容的对象存储恢复

如果在 operator 级别没有配置默认存储位置，或者备份文件所在的存储桶与配置的默认存储位置不一样时，请选择此选项。在**备份文件名**字段中提供准确的文件名。请参见[本节](#getting-the-backup-filename-from-s3)了解从 S3 获取备份文件名的具体步骤。填写 S3 兼容对象存储的所有详细信息。它的字段与 [Backup 自定义资源](../../configuration/backup-config/#storage-location)中 `backup.StorageLocation` 配置的字段一样。

{{< img "/img/rancher/backup_restore/restore/s3store.png" "">}}

## 加密

如果备份是在启用加密的情况下创建的，备份文件的后缀为 `.enc`。如果你选择这类的 Backup，或者提供后缀为 `.enc` 的备份文件名，则会显示另一个名为**加密配置密文**的下拉菜单。

{{< img "/img/rancher/backup_restore/restore/encryption.png" "">}}

从该下拉菜单中选择的密文必须与执行备份时用于 Backup 自定义资源的密文内容相同。如果加密配置不匹配，还原将会失败。

`加密配置密文` 下拉菜单将过滤并仅列出拥有这个 key 的密文。

| YAML 指令名称 | 描述 |
| ---------------- | ---------------- |
| `encryptionConfigSecretName` | 提供 `cattle-resources-system` 命名空间中包含加密配置文件的密文的名称。 |

> **重要提示**：
> 此字段仅在备份创建的过程中启用了加密功能时才需要设置。提供错误的加密配置将导致还原失败。

## 还原过程中修剪（Prune）

* **Prune**：为了从备份中完全恢复 Rancher，并回到备份时的确切状态，我们需要删除 Rancher 在备份后创建的所有额外资源。如果 **Prune** 标志被启用，operator 就会删除这些资源。Prune 是默认启用的，建议保持启用状态。
* **删除超时**：在删除资源的时候，operator 编辑资源以删除 Finalizers，并试图再次删除前将等待的时间。

| YAML 指令名称 | 描述 |
| ---------------- | ---------------- |
| `prune` | 删除备份中不存在的由 Rancher 管理的资源（推荐）。 |
| `deleteTimeoutSeconds` | 在删除资源的时候，operator 编辑资源以删除 Finalizers，并试图再次删除前将等待的时间。 |

## 从 S3 获取备份文件名

这是 `rancher-backup` operator 用来执行还原的备份文件的名称。

要从 S3 获取这个文件名，请进入你的 S3 存储桶（或在执行备份时指定的文件夹）。

复制文件名并将其存储在你的 Restore 自定义资源中。假设你的备份文件的名字是 `backupfile`：

- 如果你的存储桶名称是 `s3bucket`，而且你没有指定文件夹，那么要使用的 `backupFilename` 会是 `backupfile`。
- 如果你的存储桶名称是 `s3bucket`，而且基础文件夹是 `s3folder`，那么要使用的 `backupFilename` 会是 `backupfile`。
- 如果 `s3Folder` 中有一个名为 `s3sub` 的子文件夹，而且你的备份文件存放在该文件夹中，那么要使用的`backupFilename` 会是 `s3sub/backupfile`。

| YAML 指令名称 | 描述 |
| ---------------- | ---------------- |
| `backupFilename` | 这是 `rancher-backup` operator 用来执行还原的备份文件的名称。 |
