---
title: 配置 Amazon NLB
description: 本操作指南介绍了如何在 Amazon EC2 服务中设置 Amazon NLB 负载均衡器，该负载均衡器会将流量定向到 EC2 上的多个实例。在这些示例中，负载均衡器将被配置为将流量定向到三个 Rancher Server 节点。如果将 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果将 Rancher 安装在 K3s Kubernetes 集群上，则仅需要两个节点Rancher 仅支持使用 Amazon NLB 以 tcp 模式终止 443 端口流量而不是以 tls 模式。这是由于以下原因：当终止 NLB 时，NLB 不会将正确的 headers 注入请求中。这意味着，如果您要使用由 Amazon Certificate Manager（ACM）管理的证书，则应使用 ALB。
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
  - 配置 Amazon NLB
---

## 概述

本操作指南介绍了如何在 Amazon EC2 服务中设置 Amazon NLB 负载均衡器，该负载均衡器会将流量定向到 EC2 上的多个实例。

在这些示例中，负载均衡器将被配置为将流量定向到三个 Rancher Server 节点。如果将 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果将 Rancher 安装在 K3s Kubernetes 集群上，则仅需要两个节点。

Amazon NLB 负载均衡器只是实现负载均衡的其中一种方式。其他种类的负载均衡器如传统负载路由器（Classic Load Balancer）和应用负载路由器（Application Load Balancer），也可以将流量转发到 Rancher 的 server 节点。

Rancher 仅支持使用 Amazon NLB 以 **tcp** 模式终止 443 端口流量。因为终止 NLB 时，NLB 不会将正确的 headers 注入请求中。如果您要使用由 Amazon Certificate Manager（ACM）管理的证书，则应使用 ALB。

配置 Amazon NLB 分多个阶段：

1. [创建目标组](#创建目标组)
2. [注册目标](#注册目标)
3. [创建您的 NLB](#创建-nlb)
4. [将侦听器添加到 NLB 的 TCP 80 端口](#为-tcp-端口-80-向-nlb-添加侦听器)

> **先决条件：** 我们默认您已经在 EC2 中创建了 Linux 实例，负载均衡器会将流量定向到这三个节点。

## 创建目标组

首先为**TCP**协议创建两个目标组，一个使用 TCP 端口 443，另一个使用 TCP 端口 80（将被重定向到 443 端口），然后将 Linux 节点添加到这些组中。

第一个 NLB 配置步骤是创建两个目标组。访问 Rancher 原则上只需要用到端口 443，但是为了方便使用，我们可以给 80 端口也添加一个侦听器，它将被自动重定向到端口 443。节点上的 NGINX ingress 控制器将确保端口 80 被重定向到端口 443。

不管您使用的是 NGINX Ingress，还是 Traefik Ingress controller，Ingress 都应该将流量从 80 端口转发到 443 端口。

1. 登录到[Amazon AWS 控制台](https://console.aws.amazon.com/ec2/)。请选择创建了 EC2 实例（Linux 节点）的**区域**。
2. 选择**服务**，然后选择**EC2**，找到**负载均衡**并打开**目标群组**。
3. 单击**创建目标组**创建有关 TCP 端口 443 的第一个目标组。

> **说明**：不同的 Ingress 使用的健康检查不一样，详情请参考[NGINX Ingress 和 Traefik Ingress 的健康检查路径](#NGINX-Ingress-和-Traefik-Ingress-的健康检查路径)。

#### 目标组（TCP 端口 443）

单击**创建目标组**，根据下表的选项和设置，配置 TCP 端口 443 的目标组。

| 选项       | 设置              |
| :--------- | :---------------- |
| 目标组名称 | `rancher-tcp-443` |
| 协议       | `TCP`             |
| 端口       | `443`             |
| 目标类型   | `实例`            |
| VPC        | 选择您的 VPC      |

健康检查配置参数:

| 选项                            | 设置    |
| :------------------------------ | :------ |
| 协议                            | `TCP`   |
| 端口                            | `443`   |
| 正常阈值 (高级运行状况检查设置) | `3`     |
| 不正常阈值 (高级)               | `3`     |
| 超时 (高级)                     | `6 秒`  |
| 间隔 (高级)                     | `10 秒` |

#### 目标组（TCP 端口 80）

单击**创建目标组**创建，根据下表的选项和设置，配置 TCP 端口 80 的目标组。

| 选项       | 设置             |
| :--------- | :--------------- |
| 目标组名称 | `rancher-tcp-80` |
| 协议       | `TCP`            |
| 端口       | `80`             |
| 目标类型   | `实例`           |
| VPC        | 选择您的 VPC     |

健康检查配置参数:

| 选项                            | 设置    |
| :------------------------------ | :------ |
| 协议                            | `TCP`   |
| 端口                            | `443`   |
| 正常阈值 (高级运行状况检查设置) | `3`     |
| 不正常阈值 (高级)               | `3`     |
| 超时 (高级)                     | `6 秒`  |
| 间隔 (高级)                     | `10 秒` |

## 注册目标

接下来，将 Linux 节点添加到两个目标组中。

选择名为**rancher-tcp-443**的目标组，单击**目标**选项卡，然后选择**编辑**。

![Edit target group 443](/img/rancher/ha/nlb/edit-targetgroup-443.png)

选择要添加的实例（Linux 节点），然后单击**添加到已注册**。

<hr />

**将目标添加到目标组 TCP 端口 443**

![Add targets to target group 443](/img/rancher/ha/nlb/add-targets-targetgroup-443.png)

<hr />

**已将目标添加到目标组 TCP 端口 443**

![Added targets to target group 443](/img/rancher/ha/nlb/added-targets-targetgroup-443.png)

添加实例后，单击右下方的**保存**。

重复上述步骤，将**rancher-tcp-443**替换为**rancher-tcp-80**，将 Linux 节点添加到 rancher-tcp-80 目标组中。

## 创建 NLB

使用 Amazon 的向导创建网络负载均衡器。您将添加在[创建目标组](#1-创建目标组)中创建的目标组。

1. 在您的 Web 浏览器中，导航到[Amazon EC2 控制台](https://console.aws.amazon.com/ec2/)。

2. 在导航中，选择**负载均衡** > **负载均衡器**。

3. 单击**创建负载均衡器**，选择负载均衡器种类。

4. 选择**网络负载均衡器**，然后单击**创建**。然后填写每个表单。

- [步骤 1：配置负载均衡器](#步骤-1-配置负载均衡器)
- [步骤 2：配置路由](#步骤-2-配置路由)
- [步骤 3：注册目标](#步骤-3-注册目标)
- [步骤 4：审核](#步骤-4-审核)

### 配置负载均衡器

在表单中设置以下字段：

- **名称:** `rancher`
- **模式:** `内部` 或 `面向 internet`。您为 NLB 选择的方案取决于实例和 VPC 的配置。如果您的实例没有绑定的公网 IP，或者您希望通过内网访问 Rancher，则应该将 NLB 方案设置为`内部`，而不是`面向 internet`。
- **侦听器:** 负载均衡器协议应为`TCP`，并且相应的负载均衡器端口应设置为`443`。
- **可用区:** 选择您的**VPC**和**可用区**。

### 步骤 2: 配置路由

1. 从**目标组**下拉列表中，选择**已存在的目标组**。
2. 从**名称**下拉列表中，选择`rancher-tcp-443`。
3. 打开**高级运行状况检查设置**，并将时间间隔配置为`10 秒`。

### 步骤 3: 注册目标

由于您已经在先前的步骤中注册了目标，您在这个页面只需单击**下一步: 审核**。

### 步骤 4: 审核

查看负载均衡器的详细信息，确认信息填写无误后，单击**创建**。

AWS 创建 NLB 后，单击**关闭**。

## 为 TCP 端口 80 向 NLB 添加侦听器

1. 选择新创建的 NLB，然后选择**侦听器** 选项卡。

2. 单击 **添加侦听器**，配置侦听器参数。

3. 使用`TCP`:`80`作为**协议** : **端口**

4. 单击**添加操作**，选择**转发至...**

5. 从**转发至**下拉列表中，选择`rancher-tcp-80`。

6. 单击屏幕右上方的**保存**，保存上述参数设置。

## NGINX Ingress 和 Traefik Ingress 的健康检查路径

因为 K3s 和 RKE 集群使用的 Ingress 不同，RKE 集群默认使用的是 NGINX Ingress，K3s 默认使用的是 Traefik，所以它们处理路由健康检查的方式不一样。

- **Traefik：** 健康检查路径是 `/ping`。默认的健康检查路径是`/ping`。[Traefik 自身](https://docs.traefik.io/operations/ping/)会响应该请求。

* **NGINX Ingress：** NGINX Ingress 的默认后端有一个`/healthz`端点。默认的健康检查路径是`/healthz`。[NGINX 自身](https://github.com/kubernetes/ingress-nginx/blob/0cbe783f43a9313c9c26136e888324b1ee91a72f/charts/ingress-nginx/values.yaml#L212)会响应该请求。

模拟一个准确的健康检查的最好方式是，使用主机 header（Rancher hostname）加上`/ping`或 `/healthz`，得到 Rancher Pods 的相应消息而不是 Ingress 的响应消息。
