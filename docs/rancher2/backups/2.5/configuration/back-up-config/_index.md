---
title: 备份配置
description: description
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

通过Backup Create页面，您可以配置计划、启用加密和指定备份的存储位置。

![How it works](/img/rancher/backup_restore/backup/backup.png)

- [定时调度](#定时调度)
- [加密](#加密)
- [存储位置](#存储位置)
  - [S3](#s3)
  - [S3存储配置示例](#s3存储配置示例)
  - [MinIO配置示例](#minio配置示例)
  - [CredentialSecret 示例](#credentialsecret-示例)
  - [EC2节点访问S3的IAM权限设置](#ec2节点访问s3的iam权限设置)
- [示例](#示例)

## 定时调度

选择第一个选项可执行一次性备份，或选择第二个选项可安排定期备份。选择**定期备份**可让您配置以下两个字段：

- **定时调度**: 该字段接受
  - 标准 [cron 表达式](https://en.wikipedia.org/wiki/Cron), 如 `"0 * * * *"`
  - 描述符, 如 `"@midnight"` 或 `"@every 1h30m"`
- **备份保留数量**: 指定必须保留多少个备份文件。如果文件超过给定的 retentionCount，最旧的文件将被删除。默认值为 10。

![](/img/rancher/backup_restore/backup/schedule.png)

| YAML指令名称 | 说明                                               |
| ------------------- | --------------------------------------------------------- |
| `schedule`          | 提供用于调度定期备份的 cron 字符串。 |
| `retentionCount`    | 提供要保留的备份文件数量。        |

## 加密

rancher-backup通过调用kube-apiserver来收集资源。apiserver返回的对象会被解密，所以即使启用了[加密静止状态](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)，备份收集的加密对象也会是明文。

为避免以明文形式存储它们，您可以使用静态加密的相同 encryptionConfig 文件，对备份中的某些资源进行加密。

:::important 重要：
你必须保存encryptionConfig文件，因为它不会被rancher-backup operator保存。执行还原时需要使用相同的加密文件。
:::

Operator将这个encryptionConfig用作Kubernetes Secret，Secret必须在operator的命名空间中。Rancher在 `cattle-resources-system` 命名空间中安装了 `rancher-backup` operator，所以在该命名空间中创建这个encryptionConfig secret。

对于 `EncryptionConfiguration`，你可以使用[Kubernetes文档中提供的示例文件。](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)

要创建Secret，加密配置文件必须命名为`encryption-provider-config.yaml`，并且必须使用`--from-file`标志来创建这个secret。

将 `EncryptionConfiguration` 保存在名为 `encryption-provider-config.yaml` 的文件中，并运行此命令：

```
kubectl create secret generic encryptionconfig \
  --from-file=./encryption-provider-config.yaml \
  -n cattle-resources-system
```

这将确保secret中包含一个名为`encryption-provider-config.yaml`的密钥，operator将使用这个密钥来获取加密配置。

`加密配置秘钥` 下拉菜单将过滤出并仅列出那些拥有此确切密钥的secrets。

![](/img/rancher/backup_restore/backup/encryption.png)

在上面的示例命令中，`encryptionconfig` 这个名字可以改成任何东西。

| YAML指令名称          | 说明                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `encryptionConfigSecretName` | 提供 `cattle-resources-system` 命名空间中包含加密配置文件的secret名称。 |

## 存储位置

![storageLocation](/img/rancher/backup_restore/backup/storageLocation.png)

如果在备份中指定了存储位置，operator将从特定的S3桶中检索备份位置。如果没有指定，operator将尝试在默认的operator级别的S3存储和operator级别的PVC存储中找到这个文件。默认的存储位置是在部署`rancher-backup` operator时配置的。

选择第一个选项可以将备份存储在安装rancher-backup chart时配置的存储位置。第二个选项可以让您配置不同的兼容s3的对象存储作为存储位置。

### S3

S3存储位置包含以下配置字段：

1. **秘钥凭证** (可选)：如果你需要使用AWS Access keys 和 Secret keys访问s3桶，请使用带有密钥以及指令`accessKey`和`secretKey`的凭证创建密钥，它可以是在任何命名空间。[这里](#credentialsecret-示例)有一个示例secret。如果运行operator的节点在EC2中，并且设置了IAM权限，允许它们访问S3，则此指令是不必要的，如[本节所述.](#ec2节点访问s3的iam权限设置)
1. **桶名称**: 存储备份文件的S3桶的名称。
1. **区域** (可选)：S3 桶所在的AWS [region](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。配置 MinIO 时不需要该字段。
1. **文件夹** (可选)：S3桶中存储备份文件的文件夹名称。
1. **端点**: 用于访问存储桶区域中的S3的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。
1. **端点 CA** （可选）：这应该是Base64编码的CA证书。有关示例，请参阅[示例S3兼容配置](#s3存储配置示例)。
1. **跳过 TLS 验证** (可选)：如果你不使用TLS，则设置为 "true"。

| YAML指令名称         | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Required |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `credentialSecretName`      | 如果你需要使用AWS Access keys Secret keys来访问s3 桶，用你的凭证与keys和指令`accessKey`和`secretKey`创建一个secret。它可以在任何命名空间中，只要你在`credentialSecretNamespace`中提供该命名空间。一个secret的例子是[这里.](#credentialsecret-示例)如果运行你的operator的节点在EC2中，并且设置了IAM权限，允许他们访问S3，这个指令是不必要的，如[本节所述.](#ec2节点访问s3的iam权限设置) |          |
| `credentialSecretNamespace` | 包含访问S3的凭证的secret的命名空间。如果运行operator的节点在EC2中，并且设置了IAM权限，允许它们访问S3，则不需要此指令，如[本节所述。](#ec2节点访问s3的iam权限设置)                                                                                                                                                                                                                                                           |          |
| `bucketName`                | 存储备份文件的S3桶的名称。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | ✓        |
| `folder`                    | S3 桶中存储备份文件的文件夹名称。                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |          |
| `region`                    | S3 桶所在的AWS[区域](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)。                                                                                                                                                                                                                                                                                                                                                                                                                                    | ✓        |
| `endpoint`                  | 用于访问存储桶区域中的S3的[端点](https://docs.aws.amazon.com/general/latest/gr/s3.html)。                                                                                                                                                                                                                                                                                                                                                                                                                         | ✓        |
| `endpointCA`                | 这应该是Base64编码的CA证书。有关示例，请参阅[示例S3兼容配置。](#s3存储配置示例)                                                                                                                                                                                                                                                                                                                                                                                             |          |
| `insecureTLSSkipVerify`     | 如果你不使用TLS，则设置为true。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |          |

### S3存储配置示例

```yaml
s3:
  credentialSecretName: s3-creds
  credentialSecretNamespace: default
  bucketName: rancher-backups
  folder: rancher
  region: us-west-2
  endpoint: s3.us-west-2.amazonaws.com
```

### MinIO配置示例

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

### EC2节点访问S3的IAM权限设置

有两种方法可以设置`rancher-backup` operator使用S3作为备份的存储位置。

一种方法是在Backup自定义资源中配置`credentialSecretName`，它指的是可以访问S3的AWS凭证。

如果集群节点在Amazon EC2中，也可以通过给EC2节点分配IAM权限来设置S3访问，使其可以访问S3。

要允许节点访问S3，请按照[AWS文档](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-instance-access-s3-bucket/)中的说明为EC2创建一个IAM角色。当您向角色添加自定义策略时，添加以下权限，并将 `Resource` 替换为您的桶名：

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

在创建角色并将相应的实例配置文件附加 EC2 实例后，Backup自定义资源中的`credentialSecretName`指令可以留空。

## 示例

Backup自定义资源，请参考[本页面](./../../examples/_index#备份)