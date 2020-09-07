---
title: Using Rancher NFS
---

Rancher 支持将 NFS 卷作为容器的一个存储选项

### 使用 NFS 之前的准备工作

在部署 Rancher NFS 驱动之前，您需要先准备一个 NFS 服务器。例如，您可以使用如下命令在 Ubuntu 16.04 上安装 NFS 服务器。

```
sudo apt-get update
sudo apt-get install nfs-kernel-server
```

在这个服务器上，您需要设置一个基础目录。首选，您需要创建一个共享目录。

```
sudo mkdir /nfs
sudo chown nobody:nogroup /nfs
```

修改 exports 文件(`/etc/exports`).

```
/nfs    *(rw,sync,no_subtree_check,no_root_squash)
```

在全部修改完成后，您需要重新启动 NFS 内核服务器。

```
sudo systemctl restart nfs-kernel-server
```

### 在 Amazon EFS 上使用 Rancher NFS 驱动

Rancher 的 NFS 驱动可以连接 Amazon 的 EFS。当我们在 Amazon EFS 上使用 Rancher NFS 驱动时，环境内全部的主机都需要是 EC2 主机，并且这些主机要部署在与 EFS 所在区域相同的同一个可用区内。

### 配置 Rancher NFS

当设置一个[环境模版](/docs/rancher1/configurations/environments/_index#什么是环境模版)的时候，您可以选择启用**Rancher NFS**应用，这样以后用这个模版创建的环境都会包括 Rancher 的 NFS 服务。

或者，如果您已经设置好了一个环境，您可以在[应用商店](/docs/rancher1/configurations/catalog/_index)中找到并部署 Rancher NFS 服务。

> **注意:** 某些存储服务可能与容器编排引擎不兼容(例如 Kubernetes)。环境模版会根据您选择的编排引擎显示其兼容的存储服务。但是在应用商店中可以看到全部的应用，不会按照编排引擎进行过滤。

为了部署 Rancher NFS，您需要指定如下配置:

- **NFS Server**: NFS 服务器的 IP 地址或者主机名称
- **Export Base Directory**: NFS 服务器输出的共享目录
- **NFS Version**: 您所用的 NFS 版本，当前使用的是版本 4
- **Mount Options**: 用逗号分隔的默认挂载选项， 例如: 'proto=udp'. 不要配置`nfsvers`选项，这个选项会被忽略。
- **On Remove**: 当移除 Rancher NFS 卷的时候，底层数据是否应该被保留或者清理。选项有`purge`和`retain`，默认值为`purge`。从 Rancher 1.6.6 开始支持。

### Rancher NFS 驱动选项

当通过 Rancher NFS 驱动创建卷时，您可以通过一些选项来自定义自己的卷。这些选项是一些键值对，可以通过 UI 的驱动选项添加，也可以通过 compose 文件的`driver_opts`属性来添加。

#### 驱动选项

- **Host** - (`host`): NFS 主机
- **Export** - (`export`): 当一个卷配置了 host 和 export，将不会创建子文件夹，export 的根目录将会被挂载。
- **Export Base** - (`exportBase`): 默认情况下，卷可以配置 host 和 export base，这样会在 NFS 服务器上创建一个名字唯一的子文件夹。
- **Mount Options** - (`mntOptions`): 用逗号分隔的默认挂载选项。
- **On Remove** - (`onRemove`): 当移除 Rancher NFS 卷的时候，底层数据是否应该被保留或者清理。选项有`purge`和`retain`，默认值为`purge`。从 Rancher 1.6.6 开始支持。

### 在 UI 中使用 Rancher NFS

#### 创建卷

当**Rancher NFS**在 Rancher 中部署成功后，您还需要在**基础架构** -> **存储**里创建 NFS 卷，之后才可以在服务中使用 NFS 卷。

1. 点击**添加卷**。
2. 输入在服务中使用的卷的名称。
3. 可选: 添加额外的驱动选项。

#### 在服务中使用卷

一旦卷在 UI 中被创建成功，您可以在[服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)中使用这个共享存储了。当创建一个服务时，在**卷**页签，可以输入**卷**和**卷驱动**。

**volume**的语法格式与 Docker 相同，`<volume_name>:</path/in/container>`。Docker 的卷默认是以读写模式进行挂载的，但是您可以通过在卷结尾处添加`:ro`使其以只读的模式进行挂载。

**卷驱动**和存储驱动的名字一致，为存储驱动的应用名。默认情况下，**Rancher NFS** 存储驱动名称为`rancher-nfs`。

### 在 Compose 文件中使用 Rancher NFS

在基础设施应用中的**Rancher NFS**启动后，您可以开始在 Compose 文件中创建卷了。

在 Docker Compose 文件中`volumes`下可以定义卷。在同一个 Docker Compose 中每个卷可以和多个服务关联。

> **注意:** 此功能只在 Compose v2 格式下生效。

#### NFS 卷示例

在这里例子中，我们将创建一个 NFS 卷同时创建使用这个卷的服务。所有该应用中的服务将共享同一个卷。

```
version: '2'
services:
  foo:
    image: alpine
    stdin_open: true
    volumes:
    - bar:/data
volumes:
  bar:
    driver: rancher-nfs
```

#### 使用 host，exportBase 和 export 的示例

下面的例子展示了如何在某个服务中，覆盖`host`和`exportBase`。

```
version: '2'
services:
  foo:
    image: alpine
    stdin_open: true
    volumes:
    - bar:/data
volumes:
  bar:
    driver: rancher-nfs
    driver_opts:
      host: 192.168.0.1
      exportBase: /thisisanothershare
```

您也可以给每个卷使用不同的`exportBase`，请看下面的例子。

```
version: '2'
services:
  foo:
    image: alpine
    stdin_open: true
    volumes:
    - bar:/bardata
    - baz:/bazdata
volumes:
  bar:
    driver: rancher-nfs
    driver_opts:
      host: 192.168.0.1
      exportBase: /thisisanothershare
  baz:
    driver: rancher-nfs
    driver_opts:
      host: 192.168.0.1
      exportBase: /evenanothershare
```

### Rancher NFS 使用 AWS EFS

在 AWS 上创建 EFS 文件系统之后，您可以部署 Rancher NFS 驱动来使用这个 EFS 文件系统。因为亚马逊 EFS 只在内部可达，所以只有与 EFS 在同一个可用区内的 EC2 主机可以访问 EFS。因此，在创建存储驱动之前，您需要先添加 EC2 主机到 Rancher 环境中。

您可以使用下面的选项来部署 Rancher NFS:

- **NFS Server**: `xxxxxxx.efs.us-west-2.amazonaws.com`
- **Export Base Directory**: `/`
- **NFS Version**: `nfsvers=4`

### 在移除卷时保留数据

驱动选项`onRemove`的默认值为`purge`。这意味着，当从 Rancher 中删除这个卷的时候，底层的数据也会被删除。如果您想要保留底层数据，您可以将这个选项设置为`retain`。您也可以给每个卷设置不同的`onRemove`值。如果 nfs-driver 选项`onRemove`被设置为`retain`，但是您想要在某个卷在 Rancher 中被删除时清理掉这个卷的底层数据，您可以通过`docker-compose.yml`在这个卷的`driver_opts`下面设置`onRemove: purge`。示例入下。

```
services:
  foo:
    image: alpine
    stdin_open: true
    volumes:
    - bar:/data
volumes:
  bar:
    driver: rancher-nfs
    driver_opts:
      onRemove: purge
```

如果 nfs-driver 选项`onRemove`被设置为`purge`，您可以在卷的`driver_opts`里设置`onRemove: retain`来保留数据，这样当这个卷在 Rancher 中被移除时，数据将会被保留下来。

```
services:
  foo:
    image: alpine
    stdin_open: true
    volumes:
    - bar:/data
volumes:
  bar:
    driver: rancher-nfs
    driver_opts:
      onRemove: retain
```

> **注意:** 创建一个外部卷的时候，如果卷的名称和之前被删除的卷的名称相同，并且这个被删除的卷的数据被保留着，这时使用这个卷的容器可以访问被先前保留的数据。
