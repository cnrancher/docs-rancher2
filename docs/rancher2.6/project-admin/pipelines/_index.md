---
title: Rancher CI/CD 管道
description: 使用 Rancher 的 CI/CD 管道自动签出代码、运行构建或脚本、发布 Docker 镜像以及向用户部署软件
weight: 4000
---

你可以使用 Rancher 与 GitHub 仓库集成，从而设置持续集成（CI）管道。

配置 Rancher 和 GitHub 后，你可以部署运行 Jenkins 的容器来自动化执行管道：

- 将应用代码构建为镜像。
- 验证构建。
- 将构建的镜像部署到集群。
- 运行单元测试。
- 运行回归测试。

有关详细信息，请参阅[管道]({{<baseurl>}}/rancher/v2.6/en/pipelines)。
