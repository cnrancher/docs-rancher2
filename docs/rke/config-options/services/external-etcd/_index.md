---
title: 外部etcd
---

## 概述

默认情况下，RKE 会启动 etcd 服务器，但 RKE 也支持使用外部 etcd。RKE 只支持连接到启用 TLS 的 etcd 设置。

> **注意：** RKE 不接受外部 etcd 服务器与[节点](/docs/rke/config-options/nodes/_index)一起使用`etcd`角色。

```yaml
services:
  etcd:
    path: /etcdcluster
    external_urls:
      - https://etcd-example.com:2379
    ca_cert: |-
      -----BEGIN CERTIFICATE-----
      xxxxxxxxxx
      -----END CERTIFICATE-----
    cert: |-
      -----BEGIN CERTIFICATE-----
      xxxxxxxxxx
      -----END CERTIFICATE-----
    key: |-
      -----BEGIN PRIVATE KEY-----
      xxxxxxxxxx
      -----END PRIVATE KEY-----
```

## 外部 etcd 选项

### 路径

`path`定义了 etcd 集群在端点上的位置。

### 外部 URL

`external_urls`是 etcd 集群的托管端点。etcd 集群可以有多个端点。

### CA Cert/Cert/KEY

用于验证和访问 etcd 服务的证书和私钥。
