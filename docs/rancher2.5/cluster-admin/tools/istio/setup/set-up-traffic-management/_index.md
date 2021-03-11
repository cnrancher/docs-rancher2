---
title: 6、设置 Istio 的流量管理组件
description: Istio 中流量管理的主要优势在于它允许动态请求路由。动态请求路由的一些常见应用包括金丝雀部署和蓝/绿部署。Istio 流量管理中的两个关键资源是虚拟服务（virtual services）和目标规则（destination rules）。本节介绍如何在示例 BookInfo 应用中添加与`reviews`微服务相对应的示例虚拟服务。该服务的目的是在两个版本的`reviews`服务之间分配流量。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - Istio使用指南
  - 设置 Istio 的流量管理组件
---

Istio 中流量管理的主要优势在于它允许动态请求路由。动态请求路由的一些常见应用包括金丝雀部署和蓝/绿部署。Istio 流量管理中的两个关键资源是*虚拟服务（virtual services）*和*目标规则（destination rules）*。

- [虚拟服务](https://istio.io/docs/reference/config/networking/v1alpha3/virtual-service/)拦截流量并将其定向到您的 Kubernetes 服务，从而使您可以将流量百分比从请求分配到其他服务。您可以使用它们来定义一组路由规则，以在寻址主机时应用。
- [目标规则](https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/)可以作为有关哪些服务版本可用于接收虚拟服务流量的唯一来源。您可以使用这些资源来定义策略，该策略适用于路由发生后的服务流量。

本节介绍如何在示例 BookInfo 应用中添加与`reviews`微服务相对应的示例虚拟服务。该服务的目的是在两个版本的`reviews`服务之间分配流量。

在此示例中，我们将流量转到`reviews`服务，并对其进行拦截，以使流量的 50％到达服务的`v1`版本，而 50％到达`v2`版本。

部署此虚拟服务后，我们将生成流量，并从 Kiali 可视化中看到流量在服务的两个版本之间平均路由。

1. 转到项目视图，然后单击**导入 YAML**。
1. 将下面的资源复制到表单中。
1. 单击**导入**。

```
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

**结果：** 当您为此服务生成流量时（例如通过刷新入口网关 URL），Kiali 流量图将反映出对`reviews`服务的流量在`v1`和`v3`之间平均分配。

#### [下一步：产生并查看流量](/docs/rancher2/istio/2.3.x-2.4.x/setup/view-traffic/_index)
