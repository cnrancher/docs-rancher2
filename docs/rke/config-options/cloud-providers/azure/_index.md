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

|   Azure Configuration Options |  Type  	| Required  | Description |
|:----------------------------:	|:------:	|:---------:|:-----------:|
|           tenantId           	| string 	|   *    | The Azure Active Directory (Azure AD) tenant ID for the subscription that the cluster is deployed in. |
|        subscriptionId        	| string 	|   *    | The ID of the Azure subscription that the cluster is deployed in. |
|          aadClientId         	| string 	|   *    | The client ID for an Azure AD application with RBAC access to talk to Azure Resource Manager APIs. This is used for [service principal](https://github.com/Azure/aks-engine/blob/master/docs/topics/service-principals.md) authentication. |
|        aadClientSecret       	| string 	|   *    | The client secret for an Azure AD application with RBAC access to talk to Azure Resource Manager APIs. This is used for [service principal](https://github.com/Azure/aks-engine/blob/master/docs/topics/service-principals.md) authentication. |
|             cloud            	| string 	|      | The cloud environment identifier. Takes values from [here](https://github.com/Azure/go-autorest/blob/ec5f4903f77ed9927ac95b19ab8e44ada64c1356/autorest/azure/environments.go#L13). |
|         resourceGroup        	| string 	|      | The name of the resource group that the Vnet is deployed in. |
|           location           	| string 	|      | The location of the resource group that the cluster is deployed in. |
|           vnetName           	| string 	|      | The name of the virtual network that the cluster is deployed in. |
|       vnetResourceGroup      	| string 	|      | The name of the resource group that the virtual network is deployed in. |
|          subnetName          	| string 	|      | The name of the subnet that the cluster is deployed in. |
|       securityGroupName      	| string 	|      | The name of the security group attached to the cluster's subnet. |
|        routeTableName        	| string 	|      | The name of the route table attached to the subnet that the cluster is deployed in. |
|  primaryAvailabilitySetName  	| string 	|      | The name of the availability set that should be used as the load balancer backend. If this is set, the Azure cloud provider will only add nodes from that availability set to the load balancer backend pool. If this is not set, and multiple agent pools (availability sets) are used, then the cloud provider will try to add all nodes to a single backend pool which is forbidden. In other words, if you use multiple agent pools (availability sets), you **must** set this field. |
|            vmType            	| string 	|      | The type of Azure nodes. Candidate values are: `vmss` and `standard`. If not set, it will be default to `standard`. Set to `vmss` if the cluster is running on [Azure virtual machine scale sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview) instead of standard machines. |
|      primaryScaleSetName     	| string 	|      | The name of the scale set that should be used as the load balancer backend. If this is set, the Azure cloud provider will only add nodes from that scale set to the load balancer backend pool. If this is not set, and multiple agent pools (scale sets) are used, then the cloud provider will try to add all nodes to a single backend pool which is forbidden. In other words, if you use multiple agent pools (scale sets), you **must** set this field. |
|       aadClientCertPath      	| string 	|      | The path of a client certificate for an Azure AD application with RBAC access to talk to Azure Resource Manager APIs. This is used for [client certificate authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service). |
|     aadClientCertPassword    	| string 	|      | The password of the client certificate for an Azure AD application with RBAC access to talk to Azure Resource Manager APIs. This is used for [client certificate authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service). |
|     cloudProviderBackoff     	|  bool  	|      | Enable exponential backoff to manage resource request retries. |
|  cloudProviderBackoffRetries 	|   int  	|      | Backoff retry limit. |
| cloudProviderBackoffExponent 	|   int  	|      | Backoff exponent. |
| cloudProviderBackoffDuration 	|   int  	|      | Backoff duration. |
|  cloudProviderBackoffJitter  	|   int  	|      | Backoff jitter. |
|    cloudProviderRateLimit    	|  bool  	|      | Enable rate limiting. |
|   cloudProviderRateLimitQPS  	|   int  	|      | Rate limit QPS. |
| cloudProviderRateLimitBucket 	|   int  	|      | Rate limit bucket Size. |
|      useInstanceMetadata     	|  bool  	|      | Use instance metadata service where possible. |
|  useManagedIdentityExtension 	|  bool  	|      | Use managed service identity for the virtual machine to access Azure Resource Manager APIs. This is used for [managed identity authentication](https://docs.microsoft.com/en-us/azure/active-directory/managed-service-identity/overview). For user-assigned managed identity, `UserAssignedIdentityID` needs to be set. |
|  UserAssignedIdentityID       | string        |      | The client ID of the user assigned Managed Service Identity (MSI) which is assigned to the underlying VMs. This is used for [managed identity authentication](https://docs.microsoft.com/en-us/azure/active-directory/managed-service-identity/overview). |
| maximumLoadBalancerRuleCount 	|   int  	|      | The limit enforced by Azure Load balancer. The default is `0` and maximum is `148`. |
| LoadBalancerSku               | string        |      | SKU of the load balancer and public IP. Valid values are  `basic` or `standard`. Default(blank) to `basic`. |
| ExcludeMasterFromStandardLB   | bool          |      | Excludes master nodes (labeled with `node-role.kubernetes.io/master`) from the backend pool of Azure standard loadbalancer. Defaults to `nil`. |