---
title: ISO 模式
description:
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
  - 安装指南
  - ISO 模式
---

## 前提条件

硬件需要满足以下要求，才可以启动和运行 Harvester。

| 硬件类型 | 要求                                                    |
| :------- | :------------------------------------------------------ |
| CPU      | 至少 4 核，首选 16 核或以上。                           |
| 内存     | 至少 8 GB，首选 32 GB 或以上 。                         |
| 磁盘     | 至少 120 GB ，首选 500 GB 或以上 。                     |
| 网卡     | 至少 1 Gbps Ethernet，建议选择 10Gbps Ethernet 或以上。 |
| 网关     | VLAN 支持所需的端口中继。                               |

## 镜像安装

请访问[Harvester 发布页面](https://github.com/rancher/harvester/releases)，下载 Harvester 镜像。

在安装过程中，你可以选择组建一个新的集群，或者将节点加入到现有的集群中。

注意：这个[视频](https://youtu.be/97ADieBX6bE)展示了 ISO 安装的过程。

1. 挂载 Harvester ISO 盘，选择`Harvester Installer`启动服务器。
   ![iso-install.png](/img/harvester/iso-install.png)
1. 创建一个新的 Harvester 集群或加入一个现有的集群，然后选择安装模式。
1. 选择要格式化 Harvester 的安装设备。
1. 配置`cluster token`，用于添加其他节点到集群中。
1. 配置主机的登录密码，默认的 ssh 用户是`rancher`。
1. （可选）你可以选择从远程 URL 服务器导入 SSH 密钥。你的 GitHub 公钥可以用`https://github.com/<username>.keys`。
1. 选择管理网络的网络接口。
1. (可选）如果你需要使用 HTTP 代理访问外界，请在这里输入代理 URL 地址，否则留空。
1. (可选) 如果需要使用 cloud-init config 自定义主机，请在此处输入 HTTP URL。
1. 确认安装选项，Harvester 将被安装到你的主机上。安装可能需要几分钟才能完成。
1. 安装完成后，将重启主机，并显示一个包含管理 URL 和状态的控制台界面。你可以使用 F12 在 Harvester 控制台和 Shell 之间切换。
   ![iso-installed.png](/img/harvester/iso-installed.png)
