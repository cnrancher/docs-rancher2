---
title: Rancher v2.5中的备份和还原
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

在本节中，您将学习如何创建Rancher的备份，如何从备份中恢复Rancher，以及如何将Rancher迁移到新的Kubernetes集群。

从Rancher v2.5开始，`rancher-backup` operator用来备份和恢复Rancher。`rancher-backup` Helm chart在[这里。](https://github.com/rancher/charts/tree/main/charts/rancher-backup)

备份还原operator需要安装在local集群中，并且只对Rancher应用进行备份。备份和还原操作只在local Kubernetes集群中进行。

Rancher版本必须是v2.5.0及以上，才能使用这种备份和恢复Rancher的方法。

- [Rancher v2.5中的变化](#rancher-v25中的变化)
  - [使用Docker安装的Rancher v2.5的备份和还原](#使用docker安装的rancher-v25的备份和还原)
  - [在v2.5之前安装在Kubernetes集群上的Rancher的备份和还原](#在v25之前安装在kubernetes集群上的rancher的备份和还原)
- [备份和恢复如何工作](#备份和恢复如何工作)
- [安装 rancher-backup Operator](#安装-rancher-backup-operator)
  - [使用Rancher UI安装rancher-backup](#使用rancher-ui安装rancher-backup)
  - [使用Helm CLI安装rancher-backup](#使用helm-cli安装rancher-backup)
- [备份 Rancher](#备份-rancher)
- [恢复 Rancher](#恢复-rancher)
- [将Rancher迁移到新的集群](#将rancher迁移到新的集群)
- [配置默认存储位置](#配置默认存储位置)
  - [Rancher-backup Helm Chart的values.yaml示例](#rancher-backup-helm-chart的valuesyaml示例)

## Rancher v2.5中的变化

新的`rancher-backup` operator允许Rancher在任何Kubernetes集群上进行备份和恢复。这个应用是一个Helm chart，它可以通过Rancher **应用和市场**页面部署，或者使用Helm CLI部署。

以前，集群数据的备份方式取决于所使用的Kubernetes集群的类型。

在Rancher v2.4中，只支持在两种类型的Kubernetes集群上安装Rancher：一个RKE集群，或者一个带有外部数据库的K3s集群。如果Rancher安装在RKE集群上，RKE用来获取etcd数据库的快照并恢复集群。如果Rancher安装在具有外部数据库的K3s集群上，则需要使用数据库的上游文档备份和恢复数据库。

在Rancher v2.5中，现在支持安装Rancher托管的Kubernetes集群，比如Amazon EKS集群，这些集群不会将etcd公开到允许外部工具创建快照的程度。`rancher-backup` 工作时不需要暴露etcd，因为operator通过调用 `kube-apiserver` 来收集资源。

### 使用Docker安装的Rancher v2.5的备份和还原

对于使用Docker安装的Rancher，请参考2.5之前的[备份](./docker-installs/docker-backups/_index)和[恢复](./docker-installs/docker-restores/_index)的相同步骤。

### 在v2.5之前安装在Kubernetes集群上的Rancher的备份和还原

对于V2.5之前的Rancher，根据Rancher的安装方式，Rancher的备份和还原方式有所不同。我们的传统备份和恢复文档在这里：

- 对于安装在RKE Kubernetes集群上的Rancher，请参考传统的[备份](/docs/rancher2/backups/legacy/backup/ha-backups/_index)和[恢复](/docs/rancher2/backups/legacy/restore/rke-restore/_index)文档。
- 对于安装在K3s Kubernetes集群上的Rancher，请参考传统的[备份](/docs/rancher2/backups/2.0-2.4/k3s-backups/_index)和[恢复](/docs/rancher2/backups/2.0-2.4/restorations/k3s-restoration/_index)文档。

## 备份和恢复如何工作

`rancher-backup` operator 引入了三种自定义资源。Backups、Restores和ResourceSets。下列群集范围的自定义资源定义被添加到群集中：

- `backups.resources.cattle.io`
- `resourcesets.resources.cattle.io`
- `restores.resources.cattle.io`

ResourceSet 定义了哪些 Kubernetes 资源需要备份。由于备份 Rancher 所需的值是预定义的，因此该 ResourceSet 无法在 Rancher UI 中进行配置。这个 ResourceSet 不应该被修改。

当创建一个Backup自定义资源时，`rancher-backup` operator 会调用 `kube-apiserver` 来获取Backup自定义资源所指向的ResourceSet（具体是预定义的 `rancher-resource-set`）中的资源。

然后，operator 以 `.tar.gz` 格式创建备份文件，并将其存储在Backup资源中配置的位置。

创建 Restore 自定义资源时，operator访问 Restore 指定的备份 `.tar.gz` 文件，并从该文件中还原应用程序。

Backup 和 Restore自定义资源可以在 Rancher UI中创建，或者使用 `kubectl apply` 创建。

## 安装 rancher-backup operator

`rancher-backup` operator 可以从Rancher UI安装，也可以用Helm CLI安装。在这两种情况下，`rancher-backup` Helm chart 安装在运行 Rancher server 的 Kubernetes 集群上。它是一个集群管理员专用的功能，只对 **local** 集群可用。(如果您在Rancher用户界面中没有看到`rancher-backup`，您可能选择了错误的集群)

### 使用Rancher UI安装rancher-backup

1. 在Rancher UI的 **Cluster Manager** 中，选择名为**local**的群集。
1. 在右上角点击 **Cluster Explorer**。
1. 点击 **Apps.**
1. 点击 `rancher-backup` operator.
1. （可选）配置默认的存储位置。有关帮助，请参阅[配置部分](./configuration/storage-config/_index)

**结果：**安装了 `rancher-backup` operator。

从**Cluster Explorer**中，您可以看到在**deployment**中列出了`rancher-backup` operator。

要在Rancher中配置备份应用程序，请单击左上角的 **Cluster Explorer**，然后单击 **Rancher Backups.**

### 使用Helm CLI安装rancher-backup

使用Helm chart安装backup：

```
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install rancher-backup-crd rancher-charts/rancher-backup-crd -n cattle-resources-system --create-namespace
helm install rancher-backup rancher-charts/rancher-backup -n cattle-resources-system
```

### RBAC

只有rancher管理员，和本地集群的集群所有者可以：

- 安装 Chart
- 参阅导航链接，了解备份和恢复CRD。
- 通过分别创建Backup CR和Restore CR来执行备份或还原，列出到目前为止已执行的备份/还原。

## 备份 Rancher

通过创建一个Backup自定义资源来进行备份。有关教程，请参考[本页。](./back-up-rancher/_index)

## 恢复 Rancher

通过创建Restore自定义资源来进行还原。有关教程，请参考[本页。](./restoring-rancher/_index)

## 将Rancher迁移到新的集群

按照[这些步骤](./migrating-rancher/_index)进行迁移。

## 配置默认存储位置

配置一个默认保存所有备份的存储位置。您可以选择对每个备份进行覆盖，但仅限于使用 S3 或 Minio 对象存储。

有关配置这些选项的信息，请参阅[本页。](./configuration/storage-config/_index)

### Rancher-backup Helm Chart的values.yaml示例

当使用Helm CLI安装时，可以使用示例[values.yaml文件](./configuration/storage-config/_index#rancher-backup-helm-chart的valuesyaml示例)来配置`rancher-backup` operator。
