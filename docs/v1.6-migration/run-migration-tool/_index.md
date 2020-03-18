---
title: 迁移服务
---

尽管默认情况下 v1.6 提供的服务将无法在 Rancher v2.x 中运行，但这并不意味着你必须重新开始在 v2.x 中手动重建应用程序。为了帮助从 v1.6 迁移到 v2.x，Rancher 开发了一个迁移工具。迁移工具 CLI 是一个实用程序，可帮助你在 Rancher v2.x 中重新创建应用程序。该工具将你的 Rancher v1.6 服务导出为 Compose 文件，并将它们转换为 Rancher v2.x 可以使用的 Kubernetes 清单。

此外，对于 Kubernetes 无法使用的每个特定于 Rancher v1.6 的 Compose 指令，迁移工具 CLI 均提供了有关如何在 Rancher v2.x 中手动重新创建它们的说明。

此命令行界面工具将：

- 导出 v1.6 Cattle 环境中每个堆栈的 Compose 文件（即`docker-compose.yml`和`rancher-compose.yml`）。对于每个堆栈，文件都将导出到一个唯一的文件夹： `<EXPORT_DIR>/<ENV_NAME>/<STACK_NAME>`。

- 解析从 Rancher v1.6 堆栈导出的 Compose 文件并将其转换为 Rancher v2.x 可以使用的 Kubernetes 清单。该工具还会输出无法自动转换为 Rancher v2.x 的 Compose 文件中存在的指令列表。这些是你必须使用 Rancher v2.x UI 手动配置的指令。

## 1. 下载迁移工具 CLI

可以下载适用于你平台的迁移工具 CLI 从我们的[GitHub 发布页面](https://github.com/rancher/migration-tools/releases). 这些工具可用于 Linux，Mac 和 Windows 平台。

## 2. 配置迁移工具 CLI

下载迁移工具 CLI 后，将其重命名并使其可执行。

1. 打开一个终端窗口，然后进入到包含迁移工具文件的目录。

1. 将文件重命名为`migration-tools`，使其不再包含平台名称。

1. 输入以下命令以使 `migration-tools` 可执行：

   ```
   chmod +x migration-tools
   ```

## 3. 运行迁移工具 CLI

接下来，使用迁移工具 CLI 将所有 Cattle 环境中的所有堆栈导出到 Compose 文件中。然后，对于要迁移到 Rancher v2.x 的堆栈，将 Compose 文件转换为 Kubernetes 清单。

> **前提条件:** 创建一个 [Account API Key](https://docs.rancher.com/docs/rancher/v1.6/en/api/v2-beta/api-keys/#account-api-keys) 使用迁移工具 CLI 时使用 Rancher v1.6 进行身份验证。

1. 从 Rancher v1.6 导出适用于 Cattle 环境和堆栈的 Docker Compose 文件。

   在终端窗口中，执行以下命令，将每个占位符替换为你的值。

   ```
   migration-tools export --url http://<RANCHER_URL:PORT> --access-key <RANCHER_ACCESS_KEY> --secret-key <RANCHER_SECRET_KEY> --export-dir <EXPORT_DIR> --all
   ```

   **步骤结果:** 迁移工具导出`--export-dir`目录中每个堆栈的 Compose 文件（`docker-compose.yml`和`rancher-compose.yml`）。如果省略此选项，则 Compose 文件将输出到当前目录。

   为每个环境和堆栈创建一个唯一的目录。例如，如果我们从 Rancher v1.6 中导出每个[环境/堆栈](/docs/v1.6-migration/_index)，则创建以下目录结构：

   ```
   export/                            # migration-tools --export-dir
   |--<ENVIRONMENT>/                  # Rancher v1.6 ENVIRONMENT
       |--<STACK>/                    # Rancher v1.6 STACK
            |--docker-compose.yml     # STANDARD DOCKER DIRECTIVES FOR ALL STACK SERVICES
            |--rancher-compose.yml    # RANCHER-SPECIFIC DIRECTIVES FOR ALL STACK SERVICES
            |--README.md              # README OF CHANGES FROM v1.6 to v2.x
   ```

1. 将导出的 Compose 文件转换为 Kubernetes 清单。

   执行以下命令，将每个占位符替换为堆栈的 Compose 文件的绝对路径。如果要迁移多个堆栈，则必须为导出的每对 Compose 文件重新运行该命令。

   ```
   migration-tools parse --docker-file <DOCKER_COMPOSE_ABSOLUTE_PATH> --rancher-file <RANCHER_COMPOSE_ABSOLUTE_PATH>
   ```

   > **注意:** 如果你从命令中省略了`--docker-file`和 `--rancher-file`选项，则迁移工具将使用当前工作目录来查找 Compose 文件。

> **想要迁移工具 CLI 的完整用法和选项?** 查看 [迁移工具 CLI 参考文档](/docs/v1.6-migration/run-migration-tool/migration-tools-ref/_index)。

### 迁移工具 CLI 的输出

运行 migration-tools parse 命令后，以下文件将输出到目标目录。

| 输出                | 描述                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output.txt`        | 该文件列出了如何在 Kubernetes 中重新创建特定于 Rancher v1.6 的功能。每个清单都链接到有关如何在 Rancher v2.x 中实现它的相关博客文章。                              |
| Kubernetes 清单文件 | 迁移工具在内部调用 [Kompose](https://github.com/kubernetes/kompose) 为你要迁移到 v2.x 的每个服务生成 Kubernetes 清单。每个 YAML Spec 文件均以你要迁移的服务命名。 |

#### 为什么会有单独的部署和服务清单?

为了使应用程序可以通过 URL 公开访问，需要 Kubernetes 服务来支持部署。Kubernetes 服务是一个 REST 对象，它抽象化了对工作负载中 Pod 的访问。换句话说，服务通过将 URL 映射到一个或多个 pod 来为 pod 提供一个静态端点。因此，即使 pod 更改了 IP 地址，公共端点也保持不变。服务对象使用选择器标签指向其相应的部署（工作负载）。

当你从 Rancher v1.6 导出公共端口的服务时，迁移工具 CLI 会将这些端口解析为 Kubernetes 服务 Spec 文件，该 Spec 文件会关联到部署 Spec 文件。

#### 迁移示例文件输出

如果我们从[迁移示例文件](/docs/v1.6-migration/_index)中解析两个示例文件`docker-compose.yml`和`rancher-compose.yml`，则以下文件输出：

| 文件                       | 描述                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `web-deployment.yaml`      | 包含用于 Let's Chat 部署的 Kubernetes 容器 Spec 的文件。             |
| `web-service.yaml`         | 包含 Let's Chat 服务 Spec 的文件。                                   |
| `database-deployment.yaml` | 该文件包含用于支持 Let's Chat 的 MongoDB 部署的容器 Spec。           |
| `webLB-deployment.yaml`    | 包含用于充当负载均衡器的 HAProxy 部署的容器 Spec 的文件.<sup>1</sup> |
| `webLB-service.yaml`       | 包含 HAProxy 服务 Spec 的文件。<sup>1</sup>                          |

> <sup>1</sup> 由于 Rancher v2.x 使用 Ingress 进行负载均衡，因此我们不会将 Rancher v1.6 负载均衡器迁移到 v2.x。

## 4. 以 Kubernetes 清单的形式重新部署服务

> **注意:** 尽管这些说明将你的 v1.6 服务部署在 Rancher v2.x 中，但在你调整 Kubernetes 清单之前，它们将无法正常工作。

- 通过 Rancher UI 部署

  你可以通过将迁移工具创建的 Kubernetes 清单导入 Rancher v2.x 来进行部署。

  > **接收到 `ImportYaml Error`?**
  >
  > 删除错误消息中列出的 YAML 指令。这些是 Kubernetes 无法读取的来自 v1.6 服务的 YAML 指令。

  <figcaption>部署服务：导入 Kubernetes 清单</figcaption>

  ![部署服务](/img/rancher/deploy-service.gif)

- 通过 Rancher CLI 部署

  > **前提条件:** 为 Rancher v2.x [安装 Rancher CLI](/docs/cli/_index)

  使用以下 Rancher CLI 命令让 Rancher v2.x 部署应用程序。对于迁移工具 CLI 输出的每个 Kubernetes 清单，请输入以下命令之一，以将其导入 Rancherv2.x。

  ```
  ./rancher kubectl create -f <DEPLOYMENT_YAML_FILE> # DEPLOY THE DEPLOYMENT YAML

  ./rancher kubectl create -f <SERVICE_YAML_FILE> # DEPLOY THE SERVICE YAML
  ```

导入后，你可以使用上下文菜单选择包含服务的`<集群> > <项目>`，从而在 Kubernetes 清单中以 v2.x UI 形式查看 v1.6 服务。导入的清单将显示在**资源 > 工作负载**以及**资源 > 工作负载 > 服务发现**的选项卡上。（在 v2.3.0 之前的 Rancher v2.x 中，这些文件在**工作负载**和顶部导航栏中的**服务发现**标签上。）

<figcaption>导入的服务</figcaption>

![导入服务](/img/rancher/imported-workloads.png)

## 现在怎么做?

尽管迁移工具 CLI 将你的 Rancher v1.6 Compose 文件解析为 Kubernetes 清单，但是你必须通过手动编辑已解析的 Kubernetes 清单，来解决 v1.6 和 v2.x 之间的差异。换句话说，你需要编辑刚刚导入到 Rancher v2.x 中的每个工作负载和服务，如下所示。

<figcaption>编辑迁移后的服务</figcaption>

![编辑迁移的工作负载](/img/rancher/edit-migration-workload.gif)

如[迁移工具 CLI 输出](#迁移工具-cli-的输出)中所述，解析过程中生成的 output.txt 文件列出了每个部署必须执行的手动步骤。查看接下来的议题，以获取有关手动编辑 Kubernetes Spec 的更多信息。

打开你的`output.txt`文件并查看其内容。将 Compose 文件解析为 Kubernetes 清单时，迁移工具 CLI 会为其 Kubernetes 创建的每个工作负载输出清单。例如，当我们将[迁移示例文件](/docs/v1.6-migration/_index)解析为 Kubernetes 清单时，`output.txt`列出了每个解析后的 Kubernetes 清单文件（即工作负载）。每个工作负载均具有一系列 Action，以在 v2.x 中还原该工作负载的功能。

<figcaption>Output.txt 示例</figcaption>

![output.txt](/img/rancher/output-dot-text.png)

下表列出了可能在`output.txt`中出现的指令和它们的含义以及有关如何解决它们的链接。

| 指令              | 指导                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ports][4]        | Rancher v1.6 *端口映射*无法迁移到 v2.x。相反，你必须手动声明与端口映射类似的 HostPort 或 NodePort。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [health_check][1] | Rancher v1.6 健康检查微服务已被本机 Kubernetes 健康状况检查所取代，称为*探针*。使用探针在 v2.0 中重新创建 v1.6 运行健康状况检查。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [labels][2]       | Rancher v1.6 使用标签来实现 v1.6 中的各种功能。在 v2.x 中，Kubernetes 使用不同的机制来实现这些功能。点击此处的链接以获取有关如何处理每个标签的说明。<br/><br/> [io.rancher.container.pull_image][7]：在 v1.6 中，该标签说明部署的容器拉取新版本的镜像然后重启。在 v2.x 中，此功能由`imagePullPolicy`指令代替。<br/> <br/> [io.rancher.scheduler.global][8]：在 v1.6 中，该标签在每个集群主机上调度了一个容器副本。在 v2.x 中，此功能由[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)取代。<br/> <br/> [io.rancher.scheduler.affinity][9]：在 v2.x 中，affinity 是以不同的方式应用的。 |
| [links][3]        | 在迁移期间，你必须在 Kubernetes 工作负载和服务之间创建链接，以使其在 v2.x 中正常运行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [scale][5]        | 在 v1.6 中，规模是指在单个节点上运行的容器副本的数量。在 v2.x 中，此功能由副本集代替。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| start_on_create   | 没有等效的 Kubernetes。你无需采取任何措施。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

[1]: /docs/v1.6-migration/monitor-apps/_index
[2]: /docs/v1.6-migration/schedule-workloads/_index
[3]: /docs/v1.6-migration/discover-services/_index
[4]: /docs/v1.6-migration/expose-services/_index
[5]: /docs/v1.6-migration/schedule-workloads/_index

<!-- MB: oops, skipped 6 -->

[7]: /docs/v1.6-migration/schedule-workloads/_index
[8]: /docs/v1.6-migration/schedule-workloads/_index
[9]: /docs/v1.6-migration/schedule-workloads/_index

## [下一步: 暴露你的服务](/docs/v1.6-migration/expose-services/_index)
