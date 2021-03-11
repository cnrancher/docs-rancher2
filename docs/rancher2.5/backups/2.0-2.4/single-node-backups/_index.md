---
title: Rancher 单节点备份
description: 在完成 Rancher 的单节点安装后，或在升级 Rancher 到新版本之前，需要对 Rancher 进行数据备份。如果在 Rancher 数据损坏或者丢失，或者升级遇到问题时，可以通过最新的备份进行数据恢复。在创建备份期间，您将输入一系列命令，以环境中的数据替换占位符。这些占位符用尖括号和所有大写字母（`<EXAMPLE>`）表示。这是带有占位符的命令示例：在此命令中，`<DATE>`是占位符，代表创建数据容器和备份的日期。例如 `9-27-18`。
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
  - 备份
  - Rancher 单节点备份
---

在完成 Rancher 的单节点安装后，或在升级 Rancher 到新版本之前，需要对 Rancher 进行数据备份。如果在 Rancher 数据损坏或者丢失，或者升级遇到问题时，可以通过最新的备份进行数据恢复。

## 如何读取占位符

在创建备份期间，您将输入一系列命令，以环境中的数据替换占位符。这些占位符用尖括号和所有大写字母（`<EXAMPLE>`）表示。这是带有占位符的命令示例：

在此命令中，`<DATE>`是占位符，代表创建数据容器和备份的日期。例如 `9-27-18`。

```bash
docker run  \
  --volumes-from rancher-data-<DATE> \
  -v $PWD:/backup busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
```

## 获取占位符信息

运行以下命令，获取占位符信息：

```
docker ps
```

在开始[以下步骤](#创建备份)之前，请保存这些信息。

<sup>
在终端输入"docker ps"命令，查看 RANCHER_CONTAINER_TAG 和 RANCHER_CONTAINER_NAME
</sup>

![Placeholder Reference](/img/rancher/placeholder-ref.png)

| 占位符                     | 值                | 描述                                |
| -------------------------- | ----------------- | ----------------------------------- |
| `<RANCHER_CONTAINER_TAG>`  | `v2.0.5`          | 当前安装的 Rancher Server 镜像      |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | 当前 Rancher 容器名称。             |
| `<RANCHER_VERSION>`        | `v2.0.5`          | 您正在为其创建备份的 Rancher 版本。 |
| `<DATE>`                   | `9-27-18`         | 创建数据卷容器或备份的日期。        |

您可以通过远程连接登录到 Rancher Server 所在的节点，并输入命令来查看正在运行的容器，从而获取`<RANCHER_CONTAINER_TAG>`和`<RANCHER_CONTAINER_NAME>`：`docker ps`。您还可以使用其他命令查看停止的容器：`docker ps -a`。创建备份期间，随时可以使用这些命令获得帮助。

## 创建备份

此过程将创建一个备份文件，如果 Rancher 遇到灾难情况，可以通过该备份文件还原。

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>`替换为 Rancher 容器的名称。

   ```bash
   docker stop <RANCHER_CONTAINER_NAME>
   ```

1. 使用下面的命令替换每个占位符，从刚刚停止的 Rancher 容器中创建一个数据容器。

   ```bash
   docker create --volumes-from <RANCHER_CONTAINER_NAME> --name rancher-data-<DATE> rancher/rancher:<RANCHER_CONTAINER_TAG>
   ```

1. 从刚刚创建的数据容器（`rancher-data-<DATE>`），创建一个备份包（`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`）。使用以下命令，请替换每个占位符。

   ```bash
   docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup:z busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
   ```

1. 输入`ls`命令以确认备份压缩包已经创建。它将有一个类似`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`的名字。

1. 将备份压缩包移到 Rancher Server 外部的安全位置。然后从 Rancher Server 所在主机中删除`rancher-data-<DATE>`容器。

1. 启动停止的 Rancher Server 容器。将`<RANCHER_CONTAINER_NAME>`替换为 Rancher 容器的名称。

   ```bash
   docker start <RANCHER_CONTAINER_NAME>
   ```

1. 如果需要恢复数据，请访问[Rancher 单节点恢复](/docs/rancher2/backups/2.0-2.4/restorations/single-node-restoration/_index)。
