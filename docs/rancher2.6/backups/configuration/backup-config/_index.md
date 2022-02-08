---
title: 备份配置
shortTitle: 备份
weight: 1
---

你可以在备份创建页面配置调度，启用加密，并指定备份的存储位置。

- [调度](#schedule)
- [加密](#encryption)
- [存储位置](#storage-location)
   - [S3](#s3)
   - [S3 存储配置示例](#example-s3-storage-configuration)
   - [MinIO 配置示例](#example-minio-configuration)
   - [credentialSecret 示例](#example-credentialsecret)
   - [EC2 节点访问 S3 的 IAM 权限](#iam-permissions-for-ec2-nodes-to-access-s3)
- [示例](#examples)

## 调度

选择第一个选项来执行一次性备份，或选择第二个选项来安排定期备份。选择**定期备份**后，你可以配置以下两个字段：

- **调度**：该字段支持
   - 标准 [cron 表达式](https://en.wikipedia.org/wiki/Cron)，例如 `"0 * * * *"`
   - 描述符，例如 `"@midnight"` 或 `"@every 1h30m"`
- **保留数量**：指定必须保留的备份文件数量。如果文件数量超过 `retentionCount` 设置的值，最旧的文件将被删除。默认值为 10。

| YAML 指令名称 | 描述 |
| ---------------- | ---------------- |
| `schedule` | 提供用于调度定期备份的 cron 字符串。 |
| `retentionCount` | 提供要保留的备份文件数量。 |

## 加密

rancher-backup 通过调用 kube-apiserver 来收集资源。apiserver 返回的对象会被解密，所以即使启用了[静态加密](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)，备份收集的加密对象也会是明文。

为避免以明文形式存储资源，你可以使用静态加密使用的同一个 encryptionConfig 文件，对备份中的特定资源进行加密。

> **重要提示**：`rancher-backup` operator 不会保存 encryptionConfig 文件，因此请自行保存该文件。
> 执行还原时需要使用同一个 encryptionFile。

Operator 将这个 encryptionConfig 用作 Kubernetes 密文，该密文必须在 operator 的命名空间中。Rancher 将 `rancher-backup` operator 安装到 `cattle-resources-system` 命名空间中。因此，请在该命名空间中创建这个 encryptionConfig 密文。

对于 `EncryptionConfiguration`，你可以使用 [Kubernetes 文档中提供的示例](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)。

要创建密文，加密配置文件必须命名为 `encryption-provider-config.yaml`，而且必须使用 `--from-file` 标志来创建这个密文。

将 `EncryptionConfiguration` 保存到名为 `encryption-provider-config.yaml` 的文件中，并运行以下命令：

```
kubectl create secret generic encryptionconfig \
  --from-file=./encryption-provider-config.yaml \
  -n cattle-resources-system
```

这将确保密文包含一个名为 `encryption-provider-config.yaml` 的 key，而且 operator 会使用该 key 来获取加密配置。

`加密配置密文` 下拉菜单将过滤并仅列出拥有这个 key 的密文。

{{< img "/img/rancher/backup_restore/backup/encryption.png" "">}}

在上面的示例命令中，`encryptionconfig` 这个名称可以任意修改。


| YAML 指令名称 | 描述 |
| ---------------- | ---------------- |
| `encryptionConfigSecretName` | 提供 `cattle-resources-system` 命名空间中包含加密配置文件的密文的名称。 |

## 存储位置

如果在备份中指定了 `StorageLocation`，operator 将从该特定的 S3 存储桶中检索备份位置。如果没有指定，operator 将尝试在默认 operator 级别的 S3 存储和 operator 级别的 PVC 存储中查找这个文件。默认存储位置是在部署 `rancher-backup` operator 时配置的。

如果你选择第一个选项，备份将存储在安装 rancher-backup Chart 时配置的存储位置中。如果你选择第二个选项，你可以配置不同的兼容 S3 的对象存储作为备份存储位置。

### S3

S3 存储位置包含以下配置字段：

1. **凭证密文**（可选）：如果你需要使用 AWS 访问密钥（access key）和密文密钥（secret key）来访问 S3 存储桶，请使用带有密钥和指令 `accessKey` 和 `secretKey` 的凭证来创建密文。它可以是任意一个命名空间。你可以点击[此处](#example-credentialsecret)查看示例密文。如果运行 operator 的节点在 EC2 中，并且设置了允许它们访问 S3 的 IAM 权限，则此指令是不必要的（如[本节](#iam-permissions-for-ec2-nodes-to-access-s3)所述）。凭证密文下拉菜单列出了所有命名空间的密文。
1. **存储桶名称**：存储备份文件的 S3 存储桶的名称。
1. **区域**（可选）：S3 存储桶所在的 AWS [区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。配置 MinIO 时不需要该字段。
1. **文件夹**（可选）：S3 存储桶中存储备份文件的文件夹名称。不支持嵌套文件夹（例如， `rancher/cluster1`）。
1. **端点**：用于访问存储桶区域中的 S3 的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。
1. **端点 CA**（可选）：Base64 编码的 CA 证书。如需获取示例，请参见 [S3 兼容配置示例](#example-s3-storage-configuration)。
1. **跳过 TLS 验证**（可选）：如果你不使用 TLS，则设置为 `true`。


| YAML 指令名称 | 描述 | 是否必填 |
| ---------------- | ---------------- | ------------ |
| `credentialSecretName` | 如果你需要使用 AWS 访问密钥（access key）和密文密钥（secret key）来访问 S3 存储桶，请使用带有密钥和指令 `accessKey` 和 `secretKey` 的凭证来创建密文。它可以在任何命名空间中，只要你在 `credentialSecretNamespace` 中提供该命名空间。点击[这里](#example-credentialsecret)查看示例密文。如果运行 operator 的节点在 EC2 中，并且设置了允许它们访问 S3 的 IAM 权限，则此指令是不必要的（如[本节](#iam-permissions-for-ec2-nodes-to-access-s3)所述）。 |  |
| `credentialSecretNamespace` | 包含访问 S3 的凭证的密文的命名空间。如果运行 operator 的节点在 EC2 中，并且设置了允许它们访问 S3 的 IAM 权限，则此指令是不必要的（如[本节](#iam-permissions-for-ec2-nodes-to-access-s3)所述）。 |  |
| `bucketName` | 存储备份文件的 S3 存储桶的名称。 | ✓ |
| `folder` | S3 存储桶中存储备份文件的文件夹名称。不支持嵌套文件夹（例如， `rancher/cluster1`）。 | |
| `region` | S3 存储桶所在的 AWS [区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。 | ✓ |
| `endpoint` | 用于访问存储桶区域中的 S3 的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。 | ✓ |
| `endpointCA` | Base64 编码的 CA 证书。如需获取示例，请参见 [S3 兼容配置示例](#example-s3-storage-configuration)。 |  |
| `insecureTLSSkipVerify` | 如果你不使用 TLS，则设置为 `true`。 | |

### S3 存储配置示例

```yaml
s3:
  credentialSecretName: s3-creds
  credentialSecretNamespace: default
  bucketName: rancher-backups
  folder: rancher
  region: us-west-2
  endpoint: s3.us-west-2.amazonaws.com
```

### MinIO 配置示例

```yaml
s3:
  credentialSecretName: minio-creds
  bucketName: rancherbackups
  endpoint: minio.35.202.130.254.xip.io
  endpointCA: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURHakNDQWdLZ0F3SUJBZ0lKQUtpWFZpNEpBb0J5TUEwR0NTcUdTSWIzRFFFQkN3VUFNQkl4RURBT0JnTlYKQkFNTUIzUmxjM1F0WTJFd0hoY05NakF3T0RNd01UZ3lOVFE1V2hjTk1qQXhNREk1TVRneU5UUTVXakFTTVJBdwpEZ1lEVlFRRERBZDBaWE4wTFdOaE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBCjA4dnV3Q2Y0SEhtR2Q2azVNTmozRW5NOG00T2RpS3czSGszd1NlOUlXQkwyVzY5WDZxenBhN2I2M3U2L05mMnkKSnZWNDVqeXplRFB6bFJycjlpbEpWaVZ1NFNqWlFjdG9jWmFCaVNsL0xDbEFDdkFaUlYvKzN0TFVTZSs1ZDY0QQpWcUhDQlZObU5xM3E3aVY0TE1aSVpRc3N6K0FxaU1Sd0pOMVVKQTZ6V0tUc2Yzc3ByQ0J2dWxJWmZsVXVETVAyCnRCTCt6cXZEc0pDdWlhNEEvU2JNT29tVmM2WnNtTGkwMjdub3dGRld3MnRpSkM5d0xMRE14NnJoVHQ4a3VvVHYKQXJpUjB4WktiRU45L1Uzb011eUVKbHZyck9YS2ZuUDUwbk8ycGNaQnZCb3pUTStYZnRvQ1d5UnhKUmI5cFNTRApKQjlmUEFtLzNZcFpMMGRKY2sxR1h3SURBUUFCbzNNd2NUQWRCZ05WSFE0RUZnUVU5NHU4WXlMdmE2MTJnT1pyCm44QnlFQ2NucVFjd1FnWURWUjBqQkRzd09ZQVU5NHU4WXlMdmE2MTJnT1pybjhCeUVDY25xUWVoRnFRVU1CSXgKRURBT0JnTlZCQU1NQjNSbGMzUXRZMkdDQ1FDb2wxWXVDUUtBY2pBTUJnTlZIUk1FQlRBREFRSC9NQTBHQ1NxRwpTSWIzRFFFQkN3VUFBNElCQVFER1JRZ1RtdzdVNXRQRHA5Q2psOXlLRW9Vd2pYWWM2UlAwdm1GSHpubXJ3dUVLCjFrTkVJNzhBTUw1MEpuS29CY0ljVDNEeGQ3TGdIbTNCRE5mVVh2anArNnZqaXhJYXR2UWhsSFNVaWIyZjJsSTkKVEMxNzVyNCtROFkzelc1RlFXSDdLK08vY3pJTGh5ei93aHRDUlFkQ29lS1dXZkFiby8wd0VSejZzNkhkVFJzNwpHcWlGNWZtWGp6S0lOcTBjMHRyZ0xtalNKd1hwSnU0ZnNGOEcyZUh4b2pOKzdJQ1FuSkg5cGRIRVpUQUtOL2ppCnIvem04RlZtd1kvdTBndEZneWVQY1ZWbXBqRm03Y0ZOSkc4Y2ZYd0QzcEFwVjhVOGNocTZGeFBHTkVvWFZnclMKY1VRMklaU0RJd1FFY3FvSzFKSGdCUWw2RXBaUVpWMW1DRklrdFBwSQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0t
```
### credentialSecret 示例

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: creds
type: Opaque
data:
  accessKey: <Enter your base64-encoded access key>
  secretKey: <Enter your base64-encoded secret key>
```

### EC2 节点访问 S3 的 IAM 权限

有两种方法可以设置 `rancher-backup` operator 来使用 S3 作为备份存储位置。

一种方法是在 Backup 自定义资源中配置 `credentialSecretName`（即可以访问 S3 的 AWS 凭证）。

如果集群节点在 Amazon EC2 中，你也可以给 EC2 节点分配 IAM 权限，使其可以访问 S3。

要允许节点访问 S3，请按照 [AWS 文档](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-instance-access-s3-bucket/)中的说明，为 EC2 创建一个 IAM 角色。在向角色添加自定义策略时，添加以下权限，并将 `Resource` 替换为你的存储桶名称：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
     "Resource": [
        "arn:aws:s3:::rancher-backups"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": [
         "arn:aws:s3:::rancher-backups/*"
      ]
    }
  ]
}
```

在创建角色并将相应的实例配置文件附加 EC2 实例后，Backup 自定义资源中的 `credentialSecretName` 指令可以留空。

## 示例

如需获取 Backup 自定义资源的示例，请参见[本页](../../examples/#backup)。
