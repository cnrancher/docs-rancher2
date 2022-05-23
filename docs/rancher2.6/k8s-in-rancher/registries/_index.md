---
title: Kubernetes 镜像仓库和 Docker 镜像仓库
description: 了解 Docker 镜像仓库和 Kubernetes 镜像仓库、它们的用例以及如何在 Rancher UI 中使用私有镜像仓库
weight: 3063
---
镜像仓库是 Kubernetes 密文（Secret），包含用于向[私有 Docker 镜像仓库](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)进行身份验证的凭证。

“Registry” 这个词可能有两种意思，可指代 Docker 或 Kubernetes 镜像仓库：

- **Docker 镜像仓库**包含 Docker 镜像，你可以拉取镜像以便在 deployment 中使用镜像。镜像仓库是一个无状态、可扩展的服务器端应用程序，用于存储和分发 Docker 镜像。
- **Kubernetes 镜像仓库**是一个镜像拉取密文，你的 deployment 使用该密文来向 Docker 镜像仓库进行身份验证。

Deployment 使用 Kubernetes 镜像仓库密文向私有 Docker 镜像仓库进行身份验证，然后拉取托管在仓库上的 Docker 镜像。

目前，只有在 Rancher UI 中创建工作负载时（通过 kubectl 创建的工作负载不可以），Deployment 才会自动拉取私有镜像仓库凭证。

## 在命名空间中创建镜像仓库

> **先决条件**：你必须有一个可用的[私有镜像仓库](https://docs.docker.com/registry/deploying/)。

1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加镜像仓库的集群，然后单击 **Explore**。
1. 在左侧导航中，单击**存储 > 密文**或**更多资源 > 核心 > 密文**。
1. 单击**创建**。
1. 单击**镜像仓库**。
1. 输入镜像仓库的**名称**。

   > **注意**：Kubernetes 将密文、证书和镜像仓库都归类为[密文](https://kubernetes.io/docs/concepts/configuration/secret/)，命名空间或项目中的密文名称不能重复。因此，为了避免冲突，镜像仓库的名称必须与工作空间中的其他密文不一样。

1. 为镜像仓库选择一个命名空间。
1. 选择托管你的私人镜像仓库的网站。然后，输入向镜像仓库进行身份验证的凭证。例如，如果你使用 DockerHub，请提供你的 DockerHub 用户名和密码。
1. 单击**保存**。

**结果**：

- 已将你的密文添加到命名空间中。
- 你可以通过单击**存储 > 密文**或**更多资源 > 核心 > 密文**在 Rancher UI 中查看密文。
- 如果工作负载在镜像仓库的范围内，你在 Rancher UI 中创建的任何工作负载都将具有访问镜像仓库的凭证。

## 在项目中创建镜像仓库

> **先决条件**：你必须有一个可用的[私有镜像仓库](https://docs.docker.com/registry/deploying/)。

在 Rancher 2.6 之前，密文必须创建在项目级别。现在不再需要项目级别，你可以采用命名空间级别。因此，Rancher UI 进行了更新以反映这一新功能。但是，你仍然可以按照需要创建项目级别的镜像仓库。执行以下步骤进行操作：

1. 在左上角，单击下拉菜单中的 **☰ > 全局设置**。
1. 单击**功能开关**。
1. 转到`旧版应用`功能开关并单击**激活**。
1. 点击左上角 **☰ > 集群管理**。
1. 转到要添加镜像仓库的集群，然后单击 **Explore**。
1. 在左侧导航中，单击**存储 > 密文**或**更多资源 > 核心 > 密文**。
1. 单击**创建**。
1. 单击**镜像仓库**。
1. 在顶部导航栏中进行过滤，从而仅查看一个项目。
1. 输入镜像仓库的**名称**。

   > **注意**：Kubernetes 将密文、证书和镜像仓库都归类为[密文](https://kubernetes.io/docs/concepts/configuration/secret/)，命名空间或项目中的密文名称不能重复。因此，为了避免冲突，镜像仓库的名称必须与工作空间中的其他密文不一样。

1. 为镜像仓库选择一个命名空间。
1. 选择托管你的私人镜像仓库的网站。然后，输入向镜像仓库进行身份验证的凭证。例如，如果你使用 DockerHub，请提供你的 DockerHub 用户名和密码。
1. 单击**保存**。

**结果**：

- 密文已添加到你选择的项目中。
- 你可以通过单击**存储 > 密文**或**更多资源 > 核心 > 密文**在 Rancher UI 中查看密文。
- 如果工作负载在镜像仓库的范围内，你在 Rancher UI 中创建的任何工作负载都将具有访问镜像仓库的凭证。

> **注意**：local 集群上的项目级别镜像仓库仅在选择单个项目时可见。

## 使用私有镜像仓库

你可以通过 Rancher UI 或 `kubectl` 使用私有镜像仓库的镜像来部署工作负载。

### 在 Rancher UI 中使用私有镜像仓库

要使用私有镜像仓库中的镜像来部署工作负载：

1. 点击左上角 **☰ > 集群管理**。
1. 转到要部署工作负载的集群，然后单击 **Explore**。
1. 点击**工作负载**。
1. 单击**创建**。
1. 选择要创建的工作负载类型。
1. 输入工作负载的独特名称，并选择命名空间。
1. 在**容器镜像**字段中，输入私有镜像仓库中镜像的路径 URL。例如，如果你的私有镜像仓库位于 Quay.io，你可以使用 `quay.io/<Quay profile name>/<Image name>`。
1. 单击**创建**。

**结果**：你的 deployment 能启动，能使用你在 Rancher UI 中添加的私有镜像仓库凭证进行身份验证，并拉取指定的 Docker 镜像。

### 通过 kubectl 使用私有镜像仓库

使用 `kubectl`创建工作负载时，你需要配置 pod，从而使其 YAML 具有私有镜像仓库中镜像的路径。如果 Pod 是在 Rancher UI 中创建的，它只会自动获取对私有镜像仓库凭证的访问权限，因此你还必须创建和引用镜像仓库密文。

密文必须创建在部署工作负载的同一命名空间中。

下面是一个示例 `pod.yml`，它用于使用私有镜像仓库的镜像的工作负载。在此示例中，pod 使用来自 Quay.io 的镜像，而且 .yml 指定了镜像的路径。pod 使用存储在名为 `testquay` 的 Kubernetes 密文中的凭证来向镜像仓库进行身份验证，该密文在 `name` 字段的 `spec.imagePullSecrets` 中指定：

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

在此示例中，名为 `testquay` 的密文位于 Default 命名空间中。

你可以通过 `kubectl` 使用私有镜像仓库凭证来创建密文。此命令创建名为 `testquay` 的密文：

```
kubectl create secret docker-registry testquay \
    --docker-server=quay.io \
    --docker-username=<Profile name> \
    --docker-password=<password>
```

要查看密文是如何存储在 Kubernetes 中的，可以使用以下命令：

```
kubectl get secret testquay --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

结果如下所示：

```
{"auths":{"quay.io":{"username":"<Profile name>","password":"<password>","auth":"c291bXlhbGo6dGVzdGFiYzEyMw=="}}}
```

部署工作负载后，你可以检查镜像是否已拉取成功：

```
kubectl get events
```
结果应如下所示：
```
14s         Normal    Scheduled          Pod    Successfully assigned default/private-reg2 to minikube
11s         Normal    Pulling            Pod    pulling image "quay.io/<Profile name>/<image name>"
10s         Normal    Pulled             Pod    Successfully pulled image "quay.io/<Profile name>/<image name>"
```

有关详细信息，请参阅 Kubernetes 文档中的[创建使用你密文的 pod](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-pod-that-uses-your-secret)。
