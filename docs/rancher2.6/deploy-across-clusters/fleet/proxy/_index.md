---
title: 在代理后使用 Fleet
weight: 3
---

在本节中，你将学习如何在一个设置中启用 Fleet，该设置有一个具有公共 IP 的 Rancher Server，以及一个没有公共 IP 但配置为使用代理的 Kubernetes 集群。

Rancher 不会与已注册的下游集群建立连接。部署在下游集群上的 Rancher agent 必须能够与 Rancher 建立连接。

要让 Fleet 在代理后工作，你需要为下游集群设置 **Agent 环境变量**。以下是集群级别的配置选项。

你可以通过 Rancher UI 为任何集群类型（包括注册集群和自定义集群）配置这些环境变量。可以在编辑现有集群或配置新集群时添加变量。

对于公共下游集群，[在 Rancher UI 中设置必要的环境变量](#setting-environment-variables-in-the-rancher-ui)就足够了。

对于私有节点或私有集群，则需要在节点上设置环境变量。然后，在配置自定义集群或注册私有集群时，在 Rancher UI 中配置环境变量。有关如何在 K3s Kubernetes 集群中的 Ubuntu 节点上设置环境变量的示例，请参阅[本节](#setting-environment-variables-on-private-nodes)。

## 必要的环境变量

为代理添加 Fleet agent 环境变量时，将 <PROXY_IP> 替换为你的私有代理 IP。

| 变量名称 | 值 |
|------------------|--------|
| `HTTP_PROXY` | http://<PROXY_IP>:8888 |
| `HTTPS_PROXY` | http://<PROXY_IP>:8888 |
| `NO_PROXY` | 127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.svc,.cluster.local |

## 在 Rancher UI 中设置环境变量

要将环境变量添加到现有集群：

1. 点击 **☰ > 集群管理**。
1. 转到要添加环境变量的集群，然后单击 **⋮ > 编辑配置**。
1. 单击**高级选项**。
1. 单击**添加环境变量**。
1. 输入[必要的环境变量](#required-environment-variables)
1. 单击**保存**。

**结果**：Fleet agent 会在代理后工作。

## 在私有节点上设置环境变量

对于私有节点和私有集群，代理环境变量需要在节点本身上设置，以及从 Rancher UI 配置。

此示例显示了如何在 K3s Kubernetes 集群中的 Ubuntu 节点上设置环境变量：

```
ssh -o ForwardAgent=yes ubuntu@<public_proxy_ip>
ssh <k3s_ip>
export proxy_private_ip=<private_proxy_ip>
export HTTP_PROXY=http://${proxy_private_ip}:8888
export HTTPS_PROXY=http://${proxy_private_ip}:8888
export NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.svc,.cluster.local
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```
