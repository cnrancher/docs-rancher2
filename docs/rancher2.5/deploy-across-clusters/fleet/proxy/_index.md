---
title: 在代理后面使用 Fleet
description: 在本节中，您将学习如何在具有带有公共 IP 的 Rancher server 和没有公共 IP 但配置为使用代理的 Kubernetes 集群的设置中启用 Fleet。
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
  - 跨集群部署应用
  - Fleet
  - 在代理后面使用 Fleet
---

从 v2.5.8 版起可用。

在本节中，您将学习如何在具有带有公共 IP 的 Rancher server 和没有公共 IP 但配置为使用代理的 Kubernetes 集群的设置中启用 Fleet。

Rancher 不会与注册的下游集群建立连接。部署在下游集群上的 Rancher agent 必须能够与 Rancher 建立连接。

要设置 Fleet 在代理后面工作，你需要为下游集群设置**代理环境变量**。这些是集群级的配置选项。

通过 Rancher UI，你可以为任何集群类型配置这些环境变量，包括注册和自定义集群。这些变量可以在编辑现有集群或配置新集群时添加。

对于公共下游集群，只需[在 Rancher UI 中设置所需的环境变量](#在-rancher-ui-中设置环境变量)

对于私有节点或私有集群，环境变量需要在节点本身设置。然后从 Rancher UI 中配置环境变量，通常是在配置自定义集群或注册私有集群时进行。关于如何在 K3s Kubernetes 集群中的 Ubuntu 节点上设置环境变量的例子，见[本节。](#在私有节点上设置环境变量)

## 必要的环境变量

在为 agent 添加 Fleet agent 环境变量时，用你的私有 agent IP 替换<PROXY_IP>。

| 变量名称      | 值                                                                       |
| ------------- | ------------------------------------------------------------------------ |
| `http_proxy`  | http://<proxy_ip>:8888                                                   |
| `https_proxy` | http://<proxy_ip>:8888                                                   |
| `NO_PROXY`    | 127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16，.svc,.cluster.local |

## 在 Rancher UI 中设置环境变量

要将环境变量添加到现有集群中。

1. 在 Rancher UI 中，转到需要使用代理的 Kubernetes 集群的集群视图。
1. 单击**&#8942; > 编辑**。
1. 单击**高级选项**。
1. 单击**添加环境变量**。
1. 输入[必要的环境变量](#必要的环境变量)
1. 单击**保存。**

**结果：** Fleet agent 在代理后面工作。

## 在私有节点上设置环境变量

对于私有节点和私有集群，代理环境变量需要在节点本身设置，并从 Rancher UI 中配置。

这个例子显示了如何在 K3s Kubernetes 集群中的 Ubuntu 节点上设置环境变量。

```
ssh -o ForwardAgent=yes ubuntu@<public_proxy_ip>
ssh <k3s_ip>
export proxy_private_ip=<private_proxy_ip>
export HTTP_PROXY=http://${proxy_private_ip}:8888
export HTTPS_PROXY=http://${proxy_private_ip}:8888
export NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.svc,.cluster.local
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```
