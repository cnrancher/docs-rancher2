---
title: Webhooks
---

在 Rancher 中，您可以创建接收器钩子。 这些钩子提供了一个可以在 Rancher 中触发事件的 URL。比如，接收器钩子可以和监控系统整合来增加或减少服务的容器数量。 在 **API** -> **Webhooks** 页面， 您可以查看或创建一个接收钩子。

### 添加接收器钩子

要创建一个接收器钩子，导航到，**API** -> **Webhooks**，点击 **添加接收器**

- 填写接收器 **名称** 以方便识别。
- 选择您要创建的接收器 **类型**。
- 基于接收器的类型确定接收器事件。

点击 **创建**。创建成功后，就可以在新创建接收器钩子旁边看到相应的 URL。

### 使用接收器钩子

要使用触发 URL，您需要先发一个 `POST` 请求到这个 URL。
向这个 URL `POST` 请求不需要在验证头和 body 信息。

### 接收器钩子的类型

- [服务扩缩容](#服务扩缩容)
- [主机数量增减](#主机弹性伸缩)
- [基于 DockerHub 标签的更新来更新一个服务](#基于-docker-hub-webhooks-升级服务)

<a id="scaling-service-example"></a>

#### 服务扩缩容

要扩缩容一个服务，您必须先配置您的 webhook:

- 扩大／缩小一个服务(即，添加或移除一个服务中的容器)
- 在环境中选择服务
- 一次投放／移除多少容器
- 服务的最大／最小容器数量

<a id="autoscaling-example"></a>

##### 一个用接收器钩子来自动扩缩服容务的示例

使用接收器钩子来扩缩容服务，您可以通过整合外界服务来实现自动扩缩容。
在这个示例中，我们使用 Prometheus (普罗米修斯) 来监控服务，通过报警管理程序来发送 `POST` 请求到触发 URL.

##### 安装 Prometheus

[Rancher 应用商店](/docs/rancher1/configuration/catalog/_index) 提供了 Prometheus 监控服务，在 **应用商店** 中可以找到这个服务。选中**Prometheus** 然后启动应用商店入口。 在 Prometheus 应用中找到一个名为 `prometheus` 的服务，这个服务暴露了 `9090` 端口。在容器中找到 `/etc/prom-conf`。 Prometheus 的配置文件`prometheus.yml` 就在 `/etc/prom-conf` 目录。为了添加告警， 单独创建一个告警文件，在 `prometheus.yml` 中提供文件的路径。 比如，如果您创建了一个名为 `rules.conf` 的告警文件，把它加入到 `prometheus.yml`，在 `prometheus.yml` 末尾加入如下两行:

```bash
rule_files:
  - rules.conf
```

`rules.conf` 可以有多个报警配置，下面就是一个报警的配置

###### `/etc/prom-conf/rules.conf` 中的告警配置例子

```bash
ALERT CpuUsageSpike
IF rate(container_cpu_user_seconds_total{container_label_io_rancher_container_name="Demo-testTarget-1"}[30s]) * 100 > 70
LABELS {
  severity="critical",
  action="up"
}
ANNOTATIONS {
  summary = "ADDITIONAL CONTAINERS NEEDED",
  description = "CPU usage is above 70%"
}
```

加入报警配置后，重启服务。

##### 添加报警管理程序

要调用接受器钩子， 报警管理程序需要先启用。 您可以把它加入到 Prometheus 应用. 在 Prometheus 应用中点击 **添加服务**。用 `prom/alertmanager` 添加服务。添加服务的时记得映射端口`9093:9093`。服务启动后，在容器中执行命令，更新 `etc/alertmanager/config.yml`。 在 `etc/alertmanager/config.yml` 中添加 webhook 的 URL 。这样，当告警被触发时报警管理程序就会向这个 URL 发送 `POST` 请求。在 `etc/alertmanager/config.yml` 添加 URL 信息后需要重启服务。

###### 示例 `etc/alertmanager/config.yml`

```bash
route:
  repeat_interval: 5h
  routes:
  - match:
      action: up
    receiver: "webhook-receiver-up"
  - match:
      action: down
    receiver: "webhook-receiver-down"
receivers:
  webhook_configs:
  - url: <WEBHOOK_URL>
    send_resolved: true
  webhook_configs:
  - url: <WEBHOOK_URL>
    send_resolved: true
```

##### 自动扩缩容

Prometheus 和告警管理程序随告警钩子更新后，重启服务器，以确保配置处于最新的激活状态。对于已经添加了告警的服务，服务会自动根据创建的更新器钩子自动扩容或缩容。

#### 主机弹性伸缩

Rancher 可以通过克隆用 Rancherc 创建的， 并且已经存在的主机来增加主机的数量。(即 Docker Machine)。这意味这通过 [自定义命令](/docs/rancher1/infrastructure/hosts/custom/_index) 添加的主机不能进行伸缩。

使用 [主机上的标签](/docs/rancher1/infrastructure/hosts/_index#主机标签)，
主机可以被分组到一起组成一个弹性伸缩组。我们推荐在主机上使用唯一的标签来方便区分弹性伸缩组。任何标签相同的主机，不管它是如何被添加到 Rancher 的，都会被当作是同一个弹性伸缩组的一部分。创建 webhook 时, 主机上不要求有标签，但是当在弹性伸缩组中使用 webhook 时，至少要有一个主机带有标签，这样 webhook 才能有一个可以克隆的主机。总之， Rancher 会选择一台在弹性伸缩组中的可克隆主机

要弹性伸缩主机，您必须配置您的 webhook:

- 扩增／减少主机(即，添加或移除主机)
- 添加一个主机选择器标签。这个标签是用来把主机分组成一个弹性伸缩组的标签。
- 选择单次要伸缩的主机数量。
- 选择主机数量伸缩的上下限。添加主机时，主机数量不能超过上线， 减少时不能低于下限。
- 如果您创建了一个 webhook 来缩小主机的数量，您可以选者移除主机的优先顺序。

##### 主机弹性伸缩注意事件

- **主机标签:** 标签被用把主机划分为不同的弹性伸缩组。因为这些标签是由用户添加的，在选择，添加，编辑，标签时必须要非常小心。任何添加在主机上的标签都会自动地把这台主机到添加到一个弹性伸缩组。如果这台主机是可克隆的，它可能会被用于克隆出更多主机。任何主机标签的移除都会自动地把相应的主机从弹性伸缩组移除，这台主机也将不再能够被 webhook 服务克隆或移除。

- **[自定义主机](/docs/rancher1/infrastructure/hosts/custom/_index):** 任何类型的主机都可以被添加到弹性伸缩组中，您只需要在主机上添加一个标签。Rancher 不能用这些主机来克隆或创建出更多主机。
- **主机克隆:** 因为主机扩增既是主机克隆，所有配置，包括资源分配，Docker 引擎等都会在新主机被复制。Rancher 总是会用克隆最旧的主机。
- **处于错误状态的主机:** 任何处于 `Error` 状态的主机都不会被添加到弹性伸缩组中.
- **移除主机的顺序:** 从 Rancher 中删除主机时，Rancher 会根据主机的状态，按以下顺序删除弹性伸缩组中的主机(`Inactive`， `Deactivating`，`Reconnecting` 或 `Disconnected`)，最后才会删除处于 `active` 状态的主机

#### 基于 Docker Hub Webhooks 升级服务

利用 Docker Hub 的 webhooks, 您可以加入 Rancher 的接收器钩子。这样，每当 push 一个镜像，一个 `POST` 请求就会被发送到 Rancher 来触发这个触发器钩子。使用这种 webhooks 组合, 您可以实现自治。 这样，每当在 Docker Hub push 一个 `image:tag`， 所有使用了匹配这个镜像版本的服务都会自动被升级。您需要用一个选择器标签来选择匹配的服务，然后再升级选中的服务。标签应该在服务创建时添加。如果服务没有标签，您需要在 Rancher 中升级服，然后添加供 webhook 使用的标签。

为了升级服务，您必须配置自己的 webhook:

- 选择要升级的标签
- 选择标签来找到要升级的服务
- 确定单次要升级的容器数量(即，批量大小)
- 确定在升级期间启动下一个容器的秒数(即，批量间歇)
- 选择是否新容器应该在旧容器停止前启动。

创建接受器钩子后，您需要在您的 Docker Hub webhook 中使用
**触发 URL**。当 Docker Hub 触发自己的 webhook, 被 Rancher 触发器钩子选中的服务会被升级。Rancher 触发器钩子默认需要 Docker Hub webhook 提供的特定信息。同时使用 Rancher's 接受器钩子和其它 webhook，`POST` 请求中需要包含以下字段:

```bash
{
    "push_data": {
        "tag": <pushedTag>
    },
    "repository": {
        "repo_name": <image>
    }
}
```
