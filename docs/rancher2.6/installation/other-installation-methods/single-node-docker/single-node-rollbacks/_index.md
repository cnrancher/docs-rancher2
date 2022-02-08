---
title: 回滚 Docker 安装的 Rancher
weight: 1015
---

如果 Rancher 升级没有成功完成，你需要回滚到你在 [Docker 升级]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-upgrades)之前使用的 Rancher 设置。回滚可以恢复：

- 先前版本的 Rancher。
- 升级前创建的数据备份。

## 在你开始前

在回滚到先前 Rancher 版本的过程中，你将输入一系列命令。请按照你环境的实际情况替换占位符。占位符用尖括号和大写字母（如 `<EXAMPLE>`）表示。以下是带有占位符的命令示例：

```
docker pull rancher/rancher:<PRIOR_RANCHER_VERSION>
```

在此命令中，`<PRIOR_RANCHER_VERSION>` 是升级失败之前运行的 Rancher 版本，如 `v2.0.5`。

请交叉参考下方的图片和表格，了解获取此占位符数据的方法。在开始以下步骤之前，请先记下或复制此信息。

<sup>终端 `docker ps` 命令，显示如何找到 `<PRIOR_RANCHER_VERSION>` 和 `<RANCHER_CONTAINER_NAME>`</sup>
![占位符参考]({{<baseurl>}}/img/rancher/placeholder-ref-2.png)

| 占位符 | 示例 | 描述 |
| -------------------------- | -------------------------- | ------------------------------------------------------- |
| `<PRIOR_RANCHER_VERSION>` | `v2.0.5` | 升级前使用的 rancher/rancher 镜像。 |
| `<RANCHER_CONTAINER_NAME>` | `festive_mestorf` | 你的 Rancher 容器的名称。 |
| `<RANCHER_VERSION>` | `v2.0.5` | 备份对应的 Rancher 版本。 |
| `<DATE>` | `9-27-18` | 数据容器或备份的创建日期。 |
<br/>

可以通过远程连接登录到 Rancher Server 所在的主机并输入命令 `docker ps` 以查看正在运行的容器，从而获得 `<PRIOR_RANCHER_VERSION>` 和 `<RANCHER_CONTAINER_NAME>` 。你还可以运行 `docker ps -a` 命令查看停止了的容器。在创建备份期间，你随时可以运行这些命令来获得帮助。

## 回滚 Rancher

如果你在升级 Rancher 时遇到问题，你可拉取先前使用的镜像并恢复在升级前所做的备份，从而将 Rancher 回滚到之前的正常工作状态。

> :::warning 警告
> 回滚到先前的 Rancher 版本会破坏你在升级后对 Rancher 做出的所有更改。丢失的数据可能无法恢复。
> :::

1. 使用远程终端连接，登录到运行 Rancher Server 的节点。

1. 拉取升级前运行的 Rancher 版本。把 `<PRIOR_RANCHER_VERSION>` 替换为该版本。

   例如，如果升级之前运行的是 Rancher v2.0.5，请拉取 v2.0.5。

   ```
   docker pull rancher/rancher:<PRIOR_RANCHER_VERSION>
   ```

1. 停止当前运行 Rancher Server 的容器。将 `<RANCHER_CONTAINER_NAME>` 替换为你的 Rancher 容器的名称：

   ```
   docker stop <RANCHER_CONTAINER_NAME>
   ```
   你可输入 `docker ps`获取 Rancher 容器的名称。

1. 将你在 [Docker 升级]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-upgrades)时创建的备份压缩包移动到 Rancher Server。切换到你将其移动到的目录。输入 `dir` 以确认它在该位置。

   如果你遵循了我们在 [Docker 升级]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/single-node-upgrades)中推荐的命名方式，它的名称会与 `rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz` 类似。

1. 替换占位符来运行以下命令，将 `rancher-data` 容器中的数据替换为备份压缩包中的数据。不要忘记关闭引号。

   ```
   docker run  --volumes-from rancher-data \
   -v $PWD:/backup busybox sh -c "rm /var/lib/rancher/* -rf \
   && tar zxvf /backup/rancher-data-backup-<RANCHER_VERSION>-<DATE>.tar.gz"
   ```

1. 将 `<PRIOR_RANCHER_VERSION>` 占位符指向数据容器，启动一个新的 Rancher Server 容器。
   ```
   docker run -d --volumes-from rancher-data \
   --restart=unless-stopped \
   -p 80:80 -p 443:443 \
   --privileged \
   rancher/rancher:<PRIOR_RANCHER_VERSION>
   ```
   特权访问是[必须]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#privileged-access-for-rancher)的。

   > :::note 注意
   > 启动回滚后，即使回滚耗时比预期长，也 _不要_ 停止回滚。如果你停止回滚，可能会导致之后的升级中出现数据库错误。
   > :::

1. 等待片刻，然后在浏览器中打开 Rancher。确认回滚成功并且你的数据已恢复。

**结果**：Rancher 回滚到升级前的版本和数据状态。
