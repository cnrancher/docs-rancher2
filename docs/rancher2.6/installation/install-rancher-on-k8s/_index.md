---
title: 在 Kubernetes 集群上安装/升级 Rancher
description: 了解如何在开发和生产环境中安装 Rancher。了解单节点和高可用安装
weight: 2
---

在本节中，你将学习如何使用 Helm CLI 在 Kubernetes 集群上部署 Rancher。

- [前提](#prerequisites)
- [安装 Rancher Helm Chart](#install-the-rancher-helm-chart)

# 前提

- [Kubernetes 集群](#kubernetes-cluster)
- [CLI 工具](#cli-tools)
- [Ingress Controller（仅适用于托管的 Kubernetes）](#ingress-controller-for-hosted-kubernetes)

### Kubernetes 集群

设置 Rancher Server 的本地 Kubernetes 集群。

Rancher 可以安装在任何 Kubernetes 集群上。这个集群可以使用上游 Kubernetes，也可以使用 Rancher 的 Kubernetes 发行版之一，也可以是来自 Amazon EKS 等提供商的托管 Kubernetes 集群。

你可参考以下教程，以获得设置 Kubernetes 集群的帮助：

- **RKE**：[安装 RKE Kubernetes 集群的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/ha-rke/)；[为高可用 RKE 集群设置基础设施的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha)。
- **K3s**：[安装 K3s Kubernetes 集群的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/ha-with-external-db)；[设置高可用 K3s 集群的基础设施的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-ha-with-external-db)。
- **RKE2:** ：[安装 RKE2 Kubernetes 集群的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/ha-rke2)；[设置高可用 RKE2 集群的基础设施的教程]({{<baseurl>}}/rancher/v2.6/en/installation/resources/k8s-tutorials/infrastructure-tutorials/infra-for-rke2-ha)。
- **Amazon EKS**：[在 Amazon EKS 上安装 Rancher 以及如何安装 Ingress 以访问 Rancher Server]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/amazon-eks)。
- **AKS**：[使用 Azure Kubernetes 服务安装 Rancher 以及如何安装 Ingress 以访问 Rancher Server]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/aks)。
- **GKE**：[使用 GKE 安装 Rancher 以及如何安装 Ingress 以访问 Rancher Server]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/gke)。

### CLI 工具

设置 Kubernetes 集群需要以下 CLI 工具。请确保这些工具已安装并在你的 `$PATH` 中可用。

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl) - Kubernetes 命令行工具。
- [Helm](https://docs.helm.sh/using_helm/#installing-helm) - Kubernetes 的包管理器。请参见 [Helm 版本要求]({{<baseurl>}}/rancher/v2.6/en/installation/resources/helm-version) 选择 Helm 版本来安装 Rancher。请为你的具体平台参见 [Helm 项目提供的说明](https://helm.sh/docs/intro/install/)。

### Ingress Controller（用于托管的 Kubernetes）

要在托管的 Kubernetes 集群（如 EKS、GKE 或 AKS）上部署 Rancher，你首先需要部署兼容的 Ingress Controller 以在 Rancher 上配置 [SSL 终止](#3-choose-your-ssl-configuration)。

如果你需要获取在 EKS 上部署 Ingress 示例，请参见[此处]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/amazon-eks/#5-install-an-ingress)。

# 安装 Rancher Helm Chart

Rancher 是使用 Kubernetes 的 [Helm](https://helm.sh/) 包管理器安装的。Helm Chart 为 Kubernetes YAML 清单文件提供了模板语法。通过 Helm，用户可以创建可配置的 deployment，而不仅仅只能使用静态文件。

如果系统无法直接访问互联网，请参见[离线环境：Kubernetes 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/install-rancher/)。

如果要指定安装的 Rancher 版本，请参见[选择 Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/resources/choosing-version)。

如果要指定用于安装 Rancher 的 Helm 版本，请参见[Helm 版本要求]({{<baseurl>}}/rancher/v2.6/en/installation/resources/helm-version)。

> **注意**：本安装指南假定你使用的是 Helm 3。

要设置 Rancher：

1. [添加 Helm Chart 仓库](#1-add-the-helm-chart-repository)
2. [为 Rancher 创建命名空间](#2-create-a-namespace-for-rancher)
3. [选择 SSL 配置](#3-choose-your-ssl-configuration)
4. [安装 cert-manager](#4-install-cert-manager)（除非你自带证书，否则 TLS 将在负载均衡器上终止）
5. [使用 Helm 和你选择的证书选项安装 Rancher](#5-install-rancher-with-helm-and-your-chosen-certificate-option)
6. [验证 Rancher Server 是否部署成功](#6-verify-that-the-rancher-server-is-successfully-deployed)
7. [保存你的选择](#7-save-your-options)

### 1. 添加 Helm Chart 仓库

执行 `helm repo add` 命令，以添加包含安装 Rancher 的 Chart 的 Helm Chart 仓库。有关如何选择仓库，以及哪个仓库最适合你的用例，请参见[选择 Rancher 版本]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#helm-chart-repositories)。

{{< release-channel >}}

```
helm repo add rancher-<CHART_REPO> https://releases.rancher.com/server-charts/<CHART_REPO>
```

### 2. 为 Rancher 创建命名空间

你需要定义一个 Kubernetes 命名空间，用于安装由 Chart 创建的资源。这个命名空间的名称为 `cattle-system`：

```
kubectl create namespace cattle-system
```

### 3. 选择 SSL 配置

Rancher Management Server 默认需要 SSL/TLS 配置来保证访问的安全性。

> **注意**：如果你想在外部终止 SSL/TLS，请参见[外部负载均衡器的 TLS 终止]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)。

你可以从以下三种证书来源中选择一种，用于在 Rancher Server 中终止 TLS：

- **Rancher 生成的 TLS 证书**：要求你在集群中安装 `cert-manager`。Rancher 使用 `cert-manager` 签发并维护证书。Rancher 会生成自己的 CA 证书，并使用该 CA 签署证书。然后 `cert-manager`负责管理该证书。
- **Let's Encrypt**：Let's Encrypt 选项也需要使用 `cert-manager`。但是，在这种情况下，cert-manager 与 Let's Encrypt 的特殊颁发者相结合，该颁发者执行获取 Let's Encrypt 颁发的证书所需的所有操作（包括请求和验证）。此配置使用 HTTP 验证（`HTTP-01`），因此负载均衡器必须具有可以从互联网访问的公共 DNS 记录。
- **你已有的证书**：使用已有的 CA 颁发的公有或私有证书。Rancher 将使用该证书来保护 WebSocket 和 HTTPS 流量。在这种情况下，你必须上传名称分别为 `tls.crt` 和 `tls.key`的 PEM 格式的证书以及相关的密钥。如果你使用私有 CA，则还必须上传该 CA 证书。这是由于你的节点可能不信任此私有 CA。Rancher 将获取该 CA 证书，并从中生成一个校验和，各种 Rancher 组件将使用该校验和来验证其与 Rancher 的连接。


| 配置 | Helm Chart 选项 | 是否需要 cert-manager |
| ------------------------------ | ----------------------- | ------------------------------------- |
| Rancher 生成的证书（默认） | `ingress.tls.source=rancher` | [是](#4-install-cert-manager) |
| Let’s Encrypt | `ingress.tls.source=letsEncrypt` | [是](#4-install-cert-manager) |
| 你已有的证书 | `ingress.tls.source=secret` | 否 |

### 4. 安装 cert-manager

> 如果你使用自己的证书文件（`ingress.tls.source=secret`）或使用[外部负载均衡器的 TLS 终止]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)，你可以跳过此步骤。

仅在使用 Rancher 生成的证书（`ingress.tls.source=rancher`）或 Let's Encrypt 颁发的证书（`ingress.tls.source=letsEncrypt`）时，才需要安装 cert-manager。



> **重要提示**：由于 cert-manager 的最新改动，你需要升级 cert-manager 版本。如果你需要升级 Rancher 并使用低于 0.11.0 的 cert-manager 版本，请参见[升级文档]({{<baseurl>}}/rancher/v2.6/en/installation/resources/upgrading-cert-manager/)。

这些说明来自 [cert-manager 官方文档](https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm)。

```
# 如果你手动安装了CRD，而不是在 Helm 安装命令中添加了 `--set installCRDs=true` 选项，你应该在升级 Helm Chart 之前升级 CRD 资源。
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml

# 添加 Jetstack Helm 仓库
helm repo add jetstack https://charts.jetstack.io

# 更新本地 Helm Chart 仓库缓存
helm repo update

# 安装 cert-manager Helm Chart
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.5.1
```

安装完 cert-manager 后，你可以通过检查 cert-manager 命名空间中正在运行的 Pod 来验证它是否已正确部署：

```
kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```



### 5. 根据你选择的证书选项，通过 Helm 安装 Rancher

不同的证书配置需要使用不同的 Rancher 安装命令。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="rancher"
values={[
{ label: 'Rancher 生成的证书', value: 'rancher', },
{ label: 'Let's Encrypt', value: 'letsencrypt', },
{ label: '已有的证书', value: 'fromfile', },
]}>

<TabItem value="rancher">


默认情况是使用 Rancher 生成 CA，并使用 `cert-manager` 颁发用于访问 Rancher Server 接口的证书。

由于 `rancher` 是 `ingress.tls.source` 的默认选项，因此在执行 `helm install` 命令时，我们不需要指定 `ingress.tls.source`。

- 将 `hostname` 设置为解析到你的负载均衡器的 DNS 名称。
- 将 `bootstrapPassword` 设置为`admin` 用户独有的值。
- 如果你安装的是 alpha 版本，Helm 要求你在命令中添加 `--devel` 选项。
- 如果你需要安装指定的 Rancher 版本，使用 `--version` 标志，例如 `--version 2.3.6`。

```
helm install rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set bootstrapPassword=admin
```

等待 Rancher 运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

</TabItem>
<TabItem value="letsencrypt">

此选项使用 `cert-manager` 来自动请求和续订 [Let's Encrypt](https://letsencrypt.org/) 证书。Let's Encrypt 是免费的，而且是受信的 CA，因此可以为你提供有效的证书。

> **注意**：由于 HTTP-01 质询只能在端口 80 上完成，因此你需要打开端口 80。

在以下命令中，

- 将 `hostname` 设置为公有 DNS 记录。
- 将 `bootstrapPassword` 设置为`admin` 用户独有的值。
- 将 `ingress.tls.source` 设置为 `letsEncrypt`。
- 将 `letsEncrypt.email` 设置为可通讯的电子邮件地址，用于发送通知（例如证书到期的通知）。
- 如果你安装的是 alpha 版本，Helm 要求你在命令中添加 `--devel` 选项。

```
helm install rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set bootstrapPassword=admin \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=me@example.org
```

等待 Rancher 运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

</TabItem>
<TabItem value="fromfile">

该选项使用你自己的证书来创建 Kubernetes 密文，以供 Rancher 使用。

运行这个命令时，`hostname` 选项必须与服务器证书中的 `Common Name` 或 `Subject Alternative Names` 条目匹配，否则 Ingress controller 将无法正确配置。

虽然技术上仅需要 `Subject Alternative Names` 中有一个条目，但是拥有一个匹配的 `Common Name` 可以最大程度地提高与旧版浏览器/应用的兼容性。

> 如果你想检查证书是否正确，请查看[如何在服务器证书中检查 Common Name 和 Subject Alternative Names]({{<baseurl>}}/rancher/v2.6/en/faq/technical/#how-do-i-check-common-name-and-subject-alternative-names-in-my-server-certificate)。

- 设置 `hostname`。
- 将 `bootstrapPassword` 设置为`admin` 用户独有的值。
- 将 `ingress.tls.source` 设置为 `secret`。
- 如果你安装的是 alpha 版本，Helm 要求你在命令中添加 `--devel` 选项。

```
helm install rancher rancher-<CHART_REPO>/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set bootstrapPassword=admin \
  --set ingress.tls.source=secret
```

如果你使用的是私有 CA 证书，请在命令中增加 `--set privateCA=true`。

```
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set bootstrapPassword=admin \
  --set ingress.tls.source=secret \
  --set privateCA=true
```

现在 Rancher 已部署，请参见[添加 TLS 密文]({{<baseurl>}}/rancher/v2.6/en/installation/resources/tls-secrets/)发布证书文件，以便 Rancher 和 Ingress Controller 可以使用它们。
</TabItem>
</Tabs>

Rancher Chart 有许多选项，用于为你的具体环境自定义安装。以下是一些常见的高级方案：

- [HTTP 代理]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#http-proxy)
- [私有容器镜像仓库]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#private-registry-and-air-gap-installs)
- [外部负载均衡器上的 TLS 终止]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#external-tls-termination)

如需获取完整的选项列表，请参见 [Chart 选项]({{<baseurl>}}/rancher/v2.6/en/installation/resources/chart-options/)。


### 6. 验证 Rancher Server 是否部署成功

添加密文后，检查 Rancher 是否已成功运行：

```
kubectl -n cattle-system rollout status deploy/rancher
Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
deployment "rancher" successfully rolled out
```

如果你看到 `error: deployment "rancher" exceeded its progress deadline` 这个错误，可运行以下命令来检查 deployment 的状态：

```
kubectl -n cattle-system get deploy rancher
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
rancher   3         3         3            3           3m
```

`DESIRED` 和 `AVAILABLE`的个数应该相同。

### 7. 保存选项

请保存你使用的 `--set` 选项。使用 Helm 升级 Rancher 到新版本时，你将需要使用相同的选项。

### 安装完成

安装已完成。现在 Rancher Server 应该已经可以正常运行了。

使用浏览器打开把流量转发到你的负载均衡器的 DNS 域名。然后，你就会看到一个漂亮的登录页面了。

如果在安装过程中遇到任何问题，请参见[故障排查]({{<baseurl>}}/rancher/v2.6/en/installation/resources/troubleshooting/)。
