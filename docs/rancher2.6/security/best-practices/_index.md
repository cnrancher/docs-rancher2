---
title: Kubernetes 安全最佳实践
weight: 5
---

### 限制云元数据 API 访问

AWS、Azure、DigitalOcean 或 GCP 等云提供商通常会在本地向实例公开元数据服务。默认情况下，此端点可被运行在云实例上的 pod 访问，包括在托管的 Kubernetes（如 EKS、AKS、DigitalOcean Kubernetes 或 GKE）中的 pod，并且可以包含该节点的云凭证、配置数据（如 kubelet 凭证）以及其他敏感数据。为了降低在云平台上运行的这种风险，请遵循 [Kubernetes 安全建议](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/#restricting-cloud-metadata-api-access)，即限制授予实例凭证的权限，使用网络策略限制 pod 对元数据 API 的访问，并避免使用配置数据来传递密文。

建议你参阅你使用的云提供商的安全最佳实践，获取限制对云实例元数据 API 访问的建议和详情。

要获取更多参考资料，请参阅 MITRE ATT&CK 知识库 - [不安全凭证：云实例元数据 API](https://attack.mitre.org/techniques/T1552/005/)。
