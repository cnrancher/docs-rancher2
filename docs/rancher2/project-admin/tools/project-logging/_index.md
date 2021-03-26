---
title: 日志
---

Rancher 可以跟 Kubernetes 集群外部的多种主流日志服务或日志工具集成。

如果您需要了解 Rancher 与日志服务或工具集成的工作原理，请参考[集群管理员章节](/docs/rancher2/project-admin/tools/project-logging/_index)相关文档。

Rancher 支持与下列日志服务集成：

- Elasticsearch
- Splunk
- Kafka
- Syslog
- Fluent

> **说明：**Rancher 以集群或项目为单位配置日志服务，您可以给每个集群或项目配置日志服务。

只有[管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)、[集群所有者或集群成员](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)或[项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)有权限配置 Rancher 的日志功能。

## 先决条件

集群中的每一个节点的 Docker daemon 都应该使用默认的日志驱动[配置](https://docs.docker.com/config/containers/logging/configure/)：`json-file`。您可以运行以下命令，检查每个节点是否已经完成了配置，如果返回结果是`Logging Driver: json-file`的话，则表示已经完成了配置。

```shell
docker info | grep 'Logging Driver'
Logging Driver: json-file
```

## 日志功能的优势

日志服务记录了集群或项目发生的事件，配置日志服务有以下几点优势：

- 记录 Kubernetes 集群中的错误日志流和告警日志流。日志流可以让您知道集群或项目中发生的事件，如容器崩溃、Pod 驱逐或节点死亡。
- 允许您获取和分析集群的状态，使用日志流分析特定环境中集群变化的趋势。
- 帮助您进行调试和定位问题。
- 在集群以外的位置保存日志，如果您的集群出现问题，您仍然可以访问这些日志。

## 日志层级

Rancher 支持启用集群层级的日志功能和项目层级的日志功能，而且您可以同时启用两个层级日志功能。

- [集群日志](/docs/rancher2/project-admin/tools/project-logging/_index)记录了包括集群中每一个项目，每一个 Pod 的活动。[RKE 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)开启了日志功能后，会记录 Kubernetes 系统组件的活动。

- 项目日志记录了该项目内每一个 Pod 的活动。

发送到日志服务的日志主要有两种：

- 存储在`/var/log/containers`的 Pod 日志

- 存储在`/var/lib/rancher/rke/logs/`的 Kubernetes 组件日志。

## 开启项目日志功能

1. 从**全局**页面导航到需要开启日志功能的项目。

1. 在导航栏单击**工具 > 日志**，进入日志配置页面。如果您使用的是 Rancher v2.2.0 以前的版本，您需要在航栏单击**资源 > 日志**，进入日志配置页面。
1. 选择一个日志服务，输入配置参数。每个日志服务需要输入的参数都不一样，请参考每个日志服务的操作文档输入参数。Rancher 支持的日志服务有以下几种：

   - [Elasticsearch](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/elasticsearch/_index)
   - [Splunk](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/splunk/_index)
   - [Kafka](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/kafka/_index)
   - [Syslog](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/syslog/_index)
   - [Fluentd](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/fluentd/_index)

1. （可选）您可以使用 Rancher UI 配置日志服务的常规参数，也可以在选定日志服务后，单击**编辑文件**，输入自定义高级配置。

   - 单击**编辑文件**，跳转到一个带有文本编辑器的新页面，您可以使用编辑器输入原始的 fluentd 配置，配置日志服务。Elasticresearch、Splunk、Kafka、Syslog 和 Fluentd 的参数配置详情请参考以下链接：

     - [Elasticsearch 官方文档](https://github.com/uken/fluent-plugin-elasticsearch)
     - [Splunk 官方文档](https://github.com/fluent/fluent-plugin-splunk)
     - [Kafka 官方文档](https://github.com/fluent/fluent-plugin-kafka)
     - [Syslog 官方文档](https://github.com/dlackty/fluent-plugin-remote_syslog)
     - [Fluentd 官方文档](https://docs.fluentd.org/v1.0/articles/out_forward)

   - 如果您选择的日志服务使用了 TLS 证书，您需要完成 **SSL 配置**表格。

     1. 提供**客户端私钥**和**客户端证书**。您可以复制粘贴，或单击**从文件中读取**，以文件的形式上传密钥和证书。

        - 您可以使用自签名证书或由证书签发机构提供的证书。

        - 您可使用以下命令生产自签名证书：

        ```
         openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
        ```

     2. 如果您使用的是自签名证书，请提供 **CA Certificate PEM**。

1. （可选）填写**其他日志配置** 表格。

   1. **可选：**单击 **添加字段** ，添加自定义日志字段。这些字段是过滤日志的键值对，例如`foo=bar`。

   1. 输入**刷新时间间隔**，这个值决定了[Fluentd](https://www.fluentd.org/)向日志服务器推送数据的频率，时间间隔的单位是秒。

   1. **是否支持 JSON 解析**，选择是否支持 JSON 字段解析。

1. 单击**测试**，Rancher 把测试日志发送到日志服务。

   > **说明：**如果您使用的自定义配置，该按键名会变成**试运行**，而不是**测试**。单击**试运行**，Rancher 会命令 fluentd 试运行配置，验证自定义配置是否正确。

1. 单击**保存**。

**结果：**完成 Rancher 日志的配置，Rancher 现在可以把日志发送到指定的日志服务中，您可以通过日志服务查看 Rancher 的日志。

## 相关链接

[Kubernetes 官方文档-日志架构](https://kubernetes.io/zh/docs/concepts/cluster-administration/logging/)
