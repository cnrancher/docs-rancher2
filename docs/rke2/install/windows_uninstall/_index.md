---
title: Windows 卸载
description: 根据安装 RKE2 的安装方式不同，卸载过程也不同。
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
  - RKE2
  - 卸载rke2
  - windows 卸载
---

:::warning 注意：
卸载 RKE2 的 Windows Agent 会删除所有的节点数据。
:::

根据安装 RKE2 的方法不同，卸载过程也不同。

## Tarball 方法

要从你的系统中卸载通过 tarball 方法安装的 RKE2 Windows Agent，只需运行下面的命令。这将关闭所有 RKE2 的 Windows 进程，删除 RKE2 的 Windows 二进制文件，并清理 RKE2 使用的文件。

```powershell
c:/usr/local/bin/rke2-uninstall.ps1
```
