---
title: Helm
description: Helm 是 Kubernetes 的首选包管理工具。Helm Chart为 Kubernetes YAML 清单文件提供了模板化语法。通过 Helm，我们可以创建可配置的部署，而不仅仅是使用静态文件。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - K3s常见问题
---

Helm 是 Kubernetes 的首选包管理工具。Helm Chart 为 Kubernetes YAML 清单文件提供了模板化语法。通过 Helm，我们可以创建可配置的部署，而不仅仅是使用静态文件。有关创建自己的部署目录的更多信息，请查看[Helm 快速入门](https://helm.sh/docs/intro/quickstart/)。

K3s 不需要任何特殊的配置就可以使用 Helm 命令行工具。只要确保你已经按照[集群访问](/docs/k3s/cluster-access/_index)一节正确设置了你的 kubeconfig。 K3s 包含了一些额外的功能，通过[rancher/helm-release CRD](#使用-helm-crd)，使传统的 Kubernetes 资源清单和 Helm Charts 部署更加容易。

本节涵盖以下主题：

- [自动部署 manifests 和 Helm charts](#自动部署-manifests-和-helm-charts)
- [使用 Helm CRD](#使用-helm-crd)
- [使用 HelmChartConfig 自定义打包的组件](#使用-helmchartconfig-自定义打包的组件)
- [从 Helm v2 升级](#从-helm-v2-升级)

## 自动部署 manifests 和 Helm charts

在`/var/lib/rancher/k3s/server/manifests`中找到的任何 Kubernetes 清单将以类似`kubectl apply`的方式自动部署到 K3s。以这种方式部署的 manifests 是作为 AddOn 自定义资源来管理的，可以通过运行`kubectl get addon -A`来查看。你会发现打包组件的 AddOns，如 CoreDNS、Local-Storage、Traefik 等。AddOns 是由部署控制器自动创建的，并根据它们在 manifests 目录下的文件名命名。

也可以将 Helm Chart 作为 AddOns 部署。K3s 包括一个[Helm Controller](https://github.com/rancher/helm-controller/)，它使用 HelmChart Custom Resource Definition(CRD)管理 Helm Chart。

## 使用 Helm CRD

> **注意:** K3s 版本至 v0.5.0 使用`k3s.cattle.io/v1`作为 HelmCharts 的 apiVersion。后来的版本已改为`helm.cattle.io/v1`。

[HelmChart 资源定义](https://github.com/rancher/helm-controller#helm-controller)捕获了大多数你通常会传递给`helm`命令行工具的选项。下面是一个例子，说明如何从默认的 Chart 资源库中部署 Grafana，覆盖一些默认的 Chart 值。请注意，HelmChart 资源本身在 `kube-system` 命名空间，但 Chart 资源将被部署到 `monitoring` 命名空间。

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

### HelmChart 字段定义

| 字段                 | 默认值  | 描述                                                                        | Helm Argument / Flag Equivalent |
| :------------------- | :------ | :-------------------------------------------------------------------------- | :------------------------------ |
| name                 | N/A     | Helm Chart 名称                                                             | NAME                            |
| spec.chart           | N/A     | 仓库中的 Helm Chart 名称，或完整的 HTTPS URL（.tgz）。                      | CHART                           |
| spec.targetNamespace | default | Helm Chart 目标命名空间                                                     | `--namespace`                   |
| spec.version         | N/A     | Helm Chart 版本(从版本库安装时使用的版本号)                                 | `--version`                     |
| spec.repo            | N/A     | Helm Chart 版本库 URL 地址                                                  | `--repo`                        |
| spec.helmVersion     | v3      | Helm 的版本号，可选值为 `v2` 和`v3`，默认值为 `v3`                          | N/A                             |
| spec.bootstrap       | False   | 如果需要该 Chart 来引导集群（Cloud Controller Manager 等），则设置为 True。 | N/A                             |
| spec.set             | N/A     | 覆盖简单的默认 Chart 值。这些值优先于通过 valuesContent 设置的选项。        | `--set` / `--set-string`        |
| spec.jobImage        |         | 指定安装 helm chart 时要使用的镜像。如：rancher/klipper-helm:v0.3.0。       |                                 |
| spec.valuesContent   | N/A     | 通过 YAML 文件内容覆盖复杂的默认 Chart 值。                                 | `--values`                      |
| spec.chartContent    | N/A     | Base64 编码的 Chart 存档.tgz - 覆盖 spec.chart。                            | CHART                           |

放在`/var/lib/rancher/k3s/server/static/`中的内容可以通过 Kubernetes APIServer 从集群内匿名访问。这个 URL 可以使用`spec.chart`字段中的特殊变量`%{KUBERNETES_API}%`进行模板化。例如，打包后的 Traefik 组件从`https://%{KUBERNETES_API}%/static/charts/traefik-1.81.0.tgz`加载其 Chart。

**注意：** `name` 字段应遵循 Helm chart 命名规范。参考[这里](https://helm.sh/docs/chart_best_practices/conventions/#chart-names)了解更多。

> **关于文件命名要求：** `HelmChart` 和 `HelmChartConfig` 清单文件名应遵守 Kubernetes 对象的[命名要求](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/)。Helm Controller 使用文件名来创建对象；因此，文件名也必须与要求一致。任何相关的错误都可以在 rke2-server 的日志中观察到。下面的例子是使用下划线产生的错误：

```
level=error msg="Failed to process config: failed to process 
/var/lib/rancher/rke2/server/manifests/rke2_ingress_daemonset.yaml: 
Addon.k3s.cattle.io \"rke2_ingress_daemonset\" is invalid: metadata.name: 
Invalid value: \"rke2_ingress_daemonset\": a lowercase RFC 1123 subdomain 
must consist of lower case alphanumeric characters, '-' or '.', and must 
start and end with an alphanumeric character (e.g. 'example.com', regex 
used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]
([-a-z0-9]*[a-z0-9])?)*')"
```

## 使用 HelmChartConfig 自定义打包的组件

为了允许覆盖作为 HelmCharts（如 Traefik）部署的打包组件的值，从 v1.19.0+k3s1 开始的 K3s 版本支持通过 HelmChartConfig 资源自定义部署。HelmChartConfig 资源必须与其对应的 HelmChart 的名称和命名空间相匹配，并支持提供额外的 "valuesContent"，它作为一个额外的值文件传递给`helm`命令。

> **注意：** HelmChart 的`spec.set`值覆盖了 HelmChart 和 HelmChartConfig 的`spec.valuesContent`设置。
> 例如，要自定义打包后的 Traefik 入口配置，你可以创建一个名为`/var/lib/rancher/k3s/server/manifests/traefik-config.yaml`的文件，并将其填充为以下内容。

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    image: traefik
    imageTag: v1.7.26-alpine
    proxyProtocol:
      enabled: true
      trustedIPs:
        - 10.0.0.0/8
    forwardedHeaders:
      enabled: true
      trustedIPs:
        - 10.0.0.0/8
    ssl:
      enabled: true
      permanentRedirect: false
```

## 从 Helm v2 升级

如果你在以前的 K3s 版本中使用的是 Helm v2，你可以升级到 v1.17.0+k3s.1 或更新版本，Helm 2 仍然可以使用。如果你想迁移到 Helm 3，[这个](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)Helm 的博文介绍了如何使用插件成功迁移。更多信息请参考 Helm 3 的官方文档[这里](https://helm.sh/docs/)。从 v1.17.0+k3s.1 开始，K3s 可以处理 Helm v2 或 Helm v3。只要确保你已经按照[集群访问](../cluster-access/_index)一节中的例子正确设置了你的 kubeconfig。

注意，Helm 3 不再需要 Tiller 和`helm init`命令。详情请参考官方文档。
