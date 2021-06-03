---
title: 创建虚拟机
description: 本文提供了创建虚拟机的操作指导。
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
  - 虚拟机管理
  - 创建虚拟机
---

## 操作步骤

1. 选择创建一个或多个虚拟机实例的选项。
1. 输入虚拟机名称。
1. （可选）您可以选择使用虚拟机模板。默认情况下，我们已经添加了 iso、raw 和 Windows 镜像模板。
1. 配置虚拟机的 CPU 和内存
1. 选择自定义虚拟机镜像。
1. 选择 SSH 密钥或上传新的密钥。
1. 要向虚拟机添加更多磁盘，请转到**Volumes**选项卡。默认磁盘将是根磁盘。
1. 要配置网络，请转到**Network**选项卡。默认添加**Management Network**。也可以使用 vlan 网络为虚拟机添加辅助网络（在**高级>网络**上配置）。
1. （可选）在**高级选项**部分配置高级选项，如主机名和 cloud-init 数据。

![](/img/harvester/create-vm.png)

## 配置示例

配置默认用户的密码。

```YAML
#cloud-config
password: password
chpasswd: { expire: False }
ssh_pwauth: True
```

使用 DHCP 的网络数据配置。

```YAML
version: 1
config:
  - type: physical
    name: eth0
    subnets:
      - type: dhcp
  - type: physical
    name: eth1
    subnets:
      - type: dhcp
```

## 网络

### 管理网络

管理网络表示集群网络解决方案配置的默认 vm eth0 接口，该接口存在于每个虚拟机中。

默认情况下，可以通过管理网络访问虚拟机。

### 二级网络

您也可以使用内置 vlan 网络的二级网络连接虚拟机。这是由[Multus](https://github.com/intel/multus-cni)提供的。
