---
title: 配置 Amazon NLB
description: 配置 Amazon NLB 是一个多阶段过程。我们将其细分为多个任务以便于理解。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - Rancher高可用Helm2安装
  - 配置基础设施
  - 配置 Amazon NLB
---

## 概述

配置 Amazon NLB 是一个多阶段过程。我们将其细分为四个子任务，以便于理解。

1. [创建目标群组](#创建目标群组)

   为 **TCP** 协议创建 TCP 端口 443 目标群组和 TCP 端口 80 目标群组（提供到 TCP 端口 443 的重定向）。

2. [注册目标](#注册目标)

   在目标群组中添加 Linux 节点。

3. [创建 NLB](#创建您的-nlb)

   使用亚马逊的向导创建网络负载均衡器。

4. [添加侦听器](#给-nlb-的-tcp-80-端口添加侦听器)

> **注意事项:** 当以端口 443 的`tcp`模式而非`tls`模式终止流量时，Rancher 仅支持使用 Amazon NLB。因为在 NLB 终止时，NLB 不会将正确的标头注入请求中。这意味着，如果希望使用由 Amazon 证书管理器(ACM)管理的证书时，应该使用 ELB 或 ALB。

## 创建目标群组

第一个 NLB 配置步骤是创建两个目标群组。理论上只需要端口 443 即可访问 Rancher，但为了提升易用性，通常会为端口 80 添加侦听器，该端口将自动重定向到端口 443。节点上的 NGINX ingress controller 将确保将端口 80 重定向到端口 443。

1. 登录 [亚马逊 AWS 控制台](https://console.aws.amazon.com/ec2/)，选择 **Region** ，创建您的 EC2 实例（Linux 主机）。

2. 选择 **服务 > EC2 > 负载均衡 > 目标群组**。单击 **创建目标群组** 创建 TCP 端口 443 和 TCP 端口 80 的目标组。

### TCP 端口 443

根据下表配置 TCP 端口 443 目标群组。

| 参数名                              | 参数值            |
| :---------------------------------- | :---------------- |
| Target Group Name                   | `rancher-tcp-443` |
| Protocol                            | `TCP`             |
| Port                                | `443`             |
| Target type                         | `instance`        |
| VPC                                 | 选择您的 VPC      |
| Protocol                            | `HTTP`            |
| Path                                | `/healthz`        |
| Port (Advanced health check)        | `override`,`80`   |
| Healthy threshold (Advanced health) | `3`               |
| Unhealthy threshold (Advanced)      | `3`               |
| Timeout (Advanced)                  | `6 seconds`       |
| Interval (Advanced)                 | `10 second`       |
| Success codes                       | `200-399`         |

<figcaption> 图 1： 目标群组 TCP 端口 443 设置 </figcaption>

![目标组 443](/img/rancher/ha/nlb/create-targetgroup-443.png)

<figcaption> 图 2：目标群组 TCP 端口 443 高级设置 </figcaption>

![目标组 443 高级](/img/rancher/ha/nlb/create-targetgroup-443-advanced.png)

### TCP 端口 80

根据下表配置 TCP 端口 80 目标群组。

| 参数名                              | 参数值           |
| :---------------------------------- | :--------------- |
| Target Group Name                   | `rancher-tcp-80` |
| Protocol                            | `TCP`            |
| Port                                | `80`             |
| Target type                         | `instance`       |
| VPC                                 | 选择您的 VPC     |
| Protocol                            | `HTTP`           |
| Path                                | `/healthz`       |
| Port (Advanced health check)        | `traffic port`   |
| Healthy threshold (Advanced health) | `3`              |
| Unhealthy threshold (Advanced)      | `3`              |
| Timeout (Advanced)                  | `6 seconds`      |
| Interval (Advanced)                 | `10 second`      |
| Success codes                       | `200-399`        |

<figcaption> 图 3：目标群组 TCP 端口 80 设置 </figcaption>

![目标群组 80](/img/rancher/ha/nlb/create-targetgroup-80.png)

<figcaption> 图 4：目标群组 TCP 端口 80 高级设置 </figcaption>

![目标群组 80 高级](/img/rancher/ha/nlb/create-targetgroup-80-advanced.png)

## 注册目标

完成创建后，请为目标群组添加 Linux 节点。

1. 选择 **rancher-tcp-443** 的目标群组，点击 **目标** 选项卡然后选择 **编辑**。

    <figcaption> 图 5： 编辑 TCP 端口 443 目标群组 </figcaption>

   ![编辑目标群组 443](/img/rancher/ha/nlb/edit-targetgroup-443.png)

2. 选择您想添加的实例（Linux 节点）, 点击 **添加到已注册**。

   <figcaption> 图 6：添加目标到 TCP 端口 443 目标群组</figcaption>

   ![添加目标到TCP端口443目标群组](/img/rancher/ha/nlb/add-targets-targetgroup-443.png)

   <figcaption> 图 7：完成添加</figcaption>

   ![向目标组TCP端口443添加了目标](/img/rancher/ha/nlb/added-targets-targetgroup-443.png)

3.单击屏幕右下角的`保存`，保存修改。

将 **rancher-tcp-443** 替换成 **rancher-tcp-80**，重复上述步骤，将相同的实例作为目标添加到该目标组。

## 创建 NLB

使用 Amazon EC2 创建网络负载均衡器，添加已创建的目标组。

1.  登录 [亚马逊 EC2 控制台](https://console.aws.amazon.com/ec2/)。

2.  选择 **负载均衡 > 负载均衡器**。

3.  单击 **创建负载均衡器**， 单击 **网络负载均衡器 > 创建**，进入负载均衡器参数配置页面。

4.  填写负载均衡器参数配置表。

    - **基本配置**

      - 名称: `rancher`
      - 模式: `内部` 或 `面向internet`

        模式由实例/VPC 的配置决定。如果您的实例没绑定公网 IP（如弹性公网 IP），或者您将仅在内部访问 Rancher，则应将 NLB 方案设置为`内部`，而不是`面向internet`。

    - **侦听器**

      添加如下的 **负载均衡器协议** 和 **负载均衡器端口**。

      - `TCP`: `443`

    - **可用区**

      - 选择您的 **VPC** 和 **可用区**。

5.  填写 **配置路由** 表。

    - 从 **目标组** 下拉列表中选择 **已经存在的目标组**。

    - 从 **名称** 下拉框中选择 `rancher-tcp-443`。

    - 打开 **高级健康检查设置**， 配置 **间隔** 为 `10 秒`。

6.  由于在前置步骤中已经注册了目标，因此只需单击 **下一步：审核**，进入审核页面。

7.  查看并检查负载均衡器的详细信息，确认无误后，单击**确认**，开始创建 NLB。

8.  完成创建 NLB 步骤后，单击 **关闭**。

## 添加 TCP 80 端口侦听器

1. 选择您刚创建的 NLB 然后单击 **侦听器** 选项卡。

2. 单击 **添加侦听器**。

3. 使用 `TCP`:`80` 作为 **协议端口**。

4. 单击 **添加操作** 并选择 **转发至...**。

5. 单击 **转发至** 下拉框, 选择 `rancher-tcp-80`。

6. 单击屏幕右上角的 **保存**，保存参数配置，完成侦听器添加。
