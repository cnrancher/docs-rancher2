---
title: OPC-UA 适配器
description: OPC-UA是由 OPC Foundation 开发的用于工业自动化的机器对机器通信协议。OPC-UA 适配器集成了gopcua并专注于与工业 OPC-UA 设备和系统进行通信，以便在边缘侧进行数据收集和数据处理。
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
  - OPC-UA 适配器
---

## 介绍

[OPC Unified Architecture](https://opcfoundation.org/about/opc-technologies/opc-ua/)（OPC-UA）是由 OPC Foundation 开发的用于工业自动化的机器对机器通信协议。

OPC-UA 适配器集成了[gopcua](https://github.com/gopcua/opcua)，并专注于与工业 OPC-UA 设备和系统进行通信，以便在边缘侧进行数据收集和数据处理。

## 注册信息

| 版本       | 注册名称                        | 端点 Socket  | 是否可用 |
| :--------- | :------------------------------ | :----------- | :------- |
| `v1alpha1` | `adaptors.edge.cattle.io/opcua` | `opcua.sock` | \*       |

## 支持模型

| 类型          | 设备组                   | 版本       | 是否可用 |
| :------------ | :----------------------- | :--------- | :------- |
| `OPCUADevice` | `devices.edge.cattle.io` | `v1alpha1` | \*       |

## 支持平台

| 操作系统 | 架构    |
| :------- | :------ |
| `linux`  | `amd64` |
| `linux`  | `arm`   |
| `linux`  | `arm64` |

## 使用方式

```shell script
kubectl apply -f https://raw.githubusercontent.com/cnrancher/octopus/master/adaptors/opcua/deploy/e2e/all_in_one.yaml
```

## 权限

对 Octopus 授予权限，如下所示：

```text
  Resources                                   Non-Resource URLs  Resource Names  Verbs
  ---------                                   -----------------  --------------  -----
  opcuadevices.devices.edge.cattle.io         []                 []              [create delete get list patch update watch]
  opcuadevices.devices.edge.cattle.io/status  []                 []              [get patch update]
```

## Example

- 指定一个 "OPCUADevice"设备链接来连接 OPC-UA 服务器。

  ```YAML
  apiVersion: edge.cattle.io/v1alpha1
  kind: DeviceLink
  metadata:
    name: opcua
  spec:
    adaptor:
      node: edge-worker
      name: adaptors.edge.cattle.io/opcua
    model:
      apiVersion: "devices.edge.cattle.io/v1alpha1"
      kind: "OPCUADevice"
    template:
      metadata:
        labels:
          device: opcua
      spec:
        parameters:
          syncInterval: 5s
          timeout: 10s
        protocol:
          # replace the address if needed
          endpoint: opc.tcp://10.43.29.71:4840/
        properties:
          - name: datetime
            description: the current datetime
            readOnly: true
            visitor:
              nodeID: ns=0;i=2258
            type: datetime
          - name: integer
            description: mock number. Default value is 42
            readOnly: false
            visitor:
              nodeID: ns=1;s=the.answer
            type: int32
            value: "1"
          - name: string
            description: mock byte string. Default value is "test123"
            readOnly: false
            visitor:
              nodeID: ns=1;s=myByteString
            type: byteString
            value: "newString"
  ```

更多的 "OPCUADevice "设备链接示例，请参考[deploy/e2e](https://github.com/cnrancher/octopus/tree/master/adaptors/opcua/deploy/e2e)目录，并使用[deploy/e2e/simulator.yaml](https://github.com/cnrancher/octopus/tree/master/adaptors/opcua/deploy/e2e)进行快速体验。

## OPCUADevice

| 参数     | 描述                        | 类型                                                                                                       | 是否必填 |
| :------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :------- |
| metadata | 元数据                      | [metav1.ObjectMeta](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/types.go#L110) | 否       |
| spec     | 定义`OPCUADevice`的预期状态 | [OPCUADeviceSpec](#opcuadevicespec)                                                                        | 是       |
| status   | 定义`OPCUADevice`的实际状态 | [OPCUADeviceStatus](#opcuadevicestatus)                                                                    | 否       |

### OPCUADeviceSpec

| 参数       | 描述                     | 类型                                            | 是否必填 |
| :--------- | :----------------------- | :---------------------------------------------- | :------- |
| extension  | 指定设备的插件           | \*[OPCUADeviceExtension](#opcuadeviceextension) | 否       |
| parameters | 指定设备的参数           | \*[OPCUADeviceParamters](#opcuadeviceparamters) | 否       |
| protocol   | 指定访问设备时使用的协议 | \*[OPCUADeviceProtocol](#opcuadeviceprotocol)   | 是       |
| properties | 指定设备的属性           | \*[OPCUADeviceProperty](#opcuadeviceproperty)   | 否       |

### OPCUADeviceStatus

| 参数       | 描述           | 类型                                                      | 是否必填 |
| :--------- | :------------- | :-------------------------------------------------------- | :------- |
| properties | 上报设备的属性 | \*[OPCUADeviceStatusProperty](#opcuadevicestatusproperty) | 否       |

#### OPCUADeviceParamters

| 参数         | 描述                                      | 类型   | 是否必填 |
| :----------- | :---------------------------------------- | :----- | :------- |
| syncInterval | 指定默认的设备同步时间间隔，默认为`15s`   | string | 否       |
| timeout      | 指定默认的设备的连接超时时间，默认为`10s` | string | 否       |

#### OPCUADeviceProtocol

| 参数           | 描述                                                | 类型                                                                      | 是否必填 |
| :------------- | :-------------------------------------------------- | :------------------------------------------------------------------------ | :------- |
| endpoint       | 指定 OPC-UA 服务器端点的 URL，以 "opc.tcp://"开头。 | string                                                                    | 是       |
| securityPolicy | 指定访问 OPC-UA 服务器的安全策略，默认为 "None"。   | \*[OPCUADeviceProtocolSecurityPolicy](#opcuadeviceprotocolsecuritypolicy) | 否       |
| securityMode   | 指定访问 OPC-UA 服务器的安全模式，默认为 "None"。   | \*[OPCUADeviceProtocolSecurityMode](#opcuadeviceprotocolsecuritymode)     | 否       |
| basicAuth      | 指定客户端连接 OPC-UA 服务器的用户名和密码。        | \*[OPCUADeviceProtocolBasicAuth](#opcuadeviceprotocolbasicauth)           | 否       |
| tlsConfig      | 指定客户端连接 OPC-UA 服务器的 TLS 配置。           | \*[OPCUADeviceProtocolTLS](#opcuadeviceprotocoltls)                       | 否       |

#### OPCUADeviceProtocolSecurityPolicy

| 参数                | 描述                              | 类型   |
| :------------------ | :-------------------------------- | :----- |
| None                | 无安全策略                        | string |
| Basic128Rsa15       | 使用 Basic128Rsa15 安全策略       | string |
| Basic256            | 使用 Basic256 安全策略            | string |
| Basic256Sha256      | 使用 asic256Sha256 安全策略       | string |
| Aes128Sha256RsaOaep | 使用 Aes128Sha256RsaOaep 安全策略 | string |
| Aes256Sha256RsaPss  | 使用 Aes256Sha256RsaPss 安全策略  | string |

#### OPCUADeviceProtocolSecurityMode

| 参数           | 描述       | 类型   |
| :------------- | :--------- | :----- |
| None           | 不加密     | string |
| Sign           | 仅签名     | string |
| SignAndEncrypt | 签名且加密 | string |

#### OPCUADeviceProtocolBasicAuth

| 参数        | 描述                                               | 类型                                                                                                                                    | 是否必填 |
| :---------- | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| username    | 指定访问 OPC-UA 服务器的用户名                     | string                                                                                                                                  | 否       |
| usernameRef | 指定 DeviceLink 的引用关系，将该值作为用户名引用   | \*[edgev1alpha1.DeviceLinkReferenceRelationship](https://github.com/cnrancher/octopus/blob/master/api/v1alpha1/devicelink_types.go#L12) | 否       |
| password    | 指定访问 OPC-UA 服务器的用户密码                   | string                                                                                                                                  | 否       |
| passwordRef | 指定 DeviceLink 的引用关系，将该值作为用户密码引用 | \*[edgev1alpha1.DeviceLinkReferenceRelationship](https://github.com/cnrancher/octopus/blob/master/api/v1alpha1/devicelink_types.go#L12) | 否       |

#### OPCUADeviceProtocolTLS

| 参数           | 描述                                                                | 类型                                                                                                                                    | 是否必填 |
| :------------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| certFilePEM    | 指定证书(公钥)的 PEM 格式内容，用于客户端对 OPC-UA 服务器的认证     | string                                                                                                                                  | 否       |
| certFilePEMRef | 指定 DeviceLink 的引用关系，将该值作为客户端证书文件 PEM 内容引用。 | \*[edgev1alpha1.DeviceLinkReferenceRelationship](https://github.com/cnrancher/octopus/blob/master/api/v1alpha1/devicelink_types.go#L12) | 否       |
| keyFilePEM     | 指定密钥(私钥)的 PEM 格式内容，用于客户端对 OPC-UA 服务器的认证。   | string                                                                                                                                  | 否       |
| keyFilePEMRef  | 指定 DeviceLink 的引用关系，将该值作为客户端密钥文件 PEM 内容引用。 | \*[edgev1alpha1.DeviceLinkReferenceRelationship](https://github.com/cnrancher/octopus/blob/master/api/v1alpha1/devicelink_types.go#L12) | 否       |

#### OPCUADeviceProperty

| 参数        | 描述                                | 类型                                                        | 是否必填 |
| :---------- | :---------------------------------- | :---------------------------------------------------------- | :------- |
| name        | 指定属性名称                        | string                                                      | 是       |
| description | 指定属性的描述                      | string                                                      | 否       |
| type        | 指定属性的类型                      | \*[OPCUADevicePropertyType](#opcuadevicepropertytype)       | 是       |
| visitor     | 指定属性的 visitor                  | \*[OPCUADevicePropertyVisitor](#opcuadevicepropertyvisitor) | 是       |
| readOnly    | 指定属性的是否只读，默认值为`false` | boolean                                                     | 否       |
| value       | 指定属性的值，只在可写属性中可用    | string                                                      | 否       |

#### OPCUADeviceStatusProperty

| 参数      | 描述                   | 类型                                                                                                 | 是否必填 |
| :-------- | :--------------------- | :--------------------------------------------------------------------------------------------------- | :------- |
| name      | 属性名称               | string                                                                                               | 否       |
| type      | 属性类型               | \*[OPCUADevicePropertyType](#modbusdevicepropertytype)                                               | 否       |
| value     | 属性值                 | string                                                                                               | 否       |
| updatedAt | 修改属性时留下的时间戳 | \*[metav1.Time](https://github.com/kubernetes/apimachinery/blob/master/pkg/apis/meta/v1/time.go#L33) | 否       |

#### OPCUADevicePropertyVisitor

| 参数       | 描述                                      | 类型   | 是否必填 |
| :--------- | :---------------------------------------- | :----- | :------- |
| nodeID     | 指定 OPC-UA 节点的 id，例如 "ns=1,i=1005" | string | 是       |
| browseName | 指定 OPC-UA 节点名称                      | string | 否       |

#### OPCUADevicePropertyType

| 参数       | 描述                                            | 类型   |
| :--------- | :---------------------------------------------- | :----- |
| boolean    | 属性数据类型为布尔值                            | string |
| int64      | 属性数据类型为 int64                            | string |
| int32      | 属性数据类型为 int32                            | string |
| int16      | 属性数据类型为 int16                            | string |
| uint64     | 属性数据类型为 uint64                           | string |
| uint32     | 属性数据类型为 uint32                           | string |
| uint16     | 属性数据类型为 uint16                           | string |
| float      | 属性数据类型为 float                            | string |
| double     | 属性数据类型为 double                           | string |
| string     | 属性数据类型为 string                           | string |
| byteString | 属性数据类型为 bytestring，将转换为 string 显示 | string |
| datetime   | 属性数据类型为 datetime                         | string |

#### OPCUADeviceExtension

| 参数 | 描述             | 类型                                                                       | 是否必填 |
| :--- | :--------------- | :------------------------------------------------------------------------- | :------- |
| mqtt | 指定 MQTT 的设置 | \*[v1alpha1.MQTTOptionsSpec](/docs/octopus/adaptors/mqtt-extension/) | 否       |
