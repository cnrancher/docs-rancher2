---
title: 在 GKE 上安装 Rancher
description:
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
  - 高可用安装指南
  - 安装 Rancher
  - 在 GKE 上安装 Rancher
---

在本节中，你将学习如何使用 GKE 安装 Rancher。

如果你已经有一个 GKE Kubernetes 集群，请跳到关于[安装 ingress 的步骤](#7-install-an-ingress)，然后按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)上的说明安装 Rancher Helm chart 。

# 先决条件

- 你将需要一个谷歌账户。
- 你将需要一个谷歌云计费账户。你可以使用 Google Cloud Console 来管理你的云计费账户。关于云控制台的更多信息，请访问[控制台的一般指南。](https://support.google.com/cloud/answer/3465889?hl=en&ref_topic=3340599)
- 你将需要至少一个在用的 IP 地址和至少 2 个 CPU 的云配额。关于 Rancher 服务器硬件要求的更多细节，请参考[本节](/docs/rancher2.5/installation/requirements/_index)

# 1. 启用 Kubernetes 引擎 API

采取以下步骤来启用 Kubernetes 引擎 API。

1. 访问 Google Cloud Console 中的[Kubernetes Engine 页面]（https://console.cloud.google.com/projectselector/kubernetes?_ga=2.169595943.767329331.1617810440-856599067.1617343886）。
1. 创建或选择一个项目。
1. 打开项目，为项目启用 Kubernetes Engine API。等待 API 和相关服务被启用。这可能需要几分钟的时间。
1. 确保为你的云项目启用了计费。关于如何为你的项目启用计费的信息，请参考[Google Cloud 文档。](https://cloud.google.com/billing/docs/how-to/modify-project#enable_billing_for_a_project)

# 2. 打开 Cloud Shell

Cloud Shell 是一个用于管理谷歌云上托管的资源的壳环境。Cloud Shell 预装了`gcloud`命令行工具和 kubectl 命令行工具。`gcloud`工具提供了谷歌云的主要命令行界面，`kubectl`提供了针对 Kubernetes 集群运行命令的主要命令行界面。

以下部分描述了如何从谷歌云控制台或从本地工作站启动 Cloud Shell。

### Cloud Shell

要从[Google Cloud Console](https://console.cloud.google.com)启动 shell，请到控制台的右上角，点击终端按钮。当悬停在该按钮上时，它被标记为激活 Cloud Shell。

###本地 Shell

要安装`gcloud`和`kubectl`，请执行以下步骤。

1. 按照[这些步骤](https://cloud.google.com/sdk/docs/install)安装 Cloud SDK。Cloud SDK 包括`gcloud`命令行工具。根据你的操作系统，步骤有所不同。
1. 安装 Cloud SDK 后，通过运行以下命令安装`kubectl`命令行工具。

   ```
   gcloud components install kubectl
   ```

   在后面的步骤中，`kubectl`将被配置为使用新的 GKE 集群。

1. [安装 Helm 3](https://helm.sh/docs/intro/install/)，如果还没有安装。
1. 用`HELM_EXPERIMENTAL_OCI`变量启用 Helm 实验性[支持 OCI 镜像](https://github.com/helm/community/blob/master/hips/hip-0006.md)。在`~/.bashrc`（或 macOS 中的`~/.bash_profile`，或你的 shell 存储环境变量的地方）添加以下一行。

   ```
   export HELM_EXPERIMENTAL_OCI=1
   ```

1. 运行以下命令来加载你更新的`.bashrc'文件。

   ```
   source ~/.bashrc
   ```

   如果你运行的是 macOS，使用这个命令。

   ```
   source ~/.bash_profile
   ```

# 3. 配置 gcloud CLI

使用以下方法之一来设置 gcloud 的默认设置。

- 使用 gcloud init，如果您想在设置默认值时得到指导。
- 使用 gcloud config，来单独设置您的项目 ID、区域和地区。

{{%标签%}}
{{% tab "Using gloud init" %}}

1. 运行 gcloud init 并按照指示操作。

   ```
   gcloud init
   ```

   如果你在远程服务器上使用 SSH，使用--console-only 标志，以防止该命令启动浏览器。

   ```
   gcloud init --console-only
   ```

2. 按照指示，授权 gcloud 使用你的 Google Cloud 账户，并选择你创建的新项目。

{{% /tab %}}
{{% tab "Using gcloud config" %}}.
{{% /tab %}} {{% /tab %}}
{{% /tabs %}} {{% /tabs %}}

# 4. 确认 gcloud 的配置是正确的

运行。

```
gcloud config list
```

输出应该类似于以下内容。

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

将`cluster-name`替换为新集群的名称。

在选择 Kubernetes 版本时，请务必先查阅 [支持矩阵](https://rancher.com/support-matrix/) 找到针对你的 Rancher 版本进行验证的 Kubernetes 最高版本。

```
gcloud container clusters create cluster-name --num-nodes=3 --cluster-version=1.20.10-gke.301
```

# 6. 获取认证凭证

创建集群后，你需要获得认证凭证，以便与集群互动。

```
gcloud container clusters get-credentials cluster-name
```

这个命令可以配置`kubectl`使用你创建的集群。

# 7. 安装一个 Ingress

集群需要一个 Ingress，以便 Rancher 可以从集群外部访问。

下面的命令安装了一个带有 LoadBalancer 服务的`nginx-ingress-controller`。

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

要获得负载均衡器的地址，请运行。

```
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

结果应该与下面类似。

```
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   10.3.244.156   35.233.206.34   80:31876/TCP,443:32497/TCP   81s
```

保存`EXTERNAL-IP`。

# 9. 设置 DNS

到 Rancher 服务器的外部流量将需要指向你创建的负载均衡器。

设置一个 DNS 来指向你保存的外部 IP。这个 DNS 将被用作 Rancher 服务器的 URL。

有许多有效的方法来设置 DNS。如需帮助，请参考谷歌云文档中关于[管理 DNS 记录。](https://cloud.google.com/dns/docs/records)

# 10. 安装 Rancher Helm Chart

接下来，按照[本页](/docs/rancher2.5/installation/install-rancher-on-k8s/_index)上的说明安装 Rancher Helm 图。 Helm 说明对于在任何 Kubernetes 发行版上安装 Rancher 是一样的。

当你安装 Rancher 时，使用前一步的 DNS 名称作为 Rancher 服务器的 URL。它可以作为一个 Helm 选项传入。例如，如果 DNS 名称是`rancher.my.org`，你可以用`--set hostname=rancher.my.org`选项运行 Helm 安装命令。
