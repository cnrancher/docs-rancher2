---
title: 项目网络隔离的其他步骤
weight: 4
---

如果你的集群满足以下条件：

- 你同时使用了 Canal 网络插件与 Rancher 2.5.8 之前版本，或者同时使用了 Rancher 2.5.8+ 以及任意支持执行 Kubernetes 网络策略的 RKE 网络插件（例如 Canal 或 Cisco ACI 插件）。
- 启用了项目网络隔离选项。
- 安装了 Istio Ingress 模块。

默认情况下，Istio Ingress Gateway pod 无法将入口流量重定向到工作负载。这是因为安装了 Istio 的命名空间无法访问所有命名空间。为此你有两个选项。

第一个选项是在需要让 Istio 控制入口的每个命名空间中添加一个新的网络策略。你的策略需要包括以下几行：

```
- podSelector:
    matchLabels:
      app: istio-ingressgateway
```

第二个选项是将 `istio-system` 命名空间移动到 `system` 项目中，默认情况下该项目被排除在网络隔离之外。