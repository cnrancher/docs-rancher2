---
title: Rancher 部署策略
---

有两种推荐的部署策略，每种方法都有其优缺点。哪种方法最适合您的场景，请阅读更多信息:

## 轴心方式拓扑

---

在这个部署场景中，有一个 Rancher 控制平面来管理遍布全球的 Kubernetes 集群。控制平面将在一个高可用的 Kubernetes 集群上运行，但它将受到延迟的影响。

![Hub and Spoke Deployment](/img/rancher/bpg/hub-and-spoke.png)

### 优点

- 环境可以具有跨区域的节点和网络连接。
- 单一控制平面界面，查看所有区域和环境。
- Kubernetes 不需要 Rancher 操作，并且可以容忍失去与 Rancher 控制平面的连接。

### 缺点

- 受制于网络延迟。
- 如果控制平面失效，在恢复之前全球范围内无法新建集群。但是，每个 Kubernetes 集群可以继续单独管理。

## 区域性拓扑

---

在区域部署模型中，控制平面被部署在靠近计算节点的地方。

![Regional Deployment](/img/rancher/bpg/regional.png)

### 优点

- 即使另一个区域的控制平面发生故障，本区域内的 Rancher 功能仍然可以保持运行状态。
- 网络延迟大大降低，提高 Rancher 的性能。
- Rancher 控制平面的升级可以在每个区域独立完成。

### 缺点

- 管理多个 Rancher 安装的开销。
- 需要在多个界面中才能查看到全球所有的 Kubernetes 集群
- 在 Rancher 中部署多集群应用时，需要在每个 Rancher Server 中重复这个过程。
