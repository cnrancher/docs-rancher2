---
title: 参与 Rancher 社区贡献
weight: 27
---

 本节介绍 Rancher 使用的仓库、如何构建仓库以及提交 issue 时要包含的信息。

有关如何为 Rancher 项目开发做出贡献的更多详细信息，请参阅 [Rancher Developer Wiki](https://github.com/rancher/rancher/wiki)。Wiki 包含以下主题的资源：

- 如何搭建 Rancher 开发环境并运行测试
- Issue 在开发生命周期中的典型流程
- 编码指南和开发最佳实践
- 调试和故障排除
- 开发 Rancher API

在 Rancher Users Slack 上，开发者的频道是 **#developer**。

## 仓库

所有仓库都位于我们的主要 GitHub 组织内。Rancher 使用了很多仓库，以下是部分主要仓库的描述：

| 仓库 | URL | 描述 |
-----------|-----|-------------
| Rancher | https://github.com/rancher/rancher | Rancher 2.x 的主要源码仓库。 |
| Types | https://github.com/rancher/types | 包含 Rancher 2.x 的所有 API 类型的仓库。 |
| API Framework | https://github.com/rancher/norman | API 框架，用于构建由 Kubernetes 自定义资源支持的 Rancher 风格的 API。 |
| User Interface | https://github.com/rancher/ui | UI 源码仓库。 |
| (Rancher) Docker Machine | https://github.com/rancher/machine | 使用主机驱动时使用的 Docker Machine 二进制文件的源码仓库。这是 `docker/machine` 仓库的一个 fork。 |
| machine-package | https://github.com/rancher/machine-package | 用于构建 Rancher Docker Machine 二进制文件。 |
| kontainer-engine | https://github.com/rancher/kontainer-engine | kontainer-engine 的源码仓库，它是配置托管 Kubernetes 集群的工具。 |
| RKE repository | https://github.com/rancher/rke | Rancher Kubernetes Engine 的源码仓库，该工具可在任何机器上配置 Kubernetes 集群。 |
| CLI | https://github.com/rancher/cli | Rancher 2.x 中使用的 Rancher CLI 的源码仓库。 |
| (Rancher) Helm repository | https://github.com/rancher/helm | 打包的 Helm 二进制文件的源码仓库。这是 `helm/helm` 仓库的一个 fork。 |
| Telemetry repository | https://github.com/rancher/telemetry | Telemetry 二进制文件的源码仓库。 |
| loglevel repository | https://github.com/rancher/loglevel | loglevel 二进制文件的源码仓库，用于动态更改日志级别。 |

要查看 Rancher 使用的所有库/项目，请查看 `rancher/rancher` 仓库中的 [`go.mod` 文件](https://github.com/rancher/rancher/blob/master/go.mod)。

![Rancher diagram]({{<baseurl>}}/img/rancher/ranchercomponentsdiagram.svg)<br/>
<sup>用于配置/管理 Kubernetes 集群的 Rancher 组件。</sup>

## 构建

每个仓库都应该有一个 Makefile，并且可以使用 `make` 命令进行构建。`make` 目标基于仓库中 `/scripts` 目录中的脚本，每个目标都使用 [Dapper](https://github.com/rancher/dapper) 在孤立的环境中运行。`Dockerfile.dapper` 将用于此操作，它包含了所需的所有构建工具。

默认目标是 `ci`，它将运行 `./scripts/validate`、`./scripts/build`、`./scripts/test ` 和 `./scripts/package`。生成的二进制文件将在 `./build/bin` 中，通常也打包在 Docker 镜像中。

## Bug、Issue 和疑问

如果你发现任何 bug 或问题，由于有人可能遇到过同样的问题，或者我们已经正在寻找解决方案，因此请先在[已报告 issue](https://github.com/rancher/rancher/issues) 中搜索。

如果找不到与你的问题相关的内容，请通过[提出 issue](https://github.com/rancher/rancher/issues/new) 与我们联系。与 Rancher 相关的仓库有很多，但请将 issue 提交到 Rancher 仓库中，这样能确保我们能看到这些 issue。如果你想就一个用例提出问题或询问其他用户，你可以在 [Rancher 论坛](https://forums.rancher.com)上发帖。

### 提交 Issue 的检查清单

提交问题时请遵循此清单，以便我们调查和解决问题。如果你能提供更多信息，我们就可以使用更多数据来确定导致问题的原因或发现更多相关的内容。

> **注意**：如果数据量很大，请使用 [GitHub Gist](https://gist.github.com/) 或类似工具，并在 issue 中链接你创建的资源。
> **重要提示**：请删除所有敏感数据。

- **资源**：请尽量详细地提供所使用的资源。导致问题的原因可能很多，因此请尽量提供更多细节来帮助我们确定根本原因。下面是一些参考示例：
   - **主机**：主机的规格（例如 CPU/内存/磁盘），运行在什么云厂商上，使用的 Amazon Machine Image，使用的 DigitalOcean droplet，配置的镜像（复现时用于重新构建或使用）。
   - **操作系统**：使用的是什么操作系统。在此处提供详细信息，例如 `cat /etc/os-release` 的输出（确切的操作系统版本）和 `uname -r` 的输出（确切的内核）。
   - **Docker**：使用的 Docker 版本以及安装的方法。Docker 的大部分详情都可以在 `docker version` 和 `docker info` 的输出中找到。
   - **环境**：是否使用了代理，是否使用可信的 CA/自签名证书，是否使用了外部负载均衡器。
   - **Rancher**：使用的 Rancher 版本，可以在 UI 左下角或者从主机运行的 image 标签中获取。
   - **集群**：创建了什么样的集群，如何创建的，在创建时指定了什么参数。
- **复现 issue 的步骤**：尽量详细地说明你是如何触发所报告的情况的。这有助于复现你的情况。
   - 提供从创建到你报告的情况使用的手动步骤或自动化脚本。
- **日志**：提供使用资源的数据/日志。
   - Rancher
      - Docker 安装

         ```
         docker logs \
         --timestamps \
         $(docker ps | grep -E "rancher/rancher:|rancher/rancher " | awk '{ print $1 }')
         ```
      - 使用 `kubectl` 的 Kubernetes 安装

         > **注意**：确保你配置了正确的 kubeconfig（例如，如果 Rancher 安装在 Kubernetes 集群上，则 `export KUBECONFIG=$PWD/kube_config_cluster.yml`）或通过 UI 使用了嵌入式 kubectl。

         ```
         kubectl -n cattle-system \
         logs \
         -l app=rancher \
         --timestamps=true
         ```
      - 在 RKE 集群的每个节点上使用 `docker` 的 Docker 安装

         ```
         docker logs \
         --timestamps \
         $(docker ps | grep -E "rancher/rancher@|rancher_rancher" | awk '{ print $1 }')
         ```
      - 使用 RKE 附加组件的 Kubernetes 安装

         > **注意**：确保你配置了正确的 kubeconfig（例如，如果 Rancher Server 安装在 Kubernetes 集群上，则 `export KUBECONFIG=$PWD/kube_config_cluster.yml`）或通过 UI 使用了嵌入式 kubectl。

         ```
         kubectl -n cattle-system \
         logs \
         --timestamps=true \
         -f $(kubectl --kubeconfig $KUBECONFIG get pods -n cattle-system -o json | jq -r '.items[] | select(.spec.containers[].name="cattle-server") | .metadata.name')
         ```
   - 系统日志记录（可能不存在，取决于操作系统）
      - `/var/log/messages`
      - `/var/log/syslog`
      - `/var/log/kern.log`
   - Docker Daemon 日志记录（可能并不全部存在，取决于操作系统）
      - `/var/log/docker.log`
- **指标**：如果你遇到性能问题，请提供尽可能多的指标数据（文件或屏幕截图）来帮助我们确定问题。如果你遇到机器相关的问题，你可以提供 `top`、`free -m`、`df` 的输出，这些输出会显示进程/内存/磁盘的使用情况。

## 文档

如果你对我们的文档有修改意见，请在我们的文档仓库中提交 PR。

- [Rancher 2.x 文档仓库](https://github.com/rancher/docs)：Rancher 2.x 所有文档都在这个仓库中。具体位于仓库的 `content` 文件夹中。

- [Rancher 1.x 文档仓库](https://github.com/rancher/rancher.github.io)：Rancher 1.x 所有文档都在这个仓库中。具体位于仓库的 `rancher` 文件夹中。
