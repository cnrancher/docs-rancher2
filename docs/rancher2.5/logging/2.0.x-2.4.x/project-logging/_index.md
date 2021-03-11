---
title: 项目日志
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
  - 项目日志
---

Rancher 可以与您的 Kubernetes 集群之外存在的各种流行的日志服务和工具集成。

有关日志集成如何工作的背景信息，请参阅[集群管理部分](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/_index)。

Rancher 支持以下服务：

- Elasticsearch
- Splunk
- Kafka
- syslog
- Fluentd

**注意：**您只能为每个集群或每个项目配置一个日志服务。

只有[管理员](/docs/rancher2/admin-settings/rbac/global-permissions/_index)、[集群所有者或成员](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)，或者[项目所有者](/docs/rancher2/admin-settings/rbac/cluster-project-roles/_index)可以配置 Rancher 将 Kubernetes 日志发送到日志服务。

## 所需资源

集群中每个节点上的 Docker 守护进程应该是[configured](https://docs.docker.com/config/containers/logging/configure/)，并使用（默认）log-driver：`json-file`。你可以通过运行以下命令来检查日志驱动。

```bash
$ docker info | grep 'Logging Driver'
Logging Driver: json-file
```

## 优势

设置日志服务来收集集群和项目的日志有以下几个优点：

- 将 Kubernetes 基础设施中的错误和警告记录到一个 stream 中。该 stream 会通知你容器崩溃、pod eviction 或节点死亡等事件。
- 允许您捕获和分析集群的状态，并使用日志流寻找环境中的变化趋势。
- 可以帮助您进行故障排除或调试时。
- 将您的日志保存到集群之外的安全位置，这样即使您的集群遇到问题，您仍然可以访问它们。

## 记录范围

你可以在集群级或项目级配置日志记录。

- [集群日志](/docs/rancher2/cluster-admin/tools/_index)为集群中的每个 pod 写日志，也就是在所有的项目中。对于[RKE 集群](/docs/rancher2/cluster-provisioning/rke-clusters/_index)，它还为所有 Kubernetes 系统组件写日志。

- 项目日志为指定项目中的每个 pod 写日志。

发送给你的日志服务的日志来自以下位置：

- Pod 日志存储在`/var/log/containers`。

- Kubernetes 系统组件日志存储在`/var/lib/rancher/rke/logs/`。

## 启用项目记录

1.  从**全局**视图中，导航到要配置项目日志的项目。

1.  在导航栏中选择**工具 > 日志**。在 v2.2.0 之前的版本中，您可以选择**资源 > 日志记录**。

1.  选择一个日志记录服务并进入配置。详细配置请参考具体服务。Rancher 支持以下服务。

    - [Elasticsearch](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/elasticsearch/_index)
    - [Splunk](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/splunk/_index)
    - [Kafka](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/kafka/_index)
    - [Syslog](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/syslog/_index)
    - [Fluentd](/docs/rancher2/logging/2.0.x-2.4.x/cluster-logging/fluentd/_index)

1.  (可选)不使用用户界面配置日志服务，而是单击位于日志目标上方的**编辑为文件**，进入自定义高级配置。该链接只有在您选择日志服务后才可见。

    - 通过文件编辑器，输入任何日志服务的原始 fluentd 配置。关于如何设置输出配置，请参考每个日志服务的文档。

      - [Elasticsearch 文档](https://github.com/uken/fluent-plugin-elasticsearch)
      - [Splunk 文档](https://github.com/fluent/fluent-plugin-splunk)
      - [Kafka 文件](https://github.com/fluent/fluent-plugin-kafka)
      - [系统日志文件](https://github.com/dlackty/fluent-plugin-remote_syslog)
      - [Fluentd 文件](https://docs.fluentd.org/v1.0/articles/out_forward)

    - 如果日志服务使用 TLS，还需要填写**SSL 配置**表。

      1. 提供**客户端私钥**和**客户端证书**。您可以复制并粘贴它们，或者使用**从文件中读取**按钮上传它们。

         - 你可以使用自签证书或由证书机构提供的证书。

         - 你可以使用 openssl 命令生成自签证书，例如：

           ```bash
           openssl req -x509 -newkey rsa:2048 -keyout myservice.key -out myservice.cert -days 365 -nodes -subj "/CN=myservice.example.com"
           ```

      2. 如果使用自签证书，请提供**CA 证书 PEM**。

1.  （可选）填写**附加日志配置**表。

    1. 使用**添加字段**按钮将自定义日志字段添加到日志配置中。这些字段是键值对（如`foo=bar`），您可以使用它们来过滤来自其他系统的日志。

    1. 输入**flush interval**，该值决定[Fluentd](https://www.fluentd.org/)向日志服务器刷新数据的频率。间隔以秒为单位。

    1. **包括系统日志**。系统项目和 RKE 组件中的 pods 的日志将被发送到目标。取消勾选则不包括系统日志。

1.  单击**测试**。Rancher 向服务发送测试日志。

         **注意：**如果您使用自定义配置编辑器，该按钮将被*Dry Run*替换。在这种情况下，Rancher 会调用 fluentd dry run 命令来验证配置。

1.  单击**保存**。

**结果：** Rancher 现在已配置为将日志发送到所选服务。登录到日志服务，开始查看日志。

## 相关链接

[日志架构](https://kubernetes.io/docs/concepts/cluster-administration/logging/)。
