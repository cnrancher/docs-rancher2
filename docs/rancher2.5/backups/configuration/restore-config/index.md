---
title: 恢复配置
description: 性页面提供要还原的备份的详细信息。
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
  - 备份与恢复
  - rancher2.5
  - 恢复配置
---

本页面提供还原备份的详细信息。

![restore](/img/rancher/backup_restore/restore/restore.png)

## 备份源

提供备份文件和备份文件存储位置的详细信息，operator 使用这个文件执行还原。从以下选项中选择这些详细信息。

### 现有的备份配置

选择该选项将在**目标备份**下拉菜单中填充该集群中可用的备份。从下拉菜单中选择备份，自动为您填写**备份文件名**字段，还将把所选 Backup 的备份源信息传递给 operator。

![existing](/img/rancher/backup_restore/restore/existing.png)

如果 Backup 自定义资源在集群中不存在，则需要获取准确的文件名，并提供备份源详细信息，并提供默认的存储目标或与 S3 兼容的对象存储。

### 默认存储目标

如果您要从 operator 级别配置的默认存储位置的备份文件中恢复，请选择此选项。operator 级别的配置是指安装或升级 `rancher-backup` operator 时配置的存储位置。在**备份文件名**字段中提供准确的文件名。

![default](/img/rancher/backup_restore/restore/default.png)

### S3 兼容的对象存储

如果在 operator 级别没有配置默认存储位置，或者如果备份文件与配置为默认存储位置不同的 S3 桶中，请选择此选项。在**备份文件名**字段中提供准确的文件名。请参阅[本节](#从s3获取备份文件名)了解从 S3 获取备份文件名的具体步骤。填写 S3 兼容对象存储的所有细节。它的字段与[备份自定义资源](./../back-up-config/#存储位置)中`backup.StorageLocation`配置的字段完全相同。

![s3store](/img/rancher/backup_restore/restore/s3store.png)

## 加密

如果备份是在启用加密的情况下创建的，其文件后缀为`.enc`。选择这样的备份，或提供后缀为`.enc`的备份文件名，将显示另一个名为**加密配置 Secret**的下拉菜单。

![encryption](/img/rancher/backup_restore/restore/encryption.png)

从该下拉菜单中选择的 Secret 必须与执行备份时用于 Backup 自定义资源的 Secret 内容相同。如果加密配置不匹配，还原将失败。

`加密配置Secret`下拉菜单将过滤出并仅列出那些拥有此密钥的 Secret。

| YAML 指令名称                | 说明                                                                      |
| :--------------------------- | :------------------------------------------------------------------------ |
| `encryptionConfigSecretName` | 提供 `cattle-resources-system` 命名空间中包含加密配置文件的 Secret 名称。 |

:::important 重要
此字段仅在备份创建时启用了加密功能时才应设置。提供错误的加密配置将导致还原失败。
:::

## Prune During Restore

- **Prune**：为了从备份中完全恢复 Rancher，并回到备份时的确切状态，我们需要删除 Rancher 在备份后创建的任何额外资源。如果**Prune**标志被启用，operator 就会这样做。Prune 默认是启用的，建议保持启用。
- **删除超时**：这是 operator 在删除资源时等待的时间。

| YAML 指令名称          | 说明                                              |
| :--------------------- | :------------------------------------------------ |
| `prune`                | 删除备份中不存在的由 Rancher 管理的资源（推荐）。 |
| `deleteTimeoutSeconds` | operator 在删除资源时等待的时间。                 |

## 从 S3 获取备份文件名

这是 `rancher-backup` operator 用来执行还原的备份文件的名称。

要从 S3 获取这个文件名，请进入你的 S3 桶（如果在执行备份时指定了文件夹）。

复制文件名并将其存储在你的 Restore 自定义资源中。假设你的备份文件的名字是`backupfile`：

- 如果你的桶名称是`s3bucket`而没有指定文件夹，那么要使用的`备份文件名称`将是`backupfile`。
- 如果你的桶名称是`s3bucket`，基础文件夹是`s3folder`，那么要使用的`备份文件名称`只有`backupfile`。
- 如果在`s3Folder`内有一个名为`s3sub`的子文件夹，里面有你的备份文件，那么要使用的`备份文件名称`就是`s3sub/backupfile`。

| YAML 指令名称    | 说明                                                            |
| :--------------- | :-------------------------------------------------------------- |
| `backupFilename` | 这是 `rancher-backup` operator 将用来执行还原的备份文件的名称。 |
