---
title: F5 启动 WAF 功能
description: F5 通过成熟健壮的负载均衡和应用安全保障 Rancher 管平面的高可用性和安全性，也可以通过 SSLO 服务编排组件将流量牵引到外部的 WAF 资源池，实现更好灵活性和扩展性。
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
  - 安装指南
  - 资料、参考和高级选项
  - F5 启动 WAF 功能
---

## 概述

F5 通过成熟健壮的负载均衡和应用安全保障 Rancher 管平面的高可用性和安全性，也可以通过 SSLO 服务编排组件将流量牵引到外部的 WAF 资源池，实现更好灵活性和扩展性。

## 内置 WAF 实现管理平面安全防护

### 先决条件

- 已经部署 F5 BIG-IP LTM，实现了 Rancher 管理平面的负载均衡。SSL 可以终结结在 F5 或原生的 Ingress Controller 上。随着内网安全的挑战不断增大，端到端的 SSL 连接越来越被企业接受，因此**首选的部署模式**还是终结在管理平面上。

- F5 设施上有 WAF 许可（ASM 或者 AWAF）。在这种条件下，可以直接启用 F5 设施上的 WAF 模块实现对管理平面的安全防护，提高安全性，简化了部署架构。

![架构图](/img/rancher/F5-WAF/F5-conditions.jpg)

### 配置实现

#### 启用 ASM（WAF）模块

在 `system > Resource Provisioning` 界面启用 `ASM` 模块，单击 `submit` 提交即可，如下图所示：
![启用 ASM（WAF）模块](/img/rancher/F5-WAF/start-asm-module.jpg)

#### 配置 WAF 策略

启用 ASM 之后，设备将出现 `security > Application Security` 界面，从界面新建 WAF 策略。

![启用 ASM（WAF）模块](/img/rancher/F5-WAF/create-waf-strategy.jpg)

策略模板可以使用快速部署（Rapid Deployment Policy），由于本文主要关注部署架构，关于安全策略的细节将不进行详细的描述。

![策略模板](/img/rancher/F5-WAF/waf-strategy-template.jpg)

#### 绑定到 LTM 虚拟服务器（Virtual Server）

安全策略的绑定可在建立策略是直接选择，也可在 LTM 的属性中直接关联。创建策略时选择虚拟服务器，如下：

![绑定到 LTM 虚拟服务器（Virtual Server）](/img/rancher/F5-WAF/virtual-server.jpg)

在虚拟服务器属性中关联：

![虚拟服务器（Virtual Server）关联安全策略](/img/rancher/F5-WAF/virtual-server-binding.jpg)

完成关联后，系统将自动创建策略将访问流量引导给 ASM 模块进行处理：

![访问流量引导给 ASM 模块](/img/rancher/F5-WAF/redirect-traffic.jpg)

#### 验证访问

使用浏览器访问集群管理平面，应该能见到 F5 ASM 插入的相关 cookie：

![相关cookie](/img/rancher/F5-WAF/assert-cookie.jpg)

ASM 的安全策略页开始学习访问流量：

![学习访问流量](/img/rancher/F5-WAF/learn-traffic.jpg)

## 外部 WAF 实现管理平面安全防护

### 概述

很多情况下，企业的安全设施会采用独立部署，通过一定的方式将流量牵引到安全设施进行相应的安全处理。流量牵引的方式很多，包含但不限于下面的方式：

| 部署方式     | 优点                                             | 缺点                       |
| :----------- | :----------------------------------------------- | :------------------------- |
| 负载均衡     | 扩展性强，探活机制完善                           | 缺乏全局视野               |
| 路由设施     | 成熟稳定                                         | 基于 IP 地址，无服务概念   |
| SDN 服务链   | 网络编排，全局视野                               | 投入大，成熟度、兼容性不够 |
| 网络服务编排 | 网络服务编排，动态服务链，扩展性强、探活机制完善 | 局部视野                   |

网络服务编排的方式虽然比较新，但由于融合了负载均衡和服务链的能力，接受度不断提升。这里我们介绍如何利用 F5 的 SSLO 网络服务编排模块将管理平面的访问牵引到外部 WAF 资源池，实现管理平面的安全防护。

采用这种部署模式的优势显而易见：

- 独立安全设施，专业分工：交付设施专注交付，安全设施专注安全，边界清晰。
- WAF 多活部署：改变传统部署下 WAF 主备模式，ROI 成倍提升。
- 弹性扩展，灰度升级：融合了负载均衡功能，WAF 可以池化扩展，设备可以灰度升级，流量可以灰度发布。
- 旁路部署，便于运维：结合 F5 完善的探活机制，可随时隔离故障设备，运维灵活。

![外部 WAF 架构](/img/rancher/F5-WAF/external.jpg)

### 前置条件

- 已经部署 F5 BIG-IP LTM 实现了 Rancher 管理平面的负载均衡。SSL 可以端结在 F5 上，也可以端结在原生的 Ingress Controller 上。

- F5 设备具备 SSLO 网络服务编排软件许可。

### 配置实现

#### 启用 SSLO 网络服务编排模块

首先启用 SSLO 网络服务编排功能。在 `F5 System > Resource Provisioning` 菜单下，打开 `SSL Orchestrator` 功能，单击 `Submit` 提交即可。

![启用 SSLO 网络服务编排功能](/img/rancher/F5-WAF/SSLO-module.jpg)

#### 配置网络编排策略

F5 的 SSLO 策略配置完全实现向导化，只需根据流程指引完成配置：

1. 选择部署拓扑。

   进入配置菜单 `SSL Orchestrator ›› Configuration`，选择部署拓扑 `“Existing Application”`，单击 `“Save & Next”`。

   ![部署拓扑](/img/rancher/F5-WAF/SSL-module-topology.jpg)

2. 配置网络服务

   进入 service 配置界面，选择 `“Generic Inline Layer 3”`，选择 `“Auto Manage Addresses”`，系统将给出相应的 IP 地址，VLAN 同样可以选择由系统新建。

   ![配置参数](/img/rancher/F5-WAF/SSLO-configuration-1.jpg)

   选择 `“Service Down Action”` 为 `“Ingore”`，失效自动屏蔽，添加 WAF 设备地址及其探活方式。
   ![配置参数2](/img/rancher/F5-WAF/SSLO-configuration-2.jpg)

   ![配置参数3](/img/rancher/F5-WAF/SSLO-configuration-3.jpg)
   保存，下一步进入服务链配置。

3. 配置服务链，将 步骤 2 中配置的 WAF 服务加入服务链即可。
   ![配置参数](/img/rancher/F5-WAF/service-chain.jpg)
4. 配置安全策略，编辑缺省的安全策略，添加服务链。单击保存，进入下一步。

   ![配置安全策略1](/img/rancher/F5-WAF/security-strategy-1.jpg)

   ![配置安全策略2](/img/rancher/F5-WAF/security-strategy-2.jpg)

5. 完成所有步骤后，提交部署。

   ![提交部署](/img/rancher/F5-WAF/submit-deployment.jpg)

#### 绑定到 LTM 虚拟服务器（Virtual Server）

打开菜单 `Local Traffic ›› Virtual Servers : Virtual Server List ›› vs-rancher-443` 在 `Access Policy` 中，`Access Profile` 选择 `“ssloDefault_accessProfile”`，`Per-Request Ploicy` 选择 `“ssloP_existing_app_per_req_policy”` 即可。

![绑定到 LTM 虚拟服务器](/img/rancher/F5-WAF/virtual-server-binding-1.png)

#### 验证访问

从管理客户端发起访问，观察客户端体验是否正常。观察 WAF 设备接收流量是否为明码的解密流量。

![绑定到 LTM 虚拟服务器](/img/rancher/F5-WAF/validate-access.png)
