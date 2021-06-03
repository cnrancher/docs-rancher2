---
title: Containerd 注册表配置
description: Containerd 可以配置连接到私有注册表，并使用它们在每个节点上提取私有镜像。
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
  - RKE2
  - Containerd 注册表配置
  - Containerd
  - 注册表
---


Containerd 可以配置连接到私有注册表，并使用它们在每个节点上提取私有镜像。

启动时，RKE2 将检查`/etc/rancher/rke2/`是否存在`registries.yaml`文件，并指示 containerd 使用该文件中定义的任何注册表。如果你希望使用一个私有的注册表，那么你将需要在每个使用注册表的节点上以 root 身份创建这个文件。

注意，server 节点默认是可调度的。如果你没有 tainted server 节点，并在 server 上运行工作负载，请确保你也在每个 server 上创建`registries.yaml`文件。

**注意：**在 RKE2 v1.20 之前，containerd 注册表配置并不支持初始的 RKE2 节点引导，只适用于节点加入集群后启动的 Kubernetes 工作负载。如果你打算使用这个 containerd 注册表功能来引导节点，请参考[离线安装文档](airgap.md)。

containerd 中的配置可用于通过 TLS 连接和启用身份验证的注册表连接到私有注册表。下一节将解释`registries.yaml`文件，并给出在 RKE2 中使用私有注册表配置的不同例子。

## 注册表配置文件

该文件由两个主要部分组成：

- mirrors
- configs

### Mirrors

Mirrors 是一个指令，用于定义私有注册表的名称和端点。私有注册表可以作为默认 docker.io 注册表的本地镜像，或者用于在名称中明确指定注册表的镜像。

例如，下面的配置将从`https://registry.example.com:5000`的私有注册表中提取`library/busybox:latest`和`registry.example.com/library/busybox:latest`。

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
  registry.example.com:
    endpoint:
      - "https://registry.example.com:5000"
```

每个镜像必须有一个名称和一组 endpoint。当从注册表中提取镜像时，containerd 将逐一尝试这些 endpoint URL，并使用第一个有效的 URL。

**注意：**如果没有配置 endpoint，containerd 会假定注册表可以通过 443 端口的 HTTPS 匿名访问，并且使用主机操作系统信任的证书。欲了解更多信息，你可以[查阅 containerd 文档](https://github.com/containerd/containerd/blob/master/docs/cri/registry.md#configure-registry-endpoint)。

### Configs

configs 部分定义了每个镜像的 TLS 和凭证配置。对于每个镜像，你可以定义`auth`和/或`tls`。TLS 部分由以下部分组成：

| 指令                   | 说明                                             |
| ---------------------- | ------------------------------------------------ |
| `cert_file`            | 客户端证书路径，将用于与注册表进行验证           |
| `key_file`             | 用于与注册表进行验证的客户密钥路径               |
| `ca_file`              | 定义用于验证注册表服务器 cert 文件的 CA 证书路径 |
| `insecure_skip_verify` | 布尔值，定义是否应该跳过注册表的 TLS 验证        |

凭证由用户名/密码或认证令牌组成：

- username: 私有注册表的用户名
- password: 私有注册表的用户密码
- auth: 私有注册表基本认证的认证令牌

以下是在不同模式下使用私有注册表的基本例子：

### 使用 TLS

下面是一些例子，显示在使用 TLS 时，你如何在每个节点上配置`/etc/rancher/rke2/registries.yaml`。

_有认证：_

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
    tls:
      cert_file: # path to the cert file used to authenticate to the registry
      key_file: # path to the key file for the certificate used to authenticate to the registry
      ca_file: # path to the ca file used to verify the registry's certificate
      insecure_skip_verify: # may be set to true to skip verifying the registry's certificate
```

_没有认证：_

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    tls:
      cert_file: # path to the cert file used to authenticate to the registry
      key_file: # path to the key file for the certificate used to authenticate to the registry
      ca_file: # path to the ca file used to verify the registry's certificate
      insecure_skip_verify: # may be set to true to skip verifying the registry's certificate
```

### 不使用 TLS

下面是一些例子，显示了当不使用 TLS 时，你如何在每个节点上配置`/etc/rancher/rke2/registries.yaml`。

_有认证的 HTTP：_

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
```

_无认证的 HTTP：_

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
```

> 如果使用不带 TLS 的明文 HTTP 的注册表，你需要指定`http://`作为 endpoint URI 方案，否则将默认为`https://`。

为了使注册表的改变生效，你需要在节点上启动 RKE2 之前配置这个文件，或者在每个配置的节点上重启 RKE2。
