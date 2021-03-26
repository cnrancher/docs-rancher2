---
title: 使用Rancher CLI
description: Rancher CLI(命令行界面)是一个命令行工具，可用于与 Rancher 进行交互。二进制文件可以直接从 UI 下载。该链接可以在 Rancher UI 的右下角找到。我们有 Windows，Mac 和 Linux 的二进制文件。您也可以在CLI 的发行页面 https://github.com/rancher/cli/releases 上直接下载该二进制文件。
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
  - Rancher命令行
  - 使用Rancher CLI
---

Rancher CLI(命令行界面)是一个命令行工具，可用于与 Rancher 进行交互。

## 下载 Rancher CLI

Rancher 提供了 Windows、Mac 和 Linux 的 Rancher CLI 二进制文件下载链接，该链接位于 Rancher UI 的右下角，单击链接可以下载 Rancher CLI 二进制文件。除此之外，您还可以访问 Rancher 的 GitHub 页面，导航到[CLI 发行页面](https://github.com/rancher/cli/releases)，下载该二进制文件。

:::note 提示
国内用户，可以导航到 http://mirror.cnrancher.com 下载所需资源
:::

## 要求

下载 Rancher CLI 后，需要配置一些参数：

- 您的[Rancher Server URL](/docs/rancher2/admin-settings/_index)，用于连接到 Rancher Server。
- API Bearer Token，用于与 Rancher 进行身份验证。有关获取 Bearer Token 的更多信息，请参见[创建 API 密钥](/docs/rancher2/user-settings/api-keys/_index)。

## CLI 认证

在使用 Rancher CLI 控制 Rancher Server 之前，必须使用 API​​ Bearer Token 进行身份验证。使用以下命令登录(用您的信息替换 `<BEARER_TOKEN>` 和 `<SERVER_URL>` )：

```bash
$ ./rancher login https://<SERVER_URL> --token <BEARER_TOKEN>
```

如果您的 Rancher Server 使用的是自签名证书，则 Rancher CLI 会询问您是否继续连接。

## 选择项目

在执行任何命令之前，必须选择一个 Rancher 项目(Project)来对其执行命令。要选择要运行的[项目](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)，请使用命令 `./rancher context switch` 切换或选择项目。输入此命令时，将显示可用项目的列表。输入数字以选择您的项目。

例如： `./rancher context switch` 输出

```bash
User:rancher-cli-directory user$ ./rancher context switch
NUMBER    CLUSTER NAME   PROJECT ID              PROJECT NAME
1         cluster-2      c-7q96s:p-h4tmb         project-2
2         cluster-2      c-7q96s:project-j6z6d   Default
3         cluster-1      c-lchzv:p-xbpdt         project-1
4         cluster-1      c-lchzv:project-s2mch   Default
Select a Project:
```

输入数字“3”，单击回车键，控制台会显示两条消息，第一条说明您已切换到项目`project-1`，第二条说明修改`project-1`参数后，这些改动会被保存到`/Users/markbishop/.rancher`路径下的`cli2.json`文件中。

```bash
INFO[0005] Setting new context to project project-1
INFO[0005] Saving config to /Users/markbishop/.rancher/cli2.json
```

## 指令列表

以下指令可在 Rancher CLI 中使用。

| 指令                                          | 作用                                                                                                                                                                                                                                                                                         |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps, [app]`                                 | 对应用商店 App 执行操作 (例如，单个[Helm charts](https://helm.sh/docs/) 或 [Rancher charts](/docs/rancher2/helm-charts/adding-catalogs/_index))。                                                                                                                                            |
| `catalog`                                     | 对[应用商店](/docs/rancher2/helm-charts/_index)执行操作。                                                                                                                                                                                                                                    |
| `clusters, [cluster]`                         | 对您的[集群](/docs/rancher2/cluster-provisioning/_index)执行操作。                                                                                                                                                                                                                           |
| `context`                                     | 在 Rancher 的[项目](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)间切换。请看示例[选择项目](#选择项目)。                                                                                                                                                                      |
| `inspect [OPTIONS] [RESOURCEID RESOURCENAME]` | 显示有关[Kubernetes 资源](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#resource-types)或 Rancher 资源(例如：[项目](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)和[工作负载](/docs/rancher2/k8s-in-rancher/workloads/_index))的详细信息，通过名称或 ID 指定资源。 |
| `kubectl`                                     | 执行[kubectl 指令](https://kubernetes.io/docs/reference/kubectl/overview/#operations)。                                                                                                                                                                                                      |
| `login, [l]`                                  | 登录进一个 Rancher Server。例如：[CLI 认证](#cli认证)。                                                                                                                                                                                                                                      |
| `namespaces, [namespace]`                     | 对[命名空间](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)执行操作。                                                                                                                                                                                                          |
| `nodes, [node]`                               | 对[节点](/docs/rancher2/overview/concepts/_index)执行操作。                                                                                                                                                                                                                                  |
| `projects, [project]`                         | 对[项目](/docs/rancher2/cluster-admin/projects-and-namespaces/_index)执行操作。                                                                                                                                                                                                              |
| `ps`                                          | 显示项目中的[工作负载](/docs/rancher2/k8s-in-rancher/workloads/_index)。                                                                                                                                                                                                                     |
| `settings, [setting]`                         | 显示当前 Rancher Server 的设置。                                                                                                                                                                                                                                                             |
| `ssh`                                         | 使用 SSH 协议连接到集群里的节点。                                                                                                                                                                                                                                                            |
| `help, [h]`                                   | 显示命令列表或某个命令的帮助信息。                                                                                                                                                                                                                                                           |

## Rancher CLI 帮助命令

使用 CLI 登录到 Rancher Server 后，输入 `./rancher --help` 可以查看可用的命令列表。

所有命令都接受 `--help` 参数，可以通过该参数查看每个命令行的用法。
