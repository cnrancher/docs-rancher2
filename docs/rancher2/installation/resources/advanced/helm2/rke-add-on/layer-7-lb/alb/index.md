---
title: 配置 Amazon ALB
description: 配置 Amazon ALB 是一个多阶段过程。我们将其分解为多个任务，因此更易于理解。
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
  - RKE Add-on 安装
  - Rancher 高可用 7层LB
  - 配置 Amazon ALB
---

:::important 重要提示
RKE add-on 安装仅支持 Rancher v2.0.8 之前的版本。
请使用 Rancher helm chart 将 Rancher 安装在 Kubernetes 集群上。有关详细信息，请参见[Rancher 高可用安装](/docs/rancher2/installation/install-rancher-on-k8s/)。
如果您当前正在使用 RKE add-on 安装方法，参见[将 RKE add-on 安装的 Rancher 迁移到 Helm 安装](/docs/rancher2/installation/install-rancher-on-k8s/upgrades/migrating-from-rke-add-on/)，获取有关如何使用 Helm chart 的详细信息。
:::

## 目标

配置 Amazon ALB 是一个多阶段过程。我们将其分解为多个任务，因此更易于理解。

1. 创建目标组

   首先为 http 协议创建一个目标组。您将 Linux 节点添加到该组中。

2. 注册目标

   将 Linux 节点添加到目标组。

3. 创建您的 ALB

   使用 Amazon 的 Wizard 创建应用程序负载均衡器。作为此过程的一部分，您将添加在**1. 创建目标组**中创建的目标组。

## 创建目标组

您的第一个 ALB 配置步骤是为 HTTP 创建一个目标组。

登录到[Amazon AWS Console](https://console.aws.amazon.com/ec2/)控制台开始使用。

以下文档将指导您完成此过程。使用下表中的数据来完成该过程。

[Amazon 文档：创建目标组](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-target-group.html)

### 目标组 (HTTP)

| 选项           | 设置              |
| :------------- | :---------------- |
| 目标组名称     | `rancher-http-80` |
| 协议           | `HTTP`            |
| 端口           | `80`              |
| 目标类型       | `instance`        |
| VPC            | 选择您的 VPC      |
| 协议(健康检查) | `HTTP`            |
| 路径(健康检查) | `/healthz`        |

## 注册目标

接下来，将 Linux 节点添加到目标组。

[Amazon 文档：向您的目标组注册目标](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-register-targets.html)

### 创建您的 ALB

使用 Amazon 的 Wizard 创建应用程序负载均衡器。作为此过程的一部分，您将添加在“创建目标组”中创建的目标组。

1.  在您的 Web 浏览器中，访问[Amazon EC2 Console](https://console.aws.amazon.com/ec2/)。

2.  在页面窗口中, 选择 **LOAD BALANCING** > **负载均衡器**.

3.  单击 **创建负载均衡器**.

4.  选择 **应用程序负载均衡器**.

5.  完成 **步骤 1：配置负载均衡器** 表单。

    - **基本配置**

      - 名称: `rancher-http`
      - 模式: `面向 internet`
      - IP 地址类型: `ipv4`

    - **侦听器**

          	在下面添加 **负载均衡器协议** 和 **负载均衡器端口** 。
          	- `HTTP`: `80`
          	- `HTTPS`: `443`

    - **可用区**

      - 选择您的 **VPC** 和 **可用区**。

6.  完成 **步骤 2：配置安全设置** 表单。

    配置要用于 SSL termination 的证书。

7.  完成 **步骤 3：配置安全组** 表单。

8.  完成 **步骤 4：配置路由** 表单。

    - 从 **目标组** 下拉列表中，选择 **现有目标组**。

    - 添加目标组 `rancher-http-80`.

9.  完成 **步骤 5：注册目标**。由于您早先注册了目标，因此您只需单击 **下一步: 审核**。

10. 完成 **步骤 6：检查**。查看负载均衡器的详细信息，并在满意时单击 **创建**。

11. AWS 创建 ALB 之后，单击 **关闭**。
