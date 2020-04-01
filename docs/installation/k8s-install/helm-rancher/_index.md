---
title: 3、安装 Rancher
---

Rancher 使用 Kubernetes 的 Helm 软件包管理器安装。Helm Charts 为 Kubernetes YAML 清单文档提供了模板语法。

有了 Helm，我们可以创建可配置的 Deployment，而不只是使用静态文件。有关创建您自己的 Deployment 的应用商店应用的更多信息，请查看 https://helm.sh/ 中的文档。

对于无法直接访问 Internet 的系统，请参阅[Rancher 离线安装](/docs/installation/other-installation-methods/air-gap/_index)。

选择要安装的 Rancher 版本，请参阅[选择 Rancher 版本](/docs/installation/options/server-tags/_index)。

要选择用于安装 Rancher 的 Helm 版本，请参阅[Helm 版本要求](/docs/installation/options/helm-version/_index)。

:::important 注意
本安装说明假定您使用的是 Helm3。有关从 Helm 2 迁移到 Helm 3 的方法，请参阅官方的[Helm 2 到 3 迁移文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。这个[指南](/docs/installation/options/helm2/_index)提供了使用 Helm 2 在 Kubernetes 上安装 Rancher 的较旧的安装说明，适用于无法升级到 Helm 3 的情况。
:::

## 安装 Helm

Helm 需要安装一个简单的 CLI 工具。请参 Helm 项目提供的[安装说明文档](https://helm.sh/docs/intro/install/)。

## 添加 Helm Chart 仓库

使用`helm repo add`命令添加含有 Rancher Chart 的 Helm Chart 仓库。

请将命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息，请查看[选择 Rancher 版本](/docs/installation/options/server-tags/_index)来选择最适合您的仓库。

- `latest`: 推荐在尝试新功能时使用。
- `stable`: 推荐生产环境中使用。（推荐）
- `alpha`: 未来版本的实验性预览。

<br/>

```
helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
```

## 为 Rancher 创建 Namespace

我们需要定义一个 Namespace，在 Namespace 中安装由 Chart 创建的资源。这应该是`cattle-system`:

```
kubectl create namespace cattle-system
```

## 选择 SSL 配置

Rancher Server 默认需要 SSL/TLS 配置来保证访问的安全性。

以下有三种关于证书来源的推荐选项。

> **提示：** 如果您想要将 SSL/TLS 访问在外部终止，请查看[使用外部 TLS 负载均衡器](/docs/installation/options/chart-options/_index)。

| 设置               | Chart 选项                       | 描述                                                           | 是否需要 cert-manager          |
| ------------------ | -------------------------------- | -------------------------------------------------------------- | ------------------------------ |
| Rancher 自签名证书 | `ingress.tls.source=rancher`     | 使用 Rancher 生成的 CA 签发的自签名证书<br/>此项为**默认选项** | [是](#可选：安装-cert-manager) |
| Let’s Encrypt      | `ingress.tls.source=letsEncrypt` | 使用[Let's Encrypt](https://letsencrypt.org/)颁发的证书        | [是](#可选：安装-cert-manager) |
| 您已有的证书       | `ingress.tls.source=secret`      | 使用您的自己的证书（Kubernetes 密文）                          | 否                             |

:::important 重要
Rancher 中国技术支持团队建议您使用“您已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

## 可选：安装 cert-manager

Rancher 依靠[cert-manager](https://github.com/jetstack/cert-manager)从 Rancher 自己生成的 CA 颁发证书或请求 Let's Encrypt 证书。

:::note 提示
仅在使用 Rancher 生成的证书 `ingress.tls.source=rancher` 或 Let's Encrypt 颁发的证书 `ingress.tls.source=letsEncrypt`时才需要 cert-manager。如果您使用自己的证书文件 `ingress.tls.source=secret`或者[使用外部 TLS 负载均衡器](/docs/installation/options/chart-options/_index)可以跳过此步骤。
:::

> **重要：**
> 由于 Helm v2.12.0 和 cert-manager 的兼容性问题，请使用 Helm v2.12.1 或更高版本。

这些说明来自[官方的 cert-manager 文档](https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm)。

```
# 安装 CustomResourceDefinition 资源

kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml

# **重要：**
# 如果您正在运行 Kubernetes v1.15 或更低版本，
# 则需要在上方的 kubectl apply 命令中添加`--validate=false`标志，
# 否则您将在 cert-manager 的 CustomResourceDefinition 资源中收到与
# x-kubernetes-preserve-unknown-fields 字段有关的验证错误。
# 这是一个良性错误，是由于 kubectl 执行资源验证的方式造成的。

# 为 cert-manager 创建名称空间

kubectl create namespace cert-manager

# 添加 Jetstack Helm 仓库

helm repo add jetstack https://charts.jetstack.io

# 更新本地 Helm chart 仓库缓存

helm repo update

# 安装 cert-manager Helm chart

helm install \
 cert-manager jetstack/cert-manager \
 --namespace cert-manager \
 --version v0.12.0

```

安装完 cert-manager 后，您可以通过检查 cert-manager 命名空间中正在运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace cert-manager

NAME READY STATUS RESTARTS AGE
cert-manager-5c6866597-zw7kh 1/1 Running 0 2m
cert-manager-cainjector-577f6d9fd7-tr77l 1/1 Running 0 2m
cert-manager-webhook-787858fcdb-nlzsq 1/1 Running 0 2m
```

## 根据你选择的 SSL 配置，通过 Helm 安装 Rancher

请选择一种方式

### 方式 A：使用 Rancher 生成的自签名证书

> **注意：** 在继续操作之前，您需要安装[cert-manager](#可选：安装-cert-manager)。

默认情况下 Rancher 生成一个私有 CA 并使用 `cert-manager` 来颁发证书用以访问 Rancher Server。因为 `rancher` 是 `ingress.tls.source` 选项的默认值，我们在运行 `helm install` 命令的时候并没有指定 `ingress.tls.source` 选项。

- 将`hostname`设置为您指向负载均衡器的 DNS 名称。
- 如果你在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

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

### 方式 B：使用 Let's Encrypt 证书

> **注意：** 在继续操作之前，您需要安装[cert-manager](#可选：安装-cert-manager)。

该选项使用 `cert-manager` 自动请求和更新[Let's Encrypt](https://letsencrypt.org/)证书。这是一个免费的服务，它为您提供一个受信的证书，因为 Let's Encrypt 提供的是受信的 CA。此配置使用 HTTP 验证(`HTTP-01`)，因此负载均衡器必须具有公共的 DNS 记录并可以从互联网访问到。

- 将 `hostname` 设置为公共 DNS 记录，将 `ingress.tls.source` 选项设置为 `letsEncrypt`，并且设置 `letsEncrypt.email` 为可通讯的电子邮件地址，方便发送通知（例如证书到期通知）
- 如果你在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

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

### 方式 C：使用您已有的证书

> **提示：** 服务器证书中的 `Common Name` 或 `Subject Alternative Names` 必须与 `hostname` 选项匹配，否则 ingress controller 将无法正确配置。尽管技术上仅需要`Subject Alternative Names`中有一个条目，但是拥有一个匹配的 `Common Name` 可以最大程度的提高与旧版浏览器/应用程序的兼容性。如果您想检查证书是否正确，请查看[如何在服务器证书中检查 Common Name 和 Subject Alternative Names](/docs/faq/technical/_index)。

- 设置 `hostname` 并且将 `ingress.tls.source` 选项设置为 `secret`。
- 如果您使用的是私有 CA 证书，请在下面的命令中增加 `--set privateCA=true`。
- 如果你在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher rancher-<CHART_REPO>/rancher \
 --namespace cattle-system \
 --set hostname=rancher.my.org \
 --set ingress.tls.source=secret
```

现在已经部署了 Rancher，请参阅[添加 TLS 密文](/docs/installation/options/tls-secrets/_index)发布证书文件，以便 Rancher 和 ingress 控制器可以使用它们。

添加完密文后，检查 Rancher 是否运行成功：

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

## 高级配置

Rancher Chart 有许多自定义安装选项以适应特定的环境。以下是一些常见的高级方案。

- [HTTP 代理](/docs/installation/options/chart-options/_index)
- [私有镜像仓库](/docs/installation/options/chart-options/_index)
- [外部负载均衡器上的 TLS 终止](/docs/installation/options/chart-options/_index)

有关选项的完整列表，请参见[Chart 选项](/docs/installation/options/chart-options/_index)。

## 保存你的选项

请保存您使用的全部`--set`选项。使用 Helm 升级 Rancher 到新版本时，您将需要使用相同的选项。

## 结束

好了，现在您应该具有一个功能正常的 Rancher Server。打开浏览器，访问你的 DNS，您应该会看到一个色彩丰富的登录页面。

遇到了问题？查看[故障排查](/docs/installation/options/troubleshooting/_index)页面。
