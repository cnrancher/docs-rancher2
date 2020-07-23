---
title: 云服务提供商
---

RKE 支持为 Kubernetes 集群设置特定的[云服务提供商](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)。这些云服务提供商有特定的配置参数。

要启用云服务提供商，必须在`cluster.yaml`中的`cloud_provider`参数中提供其名称以及任何所需配置选项，RKE 支持的云服务提供商如下：

- [AWS](/docs/rke/config-options/cloud-providers/aws/_index)
- [Azure](/docs/rke/config-options/cloud-providers/azure/_index)
- [OpenStack](/docs/rke/config-options/cloud-providers/openstack/_index)
- [vSphere](/docs/rke/config-options/cloud-providers/vsphere/_index)

除了上述云服务提供商之外，RKE 还支持[自定义云提供商](/docs/rke/config-options/cloud-providers/custom/_index)。
