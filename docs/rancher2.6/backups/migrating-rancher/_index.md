---
title: 将 Rancher 迁移到新集群
weight: 3
---

如果你要将 Rancher 迁移到一个新的 Kubernetes 集群，先不要在新集群上安装 Rancher。这是因为如果将 Rancher 还原到已安装 Rancher 的新集群，可能会导致问题。

### 前提

以下说明假设你已经完成[备份创建](../back-up-rancher)，并且已经安装了用于部署 Rancher 的新 Kubernetes 集群。

你需要使用与第一个集群中设置的 Server URL 相同的主机名。

Rancher 必须是 2.5.0 或更高版本。

Rancher 可以安装到任意 Kubernetes 集群上，包括托管的 Kubernetes 集群（如 Amazon EKS 集群）。如需获取安装 Kubernetes 的帮助，请参见 Kubernetes 发行版的文档。你也可以使用以下 Rancher 的 Kubernetes 发行版：

- [RKE Kubernetes 安装文档]({{<baseurl>}}/rke/latest/en/installation/)
- [K3s Kubernetes 安装文档]({{<baseurl>}}/k3s/latest/en/installation/)

### 1. 安装 rancher-backup Helm Chart
安装 rancher-backup Chart 的 2.x.x 版本。下面命令假设你的环境可以访问 DockerHub：
```
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install rancher-backup-crd rancher-charts/rancher-backup-crd -n cattle-resources-system --create-namespace --version $CHART_VERSION
helm install rancher-backup rancher-charts/rancher-backup -n cattle-resources-system --version $CHART_VERSION
```

如果是**离线环境**，在安装 `rancher-backup-crd` Helm Chart 时，使用以下选项从私有镜像仓库拉取 `backup-restore-operator` 镜像：
```
--set image.repository $REGISTRY/rancher/backup-restore-operator
```

### 2. 使用 Restore 自定义资源来还原备份

> **重要**：Kubernetes v1.22 是 Rancher 2.6.3 的实验功能，不支持使用 apiVersion `apiextensions.k8s.io/v1beta1`来还原包含 CRD 文件的备份文件。在 v1.22 中，`rancher-backup` 应用的默认 `resourceSet` 只收集使用 `apiextensions.k8s.io/v1` 的 CRD。你可以通过下面两种方法解决这个问题。
>
1. 使用 apiVersion v1 来更新默认 `resourceSet`，从而收集 CRD。
1. 使用 `apiextensions.k8s.io/v1` 作为替代，来更新默认 `resourceSet` 和客户端，从而在内部使用新的 API。
>
> - 请注意，在为 v1.22 版本制作或恢复备份时，Rancher 版本和本地集群的 Kubernetes 版本应该是一样的。由于集群中支持的 apiVersion 和备份文件中的 apiVersion 可能不同，因此在还原备份时请考虑 Kubernetes 的版本。

如果你使用 S3 作为备份源，并且需要使用你的 S3 凭证进行还原，请使用 S3 凭证在集群中创建一个密文（Secret）。密文数据必须有两个 key，分别是包含 S3 凭证的 `accessKey` 和 `secretKey`，如下：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: s3-creds
type: Opaque
stringData:
  accessKey: <Enter your base64-encoded access key>
  secretKey: <Enter your base64-encoded secret key>
```

你可以在任何命名空间中创建这个密文。在上述例子中，密文创建在默认命名空间中。

在 Restore 自定义资源中，`prune` 必须设为 `false`。

参考以下示例创建 Restore 自定义资源：

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

> **重要提示**：只有在创建备份时启用了加密功能时，才必须设置 `encryptionConfigSecretName` 字段。提供包含加密配置文件的密文名称。如果你只有加密配置文件，但没有在此集群中用它来创建密文，请按照以下步骤创建密文。

1. 加密配置文件必须命名为 `encryption-provider-config.yaml`，而且必须使用 `--from-file` 标志来创建这个密文。因此，将你的 `EncryptionConfiguration` 保存到名为 `encryption-provider-config.yaml` 的文件中，并运行以下命令：
   ```
   kubectl create secret generic encryptionconfig \
     --from-file=./encryption-provider-config.yaml \
     -n cattle-resources-system
   ```

1. 然后，应用资源：
   ```
   kubectl apply -f migrationResource.yaml
   ```

### 3. 安装 cert-manager

按照在 Kubernetes 上安装 cert-manager的步骤[安装 cert-manager]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/#5-install-cert-manager)。

### 4. 使用 Helm 安装 Rancher

使用与第一个集群上使用的相同版本的 Helm 来安装 Rancher：

```
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=<same hostname as the server URL from the first Rancher server> \
```
