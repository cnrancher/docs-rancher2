---
title: 将Rancher迁移到新集群
description: 如果你要将 Rancher 迁移到一个新的 Kubernetes 集群，你不需要先在新集群上安装 Rancher。如果将 Rancher 还原到一个已经安装了 Rancher 的新集群上，可能会引起问题。
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
  - 备份和恢复
  - rancher 2.5
  - 将Rancher迁移到新集群
---

如果你要将 Rancher 迁移到一个新的 Kubernetes 集群，你不需要先在新集群上安装 Rancher。如果将 Rancher 还原到一个已经安装了 Rancher 的新集群上，可能会引起问题。

### 先决条件

这些说明假设你已经[创建了一个备份](/docs/rancher2.5/backups/2.5/back-up-rancher/_index)，并且已经安装了将在其中部署 Rancher 的新 Kubernetes 集群。

要求使用与第一个集群中设置的服务器 URL 相同的 hostname。

Rancher 版本必须是 v2.5.0 及以上。

Rancher 可以安装在任何 Kubernetes 集群上，包括托管的 Kubernetes 集群，如 Amazon EKS 集群。有关安装 Kubernetes 的帮助，请参考 Kubernetes 发行版的文档。也可以使用 Rancher 的 Kubernetes 发行版之一：

- [RKE Kubernetes 安装文档](/docs/rancher2.5/installation_new/_index)
- [K3s Kubernetes 安装文档](/docs/k3s/installation/_index)

### 1. 安装 rancher-backup Helm chart

```
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install rancher-backup-crd rancher-charts/rancher-backup-crd -n cattle-resources-system --create-namespace
helm install rancher-backup rancher-charts/rancher-backup -n cattle-resources-system
```

### 2. 使用 Restore 自定义资源从备份中还原

如果你使用 S3 存储作为备份源，并且需要使用你的 S3 凭证进行还原，请使用你的 S3 凭证在这个集群中创建一个 Secret。Secret 数据必须有两个 key，`accessKey`和`secretKey`，包含 s3 凭证，像这样：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: s3-creds
type: Opaque
data:
  accessKey: <Enter your access key>
  secretKey: <Enter your secret key>
```

这个 secret 可以在任何命名空间中创建，上面的例子中，它将在默认的命名空间中创建。

在 Restore 自定义资源中，`prune`必须设置为 false。

创建一个像下面例子一样的 Restore 自定义资源：

```yaml
# migrationResource.yaml
apiVersion: resources.cattle.io/v1
kind: Restore
metadata:
  name: restore-migration
spec:
  backupFilename: backup-b0450532-cee1-4aa1-a881-f5f48a007b1c-2020-09-15T07-27-09Z.tar.gz
  prune: false
  encryptionConfigSecretName: encryptionconfig
  storageLocation:
    s3:
      credentialSecretName: s3-creds
      credentialSecretNamespace: default
      bucketName: backup-test
      folder: ecm1
      region: us-west-2
      endpoint: s3.us-west-2.amazonaws.com
```

:::important 重要：
只有在创建备份时启用了加密功能时，才必须设置 `encryptionConfigSecretName` 字段。提供包含加密配置文件的 Secret 名称。如果您只有加密配置文件，但在此集群中没有用它创建的 Secret，请使用以下步骤创建 secret:
:::

1. 加密配置文件必须命名为`encryption-provider-config.yaml`，并且必须使用`--from-file`标志来创建这个 secret。因此，将你的`EncryptionConfiguration`保存在一个名为`encryption-provider-config.yaml`的文件中，然后运行这个命令:

```
kubectl create secret generic encryptionconfig \
  --from-file=./encryption-provider-config.yaml \
  -n cattle-resources-system
```

然后应用资源:

```
kubectl apply -f migrationResource.yaml
```

### 3. 安装 cert-manager

按照文档中关于在 Kubernetes 上安装 cert-manager 的步骤[安装 cert-manager](/docs/rancher2.5/installation_new/resources/advanced/helm2/helm-rancher/_index#5-install-cert-manager)。

### 4. 使用 helm 安装 rancher

使用与第一个集群上使用的相同版本的 Helm 来安装 Rancher。

```
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=<same hostname as the server URL from the first Rancher server> \
```
