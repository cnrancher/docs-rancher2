---
title: Azure
description: 本文介绍了配置Azure云厂商的操作步骤。
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
  - RKE
  - 配置选项
  - 云服务提供商
  - Azure
---

## 概述

除了将名称设置为`azure`外，还必须设置一些特定的配置选项，才可以启用 Azure 云提供商。此外，Azure 节点名称还必须与 Kubernetes 节点名称一致。

```yaml
cloud_provider:
  name: azure
  azureCloudProvider:
    aadClientId: xxxxxxxxx
    aadClientSecret: xxxxxxxxx
    location: xxxxxxxxx
    resourceGroup: xxxxxxxxx
    subnetName: xxxxxxxxx
    subscriptionId: xxxxxxxxx
    vnetName: xxxxxxxxx
    tenantId: xxxxxxxxx
    securityGroupName: xxxxxxxxx
```

## 覆盖主机名称

因 Azure 节点名称必须与 Kubernetes 节点名称相匹配，可以通过为每个节点设置`hostname_override`来覆盖节点上的 Kubernetes 名称。如果不设置`hostname_override`，Kubernetes 节点名将被设置为`address`，会导致 Azure 云提供商失败。

```yaml
nodes:
  - address: x.x.x.x
    hostname_override: azure-rke1
    user: ubuntu
    role:
      - controlplane
      - etcd
      - worker
```

## Azure 配置选项列表

除了上文中的 Azure 选项，RKE 还支持许多其他选项，详情请参考下表。

| Azure 配置选项               | 类型   | 是否必填 |
| :--------------------------- | :----- | :------- |
| tenantId                     | string | 是       |
| subscriptionId               | string | 是       |
| aadClientId                  | string | 是       |
| aadClientSecret              | string | 是       |
| cloud                        | string | 否       |
| resourceGroup                | string | 否       |
| location                     | string | 否       |
| vnetName                     | string | 否       |
| vnetResourceGroup            | string | 否       |
| subnetName                   | string | 否       |
| securityGroupName            | string | 否       |
| routeTableName               | string | 否       |
| primaryAvailabilitySetName   | string | 否       |
| vmType                       | string | 否       |
| primaryScaleSetName          | string | 否       |
| aadClientCertPath            | string | 否       |
| aadClientCertPassword        | string | 否       |
| cloudProviderBackoff         | bool   | 否       |
| cloudProviderBackoffRetries  | int    | 否       |
| cloudProviderBackoffExponent | int    | 否       |
| cloudProviderBackoffDuration | int    | 否       |
| cloudProviderBackoffJitter   | int    | 否       |
| cloudProviderRateLimit       | bool   | 否       |
| cloudProviderRateLimitQPS    | int    | 否       |
| cloudProviderRateLimitBucket | int    | 否       |
| useInstanceMetadata          | bool   | 否       |
| useManagedIdentityExtension  | bool   | 否       |
| maximumLoadBalancerRuleCount | int    | 否       |
