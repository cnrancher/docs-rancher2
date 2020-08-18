---
title: "私有注册表配置"
weight: 55
---

_v1.0.0 开始可用_

可以配置 Containerd 连接到私有注册表，并使用它们在节点上拉取私有镜像。

启动时，K3s 会检查`/etc/rancher/k3s/`中是否存在`registries.yaml`文件，并指示 containerd 使用文件中定义的注册表。如果你想使用一个私有的注册表，那么你需要在每个使用注册表的节点上以 root 身份创建这个文件。

请注意，server 节点默认是可以调度的。如果你没有在 server 节点上设置污点，那么将在它们上运行工作负载，请确保在每个 server 节点上创建`registries.yaml`文件。

Containerd 中的配置可以用于通过 TLS 连接到私有注册表，也可以与启用验证的注册表连接。下一节将解释`registries.yaml`文件，并给出在 K3s 中使用私有注册表配置的不同例子。

## 注册表配置文件

该文件由两大部分组成:

- mirrors
- configs

### Mirrors

Mirrors 是一个用于定义专用注册表的名称和 endpoint 的指令，例如。

```
mirrors:
  mycustomreg.com:
    endpoint:
      - "https://mycustomreg.com:5000"
```

每个 mirror 必须有一个名称和一组 endpoint。当从注册表中拉取镜像时，containerd 会逐一尝试这些 endpoint URL，并使用第一个可用的 endpoint。

### Configs

Configs 部分定义了每个 mirror 的 TLS 和证书配置。对于每个 mirror，你可以定义`auth`和/或`tls`。TLS 部分包括：

| 指令        | 描述                                           |
| ----------- | ---------------------------------------------- |
| `cert_file` | 用来与注册表进行验证的客户证书路径             |
| `key_file`  | 用来验证注册表的客户端密钥路径                 |
| `ca_file`   | 定义用于验证注册表服务器证书文件的 CA 证书路径 |

凭证由用户名/密码或认证 token 组成:

- username: 注册表身份验证的用户名
- password: 注册表身份验证的用户密码
- auth: 注册表 auth 的认证 token

以下是在不同模式下使用私有注册表的基本例子:

### 使用 TLS

下面的例子展示了当你使用 TLS 时，如何在每个节点上配置`/etc/rancher/k3s/registries.yaml`。

#### 有认证

```
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # 这是私有注册表的用户名
      password: xxxxxx # 这是私有注册表的密码
    tls:
      cert_file: # 注册表中使用的cert文件的路径。
      key_file:  # 注册表中使用的key文件的路径。
      ca_file:   # 注册表中使用的ca文件的路径。
```

#### 无认证

```
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    tls:
      cert_file: # 注册表中使用的cert文件的路径。
      key_file:  # 注册表中使用的key文件的路径。
      ca_file:   # 注册表中使用的ca文件的路径。
```

### 不使用 TLS

下面的例子展示了当你不使用 TLS 时，如何在每个节点上配置`/etc/rancher/k3s/registries.yaml`。

#### 有认证

```
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # 这是私有注册表的用户名
      password: xxxxxx # 这是私有注册表的密码
```

#### 无认证

```
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
```

> 在没有 TLS 通信的情况下，需要为 endpoints 指定`http://`，否则将默认为 https。

为了使注册表更改生效，你需要重新启动每个节点上的 K3s。

## 添加镜像到私有注册表

首先，从 GitHub 上获取你正在使用的版本的 k3s-images.txt 文件。
从 docker.io 中拉取 k3s-images.txt 文件中列出的 K3s 镜像。

例: `docker pull docker.io/rancher/coredns-coredns:1.6.3`

然后，将镜像重新标记成私有注册表。

例: `docker tag coredns-coredns:1.6.3 mycustomreg:5000/coredns-coredns`

最后，将镜像推送到私有注册表。

例: `docker push mycustomreg:5000/coredns-coredns`
