---
title: "安装选项介绍"
description: 本页主要介绍首次设置K3s时可以使用的选项
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
  - 安装介绍
  - 安装选项介绍
---

本页主要介绍首次设置 K3s 时可以使用的选项：

- [使用脚本安装的选项](#使用脚本安装的选项)
- [从二进制中安装的选项](#从二进制安装的选项)
- [K3s server 的注册选项](#k3s-server的注册选项)
- [K3s agent 的注册选项](#k3s-agent的注册选项)
- [配置文件](#配置文件)

除了使用环境变量和 CLI 参数配置 K3s 外，K3s 还可以使用[配置文件](#配置文件)

更多高级选项，请参阅[本页](/docs/k3s/advanced/_index)。

> 在整个 K3s 文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。关于传入选项的帮助，请参考[如何使用标志和环境变量](/docs/k3s/installation/install-options/how-to-flags/_index)。

## 使用脚本安装的选项

正如[快速启动指南](/docs/k3s/quick-start/_index)中提到的那样，你可以使用https://get.k3s.io 提供的安装脚本在基于 systemd 和 openrc 的系统上安装 K3s 作为服务。

该命令的最简单形式如下：

```sh
curl -sfL https://get.k3s.io | sh -
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

:::

使用此方法安装 K3s 时，可使用以下环境变量来配置安装:

| Environment Variable            | Description                                                                                                                                                                                                                                             |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INSTALL_K3S_SKIP_DOWNLOAD`     | 如果设置为 "true "将不会下载 K3s 的哈希值或二进制。                                                                                                                                                                                                     |
| `INSTALL_K3S_SYMLINK`           | 默认情况下，如果路径中不存在命令，将为 kubectl、crictl 和 ctr 二进制文件创建符号链接。如果设置为'skip'将不会创建符号链接，而'force'将覆盖。                                                                                                             |
| `INSTALL_K3S_SKIP_ENABLE`       | 如果设置为 "true"，将不启用或启动 K3s 服务。                                                                                                                                                                                                            |
| `INSTALL_K3S_SKIP_START`        | 如果设置为 "true "将不会启动 K3s 服务。                                                                                                                                                                                                                 |
| `INSTALL_K3S_VERSION`           | 从 Github 下载 K3s 的版本。如果没有指定，将尝试从"stable"频道下载。                                                                                                                                                                                     |
| `INSTALL_K3S_BIN_DIR`           | 安装 K3s 二进制文件、链接和卸载脚本的目录，或者使用`/usr/local/bin`作为默认目录。                                                                                                                                                                       |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | 如果设置为 true 将不会把文件写入`INSTALL_K3S_BIN_DIR`，强制设置`INSTALL_K3S_SKIP_DOWNLOAD=true`。                                                                                                                                                       |
| `INSTALL_K3S_SYSTEMD_DIR`       | 安装 systemd 服务和环境文件的目录，或者使用`/etc/systemd/system`作为默认目录。                                                                                                                                                                          |
| `INSTALL_K3S_EXEC`              | 带有标志的命令，用于在服务中启动 K3s。如果未指定命令，并且设置了`K3S_URL`，它将默认为“agent”。如果未设置`K3S_URL`，它将默认为“server”。要获得帮助，请参考[此示例。](/docs/k3s/installation/install-options/how-to-flags/_index#示例-b-install_k3s_exec) |
| `INSTALL_K3S_NAME`              | 要创建的 systemd 服务名称，如果以服务器方式运行 k3s，则默认为'k3s'；如果以 agent 方式运行 k3s，则默认为'k3s-agent'。如果指定了服务名，则服务名将以'k3s-'为前缀。                                                                                        |
| `INSTALL_K3S_TYPE`              | 要创建的 systemd 服务类型，如果没有指定，将默认使用 K3s exec 命令。                                                                                                                                                                                     |
| `INSTALL_K3S_SELINUX_WARN`      | 如果设置为 true，则在没有找到 k3s-selinux 策略的情况下将继续。                                                                                                                                                                                          |
| `INSTALL_K3S_SKIP_SELINUX_RPM`  | 如果设置为 "true "将跳过 k3s RPM 的自动安装。                                                                                                                                                                                                           |
| `INSTALL_K3S_CHANNEL_URL`       | 用于获取 K3s 下载网址的频道 URL。默认为 https://update.k3s.io/v1-release/channels 。                                                                                                                                                                    |
| `INSTALL_K3S_CHANNEL`           | 用于获取 K3s 下载 URL 的通道。默认值为 "stable"。选项包括：`stable`, `latest`, `testing`。                                                                                                                                                              |
| `K3S_CONFIG_FILE`               | 指定配置文件的位置。默认目录为`/etc/rancher/k3s/config.yaml`。                                                                                                                                                                                          |
| `K3S_TOKEN`                     | 用于将 server 或 agent 加入集群的共享 secret。                                                                                                                                                                                                          |
| `K3S_TOKEN_FILE`                | 指定 `cluster-secret`,`token` 的文件目录。                                                                                                                                                                                                              |

这个例子介绍了如何使用上述的环境变量（在管道之后）：

```
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

以 "K3S\_"开头的环境变量将被保留，供 systemd 和 openrc 服务使用。

在没有明确设置 exec 命令的情况下设置`K3S_URL`，会将命令默认为 "agent"。

运行 agent 时还必须设置`K3S_TOKEN`。

## 从二进制安装的选项

如上所述，安装脚本主要是配置 K3s 作为服务运行。如果你选择不使用脚本，你可以通过从我们的[发布页面](https://github.com/rancher/k3s/releases/latest)下载二进制文件，将其放在你的路径上，然后执行它来运行 K3s。K3s 二进制支持以下命令：

| 命令          | 描述                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `k3s server`  | 运行 K3s server，它还将启动 Kubernetes control-plane 组件，如 API server, controller-manager, 和 scheduler。                                                                                            |
| `k3s agent`   | 运行 K3s agent 节点。这将使 K3s 作为工作节点运行，启动 Kubernetes 节点服务`kubelet`和`kube-proxy`。                                                                                                     |
| `k3s kubectl` | 运行嵌入式[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) CLI。如果没有设置`KUBECONFIG`环境变量，当启动 K3s 服务器节点时，将自动尝试使用在`/etc/rancher/k3s/k3s.yaml`创建的配置文件。 |
| `k3s crictl`  | 运行一个嵌入式[crictl](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。这是一个用于与 Kubernetes 的容器运行时接口（CRI）交互的 CLI。对调试很有用。                            |
| `k3s ctr`     | 运行一个嵌入式的[ctr](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)。这是为 containerd（K3s 使用的容器守护进程）提供的 CLI。对调试很有用。                                       |
| `k3s help`    | 显示一个命令的命令列表或帮助。                                                                                                                                                                          |

`k3s server` 和 `k3s agent` 命令有额外的配置选项，可以通过 `k3s server --help` 或 `k3s agent --help` 查看.

### K3s Server 的注册选项

关于 K3s server 的详细配置，请参考[k3s server 配置参考](/docs/k3s/installation/install-options/server-config/_index)

### K3s Agent 的注册选项

关于 K3s agent 的配置详情，请参考[k3s agent 配置参考](/docs/k3s/installation/install-options/agent-config/_index)

### 配置文件

_Available as of v1.19.1+k3s1_

除了使用环境变量和 CLI 参数来配置 K3s，K3s 还可以使用配置文件。

默认情况下，位于`/etc/rancher/k3s/config.yaml`的 YAML 文件中的值将在安装时使用。

下面是一个基本的`server`配置文件的例子。

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
```

一般来说，CLI 参数映射到各自的 YAML 键，可重复的 CLI 参数被表示为 YAML 列表。

下面展示了一个完全使用 CLI 参数的相同配置来证明这一点。

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"
```

也可以同时使用配置文件和 CLI 参数。 在这种情况下，值将从两个来源加载，但 CLI 参数将优先。 对于可重复的参数，如`--node-label`，CLI 参数将覆盖列表中的所有值。

最后，配置文件的位置可以通过 cli 参数`--config FILE，-c FILE`或者环境变量`$K3S_CONFIG_FILE`来改变。
