---
title: 名词解释
description: 本文提供了使用 Rancher 过程中常见的名词和对应的解析，这些名词分为两大类：Rancher 相关概念和 Kubernetes 相关概念。 
---
本文提供了使用 Rancher 过程中常见的名词和对应的解析，这些名词分为两大类：Rancher 相关概念和 Kubernetes 相关概念。需要注意的是，Kubernetes 相关英语词汇可能有不止一种中文翻译，我们会尽量保证中英文词汇对照的完整性。

## Rancher相关概念

### Rancher Labs

Rancher Labs 是一家商业公司，开发了很多开源产品，如：Rancher 1.x、 Rancher 2.x、 Rancher Kubernetes Engine (RKE)、RancherOS、 K3S、K3OS、 RIO、 Longhorn和 Submariner 等。Rancher Labs将大多数产品免费开源给用户使用，通过提供订阅式的技术支持服务盈利。目前 Rancher Labs的旗舰产品是 Rancher 2.x，在k8s多集群管理领域里处于绝对领先的位置。

### Rancher

Rancher 一般指的是 Rancher 1.x 和 Rancher 2.x。 

Rancher 1.x 主要用的是 Rancher 自研的 Cattle 编排引擎管理容器，简单易用。由于版本更新，目前已经 Rancher Labs 不再继续维护 Rancher 1.x，而是推出了 Rancher 2.x。

Rancher 2.x 是一款 Kuberntes 管理平台，也是 Rancher Labs的旗舰产品，目前Rancher 2.x产品在k8s多集群管理领域里处于绝对领先的位置。

### RKE

RKE全称是 Rancher Kubernetes Engine。可以通过 CLI 的方式独立于 Rancher 2.x 使用。可以在安装好 docker 的 linux 主机上，快速方便的搭建 Kubernetes 集群。在搭建生产可用的 Kubernetes 集群的工具里，RKE 的易用性应该是最好的。关于 RKE 和 Rancher 的关系，RKE 是 Rancher 2.x中的一个重要组成部分，在UI上通过“自定义主机”创建的集群和通过“主机驱动”创建的集群，都是 Rancher Server 调用 RKE 模块来实现的。我们一般叫这种集群为 RKE 集群。英文文档和Release Notes里叫 Rancher-Launched Kubernetes cluster。

### k3s

k3s 是经过精简和用户体验优化的 k8s。k3s 减少了运维负担。一条命令就可以启动 k3s。 加入一个新节点，使用4层LB等也都非常简单。同时也可以使用MySQL/SQLite等关系型数据库作为数据库。在开发测试环境和边缘计算等场景中，非常受用户喜欢。

在 Rancher 2.2 和 2.3 中，你可以把 k3s 作为导入集群导入到 Rancher 中进行统一纳管。在即将发布的 Rancher 2.4 里，将会进一步加大对k3s的集成，用户将可以通过 Rancher UI 查看 k3s 集群中各个节点的配置，并且可以通过 Rancher UI 直接升级导入的 k3s 集群的 Kuberntes 版本。另外，针对 Rancher 2.4 的高可用部署，也将提供另外一种通过 k3s 集群安装 Rancher HA 的方法，从而大大简化部署 Rancher 高可用的流程。

## Kubernetes 相关概念

### 集群（Cluster）

集群指容器运行所需要的云资源组合，关联了若干云服务器节点、负载均衡等云资源。您可以理解为集群是“同一个子网中一个或多个弹性云服务器（又称：节点）”通过相关技术组合而成的计算机群体，为容器运行提供了计算资源池。

### 节点（Node）

也叫“主机”，每一个节点对应一台服务器（可以是虚拟机实例或者物理服务器），容器应用运行在节点上。节点上运行着 Agent 代理程序（kubelet），用于管理节点上运行的容器实例。集群中的节点数量可以伸缩。

### 实例（Pod）

实例（Pod）是 Kubernetes 部署应用或服务的最小的基本单位。一个 Pod 封装多个应用容器（也可以只有一个容器）、存储资源、一个独立的网络 IP 以及管理控制容器运行方式的策略选项。

### 容器（Container）

一个通过 Docker 镜像创建的运行实例，一个节点可运行多个容器。容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。

### 工作负载（Workload）

工作负载即 Kubernetes 对一组 Pod 的抽象模型，用于描述业务的运行载体，包括 Deployment、Statefulset、Daemonset、Job、CronJob 等多种类型。

### 无状态工作负载

即 Kubernetes 中的“Deployments”，无状态工作负载支持弹性伸缩与滚动升级，适用于实例完全独立、功能相同的场景，如：nginx、wordpress等。

### 有状态工作负载

即 Kubernetes 中的“StatefulSets”，有状态工作负载支持实例有序部署和删除，支持持久化存储，适用于实例间存在互访的场景，如ETCD、mysql-HA等

### 创建守护进程集

即 Kubernetes 中的“DaemonSet”，守护进程集确保全部（或者某些）节点都运行一个 Pod 实例，支持实例动态添加到新节点，适用于实例在每个节点上都需要运行的场景，如ceph、fluentd、Prometheus Node Exporter等。

### 普通任务

即 Kubernetes 中的“Job”，普通任务是一次性运行的短任务，部署完成后即可执行。使用场景为在创建工作负载前，执行普通任务，将镜像上传至镜像仓库。

### 定时任务

即 Kubernetes中的“Job”，普通任务是一次性运行的短任务，部署完成后即可执行。使用场景为在创建工作负载前，执行普通任务，将镜像上传至镜像仓库。 

### 编排（Orchestration）

编排模板包含了一组容器服务的定义和其相互关联，可以用于多容器应用和虚机应用的部署和管理。

### 镜像（Image）

Docker 镜像是一个模板，是容器应用打包的标准格式，用于创建 Docker 容器。或者说，Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。在部署容器化应用时可以指定镜像，镜像可以来自于 Docker Hub、华为云容器镜像服务或者用户的私有 Registry。例如一个 Docker 镜像可以包含一个完整的 Ubuntu 操作系统环境，里面仅安装了用户需要的应用程序及其依赖文件。

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的“类” 和“实例” 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

### 镜像仓库（Registry）

镜像仓库用于存放 Docker 镜像，包括公共镜像仓库（如 DockerHub）和私有镜像仓库（如 Harbor）。

### 命名空间（Namespace）

命名空间是对一组资源和对象的抽象整合。在同一个集群内可创建不同的命名空间，不同命名空间中的数据彼此隔离。使得它们既可以共享同一个集群的服务，也能够互不干扰。

例如：可以将开发环境、测试环境的业务分别放在不同的命名空间。

### 服务（Service）

服务定义了实例及访问实例的途径，如单个稳定的IP地址和相应的DNS名称。

### 应用服务网格（Istio）

Istio是一个提供连接、保护、控制以及观测功能的开放平台。

Rancher 集成了应用服务网格，支持完整的生命周期管理和流量治理能力，兼容 Kubernetes 和 Istio 生态。开启应用服务网格后即可提供非侵入的智能流量治理解决方案，其功能包括负载均衡、熔断、限流等多种治理能力。应用服务网格内置金丝雀、蓝绿等多种灰度发布流程，提供一站式自动化的发布管理。

### Ingress

Ingress，是授权入站连接到达集群服务的规则集合。可通过 Ingress 配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等

### 存储卷（PVC）

PersistentVolumeClaim，满足用户对于持久化存储的需求，用户将 Pod 内需要持久化的数据挂载至存储卷，删除 Pod 后，数据仍保留在存储卷内。Kubesphere 推荐使用动态分配存储，当集群管理员配置存储类型后，集群用户可一键式分配和回收存储卷，无需关心存储底层细节。

### 流水线（Pipeline）

简单来说就是一套运行在 Jenkins 上的 CI/CD 工作流框架，将原来独立运行于单个或者多个节点的任务连接起来，实现单个任务难以完成的复杂流程编排和可视化的工作。

### 蓝绿部署

提供了一种零宕机的部署方式，在保留旧版本的同时部署新版本，将两个版本同时在线，如果有问题可以快速处理

### 金丝雀发布

将一部分真实流量引入一个新版本进行测试，测试新版本的性能和表现，在保证系统整体稳定运行的前提下，尽早发现新版本在实际环境上的问题。

