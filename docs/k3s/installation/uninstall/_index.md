---
title: 卸载 K3s
weight: 61
---

如果您使用安装脚本安装了 K3s，那么在安装过程中会生成一个卸载 K3s 的脚本。

> 卸载 K3s 会删除集群数据和所有脚本。要使用不同的安装选项重新启动集群，请使用不同的标志重新运行安装脚本。

要从 server 节点卸载 K3s，请运行：

```
/usr/local/bin/k3s-uninstall.sh
```

要从 agent 节点卸载 K3s，请运行：

```
/usr/local/bin/k3s-agent-uninstall.sh
```
