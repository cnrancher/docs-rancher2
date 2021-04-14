---
title: 认证方式
description: RKE 支持 x509 认证策略。您可以额外定义一个 SAN（Subject Alternative Names）列表，以添加到 Kubernetes API Server PKI 证书中。举个例子，这允许你通过负载均衡器而不是单个节点连接到你的 Kubernetes 集群 API Server。
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
  - RKE
  - 配置选项
  - 认证方式
---

RKE 支持 x509 认证策略。您可以额外定义一个 SAN（Subject Alternative Names）列表，以添加到 Kubernetes API Server PKI 证书中。举个例子，这允许你通过负载均衡器而不是单个节点连接到你的 Kubernetes 集群 API Server。

```yaml
authentication:
  strategy: x509
  sans:
    - "10.18.160.10"
    - "my-loadbalancer-1234567890.us-west-2.elb.amazonaws.com"
```

RKE 也支持 webhook 认证策略。通过在配置中使用`|`分隔符，可以同时启用 x509 和 webhook 策略。应提供 webhook 配置文件的内容，文件格式请参见[Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)。此外，还可以设置 webhook 认证响应的缓存超时。

```yaml
authentication:
  strategy: x509|webhook
  webhook:
    config_file: "...."
    cache_timeout: 5s
```
