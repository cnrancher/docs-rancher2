---
title: Rancher Agent 参数
description: ancher 在每个节点上部署一个 Agent 来与节点通信。本页描述了可以传递给 Agent 的选项。要使用这些选项，您需要使用自定义节点创建集群，并在添加节点时将选项添加到生成的`docker run`命令中。
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
  - 创建集群
  - 自定义集群
  - Rancher Agent 参数
---

Rancher 在每个节点上部署一个 Agent 来与节点通信。本页描述了可以传递给 Agent 的选项。要使用这些选项，您需要[使用自定义节点创建集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)，并在添加节点时将选项添加到生成的`docker run`命令中。

有关 Rancher 如何使用 Node Agent 与下游集群通信的概述，请参阅[产品架构](/docs/overview/architecture/_index)。

## 通用选项

| 参数            | 环境变量             | 描述                                                                                                 |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `--server`      | `CATTLE_SERVER`      | 已配置的 Rancher `server-url`，Agent 将通过这个地址连接 Server。                                     |
| `--token`       | `CATTLE_TOKEN`       | 在 Rancher 中注册节点所需的 token。                                                                  |
| `--ca-checksum` | `CATTLE_CA_CHECKSUM` | 使用已配置的 Rancher`cacerts`进行 SHA256 校验和来验证                                                |
| `--node-name`   | `CATTLE_NODE_NAME`   | 重写注册节点的主机名（默认为`hostname -s`)                                                           |
| `--label`       | `CATTLE_NODE_LABEL`  | 向节点添加节点标签。对于多个标签，请传递额外的`--label`选项。(`--label key=value`)                   |
| `--taints`      | `CATTLE_NODE_TAINTS` | 将节点 taints 添加到节点。对于多个 taints，请传递额外的`--taints`选项。(`--taints key=value:effect`) |

## 角色选项

| 参数             | 环境变量       | 描述                                                 |
| ---------------- | -------------- | ---------------------------------------------------- |
| `--all-roles`    | `ALL=true`     | 将所有角色(`etcd`,`controlplane`,`worker`)应用到节点 |
| `--etcd`         | `ETCD=true`    | 将角色`etcd`应用到节点                               |
| `--controlplane` | `CONTROL=true` | 将角色`controlplane`应用到节点                       |
| `--worker`       | `WORKER=true`  | 将角色`worker`应用到节点                             |

## IP 地址选项

| 参数                 | 环境变量                  | 描述                                                   |
| -------------------- | ------------------------- | ------------------------------------------------------ |
| `--address`          | `CATTLE_ADDRESS`          | 该节点将注册的 IP 地址（默认为用来连接 `8.8.8.8`的 IP) |
| `--internal-address` | `CATTLE_INTERNAL_ADDRESS` | 私有网络上用于主机间通信的 IP 地址                     |

### 动态获取 IP 地址

出于自动化的目的，您不能在命令中指定节点 IP 地址，因为它必须是通用的才能用于每个节点。为此，我们有动态 IP 地址选项。它们用作现有 IP 地址选项的值。支持`--address`和`--internal-address`。

| 值             | 例子                    | 描述                                                                                                                                                  |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 接口名称       | `--address eth0`        | 将从给定的接口中检索第一个配置的 IP 地址                                                                                                              |
| `ipify`        | `--address ipify`       | 从`https://api.ipify.org`获取的值将被使用                                                                                                             |
| `awslocal`     | `--address awslocal`    | 从`http://169.254.169.254/latest/meta-data/local-ipv4`获取的值将被使用                                                                                |
| `awspublic`    | `--address awspublic`   | 从`http://169.254.169.254/latest/meta-data/public-ipv4`获取的值将被使用                                                                               |
| `doprivate`    | `--address doprivate`   | 从`http://169.254.169.254/metadata/v1/interfaces/private/0/ipv4/address`获取的值将被使用                                                              |
| `dopublic`     | `--address dopublic`    | 从`http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address`获取的值将被使用                                                               |
| `azprivate`    | `--address azprivate`   | 从`http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/privateIpAddress?api-version=2017-08-01&format=text`获取的值将被使用 |
| `azpublic`     | `--address azpublic`    | 从`http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2017-08-01&format=text`获取的值将被使用  |
| `gceinternal`  | `--address gceinternal` | 从`http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/ip`获取的值将被使用                                               |
| `gceexternal`  | `--address gceexternal` | 从`http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip`获取的值将被使用                     |
| `packetlocal`  | `--address packetlocal` | 从`https://metadata.packet.net/2009-04-04/meta-data/local-ipv4`获取的值将被使用                                                                       |
| `packetpublic` | `--address packetlocal` | 从`https://metadata.packet.net/2009-04-04/meta-data/public-ipv4`获取的值将被使用                                                                      |
