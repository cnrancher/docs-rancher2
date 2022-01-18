---
title: 4. 安装 Rancher
weight: 400
---

本文介绍如何在高可用 Kubernetes 安装的离线环境部署 Rancher。离线环境可以是 Rancher Server 离线安装、防火墙后面或代理后面。

### Rancher 特权访问

当 Rancher Server 部署在 Docker 容器中时，容器内会安装一个本地 Kubernetes 集群供 Rancher 使用。为 Rancher 的很多功能都是以 deployment 的方式运行的，而在容器内运行容器是需要特权模式的，因此你需要在安装 Rancher 时添加 `--privileged` 选项。

# Docker 说明

如果你想使用 Docker 命令进行离线安装，请跳过本页的剩余部分，并按照[此页](./docker-install-commands)进行操作。

# Kubernetes 说明

我们建议在 Kubernetes 集群上安装 Rancher。高可用的 Kubernetes 安装的情况下，一个 Kubernetes 集群包含三个运行 Rancher Server 组件的节点。持久层（etcd）也在这三个节点上进行复制，以便在其中一个节点发生故障时提供冗余和数据复制。

本文介绍如何安装 Rancher：

- [1. 添加 Helm Chart 仓库](#1-add-the-helm-chart-repository)
- [2. 选择 SSL 配置](#2-choose-your-ssl-configuration)
- [3. 渲染 Rancher Helm 模板](#3-render-the-rancher-helm-template)
- [4. 安装 Rancher](#4-install-rancher)

# 1. 添加 Helm Chart 仓库

从可以访问互联网的系统中，获取最新的 Helm Chart，然后将 manifest 复制到可访问 Rancher Server 集群的系统中。

1. 如果你还没有安装 `helm`，请在可访问互联网的工作站上进行本地安装。注意：参考 [Helm 版本要求]({{<baseurl>}}/rancher/v2.6/en/installation/resources/helm-version)选择 Helm 版本来安装Rancher。

2. 执行 `helm repo add` 命令，以添加包含安装 Rancher 的 Chart 的 Helm Chart 仓库。有关如何选择仓库，以及哪个仓库最适合你的用例，请参见[选择 Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#helm-chart-repositories)。

   ```
   helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
   ```

3. 获取最新的 Rancher Chart。此操作将获取 Chart 并将其作为 `.tgz` 文件保存在当前目录中。
   ```plain
   helm fetch rancher-<CHART_REPO>/rancher
   ```

   如需下载特定的 Rancher 版本，你可以用 Helm `--version` 参数指定版本，如下：
   ```plain
   helm fetch rancher-stable/rancher --version=v2.4.8
   ```

# 2. 选择 SSL 配置

Rancher Server 默认设计为安全的，并且需要 SSL/TLS 配置。

如果你在离线的 Kubernetes 集群中安装 Rancher，我们建议使用以下两种证书生成方式。

> :::note 注意
> 如果你想在外部终止 SSL/TLS，请参见[外部负载均衡器的 TLS 终止]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)。
> :::

| 配置 | Chart 选项 | 描述 | 是否需要 cert-manager |
| ------------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Rancher 生成的自签名证书 | `ingress.tls.source=rancher` | 使用 Rancher 生成的 CA 签发的自签名证书<br>。此项是**默认选项**。在渲染 Helm 模板的时候不需要传递此项。 | 是 |
| 你已有的证书 | `ingress.tls.source=secret` | 通过创建 Kubernetes 密文使用你自己的证书文件。<br> 在渲染 Rancher Helm 模板时必须传递此选项。 | 否 |

# 离线安装的 Helm Chart 选项

在配置 Rancher Helm 模板时，Helm Chart 中有几个专为离线安装设计的选项，如下表：

| Chart 选项 | Chart 值 | 描述 |
| ----------------------- | -------------------------------- | ---- |
| `certmanager.version` | "<version>" | 根据运行的 cert-manager 版本配置适当的 Rancher TLS 颁发者。 |
| `systemDefaultRegistry` | `<REGISTRY.YOURDOMAIN.COM:PORT>` | 将 Rancher Server 配置成在配置集群时，始终从私有镜像仓库中拉取镜像。 |
| `useBundledSystemChart` | `true` | 配置 Rancher Server 使用打包的 Helm System Chart 副本。[system charts](https://github.com/rancher/system-charts) 仓库包含所有监控，日志管理，告警和全局 DNS 等功能所需的应用商店项目。这些 [Helm Chart](https://github.com/rancher/system-charts) 位于 GitHub 中。但是由于你处在离线环境，因此使用 Rancher 内置的 Chart 会比设置 Git mirror 容易得多。 |

# 3. 渲染 Rancher Helm 模板

根据你在[2：选择 SSL 配置](#2-choose-your-ssl-configuration)中的选择，完成以下步骤之一：

# 选项 A：使用 Rancher 默认的自签名证书


默认情况下，Rancher 会生成一个 CA 并使用 cert-manager 颁发证书以访问 Rancher Server 界面。

> :::note 注意
> 由于 cert-manager 的最新改动，你需要升级 cert-manager 版本。如果你需要升级 Rancher 并使用低于 0.11.0 的 cert-manager 版本，请参见 [cert-manager 升级文档]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager/)。
> :::

### 1. 添加 cert-manager 仓库

在可以连接互联网的系统中，将 cert-manager 仓库添加到 Helm：

```plain
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

### 2. 获取 cert-manager Chart

从 [Helm Chart 仓库](https://hub.helm.sh/charts/jetstack/cert-manager)中获取最新可用的 cert-manager Chart：

```plain
helm fetch jetstack/cert-manager --version v1.5.1
```

### 3. 渲染 cert-manager 模板

使用你想用来安装 Chart 的选项来渲染 cert-manager 模板。记住要设置 `image.repository` 选项，以从你的私有镜像仓库拉取镜像。此操作会创建一个包含 Kubernetes manifest 文件的 `cert-manager` 目录。

```plain
helm template cert-manager ./cert-manager-v1.5.1.tgz --output-dir . \
    --namespace cert-manager \
    --set image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-controller \
    --set webhook.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-webhook \
    --set cainjector.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-cainjector \
    --set startupapicheck.image.repository=<REGISTRY.YOURDOMAIN.COM:PORT>/quay.io/jetstack/cert-manager-ctl
```

### 4. 下载 cert-manager CRD

为 cert-manager 下载所需的 CRD 文件：
```plain
curl -L -o cert-manager/cert-manager-crd.yaml https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml
```

### 5. 渲染 Rancher 模板

渲染 Rancher 模板来声明你的选项。参考下表来替换每个占位符。Rancher 需要配置为使用私有镜像仓库，以便配置所有 Rancher 启动的 Kubernetes 集群或 Rancher 工具。


| 占位符 | 描述 |
------------|-------------
| `<VERSION>` | 输出压缩包的版本号。 |
| `<RANCHER.YOURDOMAIN.COM>` | 指向负载均衡器的 DNS 名称。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 你的私有镜像仓库的 DNS 名称。 |
| `<CERTMANAGER_VERSION>` | 在 K8s 集群上运行的 cert-manager 版本。 |

```plain
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # 避免生成 Helm 钩子文件
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set certmanager.version=<CERTMANAGER_VERSION> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    --set useBundledSystemChart=true # 使用打包的 Rancher System Chart
```

**可选**：如需安装特定的 Rancher 版本，设置`rancherImageTag` 的值，例如：`--set rancherImageTag=v2.5.8`

# 选项 B：使用 Kubernetes 密文从文件中获取证书


### 1. 创建密文

使用你自己的证书来创建 Kubernetes 密文，以供 Rancher 使用。证书的 common name 需要与以下命令中的 `hostname` 选项匹配，否则 Ingress Controller 将无法为 Rancher 配置站点。

### 2. 渲染 Rancher 模板

渲染 Rancher 模板来声明你的选项。参考下表来替换每个占位符。Rancher 需要配置为使用私有镜像仓库，以便配置所有 Rancher 启动的 Kubernetes 集群或 Rancher 工具。

| 占位符 | 描述 |
| -------------------------------- | ----------------------------------------------- |
| `<VERSION>` | 输出压缩包的版本号。 |
| `<RANCHER.YOURDOMAIN.COM>` | 指向负载均衡器的 DNS 名称。 |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 你的私有镜像仓库的 DNS 名称。 |

```plain
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # 避免生成 Helm 钩子文件
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    --set useBundledSystemChart=true # 使用打包的 Rancher System Chart
```

如果你使用的是私有 CA 签名的证书，请在 `--set ingress.tls.source=secret` 后加上 `--set privateCA=true`：

```plain
   helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # 避免生成 Helm 钩子文件
    --namespace cattle-system \
    --set hostname=<RANCHER.YOURDOMAIN.COM> \
    --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
    --set ingress.tls.source=secret \
    --set privateCA=true \
    --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
    --set useBundledSystemChart=true # 使用打包的 Rancher System Chart
```

**可选**：如需安装特定的 Rancher 版本，设置`rancherImageTag` 的值，例如：`--set rancherImageTag=v2.3.6`

然后，参见[添加 TLS 密文]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-secrets/)发布证书文件，以便 Rancher 和 Ingress Controller 可以使用它们。

# 4. 安装 Rancher

将渲染的 manifest 目录复制到可以访问 Rancher Server 集群的系统中，以完成安装。

使用 `kubectl` 来创建命名空间和应用渲染的 manifest。

如果你使用自签名证书（在[选项B. 选择 SSL 配置](#b-choose-your-ssl-configuration)中），安装 cert-manager。

### 自签名证书安装 - 安装 Cert-manager



如果你使用自签名证书，安装 cert-manager：

1. 为 cert-manager 创建命名空间：
```plain
kubectl create namespace cert-manager
```

1. 创建 cert-manager CustomResourceDefinition (CRD)。
```plain
kubectl apply -f cert-manager/cert-manager-crd.yaml
```

    :::note 注意
    如果你运行的 Kubernetes 版本是 1.15 或更低版本，你需要在以上的 `kubectl apply` 命令中添加`--validate=false`，否则你将看到 cert-manager CRD 资源中的 `x-kubernetes-preserve-unknown-fields` 字段校验错误提示。这是 kubectl 执行资源校验方式产生的良性错误。
    :::

1. 启动 cert-manager.
```plain
kubectl apply -R -f ./cert-manager
```



### 使用 kubectl 安装 Rancher

```plain
kubectl create namespace cattle-system
kubectl -n cattle-system apply -R -f ./rancher
```
安装已完成。

> :::note 注意
> 如果你不想发送遥测数据，在首次登录时退出[遥测]({{<baseurl>}}/rancher/v2.6/en/faq/telemetry/)。如果在离线安装的环境中让这个功能处于 active 状态，socket 可能无法打开。
> :::

# 其他资源

以下资源可能对安装 Rancher 有帮助：

- [Rancher Helm Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)
- [添加 TLS 密文]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-secrets/)
- [Rancher Kubernetes 安装的故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/resources/troubleshooting/)
