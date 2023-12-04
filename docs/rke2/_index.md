---
title: RKE2 介绍
description: RKE2，也被称为 RKE Government，是 Rancher 的下一代 Kubernetes 发行版。
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
  - RKE2
  - RKE2 介绍
---

![](./assets/logo-horizontal-rke.svg)

RKE2，也被称为 RKE Government，是 Rancher 的下一代 Kubernetes 发行版。

为了实现这些目标，RKE2 做了以下工作:

- 提供[默认值和配置选项](/docs/rke2/security/hardening_guide/_index)，允许集群在最小的操作干预下通过 CIS Kubernetes Benchmark [v1.6](/docs/rke2/security/cis_self_assessment16/_index)。
- 启用 [FIPS 140-2 标准](/docs/rke2/security/fips_support/_index)
- 在我们的构建管道中使用[trivy](https://github.com/aquasecurity/trivy)定期扫描组件的 CVEs。

## 这与 RKE 或 K3s 有什么不同？

RKE2 结合了 RKE1.x 版本（以下简称 RKE1）和 K3s 的优点和特性。

从 K3s 中，它继承了可用性、易操作性和部署模式。

从 RKE1 来看，它继承了与上游 Kubernetes 的紧密一致性。在一些地方，K3s 与上游的 Kubernetes 有分歧，以便为边缘部署进行优化，但 RKE1 和 RKE2 可以与上游保持密切一致。

重要的是，RKE2 不像 RKE1 那样依赖 Docker。RKE1 利用 Docker 来部署和管理控制平面组件以及 Kubernetes 的容器运行时间。RKE2 将控制平面组件作为静态 pod 启动，由 kubelet 管理。嵌入的容器运行时是 containerd。

## 为什么有两个名字？

它被称为 RKE Government，目的是传达其当前针对的主要用例和部门。

它也被称为 RKE 2，因为它是 Rancher Kubernetes 引擎针对数据中心用例的下一次迭代。

## 安全

Rancher Labs 支持负责任的披露，并努力在合理的时间范围内解决安全问题。要报告安全漏洞，请发送电子邮件至[security@rancher.com](mailto:security@rancher.com)。
