---
title: 原生 Kubernetes API
description:
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
  - API
  - API Tokens
  - API指南
  - API参考
  - API资源类型
---

Rancher UI 目前的 API 只支持一些常用资源处理，通过访问`https://rancher_url/v3/`可以查看到具体支持的类型。

但是对于像`ServiceAccount`之类的资源，可通过 Rancher UI 代理去访问 K8S 直连 API，接口地址为：`rancher_url/k8s/clusters/<集群ID>/api/<API版本>/<资源类型>`。

`ServiceAccount`可以通过 `rancher_url/k8s/clusters/<集群ID>/api/v1/serviceaccounts`去查看所有的`ServiceAccountList`，例如访问：`https://rancher_url/k8s/clusters/c-nlbtk/api/v1/serviceaccounts`，会返回如下结果：

```json
{
  "kind": "ServiceAccountList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/serviceaccounts",
    "resourceVersion": "9972577"
  },
  "items": [
    {
      "metadata": {
        "name": "default",
        "namespace": "cattle-logging",
        "selfLink": "/api/v1/namespaces/cattle-logging/serviceaccounts/default",
        "uid": "f570131c-f3eb-4018-8119-85c1544f5750",
        "resourceVersion": "3531475",
        "creationTimestamp": "2019-10-30T03:24:36Z"
      },
      "secrets": [
        {
          "name": "default-token-w6pjb"
        }
      ]
    },
```

您可以通过命名空间筛选 Service Account，例如：`https://rancher_url/k8s/clusters/<cluster——id>/api/v1/namespaces/cattle-logging/serviceaccounts`，`/namespaces/cattle-logging/serviceaccounts`是一种过滤方式，表示只返回该命名空间下的 Service Account 列表。

```json
{
  "kind": "ServiceAccountList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/namespaces/cattle-logging/serviceaccounts",
    "resourceVersion": "9973445"
  },
  "items": [
    {
      "metadata": {
        "name": "default",
        "namespace": "cattle-logging",
        "selfLink": "/api/v1/namespaces/cattle-logging/serviceaccounts/default",
        "uid": "f570131c-f3eb-4018-8119-85c1544f5750",
        "resourceVersion": "3531475",
        "creationTimestamp": "2019-10-30T03:24:36Z"
      },
      "secrets": [
        {
          "name": "default-token-w6pjb"
        }
      ]
    },
    {
      "metadata": {
        "name": "rancher-logging-fluentd",
        "namespace": "cattle-logging",
        "selfLink": "/api/v1/namespaces/cattle-logging/serviceaccounts/rancher-logging-fluentd",
        "uid": "9024070c-152c-4106-9571-e6503ce37cdf",
        "resourceVersion": "3531508",
        "creationTimestamp": "2019-10-30T03:24:41Z",
        "labels": {
          "app": "fluentd",
          "chart": "fluentd-0.0.2",
          "heritage": "Tiller",
          "io.cattle.field/appId": "rancher-logging",
          "release": "rancher-logging"
        }
      },
      "secrets": [
        {
          "name": "rancher-logging-fluentd-token-d7lww"
        }
      ]
    },
    {
      "metadata": {
        "name": "rancher-logging-log-aggregator",
        "namespace": "cattle-logging",
        "selfLink": "/api/v1/namespaces/cattle-logging/serviceaccounts/rancher-logging-log-aggregator",
        "uid": "f5d25650-acba-4e00-b0b0-723aa138b71f",
        "resourceVersion": "3531514",
        "creationTimestamp": "2019-10-30T03:24:41Z",
        "labels": {
          "app": "log-aggregator",
          "chart": "log-aggregator-0.0.2",
          "heritage": "Tiller",
          "io.cattle.field/appId": "rancher-logging",
          "release": "rancher-logging"
        }
      },
      "secrets": [
        {
          "name": "rancher-logging-log-aggregator-token-6pnsg"
        }
      ]
    }
  ]
}
```
