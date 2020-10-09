---
title: "网络选项"
description: 本安装指南将帮助您在K3s上部署和配置Kubernetes 仪表盘
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
  - 网络选项
---

> **注意：**请参考[Networking](/docs/k3s/networking/_index)页面，了解 CoreDNS、Traefik 和 Service LB 的信息。

默认情况下，K3s 将以 flannel 作为 CNI 运行，使用 VXLAN 作为默认后端。要改变 CNI，请参考配置[自定义 CNI](#自定义-cni)。要改变 flannel 后端，请参考 flannel 选项部分。

## Flannel 选项

Flannel 的默认后端是 VXLAN。要启用加密，请使用下面的 IPSec（Internet Protocol Security）或 WireGuard 选项。

如果你想使用 WireGuard 作为你的 flannel 后端，可能需要额外的内核模块。请参阅 [WireGuard 安装指南](https://www.wireguard.com/install/)了解详情。WireGuard 的安装步骤将确保为您的操作系统安装适当的内核模块。在尝试使用 WireGuard flannel 后端选项之前，您需要在 server 和 agent 的每个节点上安装 WireGuard。

| CLI Flag 和 Value             | 描述                                                                    |
| :---------------------------- | :---------------------------------------------------------------------- |
| `--flannel-backend=vxlan`     | (默认) 使用 VXLAN 后端。                                                |
| `--flannel-backend=ipsec`     | 使用 IPSEC 后端，对网络流量进行加密。                                   |
| `--flannel-backend=host-gw`   | 使用 host-gw 后端。                                                     |
| `--flannel-backend=wireguard` | 使用 WireGuard 后端，对网络流量进行加密。可能需要额外的内核模块和配置。 |

## 自定义 CNI

使用`--flannel-backend=none`运行 K3s，然后在安装你选择的 CNI。应该为 Canal 和 Calico 启用 IP 转发。请参考以下步骤。

#### Canal

访问[Project Calico Docs](https://docs.projectcalico.org/)网站。按照以下步骤安装 Canal。修改 Canal 的 YAML，在 container_settings 部分中允许 IP 转发，例如：

```
"container_settings": {
              "allow_ip_forwarding": true
          }
```

应用 Canal YAML.

通过在主机上运行以下命令，确保设置已被应用：

```
cat /etc/cni/net.d/10-calico.conflist
```

你应该看到 IP 转发被设置为 true。

#### Calico

按照[Calico CNI 插件指南](https://docs.projectcalico.org/master/reference/cni-plugin/configuration)。修改 Calico YAML，在 container_settings 部分中允许 IP 转发，例如：

```
"container_settings": {
              "allow_ip_forwarding": true
          }
```

应用 Calico YAML.

通过在主机上运行以下命令，确保设置已被应用：

```
cat /etc/cni/net.d/10-canal.conflist
```

你应该看到 IP 转发被设置为 true。
