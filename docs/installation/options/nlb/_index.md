---
title: Setting up an Amazon ELB Network Load Balancer
weight: 277
aliases:
  - /rancher/v2.x/en/installation/ha/create-nodes-lb/nlb
  - /rancher/v2.x/en/installation/options/nlb
---

This how-to guide describes how to set up a Network Load Balancer (NLB) in Amazon's EC2 service that will direct traffic to multiple instances on EC2.

These examples show the load balancer being configured to direct traffic to three Rancher server nodes. If Rancher is installed on an RKE Kubernetes cluster, three nodes are required. If Rancher is installed on a K3s Kubernetes cluster, only two nodes are required.

> **Note:** Rancher only supports using the Amazon NLB when terminating traffic in `tcp` mode for port 443 rather than `tls` mode. This is due to the fact that the NLB does not inject the correct headers into requests when terminated at the NLB. This means that if you want to use certificates managed by the Amazon Certificate Manager (ACM), you should use an ALB.

Configuring an Amazon NLB is a multistage process:

1. [Create Target Groups](#1-create-target-groups)
2. [Register Targets](#2-register-targets)
3. [Create Your NLB](#3-create-your-nlb)
4. [Add listener to NLB for TCP port 80](#4-add-listener-to-nlb-for-tcp-port-80)

> **Prerequisite:** These instructions assume you have already created Linux instances in EC2. The load balancer will direct traffic to these two nodes.

# 1. Create Target Groups

Begin by creating two target groups for the **TCP** protocol, one with TCP port 443 and one regarding TCP port 80 (providing redirect to TCP port 443). You'll add your Linux nodes to these groups.

Your first NLB configuration step is to create two target groups. Technically, only port 443 is needed to access Rancher, but its convenient to add a listener for port 80 which will be redirected to port 443 automatically. The NGINX ingress controller on the nodes will make sure that port 80 gets redirected to port 443.

1. Log into the [Amazon AWS Console](https://console.aws.amazon.com/ec2/) to get started. Make sure to select the **Region** where your EC2 instances (Linux nodes) are created.
1. Select **Services** and choose **EC2**, find the section **Load Balancing** and open **Target Groups**.
1. Click **Create target group** to create the first target group, regarding TCP port 443.

### Target Group (TCP port 443)

Configure the first target group according to the table below. Screenshots of the configuration are shown just below the table.

| Option                              | Setting           |
| ----------------------------------- | ----------------- |
| Target Group Name                   | `rancher-tcp-443` |
| Protocol                            | `TCP`             |
| Port                                | `443`             |
| Target type                         | `instance`        |
| VPC                                 | Choose your VPC   |
| Protocol<br/>(Health Check)         | `HTTP`            |
| Path<br/>(Health Check)             | `/healthz`        |
| Port (Advanced health check)        | `override`,`80`   |
| Healthy threshold (Advanced health) | `3`               |
| Unhealthy threshold (Advanced)      | `3`               |
| Timeout (Advanced)                  | `6 seconds`       |
| Interval (Advanced)                 | `10 second`       |
| Success codes                       | `200-399`         |

Click **Create target group** to create the second target group, regarding TCP port 80.

### Target Group (TCP port 80)

Configure the second target group according to the table below. Screenshots of the configuration are shown just below the table.

| Option                              | Setting          |
| ----------------------------------- | ---------------- |
| Target Group Name                   | `rancher-tcp-80` |
| Protocol                            | `TCP`            |
| Port                                | `80`             |
| Target type                         | `instance`       |
| VPC                                 | Choose your VPC  |
| Protocol<br/>(Health Check)         | `HTTP`           |
| Path<br/>(Health Check)             | `/healthz`       |
| Port (Advanced health check)        | `traffic port`   |
| Healthy threshold (Advanced health) | `3`              |
| Unhealthy threshold (Advanced)      | `3`              |
| Timeout (Advanced)                  | `6 seconds`      |
| Interval (Advanced)                 | `10 second`      |
| Success codes                       | `200-399`        |

# 2. Register Targets

Next, add your Linux nodes to both target groups.

Select the target group named **rancher-tcp-443**, click the tab **Targets** and choose **Edit**.

{{< img "/img/rancher/ha/nlb/edit-targetgroup-443.png" "Edit target group 443">}}

Select the instances (Linux nodes) you want to add, and click **Add to registered**.

<hr/>
**Screenshot Add targets to target group TCP port 443**<br/>

{{< img "/img/rancher/ha/nlb/add-targets-targetgroup-443.png" "Add targets to target group 443">}}

<hr/>
**Screenshot Added targets to target group TCP port 443**<br/>

{{< img "/img/rancher/ha/nlb/added-targets-targetgroup-443.png" "Added targets to target group 443">}}

When the instances are added, click **Save** on the bottom right of the screen.

Repeat those steps, replacing **rancher-tcp-443** with **rancher-tcp-80**. The same instances need to be added as targets to this target group.

# 3. Create Your NLB

Use Amazon's Wizard to create an Network Load Balancer. As part of this process, you'll add the target groups you created in **1. Create Target Groups**.

Use Amazon's Wizard to create an Network Load Balancer. As part of this process, you'll add the target groups you created in [Create Target Groups](#create-target-groups).

1.  From your web browser, navigate to the [Amazon EC2 Console](https://console.aws.amazon.com/ec2/).

2.  From the navigation pane, choose **LOAD BALANCING** > **Load Balancers**.

3.  Click **Create Load Balancer**.

4.  Choose **Network Load Balancer** and click **Create**. Then complete each form.

- [Step 1: Configure Load Balancer](#step-1-configure-load-balancer)
- [Step 2: Configure Routing](#step-2-configure-routing)
- [Step 3: Register Targets](#step-3-register-targets)
- [Step 4: Review](#step-4-review)

### Step 1: Configure Load Balancer

Set the following fields in the form:

- **Name:** `rancher`
- **Scheme:** `internal` or `internet-facing`. The scheme that you choose for your NLB is dependent on the configuration of your instances and VPC. If your instances do not have public IPs associated with them, or you will only be accessing Rancher internally, you should set your NLB Scheme to `internal` rather than `internet-facing`.
- **Listeners:** The Load Balancer Protocol should be `TCP` and the corresponding Load Balancer Port should be set to `443`.
- **Availability Zones:** Select Your **VPC** and **Availability Zones**.

### Step 2: Configure Routing

1. From the **Target Group** drop-down, choose **Existing target group**.
1. From the **Name** drop-down, choose `rancher-tcp-443`.
1. Open **Advanced health check settings**, and configure **Interval** to `10 seconds`.

### Step 3: Register Targets

Since you registered your targets earlier, all you have to do is click **Next: Review**.

### Step 4: Review

Look over the load balancer details and click **Create** when you're satisfied.

After AWS creates the NLB, click **Close**.

# 4. Add listener to NLB for TCP port 80

1. Select your newly created NLB and select the **Listeners** tab.

2. Click **Add listener**.

3. Use `TCP`:`80` as **Protocol** : **Port**

4. Click **Add action** and choose **Forward to...**

5. From the **Forward to** drop-down, choose `rancher-tcp-80`.

6. Click **Save** in the top right of the screen.

本操作指南介绍了如何在 Amazon EC2 服务中设置负载均衡器，该负载均衡器会将流量定向到 EC2 上的多个实例。

> **注意：** Rancher 仅支持使用 Amazon NLB 以 tcp 模式终止 443 端口流量而不是以 tls 模式。这是由于以下原因：当终止 NLB 时，NLB 不会将正确的 headers 注入请求中。这意味着，如果您要使用由 Amazon Certificate Manager（ACM）管理的证书，则应使用 ALB。

配置 Amazon NLB 分多个阶段：

1. [创建目标组](#1-创建目标组)
2. [注册目标](#2-注册目标)
3. [创建您的 NLB](#3-创建-nlb)
4. [将侦听器添加到 NLB 的 TCP 80 端口](#4-为-tcp-端口-80-向-nlb-添加侦听器)

> **先决条件：** 这些说明假设您已经在 EC2 中创建了 Linux 实例。负载均衡器会将流量定向到这三个节点。

## 1. 创建目标组

首先为**TCP**协议创建两个目标组，一个使用 TCP 端口 443，另一个使用 TCP 端口 80（将被重定向到 443 端口），然后将 Linux 节点添加到这些组中。

第一个 NLB 配置步骤是创建两个目标组。从技术上讲，访问 Rancher 只需要端口 443，但是为了方便使用，我们可以给 80 端口也添加一个侦听器，它将被自动重定向到端口 443。节点上的 NGINX ingress 控制器将确保端口 80 被重定向到端口 443。

1. 登录到[Amazon AWS 控制台](https://console.aws.amazon.com/ec2/)。请选择创建了 EC2 实例（Linux 节点）的**区域**。
2. 选择**服务**，然后选择**EC2**，找到**负载均衡**并打开**目标群组**。
3. 单击**创建目标组**创建有关 TCP 端口 443 的第一个目标组。

#### 目标组（TCP 端口 443）

根据下表配置第一个目标组，该配置的屏幕截图显示在表格正下方。

| 选项                            | 设置              |
| ------------------------------- | ----------------- |
| 目标组名称                      | `rancher-tcp-443` |
| 协议                            | `TCP`             |
| 端口                            | `443`             |
| 目标类型                        | `实例`            |
| VPC                             | 选择您的 VPC      |
| 协议<br/>(健康检查)             | `HTTP`            |
| 路径<br/>(健康检查)             | `/healthz`        |
| 端口 (高级运行状况检查设置)     | `覆盖`,`80`       |
| 正常阈值 (高级运行状况检查设置) | `3`               |
| 不正常阈值 (高级)               | `3`               |
| 超时 (高级)                     | `6 秒`            |
| 间隔 (高级)                     | `10 秒`           |
| 成功代码                        | `200-399`         |

单击**创建目标组**创建有关 TCP 端口 80 的第二个目标组。

#### 目标组（TCP 端口 80）

根据下表配置第二个目标组，该配置的屏幕截图显示在表格正下方。

| 选项                            | 设置             |
| ------------------------------- | ---------------- |
| 目标组名称                      | `rancher-tcp-80` |
| 协议                            | `TCP`            |
| 端口                            | `80`             |
| 目标类型                        | `实例`           |
| VPC                             | 选择您的 VPC     |
| 协议<br/>(健康检查)             | `HTTP`           |
| 路径<br/>(健康检查)             | `/healthz`       |
| 端口 (高级运行状况检查设置)     | `流量端口`       |
| 正常阈值 (高级运行状况检查设置) | `3`              |
| 不正常阈值 (高级)               | `3`              |
| 超时 (高级)                     | `6 秒`           |
| 间隔 (高级)                     | `10 秒`          |
| 成功代码                        | `200-399`        |

## 2. 注册目标

接下来，将 Linux 节点添加到两个目标组中。

选择名为**rancher-tcp-443**的目标组，单击**目标**选项卡，然后选择**编辑**。

![Edit target group 443](/img/rancher/ha/nlb/edit-targetgroup-443.png)

选择要添加的实例（Linux 节点），然后单击**添加到已注册**。

<hr />

**将目标添加到目标组 TCP 端口 443**

<br/>

![Add targets to target group 443](/img/rancher/ha/nlb/add-targets-targetgroup-443.png)

<hr />

**已将目标添加到目标组 TCP 端口 443**

<br/>

![Added targets to target group 443](/img/rancher/ha/nlb/added-targets-targetgroup-443.png)

添加实例后，单击右下方的**保存**。

重复这些步骤，将**rancher-tcp-443**替换为**rancher-tcp-80**。需要将相同的实例作为目标添加到该目标组。

## 3. 创建 NLB

使用 Amazon 的向导创建网络负载均衡器。您将添加在**1. 创建目标组**中创建的目标组。

使用 Amazon 的向导创建网络负载均衡器。您将添加在[创建目标组](#1-创建目标组)中创建的目标组。

1. 在您的 Web 浏览器中，导航到[Amazon EC2 控制台](https://console.aws.amazon.com/ec2/)。

2. 在导航中，选择**负载均衡** > **负载均衡器**。

3. 点击**创建负载均衡器**。

4. 选择**网络负载均衡器**，然后单击**创建**。然后填写每个表单。

- [步骤 1：配置负载均衡器](#步骤-1-配置负载均衡器)
- [步骤 2：配置路由](#步骤-2-配置路由)
- [步骤 3：注册目标](#步骤-3-注册目标)
- [步骤 4：审核](#步骤-4-审核)

#### 步骤 1: 配置负载均衡器

在表单中设置以下字段：

- **名称:** `rancher`
- **模式:** `内部` 或 `面向 internet`。您为 NLB 选择的方案取决于实例和 VPC 的配置。如果您的实例没有关联的公共 IP，或者只在内部访问 Rancher，则应该将 NLB 方案设置为`内部`而不是`面向 internet`。
- **侦听器:** 负载均衡器协议应为`TCP`，并且相应的负载均衡器端口应设置为`443`。
- **可用区:** 选择您的**VPC**和**可用区**。

#### 步骤 2: 配置路由

1. 从**目标组**下拉列表中，选择**已存在的目标组**。
2. 从**名称**下拉列表中，选择`rancher-tcp-443`。
3. 打开**高级运行状况检查设置**，并将时间间隔配置为`10 秒`。

#### 步骤 3: 注册目标

由于已经注册了目标，因此您所要做的就是单击**下一步: 审核**。

#### 步骤 4: 审核

查看负载均衡器的详细信息，并在满意时单击**创建**。

AWS 创建 NLB 后，单击**关闭**。

## 4. 为 TCP 端口 80 向 NLB 添加侦听器

1. 选择新创建的 NLB，然后选择**侦听器** 选项卡。

2. 点击 **添加侦听器**.

3. 使用`TCP`:`80`作为**协议** : **端口**

4. 点击**添加操作**，然后选择**转发至...**

5. 从**转发至**下拉列表中，选择`rancher-tcp-80`。

6. 点击屏幕右上方的**保存**。
