---
title: 卸载
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
  - 卸载
---


# 卸载

> **注意：** 卸载 RKE2 会删除集群的数据和所有的脚本。

根据安装 RKE2 的安装方式不同，卸载过程也不同。

## RPM 方式

要从系统中卸载通过 RPM 方式安装的 RKE2，只需运行与你所安装的 RKE2 版本对应的命令即可。这将关闭 RKE2 进程，删除 RKE2 的 RPM，并清理 RKE2 使用的文件。

**RKE2 v1.18.13+rke2r1 和更新的版本**
从 RKE2`v1.18.13+rke2r1`开始，捆绑的`rke2-uninstall.sh`脚本将在卸载过程中删除相应的 RPM 包。只需运行以下命令即可：

    ```bash
    /usr/bin/rke2-uninstall.sh
    ```

**RKE2 v1.18.13+rke2r1 之前的版本**
如果你运行的 RKE2 版本早于`v1.18.13+rke2r1`，你需要在调用`rke2-uninstall.sh`脚本后手动删除 RKE2 RPM。

    ```bash
    /usr/bin/rke2-uninstall.sh
    yum remove -y 'rke2-*'
    rm -rf /run/k3s
    ```

**RKE2 v1.18.11+rke2r1 之前的版本**
在 v1.18.10+rke2r1 之前的基于 RPM 的安装没有打包`rke2-uninstall.sh`脚本。这些说明提供了如何下载和使用必要脚本的指导。

    首先，删除相应的RKE2软件包和 `/run/k3s` 目录。

    ```bash
    yum remove -y 'rke2-*'
    rm -rf /run/k3s
    ```

    运行这些命令后，rke2-uninstall.sh和rke2-killall.sh脚本应该被下载。这两个脚本将停止所有正在运行的容器和进程，清理已使用的进程，并最终从系统中删除RKE2。运行下面的命令：

    ```bash
    curl -sL https://raw.githubusercontent.com/rancher/rke2/488bab0f48b848e408ce399c32e7f5f73ce96129/bundle/bin/rke2-uninstall.sh --output rke2-uninstall.sh
    chmod +x rke2-uninstall.sh
    mv rke2-uninstall.sh /usr/local/bin

    curl -sL https://raw.githubusercontent.com/rancher/rke2/488bab0f48b848e408ce399c32e7f5f73ce96129/bundle/bin/rke2-killall.sh --output rke2-killall.sh
    chmod +x rke2-killall.sh
    mv rke2-killall.sh /usr/local/bin

    ```

    现在运行rke2-uninstall.sh脚本。这也将调用rke2-killall.sh。

    ```bash
    /usr/local/bin/rke2-uninstall.sh
    ```

## Tarball 方式

要从你的系统中卸载通过 Tarball 方式安装的 RKE2，只需运行下面的命令。这将关闭进程，删除 RKE2 二进制文件，并清理 RKE2 使用的文件。

```bash
/usr/local/bin/rke2-uninstall.sh
```
