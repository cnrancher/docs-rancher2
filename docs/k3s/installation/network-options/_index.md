---
title: "网络选项"
weight: 25
---

> **注意：**请参考[Networking](/docs/k3s/networking/_index)页面，了解CoreDNS、Traefik和Service LB的信息。

默认情况下，K3s将以flannel作为CNI运行，使用VXLAN作为默认后端。要改变CNI，请参考配置[自定义CNI](#自定义-cni)。要改变flannel后端，请参考flannel选项部分。

## Flannel 选项

Flannel 的默认后端是 VXLAN。要启用加密，请使用下面的IPSec（Internet Protocol Security）或WireGuard选项。

如果你想使用WireGuard作为你的flannel后端，可能需要额外的内核模块。请参阅 [WireGuard 安装指南](https://www.wireguard.com/install/)了解详情。WireGuard 的安装步骤将确保为您的操作系统安装适当的内核模块。在尝试使用WireGuard flannel后端选项之前，您需要在server和agent的每个节点上安装WireGuard。

  CLI Flag 和 Value | 描述
  -------------------|------------
 `--flannel-backend=vxlan` | (默认) 使用VXLAN后端。 |
 `--flannel-backend=ipsec` | 使用IPSEC后端，对网络流量进行加密。 |
 `--flannel-backend=host-gw` |  使用host-gw后端。 |
 `--flannel-backend=wireguard` | 使用WireGuard后端，对网络流量进行加密。可能需要额外的内核模块和配置。 |

## 自定义 CNI

使用`--flannel-backend=none`运行K3s，然后在安装你选择的CNI。应该为Canal和Calico启用IP转发。请参考以下步骤。

#### Canal

访问[Project Calico Docs](https://docs.projectcalico.org/)网站。按照以下步骤安装Canal。修改Canal的YAML，在container_settings部分中允许IP转发，例如：

```
"container_settings": {
              "allow_ip_forwarding": true
          }
```

应用 Canal YAML.

通过在主机上运行以下命令，确保设置已被应用：

```
cat /etc/cni/net.d/10-canal.conflist
```

你应该看到IP转发被设置为true。

#### Calico

按照[Calico CNI插件指南](https://docs.projectcalico.org/master/reference/cni-plugin/configuration)。修改 Calico YAML，在container_settings部分中允许IP转发，例如：

```
"container_settings": {
              "allow_ip_forwarding": true
          }
```

应用 Calico YAML.

通过在主机上运行以下命令，确保设置已被应用：

```
cat /etc/cni/net.d/10-calico.conflist
```

你应该看到IP转发被设置为true。

