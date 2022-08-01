---
title: 使用容器
description: 介绍使用容器的教程
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
  - 容器
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`nerdctl` 是一个与 Docker 兼容的容器 CLI。`nerdctl` 主要用于对 Docker 中不存在的 containerd 尖端功能进行试验。

[Moby](https://github.com/moby/moby) 是一个由 Docker 创建的开源项目，用于启用和加速软件容器化。组件包括容器构建工具、容器镜像仓库、编排工具和运行时等。Docker CLI 使用 Moby 运行时。

## 运行容器

要使用默认的 `bridge` CNI 网络 (10.4.0.0/24) 运行容器：

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl run -it --rm alpine
```

</TabItem>
  <TabItem value="docker" default>

```
docker run -it --rm alpine
```
</TabItem>
</Tabs>

要使用 BuildKit 构建镜像：

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl build -t foo /some-dockerfile-directory
nerdctl run -it --rm foo
```

</TabItem>
  <TabItem value="docker" default>

```
docker build -t foo /some-dockerfile-directory
docker run -it --rm foo
```
</TabItem>
</Tabs>

要使用 BuiltKit 进行构建并将输出发送到本地目录：

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl build -o type=local,dest=. /some-dockerfile-directory
```
</TabItem>
  <TabItem value="docker" default>

```
docker build -o type=local,dest=. /some-dockerfile-directory
```
</TabItem>
</Tabs>

## Docker Compose

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

`nerdctl-compose` CLI 用于与 `docker-compose` 兼容：
```
nerdctl compose up -d
nerdctl compose down
```
</TabItem>
  <TabItem value="docker">

Docker CLI 中的 `compose` 命令支持大多数 `docker-compose` 命令和标志。它有望成为 `docker-compose` 的直接替代品。
```
docker compose up -d
docker compose down
```
</TabItem>
</Tabs>

## 暴露端口

要为容器公开端口 8000：

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl run -d -p 8000:80 nginx
```
</TabItem>
  <TabItem value="docker" default>

```
docker run -d -p 8000:80 nginx
```
</TabItem>
</Tabs>

然后，你可以在浏览器中访问 [http://localhost:8000/](http://localhost:8000/) 来访问容器：

*注意：默认情况下，暴露的端口可以在 macOS 和 Linux 上的所有网络接口上访问。然而，在 Windows 上，暴露的端口只能通过 localhost 网络接口访问（参见 issue [#1180](https://github.com/rancher-sandbox/rancher-desktop/issues/1180)）。目前的一个解决方法是[在 Windows 主机上配置 `portproxy`](https://github.com/rancher-sandbox/rancher-desktop/issues/1180#issuecomment-1005514200)，从而将端口公开给其他网络接口*。

```
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=localhost
```

## 定位 Kubernetes 命名空间

你还可以通过 `containerd` 使用 `--namespace` 参数来定位 Kubernetes 命名空间。请注意 `docker` 不使用命名空间。

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl --namespace k8s.io build -t demo:latest /code/demos/rd/anvil-app
nerdctl --namespace k8s.io ps
```

</TabItem>
</Tabs>
