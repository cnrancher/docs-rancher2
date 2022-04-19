---
title: 集群访问
weight: 1
---

本节介绍可以用来访问 Rancher 管理的集群的工具。

有关如何授予用户访问集群的权限的信息，请参阅[将用户添加到集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/cluster-members/)。

有关基于角色的访问控制的更多信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac/)。

有关如何设置身份验证系统的信息，请参阅[本节]({{<baseurl>}}/rancher/v2.6/en/admin-settings/authentication/)。

### Rancher UI

Rancher 提供了一个直观的用户界面来让你与集群进行交互。UI 中所有可用的选项都使用 Rancher API。因此，UI 中的任何操作都可以在 Rancher CLI 或 Rancher API 中进行。

### kubectl

你可以使用 Kubernetes 命令行工具 [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) 来管理你的集群。使用 kubectl 有两种选择：

- **Rancher kubectl shell**：通过启动 Rancher UI 中可用的 kubectl shell 与集群交互。此选项不需要你进行任何配置操作。有关详细信息，请参阅[使用 kubectl Shell 访问集群]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/cluster-access/kubectl/)。
- **终端远程连接**：你也可以通过在本地桌面上安装 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)，然后将集群的 kubeconfig 文件复制到本地 `~/.kube/config` 目录来与集群交互。有关更多信息，请参阅[使用 kubectl 和 kubeconfig 文件访问集群](./kubectl/)。

### Rancher CLI

你可以下载 Rancher 自己的命令行工具 [Rancher CLI]({{<baseurl>}}/rancher/v2.6/en/cli/) 来控制你的集群。这个 CLI 工具可以直接与不同的集群和项目进行交互，或者向它们传递 `kubectl` 命令。

### Rancher API

最后，你可以通过 Rancher API 与集群进行交互。在使用 API 之前，你必须先获取 [API 密钥]({{<baseurl>}}/rancher/v2.6/en/user-settings/api-keys/)。要查看 API 对象的不同资源字段和操作，请打开 API UI（API UI 可以通过单击 Rancher UI 对象的**在 API 中查看**访问）。
