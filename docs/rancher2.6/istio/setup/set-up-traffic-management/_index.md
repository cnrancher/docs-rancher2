---
title: 5. 设置 Istio 的流量管理组件
weight: 6
---

Istio 中流量管理的一个核心优势是允许动态请求路由。动态请求路由通常应用于金丝雀部署和蓝/绿部署等。Istio 流量管理中的两个关键资源是*虚拟服务*和*目标规则*。

- [虚拟服务](https://istio.io/docs/reference/config/networking/v1alpha3/virtual-service/)：拦截并将流量重定向到你的 Kubernetes Service 上。这样，你可以将部分请求流量分配到不同的服务上。你可以使用这些服务来定义一组路由规则，用于主机寻址。
- [目标规则](https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/)：作为唯一可信来源，表明哪些服务版本可用于接收虚拟服务的流量。你可以使用这些资源来定义策略，这些策略适用于路由发生后用于服务的流量。

本文介绍如何在示例 BookInfo 应用中添加与 `reviews` 微服务对应的虚拟服务示例。此服务的目的是在 `reviews` 服务的两个版本之间划分流量。

在这个示例中，我们将流量带到 `reviews` 服务中并拦截流量，这样，50% 的流量会流向服务的 `v1`，另外 50% 的流量会流向 `v2 `。

部署这个虚拟服务后，我们将生成流量，并通过 Kiali 可视化看到流量平均路由到服务的两个版本中。

要为 `reviews` 服务部署虚拟服务和目标规则：
1. 点击 **☰ > 集群管理**。
1. 转到安装了 Istio 的集群，然后单击 **Explore**。
1. 在安装了 Istio 的集群中，点击左侧导航栏中的 **Istio > DestinationRules**。
1. 单击**创建**。
1. 复制并粘贴下面的 DestinationRule YAML。
1. 单击**创建**。
1. 单击**以 YAML 文件编辑**并使用此配置：

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
1. 单击**创建**。

然后，部署提供利用 DestinationRule 的流量路由的 VirtualService：

1. 单击侧导航栏中的 **VirtualService**。
1. 单击**使用 YAML 文件创建**。
1. 复制并粘贴下面的 VirtualService YAML。
1. 单击**创建**。

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

**结果**：生成流到该服务的流量时（例如，刷新 Ingress Gateway URL），你可以在 Kiali 流量图中看到流到 `reviews` 服务的流量被平均分配到了 `v1` 和 `v3`。

### 后续步骤
[生成和查看流量]({{<baseurl>}}/rancher/v2.6/en/istio/setup/view-traffic)
