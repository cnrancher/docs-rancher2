---
title: 访问虚拟机
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
  - 虚拟机管理
  - 访问虚拟机
---

## 概述

虚拟机启动并运行后，您可以通过 VNC 或 Harvester 用户界面的串行控制台进行访问。也可以直接从电脑的 SSH 客户端连接。

## 使用 UI 访问

可以使用 VNC 或串行控制台直接从 UI 访问虚拟机。

如果未在虚拟机上启用 VGA 显示（例如，使用 Ubuntu 最小云映像时），则可使用串行控制台访问虚拟机。

## 使用 SSH 访问

使用终端仿真客户端（如 Putty）中的地址，或使用以下命令行直接从计算机的 SSH 客户端访问虚拟机。

```bash
 ssh -i ~/.ssh/your-ssh-key user@<ip-address-or-hostname>
```

![](/img/harvester/access-to-vm.png)
