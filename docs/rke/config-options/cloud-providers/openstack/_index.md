---
title: Openstack
---

## 概述

要启用 Openstack 云提供商，除了设置名称为`openstack`外，还必须设置特定的配置选项。Openstack 配置选项分为不同的部分。

```yaml
cloud_provider:
  name: openstack
  openstackCloudProvider:
    global:
      username: xxxxxxxxxxxxxx
      password: xxxxxxxxxxxxxx
      auth-url: https://1.2.3.4/identity/v3
      tenant-id: xxxxxxxxxxxxxx
      domain-id: xxxxxxxxxxxxxx
    load_balancer:
      subnet-id: xxxxxxxxxxxxxx
    block_storage:
      ignore-volume-az: true
    route:
      router-id: xxxxxxxxxxxxxx
    metadata:
      search-order: xxxxxxxxxxxxxx
```

## 覆盖主机名称

OpenStack 使用实例名称（由 OpenStack 元数据确定）作为 Kubernetes Node 对象的名称，你必须通过为每个节点设置`hostname_override`来覆盖节点上的 Kubernetes 名称。如果不设置`hostname_override`，Kubernetes 节点名称将被设置为`address`，会导致配置 Openstack 失败。

## Openstack 配置选项

Openstack 配置选项分为以下五个类别：

- 全局配置选项
- 负载均衡配置选项
- 块存储配置选项
- 路由配置选项
- 元数据配置选项

### 全局配置选项

以下是`global`的可用选项。

| 名称        | 类型   | 是否必填 |
| :---------- | :----- | :------- |
| auth_url    | string | 是       |
| username    | string | 是       |
| user-id     | string | 是       |
| password    | string | 是       |
| tenant-id   | string | 是       |
| tenant-name | string | 否       |
| trust-id    | string | 否       |
| domain-id   | string | 否       |
| domain-name | string | 否       |
| region      | string | 否       |
| ca-file     | string | 否       |

### 负载均衡配置选项

以下是`load_balancer`的可用选项。

| 名称                   | 类型   | 是否必填                                |
| :--------------------- | :----- | :-------------------------------------- |
| lb-version             | string | 否                                      |
| use-octavia            | bool   | 否                                      |
| subnet-id              | string | 否                                      |
| floating-network-id    | string | 否                                      |
| lb-method              | string | 否                                      |
| lb-provider            | string | 否                                      |
| manage-security-groups | bool   | 否                                      |
| create-monitor         | bool   | 否                                      |
| monitor-delay          | int    | 当`create-monitor` 的值为 true 时，必填 |
| monitor-timeout        | int    | 当`create-monitor` 的值为 true 时，必填 |
| monitor-max-retries    | int    | 当`create-monitor` 的值为 true 时，必填 |

### 块存储配置选项

以下是`block_storage`的可用选项。

| 名称              | 类型   | 是否必填 |
| :---------------- | :----- | :------- |
| bs-version        | string | 否       |
| trust-device-path | bool   | 否       |
| ignore-volume-az  | bool   | 否       |

### 路由配置选项

以下是`route`的可用选项。

| 名称      | 类型   | 是否必填 |
| :-------- | :----- | :------- |
| router-id | string | 否       |

### 元数据配置选项

以下是`route`的可用选项。

| 名称            | 类型   | 是否必填 |
| :-------------- | :----- | :------- |
| search-order    | string | 否       |
| request-timeout | int    | 否       |

更多关于 Openstack 配置选项的信息请参考[Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/cluster-administration/cloud-providers/#openstack)。
