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

从 v0.1.10 开始，RKE 支持从私有镜像仓库中指定一个默认的镜像仓库，用于所有[系统镜像](/docs/rke/config-options/system-images/)。在这个例子中，RKE 将使用`registry.com`作为所有系统镜像的默认镜像仓库，例如`rancher/rke-tools:v0.1.14`将变成`registry.com/rancher/rke-tools:v0.1.14`。

```yaml
private_registries:
  - url: registry.com
    user: Username
    password: password
    is_default: true # 所有的系统镜像都将使用该镜像仓库进行拉取
```

### 离线配置选项

默认情况下，所有的系统镜像都是从 DockerHub 中拉取的。如果您所在的系统没有访问 DockerHub 的权限，您将需要创建一个私有镜像仓库，该镜像仓库将填充所有需要的[系统镜像](/docs/rke/config-options/system-images/)。

从 v0.1.10 开始，您必须配置您的私有镜像仓库凭证，但您可以指定这个镜像仓库为默认镜像仓库，这样所有的[系统镜像](/docs/rke/config-options/system-images/)都会从指定的私有镜像仓库中提取。您可以使用`rke config --system-images`命令来获取默认系统映像的列表来填充您的私有镜像仓库。

在 v0.1.10 之前，您必须配置您的私有镜像仓库凭证并更新`cluster.yml`中所有[系统镜像](/docs/rke/config-options/system-images/)的名称，这样镜像名称就会在每个镜像名称前附加私有镜像仓库 URL。

### Amazon Elastic Container Registry (ECR) 私有注册表设置

[Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) 是一种安全、可扩展且可靠的 AWS 托管容器镜像注册服务。有两种方法可以提供 ECR 凭证来设置您的 ECR 私有注册表：使用实例配置文件或添加配置片段，它们是 `kubelet` 环境变量中的硬编码凭证和 `ecrCredentialPlugin` 下的凭证。

- **实例配置文件**：实例配置文件是提供 ECR 凭证的首选且更安全的方法（在 EC2 等中运行时）。默认情况下，实例配置文件将被自动检测和使用。有关使用 ECR 权限配置实例配置文件的更多信息，请转到 [此处](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security-iam.html)。

- **配置片段**。只有当你的节点存在以下条件时，你才会使用下面的配置片段而不是实例配置文件：

  - 节点不是一个 EC2 实例
  - 节点是一个 EC2 实例，但没有配置实例配置文件
  - 节点是一个 EC2 实例，并且配置了实例配置文件，但没有 ECR 的权限

> **注意：** ECR 凭证只在 `kubelet` 和 `ecrCredentialPlugin` 区域使用。如果你在创建一个新的集群或在协调/升级过程中拉取镜像时遇到问题，请务必记住这一点。
>
> - Kubelet：对于附加组件、自定义 workload 等，实例配置文件或凭证被下游集群节点使用
> - 拉取系统镜像（直接通过 Docker）：对于启动、升级、协调等，实例配置文件或凭证被运行 RKE 或运行 Rancher pod 的节点使用。

```
  # Configuration snippet to be used when the instance profile is unavailable.
  services:
    kubelet:
      extra_env:
        - "AWS_ACCESS_KEY_ID=ACCESSKEY"
        - "AWS_SECRET_ACCESS_KEY=SECRETKEY"
  private_registries:
       - url: ACCOUNTID.dkr.ecr.REGION.amazonaws.com
         is_default: true
         ecrCredentialPlugin: 
          aws_access_key_id: "ACCESSKEY"
          aws_secret_access_key: "SECRETKEY"
``` 
