---
title: 部署Rancher Server
description: 使用以下指南之一在您选择的供应商中部署和配置 Rancher 和 Kubernetes 集群。在 AWS 上快速部署、在 DigitalOcean 上快速部署、在 Azure 上快速部署、在 GCP 上快速部署、使用 Vagrant 进行快速部署、在已有主机上手动部署。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 快速入门
  - 部署Rancher Server
  - 概述
---

## 概述

本文介绍了两种快速部署 Rancher 和 Kubernetes 集群的方式，一种是**在 Amazon EKS 上部署 Rancher**；另一种是**在虚拟机上部署 Rancher**，支持的虚拟机厂商包括：AWS、DigitalOcean、Azure、Google Cloud Platform 和 Vagrant。用户不仅可以使用这些云厂商提供的虚拟机服务实现**自动化部署** Rancher，也可以在已有的虚拟机上**手动部署** Rancher。

## 前提条件

因为快速部署手册着重于快速上手使用 Rancher，所以这些手册中会省略一部分关于环境配置和参数配置的内容。同时，我们默认您对 Linux 和 Kubernetes 已经有一定的了解，关于这两方面的操作命令和基础知识也不再叙述。如果您需要了解相关知识，请参考 Linux 和 Kubernetes 的官方文档。

## 在 Amazon EKS 上部署 Rancher

Rancher 和 AWS 联合制定了一份快速入门指南，用于在 EKS Kubernetes 集群上按照 AWS 最佳实践部署 Rancher。详情请参考[部署指南](https://aws-quickstart.github.io/quickstart-eks-rancher/)。

## 在虚拟机上部署 Rancher

### 自动化部署

以下指南演示了如何使用自动化工具在不同云厂商提供的虚拟机上部署 Rancher Server 的操作步骤。

这些指南并没有将 Rancher 部署在单独的 Kubernetes 集群上，这是 Rancher Server**需要管理下游 Kubernetes 集群**的情况下的最佳实践。

- [在 AWS 上快速部署](/docs/rancher2/quick-start-guide/deployment/amazon-aws-qs/_index)
- [在 DigitalOcean 上快速部署](/docs/rancher2/quick-start-guide/deployment/digital-ocean-qs/_index)
- [在 Azure 上快速部署](/docs/rancher2/quick-start-guide/deployment/microsoft-azure-qs/_index)
- [在 GCP 上快速部署](/docs/rancher2/quick-start-guide/deployment/google-gcp-qs/_index)
- [使用 Vagrant 进行快速部署](/docs/rancher2/quick-start-guide/deployment/quickstart-vagrant/_index)

### 手动部署

除了可以使用自动化工具部署 Rancher Server，您也可以手动部署 Rancher Server。以下指南将分步向您介绍相同的过程。如果您想在其他供应商中运行 Rancher，或者是在自己的数据中心运行 Rancher，或者您只想看看启动 Rancher 到底有多简单，请参考以下链接：

- [在已有主机上手动部署](/docs/rancher2/quick-start-guide/deployment/quickstart-manual-setup/_index)
