---
title: 私有镜像仓库
description: nodes是cluster.yml文件中唯一需要填写的部分，它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。它被 RKE 用来指定集群节点、用于访问节点的 ssh 凭证以及这些节点在 Kubernetes 集群中的角色。
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
  - RKE
  - 配置选项
  - 私有镜像仓库
---

## 概述

RKE 支持在`cluster.yml`中配置多个私有镜像仓库。您可以在`cluster.yml`中配置私有镜像仓库和凭证，然后从私有镜像仓拉取镜像。

```yaml
private_registries:
  - url: registry.com
    user: Username
    password: password
  - url: myregistry.com
    user: myuser
    password: mypassword
```

如果您使用的是 Docker Hub 镜像仓库，您可以省略`url`，或者将`url`的值设置为 `docker.io`。

:::note 注意
尽管该指令被命名为`url`，但没有必要在主机或 IP 地址前加上`https://`。
:::

有效的`url'例子包括：

```yaml
url: registry.com
url: registry.com:5555
url: 1.1.1.1
url: 1.1.1.1:5555/artifactory
```

### 默认镜像仓库

从 v0.1.10 开始，RKE 支持从私有镜像仓库中指定一个默认的镜像仓库，用于所有[系统镜像](/docs/rke/config-options/system-images/_index)。在这个例子中，RKE 将使用`registry.com`作为所有系统镜像的默认镜像仓库，例如`rancher/rke-tools:v0.1.14`将变成`registry.com/rancher/rke-tools:v0.1.14`。

```yaml
private_registries:
  - url: registry.com
    user: Username
    password: password
    is_default: true # 所有的系统镜像都将使用该镜像仓库进行拉取
```

### 离线配置选项

默认情况下，所有的系统镜像都是从 DockerHub 中拉取的。如果您所在的系统没有访问 DockerHub 的权限，您将需要创建一个私有镜像仓库，该镜像仓库将填充所有需要的[系统镜像](/docs/rke/config-options/system-images/_index)。

从 v0.1.10 开始，您必须配置您的私有镜像仓库凭证，但您可以指定这个镜像仓库为默认镜像仓库，这样所有的[系统镜像](/docs/rke/config-options/system-images/_index)都会从指定的私有镜像仓库中提取。您可以使用`rke config --system-images`命令来获取默认系统映像的列表来填充您的私有镜像仓库。

在 v0.1.10 之前，您必须配置您的私有镜像仓库凭证并更新`cluster.yml`中所有[系统镜像](/docs/rke/config-options/system-images/_index)的名称，这样镜像名称就会在每个镜像名称前附加私有镜像仓库 URL。
