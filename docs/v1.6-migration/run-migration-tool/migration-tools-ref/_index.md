---
title: 迁移 CLI 工具指南
description: 迁移工具 CLI 含有多种命令和选项，以帮助您从 Rancher v1.6 迁移到 Rancherv2.x。
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
  - 版本迁移
  - 迁移服务
  - 迁移 CLI 工具指南
---

迁移工具 CLI 含有多种命令和选项，以帮助您从 Rancher v1.6 迁移到 Rancherv2.x。

### 下载

可以从我们的平台下载适用于您平台的迁移工具 CLI [GitHub 发布页面](https://github.com/rancher/migration-tools/releases). 该工具可用于 Linux，Mac 和 Windows 平台。

### 用法

```
migration-tools [global options] command [command options] [arguments...]
```

### 迁移工具全局选项

迁移工具 CLI 包含一些全局选项。

| 全局选项          | 描述                                |
| ----------------- | ----------------------------------- |
| `--debug`         | 启用调试日志记录。                  |
| `--log <VALUE>`   | 将日志输出到您输入的路径。          |
| `--help`, `-h`    | 显示所有可用命令的列表。            |
| `--version`, `-v` | 打印正在使用的迁移工具 CLI 的版本。 |

### 命令和命令选项

#### 迁移工具导出参考

`migration-tools export`命令将 Rancher v1.6 服务器中的所有堆栈导出到 Compose 文件中。

##### 选项

| 选项                   | 必需? | 描述                                                                                                |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| `--url <VALUE>`        | ✓     | Rancher API 端点 URL (`<RANCHER_URL>`).                                                             |
| `--access-key <VALUE>` | ✓     | Rancher API 访问密钥。使用帐户 API 密钥可导出所有 cattle 环境中的所有堆栈 (`<RANCHER_ACCESS_KEY>`). |
| `--secret-key <VALUE>` | ✓     | 与访问密钥关联的 Rancher API 秘密密钥。(`<RANCHER_SECRET_KEY>`).                                    |
| `--export-dir <VALUE>` |       | 组成文件导出到的基本目录，该目录在每个环境/堆栈创建的子目录下 (默认: `Export`).                     |
| `--all`, `--a`         |       | 导出所有堆栈。使用此标志可以导出处于不活跃，已停止或正在移除状态的所有堆栈。                        |
| `--system`, `--s`      |       | 导出系统和基础结构堆栈。                                                                            |

##### 用法

执行以下命令，将每个占位符替换为您的值。访问密钥和密钥令牌是帐户 API 密钥，可让您从所有 Cattle 环境中导出。

```
migration-tools export --url <RANCHER_URL> --access-key <RANCHER_ACCESS_KEY> --secret-key <RANCHER_SECRET_KEY> --export-dir <EXPORT_DIR>
```

**结果:** 迁移工具 CLI 在 `--export-dir`目录中导出每个 Cattle 环境中每个堆栈的 Compose 文件。如果省略此选项，则文件将保存到当前目录。

#### 迁移工具解析参考

`migration-tools parse`命令将 Compose 文件解析为堆栈并使用[Kompose](https://github.com/kubernetes/kompose)生成等效的 Kubernetes 清单。它还会输出一个 output.txt 文件，其中列出了所有需要人工干预才能转换为 Kubernetes 的结构体。

##### 选项

| 选项                     | 必需? | 描述                                                                         |
| ------------------------ | ----- | ---------------------------------------------------------------------------- |
| `--docker-file <VALUE>`  |       | 解析 Docker Compose 文件以输出 Kubernetes 清单(默认: `docker-compose.yml`)   |
| `--output-file <VALUE>`  |       | 输出列表检查和转换建议的文件名 (默认: `output.txt`).                         |
| `--rancher-file <VALUE>` |       | 解析 Rancher Compose 文件以输出 Kubernetes 清单(默认: `rancher-compose.yml`) |

##### 子指令

| 子指令      | 描述                                   |
| ----------- | -------------------------------------- |
| `help`, `h` | 显示可与前面的命令一起使用的选项列表。 |

##### 用法

执行以下命令，将每个占位符替换为堆栈的 Compose 文件的绝对路径。对于每个堆栈，您必须为导出的每对 Compose 文件重新运行该命令。

```
migration-tools parse --docker-file <DOCKER_COMPOSE_ABSOLUTE_PATH> --rancher-file <RANCHER_COMPOSE_ABSOLUTE_PATH>
```

> **注意:** 如果您在命令中省略了`--docker-file`和`--rancher-file`选项，则迁移工具 CLI 会在其主目录中检查这些 Compose 文件。

**结果:** 迁移工具 CLI 会解析您的 Compose 文件并输出 Kubernetes 清单规范以及一个`output.txt`文件。对于堆栈中的每个服务，都将创建一个 Kubernetes 清单，并将其命名为与您的服务相同的名称。`output.txt`文件列出了 `docker-compose.yml`中每个服务的所有结构，需要特殊处理才能成功迁移到 Rancherv2.x。每个结构都链接到有关如何在 Rancher v2.x 中实现它的相关博客文章。
