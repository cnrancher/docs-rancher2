---
title: 升级 Cert-Manager
weight: 4
---

Rancher 使用 cert-manager 为 Rancher 高可用部署自动生成和续期 TLS 证书。从 2019 秋季开始，cert-manager 发生了以下的三个重要变更。如果你在此时间段前创建了 Rancher 高可用部署，请进行相关操作。

1. [从 2019 年 11 月 1 日开始，Let's Encrypt 已阻止低于 0.8.0 的 cert-manager 实例。](https://community.letsencrypt.org/t/blocking-old-cert-manager-versions/98753)
1. [Cert-manager 正在弃用和替换 certificate.spec.acme.solvers 字段](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)。此更改暂时没有确切的截止日期。
1. [Cert-manager 正在弃用 `v1alpha1` API 和替换它的 API 组](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/)。

为了帮助你应对这些变化，本文将：

1. 提供升级 cert-manager 步骤的文档。
1. 阐述 cert-manager API 的变更，并提供 cert-manager 官方文档的链接，助你实现数据迁移。

> **重要提示**：
> 如果你的 cert-manager 版本低于 0.11，而且你想将 Rancher 和 cert-manager 均升级到新版本，你需要重新安装它们：

> 1. 对运行 Rancher Server 的 Kubernetes 集群进行一次性快照。
> 2. 卸载 Rancher、cert-manager 和 cert-manager 的 CustomResourceDefinition。
> 3. 安装新版本的 Rancher 和 cert-manager。

> 进行上述操作的原因是，Helm 升级 Rancher 时，如果正在运行的 Rancher 应用与安装它所使用的 Helm 模板不匹配，Helm 会拒绝升级并提示错误消息。由于 cert-manager 更改了它的 API 组，而且我们不能修改 Rancher 已发布的 Chart，因此 cert-manager 的 API 版本始终不匹配，导致升级被拒绝。

## 升级 Cert-Manager

以下说明中使用的命名空间是由当前安装了 cert-manager 的命名空间决定的。如果它在 kube-system 中，在以下说明步骤中使用。你可以运行 `kubectl get pods --all-namespaces` 来验证，并检查 cert-manager-\* pods 列在哪个命名空间中。不要更改运行 cert-manager 的命名空间，否则可能会出现错误。

要升级 cert-manager，请遵循步骤操作。

### 选项 A：联网升级 cert-manager


1. [备份现有资源](https://cert-manager.io/docs/tutorials/backup/)：

   ```plain
   kubectl get -o yaml --all-namespaces \
   issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
   ```

   > **重要提示**：
   > 如果你从低于 0.11.0 的版本升级，请将所有备份资源上的 apiVersion 从 `certmanager.k8s.io/v1alpha1` 升级到 `cert-manager.io/v1alpha2`。如果你需要在其他资源上使用 cert-manager 注释，请对其进行更新以反映新的 API 组。详情请参见[附加注释变更](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/#additional-annotation-changes)。

1. [卸载现有部署](https://cert-manager.io/docs/installation/uninstall/kubernetes/#uninstalling-with-helm)：

   ```plain
   helm uninstall cert-manager
   ```

   使用你安装的 vX.Y.Z 版本的链接删除 CustomResourceDefinition：

   ```plain
   kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager.crds.yaml
   ```

1. 单独安装 CustomResourceDefinition 资源：

   ```plain
   kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager.crds.yaml
   ```

   > **注意**：如果你运行的 Kubernetes 版本是 1.15 或更低版本，你需要在以上的 `kubectl apply` 命令中添加 `--validate=false`。否则你将看到 cert-manager CRD 资源中的 `x-kubernetes-preserve-unknown-fields` 字段校验错误提示。这是 kubectl 执行资源校验方式产生的良性错误。

1. 根据需要为 cert-manager 创建命名空间：

   ```plain
   kubectl create namespace cert-manager
   ```

1. 添加 Jetstack Helm 仓库：

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   ```

1. 更新 Helm Chart 仓库本地缓存：

   ```plain
   helm repo update
   ```

1. 安装新版本的 cert-manager：

   ```plain
   helm install \
     cert-manager jetstack/cert-manager \
     --namespace cert-manager \
     --version v0.12.0
   ```

1. [恢复备份资源](https://cert-manager.io/docs/tutorials/backup/#restoring-resources)：

   ```plain
   kubectl apply -f cert-manager-backup.yaml
   ```



### 选项 B：在离线环境中升级 Cert-Manager



### 前提

在执行升级之前，先将所需的容器镜像添加到私有镜像仓库中，并下载/渲染所需的 Kubernetes manifest 文件来准备离线环境。

1. 参见[准备私有镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/populate-private-registry)指南，将升级所需的镜像推送到镜像仓库。

1. 在可以连接互联网的系统中，将 cert-manager 仓库添加到 Helm：

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   ```

1. 从 [Helm Chart 仓库](https://hub.helm.sh/charts/jetstack/cert-manager)中获取最新可用的 cert-manager Chart：

   ```plain
   helm fetch jetstack/cert-manager --version v0.12.0
   ```

1. 使用安装 Chart 的选项来渲染 cert-manager 模板。记住要设置 `image.repository` 选项，以从你的私有镜像仓库拉取镜像。此操作会创建一个包含 Kubernetes manifest 文件的 `cert-manager` 目录。

   Helm 3 命令如下：

   ```plain
   helm template cert-manager ./cert-manager-v0.12.0.tgz --output-dir . \
   --namespace cert-manager \
   --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller
   --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook
   --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

   Helm 2 命令如下：

   ```plain
   helm template ./cert-manager-v0.12.0.tgz --output-dir . \
   --name cert-manager --namespace cert-manager \
   --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller
   --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook
   --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

1. 下载新旧版 cert-manager 所需的 CRD 文件：

   ```plain
   curl -L -o cert-manager/cert-manager-crd.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   curl -L -o cert-manager/cert-manager-crd-old.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-X.Y/deploy/manifests/00-crds.yaml
   ```

### 安装 cert-manager

1. 备份现有资源：

   ```plain
   kubectl get -o yaml --all-namespaces \
   issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
   ```

   > **重要提示**：
   > 如果你从低于 0.11.0 的版本升级，请将所有备份资源上的 apiVersion 从 `certmanager.k8s.io/v1alpha1` 升级到 `cert-manager.io/v1alpha2`。如果你需要在其他资源上使用 cert-manager 注释，请对其进行更新以反映新的 API 组。详情请参见[附加注释变更](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/#additional-annotation-changes)。

1. 删除现有的 cert-manager 安装包：

   ```plain
   kubectl -n cert-manager \
   delete deployment,sa,clusterrole,clusterrolebinding \
   -l 'app=cert-manager' -l 'chart=cert-manager-v0.5.2'
   ```

   使用你安装的 vX.Y 版本的链接删除 CustomResourceDefinition：

   ```plain
   kubectl delete -f cert-manager/cert-manager-crd-old.yaml
   ```

1. 单独安装 CustomResourceDefinition 资源：

   ```plain
   kubectl apply -f cert-manager/cert-manager-crd.yaml
   ```

   > **注意**：如果你运行的 Kubernetes 版本是 1.15 或更低版本，你需要在以上的 `kubectl apply` 命令中添加 `--validate=false`。否则你将看到 cert-manager CRD 资源中的 `x-kubernetes-preserve-unknown-fields` 字段校验错误提示。这是 kubectl 执行资源校验方式产生的良性错误。

1. 为 cert-manager 创建命名空间：

   ```plain
   kubectl create namespace cert-manager
   ```

1. 安装 cert-manager：

   ```plain
   kubectl -n cert-manager apply -R -f ./cert-manager
   ```

1. [恢复备份资源](https://cert-manager.io/docs/tutorials/backup/#restoring-resources)：

   ```plain
   kubectl apply -f cert-manager-backup.yaml
   ```



### 验证部署

安装完 cert-manager 后，你可以通过检查 kube-system 命名空间中正在运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

## Cert-Manager API 变更和数据迁移

Cert-manager 已经弃用 `certificate.spec.acme.solvers` 字段，而且会在未来的版本中放弃对该字段的支持。

根据 cert-manager 文档，v0.8 引入了配置 ACME 证书资源的新格式。具体来说，就是移动了 challenge solver 字段。v0.9 新旧格式均支持。请知悉，之后发布的新 cert-manager 版本会放弃对旧格式的支持。Cert-Manager 文档建议你在更新后，将 ACME 颁发者和证书资源更新到新格式。

如需了解变更细节以及迁移说明，请参见[将 Cert-Manager 从 v0.7 升级到 v0.8](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)。

v0.11 版本标志着删除先前 Cert-Manager 版本中使用的 v1alpha1 API，以及将 API 组从 certmanager.k8s.io 更改到 cert-manager.io。

此外，我们已不再支持 v0.8 版本中已弃用的旧配置格式。换言之，在升级到 v0.11 之前，你必须先为 ACME 发行者使用新的 solver 样式配置格式作为过渡。详情请参见[升级到 v0.8](https://cert-manager.io/docs/installation/upgrading/upgrading-0.7-0.8/)。

如需了解变更细节以及迁移说明，请参见[将 Cert-Manager 从 v0.10 升级到 v0.11](https://cert-manager.io/docs/installation/upgrading/upgrading-0.10-0.11/)。

如需获得更多信息，请参见 [Cert-Manager 升级](https://cert-manager.io/docs/installation/upgrading/)。

