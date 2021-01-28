---
title: 单节点回滚
description: 如果升级 Rancher 的过程中出现问题，导致升级失败，则必须回滚到升级 Rancher 单节点前使用的 Rancher 版本及设置。执行回滚操作之前，您需要获取升级前 Ranher 的版本号（如 v2.0.5)，和升级前创建的数据备份。回滚到较早版本的 Rancher 期间，您需要输入一系列命令，按照实际情况替换命令中的占位符，获取升级前的 Rancher 版本号和数据备份。这些占位符用尖括号和大写字母（`<EXAMPLE>`）表示，以下是带有占位符的命令示例。
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
  - 安装指南
  - 其他安装方法
  - 单节点docker安装
  - 单节点docker回滚
---

如果 Rancher 升级没有成功完成，你必须回滚到你在[Docker 升级](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/single-node/_index)之前使用的 Rancher 设置。回滚还原。

- 您之前的 Rancher 版本。
- 您在升级前创建的数据备份。

## 概述

如果升级 Rancher 的过程中出现问题，导致升级失败，则必须回滚到[升级 Rancher 单节点](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/single-node/_index)前使用的 Rancher 版本及设置。执行回滚操作之前，您需要获取升级前 Rancher 的版本号（如 v2.0.5)，和升级前创建的数据备份。

回滚到较早版本的 Rancher 期间，您需要输入一系列命令，按照实际情况替换命令中的占位符，获取升级前的 Rancher 版本号和数据备份。这些占位符用尖括号和大写字母（`<EXAMPLE>`）表示，以下是带有占位符的命令示例：

```shell
docker pull rancher/rancher:<PRIOR_RANCHER_VERSION>
```

在这个命令中，`<PRIOR_RANCHER_VERSION>`是升级失败之前运行的 Rancher 的版本。例如`v2.0.5`。

请参考下图，了解如何获取此占位符数据。在开始回滚之前，写下或复制此信息。

终端 `docker ps` 命令，显示在何处找到 `<PRIOR_RANCHER_VERSION>` 和 `<RANCHER_CONTAINER_NAME>`

![占位符参考](/img/rancher/placeholder-ref-2.png)

| 占位符                     | 例子              | 说明                                  |
| :------------------------- | :---------------- | :------------------------------------ |
| `<PRIOR_RANCHER_VERSION>`  | `v2.0.5`          | 升级之前使用的 rancher/rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | Rancher 容器的名称。                  |
| `<RANCHER_VERSION>`        | `v2.0.5`          | 备份所针对的 Rancher 版本。           |
| `<DATE>`                   | `9-27-18`         | 数据容器或备份的创建日期。            |

您可以通过远程连接登录到 Rancher Server 所在的主机并输入命令：`docker ps`，查看正在运行的容器的详细信息，获取升级之前使用的 Rancher 镜像版本号`<PRIOR_RANCHER_VERSION>` 和 Rancher 的容器名称`<RANCHER_CONTAINER_NAME>`。您还可以使用`docker ps -a`命令查看停止运行的容器。在创建备份期间，您可以随时使用这些命令获得帮助。

## 操作步骤

如果您在升级 Rancher 时遇到问题，需要拉取之前正常版本的镜像，还原在升级前所做的备份，从而将 Rancher 回滚到之前正常工作的状态。

:::important 警告！
回滚到 Rancher 的先前版本会破坏您在升级后对 Rancher 所做的任何更改。可能会发生不可恢复的数据丢失。
:::

1. 使用远程终端连接，登录运行 Rancher Server 的节点。

1. 将`<PRIOR_RANCHER_VERSION>` 替换为升级前使用的版本号，拉取升级前运行的 Rancher 版本的镜像。

   例如，如果升级前运行的是 Rancher v2.0.5，请拉取 v2.0.5。

   ```
   docker pull rancher/rancher:<PRIOR_RANCHER_VERSION>
   ```

1. 停止当前运行 Rancher Server 的容器。将`<RANCHER_CONTAINER_NAME>`替换为 Rancher 容器的名称。

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```

   您可以在命令行工具输入`docker ps`，获得 Rancher 容器的名称。

1. 将[升级单节点 Rancher](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/single-node/_index)时生成的备份压缩包移动到 Rancher Server 上。切换到目标目录，输入`ls`指令，确认将备份压缩包移动到了正确的路径。

   如果您遵循了我们在[升级单节点 Rancher](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/single-node/_index)中建议的命名约定，则其命名类似于(`rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz`)。

1. 运行以下命令，替换[占位符](#在回滚之前)，别忘了关闭引号。从而将`rancher-data`容器中的数据替换为备份压缩包中的数据。

   ```
   docker run  --volumes-from rancher-data \
   -v $PWD:/backup busybox sh -c "rm /var/lib/rancher/* -rf \
   && tar zxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz"
   ```

1. 启动一个新的指向数据容器的 Rancher Server 容器，替换 `<PRIOR_RANCHER_VERSION>` [占位符](#在回滚之前)。

   ```
   docker run -d --volumes-from rancher-data \
    --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    --privileged \
    rancher/rancher:<PRIOR_RANCHER_VERSION>
   ```

   > **注意：** 不要在启动回滚后停止回滚，即使回滚过程似乎比预期的要长。停止回滚可能导致在将来的升级时产生数据库问题。

1. 等待片刻，然后在 Web 浏览器中打开 Rancher。确认回滚成功并且您的数据已还原。

**结果：** Rancher 回滚到了在其升级之前的版本和数据状态。
