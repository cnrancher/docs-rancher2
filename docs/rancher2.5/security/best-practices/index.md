---
title: Kubernetes 安全最佳实践
description: Rancher 致力于向社区披露我们产品的安全问题。Rancher 将对修复的问题通过发布 CVEs(通用漏洞披露，Common Vulnerabilities and Exposures)通知社区。
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
  - Kubernetes 安全最佳实践
---

## 限制 cloud metadata API API 访问

AWS、Azure 或 GCP 等云提供商通常在本地向实例暴露元数据服务。默认情况下，在云实例上运行的 pod 可以访问这个端点，包括 EKS、AKS 或 GKE 等托管 Kubernetes 提供商中的 pod，并且可以包含该节点的云凭证、kubelet 凭证等配置数据或其他敏感数据。为了减轻在云平台上运行时的这种风险，请遵循 [Kubernetes 安全建议](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/#restricting-cloud-metadata-api-access)：限制给予实例凭证的权限，使用网络策略来限制 pod 对元数据 API 的访问，并避免使用供应数据来传递 secret。
