---
title: 迁移至Rancher v2.5日志
description: 从 v2.5 开始，Rancher 中可用的日志功能已经完全改观。采用了banzai cloud的logging operator；Rancher 在部署 logging 时，配置了这个工具来使用。
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
  - rancher 2.5
  - 日志服务
  - 迁移至Rancher v2.5日志
---

从 v2.5 开始，Rancher 中可用的日志功能已经完全改观。采用了 banzai cloud 的[logging operator](https://github.com/banzaicloud/logging-operator)；Rancher 在部署 logging 时，配置了这个工具来使用。

在新的日志功能的众多特性和变化中，有一项是取消了特定项目的日志配置。取而代之的是，现在在命名空间级别配置日志。集群级日志仍然可用，但配置选项有所不同。

:::note 注意
v2.5 之前的用户界面现在被称为**集群管理器**。v2.5+的仪表板被称为**Cluster Explorer**。
:::

## 安装

要在 Rancher v2.5+中安装日志，请参考[安装说明](/docs/rancher2/logging/2.5/_index)。

## 术语

在 v2.5 中，日志配置集中在*集群浏览器*中的*日志*菜单选项下。集群和命名空间的日志都是通过这个菜单选项来配置的。

:::note 注意
日志是以每个集群为基础安装的。您需要在集群之间进行导航，以便为每个集群配置日志
:::

对于 v2.5 以上的日志，有四个关键概念需要理解：

1. Outputs

   Outputs 是一个配置资源，它决定了收集到的日志的目的地。这是存储 ElasticSearch、Kafka 等聚合器的设置的地方。Outputs 是命名空间的资源。

2. Flows

   流量是一种配置资源，用于确定日志的收集、过滤和目标规则。在一个流中，人们将配置要收集哪些日志，如何突变或过滤它们，以及将日志发送到哪些输出。流*是命名空间的资源，既可以连接到同一命名空间的\_Output*，也可以连接到*ClusterOutput*。

3. ClusterOutputs

   ClusterOutputs 的功能与 Outputs 相同，只是它们是一种集群范围的资源。当在整个集群范围内收集日志时，或者如果你希望向你的集群中的所有命名空间提供一个输出，那么 ClusterOutputs 是必要的。

4. ClusterFlows

   ClusterFlows 的功能与 Flows 相同，但在集群层面。它们用于配置整个集群的日志收集，而不是每个命名空间级别的。ClusterFlows 也是定义突变和过滤器的地方，与 Flows 一样。

## 集群日志

要配置 v2.5+日志的集群范围，需要设置一个 ClusterFlow。这个对象定义了日志的来源，任何要应用的转换或过滤器，以及最终的日志输出。

:::important 重要
ClusterFlows 必须在`cattle-logging-system`命名空间中定义。如果在任何其他命名空间中定义，ClusterFlows 将不起作用。
:::

在之前的日志中，为了从整个集群中收集日志，只需要启用集群级日志并定义所需的输出。这一基本方法在 v2.5+日志中仍然存在。要复制遗留的集群级日志，请遵循以下步骤：

1. 根据[输出配置](#output-configuration)下的说明定义一个 ClusterOutput。
2. 创建一个 ClusterFlow，确保设置为在`cattle-logging-system`命名空间中创建。
   1. 从流程定义中删除所有的 Include 和 Exclude 规则。这样可以确保所有的日志都被收集。
   2. 如果您不希望配置任何过滤器，您不需要配置任何过滤器--默认行为不需要创建它们
   3. 定义你的群组产出

这将导致收集来自集群中所有来源（所有 pods 和所有系统组件）的日志，并将其发送到您在 _ClusterFlow_ 中定义的输出。

## 项目日志

在 v2.5+中，日志不是项目感知的。这意味着，为了收集在项目命名空间中运行的 pod 的日志，您需要为这些命名空间定义 _Flows_。

要从特定的命名空间收集日志，请按照以下步骤进行。

1. 根据[输出配置](#output-configuration)下的说明，定义一个 Output 或 ClusterOutput。
2. 创建一个 Flow，确保它被设置为在你要收集日志的命名空间中创建。
   1. 如果您希望定义 Include 或 Exclude 规则，您可以这样做。否则，删除所有规则将导致目标命名空间中的所有 pod 的日志都被收集。
   2. 2. 如果您不希望，您不需要配置任何过滤器--默认行为不需要创建它们。
   3. 3. 定义你的输出：这些输出可以是 ClusterOutput 或 Output 对象。

这将导致收集命名空间（pods）中所有来源的日志，并将其发送到你在 Flow 中定义的输出。

要从一个项目中收集日志，请对项目中的每个命名空间重复上述步骤。或者，您可以用一个通用的标签来标记您的项目工作负载（例如：`project=my-project`），然后使用 ClusterFlow 来收集与此标签相匹配的所有 pod 的日志。

## 输出配置

在之前的日志中，有五个日志目的地可供选择：Elasticsearch、Splunk、Kafka、Fluentd 和 Syslog。除了 Syslog 之外，所有这些目的地都可以在日志 v2.5+中使用。

## Elasticsearch

| 之前的日志                                    | v2.5+ 的日志                      | 说明                                        |
| :-------------------------------------------- | :-------------------------------- | :------------------------------------------ |
| Endpoint                                      | Target -> Host                    | 请确保指定协议（https 或 http），以及端口。 |
| X-Pack Security -> Username                   | Access -> User                    |                                             |
| X-Pack Security -> Password                   | Access -> Password                | 密码现在必须存储在密文中                    |
| SSL Configuration -> Client Private Key       | SSL -> Client Key                 | 私钥现在必须存储在一个密文中。              |
| SSL Configuration -> Client Certificate       | SSL -> Client Cert                | 证书现在必须存储在一个密文中。              |
| SSL Configuration -> Client Key Password      | SSL -> Client Key Pass            | 密码现在必须存储在密文中                    |
| SSL Configuration -> Enabled SSL Verification | SSL -> Certificate Authority File | 证书现在必须存储在一个密文中。              |

在之前的日志中，索引是根据`index mode`部分的格式自动创建的。在 v2.5 日志中，默认行为已改为记录到单个索引。您仍然可以通过编辑为 YAML 并输入以下值来配置输出对象上的索引模式功能。

```yaml
...
spec:
  elasticsearch:
    ...
    logstash_format: true
    logstash_prefix: <desired prefix>
    logstash_dateformat: "%Y-%m-%d"
```

用将要创建的索引的前缀替换 `<desired prefix>`。在之前的日志中，这默认为集群的名称。

## Splunk

| 之前的日志                               | v2.5+ 的日志                           | 说明                                                                        |
| :--------------------------------------- | :------------------------------------- | :-------------------------------------------------------------------------- |
| HEC Configuration -> Endpoint            | Target -> Host                         | 请确保指定协议（https 或 http），以及端口。                                 |
| HEC Configuration -> Token               | Access -> Token                        | Token 现在必须存储在密文中                                                  |
| HEC Configuration -> Index               | Edit as YAML -> `index`                | `index` 字段必须作为 YAML 键添加到`spec.splunkHec`下。                      |
| HEC Configuration -> Source              | Edit as YAML -> `source`               | `source` 字段必须作为 YAML 键添加到`spec.splunkHec`下。                     |
| SSL Configuration -> Client Private Key  | Edit as YAML -> `client_key`           | `client_key` 字段必须作为 YAML 键添加到`spec.splunkHec`下。见（1）。        |
| SSL Configuration -> Client Certificate  | Edit as YAML -> `client_cert`          | `client_cert` 字段必须作为 YAML 键添加到`spec.splunkHec`下。见（1）。       |
| SSL Configuration -> Client Key Password | _Not Supported_                        | 目前不支持为客户端私钥指定密码。                                            |
| SSL Configuration -> SSL Verify          | Edit as YAML -> `ca_file` or `ca_path` | `ca_file`或`ca_path`字段必须作为 YAML 键添加到`spec.splunkHec`下。见（2）。 |

\_(1) `client_key`和 `client_cert`的值必须分别是密钥和证书文件的路径。这些文件必须挂载到`rancher-logging-fluentd` pod 中才能使用。

\_(2) 用户可以配置 `ca_file`（PEM 编码的 CA 证书的路径）或 `ca_path`（PEM 格式的 CA 证书目录的路径）。这些文件必须挂载到`rancher-logging-fluentd` pod 中才能使用。

## Kafka

| 之前的日志                              | v2.5+ 的日志               | 说明                                        |
| :-------------------------------------- | :------------------------- | :------------------------------------------ |
| Kafka Configuration -> Endpoint Type    | -                          | 不再支持将 Zookeeper 作为端点类型。         |
| Kafka Configuration -> Endpoint         | Target -> Brokers          | 以逗号分隔的 broker 列表（host:port）       |
| Kafka Configuration -> Topic            | Target -> Default Topic    |                                             |
| SSL Configuration -> Client Private Key | SSL -> SSL Client Cert     | 证书现在必须存储在密文中                    |
| SSL Configuration -> Client Certificate | SSL -> SSL Client Cert Key | 密钥现在必须存储在密文中                    |
| SSL Configuration -> CA Certificate PEM | SSL -> SSL CA Cert         | 证书现在必须存储在密文中                    |
| SASL Configuration -> Username          | Access -> Username         | 用户名必须储存在密文中                      |
| SASL Configuration -> Password          | Access -> Password         | 密码必须储存在密文中                        |
| SASL Configuration -> Scram Mechanism   | Access -> Scram Mechanism  | 输入机制为字符串，例如 "sha256 "或 "sha512" |

## Fluentd

从 v2.5.2 开始，只能使用 "编辑为表单 "选项来添加一个 Fluentd 服务器。要添加多个服务器，请将输出编辑为 YAML 并输入多个服务器。

| 之前的日志                               | v2.5+ 的日志                                        | 说明                                                    |
| :--------------------------------------- | :-------------------------------------------------- | :------------------------------------------------------ |
| Fluentd Configuration -> Endpoint        | Target -> Host, Port                                | 分别输入主机和端口                                      |
| Fluentd Configuration -> Shared Key      | Access -> Shared Key                                | Shared key 现在必须存储在密文中                         |
| Fluentd Configuration -> Username        | Access -> Username                                  | Username 现在必须存储在密文中                           |
| Fluentd Configuration -> Password        | Access -> Password                                  | Password 现在必须存储在密文中                           |
| Fluentd Configuration -> Hostname        | Edit as YAML -> `host`                              | `spec.forward.servers[n]`下的`host`字段设置为 YAML 键。 |
| Fluentd Configuration -> Weight          | Edit as YAML -> `weight`                            | `weight` 下的`host`字段设置为 YAML 键。                 |
| SSL Configuration -> Use TLS             | -                                                   | 不需要明确启用。定义客户端证书字段来代替。              |
| SSL Configuration -> Client Private Key  | Edit as YAML -> `tls_private_key_path`              | 字段设置为`spec.forward`下的 YAML 键。见(1)             |
| SSL Configuration -> Client Certificate  | Edit as YAML -> `tls_client_cert_path`              | 字段设置为`spec.forward`下的 YAML 键。见(1)             |
| SSL Configuration -> Client Key Password | Edit as YAML -> `tls_client_private_key_passphrase` | 字段设置为`spec.forward`下的 YAML 键。见(1)             |
| SSL Configuration -> SSL Verify          | Edit as YAML -> `tls_insecure_mode`                 | 在 `spec.forward` 下设置为 YAML 键。默认值：`false`。   |
| SSL Configuration -> CA Certificate PEM  | Edit as YAML -> `tls_cert_path`                     | 字段设置为`spec.forward`下的 YAML 键。见(1)             |
| Enable Gzip Compression                  | -                                                   | 在 v2.5 以上的日志记录中不再支持。                      |

\_(1) 这些值是作为文件的路径来指定的，这些文件必须安装到`rancher-logging-fluentd` pod 中才能使用。这些文件必须安装到`rancher-logging-fluentd` pod 中才能使用。

## Syslog

从 v2.5.2 开始，目前不支持使用 v2.5 以上的日志作为输出。

## 自定义日志字段

为了添加自定义日志字段，你将需要添加以下 YAML 到你的流程配置中。

```yaml
---
spec:
  filters:
    - record_modifier:
        records:
          - foo: "bar"
```

请将 `foo: "bar"`替换为您希望添加的自定义日志字段。

## 系统日志

在之前的日志中，从系统组件收集日志是通过在设置集群日志时勾选 "包括系统日志 "的框来完成的。在 v2.5+日志中，系统日志的收集方式有两种：

1. 收集所有集群日志，不指定任何匹配或排除规则。这样做的结果是收集集群的所有容器日志，其中包括系统日志。
2. 通过为系统组件添加匹配规则，专门针对系统日志。具体的匹配规则取决于被收集的组件。
