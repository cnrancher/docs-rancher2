---
title: Octopus 开发指南
description: Octopus 借鉴了Maven，并基于make提供了一组项目构建管理工具。 生成管理过程包含多个阶段，一个阶段包含多个操作。 为了方便起见，动作的名称也代表当前阶段。 动作的总体流程关系如下所示
keywords:
  - Octopus中文文档
  - Octopus 中文文档
  - 边缘计算
  - IOT
  - edge computing
  - Octopus中文
  - Octopus 中文
  - Octopus
  - Octopus教程
  - Octopus中国
  - rancher
  - Octopus 中文教程
  - 适配器
  - Octopus 开发指南
---

## 建立 Octopus 管理流程

Octopus 借鉴了[Maven](https://maven.apache.org/)，并基于[make](https://www.gnu.org/software/make/manual/make.html)提供了一组项目构建管理工具。 生成管理过程包含多个阶段，一个阶段包含多个操作。 为了方便起见，动作的名称也代表当前阶段。 动作的总体流程关系如下所示：

```text
          generate -> mod -> lint -> build -> package -> deploy
                                         \ -> test -> verify -> e2e
```

每个动作的说明：

| 动作名称/当前阶段      | 作用                                                                                                                                                                                                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `generate`, `gen`, `g` | 通过[`controller-gen`](https://github.com/kubernetes-sigs/controller-tools/blob/master/cmd/controller-gen/main.go)生成`octopus`的部署清单和 deepcopy/runtime.Object 实现；通过[`protoc`](https://github.com/protocolbuffers/protobuf)生成`adaptor`接口的 proto 文件 |
| `mod`, `m`             | 下载 Octopus 的依赖文件                                                                                                                                                                                                                                             |
| `lint`, `l`            | 通过[`golangci-lint`](https://github.com/golangci/golangci-lint)来验证`octopus`，如果安装失败，则回滚到`go fmt`和`go vet`。<br/<br/> 使用`DIRTY_CHECK=true`验证整个项目是否在 dirty tree 中。                                                                       |
| `build`, `b`           | 根据操作系统的类型和架构编译`octopus`，生成二进制文件到`bin`目录。<br/><br/> 使用 "CROSS=true "编译支持的平台的二进制文件(在这个 repo 中搜索`constant.sh`文件)。                                                                                                    |
| `test`, `t`            | 运行单元测试                                                                                                                                                                                                                                                        |
| `verify`, `v`          | 使用 Kubernetes 集群运行集成测试。<br/><br/> 使用`CLUSTER_TYPE`来指定本地集群的类型，默认为`k3d`。不需要设置本地集群，也可以使用环境变量`USE_EXISTING_CLUSTER=true`指出一个现有的集群，然后集成测试将使用当前环境的 kubeconfig 与现有集群进行通信。                 |
| `package`, `pkg`, `p`  | 打包 Docker 镜像                                                                                                                                                                                                                                                    |
| `e2e`, `e`             | 运行 E2E 测试                                                                                                                                                                                                                                                       |
| `deploy`, `dep`, `d`   | 推送 Docker 镜像并为当前版本创建 manifest 镜像。<br/><br/> 使用`WITHOUT_MANIFEST=true`防止推送 manifest 镜像，或者使用`ONLY_MANIFEST=true`只推送 manifest 镜像，使用`IGNORE_MISSING=true`在需要时对平台列表中定义的缺失镜像发出警告。                               |

执行一个阶段可以运行`make octopus <stage name>`，例如，在执行`test`阶段时，请运行`make octopus test`。 要执行一个阶段，将执行先前顺序中的所有动作，如果运行`make octopus test`，则实际上包括执行`generate`，`mod`，`lint`，`build`和`test`动作。

要通过添加`only`命令来运行某个动作，例如，如果仅运行`build`动作，请使用`make octopus build only`。

要组合多个动作，可以使用逗号列表，例如，如果要按顺序运行`build`，`package`和`deploy`动作，请使用`make octopus build，package，deploy`。

通过`BY`环境变量与[`dapper`](https://github.com/rancher/dapper)集成，例如，如果仅通过[`dapper`](https://github.com/rancher/dapper)运行`build`动作，请使用`BY=dapper make octopus build`。

### 使用案例

假设在 Mac 上尝试以下示例：

1. 在本地主机上运行，当前环境将安装其他依赖项。 如果任何安装失败，您将收到相应的警告。

   - `make octopus build`：执行`build`阶段，然后获取`darwin/amd64` 的可执行二进制文件。
   - `make octopus test only`：在`darwin/amd64`平台上执行`test` 动作。
   - `REPO=somebody OS=linux ARCH=amd64 make octopus package`：执行`package` 动作，完成后可获取`linux/amd64` 的可执行二进制文件和一个 Repo 名为`somebody`的 Octopus `linux/amd64` 的镜像。
   - `CLUSTER_TYPE=make octopus verify only`：使用[`kind`](https://github.com/kubernetes-sigs/kind)集群执行`verify`操作。

1. 在本地主机中支持多架构镜像。

   - `CROSS=true make octopus build only`： 执行`build` 操作，然后获取受支持平台的所有执行二进制文件。
   - `CROSS=true make octopus test only`： _目前不支持交叉平台测试_。
   - `CROSS=true REPO=somebody make octopus package only`： 执行`package` 操作，指定镜像的组织名为`somebody` 并构建所有支持的平台的镜像。
     - `make octopus package only`： _当前不支持`darwin` 平台的镜像_.
   - `CROSS=true REPO=somebody make octopus deploy only`： 执行`deploy` 操作，然后将所有支持的平台的镜像推送至`somebody` 仓库，并且创建当前版本的[Manifest 文件](https://docs.docker.com/engine/reference/commandline/manifest/).
     - `make octopus deploy only`： _当前不支持`darwin` 平台镜像_.

1. 在[`dapper`](https://github.com/rancher/dapper)模式下构建，当前环境中不需要其他依赖项，这类选项适合于构造 CI/CD，并具有良好的环境可移植性。
   - `BY=dapper make octopus build`：执行`build` 阶段，然后获取`linux/amd64` 可执行二进制文件。
   - `BY=dapper make octopus test`：在`linux/amd64`平台上执行`test` 操作。
   - `BY=dapper REPO=somebody make octopus package only`：执行`package` 操作并获得`linux/amd64`架构和组织名为`sombody`的镜像。

### 注意事项

在[`dapper`](https://github.com/rancher/dapper)模式下：

- **不允许使用** `USE_EXISTING_CLUSTER=true`。

## 适配器的生成管理

适配器的构建管理与 Octopus 相似，但执行方式不同。 执行任何适配器的阶段都可以运行`make adapter <适配器名称> <阶段名称>`。 请查看[开发适配器](/docs/octopus/adaptors/develop/_index)了解更多详细信息。

## 所有组件的构建管理

随着组件的增加，一个接一个地构建它们的操作变得更加麻烦。 因此，通过指定阶段或动作，构建管理对所有组件执行相同的阶段或动作。 例如，运行`make all test`将执行 Octopus 和所有适配器的`test`阶段。 要执行一个动作，只需输入一个`only`后缀命令即可。

## 贡献者工作流程

欢迎进行贡献，请查看[CONTRIBUTING](https://github.com/cnrancher/octopus/blob/master/CONTRIBUTING.md)以获取更多详细信息。
