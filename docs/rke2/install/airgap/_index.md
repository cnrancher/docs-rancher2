---
title: 离线安装
description: RKE2 可以通过两种不同的方式安装在一个离线环境中。你可以通过`rke2-airgap-images` tarball release artifacts 进行部署，也可以通过使用私有镜像仓库。
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
  - 离线安装
  - airgap
---

:::note 说明：
如果你的节点安装并启用了 NetworkManager，[确保它被配置为忽略 CNI 管理的接口。](/docs/rke2/known_issues/_index#networkmanager)
:::

RKE2 可以通过两种不同的方式安装在一个离线环境中。你可以通过`rke2-airgap-images` tarball release artifacts 进行部署，也可以通过使用私有镜像仓库。

步骤中提到的所有文件都可以在[此处](https://github.com/rancher/rke2/releases)从所需发布的 rke2 版本的资产中获取。

如果在一个执行 SELinux 的离线节点上运行，在执行这些步骤之前，你必须先安装必要的 SELinux policy RPM。请参阅我们的[RPM 文档](https://github.com/rancher/rke2#rpm-repositories)以确定你需要什么。

## Tarball 方式

1. 从 RKE2 的版本和平台的 RKE release artifacts 列表中下载 airgap images tarball。
   - 对于 v1.20 之前的版本，使用`rke2-images.linux-amd64.tar.zst`，或`rke2-images.linux-amd64.tar.gz`。与 gzip 相比，Zstandard 提供了更好的压缩率和更快的解压速度。
   - 如果使用默认的 Canal CNI（`--cni=canal`），你可以使用上述的`rke2-image`旧存档，或者`rke2-images-core`和`rke2-images-canal`。
   - 如果使用替代的 Cilium CNI（`--cni=cilium`），你必须下载`rke2-images-core`和`rke2-images-cilium`。
   - 如果使用您自己的 CNI（`--cni=none`），您可以只下载`rke2-images-core`。
   - 如果启用 vSphere CPI/CSI charts（`--cloud-provider-name=vsphere`），您还必须下载`rke2-images-vsphere`。
2. 确保节点上存在`/var/lib/rancher/rke2/agent/images/`目录。
3. 将压缩档案复制到节点上的`/var/lib/rancher/rke2/agent/images/`，确保保留文件扩展名。
4. [安装 RKE2](#安装-rke2)

## 私有镜像仓库方式

从 RKE2 v1.20 开始，私有镜像仓库支持来自[containerd 镜像仓库配置](/docs/rke2/install/containerd_registry_configuration/_index)中的所有设置。这包括 endpoint 覆盖和传输协议（HTTP/HTTPS）、认证、证书验证等。

在 RKE2 v1.20 之前，私有镜像仓库必须使用 TLS，并使用由主机 CA 捆绑信任的 cert。如果 registry 使用的是自签名的证书，你可以用`update-ca-certificates`将该证书添加到主机 CA 捆绑中。registry 还必须允许匿名（未认证）访问。

1. 将所有需要的系统镜像添加到你的私有镜像仓库。镜像列表可以从上面提到的每个 tarball 对应的`.txt`文件中获得，或者你可以`docker load` 离线镜像 tarballs，然后标记并推送加载的镜像。
2. 如果在 registry 上使用私有或自签名的证书，请将 registry 的 CA 证书添加到 containerd registry 配置中，如果是 v1.20 之前的版本，则添加操作系统的可信证书。
3. 使用`system-default-registry`参数[安装 RKE2](#安装-rke2)，或使用[containerd registry 配置](/docs/rke2/install/containerd_registry_configuration/_index)将你的 registry 作为 docker.io 的一个镜像。

## 安装 RKE2

这些步骤只能在完成[Tarball 方式](#tarball-方式)或[私有镜像仓库方式](#私有镜像仓库方式)中的一项后执行。

1. 获得 rke2 的二进制文件`rke2.linux-amd64`。
2. 确保二进制文件被命名为 `rke2`，并将其放在 `/usr/local/bin` 中。确保它是可执行的。
3. 用所需的参数运行二进制文件。例如，如果使用私有镜像仓库方式，你的配置文件将有以下内容：

```yaml
system-default-registry: "registry.example.com:5000"
```

:::note 注意：
`system-default-registry`参数必须只指定有效的 RFC 3986 URI 授权，即一个主机和可选的端口。
:::
