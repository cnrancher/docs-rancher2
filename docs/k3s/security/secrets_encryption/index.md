---
title: Secret 加密
---

## Secret 加密配置

_从 v1.17.4+k3s1 开始可用_

K3s 支持通过在 server 上传递标志`--secrets-encryption`来启用 Secret 加密；该标志将自动完成以下工作:

- 生成 AES-CBC 密钥
- 用生成的密钥生成一个加密配置文件
- 将该配置作为 encryption-provider-config 传递给 KubeAPI

加密配置文件的例子:

```
{
  "kind": "EncryptionConfiguration",
  "apiVersion": "apiserver.config.k8s.io/v1",
  "resources": [
    {
      "resources": [
        "secrets"
      ],
      "providers": [
        {
          "aescbc": {
            "keys": [
              {
                "name": "aescbckey",
                "secret": "xxxxxxxxxxxxxxxxxxx"
              }
            ]
          }
        },
        {
          "identity": {}
        }
      ]
    }
  ]
}
```

## Secret 加密工具

_从 v1.21.8+k3s1 起可用_

K3s 包含一个实用工具 `secrets-encrypt`，它可以自动控制以下内容:

- 禁用/启用 Secret 加密功能
- 添加新的加密密钥
- 轮换和删除加密密钥
- 重新加密 Secret

> **警告：**如果不按照正确的方式轮换加密密钥，可能会使你的集群永久损坏。请慎重行事。

## 单节点 server 加密密钥轮换

要在一个单节点集群上轮换 Secret 加密密钥：

#### 使用标志 `--secrets-encryption` 启动 K3s server

> **注意：**目前不支持在没有加密的情况下启动 K3s，并且以后再启用加密

1. 准备

   ```
   k3s secrets-encrypt prepare
   ```

2. 杀死并以相同的参数重新启动 K3s server
3. 轮换

   ```
   k3s secrets-encrypt rotate
   ```

4. 杀死并以相同的参数重新启动 K3s server
5. 重新加密

   ```
   k3s secrets-encrypt reencrypt
   ```

## 高可用加密密钥轮换

嵌入式数据库和外部数据库集群的步骤都是一样的。

要在 HA 上轮换 Secret 的加密密钥：

> **_注意：_**
>
> - 目前不支持在没有加密的情况下启动 K3s，并且以后再启用加密
>
> - 虽然不是必须的，但建议你选择一个 server 节点来运行 `secrets-encrypt` 命令。

#### 用 `--secrets-encryption` 标志启动所有三个 K3s server。为简单起见，这些 server 将被称为 S1、S2、S3

1. 在 S1 上做准备

   ```
   k3s secrets-encrypt prepare
   ```

2. 杀死并以相同的参数重新启动 S1
3. 一旦 S1 启动，杀死并重新启动 S2 和 S3

4. 在 S1 上进行轮换

   ```
   k3s secrets-encrypt rotate
   ```

5. 杀死并以相同的参数重新启动 S1
6. 一旦 S1 启动，杀死并重新启动 S2 和 S3

7. 在 S1 上重新加密

   ```
   k3s secrets-encrypt reencrypt
   ```

8. 杀死并以相同的参数重新启动 S1
9. 一旦 S1 启动，杀死并重新启动 S2 和 S3

## 单节点 Secret 加密的禁用/启用

在启动带有 `--secrets-encryption` 标志的 server 后，可以禁用 secrets 加密。

要在一个单节点集群上禁用 Secret 加密：

1. 禁用

   ```
   k3s secrets-encrypt disable
   ```

2. 杀死并重新启动 K3s server，参数相同

3. 用标志重新加密

   ```
   k3s secrets-encrypt reencrypt --force --skip
   ```

要在一个单节点集群上重新启用 Secret 加密:

1. 启用

   ```
   k3s secrets-encrypt enable
   ```

2. 杀死并以相同的参数重新启动 K3s server

3. 使用标志重新加密

   ```
   k3s secrets-encrypt reencrypt --force --skip
   ```

## 高可用 Secret 加密的禁用/启用

在使用 `--secrets-encryption` 标志启动 HA 集群后，可以禁用 Secret 加密。

> **注意：**虽然不是必须的，但建议你选择一个 server 节点来运行 `secrets-encrypt` 命令。

为简单起见，本指南中使用的三个 server 将被称为 S1、S2、S3。

要在一个 HA 集群上禁用 Secret 加密：

1. 在 S1 上禁用

   ```
   k3s secrets-encrypt disable
   ```

2. 杀死并以相同的参数重新启动 S1
3. 一旦 S1 启动，杀死并重新启动 S2 和 S3

4. 用 S1 上的标志重新加密

   ```
   k3s secrets-encrypt reencrypt --force --skip
   ```

要在一个 HA 集群上重新启用 Secret 加密：

1. 在 S1 上启用

   ```
   k3s secrets-encrypt enable
   ```

2. 杀死并以相同的参数重新启动 S1
3. 一旦 S1 启动，杀死并重新启动 S2 和 S3

4. 用 S1 上的标志重新加密

   ```
   k3s secrets-encrypt reencrypt --force --skip
   ```

## Secret 加密状态

secrets-encrypt 工具包括一个 `status` 命令，显示节点上 Secret 加密的当前状态的信息。

单节点 server 上的命令示例：

```
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey
```

HA 集群上的另一个示例，在轮换密钥之后，但在重新启动 server 之前：

```
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: rotate
Server Encryption Hashes: hash does not match between node-1 and node-2

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey-2021-12-10T22:54:38Z
        AES-CBC   aescbckey

```

各部分的详细信息如下：

- **Encryption Status**：显示节点上的 Secret 加密是否被禁用或启用
- **Current Rotation Stage**：表示节点当前的轮换阶段。
  阶段有：`start`, `prepare`, `rotate`, `reencrypt_request`, `reencrypt_active`, `reencrypt_finished`。
- **Server Encryption Hashes**：对 HA 集群很有用，这表明所有 server 的本地文件是否处于同一阶段。这可以用来确定在进行下一阶段之前是否需要重新启动 server。在上面的 HA 例子中，node-1 和 node-2 有不同的哈希值，表明它们目前没有相同的加密配置。重新启动 server 将同步它们的配置。
- **Key Table**：汇总有关在节点上找到的 Secret 加密密钥的信息。
  - **Active**：如果有的话，"\*"表示哪些密钥目前被用于 Secret 加密。Kubernetes 会使用一个激活的密钥来加密任何新的 Secret。
  - **Key Type**：所有使用此工具的密钥都是 `AES-CBC` 类型。参见更多信息[这里。](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)
  - **Name**: 加密密钥的名称。
