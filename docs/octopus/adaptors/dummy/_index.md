---
title: Dummy 适配器
description: Dummy 适配器是 Octopus 一种用于测试和 Demo 的模拟适配器。
keywords:
  - Octopus中文文档
  - Octopus 中文文档
  - 边缘计算
  - IOT
  - edge computing
  - Octopus中文
  - Octopus 中文
  - Octopus
  - Octopus教程
  - Octopus中国
  - rancher
  - Octopus 中文教程
  - 适配器
  - Dummy 适配器
---

## 概述

Dummy 适配器是 Octopus 一种用于测试和 Demo 的模拟适配器。

## 注册信息

| 版本       | 注册名称                        | 端点 Socket  | 是否可用 |
| :--------- | :------------------------------ | :----------- | :------- |
| `v1alpha1` | `adaptors.edge.cattle.io/dummy` | `dummy.sock` | \*       |

## 支持模型

| 类型                                          | 设备组                   | 版本       | 是否可用 |
| :-------------------------------------------- | :----------------------- | :--------- | :------- |
| [`DummySpecialDevice`](#dummyspecialdevice)   | `devices.edge.cattle.io` | `v1alpha1` | \*       |
| [`DummyProtocolDevice`](#dummyprotocoldevice) | `devices.edge.cattle.io` | `v1alpha1` | \*       |

## 支持平台

| 操作系统 | 架构    |
| :------- | :------ |
| `linux`  | `amd64` |
| `linux`  | `arm`   |
| `linux`  | `arm64` |

## 使用方式

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/all_in_one.yaml
```

## 权限

对 Octopus 授予权限，如下所示：

```text
  Resources                                           Non-Resource URLs  Resource Names  Verbs
  ---------                                           -----------------  --------------  -----
  dummyprotocoldevices.devices.edge.cattle.io         []                 []              [create delete get list patch update watch]
  dummyspecialdevices.devices.edge.cattle.io          []                 []              [create delete get list patch update watch]
  dummyprotocoldevices.devices.edge.cattle.io/status  []                 []              [get patch update]
  dummyspecialdevices.devices.edge.cattle.io/status   []                 []              [get patch update]
```

## YAML 示例

> 指定`DummySpecialDevice`设备，以下示例假定客厅中有一个名为`living-room-fan`的风扇待连接。

    ```YAML
    apiVersion: edge.cattle.io/v1alpha1
    kind: DeviceLink
    metadata:
      name: living-room-fan
    spec:
      adaptor:
        node: edge-worker
        name: adaptors.edge.cattle.io/dummy
      model:
        apiVersion: "devices.edge.cattle.io/v1alpha1"
        kind: "DummySpecialDevice"
      # uses Secret resources
      references:
        - name: "ca"
          secret:
            name: "living-room-fan-mqtt-ca"
        - name: "tls"
          secret:
            name: "living-room-fan-mqtt-tls"
      template:
        metadata:
          labels:
            device: living-room-fan
        spec:
          # integrates with MQTT
          extension:
            mqtt:
              client:
                server: tcps://test.mosquitto.org:8884
                tlsConfig:
                  caFilePEMRef:
                    name: ca
                    item: ca.crt
                  certFilePEMRef:
                    name: tls
                    item: tls.crt
                  keyFilePEMRef:
                    name: tls
                    item: tls.key
                  serverName: test.mosquitto.org
                  insecureSkipVerify: true
              message:
                # uses dynamic topic with namespaced name
                topic: "cattle.io/octopus/:namespace/:name"
          protocol:
            location: "living_room"
          gear: slow
          "on": true
    ```

> 指定一个 "DummyProtocolDevice "设备链接来连接 localhost 的 chaos robot。

    ```YAML
    apiVersion: edge.cattle.io/v1alpha1
    kind: DeviceLink
    metadata:
      name: localhost-robot
    spec:
      adaptor:
        node: edge-worker
        name: adaptors.edge.cattle.io/dummy
      model:
        apiVersion: "devices.edge.cattle.io/v1alpha1"
        kind: "DummyProtocolDevice"
      template:
        metadata:
          labels:
            device: localhost-robot
        spec:
          protocol:
            ip: "127.0.0.1"
          properties:
            name:
              type: string
              description: "The name (unique identifier) of the robot."
              readOnly: true
            gender:
              type: object
              description: "The gender of the robot."
              objectProperties:
                name:
                  type: string
                  description: "The name of the gender."
                code:
                  type: int
                  description: "The code of the gender."
            friends:
              type: array
              description: "The name list of the robot's friends."
              arrayProperties:
                type: string
                description: "The name of the friend."
            power:
              type: float
              description: "The power of the robot."
    ```

更多的 "DummyDevice"设备链接实例，请参考[deploy/e2e](https://github.com/cnrancher/octopus/tree/master/adaptors/dummy/deploy/e2e)目录。

## DummySpecialDevice

`DummySpecialDevice`可被视为模拟风扇。

| 参数     | 描述           | 类型                                                                                                                 | 是否必填 |
| :------- | :------------- | :------------------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据         | 详情请参考[metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | 否       |
| spec     | 设备的期望状态 | [DummySpecialDeviceSpec](#dummyspecialdevicespec)                                                                    | 是       |
| status   | 设备的实际状态 | [DummySpecialDeviceStatus](#dummyspecialdevicestatus)                                                                | 否       |

### DummySpecialDeviceSpec

| 参数      | 描述                               | 类型                                                      | 是否必填 |
| :-------- | :--------------------------------- | :-------------------------------------------------------- | :------- |
| extension | 设备是否有与 MQTT 插件基础         | [DeviceExtensionSpec](#deviceextensionspec)               | 否       |
| protocol  | 访问设备时使用的传输协议           | [DummySpecialDeviceProtocol](#dummyspecialdeviceprotocol) | 是       |
| on        | 设备是否已经启动                   | bool                                                      | 是       |
| gear      | 如果设备已启动，上报设备运转的频率 | [DummySpecialDeviceGear](#dummyspecialdevicegear)         | 否       |

### DummySpecialDeviceStatus

| 参数          | 描述                               | 类型                                              | 是否必填 |
| :------------ | :--------------------------------- | :------------------------------------------------ | :------- |
| extension     | 集群使用的 MQTT 插件的配置         | [DeviceExtensionStatus](#deviceextensionstatus)   | 否       |
| gear          | 如果设备已启动，上报设备运转的频率 | [DummySpecialDeviceGear](#dummyspecialdevicegear) | 否       |
| rotatingSpeed | 设备的转速                         | int32                                             | 是       |

### DummySpecialDeviceProtocol

| 参数     | 描述           | 类型   | 是否必填 |
| :------- | :------------- | :----- | :------- |
| location | 设备所处的位置 | string | 是       |

### DummySpecialDeviceGear

DummySpecialDeviceGear 定义了设备运行的速度。

| 参数   | 描述                                       | 类型   | 是否必填 |
| :----- | :----------------------------------------- | :----- | :------- |
| slow   | 从 0 开始，每 3 秒增加一次，直至达到 100   | string | 否       |
| middle | 从 100 开始，每 2 秒增加一次，直至达到 200 | string | 否       |
| fast   | 从 200 开始，每 1 秒增加一次，直至达到 300 | string | 否       |

### DummyProtocolDevice

您可以将`DummyProtocolDevice` 看成一个 chaos protocol robot，它的值每两秒会变化一次。

| 参数     | 描述           | 类型                                                                                                       | 是否必填 |
| :------- | :------------- | :--------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据         | [metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | 否       |
| spec     | 设备的期望状态 | [DummyProtocolDeviceSpec](#dummyprotocoldevicespec)                                                        | 是       |
| status   | 设备的实际状态 | [DummyProtocolDeviceStatus](#dummyprotocoldevicestatus)                                                    | 否       |

### DummyProtocolDeviceSpec

| 参数      | 描述                       | 类型                                                          | 是否必填 |
| :-------- | :------------------------- | :------------------------------------------------------------ | :------- |
| extension | 集群使用的 MQTT 插件的配置 | [DeviceExtensionSpec](#deviceextensionspec)                   | 否       |
| protocol  | 访问设备时使用的传输协议   | [DummyProtocolDeviceProtocol](#dummyprotocoldeviceprotocol)   | 是       |
| props     | 设备属性的期望值           | [DummyProtocolDeviceSpecProps](#dummyprotocoldevicespecprops) | 否       |

### DummyProtocolDeviceStatus

| 参数      | 描述                       | 类型                                                                         | 是否必填 |
| :-------- | :------------------------- | :--------------------------------------------------------------------------- | :------- |
| extension | 集群使用的 MQTT 插件的配置 | [DeviceExtensionStatus](#deviceextensionstatus)                              | 否       |
| props     | 设备属性的实际值           | map[string][dummyprotocoldevicestatusprops](#dummyprotocoldevicestatusprops) | 否       |

### DummyProtocolDeviceProtocol

| 参数 | 描述                     | 类型   | 是否必填 |
| :--- | :----------------------- | :----- | :------- |
| ip   | 连接设备时用到的 ip 地址 | string | 是       |

### DummyProtocolDeviceSpecProps

> **说明：**
>
> - `DummyProtocolDeviceSpecObjectOrArrayProps`和`DummyProtocolDeviceSpecProps`相同
> - 使用`DummyProtocolDeviceSpecObjectOrArrayProps` 的目的是避免对象循环引用

| 参数        | 描述                                                                     | 类型                                                                               | 是否必填 |
| :---------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :------- |
| type        | 设备属性的类型，可选值包括：string、int、float、boolean、object 和 array | [DummyProtocolDevicePropertyType](#dummyprotocoldevicepropertytype)                | 是       |
| description | 属性描述                                                                 | string                                                                             | 否       |
| readOnly    | 是否只读                                                                 | bool                                                                               | 否       |
| arrayProps  | 数组类型的属性                                                           | [DummyProtocolDeviceSpecObjectOrArrayProps](#dummyprotocoldevicespecprops)         | 否       |
| objectProps | 对象类型的属性                                                           | [string][dummyprotocoldevicespecobjectorarrayprops](#dummyprotocoldevicespecprops) | 否       |

### DummyProtocolDeviceStatusProperty

> **说明：**
>
> - `DummyProtocolDeviceStatusObjectOrArrayProperty` 和`DummyProtocolDeviceStatusProperty`相同
> - 使用`DummyProtocolDeviceStatusObjectOrArrayProperty`的目的是避免对象循环引用

| 参数         | 描述                                            | 类型                                                                                                                                                                                                                                          | 是否必填 |
| :----------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| type         | 设备属性的类型                                  | [DummyProtocolDevicePropertyType](#dummyprotocoldevicepropertytype)                                                                                                                                                                           | 是       |
| intValue     | 如果设备属性的类型是 int，上报 int 的值 R       | int                                                                                                                                                                                                                                           | 否       |
| stringValue  | 如果设备属性的类型是 string，上报 string 的值   | string                                                                                                                                                                                                                                        | 否       |
| floatValue   | 如果设备属性的类型是 float，上报 float 的值     | [resource.Quantity](https://github.com/kubernetes/apimachinery/blob/master/pkg/api/resource/quantity.go) [kubernetes-sigs/controller-tools/issues#245](https://github.com/kubernetes-sigs/controller-tools/issues/245#issuecomment-550030238) | 否       |
| booleanValue | 如果设备属性的类型是 boolean，上报 boolean 的值 | boolean                                                                                                                                                                                                                                       | 否       |
| arrayValue   | 如果设备属性的类型是 boolean，上报 array 的值   | [DummyProtocolDeviceStatusObjectOrArrayProps](#dummyprotocoldevicestatusprops)                                                                                                                                                                | 否       |
| objectValue  | 如果设备属性的类型是 object，上报 object 的值   | [DummyProtocolDeviceStatusObjectOrArrayProps](#dummyprotocoldevicestatusprops)                                                                                                                                                                | 否       |

### DummyProtocolDevicePropertyType

DummyProtocolDevicePropertyType 描述了设备属性的类型。

| 参数    | 描述                 | 类型   | 是否必填 |
| :------ | :------------------- | :----- | :------- |
| string  | int 类型属性的值     | string | 否       |
| int     | int 类型属性的值     | string | 否       |
| float   | float 类型属性的值   | string | 否       |
| boolean | boolean 类型属性的值 | string | 否       |
| array   | array 类型属性的值   | string | 否       |
| object  | object 类型属性的值  | string | 否       |

#### DummyDeviceExtension

| 参数 | 描述                 | 类型                                                                                     | 是否必填 |
| :--- | :------------------- | :--------------------------------------------------------------------------------------- | :------- |
| mqtt | 说明 MQTT 插件的配置 | \*[v1alpha1.MQTTOptionsSpec](/docs/octopus/adaptors/mqtt-extension/_index#specification) | 是       |

## Demo 演示

1. 创建一个[DeviceLink](https://github.com/cnrancher/octopus/blob/master/adaptors/dummy/deploy/e2e/dl_specialdevice.yaml)以连接 DummySpecialDevice，该设备模拟客厅的风扇。

   ```shell script
   kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/dl_specialdevice.yaml
   ```

   将上面创建的风扇状态同步到远程 MQTT 代理服务器。

   ```shell script
   # create a Generic Secret to store the CA for connecting test.mosquitto.org.
   kubectl create secret generic living-room-fan-mqtt-ca --from-file=ca.crt=./test/integration/physical/testdata/mosquitto.org.crt

   # create a TLS Secret to store the TLS/SSL keypair for connecting test.mosquitto.org.
   kubectl create secret tls living-room-fan-mqtt-tls --key ./test/integration/physical/testdata/client-key.pem --cert ./test/integration/physical/testdata/client.crt

   # publish status to test.mosquitto.org
   kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/dl_specialdevice_with_mqtt.yaml
   ```

   使用`mosquitto_sub`工具观看同步状态。

   ```shell script
   # get mqtt broker server
   kubectl get dummyspecialdevices.devices.edge.cattle.io living-room-fan -o jsonpath="{.status.extension.mqtt.client.server}"

   # get topic name
   kubectl get dummyspecialdevices.devices.edge.cattle.io living-room-fan -o jsonpath="{.status.extension.mqtt.message.topicName}"
   # use mosquitto_sub

   mosquitto_sub -h {the host of mqtt broker server} -p {the port of mqtt broker server} -t {the topic name}
   # mosquitto_sub -h test.mosquitto.org -p 1883 -t cattle.io/octopus/default/living-room-fan
   ```

1. 创建一个[DeviceLink](https://github.com/cnrancher/octopus/blob/master/adaptors/dummy/deploy/e2e/dl_protocoldevice.yaml)以连接 DummyProtocolDevice，该设备模拟一个智能机器人，它可以在 2 秒内随机填充所需的属性。

   ```shell script
   kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/dl_protocoldevice.yaml
   ```

   将以上创建的机械的答案同步到远程 MQTT 代理服务器。

   ```shell script
   # publish status to test.mosquitto.org
   kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/dummy/deploy/e2e/dl_protocoldevice_with_mqtt.yaml
   ```

   使用`mosquitto_sub`工具观看同步的结果。

   ```shell script
   # get mqtt broker server
   kubectl get dummyprotocoldevices.devices.edge.cattle.io localhost-robot -o jsonpath="{.status.extension.mqtt.client.server}"

   # get topic name
   kubectl get dummyprotocoldevices.devices.edge.cattle.io localhost-robot -o jsonpath="{.status.extension.mqtt.message.topicName}"

   # use mosquitto_sub
   mosquitto_sub -h {the host of mqtt broker server} -p {the port of mqtt broker server} -t {the topic name}
   # mosquitto_sub -h test.mosquitto.org -p 1883 -t cattle.io/octopus/835aea2e-5f80-4d14-88f5-40c4bda41aa3
   ```
