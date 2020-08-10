---
title: K3s Agent配置参考
weight: 2
---
在本节中，您将学习如何配置K3s agent。

> 在整个K3s文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。关于传入选项的帮助，请参考[如何使用标志和环境变量。](/docs/k3s/installation/install-options/how-to-flags/_index)

- [日志](#日志)
- [集群选项](#集群选项)
- [数据](#数据)
- [节点](#节点)
- [运行时](#运行时)
- [网络](#网络)
- [定制标志](#定制标志)
- [实验性](#实验性)
- [启用](#启用)
- [Agent的节点标签和污点](#agent节点的-标签和污点)
- [K3s Agent CLI 帮助](#k3s-agent-cli-帮助)

## 日志

| Flag |  默认值 | 描述 |
|------|---------|-------------|
|   `-v` value    |     0         | 日志级别详细程度的数字        |
|   `--vmodule` value   | N/A        | 以逗号分隔的pattern=N设置列表，用于文件过滤的日志记录        |
|   `--log value, -l` value  |  N/A    | 记录到文件   |
|   `--alsologtostderr`  | N/A        | 记录到标准错误输出和文件（如果设置）     | 

## 集群选项
| Flag | 环境变量 | 描述 |
|------|----------------------|-------------|
|   `--token value, -t` value  | `K3S_TOKEN`    | 用于身份认证的token    |
|   `--token-file` value   |  `K3S_TOKEN_FILE`     | 用于身份认证的token文件       |
|   `--server value, -s` value  | `K3S_URL`    | 要连接的k3s Server     |


## 数据
| Flag |  默认值 | 描述 |
|------|---------|-------------|
|   `--data-dir value, -d` value  | "/var/lib/rancher/k3s"    |  存放数据的目录 |

## 节点
| Flag | 环境变量 | 描述 |
|------|----------------------|-------------|
|   `--node-name` value |  `K3S_NODE_NAME`      |  节点名称       |
|   `--with-node-id`    |  N/A         | 将ID附加到节点名称      |
|   `--node-label` value |    N/A        |  用一组标签注册和启动kubelet。   |
|   `--node-taint` value |      N/A     | 用一组污点注册kubelet    |

## 运行时
| Flag |  默认值 | 描述 |
|------|---------|-------------|
|   `--docker` |      N/A        |      用docker代替containerd       |
|   `--container-runtime-endpoint` value | N/A   |  禁用嵌入式containerd，使用替代的CRI实现 |
|   `--pause-image` value | "docker.io/rancher/pause:3.1"     |  针对containerd或Docker的自定义pause镜像      | (agent/runtime)  (默认: )
|   `--private-registry` value | "/etc/rancher/k3s/registries.yaml"    |   私有注册表配置文件   |

## 网络
| Flag | 环境变量 | 描述 |
|------|----------------------|-------------|
|   `--node-ip value, -i` value | N/A   |   为节点发布的IP地址  |
|   `--node-external-ip` value |  N/A   | 对外发布节点的IP地址      |
|   `--resolv-conf` value |   `K3S_RESOLV_CONF`    |  Kubelet resolv.conf 文件      | 
|   `--flannel-iface` value |    N/A   | 覆盖默认的flannel接口      |
|   `--flannel-conf` value |    N/A     |  覆盖默认的flannel文件 |

## 定制标志
| Flag |  描述 |
|------|--------------|
|   `--kubelet-arg` value |   自定义kubelet进程的参数      | 
|   `--kube-proxy-arg` value |   自定义kube-proxy进程的参数    |

## 实验性
| Flag |  描述 |
|------|--------------|
|   `--rootless`  |     运行 rootless           |

## 启用
| Flag | 环境变量 | 描述 |
|------|----------------------|-------------|
|   `--no-flannel`   |   N/A       |   使用 `--flannel-backend=none`       | 
|   `--cluster-secret` value  |   `K3S_CLUSTER_SECRET`     |    使用 `--token` |

## Agent节点的 标签和污点

K3s agent可以用`--node-label`和`--node-taint`这两个选项进行配置，这两个选项可以给kubelet添加标签和污点。这两个选项只在注册时添加标签和/或污点，所以只能添加一次，之后不能再通过运行K3s命令来改变。

下面这个例子来说明如何添加标签和污点:
```bash
     --node-label foo=bar \
     --node-label hello=world \
     --node-taint key1=value1:NoExecute
```

如果你想在节点注册后更改节点标签和污点，你应该使用`kubectl`。关于如何添加[taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)和[node labels.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)，请参考Kubernetes官方文档。


## K3s Agent CLI 帮助

> 如果一个选项出现在下面的括号里，例如`[$K3S_URL]`，则意味着该选项可以作为该名称的环境变量传递进来。

```bash
名称:
   k3s agent - 运行agent节点

使用:
   k3s agent [选项]

选项:
   -v value                            (logging) 日志级别详细程度的数字 (默认: 0)
   --vmodule value                     (logging) 以逗号分隔的pattern=N设置列表，用于文件过滤的日志记录
   --log value, -l value               (logging) 记录到文件
   --alsologtostderr                   (logging) 记录到标准错误输出和文件（如果设置）
   --token value, -t value             (cluster) 用于身份认证的token [$K3S_TOKEN]
   --token-file value                  (cluster) 用于身份认证的token文件 [$K3S_TOKEN_FILE]
   --server value, -s value            (cluster) 要连接的k3s Server [$K3S_URL]
   --data-dir value, -d value          (agent/data) 存放数据的目录 (默认: "/var/lib/rancher/k3s")
   --node-name value                   (agent/node) Node name [$K3S_NODE_NAME]
   --with-node-id                      (agent/node) 将ID附加到节点名称
   --node-label value                  (agent/node) 用一组标签注册和启动kubelet。
   --node-taint value                  (agent/node) 用一组污点注册kubelet
   --docker                            (agent/runtime) 用docker代替containerd
   --container-runtime-endpoint value  (agent/runtime) 禁用嵌入式containerd，使用替代的CRI实现
   --pause-image value                 (agent/runtime) 针对containerd或Docker的自定义pause镜像(默认: "docker.io/rancher/pause:3.1")
   --private-registry value            (agent/runtime) 私有注册表配置文件 (默认: "/etc/rancher/k3s/registries.yaml")
   --node-ip value, -i value           (agent/networking) 为节点发布的IP地址
   --node-external-ip value            (agent/networking) 对外发布节点的IP地址
   --resolv-conf value                 (agent/networking) Kubelet resolv.conf 文件 [$K3S_RESOLV_CONF]
   --flannel-iface value               (agent/networking) 覆盖默认的flannel接口
   --flannel-conf value                (agent/networking) 覆盖默认的flannel文件
   --kubelet-arg value                 (agent/flags) 自定义kubelet进程的参数
   --kube-proxy-arg value              (agent/flags) 自定义kube-proxy进程的参数
   --rootless                          (experimental) 运行 rootless
   --no-flannel                        (deprecated) 使用 --flannel-backend=none
   --cluster-secret value              (deprecated) 使用 --token [$K3S_CLUSTER_SECRET]
```
