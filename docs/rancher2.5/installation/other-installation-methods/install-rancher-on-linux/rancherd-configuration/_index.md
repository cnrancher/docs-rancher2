---
title: RancherD配置参考
description: 在 RancherD 中，服务器节点被定义为运行`rancherd server`命令的机器（裸机或虚拟）。服务器运行 Kubernetes API 以及 Kubernetes 工作负载。agent 节点被定义为运行`rancherd agent`命令的机器。它们不运行 Kubernetes API。要添加指定运行您的应用程序和服务的节点，请将代理节点加入到您的集群中。在 RancherD 安装说明中，我们建议在 Rancher 服务器集群中运行三个服务器节点。代理节点不是必需的。
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
  - 在Linux操作系统上安装Rancher
  - RancherD配置参考
---

## 概述

在 RancherD 中，服务器节点被定义为运行`rancherd server`命令的机器（裸机或虚拟）。服务器运行 Kubernetes API 以及 Kubernetes 工作负载。

agent 节点被定义为运行`rancherd agent`命令的机器。它们不运行 Kubernetes API。要添加指定运行您的应用程序和服务的节点，请将代理节点加入到您的集群中。

在 RancherD 安装说明中，我们建议在 Rancher 服务器集群中运行三个服务器节点。代理节点不是必需的。

## Certificates for the Rancher Server

Rancherd 不使用 cert-manger 来提供证书。相反，RancherD 允许您通过将`.pem` 文件存储在`/etc/rancher/ssl/`中，自带自签或可信的证书。当这样做的时候，你也应该在 HelmChartConfig 中把`publicCA`参数设置为`true`。关于 HelmChartConfig 的更多信息，请参考自定义 RancherD Helm Chart 一节。

私钥：`/etc/rancher/ssl/key.pem`。

证书：`/etc/rancher/ssl/cert.pem`。

CA 证书(自签)：`/etc/rancher/ssl/cacerts.pem`。

附加 CA 证书：`/etc/ssl/certs/ca-additional.pem`。

## 节点污染容忍度

默认情况下，服务器节点是可调度的，因此你的工作负载可以在它们上得到启动。如果你希望有一个专用的控制平面，在这个平面上不运行用户工作负载，你可以使用污点，node-taint 参数将允许你配置带有污点的节点。下面是一个在`config.yaml`中添加节点污点的例子：

```
node-taint:
  - "CriticalAddonsOnly=true:NoExecute"
```

## 自定义 RancherD Helm Chart

Rancher 是作为一个[Helm](https://helm.sh/)Chart 启动的，使用集群的[Helm 集成](https://docs.rke2.io/helm/)。这意味着你可以通过一个描述你的自定义参数的 manifest 文件轻松地定制应用程序。

RancherD Chart 在守护进程中提供了 Rancher。它将主机端口`8080/8443`公开到容器端口（`80/443`），如果需要的话，使用 hostpath 来挂载 certs。

RancherD 使用`helm-controller`来引导 RancherD Chart。要提供一个自定义的`values.yaml`文件，必须通过`helm-controller`自定义资源定义来传递配置选项。

下面是一个例子：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rancher
  namespace: kube-system
spec:
  valuesContent: |
    publicCA: true
```

在运行 RancherD 之前，把这个清单放在你的主机上的`/var/lib/rancher/rke2/server/manifests`中。

## 常用参数选项和解释

| 参数                     | 默认值                                                | 描述                                                                                                                    |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `addLocal`               | "auto"                                                | **_string_** - 让 Rancher 检测并[导入本地集群](/docs/rancher2.5/installation/resources/chart-options/_index)            |
| `auditLog.destination`   | "sidecar"                                             | **_string_** - 流到 sidecar 容器控制台或 hostPath 卷 - _"sidecar, hostPath"_。                                          |
| `auditLog.hostPath`      | "/var/log/rancher/audit"                              | **_string_** - 主机上的日志文件目的地（只有当**auditLog.destination**被设置为**hostPath**时才会适用）                   |
| `auditLog.level`         | 0                                                     | **_int_** - 设置[API 审核日志级别](/docs/rancher2.5/installation/resources/advanced/api-audit-log/_index/)。0 为关闭。[0-3] |
| `auditLog.maxAge`        | 1                                                     | **_int_** - 保留旧审计日志文件的最大天数（仅在**auditLog.destination**设置为**hostPath**时才适用）                      |
| `auditLog.maxBackup`     | 1                                                     | int - 保留审计日志文件的最大数量（仅当**auditLog.destination**设置为**hostPath**时适用）。                              |
| `auditLog.maxSize`       | 100                                                   | **_int_** - 审计日志文件在被替换之前的最大大小（仅当**auditLog.destination**被设置为**hostPath**时适用）。              |
| `debug`                  | false                                                 | **_bool_** - 在 rancher 服务器上设置调试标志                                                                            |
| `extraEnv`               | []                                                    | **_list_** - 为 Rancher 设置额外的环境变量，从 v2.20 开始提供。                                                         |
| `imagePullSecrets`       | []                                                    | **_list_** - 包含私人镜像仓库的证书的资源名称清单                                                                       |
| `proxy`                  | " "                                                   | **\*string** - Rancher 的 HTTP[S]代理服务器                                                                             |
| `noProxy`                | "127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16" | **_string_** - 逗号分隔的主机名或 IP 地址列表，不使用代理。                                                             |
| `resources`              | {}                                                    | **_map_** - Rancher Pod 资源申请和限额                                                                                  |
| `rancherImage`           | "rancher/rancher"                                     | **_string_** - Rancher 镜像源                                                                                           |
| `rancherImageTag`        | same as chart version                                 | **_string_** - rancher/ranche 镜像标签                                                                                  |
| `rancherImagePullPolicy` | "IfNotPresent"                                        | **_string_** - 镜像拉取策略- _"Always", "Never", "IfNotPresent"_                                                        |
| `systemDefaultRegistry`  | ""                                                    | **_string_** - 用于所有系统 Docker 镜像的私有镜像仓库，例如，[http://registry.example.com/] _从 v2.3.0 开始提供_。      |
| `useBundledSystemChart`  | false                                                 | **_bool_** - 选择使用 Rancher 服务器打包的系统图。此选项用于离线安装。_从 v2.3.0 开始提供_。                            |
| `publicCA`               | false                                                 | **_bool_** - 如果你的证书是由公共 CA 签署的，则设置为 true。                                                            |

## RancherD Server CLI 参数选项和解释

运行 Rancher 管理服务器的命令是：

```
rancherd server [OPTIONS]
```

它可以通过以下选项运行：

### Config

| 选项                     | 描述                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `--config FILE, -c FILE` | 从 FILE 加载配置（默认："/etc/rancher/rke2/config.yaml"）。 |

### 日志

| 选项      | 描述         |
| --------- | ------------ |
| `--debug` | 开启调试日志 |

### 监听

| 选项                        | 描述                                                                       |
| --------------------------- | -------------------------------------------------------------------------- |
| `--bind-address value`      | RancherD 绑定地址（默认：0.0.0.0）。                                       |
| `--advertise-address value` | apiserver 用来向集群成员发布广告的 IP 地址（默认：节点-外部-ip/节点-ip）。 |
| `--tls-san value`           | 在 TLS 证书中添加额外的主机名或 IP 作为主题替代名。                        |

### 数据

| 选项                         | 描述                                                    |
| ---------------------------- | ------------------------------------------------------- |
| `--data-dir value, -d value` | 保存状态的文件夹（默认："/var/lib/rancher/rancherd"）。 |

### 网络

| 选项                     | 描述                                                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `--cluster-cidr value`   | 用于 pod IP 的网络 CIDR（默认："10.42.0.0/16"）。                                                                           |
| `--service-cidr value`   | 服务 IP 使用的网络 CIDR（默认："10.43.0.0/16"）。                                                                           |
| `--cluster-dns value`    | coredns 服务的集群 IP，应该在您的 service-cidr 范围内（默认：10.43.0.10）。应该在你的 service-cidr 范围内(默认：10.43.0.10) |
| `--cluster-domain value` | 集群域（默认："cluster.local"）。                                                                                           |

### 集群

| 选项                      | 描述                                   |
| ------------------------- | -------------------------------------- |
| `--token value, -t value` | 用于将服务器或代理加入集群的共享密钥。 |
| `--token-file value`      | 包含集群密钥或 token 的文件            |

### Client

| 选项                                 | 描述                                     |
| ------------------------------------ | ---------------------------------------- |
| `--write-kubeconfig value, -o value` | 将管理客户端的 kubeconfig 写入这个文件。 |
| `--write-kubeconfig-mode value`      | 用这种模式编写 kubeconfig                |

### Flags

| 选项                                  | 描述                                        |
| ------------------------------------- | ------------------------------------------- |
| `--kube-apiserver-arg value`          | 自定义 kube-apiserver 进程的标志。          |
| `--kube-scheduler-arg value`          | 自定义 kube-scheduler 进程的标志。          |
| `--kube-controller-manager-arg value` | 自定义 kube-controller-manager 进程的标志。 |

### 数据库

| 选项                                  | 描述                                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `--etcd-disable-snapshots`            | 禁用自动 etcd 快照                                                                     |
| `--etcd-snapshot-schedule-cron value` | 在 cron 规范中的快照间隔时间，例如：每 5 小时'\* _/5 _ \* _'（默认："0 _/12 \* \*"）。 |
| `--etcd-snapshot-retention value`     | 要保留的快照数量（默认：5）。                                                          |
| `--etcd-snapshot-dir value`           | 保存数据库快照的目录。(默认位置：${data-dir}/db/Snapshots)                             |
| `--cluster-reset-restore-path value`  | 要恢复的快照文件的路径                                                                 |

### 系统镜像仓库

| 选项                              | 描述                                 |
| --------------------------------- | ------------------------------------ |
| `--system-default-registry value` | 用于所有系统 Docker 镜像的私有仓库。 |

### 组件

| 选项              | 描述                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disable value` | 不要部署打包的组件和删除任何已部署的组件（有效项目：rancherd-canal, rancherd-coredns, rancherd-ingress, rancherd-kube-proxy, rancherd-metrics-server）。 |

### 云服务提供商

| 选项                            | 描述                 |
| ------------------------------- | -------------------- |
| `--cloud-provider-name value`   | 云供应商名称         |
| `--cloud-provider-config value` | 云提供商配置文件路径 |

### 安全

| 选项              | 描述                                          |
| ----------------- | --------------------------------------------- |
| `--profile value` | 根据选定的基准验证系统配置(有效项目：cis-1.5) |

### Agent 节点

| 选项                        | 描述                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--node-name value`         | 节点名称                                                                                                                 |
| `--node-label value`        | 用一组标签注册和启动 kubelet。                                                                                           |
| `--node-taint value`        | 用一组污点注册 kubelet。                                                                                                 |
| `--protect-kernel-defaults` | 内核调优行为，如果设置，当内核调优与 kubelet 默认值不同时出错。如果设置，如果内核可调性与 kubelet 默认值不同，则会出错。 |
| `--selinux`                 | 在容器中启用 SELinux                                                                                                     |

### Agent Runtime

| 选项                                 | 描述                                                                |
| ------------------------------------ | ------------------------------------------------------------------- |
| `--container-runtime-endpoint value` | 禁用嵌入式容器，使用替代的 CRI 实现。                               |
| `--snapshotter value`                | 覆盖默认的容器 d snapshotter（默认："overlayfs"）。                 |
| `--private-registry value`           | 私有镜像仓库配置文件（默认："/etc/rancher/rke2/registries.yaml"）。 |

### Agent 网络

| 选项                        | 描述                          |
| --------------------------- | ----------------------------- |
| `--node-ip value, -i value` | 要为节点 advertise 的 IP 地址 |
| `--resolv-conf value`       | Kubelet resolv.conf 文件      |

### Agent Flags

| 选项                     | 描述                           |
| ------------------------ | ------------------------------ |
| `--kubelet-arg value`    | 为 kubelet-arg 进程自定义标志  |
| `--kube-proxy-arg value` | 自定义 kube-proxy 进程的标志。 |

### 实验性功能

| 选项                       | 描述                                           |
| -------------------------- | ---------------------------------------------- |
| `--agent-token value`      | 用于将代理连接到集群的共享密钥，但不是服务器。 |
| `--agent-token-file value` | 含有 agent 密钥的文件                          |
| `--server value, -s value` | 连接到的服务器，用于加入集群。                 |
| `--cluster-reset`          | 忘记所有同行，成为新集群的唯一成员。           |
| `--secrets-encryption`     | 启用静止状态下的密钥加密                       |

## RancherD Agent CLI Options

以下命令用于运行 RancherD Agent：

```
rancherd agent [OPTIONS]
```

有以下选项：

### Config

| 选项                     | 描述                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `--config FILE, -c FILE` | 从 FILE 加载配置（默认："/etc/rancher/rke2/config.yaml"）。 |

### 数据

| 选项                         | 描述                                                    |
| ---------------------------- | ------------------------------------------------------- |
| `--data-dir value, -d value` | 保存状态的文件夹（默认："/var/lib/rancher/rancherd"）。 |

### 日志

| 选项      | 描述         |
| --------- | ------------ |
| `--debug` | 开启调试日志 |

### 集群

| 选项                      | 描述                                   |
| ------------------------- | -------------------------------------- |
| `--token value, -t value` | 用于将服务器或代理加入集群的共享密钥。 |
| `--token-file value`      | 包含集群密钥或 token 的文件            |

### Agent 节点

| 选项                        | 描述                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--node-name value`         | 节点名称                                                                                                                 |
| `--node-label value`        | 用一组标签注册和启动 kubelet。                                                                                           |
| `--node-taint value`        | 用一组污点注册 kubelet。                                                                                                 |
| `--protect-kernel-defaults` | 内核调优行为，如果设置，当内核调优与 kubelet 默认值不同时出错。如果设置，如果内核可调性与 kubelet 默认值不同，则会出错。 |
| `--selinux`                 | 在容器中启用 SELinux                                                                                                     |

### Agent Runtime

| 选项                                 | 描述                                                                |
| ------------------------------------ | ------------------------------------------------------------------- |
| `--container-runtime-endpoint value` | 禁用嵌入式容器，使用替代的 CRI 实现。                               |
| `--snapshotter value`                | 覆盖默认的容器 d snapshotter（默认："overlayfs"）。                 |
| `--private-registry value`           | 私有镜像仓库配置文件（默认："/etc/rancher/rke2/registries.yaml"）。 |

### Agent 网络

| 选项                        | 描述                          |
| --------------------------- | ----------------------------- |
| `--node-ip value, -i value` | 要为节点 advertise 的 IP 地址 |
| `--resolv-conf value`       | Kubelet resolv.conf 文件      |

### Agent Flags

| 选项                     | 描述                           |
| ------------------------ | ------------------------------ |
| `--kubelet-arg value`    | 为 kubelet-arg 进程自定义标志  |
| `--kube-proxy-arg value` | 自定义 kube-proxy 进程的标志。 |

### 系统镜像仓库

| 选项                              | 描述                                 |
| --------------------------------- | ------------------------------------ |
| `--system-default-registry value` | 用于所有系统 Docker 镜像的私有仓库。 |

### 云服务提供商

| 选项                            | 描述                 |
| ------------------------------- | -------------------- |
| `--cloud-provider-name value`   | 云供应商名称         |
| `--cloud-provider-config value` | 云提供商配置文件路径 |

### 安全

| 选项              | 描述                                          |
| ----------------- | --------------------------------------------- |
| `--profile value` | 根据选定的基准验证系统配置(有效项目：cis-1.5) |
