---
title: 在 GKE 集群上安装 Rancher
shortTitle: GKE
weight: 5
---

在本节中，你将学习如何使用 GKE 安装 Rancher。

如果你已经有一个 GKE Kubernetes 集群，请直接跳转到[安装 Ingress](#7-install-an-ingress)这个步骤。然后按照[此处]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/#install-the-rancher-helm-chart)的步骤安装 Rancher Helm Chart。

# 前提

- 你需要有一个 Google 账号。
- 你需要有一个 Google Cloud Billing 账号。你可使用 Google Cloud Console 来管理你的 Cloud Billing 账号。有关 Cloud Console 的详情，请参见 [ Console 通用指南](https://support.google.com/cloud/answer/3465889?hl=en&ref_topic=3340599)。
- 你需要至少一个在用的 IP 地址和至少 2 个 CPU 的云配额。有关 Rancher Server 的硬件要求，请参见[本节]({{<baseurl>}}/rancher/v2.6/en/installation/requirements/#rke-and-hosted-kubernetes)。

# 1. 启用 Kubernetes Engine API

按照以下步骤启用 Kubernetes Engine API：

1. 访问 Google Cloud Console 中的 [Kubernetes Engine 页面](https://console.cloud.google.com/projectselector/kubernetes?_ga=2.169595943.767329331.1617810440-856599067.1617343886)。
1. 创建或选择一个项目。
1. 打开项目，并为项目启用 Kubernetes Engine API。等待 API 和相关服务的启用。这可能需要几分钟时间。
1. 确保为你的云项目启用了计费。有关如何为你的项目启用计费，请参见 [Google Cloud 文档中心](https://cloud.google.com/billing/docs/how-to/modify-project#enable_billing_for_a_project)。

# 2. 打开 Cloud Shell

Cloud Shell 是一个 shell 环境，用于管理托管在 Google Cloud 上的资源。Cloud Shell 预装了 `gcloud` 命令行工具和 kubectl 命令行工具中。`gcloud` 工具为 Google Cloud 提供主要的命令行界面，而`kubectl` 则提供针对 Kubernetes 集群的主要命令行界面。

下文描述了如何从 Google Cloud Console 或从本地工作站启动 Cloud Shell。

### Cloud Shell

如需从 [Google Cloud Console](https://console.cloud.google.com) 启动 shell，请在控制台的右上角点击终端按钮。鼠标悬停在按钮上时，它会标记为 **Activate Cloud Shell**。

### 本地 Shell

执行以下步骤以安装 `gcloud` 和 `kubectl`：

1. 按照[这些步骤](https://cloud.google.com/sdk/docs/install)安装 Cloud SDK。The Cloud SDK 包括 `gcloud` 命令行工具。不同操作系统对应的步骤有所不同。
1. 安装 Cloud SDK 后，运行以下命令以安装 `kubectl` 命令行工具：

   ```
   gcloud components install kubectl
   ```
   后面的步骤会配置 `kubectl`，使其用于使用新的 GKE 集群。
1. 如果 Helm 3 未安装的话，[安装 Helm 3](https://helm.sh/docs/intro/install/)。
1. 使用 `HELM_EXPERIMENTAL_OCI` 变量来启用 Helm 的实验功能 [OCI 镜像支持](https://github.com/helm/community/blob/master/hips/hip-0006.md)。把以下行添加到 `~/.bashrc` （或 macOS 中的 `~/.bash_profile`，或者你的 shell 存储环境变量的地方）：

   ```
   export HELM_EXPERIMENTAL_OCI=1
   ```
1. 运行以下命令来加载你更新的 `.bashrc` 文件：

   ```
   source ~/.bashrc
   ```
   如果你运行的是 macOS，使用这个命令:
   ```
   source ~/.bash_profile
   ```



# 3. 配置 gcloud CLI

选择以下方法之一配置默认的 gcloud 设置：

- 如果您想了解默认值，请使用 gcloud init。
- 如需单独设置你的项目 ID、地区和区域，使用 gcloud config。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs
defaultValue="init"
values={[
{ label: '使用 gloud init', value: 'init', },
{ label: '使用 gcloud config', value: 'config', },
]}>

<TabItem value="init">

1. 运行 gcloud init 并按照指示操作：

   ```
   gcloud init
   ```
   如果你在远程服务器上使用 SSH，使用 --console-only 标志，以防止该命令启动浏览器。

   ```
   gcloud init --console-only
   ```
2. 按照指示，以授权 gcloud 使用你的 Google Cloud 账户，并选择你创建的新项目。

</TabItem>

<TabItem value="config">

</TabItem>

</Tabs>

# 4. 确认 gcloud 的配置是否正确

运行：

```
gcloud config list
```

返回的结果应与以下内容类似：

```
[compute]
region = us-west1 # Your chosen region
zone = us-west1-b # Your chosen zone
[core]
account = <Your email>
disable_usage_reporting = True
project = <Your project ID>

Your active configuration is: [default]
```

# 5. 创建一个 GKE 集群

下面的命令创建了一个三节点的集群。

把 `cluster-name` 替换为你新集群的名称。

在选择 Kubernetes 版本时，请务必先查阅[支持矩阵](https://rancher.com/support-matrix/)，以找出已针对你的 Rancher 版本验证的最新 Kubernetes 版本。

```
gcloud container clusters create cluster-name --num-nodes=3 --cluster-version=1.20.8-gke.900
```

# 6. 获取验证凭证

创建集群后，你需要获得认证凭证才能与集群交互：

```
gcloud container clusters get-credentials cluster-name
```

此命令将 `kubectl` 配置成使用你创建的集群。

# 7. 安装 Ingress

集群需要一个 Ingress，以从集群外部访问 Rancher。

以下命令安装带有 LoadBalancer 服务的 `nginx-ingress-controller`：

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install \
  ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --version 3.12.0 \
  --create-namespace
```

# 8. 获取负载均衡器的 IP

运行以下命令获取负载均衡器的 IP 地址：

```
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

返回的结果应与以下内容类似：

```
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   10.3.244.156   35.233.206.34   80:31876/TCP,443:32497/TCP   81s
```

保存 `EXTERNAL-IP`。

# 9. 设置 DNS

到 Rancher Server 的外部流量需要重定向到你创建的负载均衡器。

创建指向你保存的外部 IP 地址的 DNS。这个 DNS 会用作 Rancher Server 的 URL。

设置 DNS 的有效方法有很多。如需获取帮助，请参见 Google Cloud 文档中的[管理 DNS 记录](https://cloud.google.com/dns/docs/records)部分。

# 10. 安装 Rancher Helm Chart

按照[本页]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/#install-the-rancher-helm-chart)的说明安装 Rancher Helm Chart。任何 Kubernetes 发行版上安装的 Rancher 的 Helm 说明都是一样的。

安装 Rancher 时，使用上一步获取的 DNS 名称作为 Rancher Server 的 URL。它可以作为 Helm 选项传递进来。例如，如果 DNS 名称是 `rancher.my.org`，你需要使用 `--set hostname=rancher.my.org` 选项来运行 Helm 安装命令。
