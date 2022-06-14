---
title: 安全
weight: 20
---

<table width="100%">
<tr style="vertical-align: top;">
<td width="30%" style="border: none;">
<h4>安全策略</h4>
<p style="padding: 8px">Rancher Labs 支持负责任的披露，并致力于在合理的时间内解决所有问题。 </p>
</td>
<td width="30%" style="border: none;">
<h4>报告过程</h4>
<p style="padding: 8px">请将安全问题发送至 <a href="mailto:security@rancher.com">security@rancher.com</a>。</p>
</td>
<td width="30%" style="border: none;">
<h4>公告</h4>
<p style="padding: 8px">订阅 <a href="https://forums.rancher.com/c/announcements">Rancher 公告论坛</a>以获取发布更新。</p>
</td>
</tr>
</table>

安全是 Rancher 全部功能的基础。Rancher 集成了全部主流身份验证工具和服务，并提供了企业级的 [RBAC 功能]({{<baseurl>}}/rancher/v2.6/en/admin-settings/rbac)，让你的 Kubernetes 集群更加安全。

本文介绍了安全相关的文档以及资源，让你的 Rancher 安装和下游 Kubernetes 集群更加安全：

- [在 Kubernetes 集群上运行 CIS 安全扫描](#running-a-cis-security-scan-on-a-kubernetes-cluster)
- [SELinux RPM](#selinux-rpm)
- [Rancher 安装强化指南](#rancher-hardening-guide)
- [CIS Benchmark 和自我评估](#the-cis-benchmark-and-self-assessment)
- [第三方渗透测试报告](#third-party-penetration-test-reports)
- [Rancher 安全公告和 CVE](#rancher-security-advisories-and-cves)
- [Kubernetes 安全最佳实践](#kubernetes-security-best-practices)

### 在 Kubernetes 集群上运行 CIS 安全扫描

Rancher 使用 [kube-bench](https://github.com/aquasecurity/kube-bench) 来运行安全扫描，从而检查 Kubernetes 是否按照 [CIS](https://www.cisecurity.org/cis-benchmarks/)（Center for Internet Security，互联网安全中心）Kubernetes Benchmark 中定义的安全最佳实践进行部署。

CIS Kubernetes Benchmark 是一个参考文档，用于为 Kubernetes 建立安全配置基线。

CIS 是一个 501(c\)(3) 非营利组织，成立于 2000 年 10 月，其使命是识别、开发、验证、促进和维持网络防御的最佳实践方案，并建立和指导社区，以在网络空间中营造信任的环境。

CIS Benchmark 是目标系统安全配置的最佳实践。CIS Benchmark 是由安全专家、技术供应商、公开和私人社区成员，以及 CIS Benchmark 开发团队共同志愿开发的。

Benchmark 提供两种类型的建议，分别是自动（Automated）和手动（Manual）。我们只运行 Automated 相关的测试。

Rancher 在集群上运行 CIS 安全扫描时会生成一份报告，该报告会显示每个测试的结果，包括测试概要以及 `passed`、`skipped` 和 `failed` 的测试数量。报告还包括失败测试的修正步骤。

有关详细信息，请参阅[安全扫描]({{<baseurl>}}/rancher/v2.6/en/cis-scans)。

### SELinux RPM

[安全增强型 Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) 是对 Linux 的安全增强。被政府机构使用之后，SELinux 已成为行业标准，并在 CentOS 7 和 8 上默认启用。

我们提供了 `rancher-selinux` 和 `rke2-selinux` 两个 RPM（Red Hat 软件包），让 Rancher 产品能够在 SELinux 主机上正常运行。有关详细信息，请参阅[此页面]({{<baseurl>}}/rancher/v2.6/en/security/selinux)。

### Rancher 强化指南

Rancher 强化指南基于 <a href="https://www.cisecurity.org/benchmark/kubernetes/" target="_blank">CIS Kubernetes Benchmark</a>。

强化指南为强化 Rancher 的生产安装提供了说明性指导。有关安全管控的完整列表，请参阅 Rancher 的 [CIS Kubernetes Benchmark自我评估指南](#the-cis-benchmark-and-self-sssessment)。

> 强化指南描述了如何保护集群中的节点，建议在安装 Kubernetes 之前参考强化指南中的步骤。

每个强化指南版本都针对特定的 CIS Kubernetes Benchmark、Kubernetes 和 Rancher 版本。

### CIS Benchmark 和自我评估

Benchmark 自我评估是 Rancher 安全强化指南的辅助。强化指南展示了如何强化集群，而 Benchmark 指南旨在帮助你评估强化集群的安全级别。

由于 Rancher 和 RKE 将 Kubernetes 服务安装为 Docker 容器，因此 CIS Kubernetes Benchmark 中的许多管控验证检查都不适用。本指南将介绍各种管控，并提供更新的示例命令来审核 Rancher 创建的集群的合规性。你可以前往 [CIS 网站](https://www.cisecurity.org/benchmark/kubernetes/)下载原始的 Benchmark 文档。

Rancher 每个版本的自我评估指南都对应特定的强化指南、Rancher、Kubernetes 和 CIS Benchmark 版本。

### 第三方渗透测试报告

Rancher 会定期聘请第三方对 Rancher 2.x 软件栈进行安全审核和渗透测试。测试环境会遵循 Rancher 提供的强化指南。测试结果会在第三方确认我们已经修复了 MEDIUM 或以上的问题后发布。

结果：

- [Cure53 渗透测试 - 2019 年 7 月](https://releases.rancher.com/documents/security/pen-tests/2019/RAN-01-cure53-report.final.pdf)
- [Untamed Theory 渗透测试 - 2019 年 3 月](https://releases.rancher.com/documents/security/pen-tests/2019/UntamedTheory-Rancher_SecurityAssessment-20190712_v5.pdf)

### Rancher 安全公告和 CVE

Rancher 致力于向社区披露我们产品的安全问题。有关我们已解决问题的 CVE（Common Vulnerabilities and Exposures，通用漏洞披露）列表，请参阅[此页面](./cve)。

### Kubernetes 安全最佳实践

有关保护 Kubernetes 集群的建议，请参阅 [Kubernetes 安全最佳实践指南](./best-practices)。
