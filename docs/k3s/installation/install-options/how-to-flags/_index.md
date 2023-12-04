---
title: 如何使用标志和环境变量
description: 在整个 K3s 文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。下面的例子展示了这些选项如何以K3S_KUBECONFIG_MODE方式或INSTALL_K3S_EXECINSTALL_K3S_EXEC方式传递命令标志和环境变量。
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
  - 如何使用标志和环境变量
---

在整个 K3s 文档中，你会看到一些选项可以作为命令标志和环境变量传递进来。下面的例子展示了这些选项如何以两种方式传递。

## 示例 A： K3S_KUBECONFIG_MODE

允许写入 kubeconfig 文件的选项对于允许将 K3s 集群导入 Rancher 很有用。以下是传递该选项的两种方式。

使用标志 `--write-kubeconfig-mode 644`：

```bash
$ curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```

使用环境变量 `K3S_KUBECONFIG_MODE`：

```bash
$ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s -
```

## 示例 B：INSTALL_K3S_EXEC

如果这个命令里没有指定为 server 或 agent，则如果设置了`K3S_URL`，则默认为 "agent"。如果没有设置，则默认为 "server"。

最后的 systemd 命令解析为这个环境变量和脚本参数的组合。为了说明这一点，以下命令的结果与注册一个没有 flannel 的 server 的行为相同：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
curl -sfL https://get.k3s.io | sh -s - server --flannel-backend none
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none
```

## 示例 C: CONFIG 文件

在安装 k3s 之前，你可以创建一个名为 `config.yaml` 的文件，其中包含与 CLI 标志相匹配的字段。该文件位于：`/etc/rancher/k3s/config.yaml`，K3s 在启动后会加载这个文件中的配置选项。

配置文件中的字段从匹配的 CLI 标志中删除开头的`--`。例如：

```
write-kubeconfig-mode: 644
token: "secret"
node-ip: 10.0.10.22,2a05:d012:c6f:4655:d73c:c825:a184:1b75
cluster-cidr: 10.42.0.0/16,2001:cafe:42:0::/56
service-cidr: 10.43.0.0/16,2001:cafe:42:1::/112
```
