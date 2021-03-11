---
title: 配置Canal 网络插件与项目网络隔离的额外步骤
---

如果您的集群满足以下条件：

- 正在使用 Canal 网络插件。
- 启用了项目网络隔离选项。
- 安装了 Istio Ingress 模块。

Istio Ingress Gateway pod 在默认情况下无法将入口流量重定向到工作负载。这是因为所有的命名空间都无法从安装 Istio 的命名空间访问。您有两个选择：

第一个选项是在您打算由 Istio 控制入口的每个命名空间中添加一个新的网络策略。你的策略应该包括以下几行。

```yaml
- podSelector。
    matchLabels.app: istio-ingressgateway:
      app: istio-ingressgateway.
```

第二种选择是将`istio-system`命名空间移到`system`项目中，默认情况下，`system`项目不在网络隔离范围内。
