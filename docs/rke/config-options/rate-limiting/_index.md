---
title: 配置事件速率限制
description: 使用 `EventRateLimit`接纳控制对 API 服务器在特定时间段内接受的事件数量进行限制。在一个大型多租户集群中，可能会有一小部分租户用事件请求淹没服务器，这可能会对集群的整体性能产生重大影响。因此，建议限制 API 服务器接受事件的速率。
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
  - 配置事件速率限制
---

## 概述

使用 `EventRateLimit`接纳控制对 API 服务器在特定时间段内接受的事件数量进行限制。在一个大型多租户集群中，可能会有一小部分租户用事件请求淹没服务器，这可能会对集群的整体性能产生重大影响。因此，建议限制 API 服务器接受事件的速率。

为了满足 CIS（互联网安全中心）Kubernetes 基准，您需要配置事件速率限制。事件速率限制对应于 CIS Kubernetes Benchmark 1.1.36 - 确保接纳控制插件`EventRateLimit`被设置。

可以为服务器、命名空间、用户或源和对象的组合配置速率限制。

配置细节请参考[Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#eventratelimit)。

## 配置示例

`cluster.yml`中的以下配置可用于默认启用事件速率限制。

```yaml
services:
  kube-api:
    event_rate_limit:
      enabled: true
```

当启用事件速率限制时，您应该可以在`/etc/kubernetes/admission.yaml`看到默认值。

```yaml
---
plugins:
  - configuration:
      apiVersion: eventratelimit.admission.k8s.io/v1alpha1
      kind: Configuration
      limits:
        - burst: 20000
          qps: 5000
          type: Server
```

要自定义事件速率限制，必须在`configuration`指令中提供完整配置的 Kubernetes 资源。

```yaml
services:
  kube-api:
    event_rate_limit:
      enabled: true
      configuration:
        apiVersion: eventratelimit.admission.k8s.io/v1alpha1
        kind: Configuration
        limits:
          - type: Server
            qps: 6000
            burst: 30000
```
