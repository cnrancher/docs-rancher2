---
title: Rancher Desktop 上的 Rancher
description: 介绍在 Rancher Desktop 上安装 Rancher Dashboard 的步骤：
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
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - Rancher Dashboard
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

虽然 [Rancher](https://rancher.com/) 和 [Rancher Desktop](https://rancherdesktop.io/) 的名字里都包含 _Rancher_，但它们的功能是有差别的。Rancher Desktop 不是桌面版 Rancher。Rancher 是管理 Kubernetes 集群的强大解决方案，而 Rancher Desktop 运行本地 Kubernetes 和容器管理平台，这两种解决方案相辅相成。例如，你可以将 Rancher 作为工作负载安装在 Rancher Desktop 中。

本指南概述了使用 `container runtime` 或 `helm`（本地环境）在 Rancher Desktop 上安装 Rancher Dashboard 的步骤：

<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
{ label: 'helm', value: 'helm', },
]}>
<TabItem value="nerdctl">

```console
nerdctl run --privileged -d --restart=no -p 8080:80 -p 8443:443 rancher/rancher
```

</TabItem>
  <TabItem value="docker">

```console
docker run --privileged -d --restart=no -p 8080:80 -p 8443:443 rancher/rancher
```

</TabItem>
  <TabItem value="helm">

1：添加 Jetstack Chart：
```console
helm repo add jetstack https://charts.jetstack.io
```

2：添加最新的 Rancher Chart：
```console
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
```

3：创建 cert-manager 命名空间：
```console
kubectl create namespace cert-manager
```

4：安装 cert-manager 服务：
```console
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.7.1 --set installCRDs=true
```

5：创建 cattle-system 命名空间：
```console
kubectl create namespace cattle-system
```

6：安装 Rancher 应用程序：
```console
helm install rancher rancher-latest/rancher --namespace cattle-system --set hostname=rancher.rd.localhost --wait --timeout=10m
```

</TabItem>
</Tabs>

安装需要几分钟才能完成。安装后，你可以访问 Rancher UI，如下所示：
* 通过 `container runtime` 安装：[https://localhost:8443/](https://localhost:8443/)
* 通过 `helm` 安装：[https://rancher.rd.localhost/](https://rancher.rd.localhost/)

![](/img/rancherdesktop/examples/rancherUiWelcomePage.png)


<Tabs
defaultValue="nerdctl"
values={[
{ label: 'nerdctl', value: 'nerdctl', },
{ label: 'docker', value: 'docker', },
]}>
<TabItem value="nerdctl">

要访问 Rancher UI，你需要获取引导密码：

1：获取 Rancher UI 容器 ID/名称：
```console
nerdctl ps
```
2：获取引导密码：
```console
nerdctl logs [rancherContainerID] 2>&1 | grep "Bootstrap Password:"
```
3：引导密码示例：
```console
[INFO] Bootstrap Password: 7fwjjw4ldcmnq8ghns22q7nhl5lrznwwt9p9vjljfjc6tqbcvhxmwq
```

</TabItem>
  <TabItem value="docker">

要访问 Rancher UI，你需要获取引导密码：

1：获取 Rancher UI 容器 ID/名称：
```console
docker ps
```
2：获取引导密码：
```console
docker logs [rancherContainerID] 2>&1 | grep "Bootstrap Password:"
```
3：引导密码示例：
```console
[INFO] Bootstrap Password: 7fwjjw4ldcmnq8ghns22q7nhl5lrznwwt9p9vjljfjc6tqbcvhxmwq
```
</TabItem>
</Tabs>

按照向导说明并单击 `Continue` 以进入 Rancher UI 主页面。

![](/img/rancherdesktop/examples/rancherUiMainPage.png)

在 Rancher UI 中，你可以管理 local 集群、节点等。如需更多信息，请参阅 [Rancher 文档](https://rancher.com/docs/)。
