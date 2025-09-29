---
title: K3s Agent配置参考
description: 在本节中，您将学习如何配置 K3s agent
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
  - K3s Agent配置参考
---

在本节中，您将学习如何配置 K3s agent。

> 在整个 K3s 文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。关于传入选项的帮助，请参考[如何使用标志和环境变量。](/docs/k3s/installation/install-options/how-to-flags/)

- [配置](#配置)
- [日志](#日志)
- [集群选项](#集群选项)
- [数据](#数据)
- [节点](#节点)
- [运行时](#运行时)
- [网络](#网络)
- [定制标志](#定制标志)
- [实验性](#实验性)
- [启用](#启用)
- [Agent 的节点标签和污点](#agent节点的-标签和污点)
- [K3s Agent CLI 帮助](#k3s-agent-cli-帮助)

## 配置

| Flag                     | 默认值                         | 描述               |
| ------------------------ | ------------------------------ | ------------------ |
| `--config FILE, -c` FILE | "/etc/rancher/k3s/config.yaml" | 通过文件加载配置 |

## 日志

| Flag | 默认值 | 环境变量 | 描述 |
|------|---------|----------------------|-------------|
| `--debug` | N/A | `K3S_DEBUG` | 打开 debug 日志 |
|   `-v` value    |     0       | N/A | 日志级别详细程度的数字        |
|   `--vmodule` value   | N/A   | N/A | 以逗号分隔的 pattern=N 设置列表，用于文件过滤的日志记录        |
|   `--log value, -l` value  |  N/A  | N/A | 记录到文件   |
|   `--alsologtostderr`  | N/A       | N/A | 记录到标准错误输出和文件（如果设置）     |

## 集群选项

| Flag                       | 环境变量         | 描述                      |
| :------------------------- | :--------------- | :------------------------ |
| `--token value, -t` value  | `K3S_TOKEN`      | 用于身份认证的 token      |
| `--token-file` value       | `K3S_TOKEN_FILE` | 用于身份认证的 token 文件 |
| `--server value, -s` value | `K3S_URL`        | 要连接的 k3s Server       |

## 数据

| Flag                         | 默认值                 | 描述           |
| :--------------------------- | :--------------------- | :------------- |
| `--data-dir value, -d` value | "/var/lib/rancher/k3s" | 存放数据的目录 |

## 节点

| Flag | 默认值 | 环境变量 | 描述 |
|------|---------|----------------------|-------------|
|   `--node-name` value | N/A | `K3S_NODE_NAME`      |  节点名       |
|   `--with-node-id`    | N/A | N/A        | 将 ID 添加到节点名后      |
|   `--node-label` value | N/A | N/A       |  使用标签组来注册和启动 kubelet  |
|   `--node-taint` value | N/A | N/A    | 使用污点组来注册 kubelet  |
|   `--image-credential-provider-bin-dir` value | "/var/lib/rancher/credentialprovider/bin" | N/A | 凭证提供商插件二进制文件的路径 |
|   `--image-credential-provider-config` value | "/var/lib/rancher/credentialprovider/config.yaml" | N/A | 凭证提供商插件配置文件的路径 |
|   `--protect-kernel-defaults` | N/A | N/A | 内核调优参数。如果设置，且内核的可设参数与 kubelet 默认值不同，则会出现错误 |
|   `--selinux` | N/A | `K3S_SELINUX` | 在 containerd 中启用 SELinux |
|   `--lb-server-port` value | 6444 | `K3S_LB_SERVER_PORT` | Supervisor 客户端负载均衡器的本地端口。如果 supervisor 和 apiserver 不在同一地点，则 apiserver 客户端负载均衡器也将使用比该端口少 1 的额外端口。 |

## 运行时

| Flag                                 | 默认值                             | 描述                                          |
| :----------------------------------- | :--------------------------------- | :-------------------------------------------- | ---------------------- |
| `--docker`                           | N/A                                | 用 docker 代替 containerd                     |
| `--container-runtime-endpoint` value | N/A                                | 禁用嵌入式 containerd，使用替代的 CRI 实现    |
| `--pause-image` value                | "docker.io/rancher/pause:3.1"      | 针对 containerd 或 Docker 的自定义 pause 镜像 | (agent/runtime) (默认) |
|   `--snapshotter` value | `overlayfs` | 覆盖默认 containerd snapshotter |
|   `--private-registry` value | `/etc/rancher/k3s/registries.yaml`    |   私有镜像仓库配置文件   |

## 网络

| Flag                        | 环境变量          | 描述                     |
| :-------------------------- | :---------------- | :----------------------- |
| `--node-ip value, -i` value | N/A               | 为节点发布的 IP 地址     |
| `--node-external-ip` value  | N/A               | 对外发布节点的 IP 地址   |
| `--resolv-conf` value       | `K3S_RESOLV_CONF` | Kubelet resolv.conf 文件 |
| `--flannel-iface` value     | N/A               | 覆盖默认的 flannel 接口  |
| `--flannel-conf` value      | N/A               | 覆盖默认的 flannel 文件  |

:::note 注意：

  如果你想直接设置 kubelet 的 `--resolv-conf` 值，请使用 `--kubelet-arg=resolv-conf=value`。只有在设置为有效的 resolv.conf 文件路径时，k3s 标志才会传递给 kubelet。

:::

## 定制标志

| Flag                     | 描述                         |
| :----------------------- | :--------------------------- |
| `--kubelet-arg` value    | 自定义 kubelet 进程的参数    |
| `--kube-proxy-arg` value | 自定义 kube-proxy 进程的参数 |

## 实验性

| Flag         | 描述          |
| :----------- | :------------ |
| `--rootless` | 运行 rootless |

## 弃用

| Flag                     | 环境变量             | 描述                          |
| :----------------------- | :------------------- | :---------------------------- |
| `--no-flannel`           | N/A                  | 使用 `--flannel-backend=none` |
| `--cluster-secret` value | `K3S_CLUSTER_SECRET` | 使用 `--token`                |

## Agent 节点的 标签和污点

K3s agent 可以用`--node-label`和`--node-taint`这两个选项进行配置，这两个选项可以给 kubelet 添加标签和污点。这两个选项只在注册时添加标签和/或污点，所以只能添加一次，之后不能再通过运行 K3s 命令来改变。

下面这个例子来说明如何添加标签和污点：

```bash
     --node-label foo=bar \
     --node-label hello=world \
     --node-taint key1=value1:NoExecute
```

如果你想在节点注册后更改节点标签和污点，你应该使用`kubectl`。关于如何添加[taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)和[node labels.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)，请参考 Kubernetes 官方文档。

## K3s Agent CLI 帮助

> 如果一个选项出现在下面的括号里，例如`[$K3S_URL]`，则意味着该选项可以作为该名称的环境变量传递进来。

```bash
名称:
   k3s agent - 运行agent节点

使用:
   k3s agent [选项]

选项:
   --config FILE, -c FILE                     (config) 通过文件加载配置 (默认值："/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) 打开 debug 日志 [$K3S_DEBUG]
   -v value                                   (logging) 日志级别详细程度的数字 (默认值：0)
   --vmodule value                            (logging) 以逗号分隔的 pattern=N 设置列表，用于文件过滤的日志记录
   --log value, -l value                      (logging) 记录到文件
   --alsologtostderr                          (logging) 记录到标准错误输出和文件（如果设置）
   --token value, -t value                    (cluster) 用于身份认证的 token [$K3S_TOKEN]
   --token-file value                         (cluster) 用于身份认证的 token 文件 [$K3S_TOKEN_FILE]
   --server value, -s value                   (cluster) 要连接的 k3s Server [$K3S_URL]
   --data-dir value, -d value                 (agent/data) 存储数据的目录 (默认值："/var/lib/rancher/k3s")
   --node-name value                          (agent/node) 节点名 [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) 将 ID 添加到节点名后
   --node-label value                         (agent/node) 使用标签组来注册和启动 kubelet
   --node-taint value                         (agent/node) 使用污点组来注册 kubelet
   --image-credential-provider-bin-dir value  (agent/node) 凭证提供商插件二进制文件的路径 (默认值："/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) 凭证提供商插件配置文件的路径 (默认值："/var/lib/rancher/credentialprovider/config.yaml")
   --docker                                   (agent/runtime) 用 docker 代替 containerd
   --container-runtime-endpoint value         (agent/runtime) 禁用嵌入式 containerd，使用替代的 CRI 实现
   --pause-image value                        (agent/runtime) 针对 containerd 或 docker sandbox 的自定义 pause 镜像 (默认值："rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) 覆盖默认的 containerd snapshotter (默认值："overlayfs")
   --private-registry value                   (agent/runtime) 私有镜像仓库配置文件 (默认值："/etc/rancher/k3s/registries.yaml")
   --node-ip value, -i value                  (agent/networking) 发布节点的 IPv4/IPv6 地址
   --node-external-ip value                   (agent/networking) 对外发布节点的 IPv4/IPv6 IP 地址
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf 文件 [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) 覆盖默认的 flannel 接口
   --flannel-conf value                       (agent/networking) 覆盖默认的 flannel 配置文件
   --kubelet-arg value                        (agent/flags) kubelet 进程的自定义标志
   --kube-proxy-arg value                     (agent/flags) kube-proxy 进程的自定义标志
   --protect-kernel-defaults                  (agent/node) 内核调优参数。如果设置，且内核的可设参数与 kubelet 默认值不同，则会出现错误
   --rootless                                 (experimental) 运行 rootless
   --selinux                                  (agent/node) 在 containerd 中启动 SELinux [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) Supervisor 客户端负载均衡器的本地端口。如果 supervisor 和 apiserver 不在同一地点，则 apiserver 客户端负载均衡器也将使用比该端口少 1 的额外端口 (默认值：6444) [$K3S_LB_SERVER_PORT]
   --no-flannel                               (deprecated) 使用 --flannel-backend=none
   --cluster-secret value                     (deprecated) 使用 --token [$K3S_CLUSTER_SECRET]
```
```
