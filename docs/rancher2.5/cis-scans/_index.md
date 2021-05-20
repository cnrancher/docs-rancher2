---
title: CIS 扫描
description: description
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
  - CIS 扫描
  - rancher 2.5
---

Rancher 可以运行安全扫描，检查 Kubernetes 是否按照 CIS Kubernetes 基准中定义的安全最佳实践进行部署。

`rancher-cis-benchmark`应用程序利用 kube-bench，一个来自 Aqua Security 的开源工具，检查集群是否符合 CIS Kubernetes 基准。此外，为了生成整个集群的报告，该应用程序利用 Sonobuoy 进行报告汇总。

## Rancher v2.5 中的变化

我们现在支持在任何 Kubernetes 集群上运行 CIS 扫描，包括托管的 Kubernetes 提供商，如 EKS、AKS 和 GKE。以前只支持在 RKE Kubernetes 集群上运行 CIS 扫描。

在 Rancher v2.4 中，CIS 扫描工具可在 Rancher UI 中的**集群管理器**中使用。现在，它在**集群资源管理器**中可用，并且可以使用 Helm 图启用和部署。它可以从 Rancher UI 中安装，但也可以独立于 Rancher 安装。它为集群部署 CIS 扫描操作员，并为集群扫描部署 Kubernetes 自定义资源。自定义资源可以直接从集群资源管理器中进行管理。

在 Rancher v2.4 通过集群管理器提供的 CIS 扫描工具 v1 中，可以重复扫描。现在，从 Rancher v2.5.4 开始，CIS v2 也具备了重复扫描的功能。

Rancher v2.5 提供对集群扫描结果的警报。

### Rancher v2.5 允许的和加固的配置文件

在 Rancher v2.4 中，包含了允许的和加固的配置文件。在 Rancher v2.5.0-v2.5.3 和 v2.5.4 中，包含了更多的配置文件。

#### v2.5.0-v2.5.3

- Generic CIS 1.5
- RKE permissive
- RKE hardened
- EKS
- GKE

#### v2.5.4

- Generic CIS 1.5
- Generic CIS 1.6
- RKE permissive 1.5
- RKE hardened 1.5
- RKE permissive 1.6
- RKE hardened 1.6
- EKS
- GKE
- RKE2 permissive 1.5
- RKE2 permissive 1.5

### Rancher v2.5 默认配置文件

默认配置文件取决于要扫描的集群类型。

#### v2.5.0-v2.5.3

`rancher-sis-benchmark`目前支持 CIS 1.5 基准版本。

- 对于 RKE Kubernetes 集群，RKE 允许的配置文件是默认的。
- EKS 和 GKE 有自己的 CIS 基准，由`kube-bench`发布。这些集群默认使用相应的测试配置文件。
- 对于 RKE、EKS 和 GKE 以外的集群类型，默认使用通用 CIS 1.5 配置文件。

#### v2.5.4

`rancher-sis-benchmark`目前支持 CIS 1.6 基准版本。

- 对于 RKE Kubernetes 集群，RKE 允许的配置文件是 1.6。
- EKS 和 GKE 有自己的 CIS 基准，由 kube-bench 发布。这些集群默认使用相应的测试配置文件。
- 对于 RKE2 Kubernetes 集群，默认使用 RKE2 Permissive 1.5 配置文件。
- 对于 RKE、RKE2、EKS 和 GKE 以外的集群类型，默认使用通用 CIS 1.5 配置文件。

:::note 注意
部署 CIS v2 时，CIS v1 不能在集群上运行。也就是说，安装了`rancher-sis-benchmark`后，进入 Rancher UI 中的集群管理视图，单击**工具 > CIS 扫描**，就不能运行扫描了。
:::

## 关于 CIS 基准

CIS 是一个非营利组织，成立于 2000 年 10 月，其使命是 "确定、开发、验证、促进和维持网络防御的最佳做法解决方案，并建立和领导社区，以促成网络空间的信任环境"。该组织总部设在纽约东格林布什，成员包括大公司、政府机构和学术机构。

CIS 基准是目标系统安全配置的最佳实践。CIS 基准是由主题专家、技术供应商、公共和私人社区成员以及 CIS 基准开发团队慷慨的志愿工作而制定的。

正式的基准文件可通过[CIS 网站](https://learn.cisecurity.org/benchmarks)获取。

## 安装 rancher-cis-benchmark

1. 在 Rancher UI 中，进入**集群浏览器**。
1. 单击**应用程序**。
1. 单击`rancher-cis-benchmark`。
1. 单击**安装**。

**结果：**CIS 扫描应用程序部署在 Kubernetes 集群上。

## 卸载 rancher-cis-benchmark

1. 从**集群资源管理器中，**进入左上角的下拉菜单，并单击**应用程序和市场**。
1. 单击**安装的应用程序**。
1. 进入`cis-operator-system`命名空间，选中`rancher-cis-benchmark-crd`和`rancher-cis-benchmark`旁边的方框。
1. 单击**删除**，确认**删除**。

**结果：** `rancher-cis-benchmark`应用程序已被卸载。

## 运行扫描

当创建 ClusterScan 自定义资源时，它会为所选的 ClusterScanProfile 在集群上启动新的 CIS 扫描。

:::note 注意
目前有一个限制，即一次只能为一个集群运行一个 CIS 扫描。如果您创建了多个 ClusterScan 自定义资源，操作员将一个接一个地运行它们，直到一个扫描结束，其余的 ClusterScan 自定义资源将处于“waiting”状态。
:::

1. 进入 Rancher UI 中的**集群资源管理器**。在左上角下拉菜单中，单击**集群资源管理器 > CIS 基准**。
1. 在**扫描**部分，单击**创建**。
1. 选择一个集群扫描配置文件。配置文件决定将使用哪个 CIS Benchmark 版本以及将执行哪些测试。如果您选择了默认配置文件，那么 CIS 操作员将选择适用于其安装的 Kubernetes 集群类型的配置文件。
1. 单击**创建**。

2.**结果：**会生成一份包含扫描结果的报告。要查看结果，请单击出现的扫描名称。

## 跳过测试

您可以使用带有用户定义跳过的测试配置文件运行 CIS 扫描。

您需要创建一个自定义 CIS 扫描配置文件，跳过测试。配置文件包含 CIS 扫描的配置，其中包括要使用的基准版本和该基准中要跳过的任何特定测试。

1. 在**群组资源管理器中**，转到左上角下拉菜单，然后单击**CIS 基准**。
1. 单击**配置文件**。
1. 从这里，您可以以多种方式创建配置文件。要创建一个新的配置文件，单击**创建**并在用户界面中填写表格。要基于现有的配置文件制作新的配置文件，请进入现有的配置文件，单击三个垂直点，然后单击**克隆为 YAML**如果您正在填写表格，请使用测试 ID 添加要跳过的测试，使用相关的 CIS 基准作为参考。如果您是以 YAML 形式创建新的测试配置文件，您将在`skipTests`指令中添加要跳过的测试的 ID。你也要给这个配置文件一个名字。

   ```yaml
   apiVersion: cis.cattle.io/v1
   kind: ClusterScanProfile
   metadata:
     annotations:
       meta.helm.sh/release-name: clusterscan-operator
       meta.helm.sh/release-namespace: cis-operator-system
     labels:
       app.kubernetes.io/managed-by: Helm
     name: "<example-profile>"
   spec:
     benchmarkVersion: cis-1.5
     skipTests:
       - "1.1.20"
       - "1.1.21"
   ```

1. 单击**Create**。

**结果：**一个新的 CIS 扫描配置文件已经创建。

当您使用该配置文件运行扫描时，定义的测试将在扫描期间跳过。跳过的测试将在生成的报告中标记为“skipped”。

## 查看报告

要查看生成的 CIS 扫描报告。

1. 在**群资源管理器中，**进入左上角下拉菜单，单击**群资源管理器>CIS 基准**。
1. 在**扫描**页面将显示生成的报告。要查看详细的报告，请转到扫描报告并单击名称。

可以从扫描列表或扫描详情页面下载报告。

## 关于生成的报告

扫描生成的报告可以在 Rancher 用户界面中查看，也可以以 CSV 格式下载。

在 Rancher v2.5 中，扫描将使用 CIS Benchmark v1.5。基准版本包含在生成的报告中。

该基准提供两种类型的建议。得分和不得分。在基准中标记为 "不得分 "的建议不包括在生成的报告中。

有些测试被指定为 "不适用"。由于 Rancher 提供 RKE 集群的方式，这些测试不会在任何 CIS 扫描上运行。有关如何审核测试结果，以及为什么某些测试被指定为 "不适用 "的信息，请参阅 Rancher 的相应 Kubernetes 版本的自我评估指南。

该报告包含以下信息：

| 报告中的参数      | 描述                                                                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | CIS 基准的 ID 号。                                                                                                                 |
| `description`     | CIS 基准测试的描述。                                                                                                               |
| `remediation`     | 需要解决什么问题才能通过测试。                                                                                                     |
| `state`           | 测试结果：通过、失败、跳过或不适用。                                                                                               |
| `node_type`       | 节点角色，影响哪些测试在节点上运行。master 测试在 controlplane 上运行，etcd 测试在 etcd 节点上运行，节点测试在 worker 节点上运行。 |
| `audit`           | 这是`kube-bench`为这次测试运行的审计检查。                                                                                         |
| `audit_config`    | 任何适用于审计脚本的配置。                                                                                                         |
| `test_info`       | `kube-bench'报告的测试相关信息。                                                                                                   |
| `commands`        | `kube-bench`报告的与测试有关的命令。                                                                                               |
| `config_commands` | `kube-bench`报告的测试相关配置数据。                                                                                               |
| `actual_value`    | 测试的实际值，如果由`kube-bench'报告，则为当前值。                                                                                 |
| `expected_result` | 测试的预期结果，如果由`kube-bench`报告，则存在。                                                                                   |

请参阅表格，了解 Kubernetes、Benchmark、Rancher 和我们的集群加固指南的哪些版本相互对应。此外，还请参考加固指南，了解符合 CIS 标准的集群的配置文件和有关补救失败测试的信息。

## 测试配置文件

可提供以下配置文件：

- Generic CIS 1.5
- RKE permissive
- RKE hardened
- EKS
- GKE

您还可以通过保存一组要跳过的测试来自定义配置文件。

所有配置文件都会有一组不适用的测试，这些测试将在 CIS 扫描期间被跳过。根据 RKE 集群管理 Kubernetes 的方式，这些测试是不适用的。

有 2 种类型的 RKE 集群扫描配置文件：

- **Permissive**：这个配置文件有一组测试将被跳过，因为这些测试在默认的 RKE Kubernetes 集群上会失败。除了跳过的测试列表，该配置文件也不会运行不适用的测试。
- **hardened**：该配置文件将不会跳过任何测试，除了不适用的测试。

EKS 和 GKE 集群扫描配置文件基于这些类型集群特有的 CIS Benchmark 版本。

为了通过`hardened`配置文件，您需要按照步骤进行操作，并使用加固指南中定义的`cluster.yml`来配置 hardened 集群。

## 关于跳过和不适用的测试

关于跳过的和不适用的测试列表，请参考[本页面](/docs/rancher2.5/cis-scans/skipped-tests/_index)。

目前，只有用户定义的跳过测试才会在生成的报告中标记为跳过。

任何被默认配置文件定义为跳过的测试都被标记为不适用。

## 基于角色的访问控制

有关权限的信息，请参考[本页面](/docs/rancher2.5/cis-scans/rbac/_index)。

## 配置

有关为扫描、配置文件和基准版本配置自定义资源的更多信息，请参阅[本页面](/docs/rancher2.5/cis-scans/configuration/_index)。
