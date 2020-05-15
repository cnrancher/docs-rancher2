---
title: 如何在国内使用 Rancher
description: Rancher 允许您设置许多配置组合。有些配置更适合于开发和测试，而对于生产环境，还有其他一些最佳实践可以获得最大的可用性和容错能力。生产应该遵循以下最佳实践。这些建议可以帮助您在问题发生之前解决它们。
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
  - 最佳实践
  - 如何在国内使用Rancher
---

在我们的技术社区中，我们常常收到这样的抱怨：从 Github 上下载资源慢、拉镜像十分耗时、无法使用 library 和 system-library 等。这些大大降低了国内用户的 Rancher 使用体验。

为了改善大家的使用体验，我们针对以上问题分别提出了解决方法。

## 使用国内资源下载 Rancher 组件

我们已经将 Rancher 的常用组件放在国内服务器上，访问http://mirror.cnrancher.com 即可下载所需的组件，从此告别`failed: Operation timed out`

![rancher-mirror](/img/rancher/expansion/007S8ZIlly1gejvtmh6w3j31sx0u0q3j.jpg)

## 使用阿里云镜像仓库搭建 Rancher

我们已经在阿里云镜像仓库中同步了一份原版的镜像，仓库地址: `registry.cn-hangzhou.aliyuncs.com`

> 注意：阿里云镜像仓库中的 rancher 镜像不支持使用 `latest` `stable`等 tags，必须指定版本号，例如`v2.4.2`

接下来，我们来 demo 如何操作：

1. 使用阿里云镜像仓库的 rancher 镜像启动 rancher

```bash
# docker run -itd -p 80:80 -p 443:443 \
    --restart=unless-stopped \
    -e CATTLE_AGENT_IMAGE="registry.cn-hangzhou.aliyuncs.com/rancher/rancher-agent:v2.4.2" \
    registry.cn-hangzhou.aliyuncs.com/rancher/rancher:v2.4.2
```

- `CATTLE_AGENT_IMAGE:` 指定 rancher-agent 的镜像名称

2. 设置默认镜像仓库

从 UI 导航到`Settings`，然后编辑`system-default-registry`，Value 设置为`registry.cn-hangzhou.aliyuncs.com`

![system-registry](/img/rancher/expansion/007S8ZIlly1gek021xwzij31tq0k8gm1.jpg)

- `system-default-registry:` 参数请参考[官方文档](/docs/admin-settings/config-private-registry/_index)

1. 接下来我们就可以按照官方文档去[添加自定义集群](/docs/cluster-provisioning/rke-clusters/custom-nodes/_index)，我们只需要等待集群启动成功即可。下图中列出了 system-project 中所有的 workload，这些 workload 均使用了阿里云的镜像仓库`registry.cn-hangzhou.aliyuncs.com`内的镜像

![system-workload](/img/rancher/expansion/007S8ZIlly1gejx15bo0yj313f0u00y5.jpg)

仅需 3-5 分钟就能完成整个集群的搭建，将大幅节省时间，提高工作效率。

## 应用商店默认地址`timeout`

Rancher 默认使用 github 上的 repo 作为应用商店的 URL，如果出现`timeout`情况，可以将`Catalog URL`替换成我们国内的码云地址。

每个 repo 的对应关系如下：

| 应用商店地址                         | Rancher repo 地址                        | Gitee 地址                              |
| ------------------------------------ | ---------------------------------------- | --------------------------------------- |
| https://git.rancher.io/helm3-charts  | https://github.com/rancher/helm3-charts  | https://gitee.com/rancher/helm3-charts  |
| https://git.rancher.io/charts        | https://github.com/rancher/charts        | https://gitee.com/rancher/charts        |
| https://git.rancher.io/system-charts | https://github.com/rancher/system-charts | https://gitee.com/rancher/system-charts |

**如何修改`Catalog URL`：**

1. 导航到全局或项目级别的`Apps` -> `Manage Catalogs`
2. 点击列表右侧的省略号 -> `Edit`
3. 将`Catalog URL`替换成码云中的地址即可，`Save`
4. 此时，对应的 Catalog 的状态变为了`Refreshed`，等待变为`Active`之后即可正常使用

## 创建自定义集群，`Kubernetes Version`显示为空

每次启动 Rancher 都会到 github 上拉取[kontainer-driver-metadata](https://github.com/rancher/kontainer-driver-metadata.git)，如果拉取的慢，会导致创建在创建自定义集群时`Kubernetes Version`显示为空：

![kontainer-driver-metadata](/img/rancher/expansion/007S8ZIlly1get57kqscwj31nk0jo0t6.jpg)

要解决这个问题只需要参考[获取新的 Kubernetes 版本](/docs/admin-settings/k8s-metadata/_index)将 rke-metadata-config 地址修改成[gitee](https://gitee.com/rancher/kontainer-driver-metadata/)上的地址即可，例如：

```bash
{
  "refresh-interval-minutes": "1440",
  "url": "https://gitee.com/rancher/kontainer-driver-metadata/raw/dev-v2.4/data/data.json"
}
```

:::note 注意
修改`rke-metadata-config`地址时，需要对应版本号，一定要和默认地址中的版本号对应上，本例的版本号是`v2.4`。
:::

## 同步说明

以上提到的资源，我们会通过定时任务每天从 Github 上拉取，同步到国内。也许存在延迟或同步失败的情况，如果发现任何问题，欢迎在微信技术交流群或官方论坛中向我们反馈。
