---
title: K3s常见问题
description: 常见问题定期更新，旨在回答用户最常问到的关于 K3s 的问题。
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
  - K3s常见问题
---

常见问题定期更新，旨在回答用户最常问到的关于 K3s 的问题。

## K3s 是否适合替代 k8s？

K3s 几乎可以胜任 k8s 的所有工作, 它只是一个更轻量级的版本。有关更多详细信息，请参见[主要](/docs/k3s/_index)文档页面。

## 如何用自己的 Ingress 代替 Traefik？

只需用`--disable traefik`启动 K3s server，然后部署你需要的 ingress。

## K3s 是否支持 Windows？

目前，K3s 本身不支持 Windows，但是我们对将来的想法持开放态度。

## 如何通过源码构建？

请参考 K3s [BUILDING.md](https://github.com/rancher/k3s/blob/master/BUILDING.md)的说明。

## K3s 的日志在哪里？

安装脚本会自动检测你的操作系统是 systemd 或 openrc 并启动服务。

当使用 openrc 运行时，日志将在`/var/log/k3s.log`中创建。

当使用 systemd 运行时，日志将在`/var/log/syslog`中创建，并使用`journalctl -u k3s`查看。

## 常见安装问题

### 执行官网提供的安装命令没反应？

执行官网提供的安装脚本安装 K3s，无返回：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghnrh5zc7dj30ik02oq2t.jpg)

**解决方案：**

1. 使用国内安装脚本安装 k3s，详情参考[快速入门指南](/docs/k3s/quick-start/_index)

```
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```

2. 或采用[离线安装](/docs/k3s/installation/airgap/_index#)方式安装 k3s

```
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

### 注册 k3s 节点失败

报错：

```
level=error msg="Node password rejected, duplicate hostname or contents of '/etc/rancher/node/password' may not match server node-passwd entry, try enabling a unique node name with the --with-node-id flag"
```

**原因分析：**

根据日志提示大概的原因是两个 k3s 节点主机名重复，或者‘/etc/rancher/node/password 与 k3s server 的 node-passwd 不匹配照成。

节点注册到 k3s 集群，会在节点的`/etc/rancher/node/password`生成一串随机的 password。如果 agent 首次注册，master 节点会把 agent 发送的 node-name 和 node-passwd 解析出来存储到/var/lib/rancher/k3s/server/cred/node-passwd 中。如果 agent 是非首次注册，k3s master 会结合 node-name 和 node-passwd 进行比对，如果信息不一致会拒绝添加节点请求。

**解决方案：**

为什么会出现 passwd 不一致呢？正常来说如果用 k3s-agent-uninstall.sh 来清理安装过的 agent node，并不会删除 password 文件（/etc/rancher/node/password），那么问题很可能是 VM 重建或者手动操作删除的这个文件。因为 agent 上删除了 password，agent 再次注册时会重新生成 password，就导致了新的 password 和 k3s master 上原先存储的不一致。

1. 手动在 agent 上创建 password，内容和 server 中存储保持一致
2. 修改 server 中的原始内容，让 password 和 agent 上新生成的保持一致
3. 可以试试 agent 注册时使用--with-node-id，这样 server 中认为这完全是新 node，不会用原始信息比对
4. 如果是因为主机名冲突导致的报错，可以修改主机名之后从新注册集群

### 如何创建只带有 master 角色的节点？

默认情况下，k3s 启动 master 节点也同时具有 worker 角色，是可调度的，因此可以在它们上启动工作

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghns27kguwj314q0aywft.jpg)

**解决方案**

1. 通过 --node-taint

```
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn INSTALL_K3S_EXEC="--node-taint k3s-controlplane=true:NoExecute" sh -
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghns3k40ugj30sy066wf4.jpg)

2. 通过 --disable-agent

```
curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn INSTALL_K3S_EXEC="--disable-agent" sh -
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghns42e23nj30sy05gq3j.jpg)

## 跨主机 pod 无法通信？

请参考[k3s 网络要求](/docs/k3s/installation/installation-requirements/_index#网络)检查主机网络或防火墙，查看 vxlan 对应的 UDP/8472 端口是否开放。

## 如何指定某个网卡添加 K3S 集群？

可以通过`--advertise-address`设置 apiserver 向集群成员发布的 IP 地址，详细说明参考[K3s Server 配置参考](/docs/k3s/installation/install-options/server-config/_index)

**Demo：**

| 主机 | eth0               | eth1                          |
| ---- | ------------------ | ----------------------------- |
| k3s1 | 10.0.2.15/24 (NAT) | 192.168.99.211/24 (Host-Only) |
| k3s2 | 10.0.2.15/24 (NAT) | 192.168.99.212/24 (Host-Only) |

K3s1(master):

```
# curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn \
INSTALL_K3S_EXEC="--advertise-address 192.168.99.211" sh –
```

K3s2(worker):

```
# curl -sfL http://rancher-mirror.cnrancher.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn \
INSTALL_K3S_EXEC="--node-ip 192.168.99.212" K3S_URL=https://192.168.99.211:6443 K3S_TOKEN=mynodetoken sh -
```

## 使用 netstat 无法查到 80 和 443 端口?

K3s 使用 traefik 作为默认的 ingress controller。启动之后是通过 iptables 转发 80/443 端口，所以用`netstat`无法查到对应端口，可以通过`iptables`，`nmap`等命令去确认端口是否开启。更多说明请参考[k3s 功能扩展之 Helm、Traefik LB、ServiceLB 存储及 RootFS](https://www.bilibili.com/video/BV187411N7CJ?from=search&seid=3747749725845523296)

## 为什么当 k3s 节点故障后，Pod 需要大于 5 分钟时间才能被重新调度？

参考[Rancher2.x FAQ](https://docs.rancher.cn/docs/rancher2/faq/technical/_index/#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%BD%93%E4%B8%80%E4%B8%AA%E8%8A%82%E7%82%B9%E6%95%85%E9%9A%9C%E6%97%B6%EF%BC%8C%E4%B8%80%E4%B8%AA-pod-%E9%9C%80%E8%A6%81%E5%A4%A7%E4%BA%8E-5-%E5%88%86%E9%92%9F%E6%97%B6%E9%97%B4%E6%89%8D%E8%83%BD%E8%A2%AB%E9%87%8D%E6%96%B0%E8%B0%83%E5%BA%A6%EF%BC%9F)

可以参考下面这个示例调整`tolerationSeconds`时间：

```
kubectl create -f https://raw.githubusercontent.com/kingsd041/rancher-k3s/master/demo-busybox.yaml
```

## 如何使用 crictl 清理未使用的镜像

```
k3s crictl rmi --prune
```

## K3s worker 节点的角色默认为`none`，如果修改？

可以通过`kubectl label node ${node} node-role.kubernetes.io/worker=worker`为节点增加 worker 角色。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghnt0fwi7kj30u60beq3t.jpg)

## Helm: Error: Kubernetes cluster unreachable

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghnt6gohg1j30mw07imxn.jpg)

解决方案参考[集群访问](/docs/k3s/cluster-access/_index)章节。
