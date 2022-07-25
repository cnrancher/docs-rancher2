---
title: 使用镜像
description: 介绍使用镜像的教程
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
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - 镜像
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Rancher Desktop 通过 [NERDCTL](https://github.com/containerd/nerdctl) 项目和 Docker CLI 来提供构建，推送和拉取镜像的功能。

请注意，`nerdctl` 和 `docker` 都会自动放入路径中。在 Windows 上，这发生在安装程序期间，而在 macOS 和 Linux 上，这发生在首次运行的时候。

## 常规用法

使用任何一种工具都需要 Rancher Desktop 与适当的容器运行时一起运行。对于 `nerdctl`，使用 containerd 运行时。对于 `docker`，使用 Moby 运行时。

要了解所有命令选项并显示帮助文档，运行：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

```console
nerdctl -h
```

与 Docker 不同，containerd 具有自己的命名空间。默认情况下，nerdctl 镜像存储在 `default` 命名空间中。如果你希望你的镜像可供 Kubernetes 使用，请使用 `--namespace k8s.io` 或 `-n k8s.io` CLI 参数。你还可以使用 `--namespace <NAMESPACE_NAME>` 选项来切换到 `default` 或其他命名空间。请注意，nerdctl 命名空间独立于 Kubernetes 和 `kubectl` 命名空间。

</TabItem>
  <TabItem value="docker">

```console
docker --help
```
</TabItem>
</Tabs>

## 列出镜像

要查看当前可用的镜像，请运行以下命令：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

```console
nerdctl images
```
</TabItem>
  <TabItem value="docker">

```console
docker images
```
</TabItem>
</Tabs>

## 构建镜像

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

构建镜像与现有工具的操作相似。你可以在具有 `Dockerfile`（`Dockerfile` 使用了一个 scratch 镜像）的路径上运行 `nerdctl`：

```console
nerdctl build .
[+] Building 0.1s (4/4) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 31B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load build context
 => => transferring context: 33B
 => CACHED [1/1] ADD anvil-app /
```

`nerdctl` 具有在构建时进行标记的选项以及一些其他选项：

```console
nerdctl build -t TAG .
```

要构建用于 Kubernetes 的镜像，请指定 `k8s.io` 命名空间，如下所示：
```console
nerdctl build -n k8s.io .
```

</TabItem>
  <TabItem value="docker">

你可以在具有 `Dockerfile`（`Dockerfile` 使用了一个 scratch 镜像）的路径上运行 `docker`：

```console
docker build .
Sending build context to Docker daemon  13.93MB
Step 1/5 : FROM some-repo/some-image
 ---> e57ace221dff
...
 ---> fd984c4cbf97
Successfully built fd984c4cbf97
```

`docker` 具有在构建时进行标记的选项以及一些其他选项：

```console
docker build -t TAG .
```
</TabItem>
</Tabs>

### 构建本地镜像

为了演示构建本地镜像和运行应用程序的步骤，[Rancher Desktop 的 docs 仓库](https://github.com/rancher-sandbox/docs.rancherdesktop.io.git)提供了一个示例 nodejs 应用程序。首先，克隆仓库并 cd 到终端中的 `assets/express-sample` 中。

运行以下命令来使用 Dockerfile 构建镜像：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

```
nerdctl --namespace k8s.io build -t expressapp:v1.0 .
```

</TabItem>
  <TabItem value="docker">

```
docker build -t expressapp:v1.0 .
```

</TabItem>
</Tabs>

运行以下命令来运行容器：

```
kubectl run --image expressapp:v1.0 expressapp
kubectl port-forward pods/expressapp 3000:3000
```

**注意**：添加 `latest` 标签时，请务必同时指定以下内容：
```
imagePullPolicy: Never
```

## 标记镜像

如果要标记已构建的现有镜像，你可以运行以下命令：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

```console
nerdctl tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
```
</TabItem>
  <TabItem value="docker">

```console
docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
```
</TabItem>
</Tabs>

## 删除镜像

要删除镜像，请运行以下命令：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

```console
nerdctl rmi IMAGE
```
</TabItem>
  <TabItem value="docker">

```console
docker rmi IMAGE
```
</TabItem>
</Tabs>