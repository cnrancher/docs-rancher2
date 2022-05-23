---
title: 配置
weight: 3
---

此配置参考用于帮助你管理由 `rancher-cis-benchmark` 应用创建的自定义资源。这些资源用于在集群上执行 CIS 扫描、跳过测试、设置扫描使用的测试配置文件和其他自定义配置。

要配置自定义资源，转到**集群**仪表板。要配置 CIS 扫描：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要配置 CIS 扫描的集群，然后单击 **Explore**。
1. 在左侧导航栏中，单击 **CIS Benchmark**。

### 扫描

扫描是用来根据定义的配置文件，在集群上触发 CIS 扫描的。扫描完成后会创建一份报告。

配置扫描时，你需要定义与 `scanProfileName` 参数一起使用的扫描配置文件的名称。

下面是一个 ClusterScan 自定义资源示例：

```yaml
apiVersion: cis.cattle.io/v1
kind: ClusterScan
metadata:
  name: rke-cis
spec:
  scanProfileName: rke-profile-hardened
```

### 配置文件

配置文件包含 CIS 扫描的配置，包括要使用的 Benchmark 测试版本以及要在该 Benchmark 测试中跳过的测试。

> 默认情况下，一些 ClusterScanProfile 会作为 `rancher-cis-benchmark` Chart 的一部分进行安装。如果用户编辑了这些默认 Benchmark 或配置文件，它们会在下一次 Chart 更新时被重置。因此，建议用户不要编辑默认的 ClusterScanProfile。

用户可以通过克隆 ClusterScanProfile 来创建自定义配置文件。

跳过的测试会列在 `skipTests` 参数下。

创建新配置文件时，你还需要命名配置文件。

`ClusterScanProfile` 示例如下：

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

### Benchmark 版本

Benchmark 版本是指使用 `kube-bench` 运行的 Benchmark 名称，以及该 Benchmark 的有效配置参数。

`ClusterScanBenchmark` 定义了 CIS `BenchmarkVersion` 的名称和测试配置。`BenchmarkVersion` 名称是提供给 `kube-bench` 工具的参数。

默认情况下，一些 `BenchmarkVersion` 名称和测试配置会作为 CIS 扫描应用的一部分进行打包。启用此功能后，这些默认 BenchmarkVersion 将自动安装，用户可以使用它们来创建 ClusterScanProfile。

> 如果用户编辑了默认的 BenchmarkVersion，它们会在下一次 Chart 更新时被重置。因此，不建议编辑默认的 ClusterScanBenchmark。

ClusterScanBenchmark 由以下字段组成：

- `ClusterProvider`：此 Benchmark 适用的集群提供商名称，例如，RKE、EKS、GKE。如果此基准测试可以在任何集群类型上运行，则留空。
- `MinKubernetesVersion`：集群运行此 Benchmark 测试所需的最低 kubernetes 版本。如果不依赖特定的 Kubernetes 版本，则留空。
- `MaxKubernetesVersion`：集群运行此 Benchmark 测试所需的最高 Kubernetes 版本。如果不依赖特定的 Kubernetes 版本，则留空。

`ClusterScanBenchmark` 示例如下：

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
