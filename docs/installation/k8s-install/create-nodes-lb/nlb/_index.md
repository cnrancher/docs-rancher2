---
title: Setting up an Amazon NLB Load Balancer
---

This how-to guide describes how to set up a load balancer in Amazon's EC2 service that will direct traffic to multiple instances on EC2.

> **Note:** Rancher only supports using the Amazon NLB when terminating traffic in `tcp` mode for port 443 rather than `tls` mode. This is due to the fact that the NLB does not inject the correct headers into requests when terminated at the NLB. This means that if you want to use certificates managed by the Amazon Certificate Manager (ACM), you should use an ELB or ALB.

Configuring an Amazon NLB is a multistage process:

1. [Create Target Groups](#1-create-target-groups)
2. [Register Targets](#2-register-targets)
3. [Create Your NLB](#3-create-your-nlb)
4. [Add listener to NLB for TCP port 80](#4-add-listener-to-nlb-for-tcp-port-80)

> **Prerequisite:** These instructions assume you have already created Linux instances in EC2. The load balancer will direct traffic to these two nodes.

## 1. Create Target Groups

Begin by creating two target groups for the **TCP** protocol, one with TCP port 443 and one regarding TCP port 80 (providing redirect to TCP port 443). You'll add your Linux nodes to these groups.

Your first NLB configuration step is to create two target groups. Technically, only port 443 is needed to access Rancher, but its convenient to add a listener for port 80 which will be redirected to port 443 automatically. The NGINX ingress controller on the nodes will make sure that port 80 gets redirected to port 443.

1. Log into the [Amazon AWS Console](https://console.aws.amazon.com/ec2/) to get started. Make sure to select the **Region** where your EC2 instances (Linux nodes) are created.
1. Select **Services** and choose **EC2**, find the section **Load Balancing** and open **Target Groups**.
1. Click **Create target group** to create the first target group, regarding TCP port 443.

#### Target Group (TCP port 443)

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

#### Target Group (TCP port 80)

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

## 2. Register Targets

Next, add your Linux nodes to both target groups.

Select the target group named **rancher-tcp-443**, click the tab **Targets** and choose **Edit**.

![Edit target group 443](/img/rancher/ha/nlb/edit-targetgroup-443.png)

Select the instances (Linux nodes) you want to add, and click **Add to registered**.

<hr />
**Screenshot Add targets to target group TCP port 443**<br/>

![Add targets to target group 443](/img/rancher/ha/nlb/add-targets-targetgroup-443.png)

<hr />
**Screenshot Added targets to target group TCP port 443**<br/>

![Added targets to target group 443](/img/rancher/ha/nlb/added-targets-targetgroup-443.png)

When the instances are added, click **Save** on the bottom right of the screen.

Repeat those steps, replacing **rancher-tcp-443** with **rancher-tcp-80**. The same instances need to be added as targets to this target group.

## 3. Create Your NLB

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

#### Step 1: Configure Load Balancer

Set the following fields in the form:

- **Name:** `rancher`
- **Scheme:** `internal` or `internet-facing`. The scheme that you choose for your NLB is dependent on the configuration of your instances and VPC. If your instances do not have public IPs associated with them, or you will only be accessing Rancher internally, you should set your NLB Scheme to `internal` rather than `internet-facing`.
- **Listeners:** The Load Balancer Protocol should be `TCP` and the corresponding Load Balancer Port should be set to `443`.
- **Availability Zones:** Select Your **VPC** and **Availability Zones**.

#### Step 2: Configure Routing

1. From the **Target Group** drop-down, choose **Existing target group**.
1. From the **Name** drop-down, choose `rancher-tcp-443`.
1. Open **Advanced health check settings**, and configure **Interval** to `10 seconds`.

#### Step 3: Register Targets

Since you registered your targets earlier, all you have to do is click **Next: Review**.

#### Step 4: Review

Look over the load balancer details and click **Create** when you're satisfied.

After AWS creates the NLB, click **Close**.

## 4. Add listener to NLB for TCP port 80

1. Select your newly created NLB and select the **Listeners** tab.

2. Click **Add listener**.

3. Use `TCP`:`80` as **Protocol** : **Port**

4. Click **Add action** and choose **Forward to...**

5. From the **Forward to** drop-down, choose `rancher-tcp-80`.

6. Click **Save** in the top right of the screen.
