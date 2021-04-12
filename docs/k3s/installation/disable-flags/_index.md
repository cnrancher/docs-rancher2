---
title: 禁用组件标志
description: 使用 `--cluster-init` 参数启动 K3s server 时，它会运行包括 API Server、Controller Manager、Scheduler 和 ETCD 在内的所有 controlplane 组件。但是，您可以指定只使用其中的一些组件运行 Server 节点。本文将解释如何使用指定的一些组件运行 Server 节点。
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
  - 禁用组件标志
---

## 概述

使用 `--cluster-init` 参数启动 K3s server 时，它会运行包括 API Server、Controller Manager、Scheduler 和 ETCD 在内的所有 controlplane 组件。但是，您可以指定只使用其中的一些组件运行 Server 节点。本文将解释如何使用指定的一些组件运行 Server 节点。

## 只使用 ETCD 组件运行节点

本文档假设你通过向 Server 进程传递`---cluster-init`标志来运行内嵌 etcd 的 K3s Server。

如果要运行一个只有 ETCD 组件的 K3s Server，你可以通过`--disable-api-server --disable-controller-manager --disable-scheduler`标志到 k3s，这样会生成一个只有 etcd 的 Server 节点，例如：

```bash
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-api-server --disable-controller-manager --disable-scheduler
```

完成上述步骤之后。就可以正常加入其他节点到集群中。

## 禁用 ETCD 组件

你也可以禁用 Server 节点中的 etcd，这将导致 k3 sServer 运行**除了 etcd 以外的控制组件**，这可以通过运行 k3s Server 的标志`--disable-etcd`来实现，例如，将另一个只有控制组件的节点加入到上一节创建的 etcd 节点中：

```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443
```

最终的结果将是两个节点，其中一个是 etcd only 节点，另一个是 controlplane only 节点，如果你检查节点列表，你应该看到类似下面的返回结果：

```bash
kubectl get nodes
NAME              STATUS   ROLES                       AGE     VERSION
ip-172-31-13-32   Ready    etcd                        5h39m   v1.20.4+k3s1
ip-172-31-14-69   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

:::note 说明
你只能在有 api 运行的 k3s Server 上运行`kubectl`命令，你不能在只有 etcd 的节点上运行`kubectl`命令。
:::

### 重新启用控制组件

在这两种情况下，你可以随时重新启用已经禁用的组件，只需删除相应的禁用标志，所以例如，如果你想把只有 etcd 的节点恢复到有所有组件的完整的 k3s Server，你只需删除以下 3 个标志`--禁用api-server --禁用controller-manager --禁用scheduler`，所以在我们的例子中，要把节点`ip-172-31-13-32`恢复到完整的 k3s Server，你只需重新运行没有禁用标志的 curl 命令：

```bash
curl -fL https://get.k3s.io | sh -s - server --cluster-init
```

你会发现所有的组件都重新启动了，你可以再次运行 kubectl 命令：

```bash
kubectl get nodes
NAME              STATUS   ROLES                       AGE     VERSION
ip-172-31-13-32   Ready    control-plane,etcd,master   5h45m   v1.20.4+k3s1
ip-172-31-14-69   Ready    control-plane,master        5h45m   v1.20.4+k3s1
```

Notice that role labels has been re-added to the node `ip-172-31-13-32` with the correct labels (control-plane,etcd,master).

## 使用 config file 添加禁用标志

在前面的任何一种情况下，你都可以使用配置文件来代替运行带有相关标志的 curl 命令，例如要运行一个只有 etcd 的节点，你可以在`/etc/rancher/k3s/config.yaml`文件中添加以下选项：

```bash
---
disable-api-server: true
disable-controller-manager: true
disable-scheduler: true
cluster-init: true
```

然后用 curl 命令启动 K3s，不需要任何参数：

```bash
curl -fL https://get.k3s.io | sh -
```
