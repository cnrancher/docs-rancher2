---
title: "嵌入式DB的高可用（实验）"
weight: 40
---

从v1.0.0开始，K3s预览版支持运行高可用的控制平面，无需外部数据库。这意味着不需要管理外部etcd或SQL数据存储即可运行可靠的生产级设置。

这种架构是通过在K3s server进程中嵌入dqlite数据库来实现的。DQLite是 "分布式SQLite"的简称。根据 https://dqlite.io 的说法，它是 "具有Raft共识的快速，嵌入式，持久SQL数据库，非常适合容错的IoT和Edge设备。" 这使得它非常适合K3s。

要在这种模式下运行K3s，你必须有奇数的server节点。我们建议从三个节点开始。

首先使用`cluster-init`标志启动server节点以启用集群功能，并使用一个token作为共享密钥将其他server节点加入到集群中
```
K3S_TOKEN=SECRET k3s server --cluster-init
```

启动第一台server后，使用共享秘密将第二台和第三台server加入到集群中：
```
K3S_TOKEN=SECRET k3s server --server https://<ip or hostname of server1>:6443
```

现在，你有了一个高可用的控制平面。将其他的工作节点加入到集群中的步骤与单个server集群的步骤是相同的。
