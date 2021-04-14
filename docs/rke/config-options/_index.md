---
title: Kubernetes 配置选项
description: 编辑 RKE 的`cluster.yml`文件时，您可以在文件中配置多种不同的选项，控制 RKE 如何启动 Kubernetes。
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
  - RKE
  - 配置选项
  - Kubernetes 配置选项
---

编辑 RKE 的`cluster.yml`文件时，您可以在文件中配置多种不同的选项，控制 RKE 如何启动 Kubernetes。

为了让用户对如何使用`cluster.yml`文件配置 Kubernetes 选项有更好的了解，RKE 提供了几个 yaml 示例，详情请参考[yaml 示例](/docs/rke/example-yamls/_index)。

### 配置节点选项

- [节点选项配置](/docs/rke/config-options/nodes/_index)
- [检查 Docker 版本](#支持的-Docker-版本)
- [私有镜像仓库](/docs/rke/config-options/private-registries/_index)
- [集群级 SSH 密钥路径](#集群级-SSH-密钥路径)
- [SSH Agent](#ssh-agent)
- [堡垒机配置](/docs/rke/config-options/bastion-host/_index)

### 配置 Kubernetes 集群选项

- [集群名称](#集群名称)
- [Kubernetes 版本](#Kubernetes-版本)
- [前缀路径](#前缀路径)
- [系统镜像](/docs/rke/config-options/system-images/_index)
- [默认的 Kubernetes 服务](/docs/rke/config-options/services/_index)
- [自定义参数、Docker 挂载绑定和额外的环境变量](/docs/rke/config-options/services/services-extras/_index)
- [外部 etcd](/docs/rke/config-options/services/external-etcd/_index)
- [认证方式](/docs/rke/config-options/authentication/_index)
- [授权](/docs/rke/config-options/authorization/_index)
- [配置事件速率限制](/docs/rke/config-options/rate-limiting/_index)
- [云服务提供商](/docs/rke/config-options/cloud-providers/_index)
- [审计日志](/docs/rke/config-options/audit-log/_index)
- [RKE 插件](/docs/rke/config-options/add-ons/_index)
  - [网络插件](/docs/rke/config-options/add-ons/network-plugins/_index)
  - [DNS 提供商](/docs/rke/config-options/add-ons/dns/_index)
  - [Ingress Controllers](/docs/rke/config-options/add-ons/ingress-controllers/_index)
  - [Metrics Server 插件](/docs/rke/config-options/add-ons/metrics-server/_index)
  - [自定义插件](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)
  - [插件 job 连接超时](#插件-job-超时)

## 集群层级选项

### 集群名称

默认情况下，您的集群名称是`local`。如果您需要修改集群名称，请打开`cluster.yml`文件，找到`cluster_name`一栏，修改集群名称。以下代码示例省略了`cluster.yaml`文件中的其他参数，展示了如何将集群名称修改为`mycluster`。

```yaml
cluster_name: mycluster
```

### 检查 Docker 版本

默认情况下，RKE 会检查所有主机上已安装的 Docker 的版本号，如果 Kubernetes 不支持该版本的 Docker，会导致 RKE 运行失败并且报错。请参考[RKE 支持的 Docker 版本](https://github.com/rancher/rke/blob/master/docker/docker.go#L37-L41)，找到您正在使用的 RKE 版本、它支持的 Docker 版本号和 Kubernetes 版本号。如果您不希望在运行 RKE 之前检查 Docker 版本号，您可以打开`cluster.yml`文件，找到`ignore_docker_version`一栏，并将它的值设定为`true`。`ignore_docker_version`是一个 boolean 类型的参数，表示在运行 RKE 前是否执行 Docker 版本检测，可选值为`true`和`false`，默认值为`false`。以下代码示例省略了`cluster.yaml`文件中的其他参数，展示了如何将`ignore_docker_version`的值修改为`true`。修改后不会在运行 RKE 前检查所有主机的 Docker 版本号。

```yaml
ignore_docker_version: true
```

### Kubernetes 版本

打开`cluster.yml`文件，找到 `kubernetes_version`字符串，将原有的版本号修改为新的版本号即可。详情请参考[升级必读](/docs/rke/upgrades/_index)。

RKE 目前不支持回滚 Kubernetes 版本。

### 前缀路径

RKE 将 ROS、CoreOS 等操作系统的相关资源存储在不同的前缀路径下。默认情况下，RKE 存储这些资源时会添加一个前缀：`/opt/rke`。

例如，已有的`/etc/kubernetes`最终的存储路径是`/opt/rke/etc/kubernetes`，`/var/lib/etcd`最终的存储路径是`/opt/rke/var/lib/etcd`。

如果您需要修改默认的存储路径，请打开`cluster.yml`文件，找到`prefix_path`一栏，将已有的存储路径修改为您想要的路径，如下方代码样例所示。

```yaml
prefix_path: /opt/custom_path
```

### 集群级 SSH 密钥路径

RKE 使用`ssh`连接到主机。通常情况下，每个节点都会在`nodes`部分为每个 ssh 密钥设置一个独立的路径，即 `ssh_key_path`，但如果您在集群配置文件中拥有一个能够访问**所有**主机的 SSH 密钥，您可以在顶层设置该 ssh 密钥的路径。否则，您会在[nodes](/docs/rke/config-options/nodes/_index)中设置 ssh 密钥路径。

如果在集群级和节点级都定义了 ssh 密钥路径，那么 RKE 会优先使用节点层级的密钥。

```yaml
ssh_key_path: ~/.ssh/test
```

### SSH Agent

RKE 支持使用本地 ssh 代理的 ssh 连接配置。这个选项的默认值是 `false`，如果您想设置使用本地 ssh 代理，请打开`cluster.yml`文件，找到`ssh_agent_auth`一栏，将默认值修改为`true`，如下方代码样例所示。

```yaml
ssh_agent_auth: true
```

如果您想使用带有口令的 SSH 私钥，您需要将您的密钥添加到`ssh-agent`中，并配置环境变量`SSH_AUTH_SOCK`。

```shell
eval "$(ssh-agent -s)"
Agent pid 3975
$ ssh-add /home/user/.ssh/id_rsa
Enter passphrase for /home/user/.ssh/id_rsa:
Identity added: /home/user/.ssh/id_rsa (/home/user/.ssh/id_rsa)
$ echo $SSH_AUTH_SOCK
/tmp/ssh-118TMqxrXsEx/agent.3974
```

### 插件 job 连接超时

您可以定义 RKE 插件及其连接超时的时间，在 Kubernetes 集群成功运行后，RKE 以 Kubernetes [job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)的形式运行插件。如果连接超时，RKE 将停止尝试检索 job 状态，超时的单位是秒。默认超时值为`30`秒。
