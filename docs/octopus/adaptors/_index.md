---
title: 关于适配器
description: Octopus 诞生时就考虑到了可伸缩性的必要，这种能力体现在设备模型和适配器的设计中。由于可以通过 CRD 定义设备模型，因此设备模型可以是专用设备（例如风扇，LED 等），也可以是通用协议设备（例如 BLE，ModBus，OPC-UA 设备等）。
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
  - 关于适配器
---

## 适配器设计

Octopus 诞生时就考虑到了可伸缩性的必要，这种能力体现在设备模型和适配器的设计中。

由于可以通过 CRD 定义设备模型，因此设备模型可以是专用设备（例如风扇，LED 等），也可以是通用协议设备（例如 BLE，ModBus，OPC-UA 设备等）。

```text
                      ┌──────────────────────┐
                      │   MideaAirPurifier   │ #专用设备
                      └──────────────────────┘


                      ┌──────────────────────┐
                      │ MideaAirConditioning │ #专用设备
                      └──────────────────────┘


                      ┌──────────────────────┐
                      │  XiaoMiAirPurifier   │ #专用设备
                      └──────────────────────┘


                      ╔══════════════════════╗
                      ║      Bluetooth       ║  #通用协议设备
                      ╚══════════════════════╝


                      ╔══════════════════════╗
                      ║        Modbus        ║ #通用协议设备
                      ╚══════════════════════╝


                      ╔══════════════════════╗
                      ║        OPC-UA        ║ #通用协议设备
                      ╚══════════════════════╝
```

同时，适配器的实现可以连接到单个设备或多个设备：

```text
                                         ┌──────────────────────┐
                              ┌──────────│   MideaAirPurifier   │──────────┐
                              │          └──────────────────────┘          │
                              │                                            │
                              │                                            │
                   .          │          ┌──────────────────────┐          │           .
                  ( )◀────────┤          │ MideaAirConditioning │──────────┴─────────▶( )
                   '          │          └──────────────────────┘                      '
   adaptors.smarthome.io/airpurifier                                      adaptors.media.io/smarthome
                              │
                              │          ┌──────────────────────┐
                              └──────────│  XiaoMiAirPurifier   │──────────┐
                                         └──────────────────────┘          │
                                                                           │
                                                                           │
                                         ┌──────────────────────┐          │            .
                                         │ XiaoMiWeighingScale  │──────────┴──────────▶( )
                                         └──────────────────────┘                       '
                                                                          adaptors.xiaomi.io/smarthome

                   .                     ╔══════════════════════╗
                  ( )◀═══════════════════║      Bluetooth       ║
                   '                     ╚══════════════════════╝
    adaptors.edge.cattle.io/ble

                                         ╔══════════════════════╗                       .
                                         ║        Modbus        ║═════════════════════▶( )
                                         ╚══════════════════════╝                       '
                                                                         adaptors.edge.cattle.io/modbus
```

请在[此处](../develop/_index)查看有关开发适配器的更多详细信息。

## 适配器 APIs

适配器的访问管理借鉴了[Kubernetes 设备插件管理](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。 当前访问管理 API 的可用版本为`v1alpha1`。

| Versions                                                                                                                            | Available | Current |
| :---------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------ |
| [`v1alpha1`](https://github.com/cnrancher/octopus/blob/8a0a7df439180a961b0d1c47415d0138c401767e/pkg/adaptor/api/v1alpha1/api.proto) | \*        | \*      |

使用以下步骤使适配器与`limb`交互：

1. `limb`在主机路径上启动带有 Unix socket 的 gRPC 服务，以接收来自适配器的注册请求：

   ```proto
   // Registration is the service advertised by the Limb,
   // any adaptor start its service until Limb approved this register request.
   service Registration {
     // Register is used to register the adaptor with limb.
     rpc Register (RegisterRequest) returns (Empty) {}
   }

   message RegisterRequest {
       // Name of the adaptor in the form `adaptor-vendor.com/adaptor-name`.
       string name = 1;
       // Version of the API the adaptor was built against.
       string version = 2;
       // Name of the unix socket the adaptor is listening on, it's in the form `*.sock`.
       string endpoint = 3;
   }
   ```

1. 适配器使用主机路径`/var/lib/octopus/adaptors`下的 Unix socket 启动 gRPC 服务，该服务实现以下接口：

   ```proto
   // Connection is the service advertised by the adaptor.
   service Connection {
       rpc Connect (stream ConnectRequest) returns (stream ConnectResponse) {}
   }

   message ConnectRequestReferenceEntry {
     map<string, bytes> items = 1;
   }

   // ConnectRequest is the request used during connection
   // and is used to send desired device data to an adaptor.
   message ConnectRequest {
     // Model for the device.
     k8s.io.apimachinery.pkg.apis.meta.v1.TypeMeta model = 1;
     // Desired device, it's in form JSON bytes.
     bytes device = 2;
     // References for the device, i.e: Secret, ConfigMap and Downward API.
     map<string, ConnectRequestReferenceEntry> references = 3;
   }

   // ConnectResponse is the response used during connection
   // and is used to return observed device data to the limb.
   message ConnectResponse {
     // Observed device, it's in form JSON bytes.
     bytes device = 1;
     // The unhandled error message indicates that the connection cannot be interrupted
     // and the user needs to choose to recreate or ignore it.
     string errorMessage = 2;
   }
   ```

1. 适配器通过 Unix socket 旨在主机路径`/var/lib/octopus/adaptors/limb.sock`处向`limb`注册。
1. 成功注册后，适配器以服务模式运行，在此模式下，适配器将保持连接设备的状态，并在设备状态发生任何变化时向`limb`报告。

#### 关于注册

**注册** 可以让`limb`发现适配器的存在，在这一阶段，`limb`充当服务器，而适配器充当客户端。适配器使用其名称，版本和访问端点构造一个注册请求，然后请求肢体。成功注册后，`limb`将继续监视适配器并通知与已注册适配器相关的那些 DeviceLink。

- 名称是适配器的名称，强烈建议使用此模式`adaptor-vendor.com/adaptor-name`来命名适配器，每个适配器必须具有一个唯一的`名称`。如果两个适配器具有相同`名称`，新创建的适配器将覆盖已有的适配器。
- 版本是访问管理的 API 版本，目前已在 v1alpha1 中修复。
- 访问的“端点”是 UNIX 套接字的名称，每个适配器必须具有一个唯一的“端点”。如果两个适配器具有相同注册端点，在退出前一个适配器之前，第二个适配器不会成功注册。

#### 关于链接

**链接**可以让`limb`连接到适配器，在此阶段，适配器充当服务器，而`limb`充当客户端。 `limb`使用 `model`、`device` 和 `references`构造连接请求，然后向目标适配器发出请求。

- `model` 是设备的模型，有助于适配器区分多个模型，或者在一个模型中存在不同版本时保持兼容性非常有用。
- `device` 是设备的实例，格式为 JSON 字节，是完整的`model` 实例的`JSON`字节，并包含`spec`和`status`数据。
  > 适配器应根据`model`选择相应的反序列化接收对象，以接收该字段的数据。
  > 由于接收对象（设备实例）是合法的 CRD 实例，因此它严格遵守 Kubernetes 的资源管理约定，因此可以通过命名空间和名称唯一地标识设备。
- `references` 是设备的参考源，它允许设备在相同的名称空间或父`DeviceLink`实例的向下`API`下使用`ConfigMap`和`Secret`。

## 可用适配器列表

- [Modbus](/docs/octopus/adaptors/modbus/_index)
- [OPC-UA](/docs/octopus/adaptors/opc-ua/_index)
- [MQTT](/docs/octopus/adaptors/mqtt/_index)
- [BLE](/docs/octopus/adaptors/ble/_index)
- [Dummy](/docs/octopus/adaptors/dummy/_index)
