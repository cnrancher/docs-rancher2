---
title: 迁移到 Rancher 2.5 Logging
weight: 2
---
Rancher 2.5 彻底修改了 Logging 功能。我们现在使用了 Banzai Cloud 的 [logging operator](https://github.com/banzaicloud/logging-operator)，Rancher 配置了此工具以供部署 Logging 使用。

在新的 Logging 功能的众多特性和变化中，其中一项是取消了项目级别的 Logging 配置。取而代之的是在命名空间级别配置 Logging。集群级日志仍然可用，但配置选项不同。

- [安装](#installation)
   - [术语](#terminology)
- [集群日志](#cluster-logging)
- [项目日志](#project-logging)
- [输出配置](#output-configuration)
   - [Elasticsearch](#elasticsearch)
   - [Splunk](#splunk)
   - [Kafka](#kafka)
   - [Fluentd](#fluentd)
   - [Syslog](#syslog)
- [自定义日志字段](#custom-log-fields)
- [系统日志](#system-logging)

## 安装

要在 Rancher 2.5+ 中安装 Logging，请参阅[安装说明]({{<baseurl>}}/rancher/v2.6/en/logging/#enabling-logging)。

### 名词解释

在 Rancher 2.5+ 中，你需要在**集群仪表板**中配置 Logging。要在安装 Logging 应用程序后配置 Logging 自定义资源，请转到左侧导航栏并单击 **Logging**。这个菜单的选项可以配置集群和命名空间的 Logging。

> 注意：Logging 是按集群安装的。你将需要在集群之间切换以配置每个集群的 Logging。

对于 Rancher 2.5+ 中的 Logging 应用程序，你需要了解以下四个关键概念：

1. Outputs

   `Outputs` 是一种配置资源，用于确定收集日志的目的位置。这是存储 ElasticSearch、Kafka 等聚合器设置的地方。`Outputs` 是命名空间资源。

2. Flows

   `Flows` 是一种配置资源，用于确定日志的收集、过滤和目标位置规则。在一个 Flow 中，你需要配置要收集哪些日志、如何改变或过滤它们，以及将日志发送到哪个 `Output`。`Flows` 是命名空间资源，可以连接到同一命名空间中的 `Output` 或 `ClusterOutput`。

3. ClusterOutputs

   `ClusterOutputs` 的功能与 `Outputs` 相同，但 ClusterOutput 是集群级别资源。在集群范围内收集日志或要为集群中的所有命名空间提供 `Output` 时，`ClusterOutput` 是必需的。

4. ClusterFlows

   `ClusterFlows` 的功能与 `Flows` 相同，但 ClusterFlow 是集群级别资源。它们用于为整个集群配置日志收集，而不是在命名空间级别进行逐个配置。`ClusterFlows` 也是定义改变和过滤器的地方，在功能上与 `Flows` 相同。

## 集群日志

要在 Rancher 2.5+ 中配置集群级别的 Logging，你需要设置 `ClusterFlow`。此对象定义了日志的来源、要应用的转换或过滤器，以及日志的一个或多个 `Output`。

> 重要提示：`ClusterFlow` 必须在 `cattle-logging-system` 命名空间中定义。如果在其他命名空间中定义，`ClusterFlow` 将不起作用。

在旧版 Logging 中，如果要收集整个集群的日志，你只需要启用集群级别的 Logging 并定义所需的 `Output`。Rancher 2.5+ Logging 保留了这个基本方法。要复制旧版集群级别日志，请执行以下步骤：

1. 根据[输出配置](#output-configuration)下的说明定义 `ClusterOutput`。
2. 创建一个 `ClusterFlow`，确保它在 `cattle-logging-system` 命名空间中创建。
   1. 删除 `Flow` 定义的所有 _Include_ 和 _Exclude_ 规则。这将确保能收集所有日志。
   2. 如果不需要，你可以不配置任何过滤器（默认不需要创建）。
   3. 定义你的集群 `Output`。

操作完成后，集群中所有源（所有 pod 和所有系统组件）上收集的日志都会发送到定义在 `ClusterFlow` 中的 `Output` 处。

## 项目日志

Rancher 2.5+ Logging 不支持项目。换言之，如果要收集运行在项目命名空间中的 pod 日志，你需要为这些命名空间定义 `Flow`。

要收集指定命名空间的日志，请执行以下步骤：

1. 根据[输出配置](#output-configuration)下的说明定义 `Output` 或 `ClusterOutput`。
2. 创建一个 `Flow`，确保它在你要收集日志的命名空间中创建。
   1. 如果有需要，你可以定义 _Include_ 或 _Exclude_ 规则。如果删除所有规则，则会收集目标命名空间中的所有 pod 日志。
   2. 如果不需要，你可以不配置任何过滤器（默认不需要创建）。
   3. 定义你的 Output，可以是 `ClusterOutput` 或 `Output` 对象。

操作完成后，命名空间中所有源（pod）上收集的日志都会发送到你在 `Flow` 中定义的 `Output` 处。

> 要收集项目中的日志，请在项目中的每个命名空间中重复上述步骤。你也可以使用通用标签（例如 `project=my-project`）标记你的项目工作负载，并使用 `ClusterFlow` 收集匹配此标签的所有 pod 的日志。

## 输出配置
旧版 Logging 中有五个日志目标位置可供选择，分别是 Elasticsearch、Splunk、Kafka、Fluentd 和 Syslog。除 Syslog 外，这些目标位置都可用于 2.5+ Logging。


### Elasticsearch

| 旧版 Logging | 2.5+ Logging | 注意 |
|-----------------------------------------------|-----------------------------------|-----------------------------------------------------------|
| 端点 | Target -> Host | 确保指定了协议 (https/http) 以及端口。 |
| X-Pack Security -> Username | Access -> User |                                                           |
| X-Pack Security -> Password | Access -> Password | 密码必须存储在密文中。 |
| SSL Configuration -> Client Private Key | SSL -> Client Key | 密钥必须存储在密文中。 |
| SSL Configuration -> Client Certificate | SSL -> Client Cert | 证书必须存储在密文中。 |
| SSL Configuration -> Client Key Password | SSL -> Client Key Pass | 密码必须存储在密文中。 |
| SSL Configuration -> Enabled SSL Verification | SSL -> Certificate Authority File | 证书必须存储在密文中。 |


在旧版 Logging 中，索引是根据“索引模式”中的格式自动创建的。在 2.5 Logging 中，默认的操作已更改为记录单个索引。你仍然可以编辑 YAML 并输入以下值，从而在 `Output` 对象上配置索引模式功能：

```
...
spec:
  elasticsearch:
    ...
    logstash_format: true
    logstash_prefix: <desired prefix>
    logstash_dateformat: "%Y-%m-%d"
```

将 `<desired prefix>` 替换为要创建的索引的前缀。在旧版 Logging 中，默认值是集群的名称。

### Splunk

| 旧版 Logging | 2.5+ Logging | 注意 |
|------------------------------------------|----------------------------------------|----------------------------------------------------------------------------------------|
| HEC Configuration -> Endpoint | Target -> Host | 协议（https/http）和端口必须与主机分开定义。 |
| HEC Configuration -> Token | Access -> Token | 令牌必须作为密文存储。 |
| HEC Configuration -> Index | Edit as YAML -> `index` | `index` 字段必须作为 YAML 键添加到 `spec.splunkHec` 下。 |
| HEC Configuration -> Source | Edit as YAML -> `source` | `source` 字段必须作为 YAML 键添加到 `spec.splunkHec` 下。 |
| SSL Configuration -> Client Private Key | Edit as YAML -> `client_key` | `client_key` 字段必须作为 YAML 键添加到 `spec.splunkHec` 下。详见（1）。 |
| SSL Configuration -> Client Certificate | Edit as YAML -> `client_cert` | `client_cert` 字段必须作为 YAML 键添加到 `spec.splunkHec` 下。详见（1）。 |
| SSL Configuration -> Client Key Password | _Not Supported_ | 现在不支持为客户端私钥指定密码。 |
| SSL Configuration -> SSL Verify | Edit as YAML -> `ca_file` or `ca_path` | `ca_file` 或 `ca_path` 字段必须作为 YAML 键添加到 `spec.splunkHec` 下。详见（2）。 |

_(1) `client_key` 和 `client_cert` 的值必须分别是密钥和证书文件的路径。这些文件必须挂载到 `rancher-logging-fluentd` pod 中才能使用_。

_(2) 用户可以配置 `ca_file`（PEM 编码的 CA 证书的路径）或 `ca_path`（包含 PEM 格式的 CA 证书的目录路径）。这些文件必须挂载到 `rancher-logging-fluentd` pod 中才能使用_。

### Kafka

| 旧版 Logging | 2.5+ Logging | 注意 |
|-----------------------------------------|----------------------------|------------------------------------------------------|
| Kafka Configuration -> Endpoint Type | - | 不再支持将 Zookeeper 作为端点类型。 |
| Kafka Configuration -> Endpoint | Target -> Brokers | 逗号分隔的 Broker 列表（host:port）。 |
| Kafka Configuration -> Topic | Target -> Default Topic |                                                      |
| SSL Configuration -> Client Private Key | SSL -> SSL Client Cert | 证书必须作为密文存储。 |
| SSL Configuration -> Client Certificate | SSL -> SSL Client Cert Key | 密钥必须作为密文存储。 |
| SSL Configuration -> CA Certificate PEM | SSL -> SSL CA Cert | 证书必须作为密文存储。 |
| SASL Configuration -> Username | Access -> Username | 用户名必须存储在密文中。 |
| SASL Configuration -> Password | Access -> Password | 密码必须存储在密文中。 |
| SASL Configuration -> Scram Mechanism | Access -> Scram Mechanism | 输入机制为字符串，例如“sha256”或“sha512”。 |

### Fluentd

v2.5.2 开始只支持使用“以表单编辑”选项来添加单个 Fluentd 服务器。要添加多个服务器，请将 `Output` 编辑为 YAML 并输入多个服务器。

| 旧版 Logging | 2.5+ Logging | 注意 |
|------------------------------------------|-----------------------------------------------------|----------------------------------------------------------------------|
| Fluentd Configuration -> Endpoint | Target -> Host, Port | 分别输入主机和端口。 |
| Fluentd Configuration -> Shared Key | Access -> Shared Key | 共享密钥必须存储为密文。 |
| Fluentd Configuration -> Username | Access -> Username | 用户名必须存储为密文。 |
| Fluentd Configuration -> Password | Access -> Password | 密码必须存储为密文。 |
| Fluentd Configuration -> Hostname | Edit as YAML -> `host` | `host` 字段作为 YAML 键设置在 `spec.forward.servers[n]`下。 |
| Fluentd Configuration -> Weight | Edit as YAML -> `weight` | `weight` 字段作为 YAML 键设置在 `spec.forward.servers[n]`下。 |
| SSL Configuration -> Use TLS | - | 不需要显式启用。定义客户端证书字段即可。 |
| SSL Configuration -> Client Private Key | Edit as YAML -> `tls_private_key_path` | `spec.forward` 下的字段设置为 YAML 键。详见（1）。 |
| SSL Configuration -> Client Certificate | Edit as YAML -> `tls_client_cert_path` | `spec.forward` 下的字段设置为 YAML 键。详见（1）。 |
| SSL Configuration -> Client Key Password | Edit as YAML -> `tls_client_private_key_passphrase` | `spec.forward` 下的字段设置为 YAML 键。详见（1）。 |
| SSL Configuration -> SSL Verify | Edit as YAML -> `tls_insecure_mode` | `spec.forward` 下的字段设置为 YAML 键。默认：`false`。 |
| SSL Configuration -> CA Certificate PEM | Edit as YAML -> `tls_cert_path` | `spec.forward` 下的字段设置为 YAML 键。详见（1）。 |
| Enable Gzip Compression | - | 2.5+ Logging 不再支持。 |

_(1) 这些值将被指定为文件的路径。这些文件必须挂载到 `rancher-logging-fluentd` pod 中才能使用。_

### Syslog

从 v2.5.2 开始，使用 2.5+ Logging 的 `Output` 不支持 syslog。

## 自定义日志字段

要添加自定义日志字段，你需要将以下 YAML 添加到你的 `Flow` 配置中：

```
...
spec:
  filters:
    - record_modifier:
        records:
        - foo: "bar"
```

（将 `foo: "bar"` 替换为要添加的自定义日志字段）

## 系统日志

在旧版 Logging 中，你需要在设置集群 Logging 时选中“包括系统日志”来收集系统组件的日志。在 v2.5+ Logging 中，系统日志可以通过以下两种方式之一来收集：

1. 收集所有集群日志，不指定任何匹配或排除规则。该设置会收集集群所有容器的日志，其中包括系统日志。
2. 通过为系统组件添加匹配规则来专门收集系统日志。要收集的组件决定了具体的匹配规则。