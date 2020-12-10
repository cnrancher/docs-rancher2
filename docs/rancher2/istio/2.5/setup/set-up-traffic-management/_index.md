---
title: 设置 Istio 的流量管理组件
description: Istio 中流量管理的一个核心优势是它允许动态请求路由。动态请求路由的一些常见应用包括金丝雀部署和蓝绿部署。Istio 流量管理中的两个关键资源是virtual service和destination rule。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - rancher 2.5
  - Istio
  - 配置 Istio
  - 设置 Istio 的流量管理组件
---

## 概述

Istio 中流量管理的一个核心优势是它允许动态请求路由。动态请求路由的一些常见应用包括金丝雀部署和蓝绿部署。Istio 流量管理中的两个关键资源是**virtual service**和**destination rule**：

- [virtual service](https://istio.io/docs/reference/config/networking/v1alpha3/virtual-service/)拦截并引导流量到你的 Kubernetes 服务，允许你将请求中的流量百分比分配给不同的服务。您可以使用它们来定义一组路由规则，以便在主机被寻址时应用。
- [destination rule](https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/)作为关于哪些服务版本可用于接收来自虚拟服务的流量的单一真相来源。您可以使用这些资源来定义策略，这些策略适用于路由发生后打算用于服务的流量。

本节介绍了如何添加与示例 BookInfo 应用程序中的 `reviews`微服务相对应的虚拟服务示例。该服务的目的是在`reviews`服务的两个版本之间分配流量。

在这个例子中，我们把流量带到`reviews`服务，并拦截它，使 50%的流量流向服务的`v1`，50%的流量流向`v2`。

部署完这个虚拟服务后，我们会产生流量，从 Kiali 可视化中可以看到，流量被均匀地路由到两个版本的服务之间。

## 操作步骤

### 创建 Istio

1. 从**集群资源管理器**，从导航下拉菜单中选择**Istio**。
1. 点击侧面导航栏中的**DestinationRule**。
1. 单击**Create from Yaml**。
1. 复制并粘贴下面提供的 DestinationRule yaml。
1. 点击**Create**。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
    - name: v3
      labels:
        version: v3
```

### 部署 VirtualService

然后部署 VirtualService，提供利用 DestinationRule 的流量路由。

1. 点击侧面导航栏中的**VirtualService**。
1. 点击**Create from Yaml**。
1. 复制并粘贴下面提供的 VirtualService yaml。
1. 点击**Create**。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 50
        - destination:
            host: reviews
            subset: v3
          weight: 50
---

```

**结果：**当你为该服务产生流量时（例如，通过刷新入口网关 URL），Kiali 流量图将反映出`reviews`服务的流量在`v1`和 `v3`之间平均分配。

## 后续操作

[查看 Istio 管理的流量](/docs/rancher2/istio/2.5/setup/view-traffic/_index)
