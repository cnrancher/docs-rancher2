---
title: "高级选项和配置"
description: 本节包含一些高级信息，描述了你可以运行和管理 K3s 的不同方式
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
  - 高级选项和配置
---

本节包含一些高级信息，描述了你可以运行和管理 K3s 的不同方式：

- [证书轮换](#证书轮换)
- [自动部署清单](#自动部署清单)
- [使用 Docker 作为容器运行时](#使用-docker-作为容器运行时)
- [使用 etcdctl](#使用-etcdctl)
- [配置 containerd](#配置-containerd)
- [使用 Rootless 运行 K3s (实验)](#使用-rootless-运行-k3s-实验)
- [节点标签和污点](#节点标签和污点)
- [使用安装脚本启动 server 节点](#使用安装脚本启动-server-节点)
- [Alpine Linux 安装的额外准备工作](#alpine-linux-安装的额外准备工作)
- [运行 K3d（Docker 中的 K3s）和 docker-compose](#运行-k3d（docker-中的-k3s）和-docker-compose)
- [在 Raspbian Buster 上启用旧版的 iptables](#在-raspbian-buster-上启用旧版的-iptables)
- [为 Raspbian Buster 启用 cgroup](#为-raspbian-buster-启用-cgroup)
- [SELinux 支持](#selinux-支持)
- [Red Hat 和 CentOS 的额外准备](#red-hat-和-centos-的额外准备)
- [启用 eStargz 的延迟拉取（实验性）](#启用-estargz-的延迟拉取（实验性）)
- [其他日志源](#additional-logging-sources)
- [Server 和 agent tokens](#server-和-agent-token)

## 证书轮换

默认情况下，K3s 的证书在 12 个月内过期。

如果证书已经过期或剩余的时间不足 90 天，则在 K3s 重启时轮换证书。

## 自动部署清单

在`/var/lib/rancher/k3s/server/manifests`中找到的任何文件都会以类似`kubectl apply`的方式自动部署到 Kubernetes，在启动和在磁盘上更改文件时都是如此。从该目录中删除文件不会从集群中删除相应的资源。

关于部署 Helm charts 的信息，请参阅[Helm](../helm/_index)章节。

## 使用 Docker 作为容器运行时

K3s 包含并默认为[containerd](https://containerd.io/)， 一个行业标准的容器运行时。

要使用 Docker 而不是 containerd,

1. 在 K3s 节点上安装 Docker。可以使用 Rancher 的一个[Docker 安装脚本](https://github.com/rancher/install-docker)来安装 Docker：

   ```
   curl https://releases.rancher.com/install-docker/19.03.sh | sh
   ```

1. 使用`--docker`选项安装 K3s：

   ```
   curl -sfL https://get.k3s.io | sh -s - --docker
   ```

   :::tip 提示
   国内用户，可以使用以下方法加速安装：

   ```
   curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - --docker
   ```

   :::

1. 确认集群可用：

   ```
   $ sudo k3s kubectl get pods --all-namespaces
   NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
   kube-system   local-path-provisioner-6d59f47c7-lncxn   1/1     Running     0          51s
   kube-system   metrics-server-7566d596c8-9tnck          1/1     Running     0          51s
   kube-system   helm-install-traefik-mbkn9               0/1     Completed   1          51s
   kube-system   coredns-8655855d6-rtbnb                  1/1     Running     0          51s
   kube-system   svclb-traefik-jbmvl                      2/2     Running     0          43s
   kube-system   traefik-758cd5fc85-2wz97                 1/1     Running     0          43s
   ```

1. 确认 Docker 容器正在运行：

   ```
   $ sudo docker ps
   CONTAINER ID        IMAGE                     COMMAND                  CREATED              STATUS              PORTS               NAMES
   3e4d34729602        897ce3c5fc8f              "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-443_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   bffdc9d7a65f        rancher/klipper-lb        "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-80_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   436b85c5e38d        rancher/library-traefik   "/traefik --configfi…"   About a minute ago   Up About a minute                       k8s_traefik_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
   de8fded06188        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   7c6a30aeeb2f        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
   ae6c58cab4a7        9d12f9848b99              "local-path-provisio…"   About a minute ago   Up About a minute                       k8s_local-path-provisioner_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
   be1450e1a11e        9dd718864ce6              "/metrics-server"        About a minute ago   Up About a minute                       k8s_metrics-server_metrics-server-7566d596c8-9tnck_kube-system_031e74b5-e9ef-47ef-a88d-fbf3f726cbc6_0
   4454d14e4d3f        c4d3d16fe508              "/coredns -conf /etc…"   About a minute ago   Up About a minute                       k8s_coredns_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
   c3675b87f96c        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
   4b1fddbe6ca6        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
   64d3517d4a95        rancher/pause:3.1         "/pause"
   ```

### 可选：将 crictl 与 Docker 一起使用

crictl 为兼容 CRI 的容器运行时提供了 CLI

如果你想在使用`--docker`选项安装 K3s 后使用 crictl，请参考[官方文档](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)来安装 crictl。

```
$ VERSION="v1.17.0"
$ curl -L https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-${VERSION}-linux-amd64.tar.gz --output crictl-${VERSION}-linux-amd64.tar.gz
$ sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
crictl
```

然后开始使用 crictl 命令：

```
$ sudo crictl version
Version:  0.1.0
RuntimeName:  docker
RuntimeVersion:  19.03.9
RuntimeApiVersion:  1.40.0
$ sudo crictl images
IMAGE                            TAG                 IMAGE ID            SIZE
rancher/coredns-coredns          1.6.3               c4d3d16fe508b       44.3MB
rancher/klipper-helm             v0.2.5              6207e2a3f5225       136MB
rancher/klipper-lb               v0.1.2              897ce3c5fc8ff       6.1MB
rancher/library-traefik          1.7.19              aa764f7db3051       85.7MB
rancher/local-path-provisioner   v0.0.11             9d12f9848b99f       36.2MB
rancher/metrics-server           v0.3.6              9dd718864ce61       39.9MB
rancher/pause                    3.1                 da86e6ba6ca19       742kB
```

# 使用 etcdctl

etcdctl 为 etcd 提供了一个 CLI。

如果你想在嵌入式 etcd 的 K3s 里使用 etcdctl，请先参考[官方文档](https://etcd.io/docs/latest/install/)安装 etcdctl。

```
$ VERSION="v3.5.0"
$ curl -L https://github.com/etcd-io/etcd/releases/download/${VERSION}/etcd-${VERSION}-linux-amd64.tar.gz --output etcdctl-linux-amd64.tar.gz
$ sudo tar -zxvf etcdctl-linux-amd64.tar.gz --strip-components=1 -C /usr/local/bin etcd-${VERSION}-linux-amd64/etcdctl
```

然后开始使用带有适当 K3s 标志的 etcdctl 命令：

```
$ sudo etcdctl --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt --key=/var/lib/rancher/k3s/server/tls/etcd/client.key version
```

## 配置 containerd

K3s 将会在`/var/lib/rancher/k3s/agent/etc/containerd/config.toml`中为 containerd 生成 config.toml。

如果要对这个文件进行高级定制，你可以在同一目录中创建另一个名为 `config.toml.tmpl` 的文件，此文件将会代替默认设置。

`config.toml.tmpl`将被视为 Go 模板文件，并且`config.Node`结构被传递给模板。[此模板](https://github.com/rancher/k3s/blob/master/pkg/agent/templates/templates.go#L16-L32)示例介绍了如何使用结构来自定义配置文件。

## 使用 Rootless 运行 K3s (实验)

> **警告：** 这个功能是试验性的

Rootless 模式允许以非特权用户的身份运行 k3s，这样可以保护主机上的真正的 root 免受潜在的容器攻击。

请参阅 https://rootlesscontaine.rs/ 了解 Rootless 模式。

### Rootless 模式的已知问题

- **端口**

  在 rootless 运行时，将创建一个新的网络名称空间。这意味着 K3s 实例在与主机完全分离的网络上运行。从主机访问在 K3s 中运行的服务的唯一方法是设置端口转发到 K3s 网络名称空间。我们有一个控制器，它将自动将 6443 和 1024 以下的服务端口绑定到主机，偏移量为 10000。

  也就是说服务端口 80 在主机上会变成 10080，但 8080 会变成 8080，没有任何偏移。

  目前，只有`LoadBalancer`服务会自动绑定。

- **Cgroups**

  不支持 Cgroup v1，支持 V2。

- **多节点集群**

  多集群安装没有经过测试，也没有记录。

### 使用 Rootless 运行 Server 和 Agent

- 启用 cgroup v2 授权，请参阅 https://rootlesscontaine.rs/getting-started/common/cgroup2/ 。这一步是可选的，但强烈建议启用 CPU 和内存资源的限制。

- 从[`https://github.com/k3s-io/k3s/blob/<VERSION>/k3s-rootless.service`](https://github.com/k3s-io/k3s/blob/master/k3s-rootless.service)下载`k3s-rootless.service`。确保使用相同版本的`k3s-rootless.service`和`k3s`。

- 将 `k3s-rootless.service` 安装到 `~/.config/systemd/user/k3s-rootless.service`。不支持将该文件安装为全系统服务（`/etc/systemd/...`）。根据 `k3s` 二进制文件的路径，你可能需要修改文件中的 `ExecStart=/usr/local/bin/k3s ...` 行。

- 运行`systemctl --user daemon-reload`。

- 运行`systemctl --user enable --now k3s-rootless`。

- 运行`KUBECONFIG=~/.kube/k3s.yaml kubectl get pods -A`，并确保 pods 正在运行。

> **注意：**不要尝试在终端上运行`k3s server --rootless`，因为它不能启用 cgroup v2 授权。
> 如果你真的需要在终端上运行，请在 `systemd-run --user -p Delegate=yes --tty` 前加上一个 systemd 范围。
>
> 即：`systemd-run --user -p Delegate=yes --tty k3s server --rootless`。

### 故障排除

- 运行`systemctl --user status k3s-rootless` 来检查守护进程的状态。
- 运行`journalctl --user -f -u k3s-rootless` 查看守护程序日志。
- 参见 https://rootlesscontaine.rs/

## 节点标签和污点

K3s agents 可以通过`--node-label`和`--node-taint`选项进行配置，这两个选项可以给 kubelet 添加标签和污点。这两个选项只能[在注册时](/docs/k3s/installation/install-options/_index#k3s-agent的注册选项)添加标签和/或污点，所以它们只能被添加一次，之后不能再通过运行 K3s 命令来改变。

如果你想在节点注册后更改节点标签和污点，你应该使用`kubectl`。关于如何添加[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)和[节点标签](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)，请参考 Kubernetes 官方文档。

## 使用安装脚本启动 Server 节点

安装脚本将自动检测您的操作系统是使用 systemd 还是 openrc 并启动服务。当使用 openrc 运行时，日志将在`/var/log/k3s.log`中创建。

当使用 systemd 运行时，日志将在`/var/log/syslog`中创建，并使用`journalctl -u k3s`查看。

使用安装脚本进行安装和自动启动的示例：

```bash
curl -sfL https://get.k3s.io | sh -
```

:::tip 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

:::

当手动运行 server 时，你应该得到一个类似于下面的输出：

```
$ k3s server
INFO[2019-01-22T15:16:19.908493986-07:00] Starting k3s dev
INFO[2019-01-22T15:16:19.908934479-07:00] Running kube-apiserver --allow-privileged=true --authorization-mode Node,RBAC --service-account-signing-key-file /var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range 10.43.0.0/16 --advertise-port 6445 --advertise-address 127.0.0.1 --insecure-port 0 --secure-port 6444 --bind-address 127.0.0.1 --tls-cert-file /var/lib/rancher/k3s/server/tls/localhost.crt --tls-private-key-file /var/lib/rancher/k3s/server/tls/localhost.key --service-account-key-file /var/lib/rancher/k3s/server/tls/service.key --service-account-issuer k3s --api-audiences unknown --basic-auth-file /var/lib/rancher/k3s/server/cred/passwd --kubelet-client-certificate /var/lib/rancher/k3s/server/tls/token-node.crt --kubelet-client-key /var/lib/rancher/k3s/server/tls/token-node.key
Flag --insecure-port has been deprecated, This flag will be removed in a future version.
INFO[2019-01-22T15:16:20.196766005-07:00] Running kube-scheduler --kubeconfig /var/lib/rancher/k3s/server/cred/kubeconfig-system.yaml --port 0 --secure-port 0 --leader-elect=false
INFO[2019-01-22T15:16:20.196880841-07:00] Running kube-controller-manager --kubeconfig /var/lib/rancher/k3s/server/cred/kubeconfig-system.yaml --service-account-private-key-file /var/lib/rancher/k3s/server/tls/service.key --allocate-node-cidrs --cluster-cidr 10.42.0.0/16 --root-ca-file /var/lib/rancher/k3s/server/tls/token-ca.crt --port 0 --secure-port 0 --leader-elect=false
Flag --port has been deprecated, see --secure-port instead.
INFO[2019-01-22T15:16:20.273441984-07:00] Listening on :6443
INFO[2019-01-22T15:16:20.278383446-07:00] Writing manifest: /var/lib/rancher/k3s/server/manifests/coredns.yaml
INFO[2019-01-22T15:16:20.474454524-07:00] Node token is available at /var/lib/rancher/k3s/server/node-token
INFO[2019-01-22T15:16:20.474471391-07:00] To join node to cluster: k3s agent -s https://10.20.0.3:6443 -t ${NODE_TOKEN}
INFO[2019-01-22T15:16:20.541027133-07:00] Wrote kubeconfig /etc/rancher/k3s/k3s.yaml
INFO[2019-01-22T15:16:20.541049100-07:00] Run: k3s kubectl
```

由于 agent 将创建大量的日志，输出可能会更长。默认情况下，server 会将自身注册为一个节点（运行 agent）。

## Alpine Linux 安装的额外准备工作

设置 Alpine Linux 前，您需要进行以下准备工作：

1. 更新 **/etc/update-extlinux.conf** 添加：

   ```shell
   default_kernel_opts="...  cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory"
   ```

1. 更新配置并重启：

   ```shell
   update-extlinux
   reboot
   ```

## 运行 K3d（Docker 中的 K3s）和 docker-compose

[k3d](https://github.com/rancher/k3d)是一个设计用于在 Docker 中轻松运行 K3s 的工具。

它可以通过 MacOS 上的[brew](https://brew.sh/)工具安装：

```shell
brew install k3d
```

`rancher/k3s`镜像也可用于在 Docker 运行的 K3s server 和 agent。

在 K3s repo 的根目录下有一个`docker-compose.yml`，作为如何从 Docker 运行 K3s 的示例。要从这个 repo 中运行`docker-compose`，请运行：

```shell
docker-compose up --scale agent=3
    # kubeconfig is written to current dir

kubectl --kubeconfig kubeconfig.yaml get node

    NAME           STATUS   ROLES    AGE   VERSION
    497278a2d6a2   Ready    <none>   11s   v1.13.2-k3s2
    d54c8b17c055   Ready    <none>   11s   v1.13.2-k3s2
    db7a5a5a5bdd   Ready    <none>   12s   v1.13.2-k3s2
```

要只在 Docker 中运行 agent，使用`docker-compose up agent`。

或者，也可以使用`docker run`命令：

```
sudo docker run \
  -d --tmpfs /run \
  --tmpfs /var/run \
  -e K3S_URL=${SERVER_URL} \
  -e K3S_TOKEN=${NODE_TOKEN} \
  --privileged rancher/k3s:vX.Y.Z
```

## 在 Raspbian Buster 上启用旧版的 iptables

Raspbian Buster 默认使用`nftables`而不是`iptables`。 **K3S** 网络功能需要使用`iptables`，而不能使用`nftables`。 按照以下步骤切换配置**Buster**使用`legacy iptables`：

```
sudo iptables -F
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo reboot
```

## 为 Raspbian Buster 启用 cgroup

标准的 Raspbian Buster 安装没有启用 `cgroups`。**K3S** 需要`cgroups`来启动 systemd 服务。在`/boot/cmdline.txt`中添加`cgroup_memory=1 cgroup_enable=memory`就可以启用`cgroups`。

### /boot/cmdline.txt 的示例

```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

## SELinux 支持

_从 v1.19.4+k3s1 开始支持。从 v1.17.4+k3s1 开始是试验性的。_

如果您在默认启用 SELinux 的系统（如 CentOS）上安装 K3s，您必须确保安装了正确的 SELinux 策略。

### 自动安装

_从 v1.19.3+k3s2 开始可用_。

如果在兼容的系统上，如果不执行离线安装，则[安装脚本](/docs/k3s/installation/install-options/_index#使用脚本安装的选项)将从 Rancher RPM 存储库自动安装 SELinux RPM。可以通过设置 `INSTALL_K3S_SKIP_SELINUX_RPM=true` 来跳过自动安装。

### 手动安装

可以使用以下命令安装必要的策略：

```
yum install -y container-selinux selinux-policy-base
yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-0.2-1.el7_8.noarch.rpm
```

要强制安装脚本记录警告而不是失败，您可以设置以下环境变量： `INSTALL_K3S_SELINUX_WARN=true`。

### 启用和禁用 SELinux Enforcement

SELinux enforcement 的启用或禁用方式取决于 K3s 的版本。

#### K3s v1.19.1+k3s1

要使用 SELinux，请在启动 K3s server 和 agent 时指定`--selinux`标志。

这个选项也可以在 K3s[配置文件](/docs/k3s/installation/install-options/_index#配置文件)中指定：

```shell
selinux: true
```

不要使用`--disable-selinux`选项。它已经被废弃，在未来的小版本中，它可能会因为被忽略或不被识别，从而导致错误。

在 SELinux 下不支持使用自定义的`--data-dir`。要自定义它，你很可能需要编写自己的自定义策略。为了获得指导，你可以参考[container/container-selinux](https://github.com/containers/container-selinux)资源库，它包含了容器运行时的 SELinux 策略文件，以及[rancher/k3s-selinux](https://github.com/rancher/k3s-selinux)资源库，它包含了 K3s 的 SELinux 策略。

#### V1.19.1+k3s1 之前的 K3s

内置 containerd 会自动启用 SELinux。

要关闭嵌入式 containerd 中的 SELinux enforcement，请使用`--disable-selinux`标志启动 K3s。

在 SELinux 下不支持使用自定义的`--data-dir`。要自定义它，你很可能需要编写自己的自定义策略。为了获得指导，你可以参考[container/container-selinux](https://github.com/containers/container-selinux)资源库，它包含了容器运行时的 SELinux 策略文件，以及[rancher/k3s-selinux](https://github.com/rancher/k3s-selinux)资源库，它包含了 K3s 的 SELinux 策略。

## Red Hat 和 CentOS 的额外准备

建议运行以下命令，关闭 firewalld：

```shell
systemctl disable firewalld --now
```

如果启用，则需要禁用 nm-cloud-setup 并重启节点:

```
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```

## 启用 eStargz 的延迟拉取（实验性）

### 什么是延迟拉取和 eStargz？

拉取镜像被称为容器生命周期中耗时的步骤之一。根据[Harter, et al.](https://www.usenix.org/conference/fast16/technical-sessions/presentation/harter):

> 拉取包占容器启动时间的 76%，但其中只有 6.4%的数据被读取

为了解决这个问题，k3s 实验性地支持镜像内容的延迟拉取。这允许 k3s 在拉取整个镜像之前启动一个容器。相反，按需获取必要的内容块（例如单个文件）。特别是对于大镜像，这种技术可以缩短容器启动延迟。

要启用延迟拉取，目标镜像需要格式化为 [_eStargz_](https://github.com/containerd/stargz-snapshotter/blob/main/docs/stargz-estargz.md)。这是一种 OCI 的替代品，但 100% 与 OCI 兼容的镜像格式，用于延迟拉取。由于兼容性，eStargz 可以推送到标准容器注册表（例如 ghcr.io），并且即使在 eStargz-agnostic 运行时，它也*仍然可运行*。

eStargz 是基于[谷歌 CRFS 项目提出的 stargz 格式](https://github.com/google/crfs)开发的，具有内容验证、性能优化等实用功能。

关于延迟拉取和 eStargz 的更多细节，请参考 [Stargz Snapshotter 项目资源库](https://github.com/containerd/stargz-snapshotter)。

## 配置 k3s 进行 eStargz 的延迟拉取

如以下所示，k3s server 和 agent 需要 `--snapshotter=stargz` 选项。

```
k3s server --snapshotter=stargz
```

使用此配置，您可以对 eStargz 格式的镜像执行延迟拉取。以下 Pod 清单使用 eStargz 格式的 `node:13.13.0` 镜像 （`ghcr.io/stargz-containers/node:13.13.0-esgz`）。k3s 对这个镜像进行了延迟拉取。

```
apiVersion: v1
kind: Pod
metadata:
  name: nodejs
spec:
  containers:
  - name: nodejs-estargz
    image: ghcr.io/stargz-containers/node:13.13.0-esgz
    command: ["node"]
    args:
    - -e
    - var http = require('http');
      http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('Hello World!\n');
      }).listen(80);
    ports:
    - containerPort: 80
```

## 其他日志源

可以在不使用 Rancher 的情况下安装 K3s 的 [Rancher 日志](https://rancher.com/docs//rancher/v2.6/en/logging/helm-chart-options/)。应执行以下指令来实现：

```
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install --create-namespace -n cattle-logging-system rancher-logging-crd rancher-charts/rancher-logging-crd
helm install --create-namespace -n cattle-logging-system rancher-logging --set additionalLoggingSources.k3s.enabled=true rancher-charts/rancher-logging
```

## Server 和 agent token

在 K3s 中，有两种类型的 token：K3S_TOKEN 和 K3S_AGENT_TOKEN。

K3S_TOKEN：定义了 server 提供 HTTP 配置资源所需的密钥。其他 server 在加入 K3s HA 集群之前会请求这些资源。如果没有定义 K3S_AGENT_TOKEN，agent 也使用这个 token 来访问加入集群所需的 HTTP 资源。请注意，这个 token 还用于为数据库中的重要内容（例如引导数据）生成加密密钥。

K3S_AGENT_TOKEN（可选）：定义了 server 向 agent 提供 HTTP 配置资源所需的密钥。如果没有定义，agent 将需要 K3S_TOKEN。推荐使用 K3S_AGENT_TOKEN 避免 agent 节点必须知道 K3S_TOKEN，它也用于加密数据。

如果没有定义 K3S_TOKEN，第一个 K3s server 将生成一个随机的 K3S_TOKEN。其结果是 `/var/lib/rancher/k3s/server/token` 中的部分内容。例如，`K1070878408e06a827960208f84ed18b65fa10f27864e71a57d9e053c4caff8504b::server:df54383b5659b9280aa1e73e60ef78fc`，其中 `df54383b5659b9280aa1e73e60ef78fc` 是 K3S_TOKEN。
