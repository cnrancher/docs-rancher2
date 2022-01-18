---
title: 设置 Amazon NLB 网络负载均衡器
weight: 5
---

本文介绍了如何在 Amazon EC2 服务中设置 Amazon NLB 网络负载均衡器，用于将流量转发到 EC2 上的多个实例中。

这些示例中，负载均衡器将流量转发到三个 Rancher Server 节点。如果 Rancher 安装在 RKE Kubernetes 集群上，则需要三个节点。如果 Rancher 安装在 K3s Kubernetes 集群上，则只需要两个节点。

本文介绍的只是配置负载均衡器的其中一种方式。其他负载均衡器如传统负载路由器（Classic Load Balancer）和应用负载路由器（Application Load Balancer），也可以将流量转发到 Rancher Server 节点。

Rancher 仅支持使用 Amazon NLB 以 `TCP` 模式终止 443 端口的流量，而不支持 `TLS` 模式。这试因为在 NLB 终止时，NLB 不会将正确的标头注入请求中。如果你想使用由 Amazon Certificate Manager (ACM) 托管的证书，请使用 ALB。

# 设置负载均衡器

以下是配置 Amazon NLB 的步骤：

1. [创建目标组](#1-create-target-groups)
2. [注册目标](#2-register-targets)
3. [创建 NLB](#3-create-your-nlb)
4. [为 TCP 端口 80 向 NLB 添加监听器](#4-add-listener-to-nlb-for-tcp-port-80)

# 要求

你已在 EC2 中创建了 Linux 实例。此外，负载均衡器会把流量转发到这些节点。

# 1. 创建目标组

首先，为 **TCP** 协议创建两个目标组，其中一个使用 TCP 端口 443，另一个使用 TCP 端口 80（用于重定向到 TCP 端口 443）。然后，将 Linux 节点添加到这些组中。

配置 NLB 的第一个步骤是创建两个目标组。一般来说，只需要端口 443 就可以访问 Rancher。但是，由于端口 80 的流量会被自动重定向到端口 443，因此，你也可以为端口 80 也添加一个监听器。

不管使用的是 NGINX Ingress 还是 Traefik Ingress Controller，Ingress 都应该将端口 80 的流量重定向到端口 443。以下为操作步骤：

1. 登录到 [Amazon AWS 控制台](https://console.aws.amazon.com/ec2/)。确保选择的**地域**是你创建 EC2 实例 （Linux 节点）的地域。
1. 选择**服务** >  **EC2**，找到**负载均衡器**并打开**目标组**。
1. 单击**创建目标组**，然后创建用于 TCP 端口 443 的第一个目标组。

> :::note 注意
> 不同 Ingress 的健康检查处理方法不同。详情请参见[此部分](#health-check-paths-for-nginx-ingress-and-traefik-ingresses)。

### 目标组（TCP 端口 443）

根据下表配置第一个目标组：

| 选项 | 设置 |
|-------------------|-------------------|
| 目标组名称 | `rancher-tcp-443` |
| 目标类型 | `instance` |
| 协议 | `TCP` |
| 端口 | `443` |
| VPC | 选择 VPC |

健康检查设置：

| 选项 | 设置 |
|---------------------|-----------------|
| 协议 | TCP |
| 端口 | `override`,`80` |
| 健康阈值 | `3` |
| 不正常阈值 | `3` |
| 超时 | `6 秒` |
| 间隔 | `10 秒` |

单击**创建目标组**，然后创建用于 TCP 端口 80 的第二个目标组。

### 目标组（TCP 端口 80）

根据下表配置第二个目标组：

| 选项 | 设置 |
|-------------------|------------------|
| 目标组名称 | `rancher-tcp-80` |
| 目标类型 | `instance` |
| 协议 | `TCP` |
| 端口 | `80` |
| VPC | 选择 VPC |


健康检查设置：

| 选项 | 设置 |
|---------------------|----------------|
| 协议 | TCP |
| 端口 | `traffic port` |
| 健康阈值 | `3` |
| 不正常阈值 | `3` |
| 超时 | `6 秒` |
| 间隔 | `10 秒` |

# 2. 注册目标

接下来，将 Linux 节点添加到两个目标组中。

选择名为 **rancher-tcp-443** 的目标组，点击**目标**页签并选择**编辑**。

{{< img "/img/rancher/ha/nlb/edit-targetgroup-443.png" "Edit target group 443">}}

选择你要添加的实例（Linux 节点），然后单击**添加到已注册**。

<hr>
**将目标添加到目标组 TCP 端口 443**<br/>

{{< img "/img/rancher/ha/nlb/add-targets-targetgroup-443.png" "Add targets to target group 443">}}

<hr>
**已将目标添加到目标组 TCP 端口 443**<br/>

{{< img "/img/rancher/ha/nlb/added-targets-targetgroup-443.png" "Added targets to target group 443">}}

添加实例后，单击右下方的**保存**。

将 **rancher-tcp-443** 替换为 **rancher-tcp-80**，然后重复上述步骤。你需要将相同的实例作为目标添加到此目标组。

# 3. 创建 NLB

使用 Amazon 的向导创建网络负载均衡器。在这个过程中，你需要添加在 [1. 创建目标组](#1-create-target-groups)中创建的目标组。

1. 在网页浏览器中，导航到 [Amazon EC2 控制台](https://console.aws.amazon.com/ec2/)。

2. 在导航栏中，选择**负载均衡** > **负载均衡器**。

3. 单击**创建负载均衡器**。

4. 选择**网络负载均衡器**并单击**创建**。然后，填写每个表格。

- [步骤 1：配置负载均衡器](#step-1-configure-load-balancer)
- [步骤 2：配置路由](#step-2-configure-routing)
- [步骤 3：注册目标](#step-3-register-targets)
- [步骤 4：审核](#step-4-review)

### 步骤 1：配置负载均衡器

在表单中设置以下字段：

- **名称**：`rancher`
- **Scheme**：`internal` 或 `internet-facing`。实例和 VPC 的配置决定了 NLB 的 Scheme。如果你的实例没有绑定公共 IP，或者你只需要通过内网访问Rancher，请将 NLB 的 Scheme 设置为 `internal` 而不是 `internet-facing`。
- **监听器**：负载均衡器协议需要是 `TCP`，而且负载均衡器端口需要设为 `443`。
- **可用区：**选择你的**VPC**和**可用区**。

### 步骤 2：配置路由

1. 从**目标组**下拉列表中，选择 **现有目标组**。
1. 从**名称**下拉列表中，选择 `rancher-tcp-443`。
1. 打开**高级健康检查设置**，并将**间隔**设为 `10 秒`。

### 步骤 3：注册目标

由于你已经在先前步骤注册了目标，因此你只需单击 **下一步：审核**。

### 步骤 4：审核

检查负载均衡器信息无误后，单击**创建**。

AWS 完成 NLB 创建后，单击**关闭**。

# 4. 为 TCP 端口 80 向 NLB 添加监听器

1. 选择新创建的 NLB 并选择**监听器**页签。

2. 单击**添加监听器**。

3. 使用 `TCP`:`80` 作为**协议**:**端口**。

4. 单击**添加操作**并选择**转发到..**。

5. 从**转发到**下拉列表中，选择 `rancher-tcp-80`。

6. 单击右上角的**保存**。

# NGINX Ingress 和 Traefik Ingress 的健康检查路径

K3s 和 RKE Kubernetes 集群使用的默认 Ingress 不同，因此对应的健康检查方式也不同。

RKE Kubernetes 集群默认使用 NGINX Ingress，而 K3s Kubernetes 集群默认使用 Traefik Ingress。

- **Traefik**：默认健康检查路径是 `/ping`。默认情况下，不管主机如何，`/ping` 总是匹配，而且 [Traefik 自身](https://docs.traefik.io/operations/ping/)总会响应。
- **NGINX Ingress**：NGINX Ingress Controller 的默认后端有一个 `/healthz` 端点。默认情况下，不管主机如何，`/healthz` 总是匹配，而且 [`ingress-nginx` 自身](https://github.com/kubernetes/ingress-nginx/blob/0cbe783f43a9313c9c26136e888324b1ee91a72f/charts/ingress-nginx/values.yaml#L212)总会响应。

想要精确模拟健康检查，最好是使用 Host 标头（Rancher hostname）加上 `/ping` 或 `/healthz`（分别对应 K3s 和 RKE 集群）来获取 Rancher Pod 的响应，而不是 Ingress 的响应。
