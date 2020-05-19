---
title: TLS 设置
descripition: 在 Rancher v2.1.7 中，默认 TLS 配置已更改为仅接受 TLS 1.2 和安全 TLS 密码套件。不支持 TLS 1.3 和 TLS 1.3 专用密码套件。通过将环境变量传递到 Rancher Server 容器来启用和配置审计日志。请参阅以下内容以启用安装。
---

_自 v2.1.7 起可用_

在 Rancher v2.1.7 中，默认 TLS 配置已更改为**仅接受**TLS 1.2 和安全 TLS 密码套件，**不支持**TLS 1.3 和 TLS 1.3 专用密码套件。

## 配置 TLS 设置

可通过将环境变量传递到 Rancher Server 容器来启用和配置审计日志。请参阅以下内容以启用安装。

- [使用 Docker 在单个节点上安装 Rancher](/docs/installation/other-installation-methods/single-node-docker/_index)

- [在 Kubernetes 上安装 Rancher](/docs/installation/options/chart-options/_index)

## TLS 设置

| 参数                     | 描述                | 默认值                                                                                                                                                                                                                                                                       | 可用选项                                                                   |
| :----------------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `CATTLE_TLS_MIN_VERSION` | 最低 TLS 版本       | `1.2`                                                                                                                                                                                                                                                                        | `1.0`, `1.1`, `1.2`                                                        |
| `CATTLE_TLS_CIPHERS`     | 允许的 TLS 密码套件 | `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,`<br/>`TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,`<br/>`TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,`<br/>`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,`<br/>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,`<br/>`TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305` | 请参阅 [Golang tls 常量](https://golang.org/pkg/crypto/tls/#pkg-constants) |

## 旧版配置

如果您需要按照 Rancher v2.1.7 之前的方式配置 TLS，请使用以下设置：

| 参数                     | 旧版的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CATTLE_TLS_MIN_VERSION` | `1.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `CATTLE_TLS_CIPHERS`     | `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,`<br/>`TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,`<br/>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,`<br/>`TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,`<br/>`TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,`<br/>`TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,`<br/>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,`<br/>`TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,`<br/>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,`<br/>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,`<br/>`TLS_RSA_WITH_AES_128_GCM_SHA256,`<br/>`TLS_RSA_WITH_AES_256_GCM_SHA384,`<br/>`TLS_RSA_WITH_AES_128_CBC_SHA,`<br/>`TLS_RSA_WITH_AES_256_CBC_SHA,`<br/>`TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,`<br/>`TLS_RSA_WITH_3DES_EDE_CBC_SHA` |
