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
- [使用 Docker 作为容器运行时](#使用docker作为容器运行时)
- [配置 containerd](#配置containerd)
- [Secrets 加密配置 (实验)](#secrets加密配置-实验)
- [使用 RootlessKit 运行 K3s (实验)](#使用rootlesskit运行k3s-实验)
- [节点标签和污点](#节点标签和污点)
- [使用安装脚本启动 server 节点](#使用安装脚本启动server节点)
- [Alpine Linux 安装的额外准备工作](#alpine-linux安装的额外准备工作)
- [运行 K3d（Docker 中的 K3s）和 docker-compose](#运行k3d（docker中的k3s）和docker-compose)
- [在 Raspbian Buster 上启用旧版的 iptables](#在raspbian-buster上启用旧版的iptables)
- [实验性 SELinux 支持](#实验性selinux支持)

## 证书轮换

默认情况下，K3s 的证书在 12 个月内过期。

如果证书已经过期或剩余的时间不足 90 天，则在 K3s 重启时轮换证书。

## 自动部署清单

在`/var/lib/rancher/k3s/server/manifests`中找到的任何文件都会以类似`kubectl apply`的方式自动部署到 Kubernetes。

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

   :::note 提示
   国内用户，可以使用以下方法加速安装：

   ```
   curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - --docker
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

## 配置 containerd

K3s 将会在`/var/lib/rancher/k3s/agent/etc/containerd/config.toml`中为 containerd 生成 config.toml。

如果要对这个文件进行高级定制，你可以在同一目录中创建另一个名为 `config.toml.tmpl` 的文件，此文件将会代替默认设置。

`config.toml.tmpl`将被视为 Go 模板文件，并且`config.Node`结构被传递给模板。[此模板](https://github.com/rancher/k3s/blob/master/pkg/agent/templates/templates.go#L16-L32)示例介绍了如何使用结构来自定义配置文件。

## Secrets 加密配置 (实验)

从 v1.17.4+k3s1 开始，K3s 增加了一个实验性的功能，就是通过在 server 上传递标志`--secrets-encryption`来实现 secrets 加密，这个标志会自动进行以下操作：

- 生成 AES-CBC 密钥
- 用生成的密钥生成一个加密配置文件

```
{
  "kind": "EncryptionConfiguration",
  "apiVersion": "apiserver.config.k8s.io/v1",
  "resources": [
    {
      "resources": [
        "secrets"
      ],
      "providers": [
        {
          "aescbc": {
            "keys": [
              {
                "name": "aescbckey",
                "secret": "xxxxxxxxxxxxxxxxxxx"
              }
            ]
          }
        },
        {
          "identity": {}
        }
      ]
    }
  ]
}
```

- 将配置作为 encryption-provider-config 传递给 KubeAPI

一旦启用，任何创建的 secrets 都将用这个密钥加密。请注意，如果您禁用加密，那么任何加密后的 secrets 将无法读取，直到您再次启用加密。

## 使用 RootlessKit 运行 K3s (实验)

> **警告：** 这个功能是试验性的

RootlessKit 是一种 Linux 原生的 "fake root(假根)" 实用程序，主要是为了[以非特权用户身份运行 Docker 和 Kubernetes，](https://github.com/rootless-containers/usernetes)从而保护主机上的 "real root（真根）" 不受潜在的容器破坏攻击。

最初的 rootless 支持已添加，但是围绕它存在一系列重大的可用性问题。

我们为那些对 rootless 的感兴趣的人发布了初步的支持，希望一些人可以帮助改善可用性。 首先，确保你有一个正确的设置和对用户命名空间的支持。 请参考 RootlessKit 中的[需求部分](https://github.com/rootless-containers/rootlesskit#setup)获取说明。简而言之，最新的 Ubuntu 是你最好的选择。

### RootlessKit 的已知问题

- **端口**

  在 rootless 运行时，将创建一个新的网络名称空间。这意味着 K3s 实例在与主机完全分离的网络上运行。从主机访问在 K3s 中运行的服务的唯一方法是设置端口转发到 K3s 网络名称空间。我们有一个控制器，它将自动将 6443 和 1024 以下的服务端口绑定到主机，偏移量为 10000。

  也就是说服务端口 80 在主机上会变成 10080，但 8080 会变成 8080，没有任何偏移。

  目前，只有`LoadBalancer`服务会自动绑定。

- **守护进程生命周期**

  一旦你 kill 掉 K3s，然后启动一个新的 K3s 实例，它将创建一个新的网络命名空间，但它不会 kill 掉旧的 pods。 所以你留下的是一个相当糟糕的设置。 这是目前最主要的问题，如何处理网络命名空间的问题。

  在 https://github.com/rootless-containers/rootlesskit/issues/65 中跟踪了该问题

- **Cgroups**

  不支持 Cgroups.

### 使用 Rootless 运行 Servers 和 Agents

只需将`--rootless`标志添加到 server 或 agent 即可。因此，运行`k3s server --rootless`，然后查看`Wrote kubeconfig [SOME PATH]`的信息，了解你的 kubeconfig 文件在哪里。

关于设置 kubeconfig 文件的更多信息，请参考[关于集群访问的部分。](../cluster-access/_index)

要注意，如果你用`-o`把 kubeconfig 写到其他目录下，则可能无法使用，这是因为 K3s 实例运行在不同的挂载命名空间。

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

:::note 提示
国内用户，可以使用以下方法加速安装：

```
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
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

为了设置 Alpine Linux，需要进行以下准备工作：

更新 **/etc/update-extlinux.conf** 添加：

```
default_kernel_opts="...  cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory"
```

然后更新配置，重启：

```bash
update-extlinux
reboot
```

## 运行 K3d（Docker 中的 K3s）和 docker-compose

[k3d](https://github.com/rancher/k3d)是一个设计用于在 Docker 中轻松运行 K3s 的工具。

它可以通过 MacOS 上的[brew](https://brew.sh/)工具安装：

```
brew install k3d
```

`rancher/k3s`镜像也可用于从 Docker 运行 K3s server 和 agent。

在 K3s repo 的根目录下有一个`docker-compose.yml`，作为如何从 Docker 运行 K3s 的示例。要从这个 repo 中运行`docker-compose`，请运行：

    docker-compose up --scale agent=3
    # kubeconfig is written to current dir

    kubectl --kubeconfig kubeconfig.yaml get node

    NAME           STATUS   ROLES    AGE   VERSION
    497278a2d6a2   Ready    <none>   11s   v1.13.2-k3s2
    d54c8b17c055   Ready    <none>   11s   v1.13.2-k3s2
    db7a5a5a5bdd   Ready    <none>   12s   v1.13.2-k3s2

要只在 Docker 中运行 agent，使用`docker-compose up agent`。

或者，也可以使用`docker run`命令：

    sudo docker run \
      -d --tmpfs /run \
      --tmpfs /var/run \
      -e K3S_URL=${SERVER_URL} \
      -e K3S_TOKEN=${NODE_TOKEN} \
      --privileged rancher/k3s:vX.Y.Z

## 在 Raspbian Buster 上启用旧版的 iptables

Raspbian Buster 默认使用`nftables`而不是`iptables`。 **K3S** 网络功能需要使用`iptables`，而不能使用`nftables`。 按照以下步骤切换配置**Buster**使用`legacy iptables`：

```
sudo iptables -F
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo reboot
```

## 实验性 SELinux 支持

从 v1.17.4+k3s1 版本开始，对 SELinux 的实验性支持已添加到 K3s 的嵌入式容器中。如果要在默认启用 SELinux 的系统上安装 K3s（例如 CentOS），则必须确保已经安装正确的 SELinux 策略。

### 自动安装

从 v1.19.3+k3s2 版本开始，如果不进行离线加装，[安装脚本](/docs/k3s/installation/install-options/_index)将自动从 Rancher RPM 仓库中安装 SELinux RPM。通过设置`INSTALL_K3S_SKIP_SELINUX_RPM=true`可以跳过自动安装。

### 手动安装

可以使用以下命令安装必要的策略：

```
yum install -y container-selinux selinux-policy-base	yum install -y container-selinux selinux-policy-base
rpm -i https://rpm.rancher.io/k3s-selinux-0.1.1-rc1.el7.noarch.rpm	yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-0.2-1.el7_8.noarch.rpm
```

要强制安装脚本记录一个警告而不是失败，您可以设置以下环境变量：
`INSTALL_K3S_SELINUX_WARN=true`

你可以通过使用`--disable-selinux`标志启动 K3s 来禁用嵌入式 containerd 中的 SELinux。

要强制安装脚本记录一个警告而不是失败，您可以设置以下环境变量： `INSTALL_K3S_SELINUX_WARN=true`。`INSTALL_K3S_SELINUX_WARN=true`。

启用或禁用 SELinux 的方式取决于 K3s 的版本。在 v1.19.x 之前，内置容器的 SELinux 启用是自动的，但可以通过`--disable-selinux`来禁用。在 v1.19.x 及以后的版本中，启用 SELinux 必须通过`--selinux`标志或配置文件条目进行肯定的配置。同时指定`--selinux`和（已废弃）`--disable-selinux`标志的 server 和 agent 将无法启动。

不支持在 SELinux 下使用自定义的`--data-dir`。要自定义它，你很可能需要编写自己的自定义策略。为了获得指导，你可以参考[container/container-selinux](https://github.com/containers/container-selinux)存储库，它包含了容器运行时的 SELinux 策略文件，以及[rancher/k3s-selinux](https://github.com/rancher/k3s-selinux)存储库，它包含了 K3s 的 SELinux 策略。

### K3s v1.19.1+

要利用实验性的 SELinux，请在启动 K3s server 和 agent 时指定`--selinux`标志。

这个选项也可以在 [K3s 配置文件](/docs/k3s/installation/install-options/_index)中指定：

```
selinux: true
```

请不要使用`--disable-selinux`选项，因为它已被废弃，在未来的小版本中，它将被忽略或不被识别，从而导致错误。

### K3s v1.19.1 或之前的版本

你可以通过使用`--disable-selinux`标志启动 K3s 来关闭嵌入式容器中的 SELinux 执行。

请注意，对 containerd 中 SELinux 的支持仍在开发中。进展情况可以在[Pull Request 1246](https://github.com/containerd/cri/pull/1246)中跟踪。
