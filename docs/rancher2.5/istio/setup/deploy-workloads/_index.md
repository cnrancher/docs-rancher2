---
title: 使用Istio Sidecar添加部署和服务
description: 在命名空间中启用 Istio 后只会对新增的工作负载自动注入 sidecar。如果要为已有的工作负载启用 sidecar，需要重新部署该工作负载。
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
  - Istio
  - 使用Istio Sidecar添加部署和服务
---

## 前提条件

已在集群层级和命名空间层级安装 Istio。

## 为已有的工作负载配置 Istio sidecar

在命名空间中启用 Istio 后只会对新增的工作负载自动注入 sidecar。如果要为已有的工作负载启用 sidecar，需要重新部署该工作负载。

1. 从 **Cluster Explorer** 进入工作负载，单击 **&#8942;,** 并单击 **Redeploy**，重新部署工作负载

2. 在重新部署工作负载的过程中，它将自动注入 sidecar。

3. 等待几分钟后，工作负载将升级为拥有 istio sidecar。单击它并进入`container`部分。你应该可以看到`istio-proxy`和你原来的工作负载一起。

**结果：**已为现有的工作负载启用的 Istio sidecar。

## 添加部署和服务

有几种方法可以在你的命名空间中添加新的**部署**。

1. 从**集群资源管理器**中单击 “**工作负载 > 概述**”。
1. 单击**创建**
1. 从各种工作负载选项中选择**部署**。
1. 填写表格，或**编辑为 Yaml**。
1. 单击**创建**

或者，您可以进入 “**workload > specific workload**” ，选择您要部署的特定工作负载，并从那里创建。

在您的命名空间中添加一个**服务**。

1. 从**集群资源管理器**单击**服务发现>服务**。
1. 单击**创建**
1. 从各种选项中选择要创建的服务类型。
1. 填写表格，或**编辑为 Yaml**。
1. 单击**创建**

您也可以使用 kubectl **shell**创建部署和服务。

1. 如果您的文件存储在集群的本地，请运行`kubectl create -f <服务/部署文件的名称>.yaml`。
1. 或者运行`cat<< EOF | kubectl apply -f -`，将文件内容粘贴到终端，然后运行`EOF`完成命令。

## 部署和服务示例

接下来我们在 Istio 的文档中为 BookInfo 应用的示例部署和服务添加 Kubernetes 资源。

1. 从**集群资源管理器**，打开 kubectl **shell**。
1. 运行`cat<< EOF | kubectl apply -f -`。
1. 将以下资源复制到 shell 中
1. 运行 `EOF`。

这将设置 Istio 的示例 BookInfo 应用程序中的以下示例资源。

`details`服务和部署：

- `details` Service
- `bookinfo-details` 的 ServiceAccount。
- `details-v1`部署。

评级服务和部署：

- 一个 `ratings`Service
- `bookinfo-ratings`的 ServiceAccount。
- 一个`ratings-v1`部署

审查服务和部署（三个版本）：

- `reviews`Service
- 一个 `bookinfo-reviews`的 ServiceAccount。
- 一个 `reviews-v1` 部署
- 一个`reviews-v2`部署
- 一个`reviews-v3`部署

产品页面服务和部署：

这是应用程序的主页面，它将从 Web 浏览器中可见。其他服务将从这个页面调用。

- 一个 `productpage` 服务
- 一个`bookinfo-productpage`的 ServiceAccount
- 一个`productpage-v1` Deployment

## 资源 YAML

```yaml
# Copyright 2017 Istio Authors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

##################################################################################################
# Details service
##################################################################################################
apiVersion: v1
kind: Service
metadata:
  name: details
  labels:
    app: details
    service: details
spec:
  ports:
    - port: 9080
      name: http
  selector:
    app: details
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookinfo-details
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: details-v1
  labels:
    app: details
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: details
      version: v1
  template:
    metadata:
      labels:
        app: details
        version: v1
    spec:
      serviceAccountName: bookinfo-details
      containers:
        - name: details
          image: docker.io/istio/examples-bookinfo-details-v1:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---
##################################################################################################
# Ratings service
##################################################################################################
apiVersion: v1
kind: Service
metadata:
  name: ratings
  labels:
    app: ratings
    service: ratings
spec:
  ports:
    - port: 9080
      name: http
  selector:
    app: ratings
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookinfo-ratings
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ratings-v1
  labels:
    app: ratings
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ratings
      version: v1
  template:
    metadata:
      labels:
        app: ratings
        version: v1
    spec:
      serviceAccountName: bookinfo-ratings
      containers:
        - name: ratings
          image: docker.io/istio/examples-bookinfo-ratings-v1:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---
##################################################################################################
# Reviews service
##################################################################################################
apiVersion: v1
kind: Service
metadata:
  name: reviews
  labels:
    app: reviews
    service: reviews
spec:
  ports:
    - port: 9080
      name: http
  selector:
    app: reviews
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookinfo-reviews
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reviews-v1
  labels:
    app: reviews
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: reviews
      version: v1
  template:
    metadata:
      labels:
        app: reviews
        version: v1
    spec:
      serviceAccountName: bookinfo-reviews
      containers:
        - name: reviews
          image: docker.io/istio/examples-bookinfo-reviews-v1:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reviews-v2
  labels:
    app: reviews
    version: v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: reviews
      version: v2
  template:
    metadata:
      labels:
        app: reviews
        version: v2
    spec:
      serviceAccountName: bookinfo-reviews
      containers:
        - name: reviews
          image: docker.io/istio/examples-bookinfo-reviews-v2:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reviews-v3
  labels:
    app: reviews
    version: v3
spec:
  replicas: 1
  selector:
    matchLabels:
      app: reviews
      version: v3
  template:
    metadata:
      labels:
        app: reviews
        version: v3
    spec:
      serviceAccountName: bookinfo-reviews
      containers:
        - name: reviews
          image: docker.io/istio/examples-bookinfo-reviews-v3:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---
##################################################################################################
# Productpage services
##################################################################################################
apiVersion: v1
kind: Service
metadata:
  name: productpage
  labels:
    app: productpage
    service: productpage
spec:
  ports:
    - port: 9080
      name: http
  selector:
    app: productpage
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookinfo-productpage
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: productpage-v1
  labels:
    app: productpage
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: productpage
      version: v1
  template:
    metadata:
      labels:
        app: productpage
        version: v1
    spec:
      serviceAccountName: bookinfo-productpage
      containers:
        - name: productpage
          image: docker.io/istio/examples-bookinfo-productpage-v1:1.15.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 9080
---

```

## 后续操作

[设置 Istio 网关](/docs/rancher2.5/istio/setup/gateway/_index)
