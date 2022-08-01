---
title: Hello World 示例
description: Rancher Desktop Hello World 示例
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
  - Hello World
  - 示例
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本教程通过演示如何将应用推送到本地 Kubernetes 集群来介绍如何使用 Rancher Desktop。

Rancher Desktop 使用了两个容器引擎，分别是 [containerd](https://containerd.io/) 和 [Moby](https://mobyproject.org/)，它们是 Docker 生态系统的开源组件。对于 `nerdctl`，使用 **containerd** 运行时。对于 `docker`，使用 **dockerd(moby)** 运行时。

### 示例 1 - 构建镜像并运行容器

#### 创建文件夹
```
mkdir ../hello-world
cd ../hello-world
```

#### 使用以下命令创建 Dockerfile
```
FROM alpine  
CMD ["echo", "Hello World!!"]
```

#### 构建并运行镜像以进行验证

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl build --tag helloworld:v1.0 .
nerdctl images | grep helloworld
nerdctl run --rm helloworld:v1.0
# 移除镜像
nerdctl rmi helloworld:v1.0
```

</TabItem>
  <TabItem value="docker">

```
docker build --tag helloworld:v1.0 .
docker images | grep helloworld
docker run --rm helloworld:v1.0
# 移除镜像
docker rmi helloworld:v1.0
```

</TabItem>
</Tabs>

### 示例 2 - 构建镜像并将容器部署到 Kubernetes

根据需要将 **Kubernetes Settings** 面板中的 **Container Runtime** 切换为 `dockerd` 或 `containerd`。

#### 创建一个文件夹并添加一个示例 index.html 文件，如下所示
```
mkdir ../nginx
cd ../nginx
echo "<h1>Hello World from NGINX!!</h1>" > index.html
```

#### 使用以下命令创建 Dockerfile
```
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

#### 使用本地代码构建镜像

:warning: **注意**：你需要将 `--namespace k8s.io` 标志传递给 `nerdctl` build 命令，以便 `nerdctl` 构建镜像并使其在 `k8s.io` 命名空间中可用。

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
nerdctl --namespace k8s.io build --tag nginx-helloworld:latest .
nerdctl --namespace k8s.io images | grep nginx-helloworld
```

</TabItem>
  <TabItem value="docker">

```
docker build --tag nginx-helloworld:latest .
docker images | grep nginx-helloworld
```
</TabItem>
</Tabs>

#### 部署到 Kubernetes

运行以下命令，从而使用在上一步中构建的镜像创建和运行 pod。

:warning: **注意**：你需要传递 `--image-pull-policy=Never` 标志以使用带有 `:latest` 标签的本地镜像（`:latest` 标签将始终尝试从远程仓库中拉取镜像）。

```
kubectl run hello-world --image=nginx-helloworld:latest --image-pull-policy=Never --port=80
kubectl port-forward pods/hello-world 8080:80
```

在浏览器中访问 `localhost:8080`，你将看到 `Hello World from NGINX!!` 的信息。如果你想留在命令行上，请使用 `curl localhost:8080`。

#### 删除 pod 和镜像

<Tabs
groupId="container-runtime"
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl" default>

```
kubectl delete pod hello-world
# 移除镜像
nerdctl --namespace k8s.io rmi nginx-helloworld:latest
```

</TabItem>
  <TabItem value="docker">

```
kubectl delete pod hello-world
# 移除镜像
docker rmi nginx-helloworld:latest
```

</TabItem>
</Tabs>
