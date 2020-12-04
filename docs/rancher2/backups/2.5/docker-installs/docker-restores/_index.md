---
title: 恢复备份-Docker安装
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

如果遇到灾难情况，您可以将 Rancher Server 恢复到最新的备份。

## 在开始之前

在还原备份期间，您将输入一系列命令，用环境中的数据填充占位符。这些占位符用斜括号和所有大写字母 (`<EXAMPLE>`) 表示。下面是一个带有占位符的命令的例子：

```
docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
busybox sh -c "rm /var/lib/rancher/* -rf  && \
tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>"
```

在此命令中，`<RANCHER_CONTAINER_NAME>`和`<RANCHER_VERSION>-<DATE>`是Rancher部署的环境变量。

请参考下面的图像和参考表，了解如何获取该占位符数据。在开始下面的程序之前，请记下或复制这些信息。

在终端执行`docker ps`命令，显示哪里可以找到`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`。
![Placeholder Reference](/img/rancher/placeholder-ref.png)

| Placeholder                | Example           | Description                                               |
| -------------------------- | ----------------- | --------------------------------------------------------- |
| `<RANCHER_CONTAINER_TAG>`  | `v2.0.5`          | 你在初始安装时使用的rancher/rancher镜像。                      |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | Rancher容器的名称。                                         |
| `<RANCHER_VERSION>`        | `v2.0.5`          | 您要创建备份的Rancher版本。                                   |
| `<DATE>`                   | `9-27-18`         | 数据容器或备份的创建日期。                                     |

您可以通过远程连接登录到您的Rancher服务器，并输入命令查看正在运行的容器：`docker ps`，从而获得`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`。你也可以用`docker ps -a`来查看被停止的容器。在创建备份时，可以随时使用这些命令寻求帮助。

## 恢复备份

使用之前创建的[备份](../docker-backups/_index)，将Rancher恢复到最后已知的健康状态。

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>`替换为[你的 Rancher 容器的名称](#在开始之前)。

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```

将[创建备份-Docker 安装](../docker-backups/_index)时创建的备份压缩包移动到 Rancher 服务器上。输入 `dir` 来确认它是否在那里。
   如果你按照我们在[创建备份-Docker 安装](../docker-backups/_index)中建议的命名习惯，它的名字会类似于`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

1. 输入以下命令删除当前状态数据，并用备份数据替换，替换[占位符](#在开始之前)。不要忘记关闭引号。

   :::note 注意：
   该命令将删除 Rancher Server 容器中的所有当前状态数据。创建备份压缩包后保存的任何更改都将丢失。
   :::

   ```
   docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
   busybox sh -c "rm /var/lib/rancher/* -rf  && \
   tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz"
   ```

   **步骤结果:** 屏幕上将运行命令流。

1. 重新启动 Rancher Server 容器，替换[占位符](#在开始之前)。它将使用您的备份数据重新启动。

   ```
   docker start <RANCHER_CONTAINER_NAME>
   ```

1. 等待片刻，然后在浏览器中打开 Rancher UI。确认还原成功，您的数据已经恢复。
