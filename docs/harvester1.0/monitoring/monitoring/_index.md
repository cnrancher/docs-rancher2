---
title: 监控
keywords:
  - Harvester
  - harvester
  - Rancher
  - rancher
  - 监控
  - Harvester Prometheus
  - Harvester 指标
  - Harvester Grafana
  - Harvester 仪表盘
description: Harvester v0.3.0 已使用 Prometheus 内置集成监控。监控会在 ISO 安装期间自动安装。
---

_从 v0.3.0 起可用_

## 仪表盘指标

Harvester `v0.3.0` 已使用 [Prometheus](https://prometheus.io/) 内置集成监控。监控会在 ISO 安装期间自动安装。

在 Harvester 的`仪表盘`页面中，你可以分别查看集群指标以及最常用的 10 个虚拟机指标。
此外，你可以单击 [Grafana](http://grafana.com/) 仪表盘链接，从而在 Grafana UI 上查看更多仪表盘。
![](./assets/monitoring-dashboard.png)

> 注意
>
> 只有管理员用户才能查看仪表盘指标。

## 虚拟机详细指标

你可以单击虚拟机的详情页面，来查看每个虚拟机的指标。
![](./assets/vm-metrics.png)
