---
title: 配置
description: 本配置参考旨在帮助您管理由rancher-cis-benchmark应用程序创建的自定义资源。这些资源用于在集群上执行 CIS 扫描、跳过测试、设置将在扫描期间使用的测试配置文件以及其他自定义。
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
  - 配置
---

本配置参考旨在帮助您管理由`rancher-cis-benchmark`应用程序创建的自定义资源。这些资源用于在集群上执行 CIS 扫描、跳过测试、设置将在扫描期间使用的测试配置文件以及其他自定义配置。

要配置自定义资源，请进入 Rancher UI 中的**集群资源管理器**。在左上角的下拉菜单中，单击**集群资源管理器 > CIS 基准**。

## 扫描

创建扫描以根据定义的配置文件在集群上触发 CIS 扫描。扫描完成后会创建一份报告。

在配置扫描时，您需要定义扫描配置文件的名称，该名称将与`scanProfileName`指令一起使用。

下面是一个 ClusterScan 自定义资源的例子。

```yaml
apiVersion: cis.cattle.io/v1
kind: ClusterScan
metadata:
  name: rke-cis
spec:
  scanProfileName: rke-profile-hardened
```

## 档案

一个配置文件包含 CIS 扫描的配置，其中包括要使用的基准版本和该基准中要跳过的任何特定测试。

默认情况下，一些 ClusterScanProfiles 被安装为`rancher-cis-benchmark`图表的一部分。如果用户编辑了这些默认的基准或配置文件，下一次的图表更新将重新设置它们。所以建议用户不要编辑默认的 ClusterScanProfiles。

用户可以克隆 ClusterScanProfiles 来创建自定义配置文件。

跳过的测试会在`skipTests`指令下列出。

当你创建一个新的配置文件时，你还需要给它一个名字。

下面是一个`ClusterScanProfile`的例子。

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

## 基线版本

基准版本是指使用`kube-bench`运行的基准名称，以及该基准的有效配置参数。

`ClusterScanBenchmark`定义了 CIS`BenchmarkVersion`名称和测试配置。`BenchmarkVersion`名称是提供给`kube-bench`工具的参数。

默认情况下，一些`BenchmarkVersion`名称和测试配置被打包为 CIS 扫描应用程序的一部分。启用该功能后，这些默认的 BenchmarkVersions 将被自动安装，并供用户创建 ClusterScanProfile 时使用。

> 如果编辑了默认的 BenchmarkVersions，下一次的图表更新将重新设置它们。因此我们不建议编辑默认的 ClusterScanBenchmarks。

一个 ClusterScanBenchmark 由以下字段组成。

- `ClusterProvider`。这是本基准适用的集群提供者名称。例如： `ClusterProvider`：这是本基准适用的集群提供者名称。RKE、EKS、GKE 等。如果该基准可以在任何集群类型上运行，则留空。
- `MinKubernetesVersion`。指定运行该基准所需的集群最低 kubernetes 版本。如果不依赖特定的 Kubernetes 版本，则留空。
- `MaxKubernetesVersion`。指定运行该基准所需的集群最大 Kubernetes 版本。如果对特定 k8s 版本没有依赖性，则留空。

下面是一个`ClusterScanBenchmark`的例子。

```yaml
apiVersion: cis.cattle.io/v1
kind: ClusterScanBenchmark
metadata:
  annotations:
    meta.helm.sh/release-name: clusterscan-operator
    meta.helm.sh/release-namespace: cis-operator-system
  creationTimestamp: "2020-08-28T18:18:07Z"
  generation: 1
  labels:
    app.kubernetes.io/managed-by: Helm
  name: cis-1.5
  resourceVersion: "203878"
  selfLink: /apis/cis.cattle.io/v1/clusterscanbenchmarks/cis-1.5
  uid: 309e543e-9102-4091-be91-08d7af7fb7a7
spec:
  clusterProvider: ""
  minKubernetesVersion: 1.15.0
```
