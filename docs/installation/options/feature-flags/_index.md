---
title: 启用实验功能
---

_自 v2.3.0 起可用_

Rancher 包含一些实验性质的功能，默认是被禁用的。你可能想要启用这些功能。例如，如果您决定使用的[Rancher 技术支持团队不支持的存储类型](/docs/installation/options/feature-flags/enable-not-default-storage-drivers/_index)所带来的好处大于风险，则可能需要启用这些未被测试过的功能。功能开关，使您可以尝试使用默认情况下未启用的功能。

可以通过三种方式启用这些功能：

- [启动 Rancher 时启用功能](#启动-rancher-时启用功能) 使用 CLI 安装 Rancher 时，可以使用功能开关默认启用这些功能。
- [在 Rancher UI 中启用功能](#通过-rancher-ui-启用功能) 在 Rancher v2.3.3+进入**设置**页面。
- [通过 Rancher API 启用功能](#通过-rancher-api-启用功能) 安装 Rancher 之后。

每个功能有两个值：

- 默认值，可以通过命令行配置一个标志或环境变量
- 设置值，可以通过 Rancher API 或 UI 配置

如果未设置任何值，则 Rancher 使用默认值

因为 API 设置了实际值，而命令行设置了默认值，所以这意味着，如果您使用 API 或 UI 启用或禁用功能，它将覆盖命令行设置的值。

例如，如果您安装 Rancher，然后使用 Rancher API 将功能开关设置为 true，然后通过命令行将功能开关设置为 false 来升级 Rancher，默认值仍然是 false，但是这个功能还是被启用的，因为它是通过 Rancher API 设置的。如果随后使用 Rancher API 删除了设置值（true），并将其设置为 NULL，则默认值（false）将生效。

以下是 Rancher 中可用的功能开关的列表：

- `unsupported-storage-drivers`: 启用[允许不受支持的存储驱动程序](/docs/installation/options/feature-flags/enable-not-default-storage-drivers/_index)。换句话说，它启用了默认情况下未启用的 storage providers 和 provisioners 的类型。
- `istio-virtual-service-ui`: 启用 Istio 的流量管理功能：[通过 UI 创建，读取，更新和删除 Istio 虚拟服务和目标规则](/docs/installation/options/feature-flags/istio-virtual-service-ui/_index)。

下表显示了在 Rancher 中功能开关的可用版本和默认值：

| 功能开关名                    | 默认值  | 状态   | 可用版本 |
| ----------------------------- | ------- | ------ | -------- |
| `unsupported-storage-drivers` | `false` | 实验性 | v2.3.0   |
| `istio-virtual-service-ui`    | `false` | 实验性 | v2.3.0   |
| `istio-virtual-service-ui`    | `true`  | GA     | v2.3.2   |

## 启动 Rancher 时启用功能

安装 Rancher 时，请使用功能开关启用所需的功能。该命令会有所不同，具体取决于您是高可用安装还是单节点安装。

> **注意：** 通过 Rancher API 设置的值将覆盖通过命令行传递的值。

### 高可用安装

当通过 Helm chart 安装 Rancher 时，请使用`--features`选项。在下面的示例中，通过传递功能开关名称（用逗号分隔）来启用两个功能：

```
helm install rancher-latest/rancher \
  --name rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set 'extraEnv[0].name=CATTLE_FEATURES' # 自 v2.3.0 起可用
  --set 'extraEnv[0].value=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true' # 自 v2.3.0 起可用
```

#### 在离线安装时渲染 Helm Chart

对于离线安装 Rancher，通过 Helm 安装 Rancher 之前，需要添加一个 Helm chart 仓库，渲染一个 Helm 模板。有关详细信息，请参阅[离线安装文档。](/docs/installation/other-installation-methods/air-gap/install-rancher/_index)

一个命令例子，在渲染 Helm 模板时传递功能开关名称。在下面的示例中，通过传递功能开关名称（用逗号分隔）来启用两个功能。

Helm 3 命令如下：

```
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
  --namespace cattle-system \
  --set hostname=<RANCHER.YOURDOMAIN.COM> \
  --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
  --set ingress.tls.source=secret \
  --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自 v2.2.0 起可用，配置 Rancher 使用默认的镜像仓库
  --set useBundledSystemChart=true # 自 v2.3.0 起可用，使用Rancher内嵌的system charts
  --set 'extraEnv[0].name=CATTLE_FEATURES' # 自 v2.3.0 起可用
  --set 'extraEnv[0].value=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true' # 自 v2.3.0 起可用
```

Helm 2 命令如下：

```
helm template ./rancher-<VERSION>.tgz --output-dir . \
  --name rancher \
  --namespace cattle-system \
  --set hostname=<RANCHER.YOURDOMAIN.COM> \
  --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
  --set ingress.tls.source=secret \
  --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 自 v2.2.0 起可用，配置 Rancher 使用默认的镜像仓库
  --set useBundledSystemChart=true # 自 v2.3.0 起可用，使用Rancher内嵌的system charts
  --set 'extraEnv[0].name=CATTLE_FEATURES' # 自 v2.3.0 起可用
  --set 'extraEnv[0].value=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true' # 自 v2.3.0 起可用
```

### 单节点安装

通过 Docker 安装 Rancher 时，请使用`--features`选项。在下面的示例中，通过传递功能开关名称（逗号分隔）来启用两个功能：

```
docker run -d -p 80:80 -p 443:443 \
  --restart=unless-stopped \
  rancher/rancher:rancher-latest \
  --features=<FEATURE-FLAG-NAME-1>=true,<FEATURE-NAME-2>=true # 自 v2.3.0 起可用
```

## 通过 Rancher UI 启用功能

_自 v2.3.3 起可用_

1. 转到**全局**视图，然后点击**系统设置**
1. 点击**功能选项**选项卡。你将看到一个实验功能列表。
1. 要启用功能，请转到要启用的禁用功能，然后单击 **省略号 (...) > 启用**。

**结果：** 该功能已启用。

## 通过 Rancher UI 禁用功能

_自 v2.3.3 起可用_

1. 转到**全局**视图，然后点击**系统设置**
1. 点击**功能选项**选项卡。你将看到一个实验功能列表。
1. 要启用功能，请转到要启用的禁用功能，然后单击 **省略号 (...) > 停用**。

**结果：** 该功能被禁用。

## 通过 Rancher API 启用功能

1. 转到 `<RANCHER-SERVER-URL>/v3/features`.
1. 在`data`部分，你将会看到一个包含所有可以使用功能开关启用功能的功能数组。功能名称在`id`字段中。单击要启用的功能的名称。
1. 在屏幕左上角，**Operations**下面，单击**Edit**.
1. 在 **Value** 下拉菜单, 单击 **True**。
1. 单击 **Show Request**。
1. 单击 **Send Request**。
1. 单击 **Close**。

**结果：** 该功能已启用。

## 通过 Rancher API 禁用功能

1. 转到 `<RANCHER-SERVER-URL>/v3/features`。
1. 在 `data` 部分, 你将会看到一个包含所有可以使用功能开关启用功能的功能数组。功能名称在`id`字段中。单击要启用的功能的名称。
1. 在屏幕左上角， **Operations** 下面， 单击**Edit**。
1. 在 **Value** 下拉菜单, 单击 **False**。
1. 单击 **Show Request**。
1. 单击 **Send Request**。
1. 单击 **Close**。

**结果：** 该功能被禁用。
