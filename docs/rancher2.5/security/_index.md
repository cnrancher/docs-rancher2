---
title: 安全说明
description: 安全是 Rancher 全部功能的核心。Rancher 集成了全部的主流认证工具和服务，并且提供了企业级的RBAC 能力，可以让您的 Kubernetes 集群更安全。安全策略：Rancher Labs 会对安全漏洞及时做出响应，并努力在合理的时间内解决所有问题。漏洞报告流程：如果您发现了疑似安全漏洞，请发送邮件到security@rancher.com提交可能的安全漏洞。为了帮助我们更快地定位和复现问题，请尽可能详细地描述您发现的疑似问题，包括使用环境、Rancher 版本、Kubernetes 版本的等信息。漏洞公布：请订阅Rancher 发布论坛获取发布信息。我们提供了安全相关的文档，以及帮助您安全加固 Rancher Server 和下游 Kubernetes 集群的相关资料。
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
  - 安全
  - 安全说明
---

安全是 Rancher 全部功能的基础。Rancher 集成了全部的主流认证工具和服务，并且提供了企业级的[RBAC 能力](/docs/rancher2.5/admin-settings/rbac/_index)，这些都可以让您的 Kubernetes 集群更安全。

- **安全策略：**Rancher Labs 会对安全漏洞及时做出响应，并努力在合理的时间内解决所有问题。

- **漏洞报告流程：**如果您发现了疑似安全漏洞，请发送邮件到<a href="mailto:security@rancher.com">security@rancher.com</a>，提交问题。为了帮助我们更快地定位和复现问题，请尽可能详细地描述您发现的疑似问题，包括使用环境、Rancher 版本、Kubernetes 版本的等信息。

- **漏洞公布：**请订阅<a href="https://forums.rancher.com/c/announcements">Rancher 发布论坛</a>获取发布信息。

我们提供了安全相关的文档，以及帮助您安全加固 Rancher Server 和下游 Kubernetes 集群的相关资料：

- [在 Kubernetes 集群中执行 CIS 安全扫描](#在-kubernetes-集群中执行-cis-安全扫描)
- [SELinux RPM](#selinux-rpm)
- [Rancher 安全加固指南](#rancher-安全加固指南)
- [CIS Benchmark 和自测指南](#cis-benchmark-和自测指南)
- [第三方安全机构发布的 Rancher 安全测试报告](#第三方安全测试报告)
- [Rancher CVE（通用漏洞披露）和修复版本](#rancher-cve-和修复版本)
- [安全建议和最佳实践](#安全建议和最佳实践)

## 在 Kubernetes 集群中执行 CIS 安全扫描

_从 v2.4.0 版本起可用_

Rancher 充分利用了[kube-bench](https://github.com/aquasecurity/kube-bench)来对 Kubernetes 集群进行安全扫描。Rancher 会检查 Kubernetes 集群是否遵循了 CIS (Center for Internet Security，互联网安全中心) Kubernetes Benchmark 中定义的最佳实践。

CIS Kubernetes Benchmark 是一个可以用来给 Kubernetes 创建安全基准的参考文档。

互联网安全中心（CIS）是一个`501(c)(3)`非营利组织，成立于 2000 年 10 月，其使命是“通过识别，开发，验证，推广和维护最佳实践解决方案来防御网络攻击，并建立和引导社区打造安全可信的网络环境”。

CIS 基准测试是安全配置目标系统的最佳实践。CIS 基准是通过领域专家，技术供应商，公共和私人社区成员以及 CIS 基准开发团队的不懈努力而制定的。

基准提供两种类型的建议：计分和不记分。我们仅运行与“计分建议”相关的测试。

当 Rancher 对一个集群进行 CIS 安全扫描时，它会生成一个展示每个测试结果的报告。报告中包括`通过`，`跳过`和`失败`的测试数量的汇总。报告中同时也给`失败`的测试提供了补救办法。

更多详情，请参阅[安全扫描](/docs/rancher2.5/security/security-scan/_index)文档。

## SELinux RPM

[安全增强型 Linux（SELinux）](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)是对 Linux 的安全增强。在历史上被政府机构使用后，SELinux 现在是行业标准，在 CentOS 7 和 8 上默认启用。

我们提供了两个 RPM（红帽软件包），使 Rancher 产品能够在支持 SELinux 的主机上正常运行。`rancher-selinux`和`rke2-selinux`。详情请见[本页](/docs/rancher2.5/security/selinux/_index)。

## Rancher 安全加固指南

Rancher 的安全加固指南是根据 CIS（互联网安全中心）发布的<a href="https://www.cisecurity.org/benchmark/kubernetes/" target="_blank">CIS Kubernetes 安全标准</a>中的最佳实践来建立的。

这个指南提供了用来加固生产环境 Rancher 2.1，2.2 和 2.3 部署的指引。请通过查看 Rancher 的[CIS Kubernetes 安全标准自测指南](#cis-benchmark-和自测指南)来获取全部的安全管控清单。

> 加固指南描述了如何确保您集群中的节点安全。我们建议您在安装 Kubernetes 前，先按照加固指南加固您的节点。

每个版本的加固指南都是针对特定版本的 CIS Kubernetes 安全标准，特定版本的 Kubernetes 和 特定版本的 Rancher 设计的：

| 加固指南版本                                                                          | Rancher 版本          | CIS 安全标准版本          | Kubernetes 版本                  |
| :------------------------------------------------------------------------------------ | :-------------------- | :------------------------ | :------------------------------- |
| [加固指南 v2.4.0](/docs/rancher2/security/rancher-2.4/hardening-2.4/_index)           | Rancher v2.4.0        | Benchmark v1.5            | Kubernetes v1.15                 |
| [加固指南 v2.3.5](/docs/rancher2/security/rancher-2.3.x/2.3.5/hardening-2.3.5/_index) | Rancher v2.3.5        | Benchmark v1.5            | Kubernetes v1.15                 |
| [加固指南 v2.3.3](/docs/rancher2/security/rancher-2.3.x/2.3.3/hardening-2.3.3/_index) | Rancher v2.3.3        | Benchmark v1.4.1          | Kubernetes v1.14, v1.15 和 v1.16 |
| [加固指南 v2.3](/docs/rancher2/security/rancher-2.3.x/2.3.0/hardening-2.3/_index)     | Rancher v2.3.0-v2.3.2 | Benchmark v1.4.1          | Kubernetes v1.15                 |
| [加固指南 v2.2](/docs/rancher2/security/rancher-2.2/hardening-2.2/_index)             | Rancher v2.2.x        | Benchmark v1.4.1 和 1.4.0 | Kubernetes v1.13                 |
| [加固指南 v2.1](/docs/rancher2/security/rancher-2.1/hardening-2.1/_index)             | Rancher v2.1.x        | Benchmark v1.3.0          | Kubernetes v1.11                 |

## CIS Benchmark 和自测指南

安全标准自测指南是对 Rancher 安全加固指南的补充。加固指南向您展示了如何加固集群的安全，而安全标准指南旨在帮助您评估加固后的集群的安全级别。

因为 Rancher 和 RKE 会通过 Docker 容器的形式安装 Kubernetes 服务，所以很多 CIS Kubernetes Benchmark 中的很多安全管控检查点并不适用。这个指南将逐步介绍各种管控，并提供示例命令以审核 Rancher 创建的集群的合规性。您可以通过[CIS 官网](https://www.cisecurity.org/benchmark/kubernetes/)下载原始的安全标准文档。

每个版本的自测指南都是针对特定版本的加固指南，特定版本的 Kubernetes，特定版本的 Rancher 和特定版本的 CIS Kubernetes 安全标准进行的：

| 自测指南版本                                                                          | Rancher 版本         | 加固指南版本    | Kubernetes 版本  | CIS 安全标准版本          |
| :------------------------------------------------------------------------------------ | :------------------- | :-------------- | :--------------- | :------------------------ |
| [自测指南 v2.4](/docs/rancher2/security/rancher-2.4/benchmark-2.4/_index)             | Rancher v2.4         | 加固指南 v2.4   | Kubernetes v1.15 | 安全标准 v1.5.0           |
| [自测指南 v2.3.5](/docs/rancher2/security/rancher-2.3.x/2.3.5/benchmark-2.3.5/_index) | Rancher v2.3.5       | 加固指南 v2.3.5 | Kubernetes v1.15 | 安全标准 v1.5.0           |
| [自测指南 v2.3.3](/docs/rancher2/security/rancher-2.3.x/2.3.3/benchmark-2.3.3/_index) | Rancher v2.3.3       | 加固指南 v2.3.3 | Kubernetes v1.16 | 安全标准 v1.4.1           |
| [自测指南 v2.3](/docs/rancher2/security/rancher-2.3.x/2.3.0/benchmark-2.3/_index)     | Rancher v2.3.0-2.3.2 | 加固指南 v2.3   | Kubernetes v1.15 | 安全标准 v1.4.1           |
| [自测指南 v2.2](/docs/rancher2/security/rancher-2.2/benchmark-2.2/_index)             | Rancher v2.2.x       | 加固指南 v2.2   | Kubernetes v1.13 | 安全标准 v1.4.0 和 v1.4.1 |
| [自测指南 v2.1](/docs/rancher2/security/rancher-2.1/benchmark-2.1/_index)             | Rancher v2.1.x       | 加固指南 v2.1   | Kubernetes v1.11 | 安全标准 1.3.0            |

## 第三方安全测试报告

Rancher 周期性的雇佣第三方对 Rancher 2.x 版本软件进行安全审核和漏洞检测。在安全测试中使用的环境，是按照 Rancher 提供的加固指南部署的。测试报告会在第三方确认我们已经修复了测试中发现的中级或以上级别的安全漏洞后公布。

测试结果：

- [Cure53 安全测试报告 - 7/2019](https://releases.rancher.com/documents/security/pen-tests/2019/RAN-01-cure53-report.final.pdf)
- [Untamed Theory 安全测试报告 - 3/2019](https://releases.rancher.com/documents/security/pen-tests/2019/UntamedTheory-Rancher_SecurityAssessment-20190712_v5.pdf)

## Rancher CVE 和修复版本

Rancher 致力于向社区披露我们产品的安全问题。Rancher 将对修复的问题通过发布 CVEs(通用漏洞披露，Common Vulnerabilities and Exposures)通知社区，详情请查看[安全漏洞和解决方法](/docs/rancher2.5/security/cve/_index)。

## 安全建议和最佳实践

我们的[最佳实践建议](/docs/rancher2.5/best-practices/_index)包含了基本的提升 Rancher 安全的建议。
