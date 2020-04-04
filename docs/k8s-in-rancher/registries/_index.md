---
title: 镜像仓库凭证
---

镜像库凭证其实也是一个 Kubernetes Secret。这个 Secret 包含用于向[私有 Docker 镜像库](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)进行身份验证的凭据。

“registry” 一词可以表示两件事，具体取决于它是用来指代 Docker Registry 还是 Kubernetes Registry：

- **Docker Registry** 包含 Docker 镜像，您可以提取这些镜像以在部署中使用它们。Registry 是一个无状态，可扩展的服务器端应用程序，用于存储和分发 Docker 镜像。
- **Kubernetes Registry** 是镜像提取凭证，在您的部署需要使用私有镜像库中的镜像时，Docker 镜像库需要通过这个凭证进行身份验证。

部署使用 Kubernetes 镜像库凭证向私有 Docker 镜像库进行身份验证，然后拉取托管在其上的 Docker 镜像。

当前，仅当在 Rancher UI 中创建工作负载时，部署才会自动获取相应的私有镜像库凭证。而在通过 kubectl 创建工作负载时，部署则不会自动获取私有镜像库凭证，需要您在 YAML 中手动指定。

## 创建一个镜像库

> **先决条件** 有一个可被使用的 [私有镜像库](https://docs.docker.com/registry/deploying/) 。

1. 从 **全局** 视图， 选择您想要添加一个镜像库凭证的命名空间所在的项目。

1. 通过主目录， 点击 **资源 > 密文 > 镜像库凭证** (在 Rancher v2.3 之前的版本， 点击 **资源 > 镜像库**)。

1. 点击**添加凭证**。

1. 为镜像库凭证设置**名称**。

   > **注意:** Kubernetes 将密文，证书，配置映射和镜像库凭证分类为[Secret](https://kubernetes.io/docs/concepts/configuration/secret/)，并且项目或命名空间中的两个 secret 都不能有重复的名称。因此，为防止冲突，镜像库凭证必须在工作空间内的所有 secret 中具有唯一的名称。

1. 为这个镜像库凭证选择一个**范围**。您可以设置此镜像库凭证作用于此项目所有[命名空间](/docs/cluster-admin/projects-and-namespaces/_index)或单个[命名空间](/docs/cluster-admin/projects-and-namespaces/_index)。

1. 选择您的私有镜像库的类型，然后输入私有镜像库的凭证。例如，如果您使用 DockerHub，请提供您的 DockerHub 用户名和密码。

1. 点击 **保存**。

**效果:**

- 您的镜像库凭证将添加到项目或命名空间中，具体取决于您选择的范围。
- 您可以在 Rancher UI 界面通过 **资源 > 镜像库凭证** 视图查看这个凭证。
- 您在 Rancher UI 中创建的任何使用该私有镜像库中镜像的工作负载，都将自动获得该私有镜像仓库的凭证。

## 使用一个私有镜像库

您可以通过 Rancher UI 或使用`kubectl`工具部署一个来自私有镜像库镜像的工作负载。

### 通过 Rancher UI 使用私有镜像库

使用私有镜像库中的容器镜像部署工作负载

1. 转到项目视图，
1. 点击 **资源 > 工作负载**。在 v2.3.0 之前版本， 转到 **工作负载** 标签。
1. 点击 **部署服务**。
1. 为工作负载输入唯一的名称并选择一个命名空间。
1. 在**Docker Image**字段中，输入私有镜像仓库中的 Docker 镜像的路径 URL。例如，如果您的私有镜像库是在 Quay.io， 您可以使用 `quay.io/<Quay profile name>/<Image name>`。
1. 点击 **运行**。

**效果:** 您的工作负载会自动使用您在 Rancher UI 中添加的私有镜像库凭证，来获取您指定的 Docker 镜像。

### 通过 kubectl 使用私有镜像库

当您使用`kubectl`创建工作负载，您需要配置 Pod 的 YAML 来指定它要使用的在私有镜像仓库中的镜像。您还必须创建镜像库凭证，并且在 Pod 的 YAML 中引用这个镜像库凭证。因为只有在 Rancher UI 中创建的工作负载所对应的 Pod 才会自动获得相应的私有镜像库凭证。

镜像库凭证和您的部署工作负载必须在的相同命名空间中。

以下是使用私有镜像库中镜像的工作负载示例 `pod.yml`。在此示例中，Pod 使用 Quay.io 中的镜像，.yml 指定镜像的路径。Pod 使用存储在名为`testquay`的 Kubernetes 密文中的凭证向镜像库进行身份验证，该凭证在`spec.imagePullSecrets`中的`name`字段指定:

```
apiVersion: v1
kind: Pod
metadata:
  name: private-reg
spec:
  containers:
  - name: private-reg-container
    image: quay.io/<Quay profile name>/<image name>
  imagePullSecrets:
  - name: testquay
```

在这个示例中， 名称为`testquay`的密文位于默认的命名空间中。

您可以使用`kubectl`工具去创建密文作为私有镜像库的凭证。使用这条命令创建名称为`testquay`的密文:

```
kubectl create secret docker-registry testquay \
    --docker-server=quay.io \
    --docker-username=<Profile name> \
    --docker-password=<password>
```

查看密文是怎样被存储在 Kubernetes 中，您可以使用这条命令:

```
kubectl get secret testquay --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

执行效果是这样的:

```
{"auths":{"quay.io":{"username":"<Profile name>"，"password":"<password>"，"auth":"c291bXlhbGo6dGVzdGFiYzEyMw=="}}}
```

工作负载部署完成后， 您可以检查是否已经成功拉取镜像:

```
kubectl get events
```

执行效果应该是这样的:

```
14s         Normal    Scheduled          Pod    Successfully assigned default/private-reg2 to minikube
11s         Normal    Pulling            Pod    pulling image "quay.io/<Profile name>/<image name>"
10s         Normal    Pulled             Pod    Successfully pulled image "quay.io/<Profile name>/<image name>"
```

有关更多信息，请参阅 Kubernetes 文档 [使用您的密文创建一个 Pod](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-pod-that-uses-your-secret)。
