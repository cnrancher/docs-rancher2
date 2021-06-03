---
title: 网络
description: 本页解释了 CoreDNS 和 Nginx-Ingress controller 如何在 RKE2 中工作。
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
  - RKE2
  - 网络
---


本页解释了 CoreDNS 和 Nginx-Ingress controller 如何在 RKE2 中工作。

请参考[安装网络选项](install/network_options.md)页面，了解 Canal 配置选项的详细信息，或者如何设置你自己的 CNI。

关于 RKE2 需要打开哪些端口的信息，请参考[安装要求](install/requirements.md)。

- [CoreDNS](#coredns)
- [Nginx Ingress Controller](#nginx-ingress-controller)
- [没有主机名的节点](#nodes-without-a-hostname)

## CoreDNS

CoreDNS 是在启动 server 时默认部署的。要禁用，请在运行每台 server 时在配置文件中加入`disable: rke2-coredns`选项。

如果你不安装 CoreDNS，你将需要自己安装一个集群 DNS 提供商。

## Nginx Ingress Controller

[nginx-ingress](https://github.com/kubernetes/ingress-nginx)是一个由 NGINX 提供的 Ingress controller，使用 ConfigMap 来存储 NGINX 的配置。

在启动 server 时，`nginx-ingress` 被默认部署。端口 80 和 443 将在其默认配置中由 Ingress controller 绑定，使得这些端口无法用于集群中的 HostPort 或 NodePort 服务。

配置选项可以通过创建[HelmChartConfig manifest](helm.md#customizing-packaged-components-with-helmchartconfig)来自定义`rke2-ingress-nginx` HelmChart 值。例如，在`/var/lib/rancher/rke2/server/manifests/rke2-ingress-nginx-config.yaml`中的 HelmChartConfig 有如下内容，在存储 NGINX 配置的 ConfigMap 中，将`use-forwarded-headers`设为`true`：

```yaml
# /var/lib/rancher/rke2/server/manifests/rke2-ingress-nginx-config.yaml
---
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-ingress-nginx
  namespace: kube-system
spec:
  valuesContent: |-
    controller:
      config:
        use-forwarded-headers: "true"
```

更多信息请参考官方的[nginx-ingress Helm 配置参数]（https://github.com/kubernetes/ingress-nginx/tree/9c0a39636da11b7e262ddf0b4548c79ae9fa1667/charts/ingress-nginx#configuration）。

要禁用 NGINX ingress controller，在配置文件中加入 `disable: rke2-ingress-nginx` 选项，启动每台 server。

## 没有主机名的节点

一些云计算供应商，如 Linode，会以 `localhost` 作为主机名来创建机器，其他的可能根本就没有设置主机名。这可能会导致域名解析方面的问题。你可以在运行 RKE2 时加入 `node-name` 参数，这将传递节点名称来解决这个问题。
