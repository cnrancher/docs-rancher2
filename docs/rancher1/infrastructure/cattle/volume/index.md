---
title: 数据卷
---

持久化卷是有状态应用中非常重要的一部分。Rancher 使您在多主机环境下使用卷变得非常容易。

#### 术语

`卷插件`和`卷驱动`同时在 Docker 和 Rancher 中使用。他们代表的是同一个东西: 一个[Docker 卷插件](https://docs.docker.com/engine/extend/plugins_volume/) 可以给一个 Docker 容器提供本地卷或者共享的持久化卷的支持。Rancher 卷插件(驱动)目前是以 Docker 卷插件的形式实现的。并且可以通过`docker volume`命令行来进行操作，但是这取决于存储技术。卷可以被环境中的某个主机，某些主机或者全部主机访问。Rancher 对跨主机使用共享卷的复杂过程进行了封装。例如:rancher-nfs, rancher-ebs 和 pxd (portworx)。

`存储驱动`是关于容器和镜像是如何在 Docker 主机上被存储的。例如:aufs, btrfs, zfs, devicemapper 等。这些驱动在 Rancher 的管控范围之外。Rancher UI 混合了这个术语，但实际上指的是`卷插件`和`卷驱动`。更多关于存储驱动的插件信息信息，请查看[这里](https://docs.docker.com/engine/userguide/storagedriver/imagesandcontainers/)。

### 管理卷

在这一部分，您将会了解如何创建一个可以被容器之间共享的持久化卷。在这里我们将专门使用[Rancher 命令行](/docs/rancher2/cli/)。

> **注意:** UI 可以用来管理除了由`local`卷驱动创建的卷。

#### 创建卷

您可以通过`rancher volume create`命令创建一个卷。

```bash
$ rancher volume create --driver local app-data
```

这将创建一个新的名为`app-data`的本地卷。名称必须由字母数字开头，后面可以接`a-z0-9`，`_` (下划线), `.` (点) 或者`-` (横杠)。

`--driver`参数用来指定使用哪个卷驱动。Docker 提供了一个`local`卷驱动。使用这个驱动的卷会将数据保存在主机的文件系统上，并且同一台主机上的任何容器都可以访问该数据。当使用`local`卷驱动时，其他主机上的任何容器都无法共享这个数据卷。

#### 列出卷

您可以列出环境中的卷。

```bash
$ rancher volume ls
```

如果您创建了一个`app-data`卷，您可能想知道为什么这个卷没有被列出来。您可以通过添加`--all`或者`-a`参数，来查看`inactive`的卷。

```bash
$ rancher volume ls --all
```

#### 删除卷

您可以通过`rancher volume rm`命令删除一个卷。

```bash
$ rancher volume rm app-data
```

#### 卷状态

卷有七个不同的状态:`inactive`, `activating`, `active`, `deactivating`, `detached`, `removing` 和 `removed`。

一个刚刚建好的卷的状态是`inactive`，直到有容器尝试挂载这个卷。

当容器创建时，关联的卷进入`activating`状态。一旦容器进入了`running`阶段，它等容器就会进入`active`状态。如果容器去挂载一个已经是`active`状态的卷，这并不会对该卷的状态产生影响。

当全部挂载了这个卷的容器都被开始删除了，这个卷进入`deactivating`状态。一旦容器被删除成功，卷进入`detached`状态。

当卷被标记为删除时，它进入一个`removing`状态。一旦数据被从主机上删除成功，它进入`removed`状态。被删除的卷不会出现在列出卷的结果里。但是它们将会继续在 Rancher API 里存在一段时间，这是为了调试和审计的目的。

### 卷作用域

卷可以有不同的作用域。这指的是 Rancher 管理卷的不同级别。

目前，您可以通过 Rancher Compose 文件来创建不同类型的卷。有作用域的卷必须定义在`docker-compose.yml`文件中最顶层的`volumes`部分。默认情况下，将创建应用栈级别的卷，但是您可以通过修改其值来创建不同作用域的卷。

如果最顶层的定义被遗漏了，卷的行为将会有所不同。请查看[更多](#V1和V2版本的Compose文件)详情。

通过 UI 您只能创建环境级别的卷。

#### 应用级别的卷

应用级别的卷是由创建它的应用来管理的。主要的好处是这种卷的生命周期是其应用生命周期的一部分，将由 Rancher 自动管理。

应用级别的存储卷，应用中的服务如果引用了相同的卷都将共享同一个存储卷。不在该应用内的服务则无法使用此存储卷。

Rancher 中，应用级别的存储卷的命名规则为使用应用名称为前缀来表明该卷为此应用独有，且会以随机生成的一组数字结尾以确保没有重名。在引用该存储卷时，您依然可以使用原来的卷名称。比如，如果您在应用 `stackA`中创建了一个名为`foo` 的卷， 您的主机上显示的卷名称将为`stackA_foo_<randomNumber>`，但在您的服务中，您依然可以使用`foo`。

##### 创建示例

下面的例子中，将会创建应用级别的卷`data`。

> **注意:** 因为在文件中最顶层的 volumes 部分不存在其他配置值，所以这个卷的级别为应用级。

```yaml
version: "2"
services:
  redis:
    image: redis:3.0.7
    volumes:
      - data:/data
volumes:
  data:
    driver: local
```

在上面的例子中，我们特意指定了卷驱动为`local`。默认情况下，卷驱动的值就是`local`。最简洁的定义`data`的方法是设置一个空值`{}`。请看下面的例子。

```yaml
volumes:
  data: {}
```

在通过 Rancher 命令行创建应用之后，您可以[列出卷](#列出卷)来确认`data`卷已经创建成功。这个卷的名称将为`<STACK_NAME>_data_<RANDOM_NUMBER>`。

> **注意:** 应用级别的卷可以被其他应用挂载。应用级别的卷并不是一种安全的机制。仅是为了管理卷的生命周期。

#### 环境级别的卷

环境级别的卷可能需要被环境中的全部容器共享。Rancher 会把容器调度到卷所在的主机，从而保证容器可以挂载这个卷。

环境级别的卷并不能在某个环境中的全部的主机上自动共享。您需要借助一个共享驱动(例如:`rancher-nfs`)来实现跨主机共享。这意味着一个由`local`卷驱动创建的环境级别卷只能在一台主机上被访问到，所以使用该卷的容器都会被调度到这台主机上。

您在创建一个使用环境级别卷的服务之前，Rancher 需要您先创建这个环境级别的卷。您可以使用任何配置好的卷驱动来创建卷。

环境级别卷的主要好处是，您可以轻松的在不同的服务应用之间共享数据。尤其是当这些应用和服务有着不同的生命周期需要被独立管理。用户可以对卷进行完全的[管控](#管理卷)

##### 共享的环境级别卷示例

首选，[创建一个环境级别的卷](#创建卷)从而使其他应用共享这个卷。

```bash
rancher volume create --driver local redis-data-external
```

为了创建一个环境级别的卷，在最顶层的 volume 部分，您需要添加`external: true`。

```yaml
version: "2"
services:
  redis:
    image: redis:3.0.7
    volumes:
      - redis-data-external:/data
volumes:
  redis-data-external:
    driver: local
    external: true # 如果没有这个定义，将会创建一个应用级别的卷。
```

> **注意:** 如果在 volume 中没有定义`external: true`，这个卷将会被创建为一个[应用级别的卷](#应用级别的卷).

在通过 Rancher 命令行创建应用之后，您可以[列出卷](#列出卷)来确认`redis-data-external`卷已经创建成功并且状态为`active`。

> **注意:** 对一个服务进行扩容和缩容的时候，将会挂载或卸载同一个共享的卷。

任何新的应用都可以挂载同一个`redis-data-external`卷。最简单的方法就是复制 compose 文件中最顶层的 volume 部分。

```yaml
volumes:
  redis-data-external:
    driver: local
    external: true
```

### V1 与 V2 版本的 Compose 对比

直到这里，我们讨论的一直是[Docker V2 Compose](https://docs.docker.com/compose/compose-file/compose-file-v2/#volumes-volume_driver)的卷。如果您没有在 V2 compose 文件中的最顶层定义 volumes，它将会按照 Docker V1 Compose 的方式来处理卷。

您也可能用到了[Docker V1 Compose](https://docs.docker.com/compose/compose-file/compose-file-v1/#volumes-volume_driver)。在 V1 compose 文件中，不支持最顶层的 volume 部分。所以这时卷只能被定义在服务里。Rancher 会把 V1 的卷定义直接传递给 Docker。所以，卷不会被自动删除同时也无法确保可以正常调度到卷所在的主机。为了解决这个在 V1 卷下的调度问题，您需要使用[调度标签](/docs/rancher1/infrastructure/cattle/scheduling/#字段-1)。

> **注意:** 请尽可能不要使用 V1 版本的 Compose。

#### V1 版本的 Compose 示例

注意这里没有 volumes 部分；这个配置在 V1 中不存在。

```yaml
etcd:
  image: rancher/etcd:v2.3.7-11
  volumes:
    - etcd:/pdata
```

#### V1 和 V2 版本的 Compose 文件

Docker compose 的 V2 版本是 V1 版本的超集；两个格式都可以被使用。我们先创建一个环境级别的卷。

```bash
rancher volume create --driver local etcd_backup
```

这个例子中，`etcd_backup`是一个 V2 的环境级别的卷，`etcd`是一个 V1 的卷。因为没有定义 volume，这隐式的将`etcd`设置为了 V1 的卷。

```yaml
version: "2"
services:
  etcd:
    image: rancher/etcd:v2.3.7-11
    environment:
      EMBEDDED_BACKUPS: "true"
      BACKUP_PERIOD: 5s
      BACKUP_RETENTION: 15s
    volumes:
      - etcd:/pdata
      - etcd_backup:/data-backup
volumes:
  etcd_backup:
    driver: local
    external: true
```

最后，如果您定义了一个空的 volumes，这个卷将会被视为一个 V1 卷。这等同于 yaml 中完全没有 volumes 这部分。

```
version: '2'
volumes: {}
```
