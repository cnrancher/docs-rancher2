---
title: TLS 设置
descripition: 在 Rancher v2.1.7 中，默认 TLS 配置已更改为仅接受 TLS 1.2 和安全 TLS 密码套件。不支持 TLS 1.3 和 TLS 1.3 专用密码套件。通过将环境变量传递到 Rancher Server 容器来启用和配置审计日志。请参阅以下内容以启用安装。
---

更改默认的 TLS 设置取决于所选择的安装方法。

## 在高可用的 Kubernetes 集群中运行 Rancher

当你在 Kubernetes 集群内安装 Rancher 时，TLS 会在集群的 ingress controller 上 offloaded。可能的 TLS 设置取决于使用的 ingress controller：

- nginx-ingress-controller（RKE1 和 RKE2 的默认）。[默认的 TLS 版本和密码](https://kubernetes.github.io/ingress-nginx/user-guide/tls/#default-tls-version-and-ciphers)。
- traefik (K3s 的默认版本)。[TLS 选项](https://doc.traefik.io/traefik/https/tls/#tls-options)。

## 在单个 Docker 容器中运行 Rancher

默认的 TLS 配置只接受 TLS 1.2 和安全 TLS 密码套件。你可以通过设置以下环境变量来改变:

| 参数                     | 描述                | 默认                                                                                                                                                                                                                                                     | 可用选项                                                                      |
|:-------------------------|:--------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------|
| `CATTLE_TLS_MIN_VERSION` | 最小 TLS 版本       | `1.2`                                                                                                                                                                                                                                                    | `1.0`, `1.1`, `1.2`, `1.3`。                                                  |
| `CATTLE_TLS_CIPHERS`     | 允许的 TLS 密码套件 | `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`, `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`, `TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305`, `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`, `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`, `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305` | 参见 [Golang tls constants](https://golang.org/pkg/crypto/tls/#pkg-constants) |
