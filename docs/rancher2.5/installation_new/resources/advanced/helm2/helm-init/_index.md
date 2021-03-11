---
title: "安装 Tiller"
description: Helm 是 Kubernetes 首选的包管理工具。Helm "charts"为 Kubernetes YAML 文件提供了模板语法。我们可以使用 Helm 部署可配置的工作负载，来代替使用静态文件的方式。如果您想创建自己的私有应用商店，请参照文档 [https://helm.sh/](https://helm.sh/) 。使用 Helm 前，您需要在集群安装 `tiller` 服务端组件。
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
  - Helm初始化
  - 安装 Tiller
---

Helm 是 Kubernetes 首选的包管理工具。Helm Charts 为 Kubernetes YAML 文件提供了模板语法。我们可以使用 Helm 代替静态文件，部署可配置的工作负载。如果您想创建自己的私有应用商店，请参照文档 [Helm 官方文档](https://helm.sh/) 。使用 Helm 前，您需要在集群安装 `tiller` 服务端组件。

对于无法访问互联网的环境，请查看[Helm - 离线安装](/docs/rancher2.5/installation_new/resources/advanced/air-gap-helm2/install-rancher/_index)获取更多安装信息。

请参阅[Helm 版本要求](/docs/rancher2.5/installation_new/resources/helm-version/_index)，选择安装 Rancher 的 Helm 版本。

> **提示：** 安装指南基于 Helm 2 写作，如果您在使用 Helm 3，请参照[此说明](/docs/rancher2.5/installation_new/resources/advanced/helm2/helm-rancher/_index)。

## 在集群中安装 Tiller

> **重要：** 由于 Helm v2.12.0 和 cert-manager 的问题，请使用 Helm v2.12.1 或更新版本。

Helm 在您的集群中安装 `tiller` 服务来管理 charts。由于 RKE 默认开启了 RBAC，我们使用`kubectl` 命令创建一个 `serviceaccount` 和 `clusterrolebinding`，为 `tiller` 提供在集群中部署应用的权限，如下方代码所示。

- 在 `kube-system` 命名空间中创建 `serviceaccount`。
- 为 `tiller` 创建 `clusterrolebinding` 获取访问集群的权限。
- 最后使用 `helm` 来安装 `tiller` 服务。

```plain
kubectl -n kube-system create serviceaccount tiller

kubectl create clusterrolebinding tiller \
  --clusterrole=cluster-admin \
  --serviceaccount=kube-system:tiller

# 需要访问谷歌镜像库，如果无法访问请指定tiller-image
helm init --service-account tiller
```

:::important 重要
中国的用户请注意，在运行 helm init 时，您需要指定特定的 tiller-image 来初始化 tiller。
初始化 tiller 时，需要通过 “--tiller-image” 指定 tiller 镜像。

```
helm_version=`helm version |grep Client | awk -F""\" '{print $2}'`

helm init --service-account tiller \
--tiller-image registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:${helm_version}
```

:::

> **提示：** 以上`tiller`安装后，对集群有完全访问权限。如果您需要调整 tiller 的访问权限，请查看[Helm 官方文档](https://docs.helm.sh/using_helm/#role-based-access-control) 。

## 测试 Tiller

在您的集群上运行以下命令来验证 `tiller` 是否安装成功：

```
kubectl -n kube-system  rollout status deploy/tiller-deploy
Waiting for deployment "tiller-deploy" rollout to finish: 0 of 1 updated replicas are available...
deployment "tiller-deploy" successfully rolled out
```

并且运行以下命令验证 Helm 是否可以与 `tiller` 服务通信：

```
helm version
Client: &version.Version{SemVer:"v2.12.1", GitCommit:"02a47c7249b1fc6d8fd3b94e6b4babf9d818144e", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.12.1", GitCommit:"02a47c7249b1fc6d8fd3b94e6b4babf9d818144e", GitTreeState:"clean"}
```

## 问题排查

请查看[问题排查](/docs/rancher2.5/installation_new/resources/advanced/helm2/helm-init/troubleshooting/_index)。

## 后续操作

[ 安装 Rancher](/docs/rancher2.5/installation_new/resources/advanced/helm2/helm-rancher/_index)
