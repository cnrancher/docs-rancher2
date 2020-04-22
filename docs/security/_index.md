---
title: 安全说明
description: 安全是 Rancher 全部功能的核心。Rancher 集成了全部的主流认证工具和服务，并且提供了企业级的[RBAC 能力](/docs/admin-settings/rbac/_index)，这些都可以让您的 Kubernetes 集群更安全。本页，我们将提供安全相关的文档，以及帮助您安全加固 Rancher Server 和下游 Kubernetes 集群的相关质料
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安全
  - 安全说明
---

<table width="100%">
<tbody>
<tr>
<td width="30%" style={{verticalAlign: 'top'}}>
<h4>安全策略</h4>
<p>
Rancher Labs会做对安全漏洞做出响应，并努力在合理的时间内解决所有问题。
</p>
</td>
<td width="30%" style={{verticalAlign: 'top'}}>
<h4>漏洞报告流程</h4>
<p>
如果您发现了疑似安全漏洞，请发送邮件到 
<a href="mailto:security@rancher.com">security@rancher.com</a>，提交可能的安全漏洞
为了帮助我们更快地定位和复现问题，请尽可能详细地描述您发现的疑似问题，包括使用环境、Rancher版本、Kubernetes版本的等信息。
</p>
</td>
<td width="30%" style={{verticalAlign: 'top'}}>
<h4>漏洞公布</h4>
<p>
请订阅<a href="https://forums.rancher.com/c/announcements">Rancher发布论坛</a>获取发布信息。
</p>
</td>
</tr>
</tbody>
</table>

安全是 Rancher 全部功能的核心。Rancher 集成了全部的主流认证工具和服务，并且提供了企业级的[RBAC 能力](/docs/admin-settings/rbac/_index)，这些都可以让您的 Kubernetes 集群更安全。

本页，我们将提供安全相关的文档，以及帮助您安全加固 Rancher Server 和下游 Kubernetes 集群的相关质料：

- [在 Kubernetes 集群中执行 CIS 安全扫描](#在-kubernetes-集群中执行-cis-安全扫描)
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

更多详情，请参阅[安全扫描](/docs/security/security-scan/_index)部分的文档。

## Rancher 安全加固指南

Rancher 的安全加固指南是根据 CIS（互联网安全中心）发布的<a href="https://www.cisecurity.org/benchmark/kubernetes/" target="_blank">CIS Kubernetes 安全标准</a>中的最佳实践来建立的。

这个指南提供了用来加固生产环境 Rancher 2.1，2.2 和 2.3 部署的指引。请通过查看 Rancher 的[CIS Kubernetes 安全标准自测指南](#cis-benchmark-和自测指南)来获取全部的安全管控清单。

> 加固指南描述了如何确保您集群中的节点安全。我们建议您在安装 Kubernetes 前，先按照加固指南加固您的节点。

每个版本的加固指南都是针对特定版本的 CIS Kubernetes 安全标准，特定版本的 Kubernetes 和 特定版本的 Rancher 设计的：

| 在加固指南版本                                           | Rancher 版本          | CIS 安全标准版本          | Kubernetes 版本                  |
| -------------------------------------------------------- | --------------------- | ------------------------- | -------------------------------- |
| [加固指南 v2.3.5](/docs/security/hardening-2.3.5/_index) | Rancher v2.3.5        | Benchmark v1.5            | Kubernetes v1.15                 |
| [加固指南 v2.3.3](/docs/security/hardening-2.3.3/_index) | Rancher v2.3.3        | Benchmark v1.4.1          | Kubernetes v1.14, v1.15 和 v1.16 |
| [加固指南 v2.3](/docs/security/hardening-2.3/_index)     | Rancher v2.3.0-v2.3.2 | Benchmark v1.4.1          | Kubernetes v1.15                 |
| [加固指南 v2.2](/docs/security/hardening-2.2/_index)     | Rancher v2.2.x        | Benchmark v1.4.1 和 1.4.0 | Kubernetes v1.13                 |
| [加固指南 v2.1](/docs/security/hardening-2.1/_index)     | Rancher v2.1.x        | Benchmark v1.3.0          | Kubernetes v1.11                 |

## CIS Benchmark 和自测指南

安全标准自测指南是对 Rancher 安全加固指南的补充。加固指南向您展示了如何加固集群的安全，而安全标准指南旨在帮助您评估加固后的集群的安全级别。

因为 Rancher 和 RKE 会通过 Docker 容器的形式安装 Kubernetes 服务，所以很多 CIS Kubernetes Benchmark 中的很多安全管控检查点并不适用。这个指南将逐步介绍各种管控，并提供示例命令以审核 Rancher 创建的集群的合规性。您可以通过[CIS 官网](https://www.cisecurity.org/benchmark/kubernetes/)下载原始的安全标准文档。

每个版本的自测指南都是针对特定版本的加固指南，特定版本的 Kubernetes，特定版本的 Rancher 和特定版本的 CIS Kubernetes 安全标准进行的：

| 自测指南版本                                                                                                           | Rancher 版本         | 加固指南版本    | Kubernetes 版本  | CIS 安全标准版本          |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------- | ---------------- | ------------------------- |
| [自测指南 v2.3.5](/docs/security/benchmark-2.3.5/#cis-kubernetes-benchmark-1-5-0-rancher-2-3-5-+-with-kubernetes-1-15) | Rancher v2.3.5       | 加固指南 v2.3.3 | Kubernetes v1.15 | 安全标准 v1.5.0           |
| [自测指南 v2.3.3](/docs/security/benchmark-2.3.3/#cis-kubernetes-benchmark-1-4-1-rancher-2-3-3-+-with-kubernetes-1-16) | Rancher v2.3.3       | 加固指南 v2.3.3 | Kubernetes v1.16 | 安全标准 v1.4.1           |
| [自测指南 v2.3](/docs/security/benchmark-2.3/#cis-kubernetes-benchmark-1-4-1-rancher-2-3-0-2-3-2-with-kubernetes-1-15) | Rancher v2.3.0-2.3.2 | 加固指南 v2.3   | Kubernetes v1.15 | 安全标准 v1.4.1           |
| [自测指南 v2.2](/docs/security/benchmark-2.2/)                                                                         | Rancher v2.2.x       | 加固指南 v2.2   | Kubernetes v1.13 | 安全标准 v1.4.0 和 v1.4.1 |
| [自测指南 v2.1](/docs/security/benchmark-2.1/)                                                                         | Rancher v2.1.x       | 加固指南 v2.1   | Kubernetes v1.11 | 安全标准 1.3.0            |

## 第三方安全测试报告

Rancher 周期性的雇佣第三方对 Rancher 2.x 版本软件进行安全审核和漏洞检测。在安全测试中使用的环境，是按照 Rancher 提供的加固指南部署的。测试报告会在第三方确认我们已经修复了测试中发现的中级或以上级别的安全漏洞后公布。

测试结果：

- [Cure53 安全测试报告 - 7/2019](https://releases.rancher.com/documents/security/pen-tests/2019/RAN-01-cure53-report.final.pdf)
- [Untamed Theory 安全测试报告 - 3/2019](https://releases.rancher.com/documents/security/pen-tests/2019/UntamedTheory-Rancher_SecurityAssessment-20190712_v5.pdf)

## Rancher CVE 和修复版本

Rancher 致力于向社区披露我们产品的安全问题。Rancher 将对修复的问题通过发布 CVEs(通用漏洞披露，Common Vulnerabilities and Exposures)通知社区。

| ID                                                                              | 描述                                                                                                                                                                                                                                                                                                                | 日期       | 修复版本                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CVE-2018-20321](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-20321) | 任何有`default`命名空间访问权限的项目成员，可以通过在 pod 中挂载名称为`netes-default`的 service account。然后可以通过这个 pod 使用管理员权限对 Kubernetes 集群下发指令。                                                                                                                                            | 2019/01/29 | [Rancher v2.1.6](https://github.com/rancher/rancher/releases/tag/v2.1.6) 和 [Rancher v2.0.11](https://github.com/rancher/rancher/releases/tag/v2.0.11)                                                                             |
| [CVE-2019-6287](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-6287)   | 如果这个项目成员之前被添加到一个以上的项目中，即使将这个项目成员从项目移除后，这个项目成员仍然可以继续访问这个项目中的命名空间。                                                                                                                                                                                    | 2019/01/29 | [Rancher v2.1.6](https://github.com/rancher/rancher/releases/tag/v2.1.6) 和 [Rancher v2.0.11](https://github.com/rancher/rancher/releases/tag/v2.0.11)                                                                             |
| [CVE-2019-11202](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-11202) | 无法删除默认的 admin 用户（Rancher 自带的那个用户），因为在 Rancher Server 重启时将会重建这个用户。                                                                                                                                                                                                                 | 2019/04/16 | [Rancher v2.2.2](https://github.com/rancher/rancher/releases/tag/v2.2.2), [Rancher v2.1.9](https://github.com/rancher/rancher/releases/tag/v2.1.9) 和 [Rancher v2.0.14](https://github.com/rancher/rancher/releases/tag/v2.0.14)   |
| [CVE-2019-12274](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-12274) | 如果是通过带有支持文件路径参数的内置主机驱动创建的节点，那么这个节点将可以访问 Rancher Server 容器内的任何文件，包含敏感文件。                                                                                                                                                                                      | 2019/06/05 | [Rancher v2.2.4](https://github.com/rancher/rancher/releases/tag/v2.2.4), [Rancher v2.1.10](https://github.com/rancher/rancher/releases/tag/v2.1.10) 和 [Rancher v2.0.15](https://github.com/rancher/rancher/releases/tag/v2.0.15) |
| [CVE-2019-12303](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-12303) | 项目管理员可以注意额外的 fluentd 配置，从而读取 fluentd 容器中的任何文件，并且可以在 fluentd 容器内执行命令。这个问题由来自 Untamed Theory 的 Tyler Welton 发现的。                                                                                                                                                 | 2019/06/05 | [Rancher v2.2.4](https://github.com/rancher/rancher/releases/tag/v2.2.4), [Rancher v2.1.10](https://github.com/rancher/rancher/releases/tag/v2.1.10) 和 [Rancher v2.0.15](https://github.com/rancher/rancher/releases/tag/v2.0.15) |
| [CVE-2019-13209](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-13209) | 这个漏洞被称之为[WebSocket 跨站劫持](https://www.christian-schneider.net/CrossSiteWebSocketHijacking.html)。黑客可以利用这个漏洞以受害者角色和身份来访问 Rancher 中纳管集群。一旦成功，黑客可以以受害者的权限对 Kubernetes API 发布指令。这个问题是由来自 Workiva 的 Matt Belisle 和 Alex Stevenson 发现的。        | 2019/07/15 | [Rancher v2.2.5](https://github.com/rancher/rancher/releases/tag/v2.2.5), [Rancher v2.1.11](https://github.com/rancher/rancher/releases/tag/v2.1.11) 和 [Rancher v2.0.16](https://github.com/rancher/rancher/releases/tag/v2.0.16) |
| [CVE-2019-14436](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-14436) | 这个漏洞允许拥有修改 Role Binding 的项目成员给自己分配一个集群级别管理员的角色，从而以管理员的权限访问该集群。这个问题是由来自 Nokia 的 Michal Lipinski 发现的。                                                                                                                                                    | 2019/08/05 | [Rancher v2.2.7](https://github.com/rancher/rancher/releases/tag/v2.2.7) 和 [Rancher v2.1.12](https://github.com/rancher/rancher/releases/tag/v2.1.12)                                                                             |
| [CVE-2019-14435](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-14435) | 此漏洞允许经过身份验证的用户潜在地从 Rancher 使用的系统服务容器可访问的 IP 中提取私有数据。这可以包括但不仅限于诸如云提供商元数据服务之类的服务。尽管 Rancher 允许用户配置白名单域以进行系统服务访问，但是精心设计的 HTTP 请求仍可以利用此缺陷。这个问题是由来自 Workiva 的 Matt Belisle 和 Alex Stevenson 发现的。 | 2019/08/05 | [Rancher v2.2.7](https://github.com/rancher/rancher/releases/tag/v2.2.7) 和 [Rancher v2.1.12](https://github.com/rancher/rancher/releases/tag/v2.1.12)                                                                             |

## 安全建议和最佳实践

我们的[最佳实践建议](/docs/best-practices/management/_index)包含了基本的提升 Rancher 安全的建议。
