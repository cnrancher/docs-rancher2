---
title: Secret 加密
description: 本文介绍了 Secret 加密。
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
  - Secret 加密
---

## Secret 加密配置

RKE2 支持对 Secret 进行静态加密，并且会自动进行以下操作：

- 生成一个 AES-CBC 密钥
- 用生成的密钥生成一个加密配置文件：

```yaml
{
  "kind": "EncryptionConfiguration",
  "apiVersion": "apiserver.config.k8s.io/v1",
  "resources":
    [
      {
        "resources": ["secrets"],
        "providers":
          [
            {
              "aescbc":
                {
                  "keys":
                    [{ "name": "aescbckey", "secret": "xxxxxxxxxxxxxxxxxxx" }],
                },
            },
            { "identity": {} },
          ],
      },
    ],
}
```

- 将该配置作为 encryption-provider-config 传递给 Kubernetes APIServer

一旦启用，任何创建的 secret 都将用这个密钥进行加密。请注意，如果你禁用加密，那么任何加密的 secret 将无法读取，直到你使用相同的密钥再次启用加密。

## Secret 加密工具

_从 v1.21.8+rke2r1 起可用_

RKE2 包含一个实用的[子命令](/docs/rke2/subcommands/_index#secrets-encrypt) `secrets-encrypt`，它允许管理员执行以下任务：

- 添加新的加密密钥
- 轮换和删除加密密钥
- 重新加密 secret

> **警告：**在轮换 secret 加密密钥时，如果不遵循正确的程序，可能会导致永久性数据丢失。请慎重操作。

### 单节点 server 加密密钥轮换

要在单节点集群上轮换 secret 加密密钥：

1. Prepare：

   ```
   rke2 secrets-encrypt prepare
   ```

2. 重启 `kube-apiserver` pod:

   ```
   # Get the kube-apiserver container ID
   export CONTAINER_RUNTIME_ENDPOINT="unix:///var/run/k3s/containerd/containerd.sock"
   crictl ps --name kube-apiserver
   # Stop the pod
   crictl stop <CONTAINER_ID>
   ```

3. 轮换：

   ```
   rke2 secrets-encrypt rotate
   ```

4. 再次重启 `kube-apiserver` pod

5. 重新加密：

   ```
   rke2 secrets-encrypt reencrypt
   ```

### 多节点 server 加密密钥轮换

要在 HA 上轮换 secret 的加密密钥：

> **注意：**在这个例子中，3 台 server 节点被用于 HA 集群，被称为 S1、S2、S3。虽然不是必须的，但建议你选择一个 server 节点来运行 `secrets-encrypt` 命令。

1. 在 S1 上 prepare

   ```
   rke2 secrets-encrypt prepare
   ```

2. 依次重启 S1、S2、S3

   ```
   systemctl restart rke2-server.service
   ```

   等待 systemctl 命令返回，然后重新启动下一个 server。

3. 在 S1 上轮换

   ```
   rke2 secrets-encrypt rotate
   ```

4. 依次重启 S1、S2、S3

5. 在 S1 上重新加密

   ```
   rke2 secrets-encrypt reencrypt
   ```

   等到重新加密完成，可以通过 `journalctl -u rke2-server` 或者通过 `rke2 secrets-encrypt status` 查看日志。完成后，状态将返回 `reencrypt_finished`。

6. 依次重启 S1、S2、S3

### Secret 加密状态

`secrets-encrypt status` 子命令显示节点上 secret 加密的当前状态信息。

单节点 server 节点上的示例：

```
$ rke2 secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match
Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey
```

另一个关于 HA 集群的示例，在轮换密钥之后，但在重新启动 server 之前：

```
$ rke2 secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: rotate
Server Encryption Hashes: hash does not match between node-1 and node-2
Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey-2021-12-10T22:54:38Z
        AES-CBC   aescbckey
```

每个部分的细节如下：

- **Encryption Status**：显示节点上的 secret 加密是禁用还是启用
- **Current Rotation Stage**：显示节点上当前的轮转阶段。
  阶段有：`start`、`prepare`、`rotate`、`reencrypt_request`、`reencrypt_active`、`reencrypt_finished`
- **Server Encryption Hashes**：对 HA 集群有用，这表明所有 server 是否与其本地文件处于同一阶段。这可用于确定在进行下一阶段之前是否需要重新启动 server。在上面的 HA 示例中，node-1 和 node-2 具有不同的哈希值，表明它们当前没有相同的加密配置。重新启动 server 将同步它们的配置。
- **Key Table**：汇总有关在节点上找到的 secret 加密密钥的信息。

  - **Active**："\*" 表示当前用于 secret 加密的密钥（如果有）。 Kubernetes 使用活动密钥来加密任何新的 secret。
  - **Key Type**：RKE2 仅支持 `AES-CBC` 密钥类型。在[这里](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)查找更多信息。
  - **Name**：加密密钥的名称。
