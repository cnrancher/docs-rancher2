---
title: GlusterFS 卷
weight: 5000
---

> 本文仅适用于 [RKE 集群]({{<baseurl>}}/rancher/v2.6/en/cluster-provisioning/rke-clusters/)。

在将数据存储在 GlusterFS 卷上的集群中，你可能会遇到重启 `kubelet` 后 pod 无法挂载卷的问题。`kubelet` 的日志将显示 `transport endpoint is not connected`。为了避免这种情况，你可以在集群中将 `systemd-run` 二进制文件挂载到 `kubelet` 容器中。在更改集群配置之前有两个要求：

- 该节点需要安装了 `systemd-run` 二进制文件（可以通过在每个集群节点上运行 `which systemd-run` 命令来检查）。
- `systemd-run` 二进制文件需要与 hyperkube 镜像所基于的 Debian OS 兼容（可以通过在每个集群节点上运行以下命令来检查，请将镜像标签替换为你想要的 Kubernetes 版本）：

```
docker run -v /usr/bin/systemd-run:/usr/bin/systemd-run --entrypoint /usr/bin/systemd-run rancher/hyperkube:v1.16.2-rancher1 --version
```

> **注意**：
>
> 在更新 Kubernetes YAML 以挂载 `systemd-run` 二进制文件之前，请确保在集群节点上安装了 `systemd` 包。如果在绑定挂载创建到你的 Kubernetes YAML _之前_ 未安装此包，Docker 将自动在每个节点上创建目录和文件，并且不允许包安装成功。

```
services:
  kubelet:
    extra_binds:
      - "/usr/bin/systemd-run:/usr/bin/systemd-run"
```

集群完成配置后，你可以通过查找以下日志来检查 `kubelet` 容器日志记录，从而查看该功能是否已激活：

```
Detected OS with systemd
```
