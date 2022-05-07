---
title: "私有镜像仓库配置参考"
description: 您可以配置 Containerd 连接到私有镜像仓库，并使用它们在节点上拉取私有镜像。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 私有镜像仓库配置参考
---

_v1.0.0 开始可用_

可以配置 Containerd 连接到私有镜像仓库，并使用它们在节点上拉取私有镜像。

启动时，K3s 会检查`/etc/rancher/k3s/`中是否存在`registries.yaml`文件，并指示 containerd 使用文件中定义的镜像仓库。如果你想使用一个私有的镜像仓库，那么你需要在每个使用镜像仓库的节点上以 root 身份创建这个文件。

请注意，server 节点默认是可以调度的。如果你没有在 server 节点上设置污点，那么将在它们上运行工作负载，请确保在每个 server 节点上创建`registries.yaml`文件。

Containerd 中的配置可以用于通过 TLS 连接到私有镜像仓库，也可以与启用验证的镜像仓库连接。下一节将解释`registries.yaml`文件，并给出在 K3s 中使用私有镜像仓库配置的不同例子。

## 镜像仓库配置文件

该文件由两大部分组成：

- mirrors
- configs

### Mirrors

Mirrors 是一个用于定义专用镜像仓库的名称和 endpoint 的指令，例如。

```
mirrors:
  mycustomreg.com:
    endpoint:
      - "https://mycustomreg.com:5000"
```

每个 mirror 必须有一个名称和一组 endpoint。当从镜像仓库中拉取镜像时，containerd 会逐一尝试这些 endpoint URL，并使用第一个可用的 endpoint。

#### 重写

每个镜像都可以有一组重写。重写可以根据正则表达式来改变镜像的标签。如果镜像仓库中的组织/项目结构与上游的不同，这很有用。

例如，以下配置将透明地从 `registry.example.com:5000/mirrorproject/rancher-images/coredns-coredns:1.6.3` 拉取镜像 `docker.io/rancher/coredns-coredns:1.6.3`：

```
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

镜像仍将以原始名称存储，所以 `crictl image ls` 将显示 `docker.io/rancher/coredns-coredns:1.6.3` 在节点上是可用的，即使镜像是以不同的名字从镜像仓库中拉取的。

### Configs

Configs 部分定义了每个 mirror 的 TLS 和凭证配置。对于每个 mirror，你可以定义`auth`和/或`tls`。

`tls` 部分包括：

| 指令                   | 描述                                             |
| :--------------------- | :----------------------------------------------- |
| `cert_file`            | 用来与镜像仓库进行验证的客户证书路径             |
| `key_file`             | 用来验证镜像仓库的客户端密钥路径                 |
| `ca_file`              | 定义用于验证镜像仓库服务器证书文件的 CA 证书路径 |
| `insecure_skip_verify` | 定义是否应跳过镜像仓库的 TLS 验证的布尔值        |

`auth` 部分由用户名/密码或身份验证令牌组成：

| Directive  | Description                |
| ---------- | -------------------------- |
| `username` | 镜像仓库身份验证的用户名   |
| `password` | 镜像仓库身份验证的用户密码 |
| `auth`     | 镜像仓库 auth 的认证 token |

以下是在不同模式下使用私有镜像仓库的基本例子：

### 使用 TLS

下面的例子展示了当你使用 TLS 时，如何在每个节点上配置`/etc/rancher/k3s/registries.yaml`。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
defaultValue="withauth"
values={[
{ label: '有认证', value: 'withauth', },
{ label: '无认证', value: 'withoutauth', },
]}>

<TabItem value="withauth">

```
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # 这是私有镜像仓库的用户名
      password: xxxxxx # 这是私有镜像仓库的密码
    tls:
      cert_file: # 镜像仓库中使用的cert文件的路径。
      key_file:  # 镜像仓库中使用的key文件的路径。
      ca_file:   # 镜像仓库中使用的ca文件的路径。
```

</TabItem>

<TabItem value="withoutauth">

```
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    tls:
      cert_file: # 镜像仓库中使用的cert文件的路径。
      key_file:  # 镜像仓库中使用的key文件的路径。
      ca_file:   # 镜像仓库中使用的ca文件的路径。
```

</TabItem>

</Tabs>

### 不使用 TLS

下面的例子展示了当你不使用 TLS 时，如何在每个节点上配置`/etc/rancher/k3s/registries.yaml`。

<Tabs
defaultValue="withauth"
values={[
{ label: '有认证', value: 'withauth', },
{ label: '无认证', value: 'withoutauth', },
]}>

<TabItem value="withauth">

```
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # 这是私有镜像仓库的用户名
      password: xxxxxx # 这是私有镜像仓库的密码
```

</TabItem>

<TabItem value="withoutauth">

```
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
```

</TabItem>

</Tabs>

> 在没有 TLS 通信的情况下，需要为 endpoints 指定`http://`，否则将默认为 https。

为了使镜像仓库更改生效，你需要重新启动每个节点上的 K3s。

## 添加镜像到私有镜像仓库

首先，从 GitHub 上获取你正在使用的版本的 k3s-images.txt 文件。
从 docker.io 中拉取 k3s-images.txt 文件中列出的 K3s 镜像。

示例： `docker pull docker.io/rancher/coredns-coredns:1.6.3`

然后，将镜像重新标记成私有镜像仓库。

示例： `docker tag coredns-coredns:1.6.3 mycustomreg:5000/coredns-coredns`

最后，将镜像推送到私有镜像仓库。

示例： `docker push mycustomreg:5000/coredns-coredns`
