---
title: TLS 设置
weight: 3
---

更改默认 TLS 设置的方法取决于它的安装方式。

# 在高可用 Kubernetes 集群中运行 Rancher

当你在 Kubernetes 集群内安装 Rancher 时，TLS 会在集群的 Ingress Controller 上卸载。可用的 TLS 设置取决于使用的 Ingress Controller：

* nginx-ingress-controller（RKE1 和 RKE2 默认）：[默认的 TLS 版本和密码](https://kubernetes.github.io/ingress-nginx/user-guide/tls/#default-tls-version-and-ciphers)。
* traefik（K3s 默认）：[TLS 选项](https://doc.traefik.io/traefik/https/tls/#tls-options)。

# 在单个 Docker 容器中运行 Rancher

默认 TLS 配置仅支持 TLS 1.2 和安全的 TLS 密码套件。你可以通过设置以下环境变量来更改此配置：

| 参数 | 描述 | 默认 | 可用选项 |
|-----|-----|-----|-----|
| `CATTLE_TLS_MIN_VERSION` | 最小 TLS 版本 | `1.2` | `1.0`, `1.1`, `1.2`, `1.3` |
| `CATTLE_TLS_CIPHERS` | 支持的 TLS 密码套件 | `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`,<br/>`TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`,<br/>`TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305`,<br/>`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`,<br/>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`,<br/>`TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305` | 详情请参见 [Golang TLS 常量](https://golang.org/pkg/crypto/tls/#pkg-constants)。 |
