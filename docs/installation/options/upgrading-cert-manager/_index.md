---
title: 升级 Cert-Manager
description: Rancher 使用 cert-manager 为 Rancher 高可用部署自动生成和更新 TLS 证书。从 2019 秋季开始，cert-manager 发生了三个重要的变化，如果你在此时间段前创建了 Rancher 高可用部署，您需要采取以下措施
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
  - 升级 Cert-Manager
---

## 概述

Rancher 使用 cert-manager 为 Rancher 高可用部署自动生成和更新 TLS 证书。从 2019 秋季开始，cert-manager 发生了三个重要的变化，如果你在此时间段前创建了 Rancher 高可用部署，您需要采取以下措施：

1. [从 2019 年 11 月 1 日开始，Let's Encrypt 将阻止版本低于 0.8.0 的 cert-manager 实例。](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)
1. [Cert-manager 正在弃用并替换 certificate.spec.acme.solvers 字段。](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)此更改没有确切的截止日期。
1. [Cert-manager 正在弃用`v1alpha1`API 并替换它的 API 组。](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/)

为了应对 cert-manager 的变化，本文提供了联网升级 cert-manager、离线升级 cert-manager 和 Cert-Manager API 更改和数据迁移的操作指导。

:::important 重要提示
如果您当前正在运行版本低于 v0.11 的 cert-manger，并且想要将 Rancher 和 cert-manager 都升级到新版本，则需要重新安装它们：

1. 对运行 Rancher 服务器的 Kubernetes 集群进行一次性快照
2. 卸载 Rancher，cert-manager 和 cert-manager 的 CustomResourceDefinition
3. 安装更新版本的 Rancher 和 cert-manager

原因是当 Helm 升级 Rancher 时，如果运行的 Rancher 应用程序与用于安装它的 chart 模板不匹配，它将拒绝升级并显示错误消息。因为 cert-manager 更改了它的 API 组，并且我们不能修改 Rancher 的已发布的 chart，所以 cert-manager 的 API 版本始终不匹配，因此升级将被拒绝。
要使用 Helm 重新安装 Rancher，请在升级 Rancher 部分下选中[选项 B: 重新安装 Rancher Chart](/docs/upgrades/upgrades/ha/_index)。
:::

## 升级 Cert-Manager

这些说明中使用的命名空间取决于当前安装了 cert-manager 的命名空间。如果它在 kube-system 中，请在以下说明中使用。您可以通过运行`kubectl get pods --all-namespaces`来验证，并检查 cert-manager-\* pods 列在哪个命名空间中。请勿更改正在运行 cert-manager 的命名空间，否则可能会导致问题。

> 这些说明已针对 Helm 3 进行了更新。如果您仍在使用 Helm 2，请参阅[以下说明](/docs/installation/options/upgrading-cert-manager/helm-2-instructions/_index)。

要升级 cert-manager，请遵循以下说明：

### 联网升级 cert-manager

1. [备份现有资源](https://cert-manager.io/docs/tutorials/backup/)

   ```plain
   kubectl get -o yaml --all-namespaces \
   issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
   ```

   > **重要提示：**
   > 如果要从 0.11.0 之前的版本升级，请将所有备份资源上的 apiVersion 从`certmanager.k8s.io/v1alpha1`更新为`cert-manager.io/v1alpha2`。如果在其他资源上使用 cert-manager 注释，则需要对其进行更新以反映新的 API 组。有关详细信息, 请参阅有关文档[附加注释更改](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/#additional-annotation-changes)。

1. [卸载现有部署](https://cert-manager.io/docs/installation/uninstall/kubernetes/#uninstalling-with-helm)

   ```plain
   helm uninstall cert-manager
   ```

   使用指向安装的版本 vX.Y 的链接删除 CustomResourceDefinition

   ```plain
   kubectl delete -f https://raw.githubusercontent.com/jetstack/cert-manager/release-X.Y/deploy/manifests/00-crds.yaml
   ```

1. 单独安装 CustomResourceDefinition 资源

   ```plain
   kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   ```

   > **注意：**
   > 如果您正在运行 Kubernetes v1.15 或更低版本，则需要将`--validate=false`标志添加到上面的`kubectl apply`命令中。否则，您将收到一个与 cert-manager 的 CustomResourceDefinition 资源中的`x-kubernetes-preserve-unknown-fields`字段相关的验证错误。这是一个良性错误，是由于 kubectl 执行资源验证的方式造成的。

1. 根据需要为 cert-manager 创建命名空间

   ```plain
   kubectl create namespace cert-manager
   ```

1. 添加 Jetstack Helm 仓库

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   ```

1. 更新本地 Helm chart 仓库缓存

   ```plain
   helm repo update
   ```

1. 安装新版本 cert-manager

   ```plain
   helm install \
     cert-manager jetstack/cert-manager \
     --namespace cert-manager \
     --version v0.12.0
   ```

1. [恢复备份资源](https://cert-manager.io/docs/tutorials/backup/#restoring-resources)

   ```plain
   kubectl apply -f cert-manager-backup.yaml
   ```

### 在离线环境中升级 cert-manager

#### 先决条件

在执行升级之前，您必须通过将必要的容器镜像添加到私有镜像仓库中并下载或渲染所需的 Kubernetes manifest 文件来准备离线环境。

1. 按照指南[准备私有镜像仓库](/docs/installation/other-installation-methods/air-gap/populate-private-registry/_index)准备升级所需的镜像。

1. 从连接到 Internet 的系统中，将 cert-manager 仓库添加到 Helm

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   ```

1. 从[Helm chart 仓库](https://hub.helm.sh/charts/jetstack/cert-manager)中获取最新的 cert-manager chart

   ```plain
   helm fetch jetstack/cert-manager --version v0.12.0
   ```

1. 使用您要用于安装 chart 的选项来渲染 cert-manager 模板。记得要为您从私有镜像仓库中拉取的镜像设置`image.repository`选项。这将创建一个带有 Kubernetes manifest 文件的`cert-manager`目录。

   ```plain
   helm template cert-manager ./cert-manager-v0.12.0.tgz --output-dir . \
   --namespace cert-manager \
   --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller
   --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook
   --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

1. 下载 cert-manager 所需的 CRD 文件（旧的和新的）

   ```plain
   curl -L -o cert-manager/cert-manager-crd.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   curl -L -o cert-manager/cert-manager-crd-old.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-X.Y/deploy/manifests/00-crds.yaml
   ```

#### 安装 cert-manager

1. 备份现有资源

   ```plain
   kubectl get -o yaml --all-namespaces \
   issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
   ```

   > **重要提示：**
   > 如果要从 0.11.0 之前的版本升级，请将所有备份资源上的 apiVersion 从`certmanager.k8s.io/v1alpha1`更新为`cert-manager.io/v1alpha2`。如果在其他资源上使用 cert-manager 注释，则需要对其进行更新以反映新的 API 组。有关详细信息, 请参阅有关文档[附加注释更改](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/#additional-annotation-changes)。

1. 删除现有的 cert-manager 安装包

   ```plain
   kubectl -n cert-manager \
   delete deployment,sa,clusterrole,clusterrolebinding \
   -l 'app=cert-manager' -l 'chart=cert-manager-v0.5.2'
   ```

   使用指向安装的版本 vX.Y 的链接删除 CustomResourceDefinition

   ```plain
   kubectl delete -f cert-manager/cert-manager-crd-old.yaml
   ```

1. 单独安装 CustomResourceDefinition 资源

   ```plain
   kubectl apply -f cert-manager/cert-manager-crd.yaml
   ```

   > **注意：**
   > 如果您正在运行 Kubernetes v1.15 或更低版本，则需要将 `--validate=false` 标志添加到上面的 `kubectl apply` 命令中。否则，您将收到一个与 cert-manager 的 CustomResourceDefinition 资源中的 `x-kubernetes-preserve-unknown-fields` 字段相关的验证错误。这是一个良性错误，是由于 kubectl 执行资源验证的方式造成的。

1. 为 cert-manager 创建命名空间

   ```plain
   kubectl create namespace cert-manager
   ```

1. 安装 cert-manager

   ```plain
   kubectl -n cert-manager apply -R -f ./cert-manager
   ```

1. [恢复备份资源](https://cert-manager.io/docs/tutorials/backup/#restoring-resources)

   ```plain
   kubectl apply -f cert-manager-backup.yaml
   ```

安装了 cert-manager 之后，可以通过检查 kube-system 命名空间中运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

## Cert-Manager API 更改和数据迁移

Cert-manager 已经弃用 `certificate.spec.acme.solvers` 字段，并将在即将发布的版本中完全放弃对该字段的支持。

根据 cert-manager 文档，在 v0.8 中引入了配置 ACME 证书资源的新格式。具体来说，移动了 challenge solver 配置字段。从 v0.9 开始支持旧格式和新格式，但是在即将发布的 cert-manager 中将不再支持旧格式。cert-manager 文档强烈建议在升级之后将 ACME 颁发者和证书资源更新为新格式。

有关更改和迁移说明的详细信息，请参见[cert-manager v0.7 至 v0.8 升级说明](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)。

v0.11 版本标志着删除了先前版本的 cert-manager 中使用的 v1alpha1 API，并且我们的 API 组已更改为 cert-manager.io 而不是 certmanager.k8s.io。

我们还删除了对 v0.8 版本中不支持的旧配置格式的支持，这意味着在升级到 v0.11 之前，您必须转换到为 ACME 发行者使用新的 solvers 样式配置格式。有关更多信息，请参见[升级到 v0.8 指南](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)。

有关更改和迁移说明的详细信息，请参见[cert-manager v0.10 至 v0.11 升级说明](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/)。

有关更多信息，请参见[cert-manager 升级信息](https://cert-manager.io/docs/installation/upgrading/)。
