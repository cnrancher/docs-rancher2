---
title:  iSCSI 卷
weight: 6000
---

在将数据存储在 iSCSI 卷上的 [Rancher 启动的 Kubernetes 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)中，你可能会遇到 kubelet 无法自动连接 iSCSI 卷的问题。成此问题的原因很可能是 iSCSI 启动器工具不兼容。你可以在每个集群节点上安装 iSCSI 启动器工具来解决此问题。

将数据存储到 iSCSI 卷的由 Rancher 启动的 Kubernetes 集群使用 [iSCSI 启动器工具](http://www.open-iscsi.com/)，该工具嵌入在 kubelet 的 `rancher/hyperkube` Docker 镜像中。该工具从每个 kubelet（即 _initiator_）发现并发起与 iSCSI 卷（即 _target_）的会话。但是，在某些情况下，initiator 和 target 上安装的 iSCSI 启动器工具的版本可能不匹配，从而导致连接失败。

如果你遇到此问题，你可以在集群中的每个节点上安装启动器工具来解决该问题。你可以通过登录到集群节点并输入以下其中一个命令来安装 iSCSI 启动器工具：

| 平台 | 包名 | 安装命令 |
| ------------- | ----------------------- | -------------------------------------- |
| Ubuntu/Debian | `open-iscsi` | `sudo apt install open-iscsi` |
| RHEL | `iscsi-initiator-utils` | `yum install iscsi-initiator-utils -y` |


在节点上安装启动器工具后，编辑集群的 YAML，编辑 kubelet 配置以挂载 iSCSI 二进制文件和配置，如下面的示例所示。

> **注意**：
>
> - 在更新 Kubernetes YAML 以挂载 iSCSI 二进制文件和配置之前，请确保已将 `open-iscsi`（deb）或 `iscsi-initiator-utils`（yum）安装到你的集群节点。如果在绑定挂载创建到你的 Kubernetes YAML _之前_ 未安装此包，Docker 将自动在每个节点上创建目录和文件，并且不允许包安装成功。</br>
>    </br>
>
> - 下面的示例 YAML 不适用于 K3s，仅适用于 RKE 集群。由于 K3s kubelet 不在容器中运行，因此不需要添加额外的绑定。但是，所有 iSCSI 工具仍必须安装在你的 K3s 节点上。

```
services:
  kubelet:
    extra_binds:
      - "/etc/iscsi:/etc/iscsi"
      - "/sbin/iscsiadm:/sbin/iscsiadm"
```
