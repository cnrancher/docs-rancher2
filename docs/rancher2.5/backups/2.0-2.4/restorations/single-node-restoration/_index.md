---
title: Rancher 单节点恢复
description: 如果遇到灾难场景，可以通过备份文件恢复 Rancher Server 数据。在还原备份期间，您将输入一系列命令，以环境中的数据替换占位符。这些占位符用尖括号和所有大写字母（`<EXAMPLE>`）表示。这是带有占位符的命令示例。
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
  - 备份和恢复指南
  - 恢复
  - Rancher 单节点恢复
---

如果遇到灾难场景，可以通过备份文件恢复 Rancher Server 数据。

## 恢复准备

在还原备份期间，您将输入一系列命令，以环境中的数据替换占位符。这些占位符用尖括号和所有大写字母（`<EXAMPLE>`）表示。这是带有占位符的命令示例：

```bash
docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
busybox sh -c "rm /var/lib/rancher/* -rf  && \
tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>"
```

这个命令中的，`<RANCHER_CONTAINER_NAME>` 和 `<RANCHER_VERSION>-<DATE>`是您的 Rancher 部署的环境变量。

请参考下面的图像和参考表，以了解如何获取此占位符数据。在开始以下步骤之前，请执行以下操作。

<sup>
终端输入“docker ps”命令，查看“RANCHER_CONTAINER_TAG”和“RANCHER_CONTAINER_NAME”的值 </sup>

![Placeholder Reference](/img/rancher/placeholder-ref.png)

| 占位符                     | 值                | 说明                                      |
| -------------------------- | ----------------- | ----------------------------------------- |
| `<RANCHER_CONTAINER_TAG>`  | `v2.0.5`          | 初始安装时获取的`rancher/rancher`镜像名。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | Rancher 容器名称.                         |
| `<RANCHER_VERSION>`        | `v2.0.5`          | 备份的 Rancher 版本号。                   |
| `<DATE>`                   | `9-27-18`         | 创建数据容器或备份的日期。                |

您可以通过远程连接登录到 Rancher Server 所在的节点，并输入`docker ps`命令来查看正在运行的容器，从而获取`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`。
您还可以使用其他命令查看停止的容器：`docker ps -a`。恢复备份期间，随时可以使用这些命令获得帮助。

## 恢复备份

使用您先前创建的[备份文件](/docs/rancher2.5/backups/2.0-2.4/single-node-backups/_index)，将 Rancher 恢复到已知的最后的健康状态。

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>`替换为 Rancher 容器的名称。

   ```bash
   docker stop <RANCHER_CONTAINER_NAME>
   ```

1. 将 [Rancher 单节点备份](/docs/rancher2.5/backups/2.0-2.4/single-node-backups/_index)保存的的压缩文件拷贝到 Rancher Server 所在主机上，通过`cd`命令切换到压缩文件所在的目录，并执行`ls`命令，确认文件存在。如果您按照我们在[Rancher 单节点备份](/docs/rancher2.5/backups/2.0-2.4/single-node-backups/_index)中建议的命名约定，它的名称将类似于`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

1. 替换占位符，输入以下命令以删除当前状态数据并将其替换为备份数据。不要忘记关闭引号。

   > **警告! **此命令从 Rancher Server 容器中删除所有的数据，上一次创建备份后保存的所有更改都将丢失。

   ```bash
   docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
   busybox sh -c "rm /var/lib/rancher/* -rf  && \
   tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz"
   ```

1. 重新启动 Rancher Server 容器。

   ```bash
   docker start <RANCHER_CONTAINER_NAME>
   ```

1. 稍等片刻，然后在 web 浏览器中打开 Rancher UI，确认是否成功恢复数据。
