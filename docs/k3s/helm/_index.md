---
title: Helm
weight: 42
---

K3s _v1.17.0+k3s.1_ 增加了对Helm 3的支持。您可以在[此处](https://helm.sh/docs/intro/quickstart/)访问Helm 3文档。 

Helm是Kubernetes首选的软件包管理工具。Helm charts 为Kubernetes YAML清单文件提供了模板化语法。通过Helm，我们可以创建可配置的部署，而不仅仅是使用静态文件。关于创建自己的部署目录的更多信息，请查看文档：https://helm.sh/

K3s不需要任何特殊的配置就可以开始使用Helm 3。只要确保你已经按照[集群访问](../cluster-access/_index)一节正确设置了你的kubeconfig。

本节涵盖以下主题：

- [升级 Helm](#升级-helm)
- [部署 manifests 和 Helm charts](#部署-manifests-和-helm-charts)
- [使用 Helm CRD](#使用-helm-crd)

## 升级 Helm

如果你在早期的K3s版本中使用的是Helm v2，你可以升级到v1.17.0+k3s.1或更新版本，但Helm 2仍然可以使用。如果你想迁移到Helm 3，Helm的[这篇](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)博客文章介绍了如何使用插件成功迁移。更多信息请参考Helm 3的[官方文档](https://helm.sh/docs/)。从v1.17.0+k3s.1开始，K3s可以同时处理Helm v2或Helm v3。只要确保你已经按照[集群访问](../cluster-access/_index)一节中的例子正确设置了你的kubeconfig。

注意，Helm 3不再需要Tiller和`helm init`命令。详情请参考官方文档。

## 部署 manifests 和 Helm charts

在`/var/lib/rancher/k3s/server/manifests`中找到的任何文件都会以类似`kubectl apply`的方式自动部署到Kubernetes。

K3s也可以部署Helm charts。K3s支持一个CRD控制器来安装charts。YAML文件规范如下所示（例子摘自`/var/lib/rancher/k3s/server/manifests/traefik.yaml`）：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: traefik
  namespace: kube-system
spec:
  chart: stable/traefik
  set:
    rbac.enabled: "true"
    ssl.enabled: "true"
```

请记住，你的HelmChart metadata 部分中的`namespace`应该总是`kube-system`，因为K3s部署控制器配置为在此namespace中监视新的HelmChart资源。如果你想为实际的Helm release 指定namespace，你可以使用`spec`指令下的`targetNamespace`键来实现，如下面的配置示例所示。

> **注意:** 为了让Helm控制器知道使用哪个版本的Helm来自动部署helm应用，请在你的YAML文件的spec中指定`helmVersion`。

另外要注意的是，除了 `set`，你还可以在 `spec` 指令下使用 `valuesContent`。而且这两个可以同时使用：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: grafana
  namespace: kube-system
spec:
  chart: stable/grafana
  targetNamespace: monitoring
  set:
    adminPassword: "NotVerySafePassword"
  valuesContent: |-
    image:
      tag: master
    env:
      GF_EXPLORE_ENABLED: true
    adminUser: admin
    sidecar:
      datasources:
        enabled: true
```

K3s版本`<= v0.5.0`对HelmCharts的API组使用`k3s.cattle.io`。后来的版本已经改为`helm.cattle.io`。

## 使用 Helm CRD

你可以使用这样的例子部署第三方Helm chart：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: nginx
  namespace: kube-system
spec:
  chart: nginx
  repo: https://charts.bitnami.com/bitnami
  targetNamespace: default
```

你可以使用这样的例子来安装一个特定版本的Helm chart：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: stable/nginx-ingress
  namespace: kube-system
spec:
  chart: nginx-ingress
  version: 1.24.4
  targetNamespace: default
```