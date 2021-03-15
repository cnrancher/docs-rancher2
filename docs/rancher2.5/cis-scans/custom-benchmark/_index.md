---
title: 创建自定义基线版本
---

_v2.5.4 开始支持_

## 概述

每个基线版本都定义了一组测试配置文件，这些文件定义了 CIS 测试要由[kube-bench](https://github.com/aquasecurity/kube-bench)工具运行。

`rancher-cis-benchmark`应用程序安装了一些默认的 Benchmark 版本，这些版本列在 CIS Benchmark 应用程序菜单下。

但可能有一些 Kubernetes 集群设置需要自定义配置 Benchmark 测试。例如，Kubernetes 配置文件或证书的路径可能与上游 CIS Benchmarks 寻找它们的标准位置不同。

现在可以使用`rancher-cis-benchmark`应用程序创建一个自定义的 Benchmark 版本来运行集群扫描。

当集群扫描运行时，你需要选择一个指向特定 Benchmark 版本的 Profile。

按照下面的所有步骤添加一个自定义的 Benchmark 版本，并使用它来运行扫描。

## 1. 准备自定义基线版本所需的 Configmap

要创建一个自定义基线版本，首先你需要创建一个包含基线版本配置文件的 ConfigMap，并将其上传到你要运行扫描的 Kubernetes 集群。

假设我们要添加一个名为`foo`的自定义基线版本：

1. 创建一个名为`foo`的目录，在这个目录里面，放置[kube-bench](https://github.com/aquasecurity/kube-bench)工具寻找的所有配置 YAML 文件。例如，这里是通用 CIS 1.5 基线版的配置 YAML 文件https://github.com/aquasecurity/kube-bench/tree/master/cfg/cis-1.5。

1. 放置完整的`config.yaml`文件，其中包括所有应该测试的组件。

1. 将 Benchmark 版本名称添加到`config.yaml`的`target_mapping`部分。

   ```yaml
   target_mapping:
     "foo":
       - "master"
       - "node"
       - "controlplane"
       - "etcd"
       - "policies"
   ```

1. 通过创建一个 ConfigMap 将这个目录上传到你的 Kubernetes Cluster。

   ```yaml
   kubectl create configmap -n <namespace> foo --from-file=<path to directory foo>
   ```

## 2. 将自定义基线版本添加到集群中

1. 在您的集群中创建了 ConfigMap 后，请导航到 Rancher UI 中的**Cluster Explorer**。
1. 在左上角的下拉菜单中，单击**Cluster Explorer > CIS Benchmark**。
1. 在**Benchmark Versions**部分，单击**Create**。
1. 为您的自定义基线版本输入**Name**和描述。
1. 选择您的基线版本所适用的集群提供商。
1. 从下拉菜单中选择您上传的 ConfigMap。
1. 添加适用的最小和最大 Kubernetes 版本限制（可选）。
1. 单击**Create**。

## 3. 为自定义基线版本创建一个新的配置文件

要使用您的自定义基线版本运行扫描，您需要添加一个指向此基线版本的新 Profile。

1. 一旦在您的集群中创建了自定义基线版本，请导航到 Rancher UI 中的 **Cluster Explorer**。
1. 在左上角的下拉菜单中，单击**Cluster Explorer > CIS Benchmark**。
1. 在**Profiles**部分，单击**Create**。
1. 提供一个**名称**和描述。在本例中，我们将其命名为`foo-profile`。
1. 从下拉菜单中选择基线版本`foo`。
1. 单击**Create**，创建一个新的配置文件。

## 4. 使用自定义基线版本运行扫描

您可以创建一个新的 Scan 来运行基线版本中的自定义测试配置。

1. 进入 Rancher UI 中的**Cluster Explorer**。在左上角下拉菜单中，单击**Cluster Explorer >CIS Benchmark**。
1. 在**Scans**部分，单击**Create**。
1. 选择新的集群扫描配置文件`foo-profile`。
1. 单击**Create**。

## 结果

生成包含扫描结果的报告，请单击出现的报告名称查看结果。
