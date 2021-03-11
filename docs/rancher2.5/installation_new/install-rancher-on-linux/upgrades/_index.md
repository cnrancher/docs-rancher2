---
title: 升级指南
description: 当 RancherD 升级时，Rancher Helm controller 和 Fleet pod 都会升级。在 RancherD 升级过程中，停机时间非常少，但 RKE2 有可能会停机一分钟，在此期间，您可能会失去对 Rancher 的访问。当 Rancher 与 RancherD 一起安装时，底层的 Kubernetes 集群不能从 Rancher UI 中升级。它需要使用 RancherD CLI 进行升级。
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
  - 在Linux操作系统上安装Rancher
  - 升级指南
---

RancherD 是一个实验性功能。

## 概述

当 RancherD 升级时，Rancher Helm controller 和 Fleet pod 都会升级。

在 RancherD 升级过程中，停机时间非常少，但 RKE2 有可能会停机一分钟，在此期间，您可能会失去对 Rancher 的访问。

当 Rancher 与 RancherD 一起安装时，底层的 Kubernetes 集群不能从 Rancher UI 中升级。它需要使用 RancherD CLI 进行升级。

## 升级 Rancher Helm Chart 而不升级底层集群

要在不升级底层 Kubernetes 集群的情况下升级 Rancher，请遵循以下步骤。

> 在升级之前，我们建议您应该。
>
> - 使用[备份应用程序](/docs/rancher2/backups/2.5/back-up-rancher/_index)创建 Rancher 服务器的备份。
> - 查看您要升级到的 Rancher 版本的已知问题。已知问题列在[GitHub](https://github.com/rancher/rancher/releases)和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)的发布说明中。

1. 用 Helm 卸载 Chart。

   ```
    helm uninstall rancher
   ```

2. 用 Helm 重新安装 Rancher Chart。要安装特定的 Rancher 版本，使用`--version`标签。比如说

   ```
   helm install rancher rancher-latest/rancher\
   --namespace cattle-system
   --set hostname=rancher.my.org ．
   --version 2.5.1
   ```

**结果:** Rancher 已升级到新版本。

如果需要，请按照[这些步骤](/docs/rancher2/backups/2.5/restoring-rancher/_index)从备份中恢复 Rancher。

### 升级 Rancher 和底层集群

通过重新运行 RancherD 安装脚本，同时升级 RancherD 和底层 Kubernetes 集群。

> 在升级之前，我们建议您应该。
>
> - 使用[备份应用程序](/docs/rancher2/backups/2.5/back-up-rancher/_index)创建 Rancher 服务器的备份。
> - 查看您要升级到的 Rancher 版本的已知问题。已知问题列在[GitHub](https://github.com/rancher/rancher/releases)和[Rancher 论坛](https://forums.rancher.com/c/announcements/12)的发布说明中。

```
sudo curl -sfL https://get.rancher.io - sudo sh -
```

要指定一个特定的升级版本，使用`INSTALL_RANCHERD_VERSION`环境变量。

```
curl -sfL https://get.rancher.io | INSTALL_RANCHERD_VERSION=v2.5.1 sh -
```

然后启动服务器。

```
systemctl enable rancherd-server
systemctl start rancherd-server
```

也可以通过手动安装所需版本的二进制文件进行升级。
