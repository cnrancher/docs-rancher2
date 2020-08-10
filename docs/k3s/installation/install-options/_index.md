---
title: "安装选项介绍"
weight: 20
---

本页主要介绍首次设置K3s时可以使用的选项:

- [使用脚本安装的选项](#使用脚本安装的选项)
- [从二进制中安装的选项](#从二进制中安装k3s)
- [K3s server的注册选项](#k3s-server的注册选项)
- [K3s agent的注册选项](#k3s-agent的注册选项)

更多高级选项，请参阅[本页。](/docs/k3s/advanced/_index)

> 在整个K3s文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。关于传入选项的帮助，请参考[如何使用标志和环境变量。](/docs/k3s/installation/install-options/how-to-flags/_index)

## 使用脚本安装的选项

正如[快速启动指南](/docs/k3s/quick-start/_index)中提到的那样，你可以使用https://get.k3s.io 提供的安装脚本在基于systemd和openrc的系统上安装K3s作为服务。

该命令的最简单形式如下:
```sh
curl -sfL https://get.k3s.io | sh -
```

:::note 提示
国内用户，可以使用以下方法加速安装：
```
curl -sfL https://docs.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```
:::

使用此方法安装K3s时，可使用以下环境变量来配置安装:

| Environment Variable | Description |
|-----------------------------|---------------------------------------------|
| `INSTALL_K3S_SKIP_DOWNLOAD` | 如果设置为 "true "将不会下载K3s的哈希值或二进制。 |
| `INSTALL_K3S_SYMLINK` | 默认情况下，如果路径中不存在命令，将为kubectl、crictl和ctr二进制文件创建符号链接。如果设置为'skip'将不会创建符号链接，而'force'将覆盖。 |
| `INSTALL_K3S_SKIP_ENABLE` | 如果设置为 "true"，将不启用或启动K3s服务。 |
| `INSTALL_K3S_SKIP_START` | 如果设置为 "true "将不会启动K3s服务。 |
| `INSTALL_K3S_VERSION` | 从Github下载K3s的版本。如果没有指定，将尝试从"stable"频道下载。 |
| `INSTALL_K3S_BIN_DIR` | 安装K3s二进制文件、链接和卸载脚本的目录，或者使用`/usr/local/bin`作为默认目录。 |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | 如果设置为true将不会把文件写入`INSTALL_K3S_BIN_DIR`，强制设置`INSTALL_K3S_SKIP_DOWNLOAD=true`。 |
| `INSTALL_K3S_SYSTEMD_DIR` | 安装systemd服务和环境文件的目录，或者使用`/etc/systemd/system`作为默认目录。 |
| `INSTALL_K3S_EXEC` | 带有标志的命令，用于在服务中启动K3s。如果未指定命令，并且设置了`K3S_URL`，它将默认为“agent”。如果未设置`K3S_URL`，它将默认为“server”。要获得帮助，请参考[此示例。](/docs/k3s/installation/install-options/how-to-flags/_index#示例-b-install_k3s_exec) |
| `INSTALL_K3S_NAME` | 要创建的systemd服务名称，如果以服务器方式运行k3s，则默认为'k3s'；如果以agent方式运行k3s，则默认为'k3s-agent'。如果指定了服务名，则服务名将以'k3s-'为前缀。 |
| `INSTALL_K3S_TYPE` | 要创建的systemd服务类型，如果没有指定，将从K3s exec命令中默认。
| `INSTALL_K3S_CHANNEL_URL` | 用于获取K3s下载网址的频道URL。默认为https://update.k3s.io/v1-release/channels 。
| `INSTALL_K3S_CHANNEL` | 用于获取K3s下载URL的通道。默认值为 "stable"。选项包括：`stable`, `latest`, `testing`。 |

以 "K3S_"开头的环境变量将被保留，供systemd和openrc服务使用。

在没有明确设置exec命令的情况下设置`K3S_URL`，会将命令默认为 "agent"。

运行agent时还必须设置`K3S_TOKEN`。

## 从二进制中安装K3s

如上所述，安装脚本主要是配置K3s作为服务运行。如果你选择不使用脚本，你可以通过从我们的[发布页面](https://github.com/rancher/k3s/releases/latest)下载二进制文件，将其放在你的路径上，然后执行它来运行K3s。K3s二进制支持以下命令：

命令 | 描述
--------|------------------
`k3s server` | 运行K3s server，它还将启动Kubernetes控制平面组件，如API server, controller-manager, 和 scheduler。
`k3s agent` |  运行K3s agent节点。这将使K3s作为工作节点运行，启动Kubernetes节点服务`kubelet`和`kube-proxy`。
`k3s kubectl` | 运行嵌入式[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) CLI。如果没有设置`KUBECONFIG`环境变量，当启动K3s服务器节点时，将自动尝试使用在`/etc/rancher/k3s/k3s.yaml`创建的配置文件。
`k3s crictl` | 运行一个嵌入式[crictl](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。这是一个用于与Kubernetes的容器运行时接口（CRI）交互的CLI。对调试很有用。
`k3s ctr` | 运行一个嵌入式的[ctr](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)。这是为containerd（K3s使用的容器守护进程）提供的CLI。对调试很有用。
`k3s help` | 显示一个命令的命令列表或帮助。

`k3s server` 和 `k3s agent` 命令有额外的配置选项，可以通过 `k3s server --help` 或 `k3s agent --help` 查看.

### K3s Server的注册选项

关于K3s server的详细配置，请参考[k3s server配置参考](/docs/k3s/installation/install-options/server-config/_index)

### K3s Agent的注册选项

关于K3s agent的配置详情，请参考[k3s agent配置参考](/docs/k3s/installation/install-options/agent-config/_index)
