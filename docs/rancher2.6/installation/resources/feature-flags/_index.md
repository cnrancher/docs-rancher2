---
title: 启用实验功能
weight: 17
---
Rancher 包含一些默认关闭的实验功能。在某些情况下，例如当你认为使用[不支持的存储类型]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/enable-not-default-storage-drivers)的好处大于使用未经测试的功能的风险时，你可能想要启用实验功能。为了让你能够试用这些默认关闭的功能，我们引入了功能开关（feature flag）。

实验功能可以通过以下三种方式启用：

- [使用 CLI](#enabling-features-when-starting-rancher)：在使用 CLI 安装 Rancher 时，使用功能开关默认启用某个功能。
- [使用 Rancher UI](#enabling-features-with-the-rancher-ui)：在**设置**页面启用功能。
- [使用 Rancher API](#enabling-features-with-the-rancher-api)：安装 Rancher 后启用功能。

每个功能均有以下两个值：

- 默认值：可以通过在命令行使用标志或环境变量进行配置。
- 设置值：可以通过 Rancher API 或 UI 进行配置。

如果没有设置值，Rancher 会使用默认值。

设置值是通过 API 设置的，而默认值是通过命令行设置。因此，如果你使用 API 或 UI 启用或禁用某个功能，命令行中设置的值将被覆盖。

如果你安装 Rancher 后使用 Rancher API 将功能开关设置为 true，然后在使用命令升级 Rancher 时将功能开关设置为 false，在这种情况下，虽然默认值会是 false，但是该功能依然会被启用，因为它是通过 API 设置的。如果你随后使用 Rancher API 删除设置值（true）并将它设置为 NULL，则默认值（false）将生效。

> **注意**：某些功能需要重启 Rancher Server 容器才能生效。我们在文档的表格和 UI 中对这些功能进行了标记。

以下是 Rancher 中可用的功能开关列表：

- `harvester`：从 2.6.1 开始可用。Harvester 用于管理 Virtualization Management 页面的访问。用户可以在该页面直接导航到 Harvester 集群并访问 Harvester UI。详情请参见[本页]({{<baseurl>}}/rancher/v2.6/en/virtualization-admin/#feature-flag/)。
- `rke2`：我们已将配置 RKE2 集群的功能加入到技术预览。这个功能开关默认开启，即允许用户尝试配置此类集群。
- `fleet`：由于 Fleet 功能已应用到新的配置框架中，因此我们需要启用先前的 `fleet` 功能开关。如果你在早期版本中禁用了此功能开关，升级到 Rancher 2.6 后，该功能开关会自动启用。详情请参见[此页]({{<baseurl>}}/rancher/v2.6/en/deploy-across-clusters/fleet)。
- `continuous-delivery`：在 Rancher v2.5.x 中，Fleet 带有 GitOps 功能，该功能不能与 Fleet 分开禁用。在 Rancher 2.6 中，我们引入了 `continuous-delivery` 功能开关，让你可以单独禁用 Fleet 的 GitOps 功能。详情请参见[本页](./continuous-delivery)。
- `legacy`：Rancher 会逐渐淘汰之前版本中的某些功能，以实现功能迭代。此处包括已弃用，以及之后会转移到其他地方的功能。默认情况下，新安装会禁用此功能开关。如果你从先前的版本升级，此功能开关会启用。
- `token-hashing`：用于启动新的 token-hashing 功能。启用后，会使用 SHA256 算法对现有 Token 和所有新 Token 进行哈希处理。一旦对 Token 进行哈希处理，就无法撤消操作。该功能开关启用后无法被禁用。详情请参见[哈西处理 Token]({{<baseurl>}}/rancher/v2.6/en/api/api-tokens)。
- `unsupported-storage-drivers`：该功能[允许使用不支持的存储驱动]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/enable-not-default-storage-drivers)。换言之，此功能允许你使用默认情况下未启用的存储提供商和卷插件。
- `istio-virtual-service-ui`：此功能让你[启动用于管理 Istio 流量的 UI，其中包括创建、读取、更新和删除 Istio 虚拟服务（Virtual Service）和目标规则（Destination Rule）]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/istio-virtual-service-ui)。
- `multi-cluster-management`：用于配置和管理多个 Kubernetes 集群。此功能开关只能在安装时设置，之后不能更改。

下表介绍了 Rancher 中功能开关的可用版本和默认值：

| 功能开关名称 | 默认值 | 状态 | 可用于 | 是否需要重启 Rancher |
| ----------------------------- | ------------- | ------------ | --------------- |---|
| `istio-virtual-service-ui` | `false` | 实验功能 | v2.3.0 | |
| `istio-virtual-service-ui` | `true` | GA* | v2.3.2 | |
| `unsupported-storage-drivers` | `false` | 实验功能 | v2.3.0 | |
| `fleet` | `true` | GA* | v2.5.0 |   |
| `fleet` | `true` | 不能禁用 | v2.6.0 | N/A |
| `continuous-delivery` | `true` | GA* | v2.6.0 | |
| `token-hashing` | 新安装：`false`；升级：`true` | GA* | v2.6.0 | |
| `legacy` | 新安装：`false`；升级：`true` | GA* | v2.6.0 | |
| `multi-cluster-management` | `false` | GA* | v2.5.0 | |
| `harvester` | `true` | 实验功能 | v2.6.1 | |
| `rke2` | `true` | 实验功能 | v2.6.0 | |

\* 一般情况下可用。此功能包含在 Rancher 中，不是实验功能的。

## 启动 Rancher 时启用功能

安装 Rancher 时，使用功能开关启用你所需的功能。通过单节点容器安装 Rancher，和在 Kubernetes 集群上安装 Rancher 对应的命令有所不同。

### Kubernetes 安装的情况下启用功能

> **注意**：通过 Rancher API 设置的值会覆盖命令行传入的值。

使用 Helm Chart 安装 Rancher 时，使用 `--set` 选项。下面的示例通过传递功能开关名称（用逗号分隔）来启用两个功能：

```
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set 'extraEnv[0].name=CATTLE_FEATURES'
  --set 'extraEnv[0].value=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true'
```

注意：如果要安装 Alpha 版本，Helm 要求在命令中添加 `--devel` 选项。

### 离线安装的情况下渲染 Helm Chart

如果你是在离线环境安装 Rancher 的，在使用 Helm 安装 Rancher 之前，你需要添加一个 Helm Chart 仓库并渲染一个 Helm 模板。详情请参见[离线安装文档]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/air-gap/install-rancher)。

以下是在渲染 Helm 模板时传入功能开关名称的命令示例。下面的示例通过传递功能开关名称（用逗号分隔）来启用两个功能。

Helm 命令如下：

```
helm template rancher ./rancher-<VERSION>.tgz --output-dir . \
  --no-hooks \ # 避免生成 Helm 钩子文件
  --namespace cattle-system \
  --set hostname=<RANCHER.YOURDOMAIN.COM> \
  --set rancherImage=<REGISTRY.YOURDOMAIN.COM:PORT>/rancher/rancher \
  --set ingress.tls.source=secret \
  --set systemDefaultRegistry=<REGISTRY.YOURDOMAIN.COM:PORT> \ # 设置在 Rancher 中使用的默认私有镜像仓库
  --set useBundledSystemChart=true # 使用打包的 Rancher System Chart
  --set 'extraEnv[0].name=CATTLE_FEATURES'
  --set 'extraEnv[0].value=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true'
```

### Docker 安装的情况下启用功能

如果 Rancher 是使用 Docker 安装的，请使用 `--features` 选项。下面的示例通过传递功能开关名称（用逗号分隔）来启用两个功能：

```
docker run -d -p 80:80 -p 443:443 \
  --restart=unless-stopped \
  rancher/rancher:rancher-latest \
  --features=<FEATURE-FLAG-NAME-1>=true,<FEATURE-FLAG-NAME-2>=true
```


## 使用 Rancher UI 启用功能

1. 在左上角，单击 **☰ > 全局设置**。
1. 单击**功能开关**。
1. 如需启用某个功能，找到该已禁用的功能，并点击**⋮ > 激活**。

**结果**：该功能已启用。

### 使用 Rancher UI 禁用功能

1. 在左上角，单击 **☰ > 全局设置**。
1. 单击**功能开关**。你将看到实验功能列表。
1. 如需禁用某个功能，找到该已启用的功能，并点击**⋮ > 停用**。

**结果**：该功能已禁用。

## 使用 Rancher API 启用功能

1. 前往 `<RANCHER-SERVER-URL>/v3/features`。
1. 在 `data` 中，你会看到一个数组，该数组包含所有能通过功能开关启用的功能。功能的名称在 `id` 字段中。单击要启用的功能的名称。
1. 在左上角的 **Operations** 下，点击 **Edit**。
1. 在 **Value** 下拉菜单中，单击 **True**。
1. 单击 **Show Request**。
1. 单击 **Send Request**。
1. 点击 **Close**。

**结果**：该功能已启用。

### 使用 Rancher API 禁用功能

1. 前往 `<RANCHER-SERVER-URL>/v3/features`。
1. 在 `data` 中，你会看到一个数组，该数组包含所有能通过功能开关启用的功能。功能的名称在 `id` 字段中。单击要启用的功能的名称。
1. 在左上角的 **Operations** 下，点击 **Edit**。
1. 在 **Value** 下拉菜单中，单击 **False**。
1. 单击 **Show Request**。
1. 单击 **Send Request**。
1. 点击 **Close**。

**结果**：该功能已禁用。
