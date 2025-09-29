---
title: 集群日志
description: Rancher 支持与以下日志收集目标服务集成：Elasticsearch、Splunk、Kafka、Syslog、Fluentd。日志服务提供了以下功能：捕获并分析集群的状态、在您的环境中分析趋势，寻找集群变化的规律、将日志保存到集群外的安全位置、随时了解容器崩溃，Pod 驱逐或节点死亡等事件、更轻松地调试和排除故障。
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
  - 集群管理员指南
  - 集群工具
  - 集群日志
---

Rancher 支持与以下日志收集目标服务集成：

- Elasticsearch
- Splunk
- Kafka
- Syslog
- Fluentd

日志服务提供了以下功能：

- 捕获并分析集群的状态
- 在您的环境中分析趋势，寻找集群变化的规律
- 将日志保存到集群外的安全位置
- 随时了解容器崩溃，Pod 驱逐或节点死亡等事件
- 更轻松地调试和排除故障

## Rancher 日志服务的工作原理

Rancher 使用 Fluentd 收集日志，并与外部日志服务集成。

当配置 Rancher 与外部日志服务集成时，必须为 Rancher 指明这些服务的访问地址并提供访问这些服务的身份验证信息。

Fluentd 收集保存在节点上 `/var/log/containers` 目录下的容器日志，其中包含了容器的标准输出日志和错误日志并发送到外部日志服务，您可以进入接收日志的外部日志服务查看日志。

> **注意：** 您只能为每个集群或每个项目配置一个外部日志服务。

## 先决条件

集群中每个节点上的 Docker 守护进程应[配置](https://docs.docker.com/config/containers/logging/configure/) （默认）日志驱动为: `json-file`。您可以通过运行以下命令来检查日志驱动配置：

```shell
docker info | grep 'Logging Driver'
Logging Driver: json-file
```

## 日志收集范围

您可以在集群级别或项目级别配置日志收集范围。

- 集群日志采集集群中所有 Pod 的日志，即包含所有项目。对于 [RKE 集群](/docs/rancher2/cluster-provisioning/rke-clusters/)，它还会收集所有 Kubernetes 系统组件的日志。
- [项目级别的日志](/docs/rancher2/project-admin/tools/project-logging/)收集所有在这个项目下的 Pod 的日志。

发送到外部日志服务的日志来源于：

- Pod 日志地址： `/var/log/containers`。
- Kubernetes 系统组件日志地址： `/var/lib/rancher/rke/log/`。

## 开启集群级别的日志

作为[系统管理员](/docs/rancher2/admin-settings/rbac/global-permissions/)或者[集群所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/)，您可以配置 Rancher 把集群的日志发送到外部的日志服务。

1. 从**全局**视图中，进入要收集日志的集群。

1. 在导航栏中选择**工具>日志**。

1. 选择一个日志服务，然后输入配置。有关详细的配置，请参考特定的服务。Rancher 支持与以下日志服务集成：

   - [Elasticsearch 配置指南](/docs/rancher2/cluster-admin/tools/cluster-logging/elasticsearch/)
   - [Splunk 配置指南](/docs/rancher2/cluster-admin/tools/cluster-logging/splunk/)
   - [Kafka 配置指南](/docs/rancher2/cluster-admin/tools/cluster-logging/kafka/)
   - [Syslog 配置指南](/docs/rancher2/cluster-admin/tools/cluster-logging/syslog/)
   - [Fluentd 配置指南](/docs/rancher2/cluster-admin/tools/cluster-logging/fluentd/)

1. （可选）您可以通过单击位于日志记录目标上方的**以文件形式编辑**，输入自定义高级配置。此链接仅在选择日志服务后可见。使用文件编辑器，为任何日志服务输入原始的 Fluentd 配置。有关如何设置输出配置，请参阅每个日志服务的文档。

   - [Elasticsearch 文档](https://github.com/uken/fluent-plugin-elasticsearch)
   - [Splunk 文档](https://github.com/fluent/fluent-plugin-splunk)
   - [Kafka 文档](https://github.com/fluent/fluent-plugin-kafka)
   - [Syslog 文档](https://github.com/dlackty/fluent-plugin-remote_syslog)
   - [Fluentd 文档](https://docs.fluentd.org/v1.0/articles/out_forward)

   如果日志记录服务使用的是 TLS，则还需要填写 **SSL 配置**。

   1. 提供**客户端私钥**和**客户端证书**。您可以复制粘贴字符串到相应的位置，也可以单击**从文件读取**，上传证书。

      - 您可以使用自签名证书，或使用证书颁发机构提供的证书。

      - 您可以使用 openssl 命令生成自签名证书。例如：

        ```
        openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
        ```

   2. 如果使用的是自签名证书，请选择**启用-输入受信任的服务器证书**，并提供 **PEM 格式的 CA 证书**。

1. (可选) 填写 **其他日志配置**。

   1. 使用**添加字段**按钮将自定义日志字段添加到您的日志中。这些字段是键值对（例如`foo = bar`），可用于区分来自不同系统的日志。

   1. 输入**刷新间隔**。定义 [Fluentd](https://www.fluentd.org/) 的日志刷新频率，刷新间隔的单位是秒。

   1. 是否**包含系统日志**。勾选后，Rancher 把来自系统项目和 RKE 组件中的 Pod 的日志发送到日志服务，不勾选则会排除系统日志，Rancher 不会把这些日志发送到日志服务。

1. 单击 **测试**，将测试日志发送到日志服务。如果使用以文件形式自定义配置，则此按钮将替换为 _试运行_ 。在这种情况下，Rancher 调用 Fluentd dry run 命令以验证配置。

1. 单击 **保存**。

**结果：** 现在，Rancher 已配置为把日志发送到所选的外部日志服务。登录到对应的外部日志服务，您可以开始查看相关的集群日志。

## 相关链接

[日志架构](https://kubernetes.io/zh/docs/concepts/cluster-administration/logging/)
