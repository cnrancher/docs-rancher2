---
title: 安装
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - 安装故障排查
  - 故障排查
  - 安装问题
  - 安装失败
description: 本节介绍如何在安装失败的情况下进行故障排查或获取帮助。
---

## 概述

本节介绍如何在安装失败的情况下进行故障排查或获取帮助。

## 登录到 Harvester 安装程序（实时操作系统）

你可以按下 `CTRL + ALT + F2` 组合键来切换到另一个 TTY，并使用以下凭证进行登录：

- 用户：`rancher`
- 密码：`rancher`

## 满足硬件要求

- 检查你的硬件是否满足完成安装的[最低要求](../../_index#硬件要求)。

## 收到提示信息：`"Loading images. This may take a few minutes..."`

- 这是因为系统没有默认路由，导致安装程序卡在当前状态。你可以执行以下命令来检查路由状态：

```console
$ ip route
default via 10.10.0.10 dev harvester-mgmt proto dhcp        <-- Does a default route exist?
10.10.0.0/24 dev harvester-mgmt proto kernel scope link src 10.10.0.15
```

- 检查 DHCP 服务器是否提供默认路由选项。你也可以附上从 `/run/cos/target/rke2.log` 获取的信息。

## 修改 Agent 节点的集群 Token

如果 Agent 无法加入集群，可能与集群 Token 与服务器节点 Token 不一致有关。
为了确认问题，你可以连接到你的 Agent 节点（例如使用 [SSH](../../troubleshooting/os/_index#如何登录到-Harvester-节点)），并运行以下命令来检查 `rancherd` 的服务日志：

```bash
$ sudo journalctl -b -u rancherd
```

如果 Agent 节点中设置的集群 Token 与服务器节点 Token 不匹配，你会发现以下信息中的几个条目：

```
...
msg="Bootstrapping Rancher (master-head/v1.21.5+rke2r1)"
msg="failed to bootstrap system, will retry: generating plan: insecure cacerts download from https://192.168.122.115:8443/cacerts: Get \"https://192.168.122.115:8443/cacerts\": EOF"
...
```

要解决这个问题，你需要在 `rancherd` 配置文件 `/etc/rancher/rancherd/config.yaml` 中更新 Token 的值。

例如，如果服务器节点中设置的集群 Token 是 `ThisIsTheCorrectOne`，你需要更新 Token 的值，如下：

```yaml
...
token: 'ThisIsTheCorrectOne'
...
```

为了确保在重启后仍能维持更改，更新操作系统配置文件 `/oem/99_custom.yaml` 的 `token` 的值：

```yaml
name: Harvester Configuration
stages:
  ...
  initramfs:
  - commands:
    - rm -f /etc/sysconfig/network/ifroute-harvester-mgmt
    files:
    - path: /etc/rancher/rancherd/config.yaml
      permissions: 384
      owner: 0
      group: 0
      content: |
        role: cluster-init
        token: 'ThisIsTheCorrectOne' # <- Update this value
        kubernetesVersion: v1.21.5+rke2r1
        labels:
         - harvesterhci.io/managed=true
      encoding: ""
      ownerstring: ""
```

> 注意
> 要查看当前集群 Token 的值，请登录到你的服务器节点（例如用 SSH）并查看 `/etc/rancher/rancherd/config.yaml` 文件。例如，你可以运行以下命令来仅显示 Token 的值：

  ```bash
    $ sudo yq eval .token /etc/rancher/rancherd/config.yaml
  ```

## 收集信息

在报告安装失败问题时，请包括以下信息：

- 安装失败的截图。
- 以下文件的内容：

   ```
   /var/log/console.log
   /run/cos/target/rke2.log
   /tmp/harvester.*
   /tmp/cos.*
   ```

- 以下命令的输出：

   ```
   blkid
   dmesg
   ```
