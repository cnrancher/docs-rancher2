---
title: 4. 添加带Istio sidecar 的部署和服务
description: 在命名空间中启用 Istio 后仅对新的工作负载启用自动 Sidecar 注入。要为现有工作负载启用 Envoy Sidecar，您需要为每个工作负载手动启用它。要将 Istio sidecar 注入命名空间中的现有工作负载，请转到工作负载页面，单击省略号 (...)，然后单击重新部署。重新部署工作负载时，Envoy sidecar 会自动注入。等待几分钟，以使工作负载升级到带有 Istio sidecar。单击该工作负载，然后转到容器部分。您应该能够在工作负载中看到 istio-init 和 istio-proxy 容器。这意味着已为工作负载启用了 Istio sidecar。Istio 正在为 Envoy sidecar 进行所有接线。现在，如果您通过 Yaml 中使用了 Istio 的功能，则 Istio 可以自动执行。
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
  - 集群管理员指南
  - 集群访问控制
  - 告警
  - Istio
  - Istio使用指南
  - 添加带Istio sidecar 的部署和服务
---

## 概述

在命名空间中启用 Istio 后仅对新的工作负载启用自动 Sidecar 注入。要为现有工作负载启用 Envoy Sidecar，您需要为每个工作负载手动启用它。

要将 Istio sidecar 注入命名空间中的现有工作负载，请转到工作负载页面，单击**省略号 (...)**，然后单击**重新部署**。重新部署工作负载时，Envoy sidecar 会自动注入。

等待几分钟，以使工作负载升级到带有 Istio sidecar。单击该工作负载，然后转到**容器**部分。您应该能够在工作负载中看到 istio-init 和 istio-proxy 容器。这意味着已为工作负载启用了 Istio sidecar。Istio 正在为 Envoy sidecar 进行所有接线。现在，如果您通过 Yaml 中使用了 Istio 的功能，则 Istio 可以自动执行。

> **先决条件：** 要为工作负载启用 Istio，集群和命名空间必须启用 Istio。

## 添加部署和服务

接下来，我们再添加 Istio 文档中的 BookInfo 示例应用程序相关的 Kubernetes 资源。

1. 进入要部署工作负载的项目中。
1. 在工作负载页面，单击**导入 YAML**。
1. 将以下资源复制到表单中。
1. 单击**导入**。

这将从 Istio 的 BookInfo 示例应用中设置以下资源：

Details 部署和服务:

- 一个名为`details`的 Service
- 一个名为`bookinfo-details`的 ServiceAccount
- 一个名为`details-v1`的 Deployment

Ratings 部署和服务:

- 一个名为`ratings`的 Service
- 一个名为`bookinfo-ratings`的 ServiceAccount
- 一个名为`ratings-v1`的 Deployment

Reviews 部署和服务（三个版本）：

- 一个名为`reviews`的 Service
- 一个名为`bookinfo-reviews`的 ServiceAccount
- 一个名为`reviews-v1`的 Deployment
- 一个名为`reviews-v2`的 Deployment
- 一个名为`reviews-v3`的 Deployment

Productpage 部署和服务:

这是应用程序的主页，可从网页浏览器中看到。其他服务将从此页面调用。

- 一个名为`productpage`的 Service
- 一个名为`bookinfo-productpage`的 ServiceAccount
- 一个名为`productpage-v1`的 Deployment

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

[设置 Istio 网关](/docs/cluster-admin/tools/istio/setup/gateway/_index)
