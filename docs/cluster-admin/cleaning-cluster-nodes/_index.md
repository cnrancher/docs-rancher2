---
title: 清理节点
---

本节介绍如何从一个 Rancher 创建的 Kubernetes 集群中断开一个节点，并从该节点中删除所有 Kubernetes 组件。此过程允许您将节点用于其他用途。

当您使用 Rancher [创建集群节点](/docs/cluster-provisioning/_index) 时，将创建资源(容器/虚拟网络接口)和配置项(证书/配置文件)。

当从您的 Rancher 启动的 Kubernetes 集群中删除节点时(假设它们处于“活动”状态)，这些资源将被自动清除，所需的惟一操作是重新启动节点。当一个节点变得不可访问并且不能使用自动清理过程时，我们将再次说明将该节点添加到集群之前需要执行的步骤。

## 清理脚本

:::danger 严重警告！
以下操作将删除节点中的数据（包括容器，卷，Iptables 等），在执行命令之前，请先查看该脚本，确保您理解这个脚本在做什么，并且确保已进行了数据备份。
:::

```bash
# 停止服务
systemctl  disable kubelet.service
systemctl  disable kube-scheduler.service
systemctl  disable kube-proxy.service
systemctl  disable kube-controller-manager.service
systemctl  disable kube-apiserver.service

systemctl  stop kubelet.service
systemctl  stop kube-scheduler.service
systemctl  stop kube-proxy.service
systemctl  stop kube-controller-manager.service
systemctl  stop kube-apiserver.service

# 删除所有容器
docker rm -f $(docker ps -qa)

# 删除所有容器卷
docker volume rm $(docker volume ls -q)

# 卸载mount目录
for mount in $(mount | grep tmpfs | grep '/var/lib/kubelet' | awk '{ print $3 }') /var/lib/kubelet /var/lib/rancher; do umount $mount; done

# 备份目录
mv /etc/kubernetes /etc/kubernetes-bak-$(date +"%Y%m%d%H%M")
mv /var/lib/etcd /var/lib/etcd-bak-$(date +"%Y%m%d%H%M")
mv /var/lib/rancher /var/lib/rancher-bak-$(date +"%Y%m%d%H%M")
mv /opt/rke /opt/rke-bak-$(date +"%Y%m%d%H%M")

# 删除残留路径
rm -rf /etc/ceph \
    /etc/cni \
    /opt/cni \
    /run/secrets/kubernetes.io \
    /run/calico \
    /run/flannel \
    /var/lib/calico \
    /var/lib/cni \
    /var/lib/kubelet \
    /var/log/containers \
    /var/log/pods \
    /var/run/calico

# 清理网络接口
network_interface=`ls /sys/class/net`
for net_inter in $network_interface;
do
  if ! echo $net_inter | grep -qiE 'lo|docker0|eth*|ens*';then
    ip link delete $net_inter
  fi
done

# 清理残留进程
port_list='80 443 6443 2376 2379 2380 8472 9099 10250 10254'

for port in $port_list
do
  pid=`netstat -atlnup|grep $port |awk '{print $7}'|awk -F '/' '{print $1}'|grep -v -|sort -rnk2|uniq`
  if [[ -n $pid ]];then
    kill -9 $pid
  fi
done

pro_pid=`ps -ef |grep -v grep |grep kube|awk '{print $2}'`

if [[ -n $pro_pid ]];then
  kill -9 $pro_pid
fi

# 清理Iptables表
## 注意：如果节点Iptables有特殊配置，以下命令请谨慎操作
sudo iptables --flush
sudo iptables --flush --table nat
sudo iptables --flush --table filter
sudo iptables --table nat --delete-chain
sudo iptables --table filter --delete-chain

systemctl restart docker
```

## 删除了什么？

在使用 Rancher 清理创建的节点时，将根据要删除的集群节点的类型删除以下组件。

| 删除的组件                                                                      | [由基础设施提供商托管的节点][1] | [自定义集群的节点][2] | [托管集群的节点][3] | [导入集群的节点][4] |
| ------------------------------------------------------------------------------- | ------------------------------- | --------------------- | ------------------- | ------------------- |
| Rancher deployment 命名空间 (默认`cattle-system` )                              | ✓                               | ✓                     | ✓                   | ✓                   |
| 由 Rancher 打了标签的`serviceAccount`, `clusterRoles`, 和 `clusterRoleBindings` | ✓                               | ✓                     | ✓                   | ✓                   |
| 标签、注释和清理器                                                              | ✓                               | ✓                     | ✓                   | ✓                   |
| Rancher Deployment                                                              | ✓                               | ✓                     | ✓                   |                     |
| 主机、集群、项目和用户自定义资源定义 (CRDs)                                     | ✓                               | ✓                     | ✓                   |                     |
| 在`management.cattle.io` API 分组下创建的所有资源                               | ✓                               | ✓                     | ✓                   |                     |
| 所有由 Rancher v2.x 创建的 CRD                                                  | ✓                               | ✓                     | ✓                   |                     |

[1]: /docs/cluster-provisioning/rke-clusters/node-pools/_index
[2]: /docs/cluster-provisioning/rke-clusters/custom-nodes/_index
[3]: /docs/cluster-provisioning/hosted-kubernetes-clusters/_index
[4]: /docs/cluster-provisioning/imported-clusters/_index

## 通过 Rancher UI 从集群中删除节点

当节点处于“活动”状态时，从集群中删除节点将触发一个进程来清理节点。完成自动清理过程后，请重启节点，以确保正确删除了所有非持久性数据。

**重启节点:**

```
## using reboot
$ sudo reboot

## using shutdown
$ sudo shutdown -r now
```

## 手动从集群中删除 Rancher 组件

当某个节点不可访问并从集群中删除时，由于该节点不可访问，因此无法触发自动清理过程。请按照以下步骤手动删除 Rancher 组件。

> **警告:** 下面列出的命令将会从节点中删除数据。在执行任何命令之前，确保您已经创建了要保存的文件备份，因为数据将会丢失。

### 从导入的集群中删除 Rancher 组件

对于导入的集群，删除 Rancher 的过程略有不同。您可以在 Rancher UI 中简单地删除集群，也可以运行从节点中删除 Rancher 组件的脚本。两个选项执行相同的删除操作。

将导入的集群与 Rancher 分离后，集群的工作负载将不受影响，您可以使用与将集群导入 Rancher 之前相同的方法访问集群。

#### 通过 UI / API 删除

> **警告:** 此过程将从您的集群中删除数据。在执行命令之前，请确保您已经创建了要保存的文件备份，因为数据将会丢失。

在使用 Rancher UI(或 API)开始删除 [导入的集群](/docs/cluster-provisioning/_index) 之后, 将发生以下事件。

1. Rancher 创建了一个 `serviceAccount` 用于从集群中删除 Rancher 组件。这个帐户分配了删除 Rancher 组件所需要的[clusterRole](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole) 和 [clusterRoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) 权限。

1. 使用`serviceAccount`, Rancher 调度并运行一个[作业](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)，该作业清除集群中的 Rancher 组件。此作业还将 `serviceAccount` 及其角色作为依赖项引用，因此作业将在完成之前删除它们。
1. Rancher 从集群中移除。但是，集群仍然在运行本地版本的 Kubernetes。

**结果:** 所有在 [删除了什么？](#删除了什么？)中为导入集群列出的组件会被删除.

#### 通过运行脚本删除

您可以运行一个脚本，而不是使用 Rancher UI 来清除导入的集群节点。该功能从`v2.1.0`版本开始提供。

> **先决条件:**
>
> 安装 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

1. 打开网页浏览器, 打开 [GitHub](https://github.com/rancher/rancher/blob/master/cleanup/user-cluster.sh)页面, 并下载 `user-cluster.sh`.

1. 在与`user-cluster.sh`相同的路径下运行以下命令，使脚本可执行:

   ```
   chmod +x user-cluster.sh
   ```

1. **仅限于离线环境:** 打开 `user-cluster.sh` 将 `yaml_url` 替换成 `user-cluster.yml`中的 URL

   如果您没有离线环境，请跳过这一步。

1. 在同一目录中，运行脚本并提供 `rancher/rancher-agent` 镜像版本， 该版本应该与用于管理集群的 Rancher 版本一致。(`<RANCHER_VERSION>`):

   > **提示:**
   >
   > 添加 `-dry-run` 标志来预览脚本的结果，而不做任何更改

   ```
   ./user-cluster.sh rancher/rancher-agent:<RANCHER_VERSION>
   ```

**结果:** 脚本运行。所有在 [删除了什么？](#删除了什么？)中为导入集群列出的组件会被删除.

### Windows 节点

要清理 Windows 节点，可以运行位于 `c:\etc\rancher`目录下的清理脚本. 该脚本删除 Kubernetes 生成的资源和执行的二进制文件。它还取消了防火墙规则和网络设置。

要运行脚本，可以在 PowerShell 中使用此命令:

```
pushd c:\etc\rancher
.\cleanup.ps1
popd
```

**结果:** 节点被重置，可以重新添加到 Kubernetes 集群中。

### Docker 容器、镜像和卷

根据您分配给节点的角色，容器中有 Kubernetes 组件， 属于覆盖网络的容器、DNS、ingress 控制器和 Rancher Agent。(还有您创建的 Pods 也被调度到这个节点)

**清理所有 Docker 容器、镜像和卷:**

```
docker rm -f $(docker ps -qa)
docker rmi -f $(docker images -q)
docker volume rm $(docker volume ls -q)
```

### 挂载

Kubernetes 的组件和密钥在系统上留下了需要卸载的挂载。

| 挂载                                   |
| -------------------------------------- |
| `/var/lib/kubelet/pods/XXX` (各种挂载) |
| `/var/lib/kubelet`                     |
| `/var/lib/rancher`                     |

**卸载所有挂载:**

```
for mount in $(mount | grep tmpfs | grep '/var/lib/kubelet' | awk '{ print $3 }') /var/lib/kubelet /var/lib/rancher; do umount $mount; done
```

### 文件与目录

以下目录在添加一个节点到一个集群时被使用到，应该将它们删除。您可以使用命令 `rm -rf /directory_name`删除目录

> **注意:** 根据您分配给节点的角色，一些目录将会或不会出现在节点上。

| Directories                  |
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
| `/var/log/pods`              |
| `/var/run/calico`            |

**清除目录:**

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
       /var/log/pods \
       /var/run/calico
```

### 网络接口和 Iptables

其余被更改/配置过的两个组件是(虚拟)网络接口和 iptables 规则。它们相对于节点来说都是非持久性的，这意味着它们将在重新启动节点后被清除。要删除这些组件，建议重启节点。

**重启节点:**

```
## using reboot
$ sudo reboot

## using shutdown
$ sudo shutdown -r now
```

如果您想了解更多关于(虚拟)网络接口或 iptables 规则的信息，请参阅下面的特定主题。

### 网络接口

> **注意:** 根据为节点所在的集群配置的网络供应商，一些接口将出现在节点上，也可能不出现在节点上。

| Interfaces                                 |
| ------------------------------------------ |
| `flannel.1`                                |
| `cni0`                                     |
| `tunl0`                                    |
| `caliXXXXXXXXXXX` (random interface names) |
| `vethXXXXXXXX` (random interface names)    |

**列出所有接口:**

```
## Using ip
ip address show

## Using ifconfig
ifconfig -a
```

**删除接口:**

```
ip link delete interface_name
```

### Iptables

> **注意:** 根据为节点所在的集群配置的网络供应商，节点上可能存在或不存在某些 chains。

Iptables 规则用于将数据从容器路由到容器。创建的规则不是持久性的，因此重新启动节点将把 iptables 恢复到原来的状态。

| Chains                                           |
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

**列出所有 iptables 规则:**

```
iptables -L -t nat
iptables -L -t mangle
iptables -L
```
