---
title: 资源类型
---

在您的项目建立之后，[项目成员](/docs/admin-settings/rbac/cluster-project-roles/_index)可以开始管理项目中的应用程序和其他的所有组件。

## 工作负载

使用[工作负载](/docs/k8s-in-rancher/workloads/_index)将应用程序部署到集群节点，工作负载包含运行应用程序的 Pod 的对象，以及为部署行为设置规则的元数据。工作负载可以部署在所有集群里，也可以部署在命名空间内。

在部署工作负载时，可以使用任何镜像进行部署。有多种类型的[工作负载](/docs/k8s-in-rancher/workloads/_index)可供选择，它们决定应用程序的运行方式。

在部署了工作负载之后，您可以继续使用它。您可以：

- [升级](/docs/k8s-in-rancher/workloads/upgrade-workloads/_index)，将工作负载正在运行的应用程序升级到新的版本。
- [回滚](/docs/k8s-in-rancher/workloads/rollback-workloads/_index)，如果升级期间发生问题，则将工作负载回滚到以前的版本。
- [添加一个从容器](/docs/k8s-in-rancher/workloads/add-a-sidecar/_index)，它是在 Pod 中延伸或增强主容器的容器。

## 负载均衡和 Ingress

### 负载均衡

启动应用程序后，只能在集群中使用它。无法从集群外部访问它。

如果希望可以从外部访问应用程序，则必须向集群添加负载均衡器。负载均衡器创建用来可以从外网访问的网关。当然，用户需要知道负载均衡器的 IP 地址和应用程序的端口号。

Rancher 支持两种负载均衡器:

- [4 层负载均衡](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)
- [7 层负载均衡](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)

有关更多信息，请参见[负载均衡](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index)。

### Ingress

每个负载均衡器只能处理一个 IP 地址，这意味着如果您在集群中运行多个服务，那么每个服务都必须有一个负载均衡器。运行多个负载均衡器可能很昂贵。您可以通过使用 Ingress 绕过这个问题。

Ingress 通过一组规则定义实现负载均衡。Ingress 协同一个或多个 Ingress 控制器来动态路由服务请求。当 Ingress 接收到一个请求时，在您的集群中的 Ingress 控制器根据您配置的服务子域或路径规则引导请求到正确的服务。

有关更多信息，请参见 [Ingress](/docs/k8s-in-rancher/load-balancers-and-ingress/ingress/_index)。

在项目中使用 Ingress 时，可以设置全局 DNS 条目，从而对外部 DNS 进行编程动态设置 Ingress。

有关更多信息，请参见[全局 DNS](/docs/catalog/globaldns/_index)。

## 服务发现

通过 Pod IP 地址访问 Pod 的方式是不稳定的。要创建可解析到 Pod 的主机名，您必须创建一个服务记录，该记录可以任意 IP 地址、外部主机名、DNS 记录别名、工作负载或通过选择器选择的 Pod 映射到特定的主机名。

有关更多信息，请参见[服务发现](/docs/k8s-in-rancher/service-discovery/_index)。

## 流水线

在对接了[版本控制工具](/docs/project-admin/pipelines/_index)后，您可以添加代码库并开始为每个代码库配置流水线。

有关更多信息，请参见[流水线](/docs/k8s-in-rancher/pipelines/_index)。

## 应用商店

除了启动应用程序的各个组件外，还可以使用 Rancher 应用商店启动应用程序，应用商店就是 Helm Charts。

有关更多信息，请参见[项目中的应用商店](/docs/catalog/launching-apps/_index)。

## Kubernetes 资源

在 Rancher 项目或命名空间的上下文中, _资源_ 是用来支持运行 Pod 的文件和数据。在 Rancher 中，证书、镜像仓库凭证和密文都被视为资源。然而，Kubernetes 将它们归类为不同类型的[密文](https://kubernetes.io/docs/concepts/configuration/secret/)。因此，在单个项目或命名空间中，上面提到的这些资源必须具有唯一的名称，从而避免冲突。

虽然资源主要用于携带敏感信息，但它们也有其他用途。

资源包括：

- [证书](/docs/k8s-in-rancher/certificates/_index): 用于加密/解密进入或离开集群的数据的文件。
- [配置映射](/docs/k8s-in-rancher/configmaps/_index): 存储一般配置信息的文件，比如一组配置文件。
- [密文](/docs/k8s-in-rancher/secrets/_index): 存储密码、证书或密钥等敏感数据的文件。
- [镜像仓库凭证](/docs/k8s-in-rancher/registries/_index): 带有用于使用私有镜像仓库进行身份验证的凭据的文件。
