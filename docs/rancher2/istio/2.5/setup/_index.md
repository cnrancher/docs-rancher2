---
title: Setup Guide
description: description
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
  - subtitles1
  - subtitles2
  - subtitles3
  - subtitles4
  - subtitles5
  - subtitles6
---

This section describes how to enable Istio and start using it in your projects.

If you use Istio for traffic management, you will need to allow external traffic to the cluster. In that case, you will need to follow all of the steps below.

# Prerequisites

This guide assumes you have already [installed Rancher,](/rancher/v2.x/en/installation) and you have already [provisioned a separate Kubernetes cluster](/rancher/v2.x/en/cluster-provisioning) on which you will install Istio.

The nodes in your cluster must meet the [CPU and memory requirements.](/rancher/v2.x/en/cluster-admin/tools/istio/resources/)

The workloads and services that you want to be controlled by Istio must meet [Istio's requirements.](https://istio.io/docs/setup/additional-setup/requirements/)

# Install

> **Quick Setup** If you don't need external traffic to reach Istio, and you just want to set up Istio for monitoring and tracing traffic within the cluster, skip the steps for [setting up the Istio gateway](/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway) and [setting up Istio's components for traffic management.](/rancher/v2.x/en/cluster-admin/tools/istio/setup/set-up-traffic-management)

1. [Enable Istio in the cluster.](/rancher/v2.x/en/cluster-admin/tools/istio/setup/enable-istio-in-cluster)
1. [Enable Istio in all the namespaces where you want to use it.](/rancher/v2.x/en/cluster-admin/tools/istio/setup/enable-istio-in-namespace)
1. [Add deployments and services that have the Istio sidecar injected.](/rancher/v2.x/en/cluster-admin/tools/istio/setup/deploy-workloads)
1. [Set up the Istio gateway. ](/rancher/v2.x/en/cluster-admin/tools/istio/setup/gateway)
1. [Set up Istio's components for traffic management.](/rancher/v2.x/en/cluster-admin/tools/istio/setup/set-up-traffic-management)
1. [Generate traffic and see Istio in action.](#generate-traffic-and-see-istio-in-action)
