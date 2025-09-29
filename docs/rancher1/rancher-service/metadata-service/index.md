---
title: metadata服务
---

Rancher 通过基础设施中的 Metadata 服务为服务和容器提供数据。这些数据用来管理运行中的 docker 实例。这些数据可以通过调用基于 HTTP 的 API 来访问。这些数据包括创建容器，服务时的静态数据，也包括运行时数据，例如:在同一个服务里的其他容器的相关信息。

通过 Rancher 的 Metadata 服务，您可以进到任何使用 Rancher 托管网络的容器的命令行中，并查看运行在 Rancher 中的容器的信息。通过 Metadata 服务您可以获取容器，服务，容器所在的应用，容器所在的主机。Metadata 是 JSON 格式的。

有多种方式可以将容器运行在 Rancher 托管网络中。Rancher 网络的原理详见[网络相关文档](/docs/rancher1/rancher-service/networking/)。

### 如何获取 Metadata

通过 Rancher UI，您可以通过容器的下拉菜单的**执行命令行**进入运行命令界面。在鼠标悬停在容器上时，会显示容器名和右侧的下拉菜单。

您可以通过 curl 命令获取 metadata 信息。

```bash
# If curl is not installed, install it
$ apt-get install curl
# Basic curl command to obtain a plaintext response
$ curl http://rancher-metadata/<version>/<path>
```

curl 请求的路径取决于您想要获取的 metadata 信息和格式。

| Metadata     | 路径                  | 描述                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 容器         | `self/container`      | 提供运行命令的容器的 metadata 信息                                                                                                                                                                                                                                                                                                                              |
| 容器所在服务 | `self/service`        | 提供运行命令的容器对应服务的 metadata 信息                                                                                                                                                                                                                                                                                                                      |
| 容器所在应用 | `self/stack`          | 提供运行命令的容器对应应用的 metadata 信息                                                                                                                                                                                                                                                                                                                      |
| 容器所在主机 | `self/host`           | 提供运行命令的容器对应主机的 metadata 信息                                                                                                                                                                                                                                                                                                                      |
| 其他容器     | `containers`          | 提供所有容器的 metadata 信息。在纯文本格式时，提供了带上索引序号的所有容器。在 JSON 格式，提供了所有容器的所有 metadata 信息。使用序号或者名字。都可以获取指定容器的 metadata 信息。                                                                                                                                                                            |
| 其他服务     | `services`            | 提供了所有服务的 metadata 信息。在纯文本格式时，提供了带上索引序号的所有服务。在 JSON 格式，提供了所有服务的所有 metadata 信息。在路径中使用序号或者名字，都可以获取指定服务的 metadata 信息。当访问容器详细信息时，在 V1 (`2015-07-25`)只返回容器名称，但是在 V2 (`2015-12-19`)，容器实例也会返回。                                                            |
| 其他应用     | `stacks/<stack-name>` | 提供了所有应用的 metadata 信息。在纯文本格式，提供了带上索引序号的所有应用。在 JSON 格式，提供了所有应用的所有 metadata 信息。使用序号或者名字。都可以获取指定容器的 metadata 信息。在路径中使用序号或者名字，都可以获取指定应用的 metadata 信息。当访问 container 详细信息时，在 V1 (`2015-07-25`)只返回容器名称，但是在 V2 (`2015-12-19`)，容器实例也会返回。 |

### Metadata 的版本

在`curl`命令中，我们强烈建议使用确定的版本号，但是您也可以选者`latest`。

> **注意:** 因为`latest`版本会包含最新的代码变动，各个版本的返回的数据可能不同，需要确认是否和您之前的代码能够兼容。

metadata 的版本是基于日期的。

| Version Reference | Version    |
| ----------------- | ---------- |
| V2                | 2015-12-19 |
| V1                | 2015-07-25 |

#### 版本变化

##### V1 vs. V2

当通过 http 请求访问路径 `/services/<service-name>/containers`或者`/stacks/<stack-name>/services/<service-name>/containers`时, V1 返回容器名称，V2 返回容器实例。更多详细信息在 V2 metadata 服务中提供。

##### 范例

在 Rancher 中，名为`foostack`的应用包含一个有三个容器的服务 `barservice`。

```
# 在V1只返回service的container names
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-07-25/services/barservice/containers'
["foostack_barservice_1", "foostack_barservice_2", "foostack_barservice_1"]

# 在V2中返回service的container objects
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/services/barservice/containers'
[{"create_index":1, "health_state":null,"host_uuid":...
...
# 获取service中所有容器的metadata信息
...
...}]

# 在V2，可以获取指定的container object
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/services/barservice/containers/foostack_barservice_1'
[{"create_index":1, "health_state":null,"host_uuid":...
...
# 获取service中所有容器的metadata信息
...
...}]

# 通过路径 /stacks/<service-name>，可以访问services和containers

# 使用V1只返回service的container names
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-07-25/stacks/foostack/services/barservice/containers'
["foostack_barservice_1", "foostack_barservice_2", "foostack_barservice_1"]

# 使用V2返回service的container objects
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/stacks/foostack/services/barservice/containers'
[{"create_index":1, "health_state":null,"host_uuid":...
...
# 获取service中所有容器的metadata信息
...
...}]
```

### 纯文本 vs JSON

Metadata 返回有纯文本和 JSON 两种格式，根据需要选择相应格式.

#### 纯文本

通过 curl 命令，会获得请求路径的纯文本格式返回。您可以通过从第一层路径开始，层层推进，找到您需要的信息。

```
$ curl 'http://rancher-metadata/2015-12-19/self/container'
create_index
dns/
dns_search/
external_id
health_check_hosts/
health_state
host_uuid
hostname
ips/
labels/
memory_reservation
milli_cpu_reservation
name
network_from_container_uuid
network_uuid
ports/
primary_ip
primary_mac_address
service_index
service_name
stack_name
stack_uuid
start_count
state
system
uuid
$ curl 'http://rancher-metadata/2015-12-19/self/container/name'
# Note: Curl 不会返回新的行，只有一个数据时返回会输出在同一行
Default_Example_1$root@<container_id>
$ curl 'http://rancher-metadata/2015-12-19/self/container/label/io.rancher.stack.name'
Default$root@<container_id>
# Arrays可以通过序号或者名字访问
$ curl 'http://rancher-metadata/2015-12-19/services'
0=Example
# 使用序号或者名字
$ curl 'http://rancher-metadata/2015-12-19/services/0'
$ curl 'http://rancher-metadata/2015-12-19/services/Example'
```

#### JSON

JSON 格式的返回可以通过在 curl 命令中增加 header `Accept: application/json`

```
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/self/container'
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/self/stack'
# 获取stack中另一个service的信息
$ curl --header 'Accept: application/json' 'http://rancher-metadata/2015-12-19/services/<service-name>'
```

### Metadata 属性

#### 容器

| 属性                          | 描述                                                                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create_index`                | 容器启动的序号 例如 2 代表的是服务中启动的第二个容器。注意: Create_index 不会被重用。 如果您的服务包含两个容器，删除了第二个容器，下一个启动的容器的`create_index`会是 3，即使服务中只包含 2 个容器 |
| `dns`                         | 容器的 DNS 服务器。                                                                                                                                                                                 |
| `dns_search`                  | 容器的搜索域。                                                                                                                                                                                      |
| `external_id`                 | 在主机上的 Docker 容器 ID。                                                                                                                                                                         |
| `health_check_hosts`          | 列出运行健康检查的主机的的 UUIDs。                                                                                                                                                                  |
| `health_state`                | 开启健康检查的容器的健康状态 [健康检查](/docs/rancher1/infrastructure/cattle/health-checks/)。                                                                                                |
| `host_uuid`                   | Rancher Server 分配给主机的唯一标识。                                                                                                                                                               |
| `hostname`                    | 容器的 hostname。                                                                                                                                                                                   |
| `ips`                         | 支持多 NIC 时的 IP 列表                                                                                                                                                                             |
| `labels`                      | [容器标签](/docs/rancher1/infrastructure/cattle/scheduling/#labels)列表。格式为`key`:`value`。                                                                                                |
| `memory_reservation`          | 容器可以使用内存的软限制。                                                                                                                                                                          |
| `milli_cpu_reservation`       | 容器可以使用 CPU 的软限制，值为正整数，1 代表 1/1000CPU。所以，1000 代表 1 个 CPU，500 代表半个 CPU。                                                                                               |
| `name`                        | 容器的名字。                                                                                                                                                                                        |
| `network_from_container_uuid` | 容器网络来源的容器 UUID。                                                                                                                                                                           |
| `network_uuid`                | Rancher 分配的网络唯一标识                                                                                                                                                                          |
| `ports`                       | 列出[容器使用的端口](/docs/rancher1/infrastructure/cattle/adding-services/#port-mapping)。格式为: `hostIP:publicIP:privateIP[/protocol]`.                                                     |
| `primary_ip`                  | 容器 IP                                                                                                                                                                                             |
| `primary_mac_address`         | 容器的 MAC 地址                                                                                                                                                                                     |
| `service_index`               | 服务中容器名称的最后一个数字                                                                                                                                                                        |
| `service_name`                | 服务名称(如果存在)                                                                                                                                                                                  |
| `stack_name`                  | 服务所在的应用的名称(如果存在)                                                                                                                                                                      |
| `stack_uuid`                  | Rancher 分配的应用的唯一标识                                                                                                                                                                        |
| `start_count`                 | 容器启动的次数                                                                                                                                                                                      |
| `state`                       | 容器状态                                                                                                                                                                                            |
| `system`                      | 容器是否是 Rancher[基础设施服务](/docs/rancher1/rancher-service/)                                                                                                                             |
| `uuid`                        | Rancher 分配容器唯一标识                                                                                                                                                                            |

#### 服务

| 属性                   | 描述                                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `containers`           | 列出服务中的容器名称                                                                                                                                                                                             |
| `create_index`         | 服务中最后启动的容器的序号 例如 2 代表的是服务中启动的第二个容器。注意: Create_index 不会被重用。 如果您的服务包含 2 个容器，删除了第二个容器，下一个启动的容器的`create_index`会是 3，即使服务中只包含 2 个容器 |
| `expose`               | 对主机暴露，但是不对外暴露的端口                                                                                                                                                                                 |
| `external_ips`         | [内部服务](/docs/rancher1/infrastructure/cattle/adding-external-services/)的 IP 列表                                                                                                                       |
| `fqdn`                 | 服务的全称域名                                                                                                                                                                                                   |
| `health_check`         | 服务的[健康检查配置](/docs/rancher1/infrastructure/cattle/health-checks/)                                                                                                                                  |
| `hostname`             | [内部服务](/docs/rancher1/infrastructure/cattle/adding-external-services/)的 CNAME                                                                                                                         |
| `kind`                 | Rancher 的服务类型                                                                                                                                                                                               |
| `labels`               | [服务标签](/docs/rancher1/infrastructure/cattle/scheduling/#labels)列表，格式为 `key:value`.                                                                                                               |
| `lb_config`            | [负载均衡](/docs/rancher1/infrastructure/cattle/adding-load-balancers/)的配置                                                                                                                              |
| `metadata`             | [用户添加的 metadata](/docs/rancher1/rancher-service/metadata-service/#adding-user-metadata-to-a-service)                                                                                                  |
| `name`                 | 服务名称                                                                                                                                                                                                         |
| `ports`                | [服务使用的端口](/docs/rancher1/infrastructure/cattle/adding-services/#port-mapping)。格式`hostIP:publicIP:privateIP[/protocol]`.                                                                          |
| `primary_service_name` | 主服务名，如果有从服务                                                                                                                                                                                           |
| `scale`                | 服务中容器的规模数量                                                                                                                                                                                             |
| `sidekicks`            | [从容器](/docs/rancher1/infrastructure/cattle/adding-services/#sidekick-服务)服务的名称列表                                                                                                                |
| `stack_name`           | 服务所在的应用的名称                                                                                                                                                                                             |
| `stack_uuid`           | Rancher 分配的应用的唯一标识                                                                                                                                                                                     |
| `system`               | 是否是[基础设施服务](/docs/rancher1/rancher-service/)                                                                                                                                                      |
| `uuid`                 | Rancher 分配的服务的唯一标识                                                                                                                                                                                     |

#### 应用

| 属性               | 描述                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| `environment_name` | 应用所在的[环境](/docs/rancher1/configurations/environments/)的名字 |
| `environment_uuid` | Rancher 分配的环境的唯一标识                                              |
| `name`             | [应用](/docs/rancher1/infrastructure/cattle/stacks/)名称            |
| `services`         | 应用中的服务列表                                                          |
| `system`           | 应用是否为[基础设施服务](/docs/rancher1/rancher-service/)           |
| `uuid`             | Rancher 分配的应用的唯一标识                                              |

#### 主机

| 属性               | 描述                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------- |
| `agent_ip`         | Rancher Agent 的 IP，例如 `CATTLE_AGENT_IP`环境变量值。                                 |
| `hostname`         | [主机](/docs/rancher1/infrastructure/hosts/)的名称                                |
| `labels`           | [主机标签](/docs/rancher1/infrastructure/hosts/#主机标签)列表。格式为`key:value`. |
| `local_storage_mb` | 主机的存储大小，单位为 MB                                                               |
| `memory`           | 主机的内存大小，单位为 MB                                                               |
| `milli_cpu`        | 主机的 CPU。数值为整数，1 代表 1/1000 的 cpu。所以，1000 代表 1 CPU.                    |
| `name`             | [主机](/docs/rancher1/infrastructure/hosts/)的名称                                |
| `uuid`             | Rancher 分配的主机的唯一标识                                                            |

### 为服务添加用户自定义 Metadata

Rancher 支持为服务添加用户 metadata。现在只支持通过[Rancher Compose](/docs/rancher1/infrastructure/cattle/rancher-compose/)添加，metadata 是`rancher-compose.yml`的一部分。`metadata`key 对应的部分，yaml 会被转化成在 metadata-service 中使用的 JSON 格式

#### Example `rancher-compose.yml`

```
service:
  # Scale of service
  scale: 3
  # User added metadata
  metadata:
    example:
      value: world
    example2:
      foo: bar

```

服务启动后，可以使用 metadata 服务在`.../self/service/metadata`或者`.../services/<service_id>/metadata`看到 metadata 数据

#### 按照 JSON 格式查询

```
$ curl --header 'Accept: application/json' 'http://rancher-metadata/latest/self/service/metadata'
{"example":{"name":"hello","value":"world"},"example2":{"foo":"bar"}}

```

#### 按照纯文本格式查询

```
$ curl 'http://rancher-metadata/latest/self/service/metadata'
example/
$ curl 'http://rancher-metadata/latest/self/service/metadata/example'
name
value
$ curl 'http://rancher-metadata/latest/self/service/metadata/example/name'
# # Note: Curl 不会返回新的行，只有一个数据时返回会输出在同一行
hello$root@<container_id>
```
