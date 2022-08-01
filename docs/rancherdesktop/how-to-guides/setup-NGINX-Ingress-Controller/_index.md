---
title: 设置 NGINX Ingress Controller
description: 介绍如何使用 NGINX Ingress Controller 进行部署。
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
  - NGINX Ingress Controller
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Rancher Desktop 在后台使用 K3s，而 K3s 又使用 Traefik 作为 Kubernetes 集群的默认 Ingress Controller。但是，某些用例可能需要或更适合使用 NGINX。以下示例步骤展示了如何使用 NGINX Ingress Controller 进行部署。

### 步骤

1. 在 `Kubernetes Settings` 页面取消选中 `Enable Traefik` 来禁用 Traefik。你可能需要退出并重新启动 Rancher Desktop 才能使更改生效。

2. 通过 `helm` 或 `kubectl` 部署 NGINX Ingress Controller：

   <Tabs
   groupId="deployment-approach"
   defaultValue="helm"
   values={[
   { label: 'helm', value: 'helm', },
   { label: 'kubectl', value: 'kubectl', },
   ]}>
   <TabItem value="helm" default>

   ```
   helm upgrade --install ingress-nginx ingress-nginx \
   --repo https://kubernetes.github.io/ingress-nginx \
   --namespace ingress-nginx --create-namespace
   ```

   </TabItem>
   <TabItem value="kubectl">

   ```
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml
   ```

   </TabItem>
   </Tabs>

3. 等待 ingress pod 运行：

   ```
   kubectl get pods --namespace=ingress-nginx
   ```

4. 创建示例 deployment 和关联的 service：

   ```
   kubectl create deployment demo --image=nginx --port=80
   kubectl expose deployment demo
   ```

5. 创建 ingress 资源。以下命令使用了映射到 localhost 的主机：

   ```
   kubectl create ingress demo-localhost --class=nginx --rule="demo.localdev.me/*=demo:80"
   ```

6. 将本地端口转发到 Ingress Controller：

   ```
   kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80
   ```

现在，如果你访问 http://demo.localdev.me:8080/ ，你应该会看到 NGINX 的欢迎页面。
