---
title: 3、安装 Rancher
description: Rancher 使用 Kubernetes 的 Helm 软件包管理器安装。Helm Charts 为 Kubernetes YAML 清单文档提供了模板语法。有了 Helm，我们可以创建可配置的 Deployment，而不只是使用静态文件。有关创建您自己的 Deployment 的应用商店应用的更多信息，请查看 https://helm.sh/ 中的文档。对于无法直接访问 Internet 的系统，请参阅[Rancher 离线安装](/docs/installation/other-installation-methods/air-gap/_index)。选择要安装的 Rancher 版本，请参阅[选择 Rancher 版本](/docs/installation/options/server-tags/_index)。要选择用于安装 Rancher 的 Helm 版本，请参阅[Helm 版本要求](/docs/installation/options/helm-version/_index)。
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
  - Rancher高可用安装
  - 安装 Rancher
---

Rancher 使用 Kubernetes 的 Helm 软件包管理器安装。Helm Charts 为 Kubernetes YAML 清单文档提供了模板语法。

有了 Helm，我们可以创建可配置的 Deployment，而不只是使用静态文件。有关创建您自己的 Deployment 的应用商店应用的更多信息，请查看 https://helm.sh/ 中的文档。

对于无法直接访问 Internet 的系统，请参阅[Rancher 离线安装](/docs/installation/other-installation-methods/air-gap/_index)。

选择要安装的 Rancher 版本，请参阅[选择 Rancher 版本](/docs/installation/options/server-tags/_index)。

要选择用于安装 Rancher 的 Helm 版本，请参阅[Helm 版本要求](/docs/installation/options/helm-version/_index)。

:::important 注意
本安装指南假定您使用的是 Helm3。有关从 Helm 2 迁移到 Helm 3 的方法，请参阅官方的[Helm 2 到 3 迁移文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。这个[指南](/docs/installation/options/helm2/_index)提供了使用 Helm 2 在 RKE Kubernetes 集群上安装 Rancher 的较旧的安装指南，适用于无法升级到 Helm 3 的情况。
:::

## 1、安装需要的 CLI 工具

以下 CLI 工具是创建 Kubernetes 集群所必需的。请确保这些工具已安装并在您的`$PATH`中可用。

请查看 [Helm 项目提供的安装指南](https://helm.sh/docs/intro/install/)，来在您的平台上进行安装。

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具。
- [helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 的软件包管理工具。请参阅 [Helm 版本要求](/docs/installation/options/helm-version/_index)以选择要安装 Rancher 的 Helm 版本。

## 2、添加 Helm Chart 仓库

使用`helm repo add`命令添加含有 Rancher Chart 的 Helm Chart 仓库。

请将命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息，请查看[选择 Rancher 版本](/docs/installation/options/server-tags/_index)来选择最适合您的仓库。

- `latest`: 推荐在尝试新功能时使用。
- `stable`: 推荐生产环境中使用。（推荐）
- `alpha`: 未来版本的实验性预览。

<br/>

```
helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
```

## 3、为 Rancher 创建 Namespace

我们需要定义一个 Kubernetes Namespace，在 Namespace 中安装由 Chart 创建的资源。这个命名空间的名称为`cattle-system`：

```
kubectl create namespace cattle-system
```

## 4、选择您的 SSL 选项

Rancher Server 默认需要 SSL/TLS 配置来保证访问的安全性。

> **提示：** 如果您想要将 SSL/TLS 访问在外部终止，请查看[使用外部 TLS 负载均衡器](/docs/installation/options/chart-options/_index)。

有三种关于证书来源的推荐选项，证书将用来在 Rancher Server 中终止 TLS：

- **Rancher 生成的自签名证书：** 在这种情况下，您需要在集群中安装`cert-manager`。 Rancher 利用`cert-manager`签发并维护证书。Rancher 将生成自己的 CA 证书，并使用该 CA 签署证书。然后，`cert-manager`负责管理该证书。
- **Let's Encrypt：** Let's Encrypt 选项也需要使用`cert-manager`。但是，在这种情况下，`cert-manager`与特殊的 Issuer 结合使用，`cert-manager`将执行获取 Let's Encrypt 发行的证书所需的所有操作（包括申请和验证）。此配置使用 HTTP 验证（`HTTP-01`），因此负载均衡器必须具有可以从公网访问的公共 DNS 记录。
- **使用您自己的证书：** 此选项使您可以使用自己的权威 CA 颁发的证书或自签名 CA 证书。 Rancher 将使用该证书来保护 WebSocket 和 HTTPS 流量。在这种情况下，您必须上传名称分别为`tls.crt`和`tls.key`的 PEM 格式的证书以及相关的密钥。如果使用私有 CA，则还必须上传该证书。这是由于您的节点可能不信任此私有 CA。 Rancher 将获取该 CA 证书，并从中生成一个校验和，各种 Rancher 组件将使用该校验和来验证其与 Rancher 的连接。

| 设置                     | Chart 选项                       | 描述                                                           | 是否需要 cert-manager          |
| ------------------------ | -------------------------------- | -------------------------------------------------------------- | ------------------------------ |
| Rancher 生成的自签名证书 | `ingress.tls.source=rancher`     | 使用 Rancher 生成的 CA 签发的自签名证书<br/>此项为**默认选项** | [是](#可选：安装-cert-manager) |
| Let’s Encrypt            | `ingress.tls.source=letsEncrypt` | 使用[Let's Encrypt](https://letsencrypt.org/)颁发的证书        | [是](#可选：安装-cert-manager) |
| 您已有的证书             | `ingress.tls.source=secret`      | 使用您的自己的证书（Kubernetes 密文）                          | 否                             |

:::important 重要
Rancher 中国技术支持团队建议您使用“您已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

## 5、安装 cert-manager

:::note 提示
如果您使用自己的证书文件 `ingress.tls.source=secret`或者[使用外部 TLS 负载均衡器](/docs/installation/options/chart-options/_index)可以跳过此步骤。
:::

仅在使用 Rancher 生成的证书 `ingress.tls.source=rancher` 或 Let's Encrypt 颁发的证书 `ingress.tls.source=letsEncrypt`时才需要 cert-manager。

这些说明来自[官方的 cert-manager 文档](https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm)。

```
# 安装 CustomResourceDefinition 资源

kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.crds.yaml

# **重要：**
# 如果您正在运行 Kubernetes v1.15 或更低版本，
# 则需要在上方的 kubectl apply 命令中添加`--validate=false`标志，
# 否则您将在 cert-manager 的 CustomResourceDefinition 资源中收到与
# x-kubernetes-preserve-unknown-fields 字段有关的验证错误。
# 这是一个良性错误，是由于 kubectl 执行资源验证的方式造成的。

# 为 cert-manager 创建命名空间

kubectl create namespace cert-manager

# 添加 Jetstack Helm 仓库

helm repo add jetstack https://charts.jetstack.io

# 更新本地 Helm chart 仓库缓存

helm repo update

# 安装 cert-manager Helm chart

helm install \
 cert-manager jetstack/cert-manager \
 --namespace cert-manager \
 --version v0.15.0

```

安装完 cert-manager 后，您可以通过检查 cert-manager 命名空间中正在运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace cert-manager

NAME READY STATUS RESTARTS AGE
cert-manager-5c6866597-zw7kh 1/1 Running 0 2m
cert-manager-cainjector-577f6d9fd7-tr77l 1/1 Running 0 2m
cert-manager-webhook-787858fcdb-nlzsq 1/1 Running 0 2m
```

## 6、根据您选择的 SSL 选项，通过 Helm 安装 Rancher

### 方式 A：使用 Rancher 生成的自签名证书

Rancher 的默认值是生成 CA 并使用`cert-manager`颁发证书，并将证书用于访问 Rancher Server 的接口。

因为`rancher`是`ingress.tls.source`的默认选项，所以在运行`helm install`命令时我们没有指定`ingress.tls.source`。

- 将`hostname`设置为您指向负载均衡器的 DNS 名称。
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。
- 要安装指定版本的 Rancher，请使用`--version`选项，例如：`--version 2.3.6`。

```
helm install rancher rancher-<CHART_REPO>/rancher \
 --namespace cattle-system \
 --set hostname=rancher.my.org
```

等待 Rancher 运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

Rancher Chart 有许多自定义安装选项以适应特定的环境。以下是一些常见的高级方案。

- [HTTP 代理](/docs/installation/options/chart-options/_index)
- [私有镜像仓库](/docs/installation/options/chart-options/_index)
- [外部负载均衡器上的 TLS 终止](/docs/installation/options/chart-options/_index)

有关选项的完整列表，请参见[Chart 选项](/docs/installation/options/chart-options/_index)。

### 方式 B：使用 Let's Encrypt 证书

该选项使用`cert-manager`来自动请求和续订 [Let's Encrypt](https://letsencrypt.org/)证书。这是一项免费服务，可为您提供有效的证书，因为 Let's Encrypt 是受信任的 CA。

在下面的命令中，

- 将 `hostname` 设置为公共 DNS 记录。
- 将 `ingress.tls.source` 选项设置为 `letsEncrypt`。
- 将 `letsEncrypt.email` 设置为可通讯的电子邮件地址，方便发送通知（例如证书到期的通知）。
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher rancher-<CHART_REPO>/rancher \
 --namespace cattle-system \
 --set hostname=rancher.my.org \
 --set ingress.tls.source=letsEncrypt \
 --set letsEncrypt.email=me@example.org
```

等待 Rancher 运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

Rancher Chart 有许多自定义安装选项以适应特定的环境。以下是一些常见的高级方案。

- [HTTP 代理](/docs/installation/options/chart-options/_index)
- [私有镜像仓库](/docs/installation/options/chart-options/_index)
- [外部负载均衡器上的 TLS 终止](/docs/installation/options/chart-options/_index)

有关选项的完整列表，请参见[Chart 选项](/docs/installation/options/chart-options/_index)。

### 方式 C：使用您已有的证书

在此选项中，将使用您自己的证书来创建 Kubernetes 密文，以供 Rancher 使用。

当您运行此命令时，`hostname`选项必须与服务器证书中的`Common Name`或`Subject Alternative Names`条目匹配，否则 Ingress 控制器将无法正确配置。

尽管技术上仅需要`Subject Alternative Names`中有一个条目，但是拥有一个匹配的 `Common Name` 可以最大程度的提高与旧版浏览器/应用程序的兼容性。

> 如果您想检查证书是否正确，请查看[如何在服务器证书中检查 Common Name 和 Subject Alternative Names](/docs/faq/technical/_index)。

- 设置 `hostname`。
- 将 `ingress.tls.source` 选项设置为 `secret`。
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher rancher-<CHART_REPO>/rancher \
 --namespace cattle-system \
 --set hostname=rancher.my.org \
 --set ingress.tls.source=secret
```

如果您使用的是私有 CA 证书，请在命令中增加 `--set privateCA=true`。

```
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set ingress.tls.source=secret \
  --set privateCA=true
```

现在已经部署了 Rancher，请参阅[添加 TLS 密文](/docs/installation/options/tls-secrets/_index)发布证书文件，以便 Rancher 和 ingress 控制器可以使用它们。

Rancher Chart 有许多自定义安装选项以适应特定的环境。以下是一些常见的高级方案。

- [HTTP 代理](/docs/installation/options/chart-options/_index)
- [私有镜像仓库](/docs/installation/options/chart-options/_index)
- [外部负载均衡器上的 TLS 终止](/docs/installation/options/chart-options/_index)

有关选项的完整列表，请参见[Chart 选项](/docs/installation/options/chart-options/_index)。

## 7、验证 Rancher Server 是否已成功部署

检查 Rancher Server 是否运行成功：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

如果看到以下错误： `error: deployment "rancher" exceeded its progress deadline`, 您可以通过运行以下命令来检查 deployment 的状态：

```
kubectl -n cattle-system get deploy rancher
NAME DESIRED CURRENT UP-TO-DATE AVAILABLE AGE
rancher 3 3 3 3 3m
```

`DESIRED`和`AVAILABLE`应该显示相同的个数。

## 8、保存您的选项

请保存您使用的全部`--set`选项。使用 Helm 升级 Rancher 到新版本时，您将需要使用相同的选项。

## 安装完成

现在您应该具有一个功能正常的 Rancher Server 了。

打开浏览器，访问您的 DNS，这个 DNS 会将流量转发到您的负载均衡器，您应该会看到一个色彩丰富的登录页面。

遇到了问题？查看[故障排查](/docs/installation/options/troubleshooting/_index)页面。
