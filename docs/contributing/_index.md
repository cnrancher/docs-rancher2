---
title: 为Rancher社区做出贡献
description: 本部分将介绍 Rancher 2.x 的源代码仓库，如何构建源代码以及在提交 Issue 时要包括哪些信息。有关如何为 Rancher 2.x 的开发做出贡献的更多详细信息，请参阅[Rancher 开发指南](https://github.com/rancher/rancher/wiki)。这个 Wiki 具有许多主题的资源。在 Rancher 用户 Slack 上，开发人员的频道是 **#developer**。在我们的官方微信交流群中，每个群也都有 Rancher 的开发者。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 参与Rancher开源项目
  - 为Rancher社区做出贡献
---

本部分将介绍 Rancher 2.x 的源代码仓库，如何构建源代码以及在提交 Issue 时要包括哪些信息。

有关如何为 Rancher 2.x 的开发做出贡献的更多详细信息，请参阅[Rancher 开发指南](https://github.com/rancher/rancher/wiki)。这个 Wiki 具有许多主题的资源，包括：

- 如何设置 Rancher 开发环境并运行测试
- Issue 在整个开发生命周期中的流程
- 编码指南和开发最佳实践
- 调试和故障排查
- 开发 Rancher API

在 Rancher 用户 Slack 上，开发人员的频道是 **#developer**。在我们的官方微信交流群中，每个群也都有 Rancher 的开发者。

## 源代码仓库

所有代码库都位于我们官方的 GitHub 账号下。有许多用于 Rancher 的代码库，我们将对 Rancher 中使用的一些主要代码库进行描述。

| 代码库                 | URL                                         | 描述                                                                                                                |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Rancher                | https://github.com/rancher/rancher          | 该库是 Rancher 2.x 的主要源代码。                                                                                   |
| Types                  | https://github.com/rancher/types            | 该库存有 Rancher 2.x 所有 API 定义。                                                                                |
| API Framework          | https://github.com/rancher/norman           | 该库是一个 API 框架，用于构建基于 Kubernetes CRD 和 Controller 的 Rancher 风格的 API。                              |
| UI                     | https://github.com/rancher/ui               | 该库是 UI 的代码库。                                                                                                |
| Rancher Docker Machine | https://github.com/rancher/machine          | 该库是使用主机驱动时使用的 Rancher Docker Machine 二进制文件的源。这是 `docker/machine` 库的 fork.                  |
| machine-package        | https://github.com/rancher/machine-package  | 该库用于构建 Rancher Docker Machine 二进制文件。                                                                    |
| kontainer-engine       | https://github.com/rancher/kontainer-engine | 该库是 kontainer-engine 的源代码，kontainer-engine 是用于配置托管 Kubernetes 集群的工具。                           |
| RKE                    | https://github.com/rancher/rke              | 该库是 Rancher Kubernetes Engine 的代码库，Rancher Kubernetes Engine 是在任何机器构建，配置 Kubernetes 集群的工具。 |
| CLI                    | https://github.com/rancher/cli              | 该库是 Rancher 2.x 中使用的 Rancher CLI 的源代码。                                                                  |
| Rancher Helm           | https://github.com/rancher/helm             | 该库是打包的 Helm 二进制文件的来源。这是 `helm/helm` 库的分支。                                                     |
| Telemetry              | https://github.com/rancher/telemetry        | 该库是采集遥测数据的源代码库。                                                                                      |
| loglevel               | https://github.com/rancher/loglevel         | 该库是日志级别二进制文件的源代码库，用于动态更改日志级别。                                                          |

要查看 Rancher 中使用的所有库/项目，请在 `rancher/rancher` 库查看[ `go.mod` 文件](https://github.com/rancher/rancher/blob/master/go.mod)。

![Rancher diagram](/img/rancher/ranchercomponentsdiagram.svg)

<br/>
<sup>用于配置/管理Kubernetes集群的Rancher组件。</sup>

## 编译，构建源代码

每个源代码仓库都有一个 Makefile，并且可以使用 `make` 命令来构建。`make` 的 targets 就是`/scripts` 目录中的脚本，每个 target 都将使用 [Dapper](https://github.com/rancher/dapper) 在隔离的环境中执行构建。这个过程是通过`Dockerfile.dapper`完成的，其中包括所有所需要的构建工具。

默认 target 是 `ci` ，这个 target 将运行 `./scripts/validate` 、 `./scripts/build` 、 `./scripts/package` 和 `./scripts/package`。构建的出的二进制文件将位于 `./build/bin` 中，并且通常也会生成相应的 Docker 镜像。

## 缺陷，问题和询问

如果您发现任何错误或遇到任何麻烦，请搜索[已经报告的 Issues](https://github.com/rancher/rancher/issues)，因为可能有人遇到过相同的问题或我们正在积极寻求解决方案。

如果找不到与您的问题相关的任何信息，请通过[创建 Issue](https://github.com/rancher/rancher/issues/new)与我们联系。尽管我们有许多与 Rancher 相关的代码库，但我们希望将错误记录在 `rancher/rancher` 的代码库中，这样我们就不会错过它们！如果您想提出问题或向其他用户询问用例，我们建议在[Rancher 全球论坛](https://forums.rancher.com)或[Rancher 中文论坛](https://forums.cnrancher.com/)上发表文章。或者在 Rancher 微信交流群中和大家一起讨论。

### 提交问题清单

提出问题时，请遵循此清单，这将有助于我们调查和解决问题。更多信息意味着我们可以使用更多数据来确定导致问题的原因或相关原因。

> **注意：**对于大量数据，请使用[GitHub Gist](https://gist.github.com/)或类似方法，并在问题中链接创建的资源。
> :::important 重要
> 请删除所有敏感数据，因为这些数据可以公开查看。
> :::

- **资源：** 尽可能提供有关已使用资源的详细信息。问题的根源可能是很多，包括尽可能多的细节有助于确定根本原因。请参阅以下示例：
  - **主机：** 主机具有什么规格，例如 CPU /内存/磁盘，它在什么云上，您使用的是什么 Amazon Machine Image，您使用的是什么 DigitalOcean Droplet，您配置的是什么 Image，我们可以在尝试时重建或使用这些 Image。
  - **操作系统：** 您使用什么操作系统？提供详细信息是非常有帮助的，例如确切的操作系统版本 `cat /etc/os-release` 和内核版本 `uname -r` 。
  - **Docker：** 您正在使用哪个 Docker 版本，是怎么安装的？可以通过提供 `docker version` 和 `docker info` 的输出找到 Docker 的大多数细节。
  - **环境：** 您是否在代理环境中，是否正在使用可信的 CA，还是在用自签名证书，是否正在使用外部负载均衡器。
  - **Rancher：** 您正在使用什么版本的 Rancher，可以在用户界面的左下方找到，也可以从主机上运行的 Image 的 Tag 中找到。
  - **集群：** 您创建了哪种集群，如何创建的，在创建集群时指定了什么参数。
- **重现此问题的步骤：** 请尽量详细的提供您是如何遇到所报告的情况的信息。这有助于重现您遇到的情况。
  - 提供手动步骤或自动化脚本，用于从新创建的设置获取您所报告的情况。
- **日志：** 提供使用资源中的数据/日志。

  - Rancher Server 日志

    - 通过 Docker 安装的 Rancher Server

      ```
      docker logs \
      --timestamps \
      $(docker ps | grep -E "rancher/rancher:|rancher/rancher " | awk '{ print $1 }')
      ```

    - 通过 `kubectl` 安装在 Kubernetes 中的 Rancher Server

      > **注意：** 确保已配置正确的 kubeconfig（例如，如果在 Kubernetes 集群上安装了 Rancher，则 `export KUBECONFIG=$PWD/kube_config_rancher-cluster.yml` ），或者通过 UI 使用嵌入式 kubectl。

      ```
      kubectl -n cattle-system \
      logs \
      -l app=rancher \
      --timestamps=true
      ```

    - 在 RKE 集群的每个节点通过 `docker`安装的组件。

      ```
      docker logs \
      --timestamps \
      $(docker ps | grep -E "rancher/rancher@|rancher_rancher" | awk '{ print $1 }')
      ```

    - 使用 RKE Add-On 安装在 Kubernetes 中的 Rancher Server

      > **注意：** 确保已配置正确的 kubeconfig（例如，如果 Rancher 服务器安装在 Kubernetes 集群上，则 `export KUBECONFIG=$PWD/kube_config_rancher-cluster.yml` )或通过 UI 使用嵌入式 kubectl。

      ```
      kubectl -n cattle-system \
      logs \
      --timestamps=true \
      -f $(kubectl --kubeconfig $KUBECONFIG get pods -n cattle-system -o json | jq -r '.items[] | select(.spec.containers[].name="cattle-server") | .metadata.name')
      ```

  - 系统日志（这些可能并不全部存在，具体取决于操作系统）
    - `/var/log/messages`
    - `/var/log/syslog`
    - `/var/log/kern.log`
  - Docker 守护程序日志记录（这些可能并不全部存在，具体取决于操作系统）
    - `/var/log/docker.log`

* **指标：** 如果遇到性能问题，请提供尽可能多的指标数据（文件或屏幕截图），以帮助确定正在发生的事情。如果您有与机器有关的问题，则可以提供输出 `top` ， `free -m` 和 `df` 的输出，这些输出显示了进程/内存/磁盘使用情况。

## 文档

如果您对我们的文档有任何更新，请向我们的文档仓库提 PR。

- [Rancher 2.x 文档库](https://github.com/rancher/docs)：此仓库是 Rancher 2.x 所有文档的存放位置。它们位于仓库中的 `content` 文件夹中。

- [Rancher 1.x 文档库](https://github.com/rancher/rancher.github.io)：此仓库是 Rancher 1.x 的所有文档所在的位置。它们位于仓库中的 `rancher` 文件夹中。
