---
title: 备份 Docker 安装的 Rancher
shortTitle: 备份
weight: 3
---

成功使用 Docker 安装 Rancher 后，我们建议你定期创建备份。最近创建的备份能让你在意外灾难发生后快速进行恢复。

## 在你开始前

在创建备份的过程中，你将输入一系列命令。请使用环境中的数据替换占位符。占位符用尖括号和大写字母（如 `<EXAMPLE>`）表示。以下是带有占位符的命令示例：

```
docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
```

在该命令中，`<DATE>` 是数据容器和备份创建日期的占位符（例如，`9-27-18`）。

请交叉参考下方的图片和表格，了解获取此占位符数据的方法。在开始[以下步骤](#creating-a-backup)之前，请记下或复制这些信息。

<sup>终端 `docker ps` 命令，显示如何找到 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`</sup>
![占位符参考]({{<baseurl>}}/img/rancher/placeholder-ref.png)

| 占位符 | 示例 | 描述 |
| -------------------------- | -------------------------- | --------------------------------------------------------- |
| `<RANCHER_CONTAINER_TAG>` | `v2.0.5` | 首次安装拉取的 rancher/rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | 你的 Rancher 容器的名称。 |
| `<RANCHER_VERSION>` | `v2.0.5` | 你为其创建备份的 Rancher 版本。 |
| `<DATE>` | `9-27-18` | 数据容器或备份的创建日期。 |
<br/>

可以通过远程连接登录到 Rancher Server 所在的主机并输入命令 `docker ps` 以查看正在运行的容器，从而获得 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`。你还可以运行 `docker ps -a` 命令查看停止了的容器。在创建备份期间，你随时可以运行这些命令来获得帮助。

## 创建备份

此步骤将创建一个备份文件。如果 Rancher 遇到灾难情况，你可以使用该备份文件进行还原。


1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将 `<RANCHER_CONTAINER_NAME>` 替换为你的 Rancher 容器的名称：

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```
1. <a id="backup"></a>运行以下命令，从刚才停止的 Rancher 容器创建一个数据容器。请替换命令中的占位符：

   ```
   docker create --volumes-from <RANCHER_CONTAINER_NAME> --name rancher-data-<DATE> rancher/rancher:<RANCHER_CONTAINER_TAG>
   ```

1. <a id="tarball"></a>从你刚刚创建的数据容器（`rancher-data-<DATE>`）中，创建一个备份 tar 包（`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`）。替换占位符来运行以下命令：

   ```
   docker run  --volumes-from rancher-data-<DATE> -v $PWD:/backup:z busybox tar pzcvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz /var/lib/rancher
   ```

   **步骤结果**：屏幕上将运行命令流。

1. 输入 `ls` 命令，确认备份压缩包已创建成功。压缩包的名称格式类似 `rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`。

1. 将备份压缩包移动到 Rancher Server 外的安全位置。然后从 Rancher Server 中删除 `rancher-data-<DATE>` 容器。

1. 重启 Rancher Server。将 `<RANCHER_CONTAINER_NAME>` 替换为 Rancher 容器的名称：

   ```
   docker start <RANCHER_CONTAINER_NAME>
   ```

**结果**：创建了 Rancher Server 数据的备份压缩包。如果你需要恢复备份数据，请参见[恢复备份：Docker 安装]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/docker-restores)。
