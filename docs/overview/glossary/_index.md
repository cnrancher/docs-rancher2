---
title: 名词解释
description: 本文提供了使用 Rancher 过程中常见的名词和对应的解析，这些名词分为两大类：Rancher 相关概念和 Kubernetes 相关概念，如Rancher Labs、Rancher、RKE、K3s、集群（Cluster）、节点（Node）实例（Pod）、容器（Container）、工作负载（Workload）等。
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
  - 产品介绍
  - 名词解释
---

本文提供了使用 Rancher 过程中常见的名词和对应的解析，这些名词分为两大类：Rancher 相关概念和 Kubernetes 相关概念。需要注意的是，Kubernetes 相关英语词汇可能有不止一种中文翻译，我们会尽量保证中英文词汇对照的完整性。

## Rancher 相关概念

### Rancher Labs

Rancher Labs 是一家商业公司，开发了很多开源产品，如：Rancher 1.x、 Rancher 2.x、 Rancher Kubernetes Engine (RKE)、RancherOS、 K3S、K3OS、 RIO、 Longhorn 和 Submariner 等。Rancher Labs 将大多数产品免费开源给用户使用，通过提供订阅式的技术支持服务盈利。目前 Rancher Labs 的旗舰产品是 Rancher 2.x，在 k8s 多集群管理领域里处于绝对领先的位置。

### Rancher

Rancher 一般指的是 Rancher 1.x 和 Rancher 2.x。

Rancher 1.x 主要用的是 Rancher 自研的 Cattle 编排引擎管理容器，简单易用。由于版本更新，目前已经 Rancher Labs 不再继续维护 Rancher 1.x，而是推出了 Rancher 2.x。

Rancher 2.x 是一款 Kuberntes 管理平台，也是 Rancher Labs 的旗舰产品，目前 Rancher 2.x 产品在 k8s 多集群管理领域里处于绝对领先的位置。

### RKE

RKE 全称是 Rancher Kubernetes Engine。可以通过 CLI 的方式独立于 Rancher 2.x 使用。可以在安装好 docker 的 linux 主机上，快速方便的搭建 Kubernetes 集群。在搭建生产可用的 Kubernetes 集群的工具里，RKE 的易用性应该是最好的。关于 RKE 和 Rancher 的关系，RKE 是 Rancher 2.x 中的一个重要组成部分，在 UI 上通过“自定义主机”创建的集群和通过“主机驱动”创建的集群，都是 Rancher Server 调用 RKE 模块来实现的。我们一般叫这种集群为 RKE 集群。英文文档和 Release Notes 里叫 Rancher-Launched Kubernetes cluster。

### K3s

K3s 是经过精简和用户体验优化的 k8s。K3s 减少了运维负担。一条命令就可以启动 K3s。加入一个新节点，使用 4 层 LB 等也都非常简单。同时也可以使用 MySQL/SQLite 等关系型数据库作为数据库。在开发测试环境和边缘计算等场景中，非常受用户喜欢。

在 Rancher 2.2 和 2.3 中，您可以把 K3s 作为导入集群导入到 Rancher 中进行统一纳管。在即将发布的 Rancher 2.4 里，将会进一步加大对 K3s 的集成，用户将可以通过 Rancher UI 查看 K3s 集群中各个节点的配置，并且可以通过 Rancher UI 直接升级导入的 K3s 集群的 Kuberntes 版本。另外，针对 Rancher 2.4 的高可用部署，也将提供另外一种通过 K3s 集群安装 Rancher HA 的方法，从而大大简化部署 Rancher 高可用的流程。

## Kubernetes 相关概念

内容来自[华为 CCE 文档](https://support.huaweicloud.com/productdesc-cce/cce_productdesc_0011.html)

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

### 无状态工作负载（Deployment）

即 Kubernetes 中的“Deployments”，无状态工作负载支持弹性伸缩与滚动升级，适用于实例完全独立、功能相同的场景，如：nginx、wordpress 等。

### 有状态工作负载（StatefulSet）

即 Kubernetes 中的“StatefulSets”，有状态工作负载支持实例有序部署和删除，支持持久化存储，适用于实例间存在互访的场景，如 ETCD、mysql-HA 等

### 守护进程集（DaemonSet）

即 Kubernetes 中的“DaemonSet”，守护进程集确保全部（或者某些）节点都运行一个 Pod 实例，支持实例动态添加到新节点，适用于实例在每个节点上都需要运行的场景，如 ceph、fluentd、Prometheus Node Exporter 等。

### 普通任务（Job）

即 Kubernetes 中的“Job”，普通任务是一次性运行的短任务，部署完成后即可执行。使用场景为在创建工作负载前，执行普通任务，将镜像上传至镜像仓库。

### 定时任务（CornJob）

即 kubernetes 中的“CronJob”，定时任务是按照指定时间周期运行的短任务。使用场景为在某个固定时间点，为所有运行中的节点做时间同步。

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

服务定义了实例及访问实例的途径，如单个稳定的 IP 地址和相应的 DNS 名称。

### 亲和性与反亲和性

在应用没有容器化之前，原先一个虚机上会装多个组件，进程间会有通信。但在做容器化拆分的时候，往往直接按进程拆分容器，比如业务进程一个容器，监控日志处理或者本地数据放在另一个容器，并且有独立的生命周期。这时如果他们分布在网络中两个较远的点，请求经过多次转发，性能会很差。

亲和性：可以实现就近部署，增强网络能力实现通信上的就近路由，减少网络的损耗。如：应用 A 与应用 B 两个应用频繁交互，所以有必要利用亲和性让两个应用的尽可能的靠近，甚至在一个节点上，以减少因网络通信而带来的性能损耗。
反亲和性：主要是出于高可靠性考虑，尽量分散实例，某个节点故障的时候，对应用的影响只是 N 分之一或者只是一个实例。如：当应用采用多副本部署时，有必要采用反亲和性让各个应用实例打散分布在各个节点上，以提高 HA。

### 应用服务网格（Istio）

Istio 是一个提供连接、保护、控制以及观测功能的开放平台。

Rancher 集成了应用服务网格，支持完整的生命周期管理和流量治理能力，兼容 Kubernetes 和 Istio 生态。开启应用服务网格后即可提供非侵入的智能流量治理解决方案，其功能包括负载均衡、熔断、限流等多种治理能力。应用服务网格内置金丝雀、蓝绿等多种灰度发布流程，提供一站式自动化的发布管理。
