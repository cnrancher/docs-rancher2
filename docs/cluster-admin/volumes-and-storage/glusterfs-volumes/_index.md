---
title: GlusterFS 卷
---

> 本章节仅适用于[由 RKE 创建的集群](/docs/cluster-provisioning/rke-clusters/_index)。

将数据存储到 GlusterFS 卷时，你可能会遇到一个问题：在重启`kubelet`之后，Pod 无法安装卷。`kubelet`的日志记录将显示：`transport endpoint is not connected`。为了防止这种情况的发生，你可以把集群主机上的`systemd-run`挂载到所有的`kubelet`容器里。在做这个操作之前，有两个要求：

- 集群主机需要安装了`systemd-run`，可以在每台主机上执行`which systemd-run`来验证。
- `systemd-run`需要兼容 Debian 操作系统，可以在每台主机上执行下面的命令来进行验证，请根据需要更改 hyperkube 的镜像标签。

  ```
  docker run -v /usr/bin/systemd-run:/usr/bin/systemd-run --entrypoint /usr/bin/systemd-run rancher/hyperkube:v1.16.2-rancher1 --version
  ```

> **注意：**
>
> 在更新 Kubernetes YAML 以挂载`systemd-run`之前，请确保`systemd`软件包已安装在集群节点上。如果**之前**没有安装此软件包，更新 YAML 会导致 Docker 自动在每个节点上创建目录和文件，并且将不允许该软件包再被成功安装。

```
services:
  kubelet:
    extra_binds:
      - "/usr/bin/systemd-run:/usr/bin/systemd-run"
```

当集群配置完成后，可以通过查找以下日志行来检查`kubelet`容器的日志，以确认该功能是否已激活。

```
Detected OS with systemd
```
