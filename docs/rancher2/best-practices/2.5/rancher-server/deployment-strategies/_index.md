---
title: title
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

---

title: Rancher Deployment Strategy
weight: 100

---

There are two recommended deployment strategies for a Rancher server that manages downstream Kubernetes clusters. Each one has its own pros and cons. Read more about which one would fit best for your use case:

- [Hub and Spoke](#hub-and-spoke)
- [Regional](#regional)

# Hub & Spoke Strategy

---

In this deployment scenario, there is a single Rancher control plane managing Kubernetes clusters across the globe. The control plane would be run on a high-availability Kubernetes cluster, and there would be impact due to latencies.

{{< img "/img/rancher/bpg/hub-and-spoke.png" "Hub and Spoke Deployment">}}

### Pros

- Environments could have nodes and network connectivity across regions.
- Single control plane interface to view/see all regions and environments.
- Kubernetes does not require Rancher to operate and can tolerate losing connectivity to the Rancher control plane.

### Cons

- Subject to network latencies.
- If the control plane goes out, global provisioning of new services is unavailable until it is restored. However, each Kubernetes cluster can continue to be managed individually.

# Regional Strategy

---

In the regional deployment model a control plane is deployed in close proximity to the compute nodes.

{{< img "/img/rancher/bpg/regional.png" "Regional Deployment">}}

### Pros

- Rancher functionality in regions stay operational if a control plane in another region goes down.
- Network latency is greatly reduced, improving the performance of functionality in Rancher.
- Upgrades of the Rancher control plane can be done independently per region.

### Cons

- Overhead of managing multiple Rancher installations.
- Visibility across global Kubernetes clusters requires multiple interfaces/panes of glass.
- Deploying multi-cluster apps in Rancher requires repeating the process for each Rancher server.
