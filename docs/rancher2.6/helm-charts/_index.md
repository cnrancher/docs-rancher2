---
title: Rancher 中的 Helm Chart
weight: 11
---

在本节中，你将学习如何在 Rancher 中管理 Helm Chart 仓库和应用。你可以在**应用 & 应用市场**中管理 Helm Chart 仓库。它使用类似目录的系统从仓库中导入 Chart 包，然后使用这些 Chart 来部署自定义 Helm 应用或 Rancher 工具（例如监控和 Istio）。Rancher 工具以预加载仓库的方式提供，并能部署为独立的 Helm Chart 。其他仓库只会添加到当前集群。

### Rancher 2.6 变更

Rancher 2.6.0 实现了功能 Chart 的新版本控制方案。变更主要是 Chart 的主要版本和上游 Chart 的 +up 注释（如果适用）。

**主要版本**：Chart 的主要版本与 Rancher 次要版本相关联。当你升级到新的 Rancher 次要版本时，你应该确保你的所有**应用 & 应用商店** Chart 也升级到 Chart 的正确发行版本。

> **注意**：如果你的主要版本低于下表中提到的版本，则请使用 2.5 及以下版本。例如，建议你不要在 2.6.x+ 中使用 <100.x.x 版本的 Monitoring。

**功能 Chart**：

| **Name**                     | **支持的最低版本** | **支持的最高版本** |
| ---------------------------- | ------------------ | ------------------ |
| external-ip-webhook          | 100.0.0+up1.0.0    | 100.0.1+up1.0.1    |
| harvester-cloud-provider     | 100.0.0+up0.1.8    | 100.0.0+up0.1.8    |
| harvester-csi-driver         | 100.0.0+up0.1.9    | 100.0.0+up0.1.9    |
| rancher-alerting-drivers     | 100.0.0            | 100.0.1            |
| rancher-backups              | 2.0.0              | 2.1.0              |
| rancher-cis-benchmark        | 2.0.0              | 2.0.2              |
| rancher-gatekeeper           | 100.0.0+up3.5.1    | 100.0.1+up3.6.0    |
| rancher-istio                | 100.0.0+up1.10.4   | 100.1.0+up1.11.4   |
| rancher-logging              | 100.0.0+up3.12.0   | 100.0.1+up3.15.0   |
| rancher-longhorn             | 100.0.0+up1.1.2    | 100.1.1+up1.2.3    |
| rancher-monitoring           | 100.0.0+up16.6.0   | 100.1.0+up19.0.3   |
| rancher-sriov (experimental) | 100.0.0+up0.1.0    | 100.0.1+up0.1.0    |
| rancher-vsphere-cpi          | 100.0.0            | 100.1.0+up1.0.100  |
| rancher-vsphere-csi          | 100.0.0            | 100.1.0+up2.3.0    |
| rancher-wins-upgrader        | 100.0.0+up0.0.1    | 100.0.0+up0.0.1    |

</br>

**基于上游的 Chart**：对于基于上游的 Chart ，+up 注释用于表示 Rancher Chart 正在跟踪的上游版本。在升级时，请检查上游版本与 Rancher 的兼容性。

- 例如，用于 Monitoring 的 `100.x.x+up16.6.0` 跟踪上游 kube-prometheus-stack `16.6.0` 并添加了一些 Rancher 补丁。

- 在升级时，请确保你没有降级你正在使用的 Chart 版本。例如，如果你在 Rancher 2.5 中使用 Monitoring > `16.6.0` 版本，则不应升级到 `100.x.x+up16.6.0`。相反，你应该在下一个发行版中升级到适当的版本。

### Chart

从左上角的菜单中选择 _应用 & 应用市场_，然后你会转到 Chart 页面。

Chart 页面包含所有 Rancher、Partner 和自定义 Chart 。

- Rancher 工具（例如 Logging 或 Monitoring）包含在 Rancher 标签下
- Partner Chart 位于 Partner 标签下
- 自定义 Chart 将显示在仓库的名称下

所有这三种类型都以相同的方式部署和管理。

> 由 Cluster Manager （旧版 Rancher UI 中的全局视图）管理的应用应继续仅由 Cluster Manager 管理，而在新 UI 中使用<b>应用 & 应用市场</b>管理的应用则仅能由<b>应用 & 应用市场</b>管理。

### 仓库

从左侧边栏中选择 _仓库_。

这些项目代表 helm 仓库，可以是具有 index.yaml 的传统 helm 端点，也可以是被克隆并指向特定分支的 git 仓库。要使用自定义 Chart ，只需在此处添加你的仓库即可，它们将在仓库名称下的 Chart 选项卡中可用。

为 Helm Chart 仓库添加私有 CA：

- **基于 HTTP 的 Chart 仓库**：你必须将 DER 格式的 CA 证书的 base64 编码副本添加到 Chart 仓库的 spec.caBundle 字段，例如 `openssl x509 -outform der -in ca.pem | base64 -w0`。点击 Chart 仓库的**编辑 YAML** 并进行设置，如下所示：</br>
   ```
   [...]
   spec:
     caBundle:
   MIIFXzCCA0egAwIBAgIUWNy8WrvSkgNzV0zdWRP79j9cVcEwDQYJKoZIhvcNAQELBQAwPzELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRQwEgYDVQQKDAtNeU9yZywgSW5jLjENMAsGA1UEAwwEcm9vdDAeFw0yMTEyMTQwODMyMTdaFw0yNDEwMDMwODMyMT
   ...
   nDxZ/tNXt/WPJr/PgEB3hQdInDWYMg7vGO0Oz00G5kWg0sJ0ZTSoA10ZwdjIdGEeKlj1NlPyAqpQ+uDnmx6DW+zqfYtLnc/g6GuLLVPamraqN+gyU8CHwAWPNjZonFN9Vpg0PIk1I2zuOc4EHifoTAXSpnjfzfyAxCaZsnTptimlPFJJqAMj+FfDArGmr4=
   [...]
   ```

- **基于 Git 的 Chart 仓库**：目前无法添加私有 CA。对于具有私有 CA 证书的基于 git 的 Chart 仓库，你必须禁用 TLS 验证。单击 Chart 仓库的**编辑 YAML**，并添加键/值对，如下所示：
   ```
   [...]
   spec:
     insecureSkipTLSVerify: true
   [...]
   ```

> **注意**：带有身份验证的 Helm Chart 仓库
>
> 从 Rancher 2.6.3 开始，Repo.Spec 中添加了一个新值 `disableSameOriginCheck`。它允许用户绕过相同源的检查，将仓库身份验证信息作为基本 Auth 标头与所有 API 调用一起发送。不建议采用这种做法，但这可以用作非标准 Helm Chart 仓库（例如重定向到不同源 URL 的仓库）的临时解决方案。
>
> 要将此功能用于现有 Helm Chart 仓库，请单击 <b>⋮ > 编辑 YAML</b>。在 YAML 文件的 `spec` 部分，添加 `disableSameOriginCheck` 并将其设置为 `true`：
>
> ```yaml
> [...]
> spec:
>   disableSameOriginCheck: true
> [...]
> ```

### Helm 兼容性

仅支持 Helm 3 兼容 Chart 。

### 部署和升级

从 _Chart_ 选项卡中选择要安装的 Chart 。Rancher 和 Partner Chart 可能通过自定义页面或 questions.yaml 文件进行额外的配置，但所有 Chart 安装都可以修改 values.yaml 和其他基本设置。单击安装后，将部署一个 Helm 操作作业，并显示该作业的控制台。

要查看所有最近的更改，请转到 _最近的操作_ 选项卡。你可以查看已进行的调用、条件、事件和日志。

安装 Chart 后，你可以在 _已安装的应用_ 选项卡中找到该 Chart。在本节中，你可以升级或删除安装，并查看更多详细信息。选择升级时，呈现的形式和数值与安装相同。

大多数 Rancher 工具在 _应用 & 应用市场_ 下方的工具栏中都有额外的页面，以帮助你管理和使用这些功能。这些页面包括指向仪表盘的链接、可轻松添加自定义资源的表单以及其他信息。

> 如果你使用 _在升级前自定义 Helm 选项_ 来升级 Chart，如果你的 Chart 有不可更改的字段，使用 _--force_ 选项可能会导致错误。这是因为 Kubernetes 中的某些对象一旦创建就无法更改。要避免该错误，你可以：
>
> - 使用默认升级选项（即不要使用 _--force_ 选项）
> - 卸载现有 Chart 并安装升级后的 Chart
> - 在执行 _--force_ 升级之前删除集群中具有不可更改字段的资源

#### Rancher 2.6.3 变更

**应用 & 应用市场 > 已安装的应用**页面中，旧版应用的升级按钮已被移除。

如果你安装了旧版应用并想要升级它：

- 必须开启旧版[功能开关]({{<baseurl>}}/rancher/v2.6/en/installation/resources/feature-flags/)（如果在升级前有旧版应用导致该开关未自动开启）
- 你可以从 cluster explorer 升级应用，从左侧导航部分选择**旧版 > 项目 > 应用**
- 对于多集群应用，你可以转到 **≡ > 多集群应用**并在那里升级应用
