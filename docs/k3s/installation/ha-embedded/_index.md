---
title: "嵌入式DB的高可用（实验）"
description: 从v1.0.0开始，K3s预览版支持运行高可用的控制平面，无需外部数据库。这意味着不需要管理外部etcd或SQL数据存储即可运行可靠的生产级设置。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 安装介绍
  - 嵌入式DB的高可用
---

从 v1.0.0 开始，K3s 预览版支持运行高可用的控制平面，无需外部数据库。这意味着不需要管理外部 etcd 或 SQL 数据存储即可运行可靠的生产级设置。

这种架构是通过在 K3s server 进程中嵌入 dqlite 数据库来实现的。DQLite 是 "分布式 SQLite"的简称。根据 https://dqlite.io 的说法，它是 "具有 Raft 共识的快速，嵌入式，持久 SQL 数据库，非常适合容错的 IoT 和 Edge 设备。" 这使得它非常适合 K3s。

要在这种模式下运行 K3s，你必须有奇数的 server 节点。我们建议从三个节点开始。

首先使用`cluster-init`标志启动 server 节点以启用集群功能，并使用一个 token 作为共享密钥将其他 server 节点加入到集群中

```
K3S_TOKEN=SECRET k3s server --cluster-init
```

启动第一台 server 后，使用共享秘密将第二台和第三台 server 加入到集群中：

```
K3S_TOKEN=SECRET k3s server --server https://<ip or hostname of server1>:6443
```

现在，你有了一个高可用的控制平面。将其他的工作节点加入到集群中的步骤与单个 server 集群的步骤是相同的。
