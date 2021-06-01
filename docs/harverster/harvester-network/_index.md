---
title: 网络
description: Harvester建立在 Kubernetes 上，它使用CNI作为网络供应商和 Kubernetes pod 网络之间的接口。自然地，我们在 CNI 的基础上实现了 Harvester 的网络。此外，Harvester UI整合了 Harvester 网络，以提供一种用户友好的方式来配置虚拟机的网络。
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
  - Harvester
  - 网络
---

## 概述

[Harvester](https://github.com/harvester/harvester)建立在 Kubernetes 上，它使用[CNI](https://github.com/containernetworking/cni)作为网络供应商和 Kubernetes pod 网络之间的接口。自然地，我们在 CNI 的基础上实现了 Harvester 的网络。此外，[Harvester UI](https://github.com/harvester/harvester-ui)整合了 Harvester 网络，以提供一种用户友好的方式来配置虚拟机的网络。

从 0.2.0 版本开始，Harvester 支持两种网络。

- 管理网络
- [VLAN](https://en.wikipedia.org/wiki/Virtual_LAN)

## 实施

### 管理网络

Harvester 采用[flannel](https://github.com/flannel-io/flannel)作为默认的 CNI 来实现管理网络。这是一个内部网络，这意味着用户只能在其集群节点或 Pod 内访问虚拟机的管理网络。

### VLAN

[Harvester network-controller](https://github.com/harvester/harvester-network-controller)利用[multus](https://github.com/k8snetworkplumbingwg/multus-cni)和[bridge](https://www.cni.dev/plugins/current/main/bridge/) CNI 插件来实现 VLAN。

下面是 Harvester 中 VLAN 的一个使用案例。

![](/img/harvester/vlan-case.png)

- Harvester 网络控制器为一个节点使用一个网桥，为一个虚拟机使用一对 Veth 来实现 VLAN。网桥充当交换机，转发来自或来自虚拟机的网络流量，而一对 veth 就像虚拟机和交换机之间的连接端口。
- 同一 VLAN 内的虚拟机能够相互通信，而不同 VLAN 内的虚拟机则不能。
- 与主机或其他设备（如 DHCP 服务器）连接的外部交换机端口应设置为中继或混合类型，并允许指定的 VLAN。
- 用户可以使用带有 "PVID "的 VLAN（默认为 1）来与任何正常的无标记流量进行通信。

## 通过 Harvester UI 启用 VLAN

通过进入**设置 > vlan**启用 VLAN，并为 VLAN 输入有效的默认物理网卡名称。

每个 Harvester 节点的第一个物理 NIC 名称总是默认为 eth0。建议为 VLAN 选择一个单独的网卡，而不是用于管理网络的网卡（在 Harvester 安装过程中选择的网卡），以提高网络性能和隔离度。

:::note
修改默认的 VLAN 网络设置不会改变现有配置的主机网络。
:::

![](/img/harvester/enable-vlan.png)

- （可选）用户可以通过进入**主机>网络**标签，自定义每个节点的 VLAN 网络配置。

  ![](/img/harvester/node-network-configuration.png)

- 通过进入**高级>网络**页面，点击**创建**按钮，就可以创建一个新的 VLAN 网络。

  ![](/img/harvester/create-network.png)

- 网络是在创建虚拟机时配置的。

  - 默认情况下，只有第一个网络接口卡会被启用。用户可以选择使用管理网络或 VLAN 网络。
    :::note
    你需要在`Advanced Options` 标签中选择 `Install guest agent` 选项，以便从 Harvester 用户界面获得 VLAN 网络 IP 地址。

    ![](/img/harvester/vm-network-configuration.png)

    :::

  - 用户可以选择添加一个或多个网络接口卡。额外的网络接口卡配置可以通过云端启动的网络数据进行设置，比如说：

    ```YAML
    version: 1
    config:
      - type: physical
        name: enp1s0 # name is varies upon OS image
        subnets:
          - type: dhcp
      - type: physical
        name: enp2s0
        subnets:
          - type: DHCP
    ```
