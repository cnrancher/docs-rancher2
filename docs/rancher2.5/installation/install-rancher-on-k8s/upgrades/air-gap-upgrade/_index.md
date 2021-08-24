---
title: 升级指南
description: 以下说明将指导您升级使用 Helm 安装在 Kubernetes 集群上的 Rancher 服务器。这些步骤也适用于使用 Helm 进行的离线安装。
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
  - 升级指南
---

## Rancher Helm 模板选项

使用安装 Rancher 时选择的相同选项来渲染 Rancher 模板。使用下面的参考表来替换每个占位符。Rancher 需要配置为使用私有镜像仓库，以便为任何 Rancher 启动的 Kubernetes 集群或 Rancher 工具提供服务。

根据您在安装过程中做出的选择，完成以下程序之一。

| 占位符                           | 说明                                    |
| :------------------------------- | :-------------------------------------- |
| `<VERSION>`                      | 输出压缩包的版本号。                    |
| `<RANCHER.YOURDOMAIN.COM>`       | 指向负载均衡器的 DNS 名称。             |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有镜像仓库的 DNS 名称。           |
| `<CERTMANAGER_VERSION>`          | 在 k8s 集群上运行的 Cert-manager 版本。 |

## 选项 1：使用默认的自签名证书

### 2.5.8 及之后的版本

```
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
    --no-hooks \ # prevent files for Helm hooks from being generated
	--namespace cattle-system \
	--set hostname=<RANCHER.YOURDOMAIN.COM> \
	--set certmanager.version=<CERTMANAGER_VERSION> \
	--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
	--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
	--set useBundledSystemChart=true # Use the packaged Rancher system charts
```

### 2.5.8 之前的版本

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set certmanager.version=<CERTMANAGER_VERSION> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

## 选项 2：使用 Kubernetes Secrets 从文件中获取证书

### 2.5.8 及之后的版本

```plain
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
	--no-hooks \ # prevent files for Helm hooks from being generated
	--namespace cattle-system \
	--set hostname=<RANCHER.YOURDOMAIN.COM> \
	--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
	--set ingress.tls.source=secret \
	--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
	--set useBundledSystemChart=true # Use the packaged Rancher system charts
```

如果你使用的是私有 CA 签名的证书，请在`--set ingress.tls.source=secret`后面加上`--set privateCA=true`。

```plain
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
	--no-hooks \ # prevent files for Helm hooks from being generated
	--namespace cattle-system \
	--set hostname=<RANCHER.YOURDOMAIN.COM> \
	--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
	--set ingress.tls.source=secret \
	--set privateCA=true \
	--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
	--set useBundledSystemChart=true # Use the packaged Rancher system charts
```

### 2.5.8 之前的版本

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

如果你使用的是私人 CA 签名的证书，请在`--set ingress.tls.source=secret`后面添加`--set privateCA=true`。

```plain
helm template ./rancher-<VERSION>.tgz --output-dir . \
--name rancher \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set privateCA=true \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Available as of v2.2.0, set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Available as of v2.3.0, use the packaged Rancher system charts
```

## 应用渲染的模板

将渲染的清单目录复制到可以访问 Rancher 服务器集群的系统中，并应用渲染的模板。

使用 "kubectl "应用渲染的清单。

```plain
kubectl -n cattle-system apply -R -f ./rancher
```

## 验证升级是否成功

登录 Rancher，确认升级成功。

如果升级之后出现了网络问题，请参考[恢复集群网络](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)。

## 已知问题

下表列出了升级 Rancher 时需要考虑的一些最值得注意的问题。每个 Rancher 版本的已知问题的更完整列表可以在[GitHub](https://github.com/rancher/rancher/releases)上的发布说明和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上找到。

| 升级场景                        | 问题描述                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 升级到 v2.4.6 或 v2.4.7         | 这些 Rancher 版本存在一个问题，即创建、编辑或克隆 Amazon EC2 节点模板需要`kms:ListKeys`权限。这一要求在 v2.4.8 中被删除。建议跳过 v2.4.6 或 v2.4.7，直接升级到 v2.4.8+。                                                                                                                                                                                       |
| 升级到 v2.3.0+                  | 任何用户供应的集群将在任何编辑后自动更新，因为容忍被添加到用于 Kubernetes 供应的镜像中。                                                                                                                                                                                                                                                                       |
| 升级到 v2.2.0-v2.2.x            | Rancher 引入了[system charts](https://github.com/rancher/system-charts)存储库，其中包含监控、日志、警报和全局 DNS 等功能所需的所有目录项。为了能够在 air gap 安装中使用这些功能，您需要在本地镜像`system-charts`资源库，并配置 Rancher 使用该资源库。请按照说明[配置 Rancher 系统 chart](/docs/rancher2.5/installation/resources/local-system-charts/_index)。 |
| 从 v2.0.13 或更早的版本进行升级 | 如果你的集群的证书已经过期，你需要执行[这些步骤](/docs/rancher2.5/cluster-admin/certificate-rotation/_index)来轮换证书。                                                                                                                                                                                                                                       |
| 从 v2.0.7 或更早的版本进行升级  | Rancher 引入了`system`项目，这是一个自动创建的项目，用于存储 Kubernetes 运行所需的重要命名空间。在升级到 v2.0.7+的过程中，Rancher 希望这些命名空间能够从所有项目中取消分配。在开始升级之前，请检查您的系统命名空间，确保它们未被分配，以[防止集群网络问题](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)。           |
