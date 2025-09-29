---
title: K3s Server 配置参考
description: 在本节中，你将学习如何配置 K3s server。
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
  - K3s Server 配置参考
---

在本节中，你将学习如何配置 K3s server。

> 在整个 K3s 文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。关于传入选项的帮助，请参考[如何使用标志和环境变量。](/docs/k3s/installation/install-options/how-to-flags/)

- [常用选项](#常用选项)
  - [数据库](#数据库)
  - [集群选项](#集群选项)
  - [客户端选项](#客户端选项)
- [Agent 选项](#agent-选项)
  - [Agent 节点](#agent-节点)
  - [Agent 运行时](#agent-运行时)
  - [Agent 网络](#agent-网络)
- [高级选项](#高级选项)
  - [日志](#日志)
  - [监听](#监听)
  - [数据](#数据)
  - [网络](#网络)
  - [自定义选项](#自定义选项)
  - [存储类](#存储类)
  - [Kubernetes 组件](#kubernetes-组件)
  - [为 Kubernetes 进程定制标志](#kubernetes进程定制标志)
  - [实验性选项](#实验性选项)
  - [废弃的选项](#废弃的选项)
- [K3s Server Cli 帮助](#k3s-server-cli-帮助)

## 常用选项

### 数据库

| Flag                                  | 环境变量                 | 描述                                                                                        |
| :------------------------------------ | :----------------------- | :------------------------------------------------------------------------------------------ |
| `--datastore-endpoint` value          | `K3S_DATASTORE_ENDPOINT` | 指定 etcd、Mysql、Postgres 或 Sqlite（默认）数据源名称。                                    |
| `--datastore-cafile` value            | `K3S_DATASTORE_CAFILE`   | TLS 证书授权文件，用于确保数据存储后端通信的安全。                                          |
| `--datastore-certfile` value          | `K3S_DATASTORE_CERTFILE` | TLS 认证文件，用于确保数据存储后端通信的安全。                                              |
| `--datastore-keyfile` value           | `K3S_DATASTORE_KEYFILE`  | 用于保护数据存储后端通信的 TLS 密钥文件。                                                   |
| `--etcd-expose-metrics`               | N/A                      | 将 etcd 指标公开给客户端界面。(默认为 false)                                                |
| `--etcd-disable-snapshots`            | N/A                      | 禁用自动 etcd 快照                                                                          |
| `--etcd-snapshot-name` value          | N/A                      | 设置 etcd 快照的基本名称。默认值: etcd-snapshot                                             |
| `--etcd-snapshot-schedule-cron` value | N/A                      | cron 规范中的快照间隔时间。 例如。每 5 小时 "\* \*/5 \* \* \*" (默认值: "0 \*/12 \* \* \*") |
| `--etcd-snapshot-retention` value     | N/A                      | 要保留的快照数量 (默认值: 5)                                                                |
| `--etcd-snapshot-dir` value           | N/A                      | 保存数据库快照的目录. (默认 location: ${data-dir}/db/snapshots)                             |
| `--etcd-s3`                           | N/A                      | 启用备份到 S3                                                                               |
| `--etcd-s3-endpoint` value            | N/A                      | S3 endpoint url (默认值: "s3.amazonaws.com")                                                |
| `--etcd-s3-endpoint-ca` value         | N/A                      | S3 自定义 CA 证书连接到 S3 endpoint                                                         |
| `--etcd-s3-skip-ssl-verify`           | N/A                      | 禁用 S3 的 SSL 证书验证                                                                     |
| `--etcd-s3-access-key` value          | `AWS_ACCESS_KEY_ID`      | S3 access key                                                                               |
| `--etcd-s3-secret-key` value          | `AWS_SECRET_ACCESS_KEY`  | S3 secret key                                                                               |
| `--etcd-s3-bucket` value              | N/A                      | S3 bucket 名称                                                                              |
| `--etcd-s3-region` value              | N/A                      | S3 region / bucket 位置 (可选) 默认值: "us-east-1")                                         |
| `--etcd-s3-folder` value              | N/A                      | S3 文件夹                                                                                   |

### 集群选项

| Flag                      | 环境变量         | 描述                                         |
| :------------------------ | :--------------- | :------------------------------------------- |
| `--token value, -t` value | `K3S_TOKEN`      | 用于将 server 或 agent 加集群的共享 secret。 |
| `--token-file` value      | `K3S_TOKEN_FILE` | 包含 cluster-secret/token 的文件             |

### 客户端选项

| Flag                                 | 环境变量                | 描述                                                                                                                                                     |
| :----------------------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--write-kubeconfig value, -o` value | `K3S_KUBECONFIG_OUTPUT` | 将管理客户端的 kubeconfig 写入这个文件。                                                                                                                 |
| `--write-kubeconfig-mode` value      | `K3S_KUBECONFIG_MODE`   | 使用这种[模式](https://en.wikipedia.org/wiki/Chmod)写入 kubeconfig。允许写入 kubeconfig 文件的选项对于允许将 K3s 集群导入 Rancher 很有用。示例值为 644。 |

## Agent 选项

K3s agent 选项是可以作为 server 选项的，因为 server 内部嵌入了 agent 进程。

### Agent 节点

| Flag                                        | 环境变量             | 描述                                                                                                                                                |
| :------------------------------------------ | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--node-name` value                         | `K3S_NODE_NAME`      | 节点名称                                                                                                                                            |
| `--with-node-id`                            | N/A                  | 将 ID 附加到节点名称                                                                                                                                |
| `--node-label` value                        | N/A                  | 用一组标签注册和启动 kubelet。                                                                                                                      |
| `--node-taint` value                        | N/A                  | 用一组污点注册 kubelet。                                                                                                                            |
| `--image-credential-provider-bin-dir` value | N/A                  | 凭证提供程序插件二进制文件所在目录的路径（默认："/var/lib/rancher/credentialprovider/bin"）。                                                       |
| `--image-credential-provider-config` value  | N/A                  | 凭证提供者插件配置文件的路径 (默认： "/var/lib/rancher/credentialprovider/config.yaml")                                                             |
| `--selinux`                                 | `K3S_SELINUX`        | 在 containerd 中启用 SELinux                                                                                                                        |
| `--lb-server-port` value                    | `K3S_LB_SERVER_PORT` | 客户端负载均衡器的本地端口。如果 supervisor 和 apiserver 不在同一个主机，则 apiserver 客户端负载均衡器也将使用比该端口小 1 的额外端口。(默认：6444) |

### Agent 运行时

| Flag                                 | 默认值                             | 描述                                               |
| :----------------------------------- | :--------------------------------- | :------------------------------------------------- |
| `--docker`                           | N/A                                | 用 docker 代替 containerd                          |
| `--container-runtime-endpoint` value | N/A                                | 禁用嵌入式 containerd，使用替代的 CRI 实现。       |
| `--pause-image` value                | "docker.io/rancher/pause:3.1"      | 针对 containerd 或 Docker 的自定义 pause 镜像      |
| `--snapshotter` value                | N/A                                | 覆盖默认的 containerd 快照程序 (默认: "overlayfs") |
| `--private-registry` value           | "/etc/rancher/k3s/registries.yaml" | 私有镜像仓库配置文件                               |

### Agent 网络

Agent 选项之所以存在，是因为 server 内嵌了 agent 进程

| Flag                        | 环境变量          | 描述                     |
| :-------------------------- | :---------------- | :----------------------- |
| `--node-ip value, -i` value | N/A               | 为节点发布的 IP 地址     |
| `--node-external-ip` value  | N/A               | 对外发布节点的 IP 地址   |
| `--resolv-conf` value       | `K3S_RESOLV_CONF` | Kubelet resolv.conf 文件 |
| `--flannel-iface` value     | N/A               | 覆盖默认的 flannel 接口  |
| `--flannel-conf` value      | N/A               | 覆盖默认的 flannel 文件  |

## 高级选项

### 日志

| Flag                    | 默认值 | 描述                                                    |
| :---------------------- | :----- | :------------------------------------------------------ |
| `--debug`               | N/A    | 开启调试日志                                            |
| `-v` value              | 0      | 日志级别详细程度的数字                                  |
| `--vmodule` value       | N/A    | 以逗号分隔的 pattern=N 设置列表，用于文件过滤的日志记录 |
| `--log value, -l` value | N/A    | 记录到文件                                              |
| `--alsologtostderr`     | N/A    | 记录到标准错误输出和文件（如果设置）。                  |

### 监听

| Flag                        | 默认值                   | 描述                                                |
| :-------------------------- | :----------------------- | :-------------------------------------------------- |
| `--bind-address` value      | 0.0.0.0                  | k3s 绑定地址                                        |
| `--https-listen-port` value | 6443                     | HTTPS 监听端口                                      |
| `--advertise-address` value | node-external-ip/node-ip | apiserver 用来向集群成员发布的 IP 地址              |
| `--advertise-port` value    | 0                        | apiserver 用于通告集群成员的端口(默认: listen-port) |
| `--tls-san` value           | N/A                      | 在 TLS 证书中添加其他主机名或 IP 作为主题备用名称   |

### Data

| Flag                         | 默认值                                                                | 描述           |
| :--------------------------- | :-------------------------------------------------------------------- | :------------- |
| `--data-dir value, -d` value | `/var/lib/rancher/k3s` 或 `${HOME}/.rancher/k3s` 如果不是 root 用户） | 存放数据的目录 |

### 网络

| Flag                              | 默认值          | 描述                                                        |
| :-------------------------------- | :-------------- | :---------------------------------------------------------- |
| `--cluster-cidr` value            | "10.42.0.0/16"  | 用于 Pod IP 的网络 CIDR                                     |
| `--service-cidr` value            | "10.43.0.0/16"  | 用于 service IP 的网络 CIDR                                 |
| `--service-node-port-range` value | "30000-32767"   | 为具有 NodePort 可见性的服务保留的端口范围                  |
| `--cluster-dns` value             | "10.43.0.10"    | 用于 coredns 服务的集群 IP。应该在您的`service-cidr`范围内  |
| `--cluster-domain` value          | "cluster.local" | 集群域名                                                    |
| `--flannel-backend` value         | "vxlan"         | 'none', 'vxlan', 'ipsec', 'host-gw', 或 'wireguard'中的一个 |

### 定制标志

| Flag                                        | 描述                                              |
| :------------------------------------------ | :------------------------------------------------ |
| `--etcd-arg` value                          | 自定义 etcd 进程的参数。                          |
| `--kube-apiserver-arg` value                | 自定义 kube-apiserver 进程的参数。                |
| `--kube-scheduler-arg` value                | 自定义 kube-scheduler 进程的参数。                |
| `--kube-controller-manager-arg` value       | 自定义 kube-controller-manager 进程的参数。       |
| `--kube-cloud-controller-manager-arg` value | 自定义 kube-cloud-controller-manager 进程的参数。 |

### 存储类

| Flag                                 | 描述                     |
| :----------------------------------- | :----------------------- |
| `--default-local-storage-path` value | 本地存储类的默认存储路径 |

### Kubernetes 组件

| Flag                         | 描述                                                                                                         |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `--disable` value            | 不需要部署的组件，删除任何已部署的组件 (有效项目：coredns, servicelb, traefik,local-storage, metrics-server) |
| `--disable-scheduler`        | 禁用 Kubernetes 默认调度器                                                                                   |
| `--disable-cloud-controller` | 禁用 k3s 默认云控制管理器                                                                                    |
| `--disable-kube-proxy`       | 禁止运行 kube-proxy                                                                                          |
| `--disable-network-policy`   | 禁用 K3S 默认网络策略控制器                                                                                  |

### Kubernetes 进程定制标志

| Flag                     | 描述                         |
| :----------------------- | :--------------------------- |
| `--kubelet-arg` value    | 自定义 kubelet 进程的参数    |
| `--kube-proxy-arg` value | 自定义 kube-proxy 进程的参数 |

### 实验性选项

| Flag                       | 环境变量               | 描述                                            |
| :------------------------- | :--------------------- | :---------------------------------------------- | -------------- |
| `--rootless`               | N/A                    | 运行 rootless                                   | (experimental) |
| `--agent-token` value      | `K3S_AGENT_TOKEN`      | 用于将 agent 加入集群但不用于 server 的共享密钥 |
| `--agent-token-file` value | `K3S_AGENT_TOKEN_FILE` | 包含 agent secret 的文件                        |
| `--server value, -s` value | `K3S_URL`              | 要连接的 k3s server，用于加入集群               |
| `--cluster-init`           | `K3S_CLUSTER_INIT`     | 初始化为新的集群 master                         |
| `--cluster-reset`          | `K3S_CLUSTER_RESET`    | 忽略所有节点，成为一个新集群的集群 master       |
| `--secrets-encryption`     | N/A                    | 启用 Secret 加密                                |

### 废弃的选项

| Flag                     | 环境变量             | 描述                                                                                    |
| :----------------------- | :------------------- | :-------------------------------------------------------------------------------------- |
| `--no-flannel`           | N/A                  | 使用 --flannel-backend=none                                                             |
| `--no-deploy` value      | N/A                  | 不需要部署的组件 (有效选项: coredns, servicelb, traefik, local-storage, metrics-server) |
| `--cluster-secret` value | `K3S_CLUSTER_SECRET` | 使用 --token                                                                            |

## K3s Server CLI 帮助

> 如果一个选项出现在下面的括号里，例如`[$K3S_TOKEN]`，则意味着该选项可以作为该名称的环境变量传递进来。

```bash
NAME:
   k3s server - 运行K3s server

USAGE:
   k3s server [选项]

选项:
   --config FILE, -c FILE                     (config) 从FILE加载配置（默认："/etc/rancher/k3s/config.yaml" ） [$K3S_CONFIG_FILE]
   --debug                                    (logging) 开启debug调试日志 [$K3S_DEBUG]
   -v value                                   (logging) 日志级别详细程度的数字 (默认: 0)
   --vmodule value                            (logging) 以逗号分隔的pattern=N设置列表，用于文件过滤的日志记录
   --log value, -l value                      (logging) 记录到文件
   --alsologtostderr                          (logging) 记录到标准错误输出和文件（如果设置)
   --bind-address value                       (listener) k3s绑定地址 (默认: 0.0.0.0)
   --https-listen-port value                  (listener) HTTPS监听端口 (默认: 6443)
   --advertise-address value                  (listener) apiserver用来向集群成员发布的IP地址 (默认: node-external-ip/node-ip)
   --advertise-port value                     (listener) apiserver用于通告集群成员的端口 (默认: listen-port) (默认: 0)
   --tls-san value                            (listener) 在TLS证书中添加其他主机名或IP作为主题备用名称
   --data-dir value, -d value                 (data) 存放数据的目录 默认 /var/lib/rancher/k3s or ${HOME}/.rancher/k3s(如果不是root用户)
   --cluster-cidr value                       (networking) 用于Pod IP的网络CIDR (默认: "10.42.0.0/16")
   --service-cidr value                       (networking) 用于service IP的网络CIDR (默认: "10.43.0.0/16")
   --service-node-port-range value            (networking) 为具有 NodePort 可见性的服务保留的端口范围 (默认: "30000-32767")
   --cluster-dns value                        (networking) 用于coredns服务的集群IP。应该在您的`service-cidr`范围内 (默认: 10.43.0.10)
   --cluster-domain value                     (networking) 集群域名 (默认: "cluster.local")
   --flannel-backend value                    (networking) 'none', 'vxlan', 'ipsec', 'host-gw', 或 'wireguard'中的一个 (默认: "vxlan")
   --token value, -t value                    (cluster) 用于将server或agent加入集群的共享secret。 [$K3S_TOKEN]
   --token-file value                         (cluster) 包含cluster-secret/token的文件 [$K3S_TOKEN_FILE]
   --write-kubeconfig value, -o value         (client) 将管理客户端的kubeconfig写入这个文件。 [$K3S_KUBECONFIG_OUTPUT]
   --write-kubeconfig-mode value              (client) 用这种模式编写kubeconfig，例如：644 [$K3S_KUBECONFIG_MODE]
   --etcd-arg value                           (flags) 自定义etcd进程的参数
   --kube-apiserver-arg value                 (flags) 自定义kube-apiserver进程的参数
   --kube-scheduler-arg value                 (flags) 自定义kube-scheduler进程的参数
   --kube-controller-manager-arg value        (flags) 自定义kube-controller-manager进程的参数
   --kube-cloud-controller-manager-arg value  (flags) 自定义kube-cloud-controller-manager进程的参数
   --datastore-endpoint value                 (db) 指定 etcd、Mysql、Postgres 或 Sqlite（默认）数据源名称 [$K3S_DATASTORE_ENDPOINT]
   --datastore-cafile value                   (db) TLS证书授权文件，用于确保数据存储后端通信的安全 [$K3S_DATASTORE_CAFILE]
   --datastore-certfile value                 (db) TLS认证文件，用于确保数据存储后端通信的安全 [$K3S_DATASTORE_CERTFILE]
   --datastore-keyfile value                  (db) 用于保护数据存储后端通信的TLS密钥文件 [$K3S_DATASTORE_KEYFILE]
   --etcd-expose-metrics                      (db) 将 etcd 指标公开给客户端界面。(默认为 false)
   --etcd-disable-snapshots                   (db) 禁用自动 etcd 快照
   --etcd-snapshot-name value                 (db) 设置 etcd 快照的基本名称。默认值: etcd-snapshot
   --etcd-snapshot-schedule-cron value        (db) cron 规范中的快照间隔时间。 例如。每 5 小时 "\* \*/5 \* \* \*" (默认值: "0 \*/12 \* \* \*")
   --etcd-snapshot-retention value            (db) 要保留的快照数量 (默认值: 5)
   --etcd-snapshot-dir value                  (db) 保存数据库快照的目录. (默认 location: ${data-dir}/db/snapshots)
   --etcd-s3                                  (db) 启用备份到 S3
   --etcd-s3-endpoint value                   (db) S3 endpoint url (默认值: "s3.amazonaws.com")
   --etcd-s3-endpoint-ca value                (db) S3 自定义 CA 证书连接到 S3 endpoint
   --etcd-s3-skip-ssl-verify                  (db) 禁用 S3 的 SSL 证书验证
   --etcd-s3-access-key value                 (db) S3 access key [$AWS_ACCESS_KEY_ID]
   --etcd-s3-secret-key value                 (db) S3 secret key [$AWS_SECRET_ACCESS_KEY]
   --etcd-s3-bucket value                     (db) S3 bucket 名称
   --etcd-s3-region value                     (db) S3 region / bucket 位置 (可选) 默认值: "us-east-1")
   --etcd-s3-folder value                     (db) S3 文件夹
   --default-local-storage-path value         (storage) 本地存储类的默认存储路径
   --disable value                            (components) 不需要部署的组件，删除任何已部署的组件 (有效项目：coredns, servicelb, traefik,local-storage, metrics-server)
   --disable-scheduler                        (components) 禁用Kubernetes默认调度器
   --disable-cloud-controller                 (components) 禁用k3s默认云控制管理器
   --disable-kube-proxy                       (components) 禁止运行 kube-proxy
   --disable-network-policy                   (components) 用K3S默认网络策略控制器
   --node-name value                          (agent/node) 节点名称 [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) 将ID附加到节点名称
   --node-label value                         (agent/node) 用一组标签注册和启动kubelet
   --node-taint value                         (agent/node) 用一组污点注册kubelet
   --image-credential-provider-bin-dir value  (agent/node) 凭证提供程序插件二进制文件所在目录的路径（默认："/var/lib/rancher/credentialprovider/bin"）
   --image-credential-provider-config value   (agent/node) 凭证提供者插件配置文件的路径 (默认： "/var/lib/rancher/credentialprovider/config.yaml")
   --docker                                   (agent/runtime) 用docker代替containerd
   --container-runtime-endpoint value         (agent/runtime) 禁用嵌入式containerd，使用替代的CRI实现
   --pause-image value                        (agent/runtime) 针对containerd或Docker的自定义pause镜像 (默认: "docker.io/rancher/pause:3.1")
   --snapshotter value                        (agent/runtime) 覆盖默认的 containerd 快照程序 (默认: "overlayfs")
   --private-registry value                   (agent/runtime) 私有镜像仓库配置文件 (默认: "/etc/rancher/k3s/registries.yaml")
   --node-ip value, -i value                  (agent/networking) 为节点发布的IP地址
   --node-external-ip value                   (agent/networking) 对外发布节点的IP地址
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf 文件 [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) 覆盖默认的flannel接口
   --flannel-conf value                       (agent/networking) 覆盖默认的flannel文件
   --kubelet-arg value                        (agent/flags) 自定义kubelet进程的参数
   --kube-proxy-arg value                     (agent/flags) 自定义kube-proxy进程的参数
   --protect-kernel-defaults                  (agent/node) 内核调优行为。如果设置，如果内核可调参数与 kubelet 默认值不同，则会出错。
   --rootless                                 (experimental) 运行 rootless
   --agent-token value                        (experimental/cluster) 用于将agent加入集群但不用于server的共享密钥 [$K3S_AGENT_TOKEN]
   --agent-token-file value                   (experimental/cluster) 包含agent secret的文件 [$K3S_AGENT_TOKEN_FILE]
   --server value, -s value                   (experimental/cluster) 要连接的k3s server，用于加入集群 [$K3S_URL]
   --cluster-init                             (experimental/cluster) 初始化为新的集群master [$K3S_CLUSTER_INIT]
   --cluster-reset                            (experimental/cluster) 忽略所有节点，成为一个新集群的集群master [$K3S_CLUSTER_RESET]
   --cluster-reset-restore-path value         (db) 要恢复的快照文件的路径
   --secrets-encryption                       (experimental) 启用Secret加密
   --system-default-registry value            (image) 用于所有系统镜像的私有注册表 [$K3S_SYSTEM_DEFAULT_REGISTRY]
   --selinux                                  (agent/node) 在 containerd 中启用 SELinux [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) 客户端负载均衡器的本地端口。如果 supervisor 和 apiserver 不在同一个主机，则 apiserver 客户端负载均衡器也将使用比该端口小 1 的额外端口。(默认：6444) [$K3S_LB_SERVER_PORT]
   --no-flannel                               (deprecated) 使用 --flannel-backend=none
   --no-deploy value                          (deprecated) 不需要部署的组件 (有效选项: coredns, servicelb, traefik, local-storage, metrics-server)
   --cluster-secret value                     (deprecated) 使用 --token [$K3S_CLUSTER_SECRET]
```
