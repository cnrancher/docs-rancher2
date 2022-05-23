---
title: CIS 扫描
weight: 17
---

Rancher 可以通过运行安全扫描来检查 Kubernetes 是否按照 CIS Kubernetes Benchmark 中定义的安全最佳实践进行部署。CIS 扫描可以运行在任何 Kubernetes 集群，包括托管的 Kubernetes，例如 EKS、AKS 和 GKE。

`rancher-cis-benchmark` 应用使用了  <a href="https://github.com/aquasecurity/kube-bench" target="_blank">kube-bench</a> ，这是 Aqua Security 的开源工具，用于检查集群是否符合 CIS Kubernetes Benchmark。此外，为了生成集群级别的报告，此应用使用了  <a href="https://github.com/vmware-tanzu/sonobuoy" target="_blank">Sonobuoy</a> 来聚合报告。

- [关于 CIS Benchmark](#about-the-cis-benchmark)
- [关于生成的报告](#about-the-generated-report)
- [测试配置文件](#test-profiles)
- [跳过和不适用的测试](#about-skipped-and-not-applicable-tests)
- [基于角色的访问控制](./rbac)
- [配置](./configuration)
- [操作指南](#how-to-guides)
   - [安装 CIS Benchmark](#installing-cis-benchmark)
   - [卸载 CIS Benchmark](#uninstalling-cis-benchmark)
   - [运行扫描](#running-a-scan)
   - [定时运行扫描](#running-a-scan-periodically-on-a-schedule)
   - [跳过测试](#skipping-tests)
   - [查看报告](#viewing-reports)
   - [为 rancher-cis-benchmark 启用告警](#enabling-alerting-for-rancher-cis-benchmark)
   - [为计划的定时扫描配置告警](#configuring-alerts-for-a-periodic-scan-on-a-schedule)
   - [为集群扫描创建自定义 Benchmark 版本](#creating-a-custom-benchmark-version-for-running-a-cluster-scan)


## 关于 CIS Benchmark

CIS（Center for Internet Security）是一个 501(c\)(3) 非营利组织，成立于 2000 年 10 月，其使命是识别、开发、验证、促进和维持网络防御的最佳实践方案，并建立和指导社区，以在网络空间中营造信任的环境。该组织总部位于纽约东格林布什，其成员包括大公司、政府机构和学术机构。

CIS Benchmark 是目标系统安全配置的最佳实践。CIS Benchmark 是由安全专家、技术供应商、公开和私人社区成员，以及 CIS Benchmark 开发团队共同志愿开发的。

你可以访问 CIS 网站获取官方的 Benchmark 文件。要通过注册来访问文件，请前往<a href="https://learn.cisecurity.org/benchmarks" target="_blank">这里</a>。

## 关于生成的报告

每次扫描都会生成一份报告，你可以在 Rancher UI 中查看该报告，并以 CSV 格式下载它。

默认情况下使用 CIS Benchmark v1.6。

Benchmark 版本包含在生成的报告中。

Benchmark 提供两种类型的建议，分别是自动（Automated）和手动（Manual）。Benchmark 中标记为 Manual 的建议不包含在生成的报告中。

一些测试会被标记为“不适用”。由于 Rancher 配置 RKE 集群的方式，这些测试不会在任何 CIS 扫描中运行。有关如何审核测试结果，以及为什么某些测试会被标记为不适用，请参阅 Rancher 的 <a href="{{<baseurl>}}/rancher/v2.6/en/security/#the-cis-benchmark-and-self-assessment" target="_blank">Kubernetes 对应版本的自测指南</a>。

该报告包含以下信息：

| 报告中的列 | 描述 |
|------------------|-------------|
| `id` | CIS Benchmark 的 ID 号。 |
| `description` | CIS Benchmark 测试的描述。 |
| `remediation` | 为了通过测试需要修复的内容。 |
| `state` | 测试的状态，可以是通过、失败、跳过或不适用。 |
| `node_type` | 节点角色，角色决定了在节点上运行的测试。主测试在 control plane 节点上运行，etcd 测试在 etcd 节点上运行，节点测试在 Worker 节点上运行。 |
| `audit` | 这是 `kube-bench` 为此测试运行的审计检查。 |
| `audit_config` | 适用于审计脚本的任何配置。 |
| `test_info` | `kube-bench` 报告的测试相关信息（如果存在）。 |
| `commands` | `kube-bench` 报告的测试相关的命令（如果存在）。 |
| `config_commands` | `kube-bench` 报告的测试相关的配置数据（如果存在）。 |
| `actual_value` | 测试的实际值。如果由 `kube-bench` 报告，则会显示。 |
| `expected_result` | 测试的预期值。如果由 `kube-bench` 报告，则会显示。 |

参见 "<a href="{{<baseurl>}}/rancher/v2.6/en/security/" target="_blank">集群加固指南中的表格</a>"，以了解 Kubernetes、Benchmark、Rancher 以及我们的集群强化指南的版本对应关系。另外，请参阅强化指南，以获取符合 CIS 的集群的配置文件以及修复失败测试的信息。

## 测试配置文件

以下是可用的配置文件：

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

你还可以通过保存一组要跳过的测试来自定义配置文件。

所有配置文件都会有一组不适用的测试，CIS 扫描会跳过这些测试。RKE 集群管理 Kubernetes 的方式导致这些测试被认为不适用。

RKE 集群扫描配置文件有两种类型：

- **Permissive**：此配置文件有一组要跳过的测试，跳过的原因是这些测试会在默认的 RKE Kubernetes 集群上失败。除了跳过的测试列表之外，配置文件也不会运行不适用的测试。
- **Hardened**：此配置文件不会跳过任何测试（不适用的测试除外）。

EKS 和 GKE 集群扫描的配置文件基于这些集群类型特定的 CIS Benchmark 版本。

要通过 “Hardened” 配置文件，你需要遵从 “<a href="{{<baseurl>}}/rancher/v2.6/en/security/#rancher-hardening-guide" target="_blank">强化指南</a>” 并使用强化指南中定义的 `cluster.yml` 来配置一个强化集群。

默认配置文件和支持的 CIS Benchmark 版本取决于扫描的集群类型：

`rancher-cis-benchmark` 支持 CIS 1.6 Benchmark 版本。

- RKE Kubernetes 集群默认使用 RKE Permissive 1.6 配置文件。
- EKS 和 GKE 有自己的 CIS Benchmark，由 `kube-bench` 发布。这些集群默认使用相应的测试配置文件。
- RKE2 Kubernetes 集群默认使用 RKE2 Permissive 1.5 配置文件。
- RKE、RKE2、EKS 和 GKE 以外的集群类型默认使用 Generic CIS 1.5 配置文件。

## 跳过和不适用的测试

有关要跳过和不适用的测试列表，请参阅<a href="{{<baseurl>}}/rancher/v2.6/en/cis-scans/skipped-tests" target="_blank">此页面</a>。

目前，只有用户定义的跳过测试会在生成报告中标记为跳过。

如果某个默认配置文件将某个测试定义为跳过，则该测试也会标记为不适用。

## 基于角色的访问控制

有关权限的详细信息，请参阅<a href="{{<baseurl>}}/rancher/v2.6/en/cis-scans/rbac" target="_blank">此页面</a>。

## 配置

有关为扫描、配置文件和 Benchmark 测试版本配置自定义资源的更多信息，请参阅<a href="{{<baseurl>}}/rancher/v2.6/en/cis-scans/configuration" target="_blank">此页面</a>。

## 操作指南

- [安装 rancher-cis-benchmark](#installing-rancher-cis-benchmark)
- [卸载 rancher-cis-benchmark](#uninstalling-rancher-cis-benchmark)
- [运行扫描](#running-a-scan)
- [定时运行扫描](#running-a-scan-periodically-on-a-schedule)
- [跳过测试](#skipping-tests)
- [查看报告](#viewing-reports)
- [为 rancher-cis-benchmark 启用告警](#enabling-alerting-for-rancher-cis-benchmark)
- [为计划的定时扫描配置告警](#configuring-alerts-for-a-periodic-scan-on-a-schedule)
- [为集群扫描创建自定义 Benchmark 版本](#creating-a-custom-benchmark-version-for-running-a-cluster-scan)
### 安装 CIS Benchmark

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要安装 CIS Benchmark 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击**应用 & 应用市场 > Charts**。
1. 单击 **CIS Benchmark**。
1. 单击**安装**。

**结果**：CIS 扫描应用已经部署在 Kubernetes 集群上。

### 卸载 CIS Benchmark

1. 在**集群**仪表板中，单击左侧导航的**应用 & 应用市场 > 已安装的应用**。
1. 前往 `cis-operator-system` 命名空间，并选中 `rancher-cis-benchmark-crd` 和 `rancher-cis-benchmark` 旁边的框。
1. 单击**删除**并确认**删除**。

**结果**：已卸载 `rancher-cis-benchmark` 应用。

### 运行扫描

创建 ClusterScan 自定义资源后，它会在集群上为所选 ClusterScanProfile 启动新的 CIS 扫描。

请注意，目前一个集群每次只能运行一次 CIS 扫描。如果你创建了多个 ClusterScan 自定义资源，operator 只能一个接一个地运行这些资源。一个扫描完成之前，其余 ClusterScan 自定义资源将处于 “Pending” 状态。

要运行扫描：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要运行 CIS 扫描的集群，然后单击 **Explore**。
1. 点击 **CIS Benchmark > 扫描**。
1. 单击**创建**。
1. 选择集群扫描配置文件。该配置文件确定要使用哪个 CIS Benchmark 版本以及要执行哪些测试。如果你选择 Default 配置文件，则 CIS Operator 将选择适用于它所在的 Kubernetes 集群类型的配置文件。
1. 单击**创建**。

**结果**：已生成带有扫描结果的报告。如需查看结果，请单击显示的扫描名称。
### 定时运行扫描

要按计划运行 ClusterScan：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要运行 CIS 扫描的集群，然后单击 **Explore**。
1. 点击 **CIS Benchmark > 扫描**。
1. 选择集群扫描配置文件。该配置文件确定要使用哪个 CIS Benchmark 版本以及要执行哪些测试。如果你选择 Default 配置文件，则 CIS Operator 将选择适用于它所在的 Kubernetes 集群类型的配置文件。
1. 选择**定时运行扫描**的选项。
1. 将一个有效的 <a href="https://en.wikipedia.org/wiki/Cron#CRON_expression" target="_blank">Cron 表达式</a>填写到**调度**字段。
1. 选择一个**保留计数**，表示为这个定时扫描维护的报告数量。默认情况下，此计数为 3。超过此保留限制时，旧报告将被删除。
1. 单击**创建**。

**结果**：扫描运行，并根据设置的 cron 表达式重新调度。**下一次扫描**的值表示下次运行此扫描的时间。

每次运行扫描都会生成一份带有扫描结果的报告。如需查看最新的结果，请单击显示的扫描名称。

你还可以在扫描详情页面上的**报告**下拉菜单中查看之前的报告。

### 跳过测试

用户可以在测试配置文件中自定义要跳过的测试，然后 CIS 扫描可以使用该配置文件运行。

要跳过测试，你需要创建自定义一个 CIS 扫描配置文件。配置文件包含 CIS 扫描的配置，包括要使用的 Benchmark 测试版本以及要在该 Benchmark 测试中跳过的测试。

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要运行 CIS 扫描的集群，然后单击 **Explore**。
1. 单击 **CIS Benchmark > 配置文件**。
1. 在这里，你可以使用多种方式来创建配置文件。要创建新配置文件，单击**创建**并在 UI 中填写表单。要基于现有配置文件来创建新配置文件，请转到现有配置文件并单击**⋮ 克隆**。如果你在填写表单，请使用测试 ID 添加要跳过的测试，并参考相关的 CIS Benchmark。如果你将新的测试配置文件创建为 YAML，你需要在 `skipTests` 参数中添加要跳过的测试的 ID。你还需要为配置文件命名：

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
1. 单击**创建**。

**结果**：已创建一个新的 CIS 扫描配置文件。

使用此配置文件[运行扫描](#running-a-scan)时，会跳过定义的跳过测试。跳过的测试将在生成的报告中标记为`跳过`。

### 查看报告

要查看生成的 CIS 扫描报告：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要运行 CIS 扫描的集群，然后单击 **Explore**。
1. 点击 **CIS Benchmark > 扫描**。
1. **扫描**页面将显示生成的报告。要查看详细报告，请转到扫描报告并单击报告名称。

你可以从扫描列表或扫描详情页面下载报告。

### 为 rancher-cis-benchmark 启用告警

你可以配置告警，从而将告警发送给定时运行的扫描。

> **先决条件**：
>
> 为 `rancher-cis-benchmark` 启用告警之前，确保安装了 `rancher-monitoring`应用并配置了接收器（Receiver）和路由（Route）。详情请参见[本章节]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/configuration)。
>
> 在为 `rancher-cis-benchmark` 告警配置路由时，你可以使用键值对 `job:rancher-cis-scan` 来指定匹配。详情请查看[路由配置示例]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/configuration/receiver/#example-route-config-for-cis-scan-alerts)。

在安装或升级 `rancher-cis-benchmark` Helm Chart 时，在 `values.yaml` 中将以下标志设置为 `true`：

```yaml
alerts:
  enabled: true
```

### 为计划的定时扫描配置告警

你可以定时运行 ClusterScan。

你还可以为定时扫描指定是否在扫描完成时发出告警。

只有定时运行的扫描才支持告警。

CIS Benchmark 应用支持两种类型的告警：

- 扫描完成告警：此告警在扫描运行完成时发出。告警包括详细信息，包括 ClusterScan 的名称和 ClusterScanProfile 的名称。
- 扫描失败告警：如果扫描中有一些测试失败或扫描处于 `Fail` 状态，则会发出此告警。

> **先决条件**：
>
> 为 `rancher-cis-benchmark` 启用告警之前，确保安装了 `rancher-monitoring`应用并配置了接收器（Receiver）和路由（Route）。详情请参见[本章节]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/configuration)。
>
> 在为 `rancher-cis-benchmark` 告警配置路由时，你可以使用键值对 `job:rancher-cis-scan` 来指定匹配。详情请查看[路由配置示例]({{<baseurl>}}/rancher/v2.6/en/monitoring-alerting/configuration/receiver/#example-route-config-for-cis-scan-alerts)。

要为定时运行的扫描配置告警：

1. 请在 `rancher-cis-benchmark` 应用上启用告警。详情请参见[为 rancher-cis-benchmark 启用告警](#为-rancher-cis-benchmark-启用告警)。
1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要运行 CIS 扫描的集群，然后单击 **Explore**。
1. 点击 **CIS Benchmark > 扫描**。
1. 单击**创建**。
1. 选择集群扫描配置文件。该配置文件确定要使用哪个 CIS Benchmark 版本以及要执行哪些测试。如果你选择 Default 配置文件，则 CIS Operator 将选择适用于它所在的 Kubernetes 集群类型的配置文件。
1. 选择**定时运行扫描**的选项。
1. 在**调度**字段中输入有效的 [Cron 表达式](https://en.wikipedia.org/wiki/Cron#CRON_expression)。
1. 选中**告警**下告警类型旁边的框。
1. （可选）选择一个**保留计数**，表示为这个定时扫描维护的报告数量。默认情况下，此计数为 3。超过此保留限制时，旧报告将被删除。
1. 单击**创建**。

**结果**：扫描运行，并根据设置的 cron 表达式重新调度。如果在 `rancher-monitoring` 应用下配置了路由和接收器，则会在扫描完成时发出告警。

每次运行扫描都会生成一份带有扫描结果的报告。如需查看最新的结果，请单击显示的扫描名称。

### 为集群扫描创建自定义 Benchmark 版本

某些 Kubernetes 集群可能需要自定义配置 Benchmark 测试。例如，Kubernetes 配置文件或证书的路径可能与上游 CIS Benchmark 的标准位置不同。

现在，你可以使用 `rancher-cis-benchmark` 应用来创建自定义 Benchmark 版本，从而运行集群扫描。

有关详细信息，请参阅[此页面](./custom-benchmark)。
