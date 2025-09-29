---
title: "基础升级"
description: 本节介绍如何基础升级 K3s 集群。你可以通过使用安装脚本升级K3s，或者手动安装所需版本的二进制文件。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 基础升级
---

你可以通过使用安装脚本升级 K3s，或者手动安装所需版本的二进制文件。

> **注意：** 升级时，先逐个升级 server 节点，然后再升级其他 agent 节点。

## 发布 Channels

通过安装脚本或使用我们的[自动升级](/docs/k3s/upgrades/automated/)功能进行的升级可以绑定到不同的发布 channels。以下是可用的 channels。

| CHANNEL      | 描述                                                                                                                                                                                            |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stable       | (默认)稳定版建议用于生产环境。这些版本已经过一段时间的社区强化。                                                                                                                                |
| latest       | 推荐使用最新版本尝试最新的功能。 这些版本还没有经过社区强化。                                                                                                                                   |
| v1.18 (例子) | 每一个支持的 Kubernetes 次要版本都有一个发布 channel，它们分别是`v1.18`、`v1.17`和`v1.16`。在撰写本文时，它们是`v1.18`、`v1.17`和`v1.16`。这些 channel 会选择最新的可用补丁，不一定是稳定版本。 |

对于详细的最新 channels 列表，您可以访问[k3s channel 服务 API](https://update.k3s.io/v1-release/channels)。关于 channels 工作的更多技术细节，请参见[channelserver 项目](https://github.com/rancher/channelserver)。

## 使用安装脚本升级 K3s

要从旧版本升级 K3s，你可以使用相同的标志重新运行安装脚本，例如：

```sh
curl -sfL https://get.k3s.io | sh -
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

:::

这将默认升级到稳定 channel 的较新版本。

如果你想升级到一个特定 channel 的较新版本（如最新），你可以指定 channel。

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

如果你想升级到特定的版本，你可以运行以下命令:

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z-rc1 sh -
```

## 使用二进制文件手动升级 K3s

手动升级 K3s：

1. 从[发布](https://github.com/rancher/k3s/releases)下载所需版本的 K3s 二进制文件
2. 将下载的二进制文件复制到`/usr/local/bin/k3s`（或您所需的位置）
3. 停止旧的 K3s 二进制文件
4. 启动新的 K3s 二进制文件

## 重启 K3s

Systemd 和 OpenRC 的安装脚本都支持重启 K3s。

**systemd**

手动重启 k3s server：

```sh
sudo systemctl restart k3s
```

手动重启 k3s agent：

```sh
sudo systemctl restart k3s-agent
```

**OpenRC**

手动重启 k3s server：

```sh
sudo service k3s restart
```

手动重启 k3s agent：

```sh
sudo service k3s-agent restart
```
