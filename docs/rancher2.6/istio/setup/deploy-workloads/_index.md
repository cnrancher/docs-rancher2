---
title: 3. 使用 Istio Sidecar 添加部署和服务
weight: 4
---

> **先决条件**：要为工作负载启用 Istio，你必须先在集群和命名空间中安装 Istio 应用。

在命名空间中启用 Istio 只会为新工作负载启用自动 sidecar 注入。要为现有工作负载启用 Envoy sidecar，你需要手动为每个工作负载启用它。

要在命名空间中的现有工作负载上注入 Istio sidecar：

1. 点击左上角 **☰ > 集群管理**。
1. 在**集群**页面上，转到要可视化的集群，然后单击 **Explore**。
1. 点击**工作负载**。
1. 转到要注入 Istio sidecar 的工作负载，然后单击 **⋮ > 重新部署**。重新部署工作负载后，该工作负载会自动注入 Envoy sidecar。

等待几分钟，然后工作负载将升级并具有 Istio sidecar。单击它并转到**容器**。你应该能看到该工作负载旁边的 `istio-proxy`。这意味着为工作负载启用了 Istio sidecar。Istio 正在为 Sidecar Envoy 做所有的接线工作。如果你现在在 yaml 中启用它们，Istio 可以自动执行所有功能。

### 添加部署和服务

以下是在命名空间中添加新 **Deployment** 的几种方法：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**工作负载**。
1. 单击**创建**。
1. 点击 **Deployment**。
1. 填写表单，或**以 YAML 文件编辑**。
1. 单击**创建**。

要将 **Service** 添加到你的命名空间：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 点击**服务发现 > 服务**。
1. 单击**创建**。
1. 选择所需的服务类型。
1. 填写表单，或**以 YAML 文件编辑**。
1. 点击**创建**。

你还可以使用 kubectl **shell** 来创建 deployment 和 service：

1. 如果你的文件存储在本地集群中，运行 `kubectl create -f <name of service/deployment file>.yaml`。
1. 或运行 `cat<< EOF | kubectl apply -f -`，将文件内容粘贴到终端，然后运行 `EOF` 来完成命令。

### 部署和服务示例

接下来，我们为 Istio 文档中的 BookInfo 应用的示例部署和服务添加 Kubernetes 资源：

1. 点击 **☰ > 集群管理**。
1. 选择你创建的集群，并点击 **Explore**。
1. 在顶部导航栏中，打开 kubectl shell。
1. 运行 `cat<< EOF | kubectl apply -f -`。
1. 将以下资源复制到 shell 中。
1. 运行 `EOF`。

这将在 Istio 的示例 BookInfo 应用中设置以下示例资源：

Details 服务和部署：

- 一个 `details` Service。
- 一个 `bookinfo-details` 的 ServiceAccount。
- 一个 `details-v1` Deployment。

Ratings 服务和部署：

- 一个 `ratings` Service。
- 一个 `bookinfo-ratings` 的 ServiceAccount。
- 一个 `ratings-v1` Deployment。

Reviews 服务和部署（三个版本）：

- 一个 `reviews` Service。
- 一个 `bookinfo-reviews` 的 ServiceAccount。
- 一个 `reviews-v1` Deployment。
- 一个 `reviews-v2` Deployment。
- 一个 `reviews-v3` Deployment。

Productpage 服务和部署：

这是应用的主页，可以通过网络浏览器中查看。将从该页面调用其他服务。

- 一个 `productpage` service。
- 一个 `bookinfo-productpage` 的 ServiceAccount。
- 一个 `productpage-v1` Deployment。

### 资源 YAML

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

### 后续步骤
[设置 Istio Gateway]({{<baseurl>}}/rancher/v2.6/en/istio/setup/gateway)
