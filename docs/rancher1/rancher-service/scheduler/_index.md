---
title: 调度服务
---

Rancher 的核心调度逻辑是 Rancher 的一部分，它可以处理端口冲突和根据主机／容器上的标签进行调度的能力。除了核心调度逻辑，Rancher 还使用应用商店里的**Rancher Scheduler**支持额外的调度策略。

- [能够调度多 IP 的主机](#multiple-ips)
- [基于资源约束的调度能力 (例如 CPU 和内存)](#resource-constraints)
- [能够限制在主机上调度哪些服务](#restrict-services-on-host)

> **注意:** 这些特性不适用于 Kubernets，因为 Kubernets 自己处理 pod 的调度。

### 启用 Rancher 调度程序

Rancher 调度服务需要在环境中启用。如果您将它从您的环境中删除了，可以在**应用商店** -> **官方认证**中添加应用**Rancher Scheduler**。

<a id="multiple-ips"></a>

### 多 IP 主机调度

默认情况下，Rancher 假定在调度发布有暴露端口的服务以及启动负载均衡器时，主机上只有一个 IP 可用。如果您的主机有多个可以使用的 IP，则[需要配置主机以允许 Rancher 调度程序知道哪些 IP 可用](/docs/rancher1/infrastructure/hosts/_index#主机调度地址)。

当主机上有多个 IP 可用于调度时，当通过服务或者负载均衡器发布端口时，Rancher 将对所有可用的调度 IP 进行编排。当主机上的所有可用的调度 IP 都被分配给那个端口之后，调度器将会报告端口冲突。

<a id="resource-constraints"></a>

### 基于资源约束的调度

当 Rancher[主机](/docs/rancher1/infrastructure/hosts/_index)被添加到 Rancher 时，它们将根据主机的大小自动限制资源。可以通过编辑主机来调整这些限制。在**基础架构** -> **主机**中，您可以从主机的下拉框中选择**编辑**。在主机的**资源限制**选项中，您可以更新**内存**或者**CPU**为您期望需要用到的最大值。

#### 在 UI 上设置资源预留

创建服务时，可以在**安全/主机**选项卡中指定**内存预留**和**mCPU 预留**。设置这些预留时，服务的容器只能安排在具有可用资源的主机上。主机上这些资源的最大限制是根据主机的**资源限制**确定的。如果将容器调度到主机上会迫使这些限制超过阈值，则容器将不会被调度到主机上。

#### 在 Rancher Compose 中设置预留

`docker-compose.yml`示例

```
version: '2'
services:
  test:
    image: ubuntu:14.04.3
    stdin_open: true
    tty: true
    # Set the memory reservation of the container
    mem_reservation: 104857600
```

`rancher-compose.yml`示例

```
version: '2'
services:
  test:
    # Set the CPU reservation of the container
    milli_cpu_reservation: 10
    scale: 1
```

<a id="restrict-services-on-host"></a>

### 在主机上调度指定服务

通常，大部分的容器调度规则定义在了服务中。服务对可以运行容器的主机设置了一些规则或限制。例如，容器必须安排在具有特定标签的主机上。Rancher 还可以支持只允许将特定的容器调度到某个主机上。例如，您可能希望某台专用主机只运行数据库容器。

> **注意:** 当您在主机上添加运行容器的限制标签时，您将需要包含一个特定标签，以便将 Rancher 的[基础设施服务](/docs/rancher1/rancher-services/_index)调度到主机上。没有这些服务，容器将无法正常运行。

对于任何主机，您可以通过从主机的下拉列表中选择**编辑**来编辑主机以添加可运行容器必须具有的标签。 在**容器标签需求**选项中，您可以添加要在服务中使用哪些标签，以便将这些容器调度到主机上。UI 将自动将标签(例如，io.rancher.container.system =`)标记为必需的标签。
