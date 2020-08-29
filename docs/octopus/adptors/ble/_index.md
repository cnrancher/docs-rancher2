---
title: BLE 适配器
---

## 介绍

BLE 代表[低功耗蓝牙](#https://en.wikipedia.org/wiki/Bluetooth_Low_Energy)。 BLE 是一种设计用于短距离通信的无线通信形式。

BLE 适配器实现了蓝牙协议的支持，并用于定义所连接的 BLE 设备的属性与配置。

> **说明：** 使用 BLE 适配器前，请检查您的主机是否具有蓝牙传输功能。如果您的主机不支持蓝牙传输，则会导致工作负载和 Pods 启动失败。

## 注册信息

| 版本       | 注册名称                      | 端点 Socket | 是否可用 |
| :--------- | :---------------------------- | :---------- | :------- |
| `v1alpha1` | `adaptors.edge.cattle.io/ble` | `ble.sock`  | \*       |

## 支持模型

| 类型              | 设备组                   | 版本       | 是否可用 |
| :---------------- | :----------------------- | :--------- | :------- |
| `BluetoothDevice` | `devices.edge.cattle.io` | `v1alpha1` | \*       |

## 支持的操作系统和架构

| 操作系统 | 架构    |
| :------- | :------ |
| `linux`  | `amd64` |
| `linux`  | `arm`   |
| `linux`  | `arm64` |

## 使用方式

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/ble/deploy/e2e/all_in_one.yaml
```

## 权限

对 Octopus 授予权限，如下所示：

```text
  Resources                                   Non-Resource URLs  Resource Names  Verbs
  ---------                                   -----------------  --------------  -----
  bluetoothdevices.devices.edge.cattle.io         []                 []              [create delete get list patch update watch]
  bluetoothdevices.devices.edge.cattle.io/status  []                 []              [get patch update]
```

## BLE 示例

指定一个 "蓝牙设备 "设备链接来连接[小米温度计](https://www.mi.com/mj-humiture)。

```YAML
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  name: xiaomi-temp-rs2201
spec:
  adaptor:
    node: edge-worker
    name: adaptors.edge.cattle.io/ble
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "BluetoothDevice"
  template:
    metadata:
      labels:
        device: xiaomi-temp-rs2201
    spec:
      parameters:
        syncInterval: 15s
        timeout: 30s
      protocol:
        endpoint: "MJ_HT_V1"
      properties:
        - name: data
          description: XiaoMi temp sensor with temperature and humidity data
          accessMode: NotifyOnly
          visitor:
            characteristicUUID: 226c000064764566756266734470666d
        - name: humidity
          description: Humidity in percent
          accessMode: ReadOnly
          visitor:
            characteristicUUID: f000aa0304514000b000000000000000
            dataConverter:
              startIndex: 1
              endIndex: 0
              shiftRight: 2
              orderOfOperations:
                # Options are Add/Subtract/Multiply/Divide
                - type: Multiply
                  value: "0.03125"
        - name: power-enabled
          description: Turn the device power on or off
          accessMode: ReadWrite
          visitor:
            characteristicUUID: f000aa0104514000b000000000000001
            # Sets the defaultValue by chosen one of option in the dataWrite
            defaultValue: OFF
            dataWrite:
              ON: [1]
              OFF: [0]
            dataConverter:
              startIndex: 1
              endIndex: 0
              shiftRight: 3
              orderOfOperations:
                - type: Multiply
                  value: "0.03125"
```

有关更多 BLE `DeviceLink`示例，请参考[deploy/e2e](https://github.com/cnrancher/octopus/tree/master/adaptors/ble/deploy/e2e)目录。

## BluetoothDevice

| 参数     | 描述                               | 类型                                                                                                       | 是否必填 |
| :------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据                             | [metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | 否       |
| spec     | 定义 "BluetoothDevice"的预期状态   | [BluetoothDeviceSpec](#bluetoothdevicespec)                                                                | 是       |
| status   | D 定义 "BluetoothDevice"的实际状态 | [BluetoothDeviceStatus](#bluettothdevicestatus)                                                            | 否       |

## BluetoothDeviceSpec

| 参数       | 描述                     | 类型                                                     | 是否必填 |
| :--------- | :----------------------- | :------------------------------------------------------- | :------- |
| extension  | 指定设备的插件           | \*[BluetoothDeviceExtension](#bluetoothdeviceextension)  | 否       |
| parameters | 指定设备的参数           | \*[BluetoothDeviceParameters](#bluetoothdeviceparamters) | 否       |
| protocol   | 指定访问设备时使用的协议 | [BluetoothDeviceProtocol](#bluetoothdeviceprotocol)      | 是       |
| properties | 指定设备的属性           | [[]BluetoothDeviceProperty](#bluetoothdeviceproperty)    | 否       |

| 参数       | 描述           | 类型                                                              | 是否必填 |
| :--------- | :------------- | :---------------------------------------------------------------- | :------- |
| properties | 上报设备的属性 | [[]BluetoothDeviceStatusProperty](#bluetoothdevicestatusproperty) | 否       |

#### BluetoothDeviceParameters

| 参数         | 描述                                      | 类型   | 是否必填 |
| :----------- | :---------------------------------------- | :----- | :------- |
| syncInterval | 指定默认的设备同步时间间隔，默认为`15s`   | string | 否       |
| timeout      | 指定默认的设备的连接超时时间，默认为`30s` | string | 否       |

#### BluetoothDeviceProtocol

| 参数     | 描述                                        | 类型   | 是否必填 |
| :------- | :------------------------------------------ | :----- | :------- |
| endpoint | 指定设备的端点，可以是设备的名称或 MAC 地址 | string | 是       |

#### BluetoothDeviceProperty

| 参数        | 描述                                    | 类型                                                              | 是否必填 |
| :---------- | :-------------------------------------- | :---------------------------------------------------------------- | :------- |
| name        | 指定属性名称                            | string                                                            | 是       |
| description | 指定属性的描述                          | string                                                            | 否       |
| accessMode  | 指定属性的访问模式，默认为 "NotifyOnly" | [BluetoothDevicePropertyAccessMode](#bluetoothpropertyaccessmode) | 是       |
| visitor     | 指定属性的 visitor                      | \*[BluetoothDevicePropertyVisitor](#bluetoothpropertyvisitor)     | 是       |

#### BluetoothDeviceStatusProperty

| 参数       | 描述             | 类型                                                                                                 | 是否必填 |
| :--------- | :--------------- | :--------------------------------------------------------------------------------------------------- | :------- |
| name       | 属性名称         | string                                                                                               | 否       |
| value      | 属性值           | string                                                                                               | 否       |
| accessMode | 属性的权限       | [BluetoothDevicePropertyAccessMode](#bluetoothpropertyaccessmode)                                    | 否       |
| updatedAt  | 修改属性的时间戳 | \*[metav1.Time](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/time.go#L33) | 否       |

#### BluetoothDevicePropertyAccessMode

| Parameter  | Description                  | Scheme |
| ---------- | ---------------------------- | ------ |
| ReadOnly   | 属性的权限是 read only       | string |
| ReadWrite  | 属性的权限是 read and write  | string |
| NotifyOnly | 属性的权限模式是 notify only | string |

#### BluetoothDevicePropertyVisitor

| 参数               | 描述                                       | 类型                                              | 是否必填 |
| :----------------- | :----------------------------------------- | :------------------------------------------------ | :------- |
| characteristicUUID | 指定属性的 UUID。                          | string                                            | 是       |
| defaultValue       | 当访问模式为 "读写 "时，指定属性的默认值   | string                                            | 否       |
| dataWrite          | 指定要写入设备的数据                       | string                                            | 否       |
| dataConverter      | 指定将从设备读取的数据转换为字符串的转换器 | [BluetoothDataConverter](#bluetoothdataconverter) | 否       |

#### BluetoothDataConverter

| 参数              | 描述                             | 类型                                                                        | 是否必填 |
| :---------------- | :------------------------------- | :-------------------------------------------------------------------------- | :------- |
| startIndex        | 指定要转换的输入字节流的起始索引 | int                                                                         | 是       |
| endIndex          | 指定要转换的输入字节流的结束索引 | int                                                                         | 是       |
| shiftLeft         | 指定要左移的位数                 | int                                                                         | 否       |
| shiftRight        | 指定要右移的位数                 | int                                                                         | 否       |
| orderOfOperations | 指定操作的顺序                   | [[]BluetoothDeviceArithmeticOperation](#bluetoothdevicearithmeticoperation) | 否       |

#### BluetoothDeviceArithmeticOperation

| 参数  | 描述                                   | 类型                                                                              | 是否必填 |
| :---- | :------------------------------------- | :-------------------------------------------------------------------------------- | :------- |
| type  | 指定算术运算的类型                     | [BluetoothDeviceArithmeticOperationType](#bluetoothdevicearithmeticoperationtype) | 是       |
| value | 指定算术运算的值，其形式为浮点数字符串 | string                                                                            | 是       |

#### BluetoothDeviceArithmeticOperationType

| 参数     | 描述             | 类型   |
| :------- | :--------------- | :----- |
| Add      | 加法的算术运算。 | string |
| Subtract | 减法的算术运算。 | string |
| Multiply | 乘法的算术运算。 | string |
| Divide   | 除法的算术运算。 | string |

#### BluetoothDeviceExtension

| 参数 | 描述             | 类型                                                         | 是否必填 |
| :--- | :--------------- | :----------------------------------------------------------- | :------- |
| mqtt | 指定 MQTT 的设置 | \*[v1alpha1.MQTTOptionsSpec](./mqtt-extension#specification) | 否       |
