---
title: 从节点中移除 Kubernetes 组件
description: 了解从 Rancher 启动的 Kubernetes 集群中删除节点时的集群清理过程。了解删除了的内容，以及如何手动进行操作
weight: 2055
---

本文介绍如何断开 Rancher 创建的 Kubernetes 集群中的一个节点，并删除该节点中的所有 Kubernetes 组件。此过程允许你将节点用于其他用途。

在通过 Rancher 在基础设施提供商的新节点上安装 Kubernetes 时，会创建资源（容器/虚拟网络接口）和配置项（证书/配置文件）。

从 Rancher 启动的 Kubernetes 集群中移除节点时（前提是它们处于 `Active` 状态），这些资源会被自动清理，唯一需要的操作是重启节点。如果节点变得不可访问并且无法自动清理进程时，请先执行我们提供的步骤，然后该节点才能重新添加到集群。

## 移除了什么？

清理使用 Rancher 配置的节点时，会根据要删除的集群节点类型移除以下组件：

| 移除的组件                                                                  | [由基础设施提供商托管的节点][1] | [自定义节点][2] | [托管集群][3] | [注册节点][4] |
| --------------------------------------------------------------------------- | ------------------------------- | --------------- | ------------- | ------------- |
| Rancher deployment 命名空间（默认：`cattle-system`）                        | ✓                               | ✓               | ✓             | ✓             |
| 由 Rancher 标记的 `serviceAccount`、`clusterRoles` 和 `clusterRoleBindings` | ✓                               | ✓               | ✓             | ✓             |
| 标签、注释和终结器                                                          | ✓                               | ✓               | ✓             | ✓             |
| Rancher Deployment                                                          | ✓                               | ✓               | ✓             |               |
| 机器、集群、项目和用户的自定义资源定义 (CRD)                                | ✓                               | ✓               | ✓             |               |
| 在 `management.cattle.io` API Group 下创建的所有资源                        | ✓                               | ✓               | ✓             |               |
| Rancher v2.x 创建的所有 CRD                                                 | ✓                               | ✓               | ✓             |               |

[1]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/node-pools/
[2]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/custom-nodes/
[3]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/hosted-kubernetes-clusters/
[4]: {{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/registered-clusters/

## 通过 Rancher UI 删除集群中的节点

如果节点处于 `Active` 状态，删除集群中的节点会触发清理节点的进程。完成自动清理后请重启节点，以确保所有非持久性数据已正确删除。

**重启节点**：

```
# 使用重启
$ sudo reboot

# 使用关机
$ sudo shutdown -r now
```

## 手动移除集群中的 Rancher 组件

当节点不可达并已从集群中移除时，由于该节点不可达，则无法触发自动清理过程。请按照以下步骤手动删除 Rancher 组件。

> **警告**：下面列出的命令将删除节点中的数据。在执行命令之前，由于数据将会丢失，请确保你已经备份了要保留的文件。

### 移除注册集群中的 Rancher 组件

移除注册集群中的 Rancher 的过程略有不同。你可以选择在 Rancher UI 中简单地删除集群，也可以运行脚本从节点中删除 Rancher 组件。两个选项的删除效果是一样的。

将注册集群分离 Rancher 后，集群的工作负载将不受影响，你可以使用与集群注册到 Rancher 之前相同的方法来访问集群。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="ui"
values={[
{ label: '使用 UI 或 API', value: 'ui', },
{ label: '使用脚本', value: 'script', },
]}>

<TabItem value="ui">

> **警告**：此过程将删除你的集群数据。在执行命令之前，由于数据将会丢失，请确保你已经备份了要保留的文件。

使用 Rancher UI（或 API）删除注册集群后，会发生以下事件：

1. Rancher 创建一个 `serviceAccount`，用于删除集群中的 Rancher 组件。此账号分配了 [clusterRole](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole) 和 [clusterRoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) 权限，这些权限是删除 Rancher 组件所必需的。

1. Rancher 会使用 `serviceAccount` 调度并运行一个 [job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)，以将 Rancher 组件从集群中清除。该 job 还将 `serviceAccount` 及其角色作为依赖引用，因此该 job 在完成之前会删除它们。

1. 已从集群中移除 Rancher。然而，集群仍然存在，运行着原生版本的 Kubernetes。

**结果**：已删除[移除了什么](#what-gets-removed)章节中为注册集群列出的所有组件。

</TabItem>

<TabItem value="script">

你可以运行脚本，而不是使用 Rancher UI 来清理已注册的集群节点。

> **先决条件**：
>
> 安装 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。

1. 打开浏览器并导航到 [GitHub](https://github.com/rancher/rancher/blob/master/cleanup/user-cluster.sh)，然后下载 `user-cluster.sh`。

1. 在 `user-cluster.sh` 所在的目录下运行以下命令，使脚本可执行：

   ```
   chmod +x user-cluster.sh
   ```

1. **仅限离线环境**：打开 `user-cluster.sh` 并将 `yaml_url` 替换为 `user-cluster.yml` 中的 URL。

   如果你没有使用离线环境，请跳过此步骤。

1. 在同一目录中，运行脚本并提供 `rancher/rancher-agent` 镜像版本，该版本应与用于管理集群的 Rancher 版本相同（`<RANCHER_VERSION>`）：

   > **提示**：
   >
   > 你可以添加 `-dry-run` 标志来预览脚本的结果，但不进行更改。

   ```
   ./user-cluster.sh rancher/rancher-agent:<RANCHER_VERSION>
   ```

**结果**：脚本已运行。已删除[移除了什么](#what-gets-removed)章节中为注册集群列出的所有组件。

</TabItem>
</Tabs>

### Windows 节点

要清理 Windows 节点，你可以运行位于 `c:\\etc\\rancher` 中的清理脚本。该脚本删除 Kubernetes 生成的资源并执行二进制文件。它还会删除防火墙规则和网络设置。

要运行脚本，你可以在 PowerShell 中运行以下命令：

```
pushd c:\etc\rancher
.\cleanup.ps1
popd
```

**结果**：节点被重置，并可以重新添加到 Kubernetes 集群中。

### Docker 容器、镜像和卷

根据你分配给节点的角色，Kubernetes 组件存在于容器、属于覆盖网络的容器、DNS、ingress controller 和 Rancher agent（以及你创建的已调度到此节点的 pod）。

**清理所有 Docker 容器、镜像和卷**：

```
docker rm -f $(docker ps -qa)
docker rmi -f $(docker images -q)
docker volume rm $(docker volume ls -q)
```

### 挂载

Kubernetes 组件和密文会在系统上留下需要卸载的挂载。

| 挂载                                    |
| --------------------------------------- |
| `/var/lib/kubelet/pods/XXX`（各种挂载） |
| `/var/lib/kubelet`                      |
| `/var/lib/rancher`                      |

**卸载所有挂载**：

```
for mount in $(mount | grep tmpfs | grep '/var/lib/kubelet' | awk '{ print $3 }') /var/lib/kubelet /var/lib/rancher; do umount $mount; done
```

### 目录和文件

以下目录在将节点添加到集群时使用，应将该目录删除。你可以使用 `rm -rf /directory_name` 来删除目录。

> **注意**：节点分配的角色决定了出现在节点上的目录。

| 目录                         |
| ---------------------------- |
| `/etc/ceph`                  |
| `/etc/cni`                   |
| `/etc/kubernetes`            |
| `/opt/cni`                   |
| `/opt/rke`                   |
| `/run/secrets/kubernetes.io` |
| `/run/calico`                |
| `/run/flannel`               |
| `/var/lib/calico`            |
| `/var/lib/etcd`              |
| `/var/lib/cni`               |
| `/var/lib/kubelet`           |
| `/var/lib/rancher/rke/log`   |
| `/var/log/containers`        |
| `/var/log/kube-audit`        |
| `/var/log/pods`              |
| `/var/run/calico`            |

**清理目录**：

```
rm -rf /etc/ceph \
       /etc/cni \
       /etc/kubernetes \
       /opt/cni \
       /opt/rke \
       /run/secrets/kubernetes.io \
       /run/calico \
       /run/flannel \
       /var/lib/calico \
       /var/lib/etcd \
       /var/lib/cni \
       /var/lib/kubelet \
       /var/lib/rancher/rke/log \
       /var/log/containers \
       /var/log/kube-audit \
       /var/log/pods \
       /var/run/calico
```

### 网络接口和 iptables

其余两个更改/配置的组件是（虚拟）网络接口和 iptables 规则。两者都对节点不持久，这意味着它们将在节点重新启动后被清除。要删除这些组件，建议重新启动它们。

**重启节点**：

```
# 使用重启
$ sudo reboot

# 使用关机
$ sudo shutdown -r now
```

如果你想了解更多关于（虚拟）网络接口或 iptables 规则的信息，请参阅下面的具体内容。

### 网络接口

> **注意**：节点所在的集群所配置的网络提供商决定了节点上将出现的接口。

| 接口                                       |
| ------------------------------------------ |
| `flannel.1`                                |
| `cni0`                                     |
| `tunl0`                                    |
| `caliXXXXXXXXXXX` (random interface names) |
| `vethXXXXXXXX` (random interface names)    |

**列出所有接口**：

```
# 使用 ip
ip address show

# 使用 ifconfig
ifconfig -a
```

**删除接口**：

```
ip link delete interface_name
```

### Iptables

> **注意**：节点所在的集群所配置的网络提供商决定了节点上将出现的链。

iptables 规则用于将流量从容器路由到容器。创建的规则不是持久性的，因此重新启动节点会将 iptables 恢复到原始状态。

| 链                                               |
| ------------------------------------------------ |
| `cali-failsafe-in`                               |
| `cali-failsafe-out`                              |
| `cali-fip-dnat`                                  |
| `cali-fip-snat`                                  |
| `cali-from-hep-forward`                          |
| `cali-from-host-endpoint`                        |
| `cali-from-wl-dispatch`                          |
| `cali-fw-caliXXXXXXXXXXX` (random chain names)   |
| `cali-nat-outgoing`                              |
| `cali-pri-kns.NAMESPACE` (chain per namespace)   |
| `cali-pro-kns.NAMESPACE` (chain per namespace)   |
| `cali-to-hep-forward`                            |
| `cali-to-host-endpoint`                          |
| `cali-to-wl-dispatch`                            |
| `cali-tw-caliXXXXXXXXXXX` (random chain names)   |
| `cali-wl-to-host`                                |
| `KUBE-EXTERNAL-SERVICES`                         |
| `KUBE-FIREWALL`                                  |
| `KUBE-MARK-DROP`                                 |
| `KUBE-MARK-MASQ`                                 |
| `KUBE-NODEPORTS`                                 |
| `KUBE-SEP-XXXXXXXXXXXXXXXX` (random chain names) |
| `KUBE-SERVICES`                                  |
| `KUBE-SVC-XXXXXXXXXXXXXXXX` (random chain names) |

**列出所有 iptables 规则**：

```
iptables -L -t nat
iptables -L -t mangle
iptables -L
```
