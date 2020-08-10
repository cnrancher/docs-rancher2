---
title: "升级基础"
weight: 10
---

你可以通过使用安装脚本升级K3s，或者手动安装所需版本的二进制文件。

>**注意:** 升级时，先逐个升级server节点，然后再升级其他agent节点。

## 发布 Channels

通过安装脚本或使用我们的[自动升级](/docs/k3s/upgrades/automated/_index)功能进行的升级可以绑定到不同的发布channels。以下是可用的channels。

| CHANNEL |   描述  |
|---------------|---------|
|      stable     | (默认)稳定版建议用于生产环境。这些版本已经过一段时间的社区强化。 |
|      latest      | 推荐使用最新版本尝试最新的功能。 这些版本还没有经过社区强化。 |
|      v1.18 (例子)      | 每一个支持的Kubernetes次要版本都有一个发布channel，它们分别是`v1.18`、`v1.17`和`v1.16`。在撰写本文时，它们是`v1.18`、`v1.17`和`v1.16`。这些channel会选择最新的可用补丁，不一定是稳定版本。 |

对于详细的最新channels列表，您可以访问[k3s channel 服务API](https://update.k3s.io/v1-release/channels)。关于channels工作的更多技术细节，请参见[channelserver项目](https://github.com/rancher/channelserver)。

## 使用安装脚本升级K3s

要从旧版本升级K3s，你可以使用相同的标志重新运行安装脚本，例如：

```sh
curl -sfL https://get.k3s.io | sh -
```
这将默认升级到稳定channel的较新版本。

如果你想升级到一个特定channel的较新版本（如最新），你可以指定channel。
```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

如果你想升级到特定的版本，你可以运行以下命令:

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z-rc1 sh -
```

## 使用二进制文件手动升级K3s

手动升级K3s：

1. 从[发布](https://github.com/rancher/k3s/releases)下载所需版本的K3s二进制文件
2. 将下载的二进制文件复制到`/usr/local/bin/k3s`（或您所需的位置）
3. 停止旧的K3s二进制文件
4. 启动新的K3s二进制文件

## 重启 K3s

Systemd和OpenRC的安装脚本都支持重启K3s。

**systemd**

手动重启k3s server:
```sh
sudo systemctl restart k3s
```

手动重启k3s agent:
```sh
sudo systemctl restart k3s-agent
```

**OpenRC**

手动重启k3s server::
```sh
sudo service k3s restart
```

手动重启k3s agent:
```sh
sudo service k3s-agent restart
```
