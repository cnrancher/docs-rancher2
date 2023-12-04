---
title: 网络服务
---

Rancher 实现了一个 CNI 框架，用户可以在 Rancher 中选择不同的网络驱动。为了支持 CNI 框架，每个 Rancher 环境中都需要部署网络服务，默认情况下，每个环境模版都会启用网络服务。除了网络服务这个基础设施服务之外，您还需要选择相关的 CNI 驱动。在默认的环境模版中，IPSec 驱动是默认启用的，它是一种简单且有足够安全性的隧道网络模型。当您一个网络驱动在环境中运行时，它会自动创建一个默认网络，任何使用托管网络的服务其实就是在使用这个默认网络。

## 与先前版本的区别

当使用 1.2 版本之前的 IPsec 网络时，容器使用托管网络将会被分配两个 IP，分别是 Docker 网桥 IP(172.17.0.0/16)和 Rancher 托管 IP(10.42.0.0/16)。之后的版本中，则集成了 CNI 网络框架的标准，容器只会被分配 Rancher 托管 IP(10.42.0.0/16)。

## 使用 CNI 的影响

Rancher 托管 IP 不会显示在 Docker 元数据中，这意味着通过`docker inspect`无法查到 IP。因为 Rancher 使用 IPtables 来管理端口映射, 任何端口映射也无法通过`docker ps`显示出来。

## 容器间连通性

默认情况下，同一环境下的托管网络之间的容器是可达的。如果您想要控制这个行为，您可以部署网络策略服务。
如果您在跨主机容器通信中碰到问题，可以移步常见的故障排查与修复方法。

## 网络类型

在 UI 上创建服务时，切换到“网络”页签上可以选择网络类型，但是 UI 上默认不提供“Container”网络类型，如果要使用“Container”类型，则需要通过 Rancher CLI/Rancher Compose/Docker CLI 来创建。

### 托管网络

默认情况下，通过 UI 创建容器会使用托管网络，在容器中使用 ip addr 或者 ifconfig 可以看到 eth0 和 lo 设备，eth0 的 IP 从属于 Rancher 托管子网中，默认的子网是 10.42.0.0/16，当然您也可以修改这个子网。
注意:如果在基础设施服务中删除了网络驱动服务，那么容器的网络设置将会失效。

#### 通过 Docker CLI 创建容器

任何通过 Docker CLI 创建的容器，只要添加--label io.rancher.container.network=true 的标签，那么将会自动使用托管网络。不用这个标签，大部分情况下使用的是 bridge 网络。
如果容器只想使用托管网络，您需要使用--net=none 和--label io.rancher.container.network=true。

### None

当容器使用 none 网络类型，基本上等同于 Docker 中的—net=none。在容器中也不会看到任何网络设备除了 lo 设备。

### Host

当容器使用 host 网络类型，基本上等同于 Docker 中的—net=host。在容器中能够看到主机的网络设备。

### Bridge

当容器使用 bridge 网络类型，基本上等同于 Docker 中的—net=bridge。默认情况下，容器中可以看到 172.17.0.0/16 的网段 IP。

### Container

当容器使用 container 网络类型，基本上等同于 Docker 中—net=container:`<CONTAINER>`。在容器中可以看到指定容器的网络配置。

## Rancher IPSEC 使用例子

通过编写 YAML 文件，利用 CNI 框架来驱动，就可以构建 Rancher 的网络基础服务。下面是 IPSEC 网络驱动的 YAML 文件样例:

```yml
ipsec:
  network_driver:
    default_network:
      host_ports: true
      subnets:
        - network_address: $SUBNET
      dns:
        - 169.254.169.250
      dns_search:
        - rancher.internal
    cni_config:
      "10-rancher.conf":
        type: rancher-bridge
        bridge: $DOCKER_BRIDGE
        bridgeSubnet: $SUBNET
        logToFile: /var/log/rancher-cni.log
        isDebugLevel: ${RANCHER_DEBUG}
        isDefaultGateway: true
        hostNat: true
        hairpinMode: true
        mtu: ${MTU}
        linkMTUOverhead: 98
        ipam:
          type: rancher-cni-ipam
          logToFile: /var/log/rancher-cni.log
          isDebugLevel: ${RANCHER_DEBUG}
          routes:
            - dst: 169.254.169.250/32
```

### Name

网络驱动的名字

### Default Network

默认网络定义的是当前环境的网络配置

#### Host Ports

默认情况下，可以在主机上开放端口，当然您可以选择不开放

#### Subnets

您可以给 Overlay 网络定义一个子网

#### DNS && DNS Search

这两个配置 Rancher 会自动放到容器的 DNS 配置中

### CNI 配置

您可以将 CNI 的具体配置放在`cni_config`下面，具体的配置将会依赖您选择的 CNI 插件

#### bridge

Rancher IPSEC 实际上利用了 CNI 的 bridge 插件，所以您会看到这个设置，默认是 docker0

#### bridgeSubnet

这个配置可以理解为主机上容器的子网，对于 Rancher IPSEC 就是 10.42.0.0/16

#### mtu

不同的云厂商在网络中配置了不同的 MTU 值。这个选项可以根据您的需要进行修改。这个选项也是 Rancher 需要的选项。需要明确的是 MTU 的配置需要在每一个网络组件上进行设置；在主机上，在 Docker Deamon 上，在 IPsec 或者 VXLAN 的基础服务里都要进行设置。同时同一个环境中的全部主机都需要有相同的设置。如果同一个环境中的全部主机，有着不同的 MTU 值，那么将会有随机的网络错误发生。

> Rancher 的 IPsec Overlay 网络有一个 98 字节的开销
> `容器网络接口的MTU = 网络的MTU - 98`

> 例如，您有一个云厂商的 MTU 值为 1200 字节，那么如果您在容器中输入`ip addr`或者`ifconfig`时，您将会看到 1102 (= 1200 - 98)字节的 MTU 值。

#### 修改 MTU

MTU 的配置需要在每一个网络组件上进行设置；在主机上，在 Docker Deamon 上，在 IPsec 或者 VXLAN 的基础服务里都要进行设置(需要创建一个新的环境模版)。同时同一个环境中的全部主机都需要有相同的设置。您可以按照下面的步骤来修改 MTU。

- 修改主机的 MTU
  - 我们应该在主机的网络接口上修改这个值，请参考您使用的 Linux 发行版的文档，来了解如何修改 MTU。
- 修改 Docker 网桥的 MTU
  - 在大多数情况下，这将会是 docker0。如下列，您可以通过在`/etc/docker/daemon.json`中设置 MTU。更多详情，请参考 Docker 的官方文档[自定义网桥 docker0](https://docs.docker.com/engine/userguide/networking/default_network/custom-docker0/)

```json
{
  "mtu": 1450
}
```

- 创建一个新的[环境模版](/docs/rancher1/configurations/environments/_index#什么是环境模版)来设置 IPsec 或者 VXLAN 基础设施服务所需的 MTU 值。
- 使用这个新建的环境模版来创建一个新的环境。

> MTU 只能在环境模版中进行配置。不建议在已有的环境中配置一个不同的 MTU 值，因为这个值仅会在新创建的容器中生效。
