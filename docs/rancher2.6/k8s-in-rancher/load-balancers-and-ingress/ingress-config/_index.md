---
title: Ingress 配置
description: Ingress 配置
weight: 9999
---

- [Kubernetes 1.21 中的 NGINX Ingress Controller 变更](#nginx-ingress-controller-changes-in-Kubernetes-v1-21)
- [自动生成 xip.io 主机名](#automatically-generate-a-xip-io-hostname)
- [指定要使用的主机名](#specify-a-hostname-to-use)
- [用作默认后端](#use-as-the-default-backend)
- [证书](#certificates)
- [标签和注释](#labels-and-annotations)

### Kubernetes 1.21 中的 NGINX Ingress Controller 变更

在 Kubernetes 1.21 及更高版本中，NGINX Ingress Controller 不再运行在 hostNetwork 中，而是将 hostPorts 用于端口 80 和端口 443。这样可以将 admission webhook 配置为使用 ClusterIP 访问，从而只在集群内部访问它。

## Ingress 规则配置

- [指定要使用的主机名](#specify-a-hostname-to-use)
- [用作默认后端](#use-as-the-default-backend)
- [证书](#certificates)
- [标签和注释](#labels-and-annotations)

### 指定要使用的主机名

如果使用此选项，Ingress 会将主机名请求路由到你指定的服务或工作负载。

1. 输入**请求主机**，你的 Ingress 会为它处理请求转发。例如，`www.mysite.com`。
1. 添加一个**目标服务**。
1. **可选**：如果你想在将请求发送到特定主机名路径时指定工作负载或服务，请为目标添加**路径**。例如，如果你希望将 `www.mysite.com/contact-us` 的请求发送到与 `www.mysite.com` 不同的服务，在**路径**字段中输入 `/contact-us`。通常情况下，你创建的第一条规则不包含路径。
1. 输入每个目标操作的**端口**号。
### 证书
> **注意**：你必须具有 SSL 证书，Ingress 可使用该证书来加密/解密通信。有关详细信息，请参阅[添加 SSL 证书]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/certificates/)。

1. 创建 Ingress 时，单击**证书**选项卡。
1. 单击**添加证书**。
1. 从下拉列表中选择一个**证书 - 密文名称**。
1. 使用加密通信进入主机。
1. 要添加使用证书的其他主机，请单击**添加主机**。

### 标签和注释

添加[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)和/或[注释](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)为你的 Ingress 提供元数据。

有关可用的注释列表，请参阅 [Nginx Ingress Controller 文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)。
