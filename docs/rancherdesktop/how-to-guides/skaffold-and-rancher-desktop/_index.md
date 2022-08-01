---
title: Skaffold 与 Rancher Desktop
description: 使用 Rancher Desktop 设置 Skaffold 的步骤
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
  - Skaffold
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Skaffold 是一个命令行工具，用于 Kubernetes 原生应用程序的持续开发。Skaffold 处理构建、推送和部署应用程序的工作流，并提供用于创建 CI/CD 流水线的构建块。它能让你专注于在本地迭代你的应用程序，Skaffold 则能持续部署到你的本地或远程 Kubernetes 集群。要了解有关 Skaffold 的更多信息，请参阅 [Skaffold 项目文档](https://skaffold.dev/docs/)。

为了演示使用 Rancher Desktop 设置 Skaffold 的步骤，Rancher Desktop 文档在[此处](https://github.com/rancher-sandbox/docs.rancherdesktop.io/tree/main/assets/express-sample)提供了一个 nodejs 应用程序示例。

> **重要提示：Skaffold 仅适用于 `dockerd` (Moby)**。因此，请确保在 Rancher Desktop UI 的 **Kubernetes Settings** 面板中选择了 `dockerd` 作为运行时。

1. 访问 https://skaffold.dev/docs/install/ 安装 Skaffold。

1. 克隆 [Rancher Desktop 文档仓库](https://github.com/rancher-sandbox/docs.rancherdesktop.io.git)并在终端中导航到 `express-sample`，如下所示：
   ```
   cd docs.rancherdesktop.io/assets/express-sample
   ```

1. 运行 `skaffold init`。

   根据 [Skaffold 文档](https://skaffold.dev/docs/pipeline-stages/init/#build-config-initialization) 的介绍，`skaffold init` 会遍历你的项目目录并查找 build 配置文件（例如 `Dockerfile`、`build.gradle /pom.xml`、`package.json`、`requirements.txt` 或 `go.mod`）。

   在我们的示例中，我们将选择 `Dockerfile` 和 `package.json`。这将生成你可以修改的初始配置文件。出现提示时，选择 `yes` 将你的配置写入 `skaffold.yaml`。

1. 在你的编辑器中，查看你的 `app.js` 和 `manifests.yaml` 文件。请注意，在 `manifests.yaml` 中，你将拥有一个 deployment 配置和一个 service 配置。在测试场景下，仅需要 1 个 `replica` 即可。

1. 回到你的终端，你会注意到你有两个选项，分别是 `skaffold run`（允许你构建和部署）和 `skaffold dev` （允许你进入开发模式自动重新部署）。在此示例中，我们将使用 `skaffold dev`。

   由于你需要对镜像仓库具有推送访问权限，因此你可以使用 docker 登录，也可以设置本地镜像仓库：

   <Tabs
   defaultValue="docker-hub"
   values={[
   { label: 'Docker Hub', value: 'docker-hub', },
   { label: '本地镜像仓库', value: 'local-registry', },
   ]}>
   <TabItem value="docker-hub">

   在运行 `skaffold dev` 之前，如果你有 [Docker Hub](https://hub.docker.com/) 账号，请使用你的 docker 登录。

   </TabItem>
   <TabItem value="local-registry">

   你可以先运行以下命令来设置本地镜像仓库：

   ```
   docker run -d -p 5000:5000 --restart=always --name registry registry:2
   ```

   然后：
   ```
   skaffold dev --default-repo=localhost:5000
   ```
   </TabItem>
   </Tabs>

   在进行开发时，Skaffold 将检测所有更改，并会自动再次执行构建和部署的过程。你将能够看到集群中的任何更改。

6. 在浏览器中访问 `localhost:3000`，你将看到 `express-sample` 界面。

