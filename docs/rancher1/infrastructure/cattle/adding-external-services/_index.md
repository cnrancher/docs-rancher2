---
title: 外部服务
---

您可能会有一些部署在 Rancher 之外的服务想要整合进 Rancher。您可以通过添加一个外部服务的功能将它添加到 Rancher 集群中。

### 在 UI 上添加外部服务

在您的应用上，您可以通过 **添加服务** 旁边的下拉菜单按钮添加外部服务。选择 **外部服务**。 或者您在应用层级的页面查看您的应用，同样存在相同的 **添加服务** 下拉菜单。

您将需要提供一个外部服务的 **名称**，如果需要的话，提供这个服务的 **描述**。

添加您想要的目标。您可以选择外部的 IP 或者域名。最后单击 **添加**。

外部服务的 IP 和域名会在服务中呈现。和 Rancher 的服务一样，您需要去启动一个外部服务。

#### 添加/删除外部服务目标

在任何时候您都可以编辑您外部服务中的服务目标。在外部服务的下拉菜单中单击 **编辑**，您可以添加或者移除目标。

### 使用 Rancher Compose 添加外部服务

在外部服务中，您可以设置外部 IP 地址 **或者** 域名。`rancher/external-service` 并不是一个真实的镜像，但在 `docker-compose.yml` 中是必要的。Rancher 不会为外部服务创建容器。

#### `docker-compose.yml`例子

```
version: '2'
services:
  db:
    image: rancher/external-service
  redis:
    image: redis
```

#### `rancher-compose.yml` 使用外部 IP 的例子

```
version: '2'
services:
  db:
    external_ips:
    - 1.1.1.1
    - 2.2.2.2

  # Override any service to become an external service
  redis:
    image: redis
    external_ips:
    - 1.1.1.1
    - 2.2.2.2
```

#### `rancher-compose.yml` 使用域名的例子

```
version: '2'
services:
  db:
```
