---
title: 部署带有 Ingress 的工作负载
weight: 100
---

### 前提

你已有一个正在运行的集群，且该集群中有至少一个节点。

### 1. 部署工作负载

你可以开始创建你的第一个 Kubernetes [工作负载](https://kubernetes.io/docs/concepts/workloads/)。工作负载是一个对象，其中包含 pod 以及部署应用所需的其他文件和信息。

在本文的工作负载中，你将部署一个 Rancher Hello-World 应用。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**工作负载**。
1. 点击**创建**。
1. 点击 **Deployment**。
1. 为工作负载设置**名称**。
1. 在 **Docker 镜像**字段中，输入 `rancher/hello-world`。注意区分大小写。
1. 点击**添加端口**并在**私有容器端口**字段中输入`80`。通过添加端口，你可以访问集群内外的应用。详情请参见[服务]({{<baseurl>}}/rancher/v2.6/en/k8s-in-rancher/workloads/#services)。
1. 点击**创建**。

**结果**：

* 工作负载已部署。此过程可能需要几分钟。
* 当工作负载的 deployment 完成后，它的状态会变为 **Active**。你可以从项目的**工作负载**页面查看其状态。

<br/>

### 2. 通过 Ingress 暴露应用

现在应用已启动并运行，你需要暴露应用以让其他服务连接到它。

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。

1. 点击**服务发现 > Ingresses**。

1. 点击**创建**。

1. 在选择**命名空间**时，你需要选择在创建 deployment 时使用的命名空间。否则，在步骤8中选择**目标服务**时，你的 deployment 会不可用。

1. 输入**名称**，例如 **hello**。

1. 指定**路径**，例如 `/hello`。

1. 在**目标服务**字段的下拉菜单中，选择你为服务设置的名称。

1. 在**端口**字段中的下拉菜单中，选择 `80`。

1. 点击右下角的**创建**。

**结果**：应用分配到了一个 `sslip.io` 地址并暴露。这可能需要一两分钟。

### 查看应用

在 **Deployments** 页面中，找到你 deployment 的**端点**列，然后单击一个端点。可用的端点取决于你添加到 deployment 中的端口配置。如果你看不到随机分配端口的端点，请将你在创建 Ingress 时指定的路径尾附到 IP 地址上。例如，如果你的端点是 `xxx.xxx.xxx.xxx` 或 `https://xxx.xxx.xxx.xxx`，把它修改为 `xxx.xxx.xxx.xxx/hello` 或 `https://xxx.xxx.xxx.xxx/hello`。

应用将在另一个窗口中打开。

#### 已完成！

恭喜！你已成功通过 Ingress 部署工作负载。

#### 后续操作

使用完沙盒后，你需要清理 Rancher Server 和集群。详情请参见：

- [Amazon AWS：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/amazon-aws-qs/#destroying-the-environment)
- [DigitalOcean：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/digital-ocean-qs/#destroying-the-environment)
- [Vagrant：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/quickstart-vagrant/#destroying-the-environment)
