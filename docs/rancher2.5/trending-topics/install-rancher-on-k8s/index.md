---
title: 如何安装高可用 Rancher？
description: Rancher 使用 Kubernetes 的 Helm 软件包管理器安装。Helm Charts 为 Kubernetes YAML 清单文档提供了模板语法。有了 Helm，我们可以创建可配置的 Deployment，而不只是使用静态文件。有关创建您自己的 Deployment 的应用商店应用的更多信息，请查看 https://helm.sh/ 中的文档。对于无法直接访问 Internet 的系统，请参阅Rancher 离线安装。选择要安装的 Rancher 版本，请参阅选择 Rancher 版本。要选择用于安装 Rancher 的 Helm 版本，请参阅Helm 版本要求。
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
  - 热点问题
  - 安装 Rancher
---

在本节中，你将学习如何使用 Helm CLI 在 Kubernetes 集群上部署 Rancher。

## 先决条件

- [Kubernetes 集群](#kubernetes-集群)
- [CLI 工具](#cli)
- [Ingress Controller（仅适用于托管 Kubernetes）](#ingress-controller)

### Kubernetes 集群

设置 Rancher Server 的 Local Kubernetes 集群。

Rancher 可以安装在任何 Kubernetes 集群上。这个集群可以使用上游 Kubernetes，也可以使用 Rancher 的 Kubernetes 发行版之一，也可以是来自 Amazon EKS 等提供商的托管 Kubernetes 集群。

:::important 重要

Rancher 需要安装在受支持的 Kubernetes 版本上。要了解你的 Rancher 版本支持哪些版本的 Local Kubernetes，请参考[支持矩阵](https://www.suse.com/suse-rancher/support-matrix/all-supported-versions/) 或 [Rancher Release](https://github.com/rancher/rancher/releases)。

  例如：Rancher v2.5.12 支持的 Kubernetes 版本包括 1.20、1.19、1.18 和 1.17。所以你的 Local Kubernetes 集群可以选择 1.20、1.19、1.18 或 1.17 版本。
:::

对于设置 Kubernetes 集群的帮助，我们提供这些教程：

- RKE：有关安装 RKE Kubernetes 集群的教程，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/ha-rke/)，有关为高可用 RKE 集群设置基础设施的帮助，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha/)。
- K3s：安装 K3s Kubernetes 集群的教程，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/ha-with-external-db/)。如需帮助设置高可用 K3s 集群的基础架构，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha-with-external-db/)
- RKE2：在 RKE2 安装 Kubernetes 集群的教程，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/ha-rke2/)。如需帮助设置高可用 RKE2 集群的基础架构，请参考[本页](/docs/rancher2.5/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-rke2-ha/)。
- Amazon EKS： 在 EKS 上安装 Kubernetes 集群的教程，请参考[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/amazon-eks/)。
- AKS：关于如何用 Azure Kubernetes 服务安装 Rancher 的细节，包括如何安装一个入口以便可以访问 Rancher server，请参考[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/aks/)。
- GKE：关于如何用谷歌 Kubernetes 引擎安装 Rancher 的细节，包括如何安装一个入口以便可以访问 Rancher server，请参考[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/gke/)。

### CLI

设置 Kubernetes 集群需要以下 CLI 工具。请确保这些工具已安装并在你的 `$PATH`。

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具。
- [helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 的软件包管理工具。请参阅 [Helm 版本要求](/docs/rancher2.5/installation/resources/helm-version/)以选择要安装 Rancher 的 Helm 版本。

:::note 提示
国内用户，可以导航到 https://mirror.rancher.cn 下载所需资源。
:::

### Ingress Controller

_适用于托管在云厂商上的集群_

要在托管的 Kubernetes 集群（如 EKS、GKE 或 AKS）上部署 Rancher v2.5+，应先部署一个兼容的 Ingress 控制器，在 Rancher 上[配置 SSL 终止](/docs/rancher2.5/installation/install-rancher-on-k8s/#3-选择您的-ssl-选项)。

有关如何在 EKS 上部署 Ingress 的示例，请参阅[此部分](/docs/rancher2.5/installation/install-rancher-on-k8s/amazon-eks/#5-安装-ingress)。

## Helm Chart 安装 Rancher

Rancher 使用 Kubernetes 的 Helm 软件包管理器安装。Helm Charts 为 Kubernetes YAML 清单文档提供了模板语法。

有了 Helm，我们可以创建可配置的部署，而不只是使用静态文件。有关创建你自己的部署的更多信息，请查看 https://helm.sh/ 中的文档。

对于无法直接访问 Internet 的系统，请参阅 [Rancher 离线安装](/docs/rancher2.5/installation/other-installation-methods/air-gap/install-rancher/)。

选择要安装的 Rancher 版本，请参阅[选择 Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/)。

要选择用于安装 Rancher 的 Helm 版本，请参阅 [Helm 版本要求](/docs/rancher2.5/installation/resources/helm-version/)。

:::important 注意
本安装指南假定你使用的是 Helm3。有关从 Helm 2 迁移到 Helm 3 的方法，请参阅官方的[Helm 2 到 3 迁移文档](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)。这个[指南](/docs/rancher2.5/installation/resources/helm-version/)提供了使用 Helm 2 在 RKE Kubernetes 集群上安装 Rancher 的较旧的安装指南，适用于无法升级到 Helm 3 的情况。
:::

### 1. 添加 Helm Chart 仓库

使用`helm repo add`命令添加含有 Rancher Chart 的 Helm Chart 仓库。

请将命令中的`<CHART_REPO>`，替换为`latest`，`stable`或`alpha`。更多信息，请查看[选择 Rancher 版本](/docs/rancher2.5/installation/resources/choosing-version/)来选择最适合你的仓库。

- `latest`: 建议在尝试新功能时使用。
- `stable`: 建议在生产环境中使用。（推荐）
- `alpha`: 未来版本的实验性预览。

注意：不支持从 Alpha 到 Alpha 之间的升级。

```shell
helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
```

:::note 提示
国内用户，可以使用放在国内的 Rancher Chart 加速安装：

```shell
helm repo add rancher-<CHART_REPO> https://rancher-mirror.rancher.cn/server-charts/<CHART_REPO>
```

:::

### 2. 为 Rancher 创建 Namespace

我们需要定义一个 Kubernetes Namespace，在 Namespace 中安装由 Chart 创建的资源。这个命名空间的名称为 `cattle-system`：

```shell
kubectl create namespace cattle-system
```

### 3. 选择你的 SSL 选项

Rancher Server 默认需要 SSL/TLS 配置来保证访问的安全性。

:::note 提示
如果你想在外部终止 SSL/TLS，请参考：[使用外部 TLS 负载均衡器](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#外部-tls-termination)。

:::

你可以从以下三种证书来源中选择一种，证书将用来在 Rancher Server 中终止 TLS：

- **Rancher 生成的 TLS 证书：** 在这种情况下，你需要在集群中安装 `cert-manager`。 Rancher 利用 `cert-manager` 签发并维护证书。Rancher 将生成自己的 CA 证书，并使用该 CA 签署证书。然后 `cert-manager` 负责管理该证书。
- **Let's Encrypt：** Let's Encrypt 选项也需要使用 `cert-manager`。但是，在这种情况下，cert-manager 与 Let's Encrypt 的特殊颁发者相结合，该颁发者执行获取 Let's Encrypt 颁发的证书所需的所有操作（包括请求和验证）。此配置使用 HTTP 验证（`HTTP-01`），因此负载均衡器必须具有可以从公网访问的公共 DNS 记录。
- **使用你已有的证书：** 此选项使你可以使用自己的权威 CA 颁发的证书或自签名 CA 证书。 Rancher 将使用该证书来保护 WebSocket 和 HTTPS 流量。在这种情况下，你必须上传名称分别为`tls.crt`和`tls.key`的 PEM 格式的证书以及相关的密钥。如果使用私有 CA，则还必须上传该 CA 证书。这是由于你的节点可能不信任此私有 CA。 Rancher 将获取该 CA 证书，并从中生成一个校验和，各种 Rancher 组件将使用该校验和来验证其与 Rancher 的连接。

| 设置                       | Chart 选项                       | 描述                                                      | 是否需要 cert-manager          |
| :------------------------- | :------------------------------- | :-------------------------------------------------------- | :----------------------------- |
| Rancher 生成的证书（默认） | `ingress.tls.source=rancher`     | 使用 Rancher 生成的 CA 签发的自签名证书此项为**默认选项** | [是](#可选：安装-cert-manager) |
| Let’s Encrypt              | `ingress.tls.source=letsEncrypt` | 使用[Let's Encrypt](https://letsencrypt.org/)颁发的证书   | [是](#可选：安装-cert-manager) |
| 你已有的证书               | `ingress.tls.source=secret`      | 使用你的自己的证书（Kubernetes 密文）                     | 否                             |

:::important 重要
Rancher 中国技术支持团队建议你使用“你已有的证书” `ingress.tls.source=secret` 这种方式，从而减少对 cert-manager 的运维成本。
:::

### 4. 安装 cert-manager

:::note 提示
如果你使用自己的证书文件 `ingress.tls.source=secret`或者[使用外部 TLS 负载均衡器](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#外部-tls-termination)可以跳过此步骤。
:::

仅在使用 Rancher 生成的证书 `ingress.tls.source=rancher` 或 Let's Encrypt 颁发的证书 `ingress.tls.source=letsEncrypt`时才需要 cert-manager。

这些说明来自[官方的 cert-manager 文档](https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm)。

```shell

# 如果你手动安装了CRD，而不是在Helm安装命令中添加了`--set installCRDs=true`选项，你应该在升级Helm chart之前升级CRD资源。
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml

# 添加 Jetstack Helm 仓库

helm repo add jetstack https://charts.jetstack.io

# 更新本地 Helm chart 仓库缓存

helm repo update

# 安装 cert-manager Helm chart

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.5.1

```

安装完 cert-manager 后，你可以通过检查 cert-manager 命名空间中正在运行的 Pod 来验证它是否已正确部署：

```shell
kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

### 5. 根据你选择的 SSL 选项，通过 Helm 安装 Rancher

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="rancher"
values={[
{ label: 'Rancher 生成的证书', value: 'rancher', },
{ label: 'Let\'s Encrypt 证书', value: 'letsencrypt', },
{ label: '已有的证书', value: 'fromfile', },
]}>

<TabItem value="rancher">

默认为 Rancher 生成自签名 CA，用于 `cert-manager` 颁发访问 Rancher Server 接口的证书。

因为 `rancher` 是 `ingress.tls.source` 的默认选项，所以在运行 `helm install` 命令时我们没有指定 `ingress.tls.source`。

- 将 `hostname` 设置为解析到你的负载均衡器的 DNS 记录。Rancher HA 安装成功后，你需要通过这个域名来访问 Rancher Server。
- 将 `replicas` 设置为 Rancher 部署所使用的副本数量。默认为 3；如果集群中的节点少于 3 个，你应该相应地减少副本数量。
- 要安装一个特定的 Rancher 版本，使用 `--version` 标志，例如：`--version 2.3.6`。
- 如果你安装的是 alpha 版本，Helm 要求在命令中加入 `--devel` 选项。

```shell
helm install rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set replicas=3
```

等待 Rancher 运行：

```shell
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

</TabItem>

<TabItem value="letsencrypt">

该选项使用 `cert-manager` 来自动请求和续订 [Let's Encrypt](https://letsencrypt.org/)证书。这是一项免费服务，可为你提供有效的证书，因为 Let's Encrypt 是受信任的 CA。

> **注意：**你需要打开 80 端口，因为 HTTP-01 challenge 只能在 80 端口运行。

在下面的命令中，

- 将 `hostname` 设置为公共 DNS 记录，该记录可解析到你的负载均衡器。Rancher HA 安装成功后，你需要通过这个域名来访问 Rancher Server。
- 将 `replicas` 设置为 Rancher 部署所使用的副本数量。默认为 3；如果集群中的节点少于 3 个，则应相应地减少副本数。
- 将 `ingress.tls.source` 选项设置为 `letsEncrypt`。
- 将 `letsEncrypt.email` 设置为可通讯的电子邮件地址，方便发送通知（例如证书到期的通知）。
- 要安装一个特定的 Rancher 版本，请使用 `--version` 标志，例如：`--version 2.3.6`。
- 如果你安装的是 alpha 版本，Helm 要求在命令中加入 `--devel` 选项。

```shell
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set replicas=3 \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=me@example.org
```

等待 Rancher 运行：

```shell
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

</TabItem>

<TabItem value="fromfile">

> 注意：
> 可以使用 [一键生成 ssl 自签名证书脚本](/docs/rancher2.5/installation/resources/advanced/self-signed-ssl//#41-一键生成-ssl-自签名证书脚本) 来快速生成符合 rancher 要求的自签名证书。

在此选项中，将使用你自己的证书来创建 Kubernetes secret，以供 Rancher 使用。

运行这个命令时，`hostname` 选项必须与服务器证书中的 `Common Name` 或 `Subject Alternative Names` 条目匹配，否则 Ingress controller 将无法正确配置。

尽管技术上仅需要`Subject Alternative Names`中有一个条目，但是拥有一个匹配的 `Common Name` 可以最大程度的提高与旧版浏览器/应用程序的兼容性。

如果你想检查证书是否正确，请查看[如何在服务器证书中检查 Common Name 和 Subject Alternative Names](/docs/rancher2.5/faq/technical/#如何查看服务器证书的common-name-和-subject-alternative-names-？)。

- 如上所述，为你的证书设置适当的`hostname`。
- 将`replicas`设置为 Rancher 部署所使用的复制数量。默认为 3；如果你的集群中少于 3 个节点，你应填写实际节点数量。
- 设置`ingress.tls.source`为`secret`。
- 要安装一个特定的 Rancher 版本，使用`--version` 标志，例如：`--version 2.3.6`。
- 如果你安装的是 alpha 版本，Helm 要求在命令中加入`--devel`选项。

```shell
helm install rancher rancher-<CHART_REPO>/rancher \
 --namespace cattle-system \
 --set hostname=rancher.my.org \
 --set replicas=3 \
 --set ingress.tls.source=secret
```

如果你使用的是私有 CA 证书，请在命令中增加 `--set privateCA=true`。

```shell
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set ingress.tls.source=secret \
  --set privateCA=true
```

**添加 TLS Secret(千万不要遗漏该步)：**现在已经部署了 Rancher，还需参考[添加 TLS Secret](/docs/rancher2.5/installation/resources/tls-secrets/) 发布证书文件，以便 Rancher 和 ingress 控制器可以使用它们。

</TabItem>

</Tabs>

Rancher Chart 有许多自定义选项来自定义你的安装环境。以下是一些常见的高级方案：

- [HTTP 代理](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#http-代理)
- [私有镜像仓库](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#私有镜像仓库registry和离线安装)
- [外部负载均衡器上的 TLS 终止](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/#外部-tls-termination)

有关选项的完整列表，请参见[Chart 选项](/docs/rancher2.5/installation/install-rancher-on-k8s/chart-options/)。

### 6. 验证 Rancher Server 是否已成功部署

添加 secret 后，检查 Rancher Server 是否运行成功：

```shell
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

如果看到以下错误： `error: deployment "rancher" exceeded its progress deadline`, 你可以通过运行以下命令来检查 deployment 的状态：

```shell
kubectl -n cattle-system get deploy rancher
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
rancher   3         3         3            3           3m
```

`DESIRED`和`AVAILABLE`应该显示相同的个数。

### 7. 保存你的选项

请保存你使用的全部 `--set` 选项。使用 Helm 升级 Rancher 到新版本时，你将需要使用相同的选项。

### 安装完成

现在你应该具有一个功能正常的 Rancher Server 了。

打开浏览器，通过 Helm 指定的 `hostname` 设置的域名来访问你的 Rancher Server。如果你的环境没有设置公共 DNS 解析，你可以在 hosts 文件中手动映射域名和 IP 的解析记录。接下来，你应该会看到一个色彩丰富的登录页面。

> 如果你的环境中有负载均衡器将流量转发到 Rancher Server，则可以将域名解析为负载均衡器的 IP 地址。如果你的环境中没有负载均衡器，这可以将域名解析为某个 Rancher Server Pod 宿主机的 IP 地址。

如果在安装过程中碰到了问题，请查看[故障排查](/docs/rancher2.5/installation/resources/troubleshooting/)页面。
