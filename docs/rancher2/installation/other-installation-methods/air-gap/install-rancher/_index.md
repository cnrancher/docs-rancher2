---
title: 4、安装 Rancher
description: 本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。
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
  - 其他安装方法
  - 离线安装
  - 安装 Rancher
---

本节介绍如何为离线环境部署 Rancher。您可以离线安装 Rancher Server，它可能处于防火墙之后或在代理之后。本文将介绍高可用离线安装（推荐）和单节点离线安装。

## 高可用安装（推荐）

> **注意：** 这个安装指南假定您使用的是 Helm3。有关从 Helm 2 开始的安装迁移，请参考官方的[Helm2 到 3 迁移文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。[这里](/docs/rancher2/installation/options/air-gap-helm2/_index)提供了较旧的离线安装指南版本，该说明适用于使用 Helm2 在 Kubernetes 上安装的 Rancher。如果无法升级到 Helm3，则可以使用它。

Rancher 建议在 Kubernetes 集群上安装 Rancher。高可用的 Kubernetes 安装包含三个节点。持久层（etcd）数据也可以在这三个节点上进行复制，以便在节点之一发生故障时提供冗余和数据复制。

本节分五个部分介绍如何安装高可用 Rancher：

- [添加 Helm Chart 仓库](#添加-helm-chart-仓库)
- [SSL 配置](#选择您的-ssl-配置)
- [配置 Rancher Helm 模板](#渲染您的-rancher-helm-模板)
- [安装 Rancher](#安装-rancher)
- [针对 Rancher 2.3.0 之前版本配置 system-chart](#针对-rancher230-之前版本配置-system-chart)

### 添加 Helm Chart 仓库

从可以访问 Internet 的系统中，获取最新的 Rancher Helm Chart，然后将内容复制到可以访问 Rancher Server 集群的系统中。

1. 如果您还没有在有互联网访问的系统上安装`helm`。注意：请参考[Helm 版本要求](/docs/rancher2/installation/options/helm-version/_index)来选择一个 Helm 版本来安装 Rancher。

1. 使用`helm repo add`来添加仓库，不同的地址适应不同的 Rancher 版本，请替换命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息请参考[如何选择 Rancher 版本](/docs/rancher2/installation/options/server-tags/_index)。

   - `latest`： 最新版，建议在尝试新功能时使用。
   - `stable`：稳定版，建议生产环境中使用。
   - `alpha`：预览版， 未来版本的实验性预览。

   ```
   helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

1. 获取最新的 Rancher Chart，您会看到对应的 tgz 文件下载到本地。

   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```

> 是否需要其他选项？您需要进行故障排查的帮助吗？请参阅[高可用安装 - 高级选项](/docs/rancher2/installation/k8s-install/helm-rancher/_index)。

### 选择您的 SSL 配置

Rancher Server 在默认情况下被设计为安全的，并且需要 SSL/TLS 配置。

当在离线环境的 Kubernetes 中安装 Rancher 时，推荐两种证书生成方式。

> **注意：**如果要在外部终止 SSL/TLS，请参阅[在外部负载均衡器上终止 TLS](/docs/rancher2/installation/options/chart-options/_index)。

| 设置                     | Chart 选项                   | 描述                                                                                                  | 是否需要 cert-manager？ |
| :----------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------- | ----------------------- |
| Rancher 生成的自签名证书 | `ingress.tls.source=rancher` | 使用 Rancher 生成的 CA 签发的自签名证书此项为**默认选项**。在渲染 Rancher Helm 模板时不需要传递此项。 | 是                      |
| 已有的证书               | `ingress.tls.source=secret`  | 通过创建 Kubernetes Secret（s）使用您已有的证书文件。<br />渲染 Rancher Helm 模板时必须传递此选项。   | 否                      |

:::important 重要
Rancher 中国技术支持团队建议您使用“您已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

### 渲染您的 Rancher Helm 模板

设置 Rancher Helm 模板时，Chart 中有几个选项是专门为离线安装设计的。

| Chart 选项              | 值                               | 描述                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `certmanager.version`   | ""                               | 根据运行的 cert-manager 版本配置适当的 Rancher TLS 颁发者。                                                                                                                                                                                                                                                                                                                                                     |
| `systemDefaultRegistry` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 配置 Rancher，在创建集群时，Rancher Server 始终从私有镜像仓库中拉取镜像                                                                                                                                                                                                                                                                                                                                         |
| `useBundledSystemChart` | `true`                           | 配置 Rancher Server 使用内置的 system-chart，[system-chart](https://github.com/rancher/system-charts)中包含监控，日志，告警和全局 DNS 等功能所需的 Chart。这些 [Helm charts](https://github.com/rancher/system-charts) 位于 GitHub 中，但是由于您处于离线环境中，因此使用 Rancher 中内置的 Chart 比设置一个 Git 镜像简单得多。当然您也可以选择自己手动镜像 GitHub 中的 Rancher System Chart。_自 v2.3.0 起可用_ |

根据您在[B. 选择您的 SSL 配置](#选择您的-ssl-配置)做出的选择，完成以下步骤之一。

#### 选项 A - 使用 Rancher 默认的自签名证书

默认情况下，Rancher 会生成一个 CA 并使用 cert-manager 颁发证书以访问 Rancher Server 界面。

> **注意：**
> 由于 cert-manager 最近的改动，您需要进行升级。如果您要升级 Rancher 并在使用版本低于 v0.11.0 的 cert-manager，请参阅我们的[升级 cert-manager 文档](/docs/rancher2/installation/options/upgrading-cert-manager/_index)。

1. 在可以连接互联网的系统中，添加 cert-manager 仓库。

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   ```

1. 从 [Helm Chart 仓库](https://hub.helm.sh/charts/jetstack/cert-manager) 中获取最新的 cert-manager Chart。

   ```plain
   helm fetch jetstack/cert-manager --version v0.12.0
   ```

1. 使用您期望的参数渲染 chart 模板，切记设置`image.repository`以便从私有镜像仓库中拉取 Chart。这将生成一个包含相关 YAML 的名为`cert-manager`的文件夹。

   ```plain
   helm template cert-manager ./cert-manager-v0.12.0.tgz --output-dir . \
       --namespace cert-manager \
       --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller \
       --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook \
       --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector
   ```

1. 下载 cert-manager 所需的 CRD 文件。

   ```plain
   curl -L -o cert-manager/cert-manager-crd.yaml https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   ```

1. 渲染 Rancher 模板，声明您选择的选项。使用下面的参考表替换每个占位符。需要将 Rancher 配置为在由 Rancher 启动 Kubernetes 集群或 Rancher 工具时，使用私有镜像库。

   | 占位符                           | 描述                 |
   | :------------------------------- | :------------------- |
   | `<VERSION>`                      | 对应 Rancher 版本    |
   | `<RANCHER.YOURDOMAIN.COM>`       | 负载均衡对应的 DNS   |
   | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库对应的 DNS |
   | `<CERTMANAGER_VERSION>`          | Cert-manager 版本    |

   ```plain
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
   --namespace cattle-system \
   --set hostname=<RANCHER.YOURDOMAIN.COM> \
   --set certmanager.version=<CERTMANAGER_VERSION> \
   --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
   --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
   --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
   ```

**可选**：要安装指定的 Rancher 版本，请设置`rancherImageTag`的值，例如：`--set rancherImageTag = v2.3.6`

#### 选项 B - 使用已有的证书

根据您已有的证书创建 Kubernetes 密文，以供 Rancher 使用。证书的`common name`将需要与以下命令中的`hostname`选项匹配，否则 ingress controller 将无法为 Rancher 设置入口。

设置 Rancher 模板，声明您选择的选项。使用下面表中的参考选项，需要给 Rancher 配置使用私有镜像库。

| 占位符                           | 描述                 |
| :------------------------------- | :------------------- |
| `<VERSION>`                      | Rancher 版本         |
| `<RANCHER.YOURDOMAIN.COM>`       | 负载均衡器对应的 DNS |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库对应的 DNS |

```plain
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
    --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
```

如果您使用的是由私有 CA 签名的证书，则在`--set ingress.tls.source=secret`之后添加`--set privateCA=true`：

```plain
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set privateCA=true \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自v2.2.0可用，设置默认的系统镜像仓库
    --set useBundledSystemChart=true # 自v2.3.0可用，使用内嵌的 Rancher system charts
```

**可选**：要安装指定的 Rancher 版本，请设置`rancherImageTag`的值，例如：`--set rancherImageTag = v2.3.6`

然后请参考[添加 TLS 密文](/docs/rancher2/installation/options/tls-secrets/_index)发布证书文件，以便 Rancher 和 ingress controller 可以使用它们。

### 安装 Rancher

将以上配置完毕的内容复制到可以访问 Rancher Server 集群的系统中，准备妥当，完成最后的安装。

使用`kubectl`创建命名空间并安装配置好的 YAML。

如果您选择在[B. 选择您的 SSL 配置](#b-选择您的-ssl-配置)选择了使用 Rancher 默认的自签名证书，则安装 cert-manager。

#### 安装 Cert-manager（仅限使用 Rancher 默认自签名证书）

如果您使用的是 Rancher 默认的自签名证书，请安装 cert-manager：

1. 为 cert-manager 创建 namespace。

   ```plain
   kubectl create namespace cert-manager
   ```

1. 创建 cert-manager CRD。

   ```plain
   kubectl apply -f cert-manager/cert-manager-crd.yaml
   ```

   > **注意：**
   > 如果您在使用 Kubernetes v1.15 或更低的版本，您需要在`kubectl apply`命令中添加`--validate=false`。否则您将看到一个关于 cert-manager 的 CRD 资源中的`x-kubernetes-preserve-unknown-fields`字段的校验错误。这是由于 kubectl 执行资源验证的方式改变产生的良性错误。

1. 启动 cert-manager。

   ```plain
   kubectl apply -R -f ./cert-manager
   ```

安装 Rancher：

```plain
kubectl create namespace cattle-system
kubectl -n cattle-system apply -R -f ./rancher
```

**步骤结果：** 如果您在安装 Rancher v2.3.0+，则安装完成。

**说明：** 如果您不打算发送遥测数据，请在初始登录时选择退出[遥测](/docs/rancher2/faq/telemetry/_index)。如果在离线安装的环境中让这个功能处于 active 状态，会导致无法成功打开 socket 的问题。

### 针对 Rancher 2.3.0 之前版本配置 system-chart

如果要安装 v2.3.0 之前的 Rancher 版本，则将无法使用内置打包的 system-charts。由于 Rancher system-charts 托管在 Github 中，因此，离线安装将无法访问 charts。因此，您必须[配置 Rancher system-charts](/docs/rancher2/installation/options/local-system-charts/_index)。

### 其他资源

这些资源在安装 Rancher 时可能会有帮助：

- [Rancher Helm Chart 选项](/docs/rancher2/installation/options/chart-options/_index)
- [添加 TLS 密文](/docs/rancher2/installation/options/tls-secrets/_index)
- [安装过程的故障排查](/docs/rancher2/installation/options/troubleshooting/_index)

## 单节点安装

Docker 单节点安装适用于想要对 Rancher 进行`测试`的 Rancher 用户。您可以使用 `docker run` 命令在单个节点上安装 Rancher Server 组件，而不是在 Kubernetes 集群上运行。由于只有一个节点和一个 Docker 容器，因此，如果该节点发生故障，并且其他节点上没有可用的 Rancher 数据副本，您将丢失 Rancher Server 的所有数据。

**重要提示：如果您按照 Docker 单节点安装指南安装 Rancher，则没有升级路径可将 Docker 单节点安装过渡到 Kubernetes 安装。**

除了运行单节点安装，您还可以选择按照 Rancher 高可用安装指南，但只使用一个节点来安装 Rancher 和 Kubernetes。之后，您可以扩展 Kubernetes 集群中的 etcd 节点，使其成为真正的高可用安装。

为了安全起见，使用 Rancher 时需要 SSL。SSL 保护所有 Rancher 网络通信的安全，例如在您登录集群或与集群交互时。

| 环境变量键                       | 环境变量值                       | 描述                                                                                                                                                                                                                                                                                                                                                                                                            |
| :------------------------------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CATTLE_SYSTEM_DEFAULT_REGISTRY` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 在配置集群时，将 Rancher Server 配置为始终从您的私有镜像库中拉取镜像。                                                                                                                                                                                                                                                                                                                                          |
| `CATTLE_SYSTEM_CATALOG`          | `bundled`                        | 配置 Rancher Server 使用内置的 system-chart，[system-chart](https://github.com/rancher/system-charts)中包含监控，日志，告警和全局 DNS 等功能所需的 Chart。这些 [Helm charts](https://github.com/rancher/system-charts) 位于 GitHub 中，但是由于您处于离线环境中，因此使用 Rancher 中内置的 Chart 比设置一个 Git 镜像简单得多。当然您也可以选择自己手动镜像 GitHub 中的 Rancher System Chart。_自 v2.3.0 起可用_ |

> **您想要...**
>
> - 配置自定义 CA 根证书以访问您的服务？ 请参阅[自定义 CA 根证书](/docs/rancher2/installation/options/custom-ca-root-certificate/_index)。
> - 开启 API 审计日志，请参阅[API 审计日志](/docs/rancher2/installation/other-installation-methods/single-node-docker/advanced/_index#api-审计日志)。

- 对于 v2.3.0 之前的 Rancher，您需要设置 Git 镜像将 system-charts 置于网络中 Rancher 可以访问的位置。然后，在安装 Rancher 之后，您将需要配置 Rancher 以使用该 Git 仓库。有关详细信息，请参阅[在 v2.3.0 之前为 Rancher 设置 system-charts。](/docs/rancher2/installation/options/local-system-charts/_index)

选择使用 Rancher 默认的自签名证，或使用已有的自签名证书：

#### 选项 A - 使用 Rancher 默认的自签名证书

如果要在不涉及身份验证的开发或测试环境中安装 Rancher，请使用其生成的自签名证书安装 Rancher。此安装选项省去了自己生成证书的麻烦。

登录到 Linux 主机，然后运行下面的安装命令。输入命令时，请参考下面的配置。

| 占位符                           | 描述                                                                               |
| :------------------------------- | :--------------------------------------------------------------------------------- |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库地址                                                                     |
| `<RANCHER_VERSION_TAG>`          | 您要安装的[Rancher 版本](/docs/rancher2/installation/options/server-tags/_index)。 |

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置默认的系统镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 自v2.3.0可用，使用内嵌的 Rancher system charts
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 B - 使用已有的自签名证书

在您的团队将访问 Rancher Server 的开发或测试环境中，创建一个自签名证书以供您的安装使用，以便您的团队可以验证它们是否正在连接到 Rancher 实例。

> **先决条件：**
> 在具有互联网连接的计算机上，使用[OpenSSL](https://www.openssl.org/)或您选择的其他方法创建自签名证书。
>
> - 证书文件必须为[PEM 格式](/docs/rancher2/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。
> - 其他证书问题[SSL 常见问题和问题排查](/docs/rancher2/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

创建证书后，登录到 Linux 主机，运行以下安装命令。输入命令时，请使用下表替换每个占位符。使用`-v`标志并提供证书的路径以将其安装在容器中。

| 占位符                           | 描述                                                                             |
| :------------------------------- | :------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`               | 证书文件所在目录                                                                 |
| `<FULL_CHAIN.pem>`               | 证书链文件路径                                                                   |
| `<PRIVATE_KEY.pem>`              | 证书私有密钥路径                                                                 |
| `<CA_CERTS.pem>`                 | 证书颁发机构的证书的路径                                                         |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库                                                                       |
| `<RANCHER_VERSION_TAG>`          | 您要安装的[Rancher 版本](/docs/rancher2/installation/options/server-tags/_index) |

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
    -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
    -v /<CERT_DIRECTORY>/<CA_CERTS.pem>:/etc/rancher/ssl/cacerts.pem \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置默认的系统镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 自v2.3.0可用，使用内嵌的 Rancher system charts
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

#### 选项 C - 使用已有的权威机构颁发的证书

在要公开展示应用程序的开发或测试环境中，请使用由公认的 CA 签名的证书，这样您的用户群就不会遇到安全警告。

> **先决条件：** 证书文件必须为[PEM 格式](/docs/rancher2/installation/other-installation-methods/single-node-docker/troubleshooting/_index)。

获得证书后，登录到 Linux 主机，然后运行下面的安装命令。由于您的证书是由公认的 CA 签名的，因此不需要安装其他 CA 证书文件。

| 占位符                           | 描述                                                                             |
| :------------------------------- | :------------------------------------------------------------------------------- |
| `<CERT_DIRECTORY>`               | 证书文件所在目录                                                                 |
| `<FULL_CHAIN.pem>`               | 证书链文件路径                                                                   |
| `<PRIVATE_KEY.pem>`              | 证书私有密钥路径                                                                 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 私有镜像库                                                                       |
| `<RANCHER_VERSION_TAG>`          | 您要安装的[Rancher 版本](/docs/rancher2/installation/options/server-tags/_index) |

> **注意：**使用`--no-cacerts`作为容器的参数来禁用 Rancher 生成的默认 CA 证书。

```
docker run -d --restart=unless-stopped \
    -p 80:80 -p 443:443 \
    --no-cacerts \
    -v /<CERT_DIRECTORY>/<FULL_CHAIN.pem>:/etc/rancher/ssl/cert.pem \
    -v /<CERT_DIRECTORY>/<PRIVATE_KEY.pem>:/etc/rancher/ssl/key.pem \
    -e CATTLE_SYSTEM_DEFAULT_REGISTRY=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置默认的系统镜像仓库
    -e CATTLE_SYSTEM_CATALOG=bundled \ # 自v2.3.0可用，使用内嵌的 Rancher system charts
    <REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher:<RANCHER_VERSION_TAG>
```

**说明：** 如果您不打算发送遥测数据，请在初始登录时选择退出[遥测](/docs/rancher2/faq/telemetry/_index)。

如果要安装 v2.3.0 之前的 Rancher 版本，则将无法使用内置的 system-charts。由于 Rancher system-charts 托管在 Github 中，因此，离线安装将无法访问这些 charts。所以，您必须[配置 Rancher system-charts](/docs/rancher2/installation/options/local-system-charts/_index)。

如果您要安装 Rancher v2.3.0+，则安装完成。
