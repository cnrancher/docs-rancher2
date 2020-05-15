---
title: iSCSI 卷
description: 将数据存储到 iSCSI 卷时，您可能会遇到一个问题：kubelet无法自动连接 iSCSI 卷。失败是可能因为 iSCSI 启动器工具不兼容而导致的问题，因此您可以通过在集群的每个节点上安装 iSCSI 启动器工具来解决这个问题。Rancher 启动的 Kubernetes 集群是借助iSCSI 启动器工具把数据存储到 iSCSI 卷的，这个工具已经被嵌入到 kubelet 的`rancher/hyperkube` Docker 镜像中。该工具从每个 kubelet（即启动器）中发起与 iSCSI 卷（即目标）的会话。但是，在某些情况下，启动器和目标上安装的 iSCSI 启动器工具的版本可能不匹配，从而导致连接失败。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 集群管理员指南
  - 存储卷和存储类
  - iSCSI 卷
---

> 本章节仅适用于[由 RKE 创建的集群](/docs/cluster-provisioning/rke-clusters/_index)。

将数据存储到 iSCSI 卷时，您可能会遇到一个问题：`kubelet`无法自动连接 iSCSI 卷。失败是可能因为 iSCSI 启动器工具不兼容而导致的问题，因此您可以通过在集群的每个节点上安装 iSCSI 启动器工具来解决这个问题。

Rancher 启动的 Kubernetes 集群是借助 [iSCSI 启动器工具](http://www.open-iscsi.com/)把数据存储到 iSCSI 卷的，这个工具已经被嵌入到 kubelet 的`rancher/hyperkube` Docker 镜像中。该工具从每个 kubelet（即**启动器**）中发起与 iSCSI 卷（即**目标**）的会话。但是，在某些情况下，启动器和目标上安装的 iSCSI 启动器工具的版本可能不匹配，从而导致连接失败。

如果您遇到这个问题，您可以通过在集群的每个节点上安装启动器工具来解决。您可以通过登录到节点并输入以下命令之一来安装 iSCSI 启动器工具：

| 平台          | 包名                    | 安装指令                               |
| ------------- | ----------------------- | -------------------------------------- |
| Ubuntu/Debian | `open-iscsi`            | `sudo apt install open-iscsi`          |
| RHEL          | `iscsi-initiator-utils` | `yum install iscsi-initiator-utils -y` |

在节点上安装启动器工具后，编辑集群的 YAML，编辑 kubelet 配置以安装 iSCSI 二进制文件和配置，如下面的所示。

> **注意：**
>
> 在更新 Kubernetes YAML 以挂载 iSCSI 二进制文件和配置之前，请确保在集群节点上安装了`open-iscsi`（deb）或`iscsi-initiator-utils`（yum）软件包。如果**之前**没有安装此软件包，更新 YAML 会导致 Docker 自动在每个节点上创建目录和文件，并且将不允许该软件包再被成功安装。

```yalml
services:
  kubelet:
    extra_binds:
      - "/etc/iscsi:/etc/iscsi"
      - "/sbin/iscsiadm:/sbin/iscsiadm"
```
