---
title: 外部etcd
description: 为了部署 Kubernetes，RKE 在节点上的 Docker 容器中部署了几个核心组件或服务。根据节点的角色，部署的容器可能不同。
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
  - 默认的Kubernetes服务
  - 外部etcd
---

## 概述

为了部署 Kubernetes，RKE 在节点上的 Docker 容器中部署了几个核心组件或服务。根据节点的角色，部署的容器可能不同。

**注意：** RKE 不接受外部 etcd 服务器与[节点](/docs/rke/config-options/nodes/_index)一起使用`etcd`角色。

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
