---
title: 更新私有 CA 证书
description: 请按照这些步骤更新 Rancher高可用 Kubernetes 安装中的入口的 SSL 证书，或者从默认的自签名证书切换到自定义证书。
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
  - 资源及高级选项配置
  - 更新私有 CA 证书
---

## 概述

请按照这些步骤更新 Rancher[高可用 Kubernetes 安装](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)中的入口的 SSL 证书，或者从默认的自签名证书切换到自定义证书。

具体步骤总结如下：

1. 用新的证书和私钥创建或更新`tls-rancher-ingress` Kubernetes 密钥源。
2. 使用根 CA 证书创建或更新`tls-ca`Kubernetes 密钥源（仅在使用私有 CA 时需要执行此步骤）。
3. 使用 Helm CLI 更新 Rancher 安装。
4. 重新配置 Rancher 代理以信任新的 CA 证书。

## 1. 创建/编辑证书密钥源

首先，将服务器证书和任何中间证书连接到名为`tls.crt`的文件中，并在名为`tls.key`的文件中提供相应的证书密钥。

如果您从使用 Rancher 自签名证书或 Let's Encrypt 签发的证书切换安装，请使用以下命令在 Rancher HA 集群中创建`tls-rancher-ingress`密钥源。

```bash
$ kubectl -n cattle-system create secret tls tls-rancher-ingress \
  --cert=tls.crt \
  --key=tls.key
```

或者，更新现有的证书密钥：

```bash
$ kubectl -n cattle-system create secret tls tls-rancher-ingress \
  --cert=tls.crt \
  --key=tls.key \
  --dry-run --save-config -o yaml | kubectl apply -f -
```

## 2. 创建/编辑 CA 证书密钥源

如果新证书是由私人 CA 签署的，则需要将相应的根 CA 证书复制到名为`cacerts.pem`的文件中，并在`cattle-system`命名空间中创建或更新`tls-ca secret`。如果证书是由中间 CA 签署的，那么`cacerts.pem`必须包含中间 CA 和根 CA 证书(按这个顺序)。

运行以下命令创建初始密钥：

```bash
$ kubectl -n cattle-system create secret generic tls-ca \
  --from-file=cacerts.pem
```

运行以下命令修改`tls-ca`中已有的密钥：

```bash
$ kubectl -n cattle-system create secret generic tls-ca \
  --from-file=cacerts.pem \
  --dry-run --save-config -o yaml | kubectl apply -f -
```

## 3. 重新配置 Rancher deployment

在继续之前，请在 Rancher 用户界面（**用户 > API &密钥**）中生成一个 API 令牌，并保存您在步骤 4 中可能需要的承载令牌。

如果 Rancher 最初安装时使用的是自签名证书(`ingress.tls.source=rancher`)或 Let's Encrypt 颁发的证书(`ingress.tls.source=letsEncrypt`)，则需要执行这一步步骤。

它确保 Rancher pods 和入口资源被重新配置为使用新的服务器和可选的 CA 证书。

要更新 Helm 部署，您需要使用初始安装时使用的相同（`--set`）选项，请运行以下命令检查：

```bash
$ helm get values rancher -n cattle-system
```

然后运行以下命令，获得当前部署的 Rancher 图表的版本字符串：

```bash
$ helm ls -A
```

使用原始配置值升级 Helm 应用实例，并确保指定`ingress.tls.source=secret`以及当前 chart 版本，以防止应用升级。

如果证书是由私有 CA 签署的，也要添加`set privateCA=true`参数。另外，请务必阅读描述使用[自定义证书](/docs/rancher2/installation_new/install-rancher-on-k8s/_index)进行初始安装的文档。

```bash
helm upgrade rancher rancher-stable/rancher \
  --namespace cattle-system \
  --version <DEPLOYED_CHART_VERSION> \
  --set hostname=rancher.my.org \
  --set ingress.tls.source=secret \
  --set ...
```

升级完成后，导航到`https://<Rancher_SERVER>/v3/settings/cacerts`，验证该值是否与之前`tls-ca`密钥中写入的 CA 证书相匹配。

## 4. 重新配置 Rancher agents 以信任私有 CA

本节介绍了三种重新配置 Rancher 代理以信任私有 CA 的方法。如果以下情况之一为真，则需要进行此步骤。

- Rancher 最初配置为使用 Rancher 自签名证书(`ingress.tls.source=rancher`)或使用 Let's Encrypt 颁发的证书(`ingress.tls.source=letsEncrypt`)。
- 新的自定义证书的根 CA 证书发生了变化。

### 为什么要执行这个步骤？

当 Rancher 配置了由私人 CA 签署的证书时，CA 证书链被下载到 Rancher 代理容器中。代理商将下载的证书的校验和与`CATTLE_CA_CHECKSUM`环境变量进行比较。这意味着，当 Rancher 服务器端的私有 CA 证书发生变化时，环境变量`CATTLE_CA_CHECKSUM`必须相应地更新。

### 有哪些方法可以选择？

方法 1 是最简单的方法，但需要在证书轮换后将所有集群连接到 Rancher。如果该过程是在更新 Rancher 部署后立即执行的（步骤 3），通常会出现这种情况。

如果群集已经失去了与 Rancher 的连接，但你已经启用了[授权群集端点](/docs/rancher2/cluster-admin/cluster-access/ace/_index)，那么就采用方法 2。

如果方法 1 和 2 不可行，可以将方法 3 作为后备方法。

### 方法 1：Kubectl 命令

对于 Rancher 管理下的每个集群(包括`local`)，使用 Rancher 管理集群(RKE 或 K3S)的 Kubeconfig 文件运行以下命令。

```
kubectl patch cluster <REPLACE_WITH_CLUSTERID> -p '{"status":{"agentImage": "dummy"}}' --type merge
```

该命令将使所有 Agent Kubernetes 资源用新证书的校验和重新配置。

### 方法 2：手动更新 checksum

通过更新`CATTLE_CA_CHECKSUM`环境变量，将与新 CA 证书的校验值相匹配的值，手动为代理 Kubernetes 资源打上补丁。像这样生成新的校验值。

```
$ curl -k -s -fL <RANCHER_SERVER>/v3/settings/cacerts | jq -r .value > cacert.tmp。
$ sha256sum cacert.tmp | awk '{print $1}'。
```

使用每个下游集群的 Kubeconfig 更新两个代理部署的环境变量。

```
$ kubectl edit -n cattle-system ds/cattle-node-agent
$ kubectl edit -n cattle-system deployment/cluster-agent。
```

### 方法 3：重新创建 Rancher agents

使用这种方法，您是通过在每个下游集群的控制平面节点上运行一组命令来重新创建 Rancher 代理。

首先，按照这里的描述生成代理定义：https://gist.github.com/superseb/076f20146e012f1d4e289f5bd1bd4971 。

然后，通过 SSH 连接到下游集群的控制板节点，创建 Kubeconfig 并应用定义。
https://gist.github.com/superseb/b14ed3b5535f621ad3d2aa6a4cd6443b
