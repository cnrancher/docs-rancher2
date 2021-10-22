---
title: 4、安装 Rancher
description: 本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。
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
  - 安装指南
  - 其他安装方法
  - 离线安装
  - 安装 Rancher
---

## 概述

本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。

## 开启特权模式

当您将 Rancher server 部署在 Docker 容器中时，容器内会安装一个本地 Kubernetes 集群供 Rancher 使用。因为 Rancher 的很多功能都是以 deployments 的方式运行的，而在容器内运行容器是需要特权模式的，**所以你需要在安装 Rancher 时添加`--privileged`标签，开启特权模式。**

## 高可用安装（推荐）

Rancher 建议在 Kubernetes 集群上安装 Rancher。高可用的 Kubernetes 安装包含三个节点。持久层（etcd）数据也可以在这三个节点上进行复制，以便在节点之一发生故障时提供冗余和数据复制。

本节分四个部分介绍如何安装高可用 Rancher：

- [添加 Helm Chart 仓库](#添加-helm-chart-仓库)
- [SSL 配置](#选择您的-ssl-配置)
- [配置 Rancher Helm 模板](#渲染您的-rancher-helm-模板)
- [安装 Rancher](#安装-rancher)

### 添加 Helm Chart 仓库

从可以访问 Internet 的系统中，获取最新的 Rancher Helm Chart，然后将内容复制到可以访问 Rancher Server 集群的系统中。

1. 如果您还没有在有互联网访问的系统上安装`helm`。注意：请参考[Helm 版本要求](/docs/rancher2.5/installation/resources/helm-version/_index)来选择一个 Helm 版本来安装 Rancher。

1. 使用`helm repo add`来添加仓库，不同的地址适应不同的 Rancher 版本，请替换命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息请参考[如何选择 Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/_index)。

   - `latest`： 最新版，建议在尝试新功能时使用。
   - `stable`：稳定版，建议生产环境中使用。
   - `alpha`：预览版， 未来版本的实验性预览。

   ```
   helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

1. 获取最新的 Rancher Chart，您会看到对应的 tgz 文件下载到本地。

   ```shell
   helm fetch rancher-<CHART_REPO>/rancher

   ```

   如果需要下载特定版本 Rancher 的，你可以用`--version`参数指定版本，例如，以下代码示例通过`--version=v2.4.8`，指定下载 Rancher 的版本为 v2.4.8：

   ```
   helm fetch rancher-stable/rancher --version=v2.4.8
   ```

### 选择您的 SSL 配置

Rancher Server 在默认情况下被设计为安全的，并且需要 SSL/TLS 配置。

当在离线环境的 Kubernetes 中安装 Rancher 时，推荐两种证书生成方式。

> **注意：**如果要在外部终止 SSL/TLS，请参阅[在外部负载均衡器上终止 TLS](/docs/rancher2.5/installation/resources/chart-options/_index)。

| 设置                     | Chart 选项                   | 描述                                                                                                  | 是否需要 cert-manager？ |
| :----------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------- | ----------------------- |
| Rancher 生成的自签名证书 | `ingress.tls.source=rancher` | 使用 Rancher 生成的 CA 签发的自签名证书此项为**默认选项**。在渲染 Rancher Helm 模板时不需要传递此项。 | 是                      |
| 已有的证书               | `ingress.tls.source=secret`  | 通过创建 Kubernetes Secret（s）使用您已有的证书文件。<br />渲染 Rancher Helm 模板时必须传递此选项。   | 否                      |

:::important 重要
Rancher 中国技术支持团队建议您使用“您已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

### 离线环境可用的 Helm Chart 选项

| Chart 选项              | 值                               | 描述                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `certmanager.version`   | ""                               | 根据运行的 cert-manager 版本配置适当的 Rancher TLS 颁发者。                                                                                                                                                                                                                                                                                                                                                     |
| `systemDefaultRegistry` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 配置 Rancher，在创建集群时，Rancher Server 始终从私有镜像仓库中拉取镜像                                                                                                                                                                                                                                                                                                                                         |
| `useBundledSystemChart` | `true`                           | 配置 Rancher Server 使用内置的 system-chart，[system-chart](https://github.com/rancher/system-charts)中包含监控，日志，告警和全局 DNS 等功能所需的 Chart。这些 [Helm charts](https://github.com/rancher/system-charts) 位于 GitHub 中，但是由于您处于离线环境中，因此使用 Rancher 中内置的 Chart 比设置一个 Git 镜像简单得多。当然您也可以选择自己手动镜像 GitHub 中的 Rancher System Chart。_自 v2.3.0 起可用_ |

### 渲染您的 Rancher Helm 模板

根据您在[B. 选择您的 SSL 配置](#选择您的-ssl-配置)做出的选择，完成以下步骤之一。

#### 选项 A - 使用 Rancher 默认的自签名证书

默认情况下，Rancher 会生成一个 CA 并使用 cert-manager 颁发证书以访问 Rancher Server 界面。

> **注意：**
> 由于 cert-manager 最近的改动，您需要进行升级。如果您要升级 Rancher 并在使用版本低于 v0.11.0 的 cert-manager，请参阅我们的[升级 cert-manager 文档](/docs/rancher2.5/installation/resources/upgrading-cert-manager/_index)。

1. 在可以连接互联网的系统中，添加 cert-manager 仓库。

   ```shell
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   ```

1. 从 [Helm Chart 仓库](https://hub.helm.sh/charts/jetstack/cert-manager) 中获取最新的 cert-manager Chart。

   ```shell
   helm fetch jetstack/cert-manager --version v1.5.1
   ```

1. 使用您期望的参数渲染 chart 模板，切记设置`image.repository`以便从私有镜像仓库中拉取 Chart。这将生成一个包含相关 YAML 的名为`cert-manager`的文件夹。

   ```shell
   helm template cert-manager ./cert-manager-v1.5.1.tgz --output-dir . \
       --namespace cert-manager \
       --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller \
       --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook \
       --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

1. 下载 cert-manager 所需的 CRD 文件。

   ```shell
   curl -L -o cert-manager/cert-manager-crd.yaml https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml
   ```

1. 渲染 Rancher 模板，声明您选择的选项。使用下面的参考表替换每个占位符。需要将 Rancher 配置为在由 Rancher 启动 Kubernetes 集群或 Rancher 工具时，使用私有镜像库。

   | 占位符                           | 描述                 |
   | :------------------------------- | :------------------- |
   | `<VERSION>`                      | 对应 Rancher 版本    |
   | `<RANCHER.YOURDOMAIN.COM>`       | 负载均衡对应的 DNS   |
   | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库对应的 DNS |
   | `<CERTMANAGER_VERSION>`          | Cert-manager 版本    |

   **2.5.8 之前的版本：**

   ```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set certmanager.version=<CERTMANAGER_VERSION> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
   ```

   **2.5.8 之后的版本：**

   ```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # prevent files for Helm hooks from being generated
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set certmanager.version=<CERTMANAGER_VERSION> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
   ```

#### 选项 B - 使用已有的证书

根据您已有的证书创建 Kubernetes 密文，以供 Rancher 使用。证书的`common name`将需要与以下命令中的`hostname`选项匹配，否则 ingress controller 将无法为 Rancher 设置入口。

设置 Rancher 模板，声明您选择的选项。使用下面表中的参考选项，需要给 Rancher 配置使用私有镜像库。

| 占位符                           | 描述                 |
| :------------------------------- | :------------------- |
| `<VERSION>`                      | Rancher 版本         |
| `<RANCHER.YOURDOMAIN.COM>`       | 负载均衡器对应的 DNS |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库对应的 DNS |

**2.5.8 之前的版本：**

```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
```

如果您使用的是由私有 CA 签名的证书，则在`--set ingress.tls.source=secret`之后添加`--set privateCA=true`：

```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set privateCA=true \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
```

**2.5.8 之后的版本：**

```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # prevent files for Helm hooks from being generated
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
```

如果您使用的是由私有 CA 签名的证书，则在`--set ingress.tls.source=secret`之后添加`--set privateCA=true`：

```shell
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # prevent files for Helm hooks from being generated
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set privateCA=true \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
    --set useBundledSystemChart=true # Use the packaged Rancher system charts
```

**可选**：要安装指定的 Rancher 版本，请设置`rancherImageTag`的值，例如：`--set rancherImageTag = v2.3.6`

然后请参考[添加 TLS 密文](/docs/rancher2.5/installation/resources/tls-secrets/_index)发布证书文件，以便 Rancher 和 ingress controller 可以使用它们。

### 安装 Rancher

将以上配置完毕的内容复制到可以访问 Rancher Server 集群的系统中，准备妥当，完成最后的安装。

使用`kubectl`创建命名空间并安装配置好的 YAML。

如果您选择在[B. 选择您的 SSL 配置](#b-选择您的-ssl-配置)选择了使用 Rancher 默认的自签名证书，则安装 cert-manager。

#### 安装 Cert-manager（仅限使用 Rancher 默认自签名证书）

如果您使用的是 Rancher 默认的自签名证书，请安装 cert-manager：

1. 为 cert-manager 创建 namespace。

   ```shell
   kubectl create namespace cert-manager
   ```

1. 创建 cert-manager CRD。

   ```shell
   kubectl apply -f cert-manager/cert-manager-crd.yaml
   ```

   > **注意：**
   > 如果您在使用 Kubernetes v1.15 或更低的版本，您需要在`kubectl apply`命令中添加`--validate=false`。否则您将看到一个关于 cert-manager 的 CRD 资源中的`x-kubernetes-preserve-unknown-fields`字段的校验错误。这是由于 kubectl 执行资源验证的方式改变产生的良性错误。

1. 启动 cert-manager。

   ```shell
   kubectl apply -R -f ./cert-manager
   ```

1. 安装 Rancher：

   ```shell
   kubectl create namespace cattle-system
   kubectl -n cattle-system apply -R -f ./rancher
   ```

**步骤结果：** 如果您在安装 Rancher v2.3.0+，则安装完成。

**说明：** 如果您不打算发送遥测数据，请在初始登录时选择退出[遥测](/docs/rancher2.5/faq/telemetry/_index)。如果在离线安装的环境中让这个功能处于 active 状态，会导致无法成功打开 socket 的问题。

### 其他资源

这些资源在安装 Rancher 时可能会有帮助：

- [Rancher Helm Chart 选项](/docs/rancher2.5/installation/resources/chart-options/_index)
- [添加 TLS 密文](/docs/rancher2.5/installation/resources/tls-secrets/_index)
- [安装过程的故障排查](/docs/rancher2.5/installation/other-installation-methods/troubleshooting/_index)
