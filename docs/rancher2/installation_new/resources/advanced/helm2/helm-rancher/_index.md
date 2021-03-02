---
title: 安装 Rancher
description: 可以使用 Kubernetes 的 helm 包管理工具来管理 Rancher 的安装。使用 `helm` 来一键安装 Rancher 及其依赖组件。
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
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 安装 Rancher
---

可以使用 Kubernetes 的 helm 包管理工具来管理 Rancher 的安装。使用 `helm` 来一键安装 Rancher 及其依赖组件。

对于无法访问互联网的环境，请查看[Rancher 高可用 Helm2 离线安装](/docs/rancher2/installation_new/resources/advanced/air-gap-helm2/install-rancher/_index)。

请参阅[Helm 版本要求](/docs/rancher2/installation_new/resources/helm-version/_index) 来选择安装 Rancher 的 Helm 版本。

> **提示：** 当前安装指南假定您使用的是 Helm 2。如果您在使用 Helm 3，请参照[此说明](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/_index)。

## 添加 Helm Chart 仓库

使用 `helm repo add` 命令添加包含 Rancher Chart 的 Helm 仓库来安装 Rancher。

请替换命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息，请查看[选择 Rancher 版本](/docs/rancher2/installation_new/resources/choosing-version/_index)来选择最适合您的仓库。

- `latest`: 推荐在尝试新功能时使用。
- `stable`: 推荐生产环境中使用。（推荐）
- `alpha`: 未来版本的实验性预览。

<br/>

```
helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
```

## 选择 SSL 配置

Rancher Server 默认需要 SSL/TLS 配置来保证访问的安全性。

以下有三种关于证书来源的推荐选项。

> **提示：** 如果您想要将 SSL/TLS 访问在外部终止，请查看[使用外部 TLS 负载均衡器](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index#外部-tls-termination)。

| 设置                                      | Chart 选项                       | 描述                                                           | 是否需要 cert-manager          |
| ----------------------------------------- | -------------------------------- | -------------------------------------------------------------- | ------------------------------ |
| [Rancher 自签名证书](#rancher-自签名证书) | `ingress.tls.source=rancher`     | 使用 Rancher 生成的 CA 签发的自签名证书<br/>此项为**默认选项** | [是](#选装：安装-cert-manager) |
| [Let’s Encrypt](#lets-encrypt)            | `ingress.tls.source=letsEncrypt` | 使用[Let's Encrypt](https://letsencrypt.org/)颁发的证书        | [是](#选装：安装-cert-manager) |
| [您已有的证书](#您已有的证书)             | `ingress.tls.source=secret`      | 使用您的已有证书（Kubernetes 密文）                            | 否                             |

:::important 重要
Rancher 中国技术支持团队建议您使用“您已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

## 选装：安装 cert-manager

:::note 提示
仅由 Rancher 生成的 CA `ingress.tls.source=rancher` 和 Let's Encrypt 颁发的证书 `ingress.tls.source=letsEncrypt` 才需要 cert-manager。如果您使用自己的证书文件 `ingress.tls.source=secret` 或者[使用外部 TLS 负载均衡器](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index#外部-tls-termination)可以跳过此步骤。
:::

> **重要：**
>
> 由于 Helm v2.12.0 和 cert-manager 的问题，请使用 Helm v2.12.1 或更高版本。
>
> cert-manager 最近的更改需要升级版本。如果您正在升级 Rancher 并且使用低于 v0.12.0 版本的 cert-manager，请参考[升级文档](/docs/rancher2/installation_new/resources/upgrading-cert-manager/_index)。

Rancher 依靠[cert-manager](https://github.com/jetstack/cert-manager)使用 Rancher CA 生成证书或者请求 Let's Encrypt 签发的证书。

以下操作步骤由[cert-manager 官方文档](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html#installing-with-helm)提供。

1. 单独安装 CustomResourceDefinition 资源。

   ```plain
   kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.12/deploy/manifests/00-crds.yaml
   ```

1. 为 cert-manager 创建命名空间。

   ```plain
   kubectl create namespace cert-manager
   ```

1. 标记 cert-manager 命名空间，禁用资源验证。

   ```plain
   kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
   ```

1. 添加 Jetstack Helm repository。

   ```plain
   helm repo add jetstack https://charts.jetstack.io
   ```

1. 更新本地的 Helm chart repository 缓存。

   ```plain
   helm repo update
   ```

1. 使用 Helm chart 安装 cert-manager。
   ```plain
   helm install \
     --name cert-manager \
     --namespace cert-manager \
     --version v0.12.0 \
     jetstack/cert-manager
   ```

安装 cert-manager 以后，您可以通过检查 cert-manager 命名空间下的 pod 运行状态来验证部署是否正确：

```
kubectl get pods --namespace cert-manager

NAME                                            READY   STATUS      RESTARTS   AGE
cert-manager-7cbdc48784-rpgnt                   1/1     Running     0          3m
cert-manager-webhook-5b5dd6999-kst4x            1/1     Running     0          3m
cert-manager-cainjector-3ba5cd2bcd-de332x       1/1     Running     0          3m
```

如果"webhook" pod (第二行那个) 处于 ContainerCreating 状态，它可能正在等待 Secret 被 mount 到 pod 中。如果等待几分钟还是处于这种状态或者有其他的问题，请查看[cert-manager 常见问题](https://cert-manager.io/docs/faq/)。

## 证书选项

### Rancher 自签名证书

> **提示：** 在执行以下操作之前，您需要安装 [cert-manager](#选装：安装-cert-manager)

默认情况下 Rancher 生成一个私有 CA 并使用 `cert-manager` 来颁发证书用以访问 Rancher 界面。因为 `rancher` 是 `ingress.tls.source` 选项的默认值，我们在运行 `helm install` 命令的时候并没有指定 `ingress.tls.source` 选项。

- 将 `hostname` 设置为指向您负载均衡器的 DNS 名称
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher-<CHART_REPO>/rancher \
  --name rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org
```

等待 Rancher 运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

### Let's Encrypt

> **提示：** 在执行以下操作之前，您需要安装[cert-manager](#选装：安装-cert-manager)

该选项使用 `cert-manager` 自动请求和更新[Let's Encrypt](https://letsencrypt.org/)证书。这是一个免费的服务，它为您提供一个受信的证书，因为 Let's Encrypt 提供的是受信的 CA。此配置使用 HTTP(`HTTP-01`)验证，因此负载均衡器必须具有公共的 DNS 记录并可以从互联网访问到。

- 将 `hostname` 设置为公共 DNS 记录, 将 `ingress.tls.source` 选项设置为 `letsEncrypt`，并且设置 `letsEncrypt.email` 为可通讯的电子邮件地址，方便发送通知（例如证书到期通知）
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher-<CHART_REPO>/rancher \
  --name rancher \
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

### 您已有的证书

根据您已有的证书创建 Kubernetes 密文以供 Rancher 使用。

> **提示：** 服务器证书中的 `Common Name` 或 `Subject Alternative Names` 必须与 `hostname` 选项一致, 否则 ingress controller 将无法正确配置。尽管技术上仅需要`Subject Alternative Names`中有一个条目，但是拥有一个匹配的 `Common Name` 可以最大程度的提高与旧版浏览器/应用程序的兼容性。如果您想检查证书是否正确，请查看[如何在服务器证书中检查 Common Name 和 Subject Alternative Names](/docs/rancher2/faq/technical/_index)。

- 设置 `hostname` 并且将 `ingress.tls.source` 选项设置为 `secret`。
- 如果您在安装 `alpha` 版本，需要把`--devel` 选项添加到下面到 Helm 命令中。

```
helm install rancher-<CHART_REPO>/rancher \
  --name rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set ingress.tls.source=secret
```

如果您使用的是私有 CA 证书，请在命令中增加 `--set privateCA=true`：

```
helm install rancher-<CHART_REPO>/rancher \
  --name rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set ingress.tls.source=secret
  --set privateCA=true
```

现在已经部署完 Rancher，请参见[添加 Kubernetes TLS 密文](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/tls-secrets/_index)来发布证书文件，以便 Rancher 与 ingress controller 可以使用证书。

添加完密文后，检查 Rancher 是否运行成功：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

如果您看到了错误：`error: deployment "rancher" exceeded its progress deadline`，您可以使用下面的命令来检查 deployment 的状态：

```
kubectl -n cattle-system get deploy rancher
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
rancher   3         3         3            3           3m
```

显示的 `DESIRED` 和 `AVAILABLE` 数量应该一致。

## 高级配置

Rancher chart 配置有许多选项可用于自定义安装 Rancher 来适配您的环境。以下是一些常见的高级场景。

- [HTTP Proxy](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index#http-代理)
- [私有镜像仓库](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index#私有镜像仓库registry和离线安装)
- [使用外部负载均衡器终止 TLS](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index)

关于完整的 Chart 选项，请参见[Chart 安装选项](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/chart-options/_index)。

## 保存配置选项

请确保已经保存了您使用 `--set` 设置的配置选项，在您使用 Helm 升级 Rancher 到新版本时需要用到相同的配置选项。

## 总结

通过上面的操作，您应该已经完成了 Rancher server 的安装。在浏览器中输入您配置的域名，便可以访问 Rancher 的登录页面了。

如果无法访问 Rancher 登录页面，请查看[问题排查](/docs/rancher2/installation_new/resources/advanced/helm2/helm-rancher/troubleshooting/_index)页面，排查安装 Rancher Server 的过程中引起的问题。
