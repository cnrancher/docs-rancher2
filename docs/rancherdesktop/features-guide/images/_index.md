---
title: Images
description: Rancher Desktop 是一款在桌面上提供容器管理和 Kubernetes 的应用。它适用于 Mac（包括 Intel 和 Apple Silicon）、Windows 和 Linux。
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
  - Images
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Rancher Desktop 提供了通过 [NERDCTL](https://github.com/containerd/nerdctl) 项目和 Docker CLI 构建、推送和拉取镜像的能力。

注意，在 Windows 的安装过程中，以及在 macOS 和 Linux 上首次运行的时候，`nerdctl` 和 `docker` 都会被自动放到路径中。

## 常规用法

使用这两个工具需要 Rancher Desktop 与相应的容器运行时一起运行。对于 `nerdctl`，使用 containerd 运行时。对于 `docker`，使用 Moby 运行时。

你可以运行命令行帮助选项来获取帮助文档：

<Tabs
defaultValue="nerdctl"
groupId="container-runtime"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>

<TabItem value="nerdctl">

```console
nerdctl -h
```

初始的一组镜像存储在 Kubernetes 使用的同一个 containerd 中。并且是 `k8s.io` 命名空间的一部分。如果你想在不同的命名空间中构建或拉取镜像，你也可以切换到一个名为 `default` 命名空间。目前，创建其他命名空间的唯一方法是用 `nerdctl` CLI 并且使用 `--namespace <NAMESPACE_NAME>` 选项来构建或拉取镜像。

</TabItem>
<TabItem value="docker" default>

```console
docker --help
```

  </TabItem>
</Tabs>

## 列出镜像

要查看当前可用的镜像，请运行以下命令：

<Tabs
defaultValue="nerdctl"
groupId="container-runtime"
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
groupId="container-runtime"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>

<TabItem value="nerdctl">

构建镜像的过程与现有工具类似。例如，从一个有 `Dockerfile` 的目录中运行 `nerdctl`，其中 `Dockerfile` 使用的是 scratch 镜像。

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

nerdctl 具有与构建的同时进行标记的选项以及你所期望的其他选项。

```console
nerdctl build -t TAG .
```

  </TabItem>
  <TabItem value="docker">

从带有 `Dockerfile` 的目录运行 `docker`，其中 `Dockerfile` 使用的是 scratch 镜像。

```console
docker build .
Sending build context to Docker daemon  13.93MB
Step 1/5 : FROM some-repo/some-image
 ---> e57ace221dff
...
 ---> fd984c4cbf97
Successfully built fd984c4cbf97
```

`docker` 具有与构建的同时进行标记的选项以及你所期望的其他选项。

```console
docker build -t TAG .
```

  </TabItem>
</Tabs>

## 标记镜像

如果要标记已经构建的镜像，可以使用以下命令：

<Tabs
defaultValue="nerdctl"
groupId="container-runtime"
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
groupId="container-runtime"
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
