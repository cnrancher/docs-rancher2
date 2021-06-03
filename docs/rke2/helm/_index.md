# Helm 集成

Helm 是 Kubernetes 的首选软件包管理工具。Helm chart 为 Kubernetes YAML 清单文件提供模板语法。通过 Helm，我们可以创建可配置的部署，而不是仅仅使用静态文件。关于创建自己的部署目录的更多信息，请查看[https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/)的文档。

RKE2 在使用 Helm 命令行工具时不需要任何特殊配置。只要确保你已经按照[访问集群](.../cluster-access)一节的规定正确设置了你的 kubeconfig。RKE2 包括一些额外的功能，使用[rancher/helm-release CRD.](#using-thehelm-crd)更容易部署传统的 Kubernetes 资源清单和 Helm Charts。

本节包括以下主题：

- [自动部署清单和 Helm chart](#automatically-deploying-manifests-and-helm-charts)
- [使用 Helm CRD](#using-thehelm-crd)
- [用 HelmChartConfig 自定义打包的组件](#customizing-packaged-components-with-helmchartconfig)

### 自动部署清单和 Helm chart

在`/var/lib/rancher/rke2/server/manifests`中发现的任何 Kubernetes 清单都会以类似于`kubectl apply`的方式自动部署到 RKE2。以这种方式部署的 manifests 作为 AddOn 自定义资源进行管理，可以通过运行`kubectl get addon -A`查看。你会发现用于打包组件的 AddOns，如 CoreDNS、Local-Storage、Nginx-Ingress 等。AddOns 由部署控制器自动创建，并根据清单目录中的文件名来命名。

也可以将 Helm chart 作为 AddOns 进行部署。RKE2 包括一个[Helm Controller](https://github.com/k3s-io/helm-controller/)，它使用 HelmChart 自定义资源定义（CRD）来管理 Helm chart。

### 使用 Helm CRD

[HelmChart 资源定义](https://github.com/k3s-io/helm-controller#helm-controller)捕获了你通常传递给`helm`命令行工具的大部分选项。下面是一个例子，说明你如何从默认的 chart 资源库部署 Grafana，覆盖一些默认的 chart 值。注意，HelmChart 资源本身在`kube-system`命名空间中，但 chart 的资源将被部署到`monitoring`命名空间。

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

#### HelmChart 字段定义

| Field                | Default | Description                                                         | Helm Argument / Flag Equivalent |
| -------------------- | ------- | ------------------------------------------------------------------- | ------------------------------- |
| name                 |         | Helm Chart name                                                     | NAME                            |
| spec.chart           |         | 存储库中的 Helm chart 名称，或 chart 存档的完整 HTTPS URL（.tgz）。 | CHART                           |
| spec.targetNamespace | default | Helm Chart 目标命名空间                                             | `--namespace`                   |
| spec.version         |         | Helm Chart 版本 (当从资源库安装时)                                  | `--version`                     |
| spec.repo            |         | Helm Chart 资源库 URL                                               | `--repo`                        |
| spec.helmVersion     | v3      | 要使用的 Helm 版本 (`v2` 或 `v3`)                                   |                                 |
| spec.bootstrap       | False   | 如果需要此图来启动集群（云控制器管理器等），则设置为 True           |                                 |
| spec.set             |         | 覆盖简单的默认 chart 值。这些优先于通过`valuesContent`设置的选项。  | `--set` / `--set-string`        |
| spec.valuesContent   |         | 通过 YAML 文件内容覆盖复杂的默认 chart 值                           | `--values`                      |
| spec.chartContent    |         | Base64 编码的 chart 存档.tgz - 覆盖 `spec.chart`                    | CHART                           |

### 使用 HelmChartConfig 自定义打包的组件

RKE2 支持通过 `HelmChartConfig` 资源来自定义部署，允许覆盖作为 HelmCharts 部署的打包组件（如 Canal、CoreDNS、Nginx-Ingress 等）的值。`HelmChartConfig`资源必须与其对应的 HelmChart 的名称和命名空间相匹配，并支持提供额外的`valuesContent`，作为一个额外的值文件传递给`helm`命令。

> **注意：** HelmChart `spec.set` 值覆盖 HelmChart 和 HelmChartConfig `spec.valuesContent`设置。

例如，为了自定义打包的 CoreDNS 配置，你可以创建一个名为`/var/lib/rancher/rke2/server/manifests/rke2-coredns-config.yaml`的文件，并用以下内容填充它：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: rke2-coredns
  namespace: kube-system
spec:
  valuesContent: |-
    image: coredns/coredns
    imageTag: v1.7.1
```
