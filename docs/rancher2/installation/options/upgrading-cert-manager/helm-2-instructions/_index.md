---
title: 升级 Cert-Manager（Helm 2）
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
  - 升级 Cert-Manager（Helm 2）
---

## 概述

Rancher 使用 cert-manager 为 Rancher 高可用部署自动生成和更新 TLS 证书。从 2019 秋季开始，cert-manager 发生了三个重要的变化，如果你在此时间段前创建了 Rancher 高可用部署，您需要采取以下措施：

1. [从 2019 年 11 月 1 日开始，Let's Encrypt 将阻止版本低于 0.8.0 的 cert-manager 实例。](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)
1. [Cert-manager 正在弃用并替换 certificate.spec.acme.solvers 字段。](https://cert-manager.io/docs/rancher2/installation/upgrading/upgrading-0.7-0.8/)此更改没有确切的截止日期。
1. [Cert-manager 正在弃用`v1alpha1`API 并替换它的 API 组。](https://cert-manager.io/docs/rancher2/installation/upgrading/upgrading-0.10-0.11/)

为了应对 cert-manager 的变化，本文提供了联网升级 cert-manager、离线升级 cert-manager 和 Cert-Manager API 更改和数据迁移的操作指导。
:::important 注意
如果您当前正在运行版本低于 v0.11 的 cert-manger，并且想要将 Rancher 和 cert-manager 都升级到新版本，只能先卸载旧版 cert-manger 和 Rancher，然后重新安装新版 cert-manger 和 Rancher。

1. 对运行 Rancher Server 的 Kubernetes 集群进行一次性快照
2. 卸载 Rancher，cert-manager 和 cert-manager 的 CustomResourceDefinition
3. 安装更新版本的 Rancher 和 cert-manager

因为 Helm 升级 Rancher 时，如果运行的 Rancher 应用程序与用于安装它的 chart 模板不匹配，它将拒绝升级并显示错误消息。因为 cert-manager 更改了它的 API 组，并且我们不能修改 Rancher 的已发布的 chart，所以 cert-manager 的 API 版本始终不匹配，因此无法升级 Rancher。
要使用 Helm 重新安装 Rancher，请在升级 Rancher 部分下选中[选项 B: 重新安装 Rancher Chart](/docs/rancher2/upgrades/upgrades/ha/_index)。
:::

## 升级 Cert-Manager

> **注意：**
> 如果您没有升级 Rancher 的计划，这些说明是适用的。

这些说明中使用的命名空间取决于当前安装了 cert-manager 的命名空间。如果它在 kube-system 中，请在以下说明中使用。您可以通过运行`kubectl get pods --all-namespaces`来验证，并检查 cert-manager-\* pods 列在哪个命名空间中。请勿更改正在运行 cert-manager 的命名空间，否则可能会导致问题。

要升级 cert-manager，请遵循以下说明：

### 联网升级 cert-manager

1.  [备份现有资源](https://cert-manager.io/docs/tutorials/backup/)

    ```plain
    kubectl get -o yaml --all-namespaces \
    issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
    ```

1.  删除现有部署

    ```plain
    helm delete --purge cert-manager
    ```

1.  单独安装 CustomResourceDefinition 资源

    ```plain
    kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
    ```

1.  添加 Jetstack Helm 仓库

    ```plain
    helm repo add jetstack https://charts.jetstack.io
    ```

1.  更新本地 Helm chart 仓库缓存

    ```plain
    helm repo update
    ```

1.  安装新版本 cert-manager

    ```plain
    helm install --version 0.12.0 --name cert-manager --namespace kube-system jetstack/cert-manager
    ```

### 在离线环境中升级 cert-manager

#### 先决条件

在执行升级之前，您必须通过将必要的容器镜像添加到私有镜像仓库中并下载或渲染所需的 Kubernetes manifest 文件来准备离线环境。

1. 按照指南[准备私有镜像仓库](/docs/rancher2/installation/other-installation-methods/air-gap/populate-private-registry/_index)准备升级所需的镜像。

1. 从连接到 Internet 的系统中，将 cert-manager 存储库添加到 Helm

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
   helm template ./cert-manager-v0.12.0.tgz --output-dir . \
   --name cert-manager --namespace kube-system \
   --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller
   --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook
   --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

1. 下载 cert-manager 所需的 CRD 文件

   ```plain
   curl -L -o cert-manager/cert-manager-crd.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   ```

#### 安装 cert-manager

1.  备份现有资源

    ```plain
    kubectl get -o yaml --all-namespaces issuer,clusterissuer,certificates > cert-manager-backup.yaml
    ```

1.  删除现有的 cert-manager 安装包

    ```plain
    kubectl -n kube-system delete deployment,sa,clusterrole,clusterrolebinding -l 'app=cert-manager' -l 'chart=cert-manager-v0.5.2'
    ```

1.  单独安装 CustomResourceDefinition 资源

    ```plain
    kubectl apply -f cert-manager/cert-manager-crd.yaml
    ```

1.  安装 cert-manager

    ```plain
    kubectl -n kube-system apply -R -f ./cert-manager
    ```

安装了 cert-manager 后，您可以通过检查 kube-system 命名空间中运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace kube-system

NAME                                            READY   STATUS      RESTARTS   AGE
cert-manager-7cbdc48784-rpgnt                   1/1     Running     0          3m
cert-manager-webhook-5b5dd6999-kst4x            1/1     Running     0          3m
cert-manager-cainjector-3ba5cd2bcd-de332x       1/1     Running     0          3m
```

如果"webhook" pod(第二行)处于 ContainerCreating 状态，则它可能仍在等待 Secret 被安装到 pod 中。等几分钟，以免发生这种情况，但是如果遇到问题，请查看 cert-manager[故障排查](https://cert-manager.io/docs/rancher2/faq/)指南。

> **注意：** 上面的说明要求您将 disable-validation 标签添加到 kube-system 命名空间中。这里有一些外部文档解释了该操作的必要性：
>
> - [关于 disable-validation 标签的信息](https://docs.cert-manager.io/en/latest/tasks/upgrading/upgrading-0.4-0.5.html?highlight=certmanager.k8s.io%2Fdisable-validation#disabling-resource-validation-on-the-cert-manager-namespace)
> - [关于证书的 webhook 验证的信息](https://docs.cert-manager.io/en/latest/getting-started/webhook.html)

## Cert-Manager API 更改和数据迁移

Cert-manager 已经弃用 `certificate.spec.acme.solvers` 字段，并将在即将发布的版本中完全放弃对该字段的支持。

根据 cert-manager 文档，在 v0.8 中引入了配置 ACME 证书资源的新格式，移动了 challenge solver 配置字段。从 v0.9 开始支持旧格式和新格式，但是在即将发布的 cert-manager 中将不再支持旧格式。强烈建议在升级 cert-manager 文档后将 ACME 颁发者和证书资源更新为新格式。

有关更改和迁移说明的详细信息，请参见[cert-manager v0.7 至 v0.8 升级说明](https://cert-manager.io/docs/rancher2/installation/upgrading/upgrading-0.7-0.8/)。

v0.11 版本标志着删除了先前版本的 cert-manager 中使用的 v1alpha1 API，并且我们的 API 组已更改为 cert-manager.io 而不是 certmanager.k8s.io。

我们还删除了对 v0.8 版本中不支持的旧配置格式的支持，这意味着在升级到 v0.11 之前，您必须转换到为 ACME 发行者使用新的 solvers 样式配置格式。有关更多信息，请参见[升级到 v0.8 指南](https://cert-manager.io/docs/rancher2/installation/upgrading/upgrading-0.7-0.8/)。

有关更改和迁移说明的详细信息，请参见[cert-manager v0.10 至 v0.11 升级说明](https://cert-manager.io/docs/rancher2/installation/upgrading/upgrading-0.10-0.11/)。

有关更多信息，请参见[cert-manager 升级信息](https://cert-manager.io/docs/rancher2/installation/upgrading/)。
