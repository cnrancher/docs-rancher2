---
title: 设置Istio网关
description: 每个集群的网关可以有自己的端口或负载均衡器，这与服务网格无关。默认情况下，每个 Rancher 提供的集群有 1 个 NGINX 入口控制器，允许流量进入集群。无论是否已经安装了 Istio。您都可以使用 Nginx Ingress controller。如果这是您的集群的唯一网关，Istio 将能够将流量从服务路由到服务，但 Istio 将无法接收来自集群外部的流量。
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
  - rancher 2.5
  - Istio
  - 配置 Istio
  - 设置Istio网关
---

## 概述

每个集群的网关可以有自己的端口或负载均衡器，这与服务网格无关。默认情况下，每个 Rancher 提供的集群有 1 个 Nginx Ingress controller，允许流量进入集群。

无论是否已经安装了 Istio。您都可以使用 Nginx Ingress controller。如果这是您的集群的唯一网关，Istio 将能够将流量从集群内部的服务路由到集群内部的另一个服务，但 Istio 将无法接收来自集群外部的流量。

您可以启用 Istio 网关，作为外部流量的南北代理，以允许 Istio 接收外部流量。启用 Istio 网关后，您的集群会有两个 Ingress。

你还需要为你的服务设置一个 Kubernetes 网关。这个 Kubernetes 资源指向 Istio 对集群的 Ingress 网关的实现。

您可以使用负载均衡器将流量路由到服务网状结构，或者使用 Istio 的 NodePort 网关。本节介绍如何设置 NodePort 网关。

有关 Istio 网关的更多信息，请参阅[Istio 文档](https://istio.io/docs/reference/config/networking/v1alpha3/gateway/)。

![In an Istio-enabled cluster, you can have two Ingresses: the default Nginx Ingress, and the default Istio controller.](/img/rancher/istio-ingress.svg)

## 启用 Istio 网关

入口网关是将部署在您的集群中的 Kubernetes 服务。Istio 网关兼容更多的自定义扩展插件，更加灵活。

1. 导航到**集群资源管理器**，从下拉菜单中选择**Istio**。
1. 单击侧面导航栏中的**网关**。
1. 单击**从 Yaml 创建**。
1. 粘贴您的 Istio 网关 yaml，或选择**从文件中读取**，上传 yaml 文件。
1. 单击 **Create**，创建 Istio 网关。

**结果：** 已经部署网关，现在将使用应用的规则来路由流量。

## 示例

### 添加 Istio 网关

我们在通过工作负载示例时，在服务中添加 BookInfo 应用部署。接下来我们添加一个 Istio 网关，以便应用程序可以从您的集群外部访问。

1. 从**集群资源管理器**，从导航下拉菜单中选择**Istio**。
1. 单击侧面导航栏中的**网关**。
1. 单击**从 Yaml 创建**。
1. 复制并粘贴下面提供的网关 yaml。
1. 单击**Create**。

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

### 部署 VirtualService

然后部署为网关提供流量路由的 VirtualService。

1. 单击侧面导航栏中的**VirtualService**。
1. 单击**Create from Yaml**。
1. 复制并粘贴下面提供的 VirtualService yaml。
1. 单击**Create**。

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

**结果:**您已经配置了您的网关资源，使 Istio 可以接收来自集群外部的流量。

### 验证资源是否存在

通过运行以下命令确认资源是否存在：

```bash
kubectl get gateway -A
```

结果应该是这样的：

```bash
NAME               AGE
bookinfo-gateway   64m
```

### 从 Web 浏览器访问 ProductPage 服务

要测试并查看 BookInfo 应用是否部署正确，可以使用 Istio 控制器 IP 和端口，结合 Kubernetes 网关资源中指定的请求名称，通过 Web 浏览器查看该应用：

`http://<Istio控制器的IP>:<istio控制器的端口>/productpage`。

1. 从**集群资源管理器**，单击**工作负载 > 概述**。
1. 向下滚动到`istio-system`命名空间。
1. 在`istio-system`中，有一个名为`istio-ingressgateway`的工作负载。在这个工作负载的名称下，你应该看到一些链接，比如`80/tcp`。
1. 单击其中的一个链接。这应该会在你的 Web 浏览器中显示出 ingress gateway 的 URL。将`/productpage`附加到 URL 上。

**结果：**您应该在 Web 浏览器中看到 BookInfo 应用程序。

为了帮助检查 Istio 控制器的 URL 和端口，请尝试使用[Istio 文档](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/#determining-the-ingress-ip-and-ports)中的命令。

## 问题排查

[Istio 官方文档](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/#troubleshooting)建议使用`kubectl`命令检查外部请求的正确入口主机和入口端口。

## 确认 Kubernetes 网关与 Istio 的 Ingress 控制器匹配

在网关资源中，选择器通过标签来引用 Istio 的默认入口控制器，其中标签的键是`istio`，值是`ingressgateway`。为了确保标签适合网关，请进行以下操作。

1. 从**集群资源管理器**，单击**工作负载>概述**。
1. 向下滚动到`istio-system`命名空间。
1. 在`istio-system`内，有一个名为`istio-ingressgateway`的工作负载。单击这个工作负载的名称，进入**标签和注释**部分。你应该看到它有键`istio`和值`ingressgateway`。这确认了网关资源中的选择器与 Istio 的默认入口控制器相匹配。

## 后续操作

[设置 Istio 的流量管理组件](/docs/rancher2.5/istio/setup/set-up-traffic-management/)
