---
title: 恢复备份 - Docker 安装
shortTitle: 还原
weight: 3
---

如果遇到灾难情况，你可以将 Rancher Server 恢复到最新的备份。

## 在你开始前

在恢复备份的过程中，你将输入一系列命令。请使用环境中的数据替换占位符。占位符用尖括号和大写字母（如 `<EXAMPLE>`）表示。以下是带有占位符的命令示例：

```
docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
busybox sh -c "rm /var/lib/rancher/* -rf  && \
tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>"
```

在此命令中，`<RANCHER_CONTAINER_NAME>` 和 `<RANCHER_VERSION>-<DATE>` 是用于 Rancher 部署的环境变量。

请交叉参考下方的图片和表格，了解获取此占位符数据的方法。在开始以下步骤之前，请先记下或复制此信息。

<sup>终端 `docker ps` 命令，显示如何找到 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`</sup>
![占位符参考]({{<baseurl>}}/img/rancher/placeholder-ref.png)

| 占位符 | 示例 | 描述 |
| -------------------------- | -------------------------- | --------------------------------------------------------- |
| `<RANCHER_CONTAINER_TAG>` | `v2.0.5` | 首次安装拉取的 rancher/rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | 你的 Rancher 容器的名称。 |
| `<RANCHER_VERSION>` | `v2.0.5` | Rancher 备份的版本号。 |
| `<DATE>` | `9-27-18` | 数据容器或备份的创建日期。 |
<br/>

可以通过远程连接登录到 Rancher Server 所在的主机并输入命令 `docker ps` 以查看正在运行的容器，从而获得 `<RANCHER_CONTAINER_TAG>` 和 `<RANCHER_CONTAINER_NAME>`。你还可以运行 `docker ps -a` 命令查看停止了的容器。在创建备份期间，你随时可以运行这些命令来获得帮助。

## 恢复备份

使用你之前创建的[备份]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/docker-backups)，将 Rancher 恢复到最后已知的健康状态。

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 停止当前运行 Rancher Server 的容器。将 `<RANCHER_CONTAINER_NAME>` 替换为 Rancher 容器的名称：

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```
1. 将你在[创建备份 - Docker 安装]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/docker-backups)时创建的备份压缩包移动到 Rancher Server。切换到你将其移动到的目录。输入 `dir` 以确认它在该位置。

   如果你遵循了我们在[创建备份 - Docker 安装]({{<baseurl>}}/rancher/v2.6/en/backups/docker-installs/docker-backups/)中推荐的命名方式，它的名称会与 `rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz` 类似。

1. 输入以下命令删除当前状态数据，并将其替换为备份数据。请替换占位符。不要忘记关闭引号。

   > **警告**：该命令将删除 Rancher Server 容器中的所有当前状态数据。创建备份压缩包后保存的任何更改都将丢失。

   ```
   docker run  --volumes-from <RANCHER_CONTAINER_NAME> -v $PWD:/backup \
   busybox sh -c "rm /var/lib/rancher/* -rf  && \
   tar pzxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz"
   ```

   **步骤结果**：屏幕上将运行命令流。

1. 重新启动 Rancher Server 容器，替换占位符。Rancher Server 将使用你的备份数据重新启动。

   ```
   docker start <RANCHER_CONTAINER_NAME>
   ```

1. 等待片刻，然后在浏览器中打开 Rancher。确认还原成功，并且你的数据已恢复。
