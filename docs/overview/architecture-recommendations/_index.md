---
title: 推荐架构
description: 本文介绍了Rancher的推荐架构，帮助您了解使用高可用集群部署Rancher的优势。
---
本文主要介绍了Rancher的推荐架构，以及推荐架构的优势。如果您准备在单节点上安装Rancher，请参考[分开部署rancher与下游用户集群](#分开部署rancher与下游用户集群)，获取适用于这种架构的建议。

## 分开部署Rancher与下游用户集群

下游用户集群，是运行应用和服务的下游Kubernetes集群，如果您在Rancher中安装了Docker或Kubernetes，运行RancherServer的节点应该和下游用户集群分开部署。

![Separation of Rancher Server from User Clusters](/img/rancher/rancher-architecture-separation-of-rancher-server.svg)

## 为什么高可用集群与Rancher适配性更高

在生产环境中，我们建议您创建三节点的Kubernetes集群，然后把Rancher Server安装在里面，这样可以保障Rancher Server的数据安全。不管是单节点安装，还是高可用安装，Rancher Server都会把数据存储在etcd节点中。
使用单节点安装Rancher Server时，如果该节点出现故障，etcd节点数据在其他节点没有备份，有可能导致Rancher Server数据丢失。
与单节点安装不同，高可用集群（High Availability Cluster，简称HA）安装具有如下优势：

* etcd节点数据在三个节点上都有备份，如果etcd节点出现故障，其他三个节点可以提供数据备份。
* 负载均衡负责单点对接客户的，把网络流量分配给集群内的多个服务器，防止单个服务器因为访问请求过多，而出现故障。本文使用了NGINX server作为例子，讲述如何将NGINX server的配置成一个四层负载均衡（TCP负载均衡）。

## 负载均衡的推荐配置参数

我们建议您使用以下方案，配置您的负载均衡和应用路由控制器：

* 使用Rancher的域名系统（DNS）解析四层负载均衡
* 负载均衡跟集群中所有节点的80端口和443端口通信。
* 应用路由控制器把HTTP重定向到HTTPS，在443端口安装SSL/TLS安全证书。
* 应用路由控制器把流量转发到Rancher pod的80端口。

<figcaption>在Kubernetes集群中安装Rancher，四层负载均衡，在应用路由控制器中描述SSL进程。</figcaption>

![Rancher HA](/img/rancher/ha/rancher2ha.svg)

## Kubernetes的安装环境

我们建议您使用云服务提供商的虚拟机，如EC2、GCE等，安装Kubernetes集群，然后在集群中安装Rancher。

为了达到最好的性能和安全条件，我们建议您为Rancher创建一个专用的Kubernetes集群。不建议您在同一个集群内运行应用或程序。部署Rancher后，您可以[创建新集群或导入已有集群](/docs/cluster-provisioning/_index/#cluster-creation-in-rancher)，然后用这些集群启动应用或程序。

我们不建议在托管的Kubernete集群服务上，如EKS和GKE，安装Rancher。
Rancher无法获取到这些云端Kubernetes的etcd节点信息，而且这些管理工具可能会与Rancher的命令冲突。

## 节点角色分配建议

适合安装Rancher的Kubernetes集群应满足以下条件：

* 集群有多个节点
* 每个节点都有三个Kubernetes角色：etcd、controlplane和worker

## Rancher Server集群和下游用户集群的角色对比

Rancher Server集群中的节点角色分配，我们建议每个节点都分配etcd、controlplane和worker三个角色；而下游用户集群中的角色分配则恰好相反，每个节点只分配一个角色，这样可以保持稳定性和可扩展性。

![Kubernetes Roles for Nodes in Rancher Server Cluster vs. User Clusters](/img/rancher/rancher-architecture-node-roles.svg)

我们建议只给每个节点分配一个角色，提高可扩展性，这样不会干扰到Kubernetes master节点或集群数据。但是，Kubernetes只要求每个节点至少要分配到一个角色，而没有对每个节点可分配的角色数量作要求。也就是说，每个节点可以具有一种或多种角色。完成一个高可用集群的配置，至少需要三个节点，具体配置方法如下：

以下是我们对于下游用户集群节点的配置建议：

* **etcd角色分配给任意三个节点**保障高可用性，如果这三个节点中的任意一个出现故障，还有两个节点可以使用。
* **controlplane角色分配给任意两个节点**，这样可以保证master组件的高可用性。
* **worker角色分配给一个或以上的节点**用于运行Kubernetes节点组件和您部署的服务或应用。

综上所述，合理配置三个节点足以构建一个高可用集群，因为：

* 集群中有三个etcd节点，如果其中一个出现故障，而另外两个含有etcd节点备份数据的节点随时待命
* 多个controlplane节点使master组件保持多实例的状态
* 该集群有且只有Rancher在运行

因为这个节点中只部署了Rancher，其他程序或应用都没有部署到这里，所以这种配置方式不需要使用到我们建议的架构，它的可扩展性和可靠性足以应对大多数情况。

请查看 [生产环境清单](/docs/cluster-provisioning/production/_index) 或 [可靠性和可扩展性建议](/docs/best-practices/management/_index#tips-for-scaling-and-reliability)，获取配置建议。

## 授权集群端点的架构

如果您使用的是[授权集群端点](/docs/overview/architecture/_index#4-authorized-cluster-endpoint)，我们建议您创建一个指向负载均衡的FQDN，使用controlplane角色控制FQDN，平和多个节点之间的工作负载。

如果您在负载均衡上使用了CA证书，您需要提供证书。证书可以从kubeconfig文件中获取。详情请见 [kubeconfig文件](/docs/k8s-in-rancher/kubeconfig/_index) and [API keys](/docs/user-settings/api-keys/_index#creating-an-api-key) 。

