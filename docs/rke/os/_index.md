---
title: 安装要求
description: 本文讲述了 RKE 对操作系统、软件、端口和 SSH 配置的要求，安装 RKE 前，请检查您的节点是否满足这些要求。
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
  - 安装要求
---

## 概述

本文讲述了 RKE 对操作系统、软件、端口和 SSH 配置的要求，安装 RKE 前，请检查您的节点是否满足这些要求。

## 操作系统要求

### 总体

RKE 可以在大多数已安装 Docker 的 Linux 操作系统上运行。RKE 的开发和测试过程是在 Ubuntu 16.04 上完成的。然而，其他操作系统对 RKE 有限制或要求。

- [SSH 用户](/docs/rke/config-options/nodes/_index) - 使用 SSH 访问节点的用户必须是节点上`docker`用户组的成员。请运行以下命令，把使用 SSH 的用户添加到`docker`用户组里面。注意，您需要将`<user_name>`占位符替换为真实的用户名称。例如，您的用户是`example_user1`，则最终输入的命令为`usermod -aG docker example_user1`。除了可以将自己添加到用户组里面，您也可以运行以下命令，将其他用户添加到用户组中，只要将`<user_name>`替换为其他用户的用户名即可。

  ```shell
  usermod -aG docker <user_name>
  ```

> **说明：**
>
> - 添加到`docker`用户组的用户会自动获得主机的 root 权限，运行上述命令前，请确认您是否想让该用户获得 root 权限。运行命令后，请妥善保存该用户的认证凭据。
> - 如果您无法切换到 root 用户，不能运行上述命令将用户添加到`docker`用户组，请参考[Docker 官方文档](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)，该文档提供了以非 root 用户的身份管理 Docker 的操作步骤。

- 禁用所有 woker 节点上的交换功能（Swap）

- 在命令行工具中输入以下命令和脚本，检查下列模组是否存在。

  - `modprobe module_name`
  - `lsmod | grep module_name`
  - 如果是内置模组，请输入这条命令检查：`grep module_name /lib/modules/$(uname -r)/modules.builtin`
  - 请输入以下脚本：

    ```bash
        for module in br_netfilter ip6_udp_tunnel ip_set ip_set_hash_ip ip_set_hash_net iptable_filter iptable_nat iptable_mangle iptable_raw nf_conntrack_netlink nf_conntrack nf_conntrack_ipv4   nf_defrag_ipv4 nf_nat nf_nat_ipv4 nf_nat_masquerade_ipv4 nfnetlink udp_tunnel veth vxlan x_tables xt_addrtype xt_conntrack xt_comment xt_mark xt_multiport xt_nat xt_recent xt_set  xt_statistic xt_tcpudp;
        do
          if ! lsmod | grep -q $module; then
            echo "module $module is not present";
          fi;
        done
    ```

返回的模组应该包括下列的所有模组：

| 模组名称               |
| :--------------------- |
| br_netfilter           |
| ip6_udp_tunnel         |
| ip_set                 |
| ip_set_hash_ip         |
| ip_set_hash_net        |
| iptable_filter         |
| iptable_nat            |
| iptable_mangle         |
| iptable_raw            |
| nf_conntrack_netlink   |
| nf_conntrack           |
| nf_conntrack_ipv4      |
| nf_defrag_ipv4         |
| nf_nat                 |
| nf_nat_ipv4            |
| nf_nat_masquerade_ipv4 |
| nfnetlink              |
| udp_tunnel             |
| veth                   |
| vxlan                  |
| x_tables               |
| xt_addrtype            |
| xt_conntrack           |
| xt_comment             |
| xt_mark                |
| xt_multiport           |
| xt_nat                 |
| xt_recent              |
| xt_set                 |
| xt_statistic           |
| xt_tcpudp              |

- 运行以下命令，修改 sysctl 配置：

  ```shell
  net.bridge.bridge-nf-call-iptables=1
  ```

### SUSE Linux Enterprise Server (SLES) / openSUSE

如果您使用的是 SUSE Linux Enterprise Server 或 openSUSE，请遵循以下说明。

#### 使用的 Docker

如果你使用的是上游的 Docker，包名是`docker-ce`或`docker-ee`。你可以通过执行以下命令来检查安装的软件包。

```
rpm -q docker-ce
```

使用上游 Docker 包时，请按照[以非 root 用户身份管理 Docker](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)。

#### 使用 SUSE/openSUSE 打包的 docker

如果你使用的是 SUSE/openSUSE 提供的 Docker 包，包名是`docker`。你可以通过执行以下命令来检查安装的软件包。

```
rpm -q docker
```

#### 为 docker 添加软件仓库

在 SUSE Linux Enterprise Server 15 SP2 中，docker 位于 Containers 模块中。
在安装 docker 之前，需要添加该模块。

要列出可用的模块，您可以运行 SUSEConnect 来列出扩展和激活命令。

```
node:~ # SUSEConnect --list-extensions
AVAILABLE EXTENSIONS AND MODULES

    Basesystem Module 15 SP2 x86_64 (Activated)
    Deactivate with: SUSEConnect -d -p sle-module-basesystem/15.2/x86_64

        Containers Module 15 SP2 x86_64
        Activate with: SUSEConnect -p sle-module-containers/15.2/x86_64
```

运行这个 SUSEConnect 命令来激活 Containers 模块。

```
node:~ # SUSEConnect -p sle-module-containers/15.2/x86_64
Registering system to registration proxy https://rmt.seader.us

Updating system details on https://rmt.seader.us ...

Activating sle-module-containers 15.2 x86_64 ...
-> Adding service to system ...
-> Installing release package ...

Successfully registered system
```

为了用你的用户运行 docker cli 命令，那么你需要将这个用户添加到`docker`组中。
最好不要使用 root 用户。

```
usermod -aG docker <user_name>
```

要验证用户是否正确配置，退出节点，使用 SSH 或其他方法登录，并执行`docker ps`。

```
ssh user@node
user@node:~> docker ps
CONTAINER ID        IMAGE       COMMAND             CREATED             STATUS              PORTS               NAMES
user@node:~>
```

### openSUSE MicroOS/Kubic (Atomic)

请参考 openSUSE MicroOS 和 Kubic 的项目页面进行安装。

#### openSUSE MicroOS

openSUSE MicroOS 专为托管容器工作负载而设计，具有自动管理和补丁功能。安装 openSUSE MicroOS，您将获得一个快速、小型的环境，用于部署容器，或任何其他受益于事务性更新的工作负载。作为滚动发行版，软件始终是最新的。
https://microos.opensuse.org

#### openSUSE Kubic

基于 MicroOS，但不是滚动发行版。在设计上也有同样的考虑，但也是认证的 Kubernetes 发行版。
https://kubic.opensuse.org  
安装说明。
https://kubic.opensuse.org/blog/2021-02-08-MicroOS-Kubic-Rancher-RKE/

### RHEL、OEL 或 CentOS

因为 Red Hat Enterprise Linux（RHEL）、Oracle Enterprise Linux （OEL）和 CentOS 存在漏洞[Bugzilla 1527565](https://bugzilla.redhat.com/show_bug.cgi?id=1527565)，所以它们不允许用户使用`root`作为[SSH 用户](/docs/rke/config-options/nodes/_index#ssh-user)。

如果您使用的操作系统是 RHEL、OEL 或 CentOS ，请参考下文。

#### 使用 upstream Docker

如果您使用的是 upstream Docker，Docker 的二进制安装包名字应该是`docker-ce`或 `docker-ee`，您需要输入以下命令，查询 Docker 安装包的名称。

```shell
rpm -q docker-ce
```

如果第一条命令的返回结果显示没有这个安装包，则表示安装包的名称可能是`docker-ee`，请输入以下命令确认安装包名称：

```shell
rpm -q docker-ee
```

输入上述命令后，如果您使用的确实是`docker-ce`或 `docker-ee`，命令行工具会询问您是否安装，请选择不安装。因为在这个步骤中，我们只是在借用`rpm -q`确认安装包的名称，以确认其来源。
确认安装包的来源是 uptream Docker 后，请参考[Docker 官方文档](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user)，该文档提供了以非 root 用户的身份管理 Docker 的操作步骤。

#### Using RHEL/CentOS packaged Docker

如果您使用的是 Red Hat 或 CentOS 提供的 Docker 二进制安装包，则安装包的名字应该是`docker`，您需要输入以下命令，查询 Docker 安装包的名称。输入上述命令后，如果您使用的确实是`docker`，命令行工具会询问您是否安装，请选择不安装。因为在这个步骤中，我们只是在借用`rpm -q`确认安装包的名称，以确认其来源。

```shell
rpm -q docker
```

来源于 Red Hat 或 CentOS 的安装包会自动将`dockerroot` 添加到系统内。您需要创建`/etc/docker/daemon.json`文件，然后将下文代码示例中的键值添加到 JSON 文件中，创建一个名为`dockerroot`的用户组。

```json
{
  "group": "dockerroot"
}
```

创建和编辑文件后，请重启 Docker。重启后，您可以打开`/var/run/docker.sock`，检查用户组权限。此时返回的信息显示已经创建 `dockerroot`用户组，该用户组有读写权限：

```shell
srw-rw----. 1 root dockerroot 0 Jul  4 09:57 /var/run/docker.sock
```

运行以下命令，将 SSH 用户添加到`dockerroot`用户组中。注意，您需要将`<user_name>`占位符替换为真实的用户名称。例如，您的用户是`example_user1`，则最终输入的命令为`usermod -aG docker example_user1`。除了可以将自己添加到用户组里面，您也可以运行以下命令，将其他用户添加到用户组中，只要将`<user_name>`替换为其他用户的用户名即可。

```shell
usermod -aG dockerroot <user_name>
```

完成添加后，您需要登出该节点，然后使用 SSH 用户的认证信息登录该节点，执行`docker ps`，应该返回如下信息：

```shell
ssh <user_name>@node
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### Red Hat Atomic

使用 Red Hat Atomic 节点运行 RKE 前，请完成以下两项升级。

#### 升级 OpenSSH 版本

默认情况下，Atomic 使用的是 OpenSSH 6.4，该版本不支持 SSH 隧道协议（SSH tunneling），而 RKE 的其中一个核心需求就是 SSH 隧道协议，所以您需要将 OpenSSH 升级到 Atomic 支持的最新版，解决 SSH 隧道协议的问题。

#### 创建 Docker 分组

Atomic 和 RHEL、CentOS 不同，没有内置的 Docker 分组，所以也就不像 RHEL 和 CentOS 那样，不可以通过编辑用户组权限、将用户添加到用户组等操作，批量分配用户权限。但是您可以运行以下命令，允许单个用户运行 RKE。如果您需要授权多个用户，请重复运行以下命令，将用户名替换成不同的用户名即可。

```shell
chown <user> /var/run/docker.sock
```

完成权限分配后，您需要登出该节点，然后使用 SSH 用户的认证信息登录该节点，执行`docker ps`，应该返回如下信息：

```shell
ssh <user_name>@node
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### Flatcar Container Linux

当使用 Flatcar Container Linux 节点时，需要在集群配置文件中使用以下配置

#### Canal

```yaml
rancher_kubernetes_engine_config:
  network:
    plugin: canal
    options:
      canal_flex_volume_plugin_dir: /opt/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds
      flannel_backend_type: vxlan
  services:
    kube-controller:
      extra_args:
        flex-volume-plugin-dir: /opt/kubernetes/kubelet-plugins/volume/exec/
```

#### Calico

```yaml
rancher_kubernetes_engine_config:
  network:
    plugin: calico
    options:
      calico_flex_volume_plugin_dir: /opt/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds
      flannel_backend_type: vxlan
  services:
    kube-controller:
      extra_args:
        flex-volume-plugin-dir: /opt/kubernetes/kubelet-plugins/volume/exec/
```

#### Docker

还需要启用 Docker 服务，你可以使用以下命令启用 Docker 服务。

```
systemctl enable docker.service
```

## 软件要求

本节描述了 RKE 对于 Docker、Kubernetes 和 SSH 的要求。

### OpenSSH

为了可以通过 SSH 访问每一个节点，RKE 要求每个节点上安装的是 OpenSSH 的版本是**OpenSSH 7.0+**。

### Kubernetes

请参考[RKE 版本说明](https://github.com/rancher/rke/releases) ，获取每个版本的 RKE 支持的 Kubernetes 版本。

### Docker

每一个 Kubernetes 版本支持的 Docker 版本都不同，详情请参考，[Kubernetes 的版本说明](https://kubernetes.io/docs/setup/release/notes/#dependencies)。

#### 安装 Docker

请参考[Docker 官方文档](https://docs.docker.com/install/)完成 Docker 安装。Rancher 也提供了 Docker 的安装脚本，详情请参考[安装脚本](https://github.com/rancher/install-docker) 。如果您使用的操作系统是 RHEL，请参考[Red Hat 官方文档-如何在 RHEL 上安装 Docker](https://access.redhat.com/solutions/3727511)。

| Docker 版本 | 安装脚本                                                                           |
| :---------- | :--------------------------------------------------------------------------------- |
| 18.09.2     | <code>curl https://releases.rancher.com/install-docker/18.09.2.sh &#124; sh</code> |
| 18.06.2     | <code>curl https://releases.rancher.com/install-docker/18.06.2.sh &#124; sh</code> |
| 17.03.2     | <code>curl https://releases.rancher.com/install-docker/17.03.2.sh &#124; sh</code> |

#### 检查 Docker 版本号

输入`docker version --format '{{.Server.Version}}'`，检查支持特定版本 Kubernetes 的 Docker 是否已经成功安装到您的机器上。如果已经成功安装，返回的信息应该如代码示例所示。

```shell
docker version --format '{{.Server.Version}}'
17.03.2-ce
```

## 端口要求

如果您使用的是外部防火墙，请确保在运行 RKE 的节点和创建集群的节点之间开放了 TCP/6443 端口。

### 使用 iptables 打开 TCP/6443 端口

运行以下命令，使用 iptables 打开 TCP/6443 端口。

```shell
# Open TCP/6443 for all
iptables -A INPUT -p tcp --dport 6443 -j ACCEPT

# Open TCP/6443 for one specific IP
iptables -A INPUT -p tcp -s your_ip_here --dport 6443 -j ACCEPT
```

### 使用 firewalld 打开 TCP/6443 端口

运行以下命令，使用 firewlld 打开 TCP/6443 端口。

```shell
# Open TCP/6443 for all
firewall-cmd --zone=public --add-port=6443/tcp --permanent
firewall-cmd --reload

# Open TCP/6443 for one specific IP
firewall-cmd --permanent --zone=public --add-rich-rule='
  rule family="ipv4"
  source address="your_ip_here/32"
  port protocol="tcp" port="6443" accept'
firewall-cmd --reload
```

## SSH Server 配置

您的 SSH server 全系统配置文件，位于`/etc/ssh/sshd_config`，该文件必须包含以下代码，允许 TCP 转发。

```shell
AllowTcpForwarding yes
```
