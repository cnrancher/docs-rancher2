---
title: 架构
weight: 1
---

Fleet 可以管理来自 Git 的原始 Kubernetes YAML、Helm Chart、Kustomize 或三者的任何组合的部署。无论来源如何，所有资源都会动态转化为 Helm Chart，Helm 会用作引擎来将所有资源部署到集群中。这给了你高度的控制、一致性和可审计性。Fleet 不仅关注扩展能力，而且还提供高度的控制和可见性，从而让用户准确了解集群上安装的内容。

![架构]({{<baseurl>}}/img/rancher/fleet-architecture.svg)

