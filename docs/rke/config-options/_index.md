---
title: Kubernetes 配置选项
---

编辑 RKE 的`cluster.yml`文件时，您可以在文件中配置多种不同的选项，控制 RKE 如何启动 Kubernetes。

为了让用户对如何使用`cluster.yml`文件配置 Kubernetes 选项有更好的了解，RKE 提供了几个 yaml 示例，详情请参考[yaml 示例]({{<baseurl>}}/rke/latest/en/example-yamls/)。

### 配置节点选项

- [Nodes](/docs/rke/config-options/nodes/_index)
- [Ignoring unsupported Docker versions](#支持的-Docker-版本)
- [Private Registries](/docs/rke/config-options/private-registries/_index)
- [Cluster Level SSH Key Path](#cluster-level-ssh-key-path)
- [SSH Agent](#ssh-agent)
- [Bastion Host](/docs/rke/config-options/bastion-host/_index)

### 配置 Kubernetes 集群选项

- [Cluster Name](#集群名称)
- [Kubernetes Version](#Kubernetes-版本)
- [Prefix Path](#前缀路径)
- [System Images](/docs/rke/config-options/system-images/_index)
- [Services](/docs/rke/config-options/services/_index)
- [Extra Args and Binds and Environment Variables](/docs/rke/config-options/services/services-extras/_index)
- [External Etcd](/docs/rke/config-options/services/external-etcd/_index)
- [Authentication](/docs/rke/config-options/authentication/_index)
- [Authorization](/docs/rke/config-options/authorization/_index)
- [Rate Limiting](/docs/rke/config-options/rate-limiting/_index)
- [Cloud Providers](/docs/rke/config-options/cloud-providers/_index)
- [Audit Log](/docs/rke/config-options/audit-log/_index)
- [Add-ons](/docs/rke/config-options/add-ons/_index)
  - [Network Plug-ins](/docs/rke/config-options/add-ons/network-plugins/_index)
  - [DNS providers](/docs/rke/config-options/add-ons/dns/_index)
  - [Ingress Controllers](/docs/rke/config-options/add-ons/ingress-controllers/_index)
  - [Metrics Server](/docs/rke/config-options/add-ons/metrics-server/_index)
  - [User-Defined Add-ons](/docs/rke/config-options/add-ons/user-defined-add-ons/_index)
  - [Add-ons Job Timeout](#插件-job-超时)

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

RKE 使用`ssh`连接到主机。通常情况下，每个节点都会在`nodes`部分为每个 ssh 密钥设置一个独立的路径，即 `ssh_key_path`，但如果你在集群配置文件中拥有一个能够访问**所有**主机的 SSH 密钥，你可以在顶层设置该 ssh 密钥的路径。否则，你会在[nodes](/docs/rke/config-options/nodes/_index)中设置 ssh 密钥路径。

如果在集群级和节点级都定义了 ssh 密钥路径，那么 RKE 会优先使用节点层级的密钥。

```yaml
ssh_key_path: ~/.ssh/test
```

### SSH Agent

RKE 支持使用本地 ssh 代理的 ssh 连接配置。这个选项的默认值是 `false`，如果你想设置使用本地 ssh 代理，请打开`cluster.yml`文件，找到`ssh_agent_auth`一栏，将默认值修改为`true`，如下方代码样例所示。

```yaml
ssh_agent_auth: true
```

如果你想使用带有口令的 SSH 私钥，你需要将你的密钥添加到`ssh-agent`中，并配置环境变量`SSH_AUTH_SOCK`。

```
$ eval "$(ssh-agent -s)"
Agent pid 3975
$ ssh-add /home/user/.ssh/id_rsa
Enter passphrase for /home/user/.ssh/id_rsa:
Identity added: /home/user/.ssh/id_rsa (/home/user/.ssh/id_rsa)
$ echo $SSH_AUTH_SOCK
/tmp/ssh-118TMqxrXsEx/agent.3974
```

### 插件 job 连接超时

你可以定义 RKE 插件及其连接超时的时间，在 Kubernetes 集群成功运行后，RKE 以 Kubernetes [job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)的形式运行插件。如果连接超时，RKE 将停止尝试检索 job 状态，超时的单位是秒。默认超时值为`30`秒。
