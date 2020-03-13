---
title: 安全扫描
---

_从 v2.4.0-alpha1 版本起可用_

Rancher 可以对 Kubernetes 集群进行安全扫描。Rancher 会检查 Kubernetes 集群是否遵循了 CIS (Center for Internet Security，互联网安全中心) Kubernetes Benchmark 中定义的最佳实践。

CIS Kubernetes Benchmark 是一个可以用来给 Kubernetes 创建安全基准的参考文档。这个 Benchmark 提供了两种类型的建议：`计分`和`不计分`。我们仅会针对`计分`的建议进行测试。

当 Rancher 对一个集群进行 CIS 安全扫描时，它会生成一个展示每个测试结果的报告。报告中包括`通过`，`跳过`和`失败`的测试数量的汇总。报告中同时也给`失败`的测试提供了补救办法。

Rancher 通过使用 Aqua Security 的开源工具[kube-bench](https://github.com/aquasecurity/kube-bench) 检查集群是否符合 CIS Kubernetes Benchmark 的规定。

## 关于生成的报告

每次扫描都会生成一个报告。您可以在 Rancher UI 中查看报告，您也可以下载 CSV 格式的报告。

Rancher 会根据您的 Kubernetes 版本，使用合适的[安全标准](https://www.cisecurity.org/benchmark/kubernetes/)版本来对您的集群进行安全扫描。安全标准版本信息也包含在生成的报告中。

报告中的每个测试均通过其安全标准中相应的`计分`测试来标识。例如，如果集群未通过测试 1.3.6，您可以在安全标准中或在对应的 Kubernetes 版本的[Rancher 安全加固指南](/docs/security/_index#rancher-安全加固指南)中，查找 1.3.6 节的描述和基本原理。安全标准推荐中的`不计分`测试不包含在报告中。

相似的，您可以查看对应的 Kubernetes 版本的[Rancher 自测指南](/docs/security/_index#cis-benchmark-和自测指南)中的 1.3.6 节，从而获取如何手动检查这个安全问题的方法。

## 前提条件

如果想要对集群运行安全扫描并生成报告，您必须是[系统管理员](/docs/admin-settings/rbac/global-permissions/_index)或[集群管理员](/docs/admin-settings/rbac/cluster-project-roles/_index)。

Rancher 只能在通过 RKE 创建的集群中执行安全扫描。这些集群包括自定义集群和 Rancher 在云提供商的虚拟机上创建的集群例如 Amazon EC2 或 GCE。您不能通过 Rancher 对导入的集群和托管的 Kubernetes 集群进行安全扫描。

您不能在含有 Windows 节点的集群里运行安全扫描。

## 运行扫描

1. 在 Rancher 的集群级别菜单中，点击 **工具 > CIS 扫描**。
1. 点击 **运行扫描**

**结果：** 将会在**CIS 扫描**页面中生成一份报告。您可以点击报告的名称，查看报告的详细内容。

## 跳过某个测试

1. 在 Rancher 的集群级别菜单中，点击 **工具 > CIS 扫描**。
1. 点击包含您想要跳过的测试的报告名称。
1. 每个失败的测试旁边都有一个 **跳过** 按钮。点击每个想要跳过的测试的 **跳过** 按钮。

**结果：** 在下次运行扫描时，这些测试将会被跳过。

如果想要重新执行安全扫描，请返回页面顶部，并点击 **运行扫描**。

## 取消跳过某个测试

1. 在 Rancher 的集群级别菜单中，点击 **工具 > CIS 扫描**。
1. 点击包含您想要取消跳过的测试的报告名称。
1. 每个跳过的测试旁边都有一个 **取消跳过** 按钮。点击每个想要取消跳过的测试的 **取消跳过** 按钮。

**结果：** 在下次运行扫描时，这些测试将不会被跳过。

如果想要重新执行安全扫描，请返回页面顶部，并点击 **运行扫描**。

## 删除报告

1. 在 Rancher 的集群级别菜单中，点击 **工具 > CIS 扫描**。
1. 导航到您想要删除的报告。
1. 点击 **省略号 (...) > 删除**。
1. 点击 **删除** 。
