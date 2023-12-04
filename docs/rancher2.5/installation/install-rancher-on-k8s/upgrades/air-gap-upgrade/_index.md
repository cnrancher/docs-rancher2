---
title: 离线升级
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

这些说明假设您已经按照[这个页面](/docs/rancher2.5/installation/install-rancher-on-k8s/upgrades/_index)上的 Kubernetes 升级说明进行操作，包括先决条件，直到第 3 步升级 Rancher。

## Rancher Helm 模板选项

使用安装 Rancher 时选择的相同选项来渲染 Rancher 模板。使用下面的参考表来替换每个占位符。Rancher 需要配置为使用私有镜像仓库，以便为任何 Rancher 启动的 Kubernetes 集群或 Rancher 工具提供服务。

根据您在安装过程中做出的选择，完成以下程序之一。

| 占位符                           | 说明                                    |
| :------------------------------- | :-------------------------------------- |
| `<VERSION>`                      | 输出压缩包的版本号。                    |
| `<RANCHER.YOURDOMAIN.COM>`       | 指向负载均衡器的 DNS 名称。             |
| `<REGISTRY.YOURDOMAIN.COM:PORT>` | 您的私有镜像仓库的 DNS 名称。           |
| `<CERTMANAGER_VERSION>`          | 在 k8s 集群上运行的 Cert-manager 版本。 |

## 选项 A：使用默认的自签名证书

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="2581"
values={[
{ label: 'Rancher V2.5.8+', value: '2581', },
{ label: 'Rancher V2.5.8 之前', value: '258', },
]}>

<TabItem value="2581">

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

</TabItem>

<TabItem value="258">

```
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
 --namespace cattle-system \
 --set hostname=<RANCHER.YOURDOMAIN.COM> \
 --set certmanager.version=<CERTMANAGER_VERSION> \
 --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
 --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
 --set useBundledSystemChart=true # Use the packaged Rancher system charts
```

</TabItem>
</Tabs>

## 选项 B：使用 Kubernetes Secrets 从文件中获取证书

<Tabs
defaultValue="2581"
values={[
{ label: 'Rancher V2.5.8+', value: '2581', },
{ label: 'Rancher V2.5.8 之前', value: '258', },
]}>

<TabItem value="2581">

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

</TabItem>

<TabItem value="258">

```plain
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Use the packaged Rancher system charts
```

如果你使用的是私有 CA 签名的证书，请在`--set ingress.tls.source=secret`后面添加`--set privateCA=true`。

```plain
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
--namespace cattle-system \
--set hostname=<RANCHER.YOURDOMAIN.COM> \
--set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
--set ingress.tls.source=secret \
--set privateCA=true \
--set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # Set a default private registry to be used in Rancher
--set useBundledSystemChart=true # Use the packaged Rancher system charts
```

</TabItem>
</Tabs>

## 应用渲染的模板

将渲染的清单目录复制到可以访问 Rancher Server 集群的系统中，并应用渲染的模板。

使用 `kubectl` 应用渲染的清单。

```plain
kubectl -n cattle-system apply -R -f ./rancher
```

## 验证升级是否成功

登录 Rancher，确认升级成功。

如果升级之后出现了网络问题，请参考[恢复集群网络](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/namespace-migration/_index)。

## 已知问题

下表列出了升级 Rancher 时需要考虑的一些最值得注意的问题。每个 Rancher 版本的已知问题的更完整列表可以在 [GitHub](https://github.com/rancher/rancher/releases) 上的发布说明和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)上找到。
