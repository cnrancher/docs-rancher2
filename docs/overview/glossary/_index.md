---
title: 名词解释
---

## Rancher Labs

Rancher Labs 是一家商业公司，主要靠卖自家开源产品的技术支持订阅和一些大客户的定制项目。Rancher Labs 开发了很多开源产品。Rancher 1.x, Rancher 2.x, Rancher Kubernetes Engine (RKE), RancherOS, K3S, K3OS, RIO, Longhorn, Submariner等开源产品

## Rancher

Rancher一般指的是 Rancher 1.x 和 Rancher 2.x。 Rancher 1.x 主要用的是自研的Cattle编排引擎管理容器，简单好用。目前已经不再继续维护了。Rancher 2.x是一款Kuberntes管理平台，也是 Rancher Labs的旗舰产品，目前Rancher 2.x产品在k8s多集群管理领域里处于绝对领先的位置。

## RKE

RKE全称是Rancher Kubernetes Engine。可以通过CLI的方式独立于Rancher 2.x使用。可以在安装好docker的linux主机上，快速方便的搭建Kubernetes集群。在搭建生产可用的Kubernetes集群的工具里，RKE的易用性应该是最好的。关于RKE和Rancher的关系，RKE是Rancher 2.x中的一个重要组成部分，在UI上通过“自定义主机”创建的集群和通过“主机驱动”创建的集群，都是Rancher Server调用RKE模块来实现的。我们一般叫这种集群为 RKE 集群。英文文档和Release Notes里叫 Rancher Launched Kubernetes cluster。

## k3s

k3s也是标准的k8s。但是对k8s做了精简和用户体验优化，从而减少运维负担。启动k3s非常简单，一条命令就可以。加入一个新节点，使用4层LB等也都非常简单。同时也可以使用MySQL/SQLite等关系型数据库作为数据库。在开发测试环境和边缘计算等场景中，非常受用户喜欢。k3s GitHub数甚至都快超过Rancher 2.x了。在Rancher 2.2和2.3中，你可以把k3s作为导入集群导入到Rancher中进行统一纳管。在2020年3月低，即将发布的Rancher 2.4里，将会进一步加大对k3s的集成，用户将可以通过Rancher UI查看k3s集群中各个节点的配置，并且可以通过Rancher UI直接升级导入的k3s集群的Kuberntes版本。另外，针对Rancher 2.4的高可用部署，也将提供另外一种通过k3s集群安装Rancher HA的方法，从而大大简化部署Rancher高可用的流程。

