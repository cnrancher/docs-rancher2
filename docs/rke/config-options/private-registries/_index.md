---
title: 私有镜像仓库
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

> **注意：**如果您使用的是 Docker Hub 镜像仓库，您可以省略`url`，或者将`url`的值设置为 `docker.io`。

### 默认镜像仓库

从 v0.1.10 开始，RKE 支持从私有镜像仓库中指定一个默认的镜像仓库，用于所有[系统镜像](/docs/rke/config-options/system-images/_index)。在这个例子中，RKE 将使用`registry.com`作为所有系统镜像的默认镜像仓库，例如`rancher/rke-tools:v0.1.14`将变成`registry.com/rancher/rke-tools:v0.1.14`。

```yaml
private_registries:
  - url: registry.com
    user: Username
    password: password
    is_default: true # 所有的系统镜像都将使用该注册表进行拉取
```

### 离线配置选项

默认情况下，所有的系统镜像都是从 DockerHub 中拉取的。如果您所在的系统没有访问 DockerHub 的权限，您将需要创建一个私有镜像仓库，该镜像仓库将填充所有需要的[系统镜像](/docs/rke/config-options/system-images/_index)。

从 v0.1.10 开始，您必须配置您的私有镜像仓库凭证，但您可以指定这个镜像仓库为默认注册表，这样所有的[系统镜像](/docs/rke/config-options/system-images/_index)都会从指定的私有注册表中提取。您可以使用`rke config --system-images`命令来获取默认系统映像的列表来填充您的私有注册表。

在 v0.1.10 之前，您必须配置您的私有镜像仓库凭证并更新`cluster.yml`中所有[系统镜像](/docs/rke/config-options/system-images/_index)的名称，这样镜像名称就会在每个镜像名称前附加私有注册表 URL。
