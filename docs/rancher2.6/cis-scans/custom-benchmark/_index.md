---
title: 为集群扫描创建自定义 Benchmark 版本
weight: 4
---

每个 Benchmark 版本都定义了一组测试配置文件，这些文件定义了由 <a href="https://github.com/aquasecurity/kube-bench" target="_blank">kube-bench</a> 工具运行的 CIS 测试。
`rancher-cis-benchmark` 应用安装了一些默认的 Benchmark 测试版本，这些版本列在了 CIS Benchmark 测试应用菜单下。

但是，某些 Kubernetes 集群可能需要自定义配置 Benchmark 测试。例如，Kubernetes 配置文件或证书的路径可能与上游 CIS Benchmark 的标准位置不同。

现在，你可以使用 `rancher-cis-benchmark` 应用来创建自定义 Benchmark 版本，从而运行集群扫描。

运行集群扫描时，你需要选择指向特定 Benchmark 版本的配置文件。

按照以下所有步骤添加自定义 Benchmark 版本并使用它运行扫描。

1. [准备自定义 Benchmark 版本 ConfigMap](#1-prepare-the-custom-benchmark-version-configmap)
2. [将自定义 Benchmark 版本添加到集群](#2-add-a-custom-benchmark-version-to-a-cluster)
3. [为自定义 Benchmark 版本创建新配置文件](#3-create-a-new-profile-for-the-custom-benchmark-version)
4. [使用自定义 Benchmark 版本运行扫描](#4-run-a-scan-using-the-custom-benchmark-version)

### 1. 准备自定义 Benchmark 版本 ConfigMap

要创建自定义 Benchmark 版本，你需要先创建一个包含 Benchmark 版本配置文件的 ConfigMap，并将其上传到要运行扫描的 Kubernetes 集群。

假设要添加一个名为 `foo` 的自定义 Benchmark 版本，你可以按照以下步骤准备自定义 Benchmark 版本 ConfigMap：

1. 创建一个名为 `foo` 的目录，并在该目录中放置所有配置 YAML 文件， <a href="https://github.com/aquasecurity/kube-bench" target="_blank">kube-bench</a> 工具会搜索这些文件。例如，通用 CIS 1.5 Benchmark 版本的配置 YAML 文件在[此处](https://github.com/aquasecurity/kube-bench/tree/master/cfg/cis-1.5)。
1. 放置完整的 `config.yaml` 文件，其中包括所有要测试的组件。
1. 将 Benchmark 版本名称添加到 `config.yaml` 的 `target_mapping` 中：

   ```yaml
   target_mapping:
     "foo":
       - "master"
       - "node"
       - "controlplane"
       - "etcd"
       - "policies"
   ```
1. 通过创建 ConfigMap 将此目录上传到 Kubernetes 集群：

   ```yaml
   kubectl create configmap -n <namespace> foo --from-file=<path to directory foo>
   ```

### 2. 将自定义 Benchmark 版本添加到集群

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要添加自定义 Benchmark 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **CIS Benchmark > Benchmark 版本**。
1. 单击**创建**。
1. 输入自定义 Benchmark 版本的**名称**和描述。
1. 选择要应用 Benchmark 版本的集群提供商。
1. 在下拉列表中选择你已上传的 ConfigMap。
1. 添加最低和最高 Kubernetes 版本限制（如果有）。
1. 单击**创建**。

### 3. 为自定义 Benchmark 版本创建新配置文件

要使用你的自定义 Benchmark 版本运行扫描，你需要添加一个指向此 Benchmark 版本的新配置文件：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要添加自定义 Benchmark 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **CIS Benchmark > 配置文件**。
1. 单击**创建**。
1. 设置**名称**和描述。在本例中，我们将其命名为 `foo-profile`。
1. 在下拉列表中选择 Benchmark 版本。
1. 单击**创建**。

### 4. 使用自定义 Benchmark 版本运行扫描

指向你的自定义 Benchmark 版本的 `foo` 配置文件创建完成后，你可以创建一个新的扫描，从而在 Benchmark 版本中运行自定义测试。

要运行扫描：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要添加自定义 Benchmark 的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **CIS Benchmark > 扫描**。
1. 单击**创建**。
1. 选择新的集群扫描配置文件。
1. 单击**创建**。

**结果**：已生成带有扫描结果的报告。如需查看结果，请单击显示的扫描名称。
