---
title: 管理地址
keywords:
  - VIP
description: Harvester 提供一个虚拟 IP 作为管理地址。
---

## 概述
Harvester 提供固定的虚拟 IP (VIP) 作为管理地址。安装后，你可以在控制台仪表盘上找到管理地址。

 > 注意
> 如果你选择了通过 DHCP 配置 IP 地址，则需要在 DHCP 服务器上配置静态 MAC 到 IP 地址的映射，以便获得持久的虚拟 IP。

![](./assets/iso-installed.png)

## 如何获取 VIP MAC 地址

要获取 VIP MAC 地址，在管理节点上运行以下命令：
```shell
$ kubectl get svc -n kube-system ingress-expose -ojsonpath='{.metadata.annotations}'
```

输出示例：
```json
{"kube-vip.io/hwaddr":"02:00:00:09:7f:3f","kube-vip.io/requestedIP":"10.84.102.31"}
```

## 用途
管理地址有两个用途：

- 允许通过 `HTTPS` 协议访问 Harvester API/UI。
- 作为其他节点加入集群的地址。
   ![](./assets/configure-management-address.png)
