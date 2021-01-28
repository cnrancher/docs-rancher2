---
title: "嵌入式DB的高可用"
description: 从v1.0.0开始，K3s预览版支持运行高可用的control-plane，无需外部数据库。这意味着不需要管理外部etcd或SQL数据存储即可运行可靠的生产级设置。
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

:::note 注意：

从 v1.19.5+k3s1 版本开始，K3s 已添加了对嵌入式 etcd 的完全支持。从 v1.19.1 到 v1.19.4 版本只提供了对嵌入式 etcd 的实验性支持。在 K3s v1.19.1 版本中，嵌入式 etcd 取代了实验性的 Dqlite。这是一个突破性的变化。请注意，不支持从实验性 Dqlite 升级到嵌入式 etcd。如果你尝试升级，升级将不会成功，并且数据将会丢失。
:::

要在这种模式下运行 K3s，你必须有奇数的服务器节点。我们建议从三个节点开始。

要开始运行，首先启动一个服务器节点，使用`cluster-init`标志来启用集群，并使用一个标记作为共享的密钥来加入其他服务器到集群中。

```
K3S_TOKEN=SECRET k3s server --cluster-init
```

启动第一台服务器后，使用共享密钥将第二台和第三台服务器加入集群。

```
K3S_TOKEN=SECRET k3s server --server https://<ip or hostname of server1>:6443。
```

现在你有了一个高可用的 control-plane。将额外的工作节点加入到集群中，步骤与单个服务器集群相同。
