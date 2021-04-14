---
title: 加密静态数据
description: 从 v0.3.1 版本开始，RKE 增加了对静止状态下密钥数据加密管理的支持。
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
  - 加密静态数据
---

从 v0.3.1 版本开始，RKE 增加了对静止状态下密钥数据加密管理的支持。

静止状态下的数据加密满足了以下需求：

- 合规性要求
- 附加安全层
- 降低等节点泄露的安全影响
- 降低等效文档备份的安全影响
- 能够使用外部密钥管理系统

RKE 为用户提供了两种配置路径来实现静态数据加密：

- 托管式静态数据加密
- 自定义配置，用于静态数据加密

这两个配置选项都可以在初始集群供应期间或通过更新现有集群来添加。

为了利用这个功能，在[Kubernetes API 服务配置](/docs/rke/config-options/services/_index)中添加了一个新的字段`secrets_encryption_config`。一个完整的自定义配置是这样的：

```yaml
services:
  kube-api:
    secrets_encryption_config:
      enabled: true
      custom_config:
        apiVersion: apiserver.config.k8s.io/v1
        kind: EncryptionConfiguration
        resources:
          - resources:
              - secrets
            providers:
              - aescbc:
                  keys:
                    - name: k-fw5hn
                      secret: RTczRjFDODMwQzAyMDVBREU4NDJBMUZFNDhCNzM5N0I=
              - identity: {}
```

## 托管式静态数据加密

在 Kubernetes 中启用和禁用静态数据加密是一个相对复杂的过程，需要 Kubernetes 集群管理员执行几个步骤。管理配置旨在减少这种开销，并提供一个简单的抽象层来管理这个过程。

### 启用加密功能

管理的静态数据加密默认是禁用的，可以通过使用以下配置启用。

```yaml
services:
  kube-api:
    secrets_encryption_config:
      enabled: true
```

启用后，RKE 将执行以下[操作](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#encrypting-your-data)以启用静态数据加密。

- 生成一个新的随机 32 位加密密钥。
- 使用新的密钥生成加密提供者配置文件，默认使用的[提供者](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)是`aescbc`。
- 将提供者配置文件部署到所有具有`controlplane`角色的节点上。
- 更新`kube-apiserver`容器参数，使其指向提供者配置文件。
- 重新启动`kube-apiserver`容器。

重新启动`kube-api server`后，数据加密被启用。但是，所有现有的密钥仍然以纯文本形式存储。RKE 将[重写](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted)所有密钥，以确保加密完全生效。

### 禁用加密功能

要禁用加密，可以将 "enabled "标志设置为 "false"，或者干脆从 cluster.yml 中完全删除 "secrets_encryption_config "块。

```yaml
services:
  kube-api:
    secrets_encryption_config:
      enabled: false
```

一旦在`cluster.yml`中禁用加密，RKE 将执行以下[动作](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#encrypting-your-data)来禁用集群中的加密。

- 生成一个新的 provider 配置文件，将不加密的`identity{}`provider 作为第一个 provider，并将之前的`aescbc`设置在第二个地方。这将允许 Kubernetes 使用第一个条目来写入密钥，而第二个条目来解密它们。
- 部署新的提供者配置并重启`kube-apiserver`。
- 重写所有密钥。这是必需的，因为此时，新的数据将以纯文本的形式写入磁盘，但现有的数据仍然使用旧的提供者进行加密。通过重写所有密钥，RKE 确保所有存储的数据都被解密。
- 更新`kube-apiserver`参数，删除加密提供者配置，重启`kube-apiserver`。
- 删除提供者配置文件。

## 轮换密钥

有时候，需要在您的集群中轮换加密配置。例如，密钥被泄露了，有两种方法可以轮换密钥：使用 RKE CLI 命令，或者在`cluster.yml`中禁用和重新启用加密。有两种方法可以轮换密钥：使用 RKE CLI 命令，或者在`cluster.yml`中禁用和重新启用加密。

### 使用 RKE CLI 命令轮换密钥

通过管理配置，RKE CLI 能够用一条命令执行[这里](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#rotating-a-decryption-key)中记载的键旋转过程。要执行这个操作，需要使用以下子命令。

```bash
$ ./rke encrypt rotate-key --help
NAME:
   rke encrypt rotate-key - Rotate cluster encryption provider key

USAGE:
   rke encrypt rotate-key [command options] [arguments...]

OPTIONS:
   --config value           Specify an alternate cluster YAML file (default: "cluster.yml") [$RKE_CONFIG]
   --ssh-agent-auth         Use SSH Agent Auth defined by SSH_AUTH_SOCK
   --ignore-docker-version  Disable Docker version check

```

该命令将执行以下操作。

- 生成一个新的随机 32 位加密密钥
- 生成一个新的提供者配置，新密钥作为第一提供者，第二密钥作为第二提供者。当密钥被重写时，第一把钥匙将在写操作时用于加密数据，而第二把钥匙（旧钥匙）将在读操作时用于解密存储的数据。
- 将新的提供者配置部署到所有`controlplane`节点，并重新启动`kube-apiserver`。
- 重写所有密钥。这个过程将用新的密钥重新加密所有的密钥。
- 更新配置以删除旧密钥并重启`kube-apiserver`。

### 编辑 cluster.yml 轮换密钥

对于启用了加密功能的集群，您可以通过更新`cluster.yml`来轮换加密密钥，如果您在`cluster.yml`中启用并重新启用了数据加密功能，RKE 将不会重复使用旧密钥。如果您在`cluster.yml`中启用并重新启用数据加密，RKE 将不会重复使用旧密钥。相反，它每次都会生成新的密钥，结果与使用 RKE CLI 进行密钥轮换的结果相同。

## 自定义静态数据加密配置

通过管理配置，RKE 为用户提供了一种非常简单的方式，以最小的交互和配置来启用和禁用加密。然而，它不允许对配置进行任何自定义。

通过自定义加密配置，RKE 允许用户提供自己的配置。虽然 RKE 会帮助用户部署配置，并在需要时重写密钥，但它并不代表用户提供配置验证。用户有责任确保自己的配置是有效的。

> **警告：**使用无效的加密提供者配置可能会导致您的集群出现一些问题，从崩溃 Kubernetes API 服务`kube-api`，到完全失去对加密数据的访问。

### 例子: 使用 Amazon KMS 的自定义加密配置

自定义配置的一个例子是启用外部密钥管理系统，如[Amazon KMS](https://aws.amazon.com/kms/)。以下是 AWS KMS 的配置实例。

```yaml
services:
  kube-api:
    extra_binds:
      - "/var/run/kmsplugin/:/var/run/kmsplugin/"
    secrets_encryption_config:
      enabled: true
      custom_config:
        apiVersion: apiserver.config.k8s.io/v1
        kind: EncryptionConfiguration
        resources:
          - resources:
              - secrets
            providers:
              - kms:
                  name: aws-encryption-provider
                  endpoint: unix:///var/run/kmsplugin/socket.sock
                  cachesize: 1000
                  timeout: 3s
              - identity: {}
```

AWS KMS 的文档可以在[这里](https://github.com/kubernetes-sigs/aws-encryption-provider)找到。当 "自定义配置 "设置为启用 AWS KMS 提供商时，您应该考虑以下几点。

- 由于 RKE 在容器中运行 "kube-api "服务，因此需要您使用 "extra_binds "功能将 KMS 提供者的 socket 位置绑定安装在 "kube-api "容器内。
- AWS KMS 提供者在集群中作为一个 pod 运行。因此，启用它的正确方法是。
  1. 在禁用静态加密的情况下部署您的集群。
  2. 部署 KMS pod，并确保其正确工作。
  3. 使用自定义加密配置更新您的集群，以利用 KMS 提供者。
- Kube API 使用 Unix 套接字连接到 KMS 提供者。您应该将您的 KMS 部署配置为在集群中的所有`controlplane`节点上运行 pods。
- 您的`controlplane`节点应该配置一个 AMI 配置文件，它可以访问您在配置中使用的 KMS 密钥。

### 如何预防轮换密钥后的还原故障

重要的是要明白，为您的集群启用加密意味着您不能再不使用您的加密密钥来访问您的 etcd 数据库和/或 etcd 数据库备份中的加密数据。

加密配置存储在集群状态文件`cluster.rkestate`中，它与 etcd 备份解耦。例如，在以下任何一种备份情况下，还原过程将失败。

- 快照是在启用加密时拍摄的，并在加密被禁用时恢复。在这种情况下，加密密钥不再存储在集群状态中。
- 快照是在旋转密钥之前采集的，并在之后尝试还原。在这种情况下，快照时用于加密的旧密钥不再存在于集群状态文件中。

因此，我们建议，当您启用或禁用加密时，或者当您旋转密钥时，您应该[创建快照](/docs/rke/etcd-snapshots/one-time-snapshots/_index)，以便您的备份需要您可以访问的相同密钥。

这也意味着您不应该在还原过程中轮换密钥，因为您会丢失`cluster.rkestate`中的加密密钥。

这同样适用于自定义配置用例，然而在这种情况下，它将取决于用户提供的加密配置。
