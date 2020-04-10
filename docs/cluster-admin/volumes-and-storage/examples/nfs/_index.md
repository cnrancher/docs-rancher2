---
title: NFS 存储
---

您必须先配置 NFS 服务器，然后才能将 NFS 存储卷插件用于 Rancher 部署。

> **注意：**
>
> - 如果您已经拥有 NFS 共享，则无需配置新的 NFS 服务器即可使用 Rancher 中的 NFS 卷插件。同时，请跳过本章节的其余部分并进行[存储添加](/docs/cluster-admin/volumes-and-storage/_index)。
>
> - 虽然您可以将本章节的说明用在其他 Linux 发行版（例如 Debian，RHEL，Arch Linux 等）上，但是本章节的所有内容都是基于 Ubuntu 来演示如何设置 NFS 服务器。有关如何使用其他 Linux 发行版创建 NFS 服务器的官方说明，请查阅发行版的文档。
>
> **推荐：** 为了简化管理防火墙规则的过程，请使用 NFSv4。

## 配置 NFS 存储

1. 使用远程终端连接，登录要用于 NFS 存储的 Ubuntu 服务器。

1. 输入以下命令：

   ```
   sudo apt-get install nfs-kernel-server
   ```

1. 输入以下命令，该命令用于设置存储的目录以及用户访问权限。 如果要将存储保留在其他目录中，请修改命令。

   ```
   mkdir -p /nfs && chown nobody:nogroup /nfs
   ```

   - `-p /nfs`在根目录创建了一个名为`nfs`的子目录。
   - `chown nobody:nogroup /nfs`允许所有人可以访问存储目录`/nfs`。

1. 创建一个 NFS 导出表。该表设置了 NFS 服务器上暴露给将使用该服务器进行存储的节点的目录路径。

   1. 使用文本编辑器打开`/etc/exports`。
   1. 添加在步骤 3 中创建的`/nfs`文件夹的路径，以及集群节点的 IP 地址。为集群中的每个 IP 地址添加一个条目。在每个地址及其伴随的参数后面加上一个空格，该空格作为定界符。

      ```
      /nfs <IP_ADDRESS1>(rw,sync,no_subtree_check) <IP_ADDRESS2>(rw,sync,no_subtree_check) <IP_ADDRESS3>(rw,sync,no_subtree_check)
      ```

      **提示：** 您可以用子网替代 IP 地址，例如：`10.212.50.12/24`。

   1. 使用以下命令更新 NFS 导出表：

      ```
      exportfs -ra
      ```

1. 打开 NFS 的端口.

   1. 可以使用以下命令找出 NFS 正在使用的端口：

      ```
      rpcinfo -p | grep nfs
      ```

   2. [打开](https://help.ubuntu.com/lts/serverguide/firewall.html.en)上面命令输出的端口，比如使用下面的命令来打开端口`2049`：

      ```
      sudo ufw allow 2049
      ```

**结果：** 您的 NFS 服务器已经设置好，可用于 Rancher 作存储服务。

## 下一步？

在 Rancher 中，将 NFS 服务器添加为[存储卷](/docs/cluster-admin/volumes-and-storage/_index)又或者[存储类](/docs/cluster-admin/volumes-and-storage/_index)。添加服务器后，可以将其用于部署存储。
