---
title: 4. 设置 Istio Gateway
weight: 5
---

每个集群的网关可以有自己的端口或负载均衡器，这与服务网格无关。默认情况下，每个 Rancher 配置的集群都有一个 NGINX Ingress Controller 来允许流量进入集群。

无论是否安装了 Istio，你都可以使用 NGINX Ingress Controller。如果这是你集群的唯一网关，Istio 将能够将流量从集群内部的服务路由到集群内部的另一个服务，但 Istio 将无法接收来自集群外部的流量。

要让 Istio 接收外部流量，你需要启用 Istio 的网关，作为外部流量的南北代理。启用 Istio Gateway 后，你的集群将有两个 Ingress。

你还需要为你的服务设置 Kubernetes 网关。此 Kubernetes 资源指向 Istio 对集群 Ingress Gateway 的实现。

你可以使用负载均衡器将流量路由到服务网格中，或使用 Istio 的 NodePort 网关。本文介绍如何设置 NodePort 网关。

有关 Istio Gateway 的更多信息，请参阅 [Istio 文档](https://istio.io/docs/reference/config/networking/v1alpha3/gateway/)。

![启用 Istio 的集群可以有两个 ingress，分别是默认的 Nginx ingress 和默认的 Istio controller]({{<baseurl>}}/img/rancher/istio-ingress.svg)

## 启用 Istio Gateway

Ingress Gateway 是一个 Kubernetes 服务，将部署在你的集群中。Istio Gateway 支持更多自定义设置，更加灵活。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击 **Istio > 网关**。
1. 单击**使用 YAML 文件创建**。
1. 粘贴你的 Istio Gateway yaml，或选择**从文件读取**。
1. 单击**创建**。

**结果**：已部署网关，将使用应用的规则来路由流量。

## Istio Gateway 示例

在演示工作负载示例时，我们在服务中添加 BookInfo 应用部署。接下来，我们添加一个 Istio Gateway，以便从集群外部访问该应用。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击 **Istio > 网关**。
1. 单击**使用 YAML 文件创建**。
1. 复制并粘贴下面的 Gateway YAML。
1. 单击**创建**。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: bookinfo-gateway
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
```

然后，部署为 Gateway 提供流量路由的 VirtualService：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击 **Istio > VirtualServices**。
1. 复制并粘贴下面的 VirtualService YAML。
1. 单击**创建**。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo
spec:
  hosts:
  - "*"
  gateways:
  - bookinfo-gateway
  http:
  - match:
    - uri:
        exact: /productpage
    - uri:
        prefix: /static
    - uri:
        exact: /login
    - uri:
        exact: /logout
    - uri:
        prefix: /api/v1/products
    route:
    - destination:
        host: productpage
        port:
          number: 9080
```

**结果**：你已配置网关资源，Istio 现在可以接收集群外部的流量。

运行以下命令来确认资源存在：
```
kubectl get gateway -A
```

结果应与以下内容类似：
```
NAME               AGE
bookinfo-gateway   64m
```

### 在 Web 浏览器访问 ProductPage 服务

要测试 BookInfo 应用是否已正确部署，你可以使用 Istio 控制器 IP 和端口以及在 Kubernetes 网关资源中指定的请求名称，在 Web 浏览器中查看该应用：

`http://<IP of Istio controller>:<Port of istio controller>/productpage`

要获取 Ingress Gateway URL 和端口：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。
1. 向下滚动到 `istio-system` 命名空间。
1. 在 `istio-system`中，有一个名为 `istio-ingressgateway` 的工作负载。在此工作负载的名称下，你应该会看到如 `80/tcp` 的链接。
1. 单击其中一个链接。然后，你的 Web 浏览器中会显示 Ingress Gateway 的 URL。将 `/productpage` 尾附到 URL。

**结果**：你能会在 Web 浏览器中看到 BookInfo 应用。

如需检查 Istio 控制器 URL 和端口的帮助，请尝试运行 [Istio 文档](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/#determining-the-ingress-ip-and-ports)中的命令。

## 故障排查

[官方 Istio 文档](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/#troubleshooting)建议使用 `kubectl` 命令来检查外部请求的正确 ingress 主机和 ingress 端口。

### 确认 Kubernetes 网关与 Istio 的 Ingress Controller 匹配

你可以尝试执行本节中的步骤以确保 Kubernetes 网关配置正确。

在网关资源中，选择器通过标签来引用 Istio 的默认 Ingress Controller，其中标签的键是 `Istio`，值是 `ingressgateway`。要确保标签适用于网关，请执行以下操作：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在左侧导航栏中，单击**工作负载**。
1. 向下滚动到 `istio-system` 命名空间。
1. 在 `istio-system`中，有一个名为 `istio-ingressgateway` 的工作负载。单击此工作负载的名称并转到**标签和注释**部分。你应该看到它具有 `istio` 键和 `ingressgateway` 值。这确认了 Gateway 资源中的选择器与 Istio 的默认 ingress controller 匹配。

### 后续步骤
[设置 Istio 的流量管理组件]({{<baseurl>}}/rancher/v2.6/en/istio/setup/set-up-traffic-management)
