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

嵌入式 etcd (HA) 在速度较慢的磁盘上可能会出现性能问题，例如使用 SD 卡运行的 Raspberry Pi。
:::

要在这种模式下运行 K3s，你必须有奇数的 server 节点。我们建议从三个节点开始。

要开始运行，首先启动一个 server 节点，使用`cluster-init`标志来启用集群，并使用一个标记作为共享的密钥来加入其他服务器到集群中。

```
K3S_TOKEN=SECRET k3s server --cluster-init
```

启动第一台 server 后，使用共享密钥将第二台和第三台 server 加入集群。

```
K3S_TOKEN=SECRET k3s server --server https://<ip or hostname of server1>:6443
```

现在你有了一个高可用的 control-plane。将额外的工作节点加入到集群中，步骤与单个 server 集群相同。

有几个配置标志在所有 server 节点中必须是相同的：

- 与网络有关的标志：`--cluster-dns`, `--cluster-domain`, `--cluster-cidr`, `--service-cidr`
- 控制某些组件的部署的标志：`--disable-helm-controller`, `--disable-kube-proxy`, `--disable-network-policy`和任何传递给`--disable`的组件
- 与功能相关的标志：`--secrets-encryption`

## 现有集群

如果你有一个使用默认嵌入式 SQLite 数据库的现有集群，你可以通过使用 `--cluster-init` 标志重新启动你的 K3s server 来将其转换为 etcd。完成此操作后，你将能够如上所述添加其他实例。

> **重要：** K3s v1.22.2 及更新版本支持从 SQLite 迁移到 etcd。如果您将 `--cluster-init` 添加到现有 server，旧版本将创建一个新的空数据存储。
