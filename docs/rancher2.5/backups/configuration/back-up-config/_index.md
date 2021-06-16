---
title: 备份配置
description: 通过 Backup Create 页面，您可以配置计划、启用加密和指定备份的存储位置。
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
  - 备份与恢复
  - rancher2.5
  - 备份配置
---

通过 Backup Create 页面，您可以配置计划、启用加密和指定备份的存储位置。

![How it works](/img/rancher/backup_restore/backup/backup.png)

## 定时调度

选择第一个选项可执行一次性备份，或选择第二个选项可安排定期备份。选择**定期备份**可让您配置以下两个字段：

- **定时调度**： 该字段接受
  - 标准 [cron 表达式](https://en.wikipedia.org/wiki/Cron), 如 `"0 * * * *"`
  - 描述符，如 `"@midnight"` 或 `"@every 1h30m"`
- **备份保留数量**： 指定必须保留多少个备份文件。如果文件超过给定的 retentionCount，最旧的文件将被删除。默认值为 10。

![](/img/rancher/backup_restore/backup/schedule.png)

| YAML 指令名称    | 说明                                 |
| :--------------- | :----------------------------------- |
| `schedule`       | 提供用于调度定期备份的 cron 字符串。 |
| `retentionCount` | 提供要保留的备份文件数量。           |

## 加密

rancher-backup 通过调用 kube-apiserver 来收集资源。apiserver 返回的对象会被解密，所以即使启用了[加密静止状态](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)，备份收集的加密对象也会是明文。

为避免以明文形式存储它们，您可以使用静态加密的相同 encryptionConfig 文件，对备份中的某些资源进行加密。

:::important 重要
你必须保存 encryptionConfig 文件，因为它不会被 rancher-backup operator 保存。执行还原时需要使用相同的加密文件。
:::

Operator 将这个 encryptionConfig 用作 Kubernetes Secret，Secret 必须在 operator 的命名空间中。Rancher 在 `cattle-resources-system` 命名空间中安装了 `rancher-backup` operator，所以在该命名空间中创建这个 encryptionConfig secret。

对于 `EncryptionConfiguration`，你可以使用[Kubernetes 文档中提供的示例文件](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)。

要创建 Secret，加密配置文件必须命名为`encryption-provider-config.yaml`，并且必须使用`--from-file`标志来创建这个 secret。

将 `EncryptionConfiguration` 保存在名为 `encryption-provider-config.yaml` 的文件中，并运行此命令：

```bash
kubectl create secret generic encryptionconfig \
  --from-file=./encryption-provider-config.yaml \
  -n cattle-resources-system
```

这将确保 secret 中包含一个名为`encryption-provider-config.yaml`的密钥，operator 将使用这个密钥来获取加密配置。

`加密配置秘钥` 下拉菜单将过滤出并仅列出那些拥有此确切密钥的 secrets。

![](/img/rancher/backup_restore/backup/encryption.png)

在上面的示例命令中，`encryptionconfig` 这个名字可以改成任何东西。

| YAML 指令名称                | 说明                                                                      |
| :--------------------------- | :------------------------------------------------------------------------ |
| `encryptionConfigSecretName` | 提供 `cattle-resources-system` 命名空间中包含加密配置文件的 secret 名称。 |

## 存储位置

![storageLocation](/img/rancher/backup_restore/backup/storageLocation.png)

如果在备份中指定了存储位置，operator 将从特定的 S3 桶中检索备份位置。如果没有指定，operator 将尝试在默认的 operator 级别的 S3 存储和 operator 级别的 PVC 存储中找到这个文件。默认的存储位置是在部署`rancher-backup` operator 时配置的。

选择第一个选项可以将备份存储在安装 rancher-backup chart 时配置的存储位置。第二个选项可以让您配置不同的兼容 s3 的对象存储作为存储位置。

### S3

S3 存储位置包含以下配置字段：

1. **秘钥凭证** (可选)：如果你需要使用 AWS Access keys 和 Secret keys 访问 s3 桶，请使用带有密钥以及指令`accessKey`和`secretKey`的凭证创建密钥，它可以是在任何命名空间。[这里](#credentialsecret-示例)有一个示例 secret。如果运行 operator 的节点在 EC2 中，并且设置了 IAM 权限，允许它们访问 S3，则此指令是不必要的，如[本节所述](#ec2节点访问s3的iam权限设置)。秘钥凭证下拉菜单列出了所有命名空间的秘钥。
1. **桶名称**: 存储备份文件的 S3 桶的名称。
1. **区域** (可选)：S3 桶所在的 AWS [region](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。配置 MinIO 时不需要该字段。
1. **文件夹** (可选)：S3 桶中存储备份文件的文件夹名称。
1. **端点**: 用于访问存储桶区域中的 S3 的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。
1. **端点 CA** （可选）：这应该是 Base64 编码的 CA 证书。有关示例，请参阅[示例 S3 兼容配置](#s3存储配置示例)。
1. **跳过 TLS 验证** (可选)：如果你不使用 TLS，则设置为 "true"。

| YAML 指令名称               | 说明                                                                                                                                                                                                                                                                                                                                                                                                  | 是否必填 |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `credentialSecretName`      | 如果你需要使用 AWS Access keys Secret keys 来访问 s3 桶，用你的凭证与 keys 和指令`accessKey`和`secretKey`创建一个 secret。它可以在任何命名空间中，只要你在`credentialSecretNamespace`中提供该命名空间。一个 secret 的例子是[这里.](#credentialsecret-示例)如果运行你的 operator 的节点在 EC2 中，并且设置了 IAM 权限，允许他们访问 S3，这个指令是不必要的，如[本节所述.](#ec2节点访问s3的iam权限设置) | 否       |
| `credentialSecretNamespace` | 包含访问 S3 的凭证的 secret 的命名空间。如果运行 operator 的节点在 EC2 中，并且设置了 IAM 权限，允许它们访问 S3，则不需要此指令，如[本节所述。](#ec2节点访问s3的iam权限设置)                                                                                                                                                                                                                          | 否       |
| `bucketName`                | 存储备份文件的 S3 桶的名称。                                                                                                                                                                                                                                                                                                                                                                          | 是       |
| `folder`                    | S3 桶中存储备份文件的文件夹名称。                                                                                                                                                                                                                                                                                                                                                                     | 否       |
| `region`                    | S3 桶所在的 AWS[区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。                                                                                                                                                                                                                                                                                                           | 是       |
| `endpoint`                  | 用于访问存储桶区域中的 S3 的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。                                                                                                                                                                                                                                                                                                           | 是       |
| `endpointCA`                | 这应该是 Base64 编码的 CA 证书。有关示例，请参阅[示例 S3 兼容配置。](#s3存储配置示例)                                                                                                                                                                                                                                                                                                                 | 否       |
| `insecureTLSSkipVerify`     | 如果你不使用 TLS，则设置为 true。                                                                                                                                                                                                                                                                                                                                                                     | 否       |

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

### CredentialSecret 示例

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: creds
type: Opaque
data:
  accessKey: <Enter your access key>
  secretKey: <Enter your secret key>
```

请运行以下代码，使用 base64 在 YAML 文件中对密钥进行加密：

```
echo -n "your_key" |base64
```

### EC2 节点访问 S3 的 IAM 权限设置

有两种方法可以设置`rancher-backup` operator 使用 S3 作为备份的存储位置。

一种方法是在 Backup 自定义资源中配置`credentialSecretName`，它指的是可以访问 S3 的 AWS 凭证。

如果集群节点在 Amazon EC2 中，也可以通过给 EC2 节点分配 IAM 权限来设置 S3 访问，使其可以访问 S3。

要允许节点访问 S3，请按照[AWS 文档](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-instance-access-s3-bucket/)中的说明为 EC2 创建一个 IAM 角色。当您向角色添加自定义策略时，添加以下权限，并将 `Resource` 替换为您的桶名：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::rancher-backups"]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": ["arn:aws:s3:::rancher-backups/*"]
    }
  ]
}
```

在创建角色并将相应的实例配置文件附加 EC2 实例后，Backup 自定义资源中的`credentialSecretName`指令可以留空。

## 示例

Backup 自定义资源，请参考[本页面](/docs/rancher2.5/backups/examples/_index)
