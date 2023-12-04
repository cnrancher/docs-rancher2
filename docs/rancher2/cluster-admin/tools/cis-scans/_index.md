---
title: Rancher v2.4 中的CIS扫描（已弃用）
description: 本节包含 Rancher v2.4 中发布的 CIS 扫描工具的遗留文档，可在集群管理器顶部导航栏的工具菜单下获得。从 Rancher v2.5 开始，它已被废弃，并被 rancher-cis-benchmark应用程序所取代。
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
  - cis说明
  - rancher 2.4
  - Rancher v2.4 中的CIS扫描（已弃用）
---

_从 v2.4.0 开始提供_

本节包含 Rancher v2.4 中发布的 CIS 扫描工具的文档，可在集群管理器顶部导航栏的**工具**菜单下获得。

从 Rancher v2.5 开始，它已被废弃，并被 `rancher-cis-benchmark` 应用程序所取代。

## 先决条件

- 您必须是[管理员](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)。

- Rancher 只能在使用 RKE 创建的集群上运行安全扫描，其中包括自定义集群和 Rancher 在 Amazon EC2 或 GCE 等基础设施提供商中创建的集群。导入的集群和托管的 Kubernetes 提供商中的集群不能被 Rancher 扫描。

- 安全扫描无法在具有 Windows 节点的集群中运行。

- 您只能看到您可以访问的集群的 CIS 扫描报告。

## 运行扫描

1. 从 Rancher 中的集群视图中，单击**工具 > CIS 扫描**。
1. 单击**运行扫描**。
1. 选择一个 CIS 扫描配置文件。

**结果：**会生成一份报告，并显示在**CIS 扫描**页中。要查看报告的详细信息，请单击报告的名称。

## 设置定时扫描

您可以计划在任何 RKE Kubernetes 集群上运行重复扫描。

要启用循环扫描，请在创建集群期间或创建集群后编辑集群配置中的高级选项。

1. 转到 Rancher 中的集群视图。
1. 单击**工具 > CIS 扫描**。
1. 单击**Add Schedule**这将带您进入集群编辑页面中适用于配置 CIS 扫描时间表的部分。也可以通过进入集群视图，单击 **&#8942 > 编辑**，并进入**高级选项**。
1. 在**CIS 扫描启用**字段中，单击**是**。
1. 在**CIS 扫描配置文件**字段中，选择**Permissive**或**Hardened**配置文件。配置文件名称中包含相应的 CIS 基准版本。
   :::note 注意
   无论选择**Permissive**还是**Hardened**配置文件，任何跳过的测试[在单独的 ConfigMap 中定义](#skipping-tests)都将被跳过。当选择允许的配置文件时，您应该看到哪些测试被 Rancher 跳过（RKE 集群默认跳过的测试），哪些测试被 Rancher 用户跳过。在加固测试配置文件中，只有跳过的测试会被用户跳过。
   :::
1. 在**CIS 扫描间隔(cron)**工作中，输入[cron 表达式](https://en.wikipedia.org/wiki/Cron#CRON_expression)来定义集群的扫描频率。
1. 在**CIS 扫描报告保留**字段中，输入应保留的过去报告的数量。

**结果：**安全扫描将按预定的时间间隔运行并生成报告。

T 测试计划可以在`cluster.yml`中配置：

```yaml
scheduled_cluster_scan:
    enabled: true
    scan_config:
        cis_scan_config:
            override_benchmark_version: rke-cis-1.4
            profile: permissive
    schedule_config:
        cron_schedule: 0 0 * * *
        retention: 24
```

## 跳过测试

您可以定义一组测试，在生成下一份报告时，CIS 扫描将跳过这些测试。

这些测试将在随后的 CIS 扫描中跳过，包括手动触发和计划扫描，任何配置文件都将跳过这些测试。

当为循环集群扫描选择测试配置文件时，跳过的测试将与测试配置文件名称一起在集群配置选项中列出。跳过的测试也将在每次从 Rancher UI 中通过单击 **Run Scan**手动触发扫描时显示。 跳过的测试的显示可以让您提前知道哪些测试将在每次扫描中运行。

要跳过测试，您需要在 Kubernetes ConfigMap 资源中定义它们。每一个跳过的 CIS 扫描测试都会在 ConfigMap 中与该测试所属的 CIS 基准版本一起列出。

1. 创建一个 `security-scan`命名空间。
1. 创建一个名为`security-scan-cfg`的 ConfigMap。
1. 在`config.json`键下输入跳过信息，格式如下：

   ```json
   {
     "skip": {
       "rke-cis-1.4": ["1.1.1", "1.2.2"]
     }
   }
   ```

   在上面的例子中，CIS 基准版本与该版本要跳过的测试一起指定。

**结果：**这些测试将在使用定义的 CIS 基准版本的后续扫描中跳过。

## 设置警报

Rancher 为集群扫描提供了一组警报，默认情况下没有配置为具有通知器。

- 一个手动集群扫描已经完成
- 手动集群扫描有故障
- 完成了预定的集群扫描
- 预定的集群扫描有故障

> **前提条件：**您需要在配置、发送或接收警报之前配置[通知](/docs/rancher2/cluster-admin/tools/notifiers/_index)。

要激活 CIS 扫描结果的现有警报。

1. 从 Rancher 中的集群视图中，单击 **工具 > 警报**。
1. 转到名为**集群扫描的一组警报的部分**。
1. 转到您要激活的警报，然后单击 **&#8942；>激活**。
1. 转到警报规则组 **集群扫描的一组警报**，然后单击 **&#8942; > 编辑**。
1. 向下滚动到**警报**部分。在**至**字段中，选择要用于发送警报通知的通知器。
1. 可选。要限制通知的频率，请单击**显示高级选项**，配置警报的时间间隔。
1. 单击**保存**。

**结果：**在集群上运行扫描且活动警报满足条件时，将触发通知。

要创建一个新的警报。

1. 转到集群视图，然后单击**工具 > CIS 扫描**。
1. 单击**添加警报**。
1. 填写表格。
1. 输入警报的名称。
1. 在 **是**字段中，设置警报在扫描完成或扫描失败时触发。
1. 在 **Send a** 字段中，将警报设置为 **Critical、** **Warning、** 或 **Info** 警报级别。
1. 为警报选择一个[通知](/docs/rancher2/cluster-admin/tools/notifiers/_index)。

**结果：**创建并激活了警报。当扫描在集群上运行且活动的警报满足条件时，将触发通知。

有关警报的更多信息，请参阅[通知](/docs/rancher2/cluster-admin/tools/notifiers/_index)。

## 删除报告

1. 从 Rancher 中的集群视图中，单击**工具 > CIS 扫描**。
1. 转到应该删除的报告。
1. 单击 **&#8942；> 删除**。
1. 单击**删除**。

## 下载报告

1. 从 Rancher 中的集群视图中，单击**工具 > CIS 扫描**。
1. 转到您要下载的报告。单击 **&#8942;>下载**。

**结果：**报告以 CSV 格式下载。

## 跳过和不适用的测试清单

关于跳过的和不适用的测试清单，请参考[跳过和不适用的测试](/docs/rancher2/cluster-admin/tools/cis-scans/skipped-tests/_index)。
