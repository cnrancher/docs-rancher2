---
title: 基础升级
description: 你可以通过使用安装脚本来升级rke2，或者通过手动安装所需版本的二进制文件。
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
  - RKE2
  - 基础升级
---


你可以通过使用安装脚本来升级rke2，或者通过手动安装所需版本的二进制文件。

:::warning 注意：
先升级server节点，一次一个。一旦所有server都被升级，你就可以升级agent节点。
:::

## Release Channels

通过安装脚本或使用我们的[自动升级](/docs/rke2/upgrade/automated_upgrade/_index)功能进行的升级可以绑定到不同的release channels。

对于一个详尽的、最新的channel列表，你可以访问[rke2 channel服务API](https://update.rke2.io/v1-release/channels)。关于channel如何工作的更多技术细节，你可以参考[channelserver项目](https://github.com/rancher/channelserver)。

## 使用安装脚本升级rke2

要从旧版本升级rke2，你可以使用相同的标志重新运行安装脚本，例如:

```sh
curl -sfL https://get.rke2.io | sh -
```

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn sh - 
```
:::

这将默认升级到stable channel中的最新的版本。

如果你想升级到一个特定channel的较新版本（如最新版本），你可以指定该channel:
```sh
curl -sfL https://get.rke2.io | INSTALL_RKE2_CHANNEL=latest sh -
```

如果你想升级到一个特定的版本，你可以运行以下命令:

```sh
curl -sfL https://get.rke2.io | INSTALL_RKE2_VERSION=vX.Y.Z+rke2rN sh -
```

安装后，请记得重启 rke2 进程：

```sh
# Server 节点：
systemctl restart rke2-server

# Agent 节点：
systemctl restart rke2-agent
```

## 使用二进制文件手动升级rke2

或者手动升级rke2。

1. 从[发布](https://github.com/rancher/rke2/releases)下载所需版本的rke2二进制文件。
2. 将下载的二进制文件复制到`/usr/local/bin/rke2`，用于安装tarball的rke2；`/usr/bin`用于安装rpm的rke2。
3. 停止旧的rke2二进制文件
4. 启动新的rke2二进制文件

## 重启rke2

systemd 的安装脚本支持重启 rke2。

**systemd**

手动重启server：
```sh
sudo systemctl restart rke2-server
```

手动重启agent：
```sh
sudo systemctl restart rke2-agent
```
