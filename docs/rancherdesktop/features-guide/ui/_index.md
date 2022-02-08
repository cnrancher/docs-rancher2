---
title: 仪表盘
description: UI
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - 仪表盘
---

Rancher Desktop 没有提供用于管理 Kubernetes 集群的仪表盘。默认情况下，你只能通过 kubectl、helm、nerdctl 管理 Rancher Desktop 创建的 Kubernetes 集群。

如果你想通过一个简洁的仪表盘来管理 Rancher Desktop 创建的 Kubernetes 集群，你可以使用 [Kube-explorer](https://github.com/cnrancher/kube-explorer)。

[Kube-explorer](https://github.com/cnrancher/kube-explorer) 是 Kubernetes 的可移植资源管理器，没有任何依赖关系。它集成了 Rancher steve 框架及其仪表板，并经过重新编译、打包、压缩，并提供了一个几乎完全无状态的 Kubernetes 资源管理器。

## 用法

请从 [kube-explorer release 页面](https://github.com/cnrancher/kube-explorer/releases)下载二进制文件。

运行 HTTP 的 Server：

```
./kube-explorer --http-listen-port=9898 --https-listen-port=0
```

然后，打开浏览器访问 http://x.x.x.x:9898 ，接下来你就可以通过一个非常简洁的仪表盘来管理你的 Kubernetes 集群了。

![Rancher Desktop UI](/img/rancherdesktop/rancherdesktop-ui.png)

> 注意：
> 如果你在 Windows 上安装 Rancher Desktop，你可以使用 [kubectl](https://github.com/cnrancher/kube-explorer/tree/main/deploy/kubectl) 方式来安装 kube-explorer。

更多安装方式，请参考 [kube-explorer](https://github.com/cnrancher/kube-explorer)。
