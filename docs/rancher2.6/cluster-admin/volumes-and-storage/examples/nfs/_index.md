---
title: NFS 存储
weight: 3054
---

在将 NFS 存储卷插件用于 Rancher deployment 之前，你需要配置 NFS 服务器。

> **注意**：
>
> - 如果你已经拥有 NFS 共享，则无需配置新的 NFS 服务器即可在 Rancher 中使用 NFS 卷插件。这样的话，你可以跳过此过程的其余部分并直接[添加存储]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/)。
>
> - 此教程演示了如何使用 Ubuntu 设置 NFS 服务器。你也应该能够将这些说明用于其他 Linux 发行版（例如 Debian、RHEL、Arch Linux 等）。有关如何使用另一个 Linux 发行版创建 NFS 服务器的官方说明，请参阅发行版的文档。

> **推荐**：要简化管理防火墙规则的过程，请使用 NFSv4。

1. 使用远程终端连接，登录到你打算用于 NFS 存储的 Ubuntu 服务器。

1. 输入以下命令：

   ```
   sudo apt-get install nfs-kernel-server
   ```

1. 输入以下命令，设置存储目录以及用户访问权限。如果你想使用不同的存储目录，请修改该命令：

   ```
   mkdir -p /nfs && chown nobody:nogroup /nfs
   ```
   - `-p /nfs` 参数在根目录下创建一个名为 `nfs` 的目录。
   - `chown nobody:nogroup /nfs` 参数允许对存储目录的所有访问。

1. 创建 NFS 导出表。此表设置 NFS 服务器上的目录路径，这些路径会暴露给将使用服务器进行存储的节点。

   1. 使用文本编辑器打开 `/etc/exports`。
   1. 添加你在步骤 3 中创建的 `/nfs` 文件夹的路径以及集群节点的 IP 地址。为集群中的每个 IP 地址添加一个条目。在每个地址及其附带的参数后面加上一个作为分隔符的空格：

      ```
      /nfs <IP_ADDRESS1>(rw,sync,no_subtree_check) <IP_ADDRESS2>(rw,sync,no_subtree_check) <IP_ADDRESS3>(rw,sync,no_subtree_check)
      ```

      **提示**：你可以将 IP 地址替换为子网，例如，`10.212.50.12&#47;24`。

   1. 通过输入以下命令更新 NFS 表：

      ```
      exportfs -ra
      ```

1. 打开 NFS 使用的端口。

   1. 要找出 NFS 正在使用的端口，请运行以下命令：

      ```
      rpcinfo -p | grep nfs
      ```
   2. [打开上一个命令输出的端口](https://help.ubuntu.com/lts/serverguide/firewall.html.en)。例如，以下命令打开端口 2049：

      ```
      sudo ufw allow 2049
      ```

**结果**：已将 NFS 服务器配置你的 Rancher 节点的存储。

## 后续操作

在 Rancher 中，将 NFS 服务器添加为存储卷和/或存储类。添加服务器后，你可以将其用于存储以进行部署。
