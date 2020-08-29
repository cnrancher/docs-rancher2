---
title: MQTT 适配器
---

## MQTT 介绍

[MQTT](http://mqtt.org/)是一种机器对机器(M2M)/"物联网 "连接协议。它被设计为一种极其轻量级的发布/订阅消息传输。它对于需要少量代码占用和/或网络带宽很高的远程地点的连接非常有用。

MQTT 适配器在[paho.mqtt.golang](https://github.com/eclipse/paho.mqtt.golang)上实现，有助于与 MQTT 经纪商进行通信，以与链接设备进行交互。

### MQTT 杂谈

#### 数据结构

我们知道，MQTT 是没有固定的结构，所以没有标准的**主题**命名模式和**payload**格式。发布者组织数据结构的方式将直接影响到订阅者的使用情况。在社区中，我们总结了两种常见的模式。下面我们来看看。

第一种模式可以命名为**属性主题**：发布者将属性扁平化为主题，然后将属性的有效载荷发送到对应的主题。它在 Github 上有一个代表：[Homie](https://homieiot.github.io/)MQTT 公约。

```
homie/kitchen/$homie -> 4.0
homie/kitchen/$name  -> "Living Room"
homie/kitchen/$node  -> "light,door"
homie/kitchen/$state -> "ready"

homie/kitchen/light/$name -> "Living room light"
homie/kitchen/light/$type -> "LED"
homie/kitchen/light/$properties -> "switch,gear,parameter_power,parameter_luminance,manufacturer,production_date,service_life"
...

homie/kitchen/light/switch/$name -> "The switch of light"
homie/kitchen/light/switch/$settable -> "true"
homie/kitchen/light/switch/$datatype -> "boolean"
homie/kitchen/light/switch -> "false"
...
homie/kitchen/light/parameter_power/$name -> "The power of light"
homie/kitchen/light/parameter_power/$settable -> "false"
homie/kitchen/light/parameter_power/$datatype -> "float"
homie/kitchen/light/parameter_power/$unit -> "watt"
homie/kitchen/light/parameter_power -> "3.0"
    ...
```

Homie 很有意思，它最大的特点就是**自发现**，也就是订阅者不需要知道数据结构，只需要订阅根主题，然后公约实现客户端就会反映出所有属性，包括名称、描述、值、类型等。但是，**属性主题**模式会创建很多主题，所以需要一个类似 Homie 的公约来保证标准化和可扩展性。

另一种直接将属性压缩成一个有效载荷的模式可以命名为**属性消息**。发布者将属性序列化为一种目标格式，如 XML、JSON 或自定义表单，然后将整个序列化结果发送给一个主题。

```
home/bedroom/light -> {"switch":true,"action":{"gear":"low"},"parameter":{"power":70,"luminance":4900},"production":{"manufacturer":"Rancher Octopus Fake Device","date":"2020-07-09T13:00:00.00Z","serviceLife":"P1Y0M0D"}}
```

**Attributed Message**模式减少了 topic 的使用频率，但订阅者需要知道如何在每个主题中反序列化有效载荷，并了解数据的组织结构。更好的方法是在所有主题中使用相同的序列化格式，并引入数据结构的层次描述。例如，如果发布者选择 JSON 作为序列化格式，发布者可以在另一个主题中附加数据结构的[JSONschema](https://json-schema.org/)。

```
home/bedroom/light/$schema -> {"$schema":"http://json-schema.org/draft-04/schema#","type":"object","additionalProperties":true,"properties":{"switch":{"description":"The switch of light","type":"boolean"},"action":{"description":"The action of light","type":"object","additionalProperties":true,"properties":{"gear":{"description":"The gear of power","type":"string"}}},"parameter":{"description":"The parameter of light","type":"object","additionalProperties":true,"properties":{"power":{"description":"The power of light","type":"float"},"luminance":{"description":"The luminance of light","type":"int"}}},"production":{"description":"The production information of light","type":"object","additionalProperties":true,"properties":{"manufacturer":{"description":"The manufacturer of light","type":"string"},"date":{"description":"The production date of light","type":"string"},"serviceLife":{"description":"The service life of light","type":"string"}}}}}
```

#### 操作

在 MQTT 中，对于数据的**pub/sub**（pub：发布，sub：订阅）只有两种方式：一是在同一个主题上执行**pub/sub**，二是将**pub/sub**分为两个主题。

第一种方式不受欢迎，可能需要在有效载荷中加入操作命令。

```
home/light -> {"$data":{"on":true,"brightness":4,"power":{"powerDissipation":"10KWH","electricQuantity":19.99}}}

home/light <- {"$set":{"on":false}}
home/light -> {"$set":{"on":false}}
```

虽然使用声明式管理的系统(如[Kubernetes](http://kubernetes.io/))可以避免上述的命令式操作，但当发布者做了**pub**时，必须引入一个**sub**，这在功耗极低的环境下是不可接受的。

```
home/light -> {"on":true,"brightness":4,"power":{"powerDissipation":"10KWH","electricQuantity":19.99}}

home/light <- {"on":false}
home/light -> {"on":false}
```

因此，第二种方式会更容易被接受。由于属性已经被扁平化，在**属性主题**模式下，发布者可以将数据发送到与属性对应的特殊后缀的主题。例如，Homie 更喜欢使用以`set`结尾的 topic 来接收值的变化。

```
homie/light/on/$settable -> "true"
homie/light/on -> "true"

homie/light/on/set <- "false"
homie/light/on -> "false"
```

对于**属性消息**模式也是如此，期望发布者需要选择只发送修改的属性还是所有属性。

```
home/light -> {"on":"true","brightness":4,"power":{"dissipation":"10KWH","quantity":19.99}}

home/light/set <- {"on":false}
home/light -> {"on":false}
```

### 公约

MQTTDevice 集成了[MQTT 插件](./mqtt-extension/_index#specification)的配置。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "..."
        client:
          ...
        message:
          ...
      ...
```

#### AttributedTopic 模式

指定`pattern: AttributedTopic`来与多主题中扁平化属性的设备进行交互。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
          ...
      ...
```

指定[templated topic](./mqtt-extension/_index#templated-topic)，用`:path`关键字来渲染对应属性名的目标主题。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
         topic: "cattle.io/octopus/home/your/device/:path"
      properties:
        # subscribes to "cattle.io/octopus/home/your/device/property-a" topic
        - name: property-a
          type: string
```

或用`path`字段说明`:path`。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
          topic: "cattle.io/octopus/home/your/device/:path"
      properties:
        # subscribes to "cattle.io/octopus/home/your/device/property-a" topic
        - name: property-a
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/path/to/property-b" topic
        - name: property-b
          path: "path/to/property-b"
          type: string
```

将读写属性指定为`readOnly: false`

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
          topic: "cattle.io/octopus/home/your/device/:path"
      properties:
        # subscribes to "cattle.io/octopus/home/your/device/property-a" topic
        - name: property-a
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/path/to/property-b" topic
        - name: property-b
          path: "path/to/property-b"
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/property-c" topic
        # publishes  to "cattle.io/octopus/home/your/device/property-c" topic
        - name: property-c
          readOnly: false
          type: string
```

改变可写属性，发布到另一个主题。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
          topic: "cattle.io/octopus/home/your/device/:path/:operator"
          operator:
            write: "set"
      properties:
        # subscribes to "cattle.io/octopus/home/your/device/property-a" topic
        - name: property-a
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/path/to/property-b" topic
        - name: property-b
          path: "path/to/property-b"
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/property-c" topic
        # publishes  to "cattle.io/octopus/home/your/device/property-c/set" topic
        - name: property-c
          readOnly: false
          type: string
```

注意，`:operator`可以被覆盖。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          ...
        message:
          topic: "cattle.io/octopus/home/your/device/:path/:operator"
          operator:
            write: "set"
      properties:
        # subscribes to "cattle.io/octopus/home/your/device/property-a" topic
        - name: property-a
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/path/to/property-b" topic
        - name: property-b
          path: "path/to/property-b"
          type: string
        # subscribes to "cattle.io/octopus/home/your/device/property-c" topic
        # publishes  to "cattle.io/octopus/home/your/device/property-c/update" topic
        - name: property-c
          readOnly: false
          type: string
          operator:
            write: "update"
```

#### AttributedMessage

指定`pattern: AttributedMessage`与设备交互，将其属性压缩在一个主题中。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
       pattern: "AttributedMessage"
       client:
         ...
       message:
         ...
      ...
```

:::note
`AttributedMessage`模式目前只支持 JSON 格式的有效载荷内容。
:::

If the JSON of payload content looks as below:

```
{
    "property-a":"value-a",
    "property-b":false,
    "property-c":{
        "c1":"c1",
        "c2":[
            "c2.1",
            "c2.2"
        ]
    }
}

```

通过属性`name`提取内容。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          ...
        message:
          # subscribes to "cattle.io/octopus/home/your/device" topic
          topic: "cattle.io/octopus/home/your/device"
      properties:
        # extracts the content of the corresponding JSONPath: "property-a"
        - name: property-a
          type: string
```

或说明重新启动 `path`参数的[JSONPath](#jsonpath)。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          ...
        message:
          # subscribes to "cattle.io/octopus/home/your/device" topic
          topic: "cattle.io/octopus/home/your/device"
      properties:
        # extracts the content of the corresponding JSONPath: "property-a"
        - name: property-a
          type: string
        # extracts the content of the corresponding JSONPath: "property-c.c1"
        - name: c1
          path: "property-c.c1"
          type: "string"
```

指定一个`readOnly: false'`的可写属性。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          ...
        message:
          # subscribes to "cattle.io/octopus/home/your/device" topic
          topic: "cattle.io/octopus/home/your/device"
      properties:
        # extracts the content of the corresponding JSONPath: "property-a"
        - name: property-a
          type: string
        # extracts the content of the corresponding JSONPath: "property-c.c1"
        - name: c1
          path: "property-c.c1"
          type: "string"
        # extracts the content of the corresponding JSONPath: "property-b",
        # and publishs to "cattle.io/octopus/home/your/device" if indicated the value.
        - name: property-b
          type: boolean
          readOnly: false
```

更改发布主题：

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  adaptor:
    ...
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          ...
        message:
          # subscribes to "cattle.io/octopus/home/your/device" topic
          topic: "cattle.io/octopus/home/your/device"
          operator:
            write: "set"
      properties:
        # extracts the content of the corresponding JSONPath: "property-a"
        - name: property-a
          type: string
        # extracts the content of the corresponding JSONPath: "property-c.c1"
        - name: c1
          path: "property-c.c1"
          type: "string"
        # extracts the content of the corresponding JSONPath: "property-b",
        # and publishes the '{"property-b":true}' to "cattle.io/octopus/home/your/device/set".
        - name: property-b
          type: boolean
          readOnly: false
          value: true
```

### JSONPath

:::note
JSONPath 只在`AttributedMessage`模式下可用。
:::

MQTT 适配器集成了[tidwall/gjson](https://github.com/tidwall/gjson)和[tidwall/sjson](https://github.com/tidwall/sjson)。

对于**Read Only**属性，`path`字段可以接受[GJSON Path Syntax](https://github.com/tidwall/gjson/blob/master/SYNTAX.md)，这是一种神奇而丰富的路径检索机制。

```
# given JSON

{
  "name": {"first": "Tom", "last": "Anderson"},
  "age": 37,
  "children": ["Sara","Alex","Jack"],
  "fav.movie": "Deer Hunter",
  "friends": [
    {"first": "Dale", "last": "Murphy", "age": 44, "nets": ["ig", "fb", "tw"]},
    {"first": "Roger", "last": "Craig", "age": 68, "nets": ["fb", "tw"]},
    {"first": "Jane", "last": "Murphy", "age": 47, "nets": ["ig", "tw"]}
  ]
}

# basic retrival
name.last -> "Anderson"

# array retrival
children.0 -> "Sara"

# wildcards
child*.2 -> " Jack"

# queries
friends.#(last=="Murphy").first -> "Dale"
```

但是，针对**Writable**属性，`path`字段只能接受*restricted*[SJSON Path Syntax](https://github.com/tidwall/sjson#path-syntax)。

```

# given JSON

{
  "name": {"first": "Tom", "last": "Anderson"},
  "age": 37,
  "children": ["Sara","Alex","Jack"],
  "fav.movie": "Deer Hunter",
  "friends": [
    {"first": "James", "last": "Murphy"},
    {"first": "Roger", "last": "Craig"}
  ]
}

# basic patch
name.last <- "Murphy"

# array patch
children.1 <- "Frank"
```

为了保证一个属性的读写路径一致，MQTT 适配器在**Writable**属性上阻止了以下路径：

- `children.-1`
- `children|@reverse`
- `child*.2`
- `c?ildren.0`
- `friends.#.first`

### 用户案例

试想一下，我们的家用电器是非常智能的，可以主动向 MQTT agent 报告自己的状态信息，然后我们就会用`MQTTDevice`来连接和获取这些信息。例如，我们的厨房门可以告诉我们它的生产信息，它的关闭状态等等。

```
cattle.io/octopus/home/status/kitchen/door/state -> open
...
cattle.io/octopus/home/status/kitchen/door/production_material -> wood
```

我们可以用 "AttributedTopic "模式定义一个 "MQTTDevice "设备连接来监视我们的厨房门。

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: kitchen-door
spec:
  adaptor:
    node: kitchen
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/status/kitchen/door/:path"
      properties:
        - name: "state"
          type: "string"
        ...
        - name: "material"
          path: "production_material"
          type: "string"
```

> 在 "AttributedTopic "模式中，每个 "property "都是一个 topic，默认情况下，property 的 "name "可以作为":path "关键字来呈现 topic，最后得到对应的 topic 来订阅。默认情况下，属性的 "name "可以作为":path "关键字来呈现该主题，并最终获得相应的主题来订阅。

厨房灯也会将其属性报告给 MQTT agent，让我们可以远程控制厨房灯。

```
cattle.io/octopus/home/status/kitchen/light/switch -> false
cattle.io/octopus/home/get/kitchen/light/gear -> low
...

# 打开厨房灯
cattle.io/octopus/home/set/kitchen/light/switch <- true
# 控制厨房灯的亮度
cattle.io/octopus/hom/control/kitchen/light/gear <- mid
```

我们可以利用`MQTTDevice`设备链接的可写属性来控制厨房灯。

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: kitchen-light
spec:
  adaptor:
    node: kitchen
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/:operator/kitchen/light/:path"
          operator:
            read: "status"
            write: "set"
      properties:
        - name: "switch"
          type: "boolean"
          readOnly: false
        - name: "gear"
          type: "string"
          readOnly: false
          operator:
            read: "get"
            write: "control"
        ...
```

> 使用 "readOnly: false "来确定一个可写属性。此外，属性级别 "operator "可以覆盖 "AttributedTopic "模式中协议级别的定义。

例如，我们可以打开厨房的灯，将其调整到中等亮度。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: kitchen-light
spec:
  ...
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/:operator/kitchen/light/:path"
          operator:
            read: "status"
            write: "set"
      properties:
        - name: "switch"
          type: "boolean"
          readOnly: false
          value: true
        - name: "gear"
          type: "string"
          readOnly: false
          operator:
            read: "get"
            write: "control"
           value: "mid"
        ...
```

此外，我们可以在同一个`MQTTDevice`设备链接中监控门和灯的状态。

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: kitchen-monitor
spec:
  adaptor:
    node: kitchen
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedTopic"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/:operator/kitchen/:path"
          operator:
            read: status
      properties:
        - name: "doorState"
          path: "door/state"
          type: "string"
        - name: "isLightOn"
          path: "light/switch"
          type: "boolean"
        - name: "lightGear"
          path: "light/gear"
          type: "string"
          operator:
            read: get
```

最近新买了一盏智能卧室灯，但是发现传输的数据格式和之前的不一样。

```
cattle.io/octopus/home/bedroom/light -> {"switch":true,"action":{"gear":"low"},"parameter":{"power":70,"luminance":4900},"production":{"manufacturer":"Rancher Octopus Fake Device","date":"2020-07-09T13:00:00.00Z","serviceLife":"P1Y0M0D"}}

# to turn off the bedroom light
cattle.io/octopus/home/bedroom/light/set <- {"switch":false}
# to control the kitchen light
cattle.io/octopus/home/bedroom/light/set <- {"action":{"gear":"mid"}}
```

我们可以定义一个 "MQTTDevice "设备链接与 "AttributedMessage "模式来监控新的卧室灯。

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: bedroom-light
spec:
  adaptor:
    node: bedroom
    name: adaptors.edge.cattle.io/mqtt
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "MQTTDevice"
  template:
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/bedroom/light"
      properties:
        - name: "switch"
          type: "boolean"
        - name: "gear"
          path: "action.gear"
          type: "string"
        ...
        - name: "serviceLife"
          path: "production.serviceLife"
          type: "string"
```

> 在`AttributedMessage`模式中，整个链接是一个主题。默认情况下，属性的 "name "可以作为 payload 内容的检索路径。

如果需要的话，我们可以修改上面的`MQTTDevice`设备链接，关闭新卧室的灯。

```diff
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  namespace: smart-home
  name: bedroom-light
spec:
  ...
  template:
    ...
    spec:
      protocol:
        pattern: "AttributedMessage"
        client:
          server: "..."
        message:
          topic: "cattle.io/octopus/home/bedroom/light/:operator"
          operator:
            write: "set"
      properties:
        - name: "switch"
          type: "boolean"
          readOnly: false
          value: false
        - name: "gear"
          path: "action.gear"
          type: "string"
        ...
        - name: "serviceLife"
          path: "production.serviceLife"
          type: "string"
```

## 注册信息

| 版本       | 注册名称                       | 端点 Socket | 是否可用 |
| :--------- | :----------------------------- | :---------- | :------- |
| `v1alpha1` | `adaptors.edge.cattle.io/mqtt` | `mqtt.sock` | 是       |

## 支持模板

| 类型         | 设备组                   | 版本       | 是否可用 |
| :----------- | :----------------------- | :--------- | :------- |
| `MQTTDevice` | `devices.edge.cattle.io` | `v1alpha1` | 是       |

## 支持的平台

| 操作系统 | 架构    |
| :------- | :------ |
| `linux`  | `amd64` |
| `linux`  | `arm`   |
| `linux`  | `arm64` |

## 使用方式

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/mqtt/deploy/e2e/all_in_one.yaml
```

## 权限

对 Octopus 授予权限，如下所示：

```text
  Resources                                   Non-Resource URLs  Resource Names  Verbs
  ---------                                   -----------------  --------------  -----
  mqttdevices.devices.edge.cattle.io         []                 []              [create delete get list patch update watch]
  mqttdevices.devices.edge.cattle.io/status  []                 []              [get patch update]
```

## YAML 示例

- 指定 "MQTTDevice "设备链接，订阅厨房房间门的信息。

  ```YAML
  apiVersion: edge.cattle.io/v1alpha1
  kind: DeviceLink
  metadata:
    name: kitchen-door
  spec:
    adaptor:
      node: edge-worker
      name: adaptors.edge.cattle.io/mqtt
    model:
      apiVersion: "devices.edge.cattle.io/v1alpha1"
      kind: "MQTTDevice"
    template:
      metadata:
        labels:
          device: kitchen-door
      spec:
        protocol:
          pattern: "AttributedTopic"
          client:
            server: "tcp://test.mosquitto.org:1883"
          message:
            topic: "cattle.io/octopus/home/status/kitchen/door/:path"
        properties:
          - name: "state"
            path: "state"
            description: "The state of door"
            type: "string"
            annotations:
              type: "enum"
              format: "open,close"
          - name: "width"
            path: "width"
            description: "The width of door"
            type: "float"
            annotations:
              unit: "meter"
          - name: "height"
            path: "height"
            description: "The height of door"
            type: "float"
            annotations:
              unit: "meter"
          - name: "material"
            path: "material"
            description: "The material of light"
            type: "string"
  ```

- 指定 "MQTTDevice "设备链接，订阅卧室灯的信息。
  ```YAML
  apiVersion: edge.cattle.io/v1alpha1
  kind: DeviceLink
  metadata:
    name: bedroom-light
  spec:
    adaptor:
      node: edge-worker
      name: adaptors.edge.cattle.io/mqtt
    model:
      apiVersion: "devices.edge.cattle.io/v1alpha1"
      kind: "MQTTDevice"
    template:
      metadata:
        labels:
          device: bedroom-light
      spec:
        protocol:
          pattern: "AttributedMessage"
          client:
            server: "tcp://test.mosquitto.org:1883"
          message:
            topic: "cattle.io/octopus/home/bedroom/light/:operator"
            operator:
              write: "set"
        properties:
          - name: "switch"
            path: "switch"
            description: "The switch of light"
            type: "boolean"
            readOnly: false
          - name: "gear"
            path: "action.gear"
            description: "The gear of light"
            type: "string"
            readOnly: false
            annotations:
              type: "enum"
              format: "low,mid,high"
          - name: "power"
            path: "parameter.power"
            description: "The power of light"
            type: "float"
            annotations:
              group: "parameter"
              unit: "watt"
          - name: "luminance"
            path: "parameter.luminance"
            description: "The luminance of light"
            type: "int"
            annotations:
              group: "parameter"
              unit: "luminance"
          - name: "manufacturer"
            path: "production.manufacturer"
            description: "The manufacturer of light"
            type: "string"
            annotations:
              group: "production"
          - name: "productionDate"
            path: "production.date"
            description: "The production date of light"
            type: "string"
            annotations:
              group: "production"
              type: "datetime"
              standard: "ISO 8601"
              format: "YYYY-MM-DDThh:mm:ss.SSZ"
          - name: "serviceLife"
            path: "production.serviceLife"
            description: "The service life of light"
            type: "string"
            annotations:
              group: "production"
              type: "duration"
              standard: "ISO 8601"
              format: "PYYMMDD"
  ```

更多的 "MQTTDevice "设备链接示例，请参考[deploy/e2e](https://github.com/cnrancher/octopus/tree/master/adaptors/mqtt/deploy/e2e)目录，并使用[deploy/e2e/simulator.yaml](https://github.com/cnrancher/octopus/tree/master/adaptors/mqtt/deploy/e2e)进行快速体验。

## MQTTDevice

| 参数     | 描述                        | 类型                                                                                                       | 是否必填 |
| :------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据                      | [metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | false    |
| spec     | 定义 "MQTTDevice"的预期状态 | [MQTTDeviceSpec](#mqttdevicespec)                                                                          | 是       |
| status   | 定义 "MQTTDevice"的实际状态 | [MQTTDeviceStatus](#mqttdevicestatus)                                                                      | 否       |

### MQTTDeviceSpec

| 参数       | 描述                     | 类型                                        | 是否必填 |
| :--------- | :----------------------- | :------------------------------------------ | :------- |
| protocol   | 指定访问设备时使用的协议 | [MQTTDeviceProtocol](#mqttdeviceprotocol)   | 是       |
| properties | 指定设备的属性           | [[]MQTTDeviceProperty](#mqttdeviceproperty) | 否       |

### MQTTDeviceStatus

| 参数       | 描述           | 类型                                                    | 是否必填 |
| :--------- | :------------- | :------------------------------------------------------ | :------- |
| properties | 上报设备的属性 | [[]MQTTDeviceStatusProperty](#mqttdevicestatusproperty) | 否       |

#### MQTTDeviceProtocol

| 参数    | 描述                       | 类型                                                             | 是否必填 |
| :------ | :------------------------- | :--------------------------------------------------------------- | :------- |
| pattern | 指定 MQTTDevice 协议的模式 | [MQTTDevicePattern](#mqttdevicepattern)                          | 是       |
| client  | 指定客户端的设置           | [MQTTClientOptions](./mqtt-extension/_index#mqttclientoptions)   | 是       |
| message | 指定消息的设置             | [MQTTMessageOptions](./mqtt-extension/_index#mqttmessageoptions) | 是       |

#### MQTTDevicePattern

| 参数              | 描述                                           | 类型   |
| :---------------- | :--------------------------------------------- | :----- |
| AttributedMessage | 将属性压缩成一条消息，一个主题有其所有的属性值 | string |
| AttributedTopic   | 扁平化属性到主题，每个主题都有自己的属性值     | string |

#### MQTTDeviceProperty

| 参数        | 描述                                                                                                                                                                                                                     | 类型                                                                           | 是否必填 |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :------- |
| annotations | 指定属性的注释                                                                                                                                                                                                           | map[string]string                                                              | 否       |
| name        | 指定属性的名称                                                                                                                                                                                                           | string                                                                         | 是       |
| description | 指定属性的描述                                                                                                                                                                                                           | string                                                                         | 否       |
| readOnly    | 指定该属性是否为只读，默认为 "true"                                                                                                                                                                                      | \*bool                                                                         | 否       |
| type        | 指定属性的类型                                                                                                                                                                                                           | [MQTTDevicePropertyType](#mqttdevicepropertytype)                              | 否       |
| value       | 指定属性的值，只在可写属性中可用                                                                                                                                                                                         | [MQTTDevicePropertyValue](#mqttdevicepropertyvalue)                            | 否       |
| path        | 指定 topic 的`:path`关键字的渲染路径，默认与`name`相同。<br/><br/>在`AttributedTopic`模式下，该路径将呈现在 topic 上；<br/>在`AttributedMessage`模式下，该路径应该是一个[`JSONPath`](#jsonpath)，可以访问 payload 内容。 | string                                                                         | 否       |
| operator    | 指定用于呈现主题的`:operator`关键字的操作符。                                                                                                                                                                            | MQTTMessageTopicOperator](./mqtt-extension/\_index#mqttmessagetopicoperator)。 | 否       |
| qos         | 指定消息的 QoS，只有在`AttributedTopic`模式下才有。默认值是`1`。                                                                                                                                                         | [MQTTMessageQoSLevel](./mqtt-extension/_index#mqttmessageqoslevel)             | 否       |
| retained    | 指定是否保留最后发布的消息，只有在`AttributedTopic`模式下才有。默认为 "true"。                                                                                                                                           | \*bool                                                                         | 否       |

> MQTT 适配器会返回 MQTT broker 接收到的原始数据，因此，"type "的意义并不是告诉 MQTT 适配器如何处理有效载荷，而是让用户描述期望值。因此，"type "的含义不是告诉 MQTT 适配器如何处理有效载荷，而是让用户描述期望的内容。

#### MQTTDeviceStatusProperty

| 参数        | 描述                                                                                                                                                                                                                             | 类型                                                                           | 是否必填 |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :------- |
| annotations | 属性的注释                                                                                                                                                                                                                       | map[string]string                                                              | 否       |
| name        | 属性的名称                                                                                                                                                                                                                       | string                                                                         | 是       |
| description | 属性的描述                                                                                                                                                                                                                       | string                                                                         | 否       |
| readOnly    | 该属性是否为只读，默认为 "true"                                                                                                                                                                                                  | \*bool                                                                         | 否       |
| type        | 属性的类型                                                                                                                                                                                                                       | [MQTTDevicePropertyType](#mqttdevicepropertytype)                              | 否       |
| value       | 属性的值，只在可写属性中可用                                                                                                                                                                                                     | [MQTTDevicePropertyValue](#mqttdevicepropertyvalue)                            | 否       |
| path        | topic 的`:path`关键字的渲染路径，默认与`name`相同。 <br/><br/>在`AttributedTopic`模式下，这个路径将在 topic 上呈现；<br/>在`AttributedMessage`模式下，这个路径应该是一个[`JSONPath`](#available-jsonpath)，可以访问 payload 内容 | string                                                                         | 否       |
| operator    | 用于呈现主题的`:operator`关键字的操作符。                                                                                                                                                                                        | [MQTTMessageTopicOperator](./mqtt-extension/_index#mqttmessagetopicoperator)。 | 否       |
| qos         | 消息的 QoS，只有在`AttributedTopic`模式下才有。默认值是`1`。                                                                                                                                                                     | [MQTTMessageQoSLevel](./mqtt-extension/_index#mqttmessageqoslevel)             | 否       |
| retained    | 是否保留最后发布的消息，只有在`AttributedTopic`模式下才有。默认为 "true"。                                                                                                                                                       | \*bool                                                                         | 否       |

#### MQTTDevicePropertyType

| 参数    | 描述                   | 类型   |
| :------ | :--------------------- | :----- |
| string  | 属性数据类型为 string  | string |
| int     | 属性数据类型为 int     | string |
| float   | 属性数据类型为 float   | string |
| boolean | 属性数据类型为 boolean | string |
| array   | 属性数据类型为 array   | string |
| object  | 属性数据类型为 object  | string |

#### MQTTDevicePropertyValue

MQTTDevicePropertyValue 需要根据`type`输入相应的内容。例如：

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
...
spec:
  ...
  template:
    ...
    spec:
      ...
      properties:
        - name: "string"
          readOnly: false
          type: "string"
          value: "str"
        - name: "int"
          readOnly: false
          type: "int"
          value: 1
        - name: "float"
          readOnly: false
          type: "float"
          value: 3.3
        - name: "bool"
          readOnly: false
          type: "boolean"
          value: true
        - name: "array"
          readOnly: false
          type: "array"
          value:
            - item-1
            - item-2
            - item-3
        - name: "object"
          readOnly: false
          type: "object"
          value:
            name: "james"
            age: 12
```
