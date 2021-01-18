---
title: HTTP代理配置
description: 如果您在代理后面操作 Rancher，并且想要通过代理访问服务（例如拉取应用商店），则必须提供有关 Rancher 代理的信息。由于 Rancher 是用 Go 编写的，因此它使用了常见的代理环境变量，如下所示。确保`NO_PROXY`包含不应使用代理的网络地址，网络地址范围和域。
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
  - 安装指南
  - 资料、参考和高级选项
  - RKE Add-on 安装
  - HTTP代理配置
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation_new/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/_index)，获取有关如何使用 Helm chart 的详细信息。
:::

如果您在代理后面操作 Rancher，并且想要通过代理访问服务（例如拉取应用商店），则必须提供有关 Rancher 代理的信息。 Rancher 是用 Go 语言编写的，因此它使用了常见的代理环境变量，如下表所示：

| 变量名称    | 描述                                                                                                                                                           |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP_PROXY  | HTTP 连接的代理地址                                                                                                                                            |
| HTTPS_PROXY | HTTPS 连接的代理地址                                                                                                                                           |
| NO_PROXY    | 不使用代理的网络地址，网络地址范围和域。变量名称必须为大写才能使用无类别域间路由表示法（CIDR）。请确保`NO_PROXY`包含不应使用代理的网络地址，网络地址范围和域。 |

## Rancher 高可用安装

使用 Kubernetes 安装时，需要将环境变量添加到 RKE 配置文件的模板中。

- [使用外部负载均衡器（TCP / Layer 4）RKE 配置文件模板进行 Rancher 高可用](/docs/rancher2/installation_new/resources/advanced/helm2/rke-add-on/layer-4-lb/_index)
- [使用外部负载均衡器（HTTPS / Layer 7）RKE 配置文件模板进行 Rancher 高可用](/docs/rancher2/installation_new/resources/advanced/helm2/rke-add-on/layer-7-lb/_index)

环境变量应在 RKE 配置文件模板内部的 `Deployment` 定义。您只需将它添加到从 `env:` 开头(但不包括)到 `ports:`结束的部分。确保缩进与前面的 `name:` 相同。需要配置 `NO_PROXY` 的值为:

- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- 配置 `service_cluster_ip_range` (默认值: `10.43.0.0/16`)

下面的示例基于一个 Rancher 可访问的代理服务器 `http://192.168.0.1:3128`，Rancher 会使用这个代理服务器发送请求，但不包括访问网络范围 `192.168.10.0/24`，`service_cluster_ip_range` (`10.43.0.0/16`) 以及域 `example.com` 下的所有主机名。如果更改了 `service_cluster_ip_range`，则必须相应地更新下面的值。

```yaml
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  namespace: cattle-system
  name: cattle
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: cattle
    spec:
      serviceAccountName: cattle-admin
      containers:
        - image: rancher/rancher:latest
          imagePullPolicy: Always
          name: cattle-server
          env:
            - name: HTTP_PROXY
              value: "http://192.168.10.1:3128"
            - name: HTTPS_PROXY
              value: "http://192.168.10.1:3128"
            - name: NO_PROXY
              value: "localhost,127.0.0.1,0.0.0.0,10.43.0.0/16,192.168.10.0/24,example.com"
          ports:
```
