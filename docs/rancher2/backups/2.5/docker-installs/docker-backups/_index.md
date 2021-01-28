---
title: 备份Docker安装的Rancher
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
  - rancher2.0 中文教程
  - 备份与恢复
  - rancher2.5
  - 备份Docker安装的Rancher
---

成功安装基于 Docker 的 Rancher 后，我们建议定期为其创建备份。拥有最近的备份将让您从意外灾难中快速恢复。

## 在开始之前

在创建备份期间，您将输入一系列命令，用环境中的数据替换占位符。这些占位符用斜括号和所有大写字母 (`<EXAMPLE>`) 表示。下面是一个带有占位符的命令的例子：

```bash
docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
```

在该命令中，`<DATE>`是数据容器和备份创建日期的占位符。例如，`9-27-18`代表的是 2018 年 9 月 27 日。

请参考下面的图像和参考表，了解如何获取此占位符数据。在开始[创建备份](#创建备份)之前，请记下或复制这些信息。交叉参考下面的图像和参考表，了解如何获取该占位符数据。

在终端执行`docker ps`命令，显示哪里可以找到`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`。
![Placeholder Reference](/img/rancher/placeholder-ref.png)

| 占位符                     | 示例              | 说明                                         |
| :------------------------- | :---------------- | :------------------------------------------- |
| `<RANCHER_CONTAINER_TAG>`  | `v2.0.5`          | 你在初始安装时使用的 rancher/rancher 镜像。  |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | Rancher 容器的名称。                         |
| `<RANCHER_VERSION>`        | `v2.0.5`          | 您要创建备份的 Rancher 版本。                |
| `<DATE>`                   | `9-27-18`         | 数据容器或备份的创建日期，格式为“月-日-年”。 |

您可以通过远程连接登录到您的 Rancher 服务器，并输入命令查看正在运行的容器：`docker ps` 来获取`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`。你也可以用`docker ps -a`来查看被停止的容器。在创建备份时，可以随时使用这些命令寻求帮助。

## 创建备份

此过程将创建一个备份文件，如果 Rancher 遇到灾难情况，可以通过该备份文件还原。

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>`替换为你的 Rancher 容器的名称。

   ```bash
   docker stop <RANCHER_CONTAINER_NAME>
   ```

1. 使用下面的命令，替换每个占位符，从刚刚停止的 Rancher 容器创建一个数据容器。

   ```bash
   docker create --volumes-from <RANCHER_CONTAINER_NAME> --name rancher-data-<DATE> rancher/rancher:<RANCHER_CONTAINER_TAG>
   ```

1. 从你刚刚创建的数据容器(`rancher-data-<DATE>`)中，创建一个备份 tar 包(`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`)。使用以下命令，替换每个占位符。

   ```bash
   docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup:z busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
   ```

   **步骤结果:** 屏幕上将运行命令流。

1. 输入 `ls` 命令，确认备份压缩包已经创建。它的名称将类似于`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

1. 将您的备份压缩包移动到 Rancher 服务器外部的安全位置。然后从 Rancher 服务器中删除`rancher-data-<DATE>`容器。

1. 重新启动 Rancher Server。将`<RANCHER_CONTAINER_NAME>`替换为 Rancher 容器的名称。

   ```bash
   docker start <RANCHER_CONTAINER_NAME>
   ```

**结果：** 会创建一个 Rancher Server 数据的备份压缩包。如果你需要恢复备份数据，请参见[恢复备份：Docker 安装](../docker-restores/_index)。
