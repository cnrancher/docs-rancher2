---
title: Modbus 适配器
description: Modbus是主/从协议，请求信息的设备称为Modbus 主设备，提供信息的设备称为Modbus 从设备。在标准的 Modbus 网络中，有 1 个主设备和最多 247 个从设备，每个从设备具有从 1 到 247 的唯一从设备地址。除了请求从设备的信息外，主设备也可以将信息写入从设备。
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
  - Modbus 适配器
---

## 介绍

[Modbus](https://www.modbustools.com/modbus.html)是主/从协议，请求信息的设备称为**Modbus 主设备**，提供信息的设备称为**Modbus 从设备**。
在标准的 Modbus 网络中，有 1 个主设备和最多 247 个从设备，每个从设备具有从 1 到 247 的唯一从设备地址。
除了请求从设备的信息外，主设备也可以将信息写入从设备。

Modbus 适配器实现了[goburrow/modbus](#github.com/goburrow/modbus)，支持 TCP 和 RTU 协议，它作为控制器（主 sheb ）节点，连接或操作边缘端的 Modbus 从设备。

## 注册操作

- **线圈寄存器**：即 CoilRegister，可读可写，1 位（关闭/打开）

- **离散输入寄存器**：即 DiscreteInputRegister，可读，1 位（关闭/打开）

- **输入寄存器**：即 InputRegister，可读可写，16 位（0 到 65，535），本质上是配置值

- **保持寄存器**：即 HoldingRegister，可读，16 位（0 至 65，535），本质上是测量值和状态

## 注册信息

| 版本       | 注册名称                         | 端点 Socket   | 是否可用 |
| :--------- | :------------------------------- | :------------ | :------- |
| `v1alpha1` | `adaptors.edge.cattle.io/modbus` | `modbus.sock` | 是       |

## 支持模型

| 类型           | 设备组                   | 版本       | 是否可用 |
| :------------- | :----------------------- | :--------- | :------- |
| `ModbusDevice` | `devices.edge.cattle.io` | `v1alpha1` | 是       |

## 支持平台

| 操作系统 | 架构    |
| :------- | :------ |
| `linux`  | `amd64` |
| `linux`  | `arm`   |
| `linux`  | `arm64` |

## 使用方式

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/modbus/deploy/e2e/all_in_one.yaml

```

## 权限

对 Octopus 授予权限，如下所示：

```text
  Resources                                   Non-Resource URLs  Resource Names  Verbs
  ---------                                   -----------------  --------------  -----
  modbusdevices.devices.edge.cattle.io         []                 []              [create delete get list patch update watch]
  modbusdevices.devices.edge.cattle.io/status  []                 []              [get patch update]
```

## Modbus DeviceLink YAML 示例

指定一个`ModbusDevice`设备链接来连接串口温度计。

```yaml
apiVersion: edge.cattle.io/v1alpha1
kind: DeviceLink
metadata:
  name: modbus-rtu
spec:
  adaptor:
    node: edge-worker
    name: adaptors.edge.cattle.io/modbus
  model:
    apiVersion: "devices.edge.cattle.io/v1alpha1"
    kind: "ModbusDevice"
  template:
    metadata:
      labels:
        device: modbus-rtu
    spec:
      parameters:
        syncInterval: 10s
        timeout: 10s
      protocol:
        rtu:
          endpoint: /dev/tty.usbserial-1410
          workerID: 1
          parity: "N"
          stopBits: 2
          dataBits: 8
          baudRate: 9600
      properties:
        - name: temperature
          description: data collection of temperature sensor
          readOnly: true
          visitor:
            register: HoldingRegister
            offset: 0
            quantity: 1
            orderOfOperations:
              - type: Divide
                value: "10"
          type: float
```

更多的 "ModbusDevice "设备链接实例，请参考[deploy/e2e](https://github.com/cnrancher/octopus/tree/master/adaptors/modbus/deploy/e2e)目录，并使用[deploy/e2e/simulator.yaml](https://github.com/cnrancher/octopus/tree/master/adaptors/modbus/deploy/e2e)进行快速体验。

## ModbusDevice

| 参数     | 描述                         | 类型                                                                                                       | 是否必填 |
| :------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据                       | [metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | 否       |
| spec     | 定义`ModbusDevice`的预期状态 | [ModbusDeviceSpec](#modbusdevicespec)                                                                      | 是       |
| status   | 定义`ModbusDevice`的实际状态 | [ModbusDeviceStatus](#modbusdevicestatus)                                                                  | 否       |

### ModbusDeviceSpec

| 参数       | 描述                     | 类型                                                | 是否必填 |
| :--------- | :----------------------- | :-------------------------------------------------- | :------- |
| extension  | 指定设备的插件           | \*[ModbusDeviceExtension](#modbusdeviceextension)   | 否       |
| parameters | 指定设备的参数           | \*[ModbusDeviceParameters](#modbusdeviceparameters) | 否       |
| protocol   | 指定访问设备时使用的协议 | \*[ModbusDeviceProtocol](#modbusdeviceprotocol)     | 是       |
| properties | 指定设备的属性           | \*[ModbusDeviceProperty](#modbusdeviceproperty)     | 是       |

### ModbusDeviceStatus

| 参数       | 描述           | 类型                                                        | 是否必填 |
| :--------- | :------------- | :---------------------------------------------------------- | :------- |
| properties | 上报设备的属性 | \*[ModbusDeviceStatusProperty](#modbusdevicestatusproperty) | 否       |

#### ModbusDeviceParameters

| 参数         | 描述                                      | 类型   | 是否必填 |
| :----------- | :---------------------------------------- | :----- | :------- |
| syncInterval | 指定默认的设备同步时间间隔，默认为`15s`   | string | 否       |
| timeout      | 指定默认的设备的连接超时时间，默认为`10s` | string | 否       |

#### ModbusDeviceProtocol

| 参数 | 描述                 | 类型                                                  | 是否必填 |
| :--- | :------------------- | :---------------------------------------------------- | :------- |
| rtu  | 将连接协议指定为 RTU | \*[ModbusDeviceProtocolRTU](#modbusdeviceprotocolrtu) | 否       |
| tcp  | 将连接协议指定为 TCP | \*[ModbusDeviceProtocolTCP](#modbusdeviceprotocoltcp) |

#### ModbusDeviceProtocolRTU

| 参数     | 描述                                                                                | 类型   | 是否必填 |
| :------- | :---------------------------------------------------------------------------------- | :----- | :------- |
| endpoint | 指定设备的串口，其形式为"/dev/ttyS0"                                                | string | 是       |
| workerID | 指定设备的 worker ID                                                                | int    | 是       |
| baudRate | 指定连接的波特率，衡量传输速度，默认为 "19200"                                      | int    | 否       |
| dataBits | 指定连接的数据位，可选值为：[5、6、7、8]，默认值为`8`。                             | int    | 否       |
| parity   | 指定连接的奇偶性，可选值为[`N` - None, `E` - Even, `O` - Odd]，默认值为`E`。        | string | 否       |
| stopBits | 指定连接的停止位，可选值为[1,2]，使用 N(None)奇偶校验需要 2 个停止位，默认值为`1`。 | int    | 否       |

#### ModbusDeviceProtocolTCP

| 参数     | 描述                                   | 类型   | 是否必填 |
| :------- | :------------------------------------- | :----- | :------- |
| endpoint | 指定设备的 IP 地址，其形式为 "ip:port" | string | 是       |
| workerID | 指定设备的 workerID                    | int    | 是       |

#### ModbusDeviceProperty

| 参数        | 描述                                | 类型                                                        | 是否必填 |
| :---------- | :---------------------------------- | :---------------------------------------------------------- | :------- |
| name        | 指定属性名称                        | string                                                      | 是       |
| description | 指定属性的描述                      | string                                                      | 否       |
| type        | 指定属性的类型                      | [ModbusDevicePropertyType](#modbusdevicepropertytype)       | 是       |
| visitor     | 指定属性的 visitor                  | [ModbusDevicePropertyVisitor](#modbusdevicepropertyvisitor) | 是       |
| readOnly    | 指定属性的是否只读，默认值为`false` | boolean                                                     | 是       |
| value       | 指定属性的值，只在可写属性中可用    | string                                                      | 否       |

#### ModbusDeviceStatusProperty

| 参数      | 描述                         | 类型                                                                                                 | 是否必填 |
| :-------- | :--------------------------- | :--------------------------------------------------------------------------------------------------- | :------- |
| name      | 财产名称                     | string                                                                                               | 否       |
| type      | 属性的类型                   | [ModbusDevicePropertyType](#modbusdevicepropertytype)                                                | 否       |
| value     | 属性的值，只在可写属性中可用 | string                                                                                               | 否       |
| updatedAt | 修改属性时的时间戳           | \*[metav1.Time](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/time.go#L33) | 否       |

#### ModbusDevicePropertyType

| 参数      | 描述                                       | 类型   |
| :-------- | :----------------------------------------- | :----- |
| int       | 属性数据类型为 int，与 int32 相同          | string |
| int16     | 属性数据类型为 int                         | string |
| int32     | 属性数据类型为 int                         | string |
| int64     | 属性数据类型为 int                         | string |
| uint      | 属性数据类型为 uint，与 uint32 相同        | string |
| uint16    | 属性数据类型为 uint                        | string |
| uint32    | 属性数据类型为 uint                        | string |
| uint64    | 属性数据类型为 uint                        | string |
| float     | 属性数据类型为 float，32 位                | string |
| double    | 属性数据类型为 float，64 位                | string |
| boolean   | 属性数据类型为 bool                        | string |
| hexString | 属性数据类型为 hex in string，例如 “CD01 ” | string |

#### ModbusDevicePropertyValueEndianness

| 参数             | 描述                       | 类型   |
| :--------------- | :------------------------- | :----- |
| BigEndian        | 属性值的字节序为大端序     | string |
| LittleEndian     | 属性值的字节序为小端序     | string |
| BigEndianSwap    | 属性值的字节序为大端置换序 | string |
| LittleEndianSwap | 属性值的字节序为小端置换序 | string |

#### ModbusDevicePropertyVisitor

| 参数              | 描述                              | 类型                                                                        | 是否必填 |
| :---------------- | :-------------------------------- | :-------------------------------------------------------------------------- | :------- |
| register          | 指定要访问的注册表                | [ModbusDeviceRegisterType](#modbusdeviceregistertype)                       | 是       |
| offset            | 指定读/写数据的寄存器的起始偏移量 | int                                                                         | 是       |
| quantity          | 指定寄存器的数量                  | int                                                                         | 是       |
| endianness        | 指定值的字节顺序                  | [ModbusDevicePropertyValueEndianness](#ModbusDevicePropertyValueEndianness) | 否       |
| orderOfOperations | 指定操作的顺序                    | [ModbusDeviceArithmeticOperation](#modbusdevicearithmeticoperation)         | 否       |

#### ModbusDeviceRegisterType

| 参数                  | 描述                                              | 类型   |
| :-------------------- | :------------------------------------------------ | :----- |
| CoilRegister          | 可读可写，1 位（关闭/打开）                       | string |
| DiscreteInputRegister | 可读，1 位（关闭/打开）。                         | string |
| InputRegister         | 可读，16 位（0 至 65，535），本质上是测量值和状态 | string |
| HoldingRegister       | 可读可写，16 位（0 到 65，535），本质上是配置值   | string |

#### ModbusDeviceArithmeticOperation

| 参数  | 描述                                   | 类型                                                                        | 是否必填 |
| :---- | :------------------------------------- | :-------------------------------------------------------------------------- | :------- |
| type  | 指定算术运算的类型                     | [ModbusDeviceArithmeticOperationType](#ModbusDeviceArithmeticOperationType) | 是       |
| value | 指定算术运算的值，其形式为浮点数字符串 | string                                                                      | 是       |

#### ModbusDeviceArithmeticOperationType

| 参数     | 描述             | 类型   |
| :------- | :--------------- | :----- |
| Add      | 加法的算术运算。 | string |
| Subtract | 减法的算术运算。 | string |
| Multiply | 乘法的算术运算。 | string |
| Divide   | 除法的算术运算。 | string |

#### ModbusDeviceExtension

| 参数 | 描述             | 类型                                                                                     | 是否必填 |
| :--- | :--------------- | :--------------------------------------------------------------------------------------- | :------- |
| mqtt | 指定 MQTT 的设置 | \*[v1alpha1.MQTTOptionsSpec](/docs/octopus/adaptors/mqtt-extension/_index#specification) | 否       |
