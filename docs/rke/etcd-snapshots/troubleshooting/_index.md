---
title: 问题排查
description: 本文提供了 RKE v0.1.9+ 和 RKE v0.1.8 的常见问题和解决方法。
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
  - RKE
  - 备份和恢复
  - 问题排查
---

本文提供了 RKE v0.1.9+ 和 RKE v0.1.8 的常见问题和解决方法。

从 RKE**v0.1.9**开始，不论恢复节点的结果是成功还是失败，**rke-bundle-cert**容器都会被移除，无法依据完成恢复节点的流程以后，**rke-bundle-cert**容器是否依然存在，来确认恢复节点成功或失败。您需要查看 RKE 的日志排查问题。

RKE**v0.1.8**以及之前的版本，如果恢复 etcd 节点失败了，**rke-bundle-cert**容器不会被移除。完成恢复节点的流程后，如果**rke-bundle-cert**容器依然存在，则表示恢复失败。如果您使用的 RKE 是**v0.1.8**以及之前的版本，并且在使用快照恢复 etcd 节点时碰到问题，您可以对每个 etcd 节点运行以下命令，然后再尝试恢复节点。

```shell
docker container rm --force rke-bundle-cert
```

当 etcd 节点备份成功或恢复成功时，**rke-bundle-cert**容器会被移除。如果在备份节点的时候出现问题，**rke-bundle-cert**容器则不会被移除。您可以查看日志或这个容器，看看是什么原因导致备份或恢复失败。

```shell
docker container logs --follow rke-bundle-cert
docker container inspect rke-bundle-cert
```

在问题排查的过程，请重点关注容器数量的变化和`pki.bundle.tar.gz`文件的位置。
