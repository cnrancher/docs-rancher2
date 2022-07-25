---
title: 配置脚本
description: 本指南将介绍如何为 macOS、Linux 和 Windows 主机设置脚本。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - Rancher Desktop
  - rancher desktop
  - rancherdesktop
  - RancherDesktop
  - 配置脚本
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

配置脚本可以覆盖 Rancher Desktop 的一些内部流程。例如，脚本可用于向 K3s 提供某些命令行参数、添加额外的挂载、增加 ulimit 值等。本指南将介绍如何为 macOS、Linux 和 Windows 主机设置脚本。

## macOS & Linux
在 macOS 和 Linux 上，你可以使用 lima override.yaml 来编写配置脚本。

- 在以下路径创建 `override.yaml` 文件。

<Tabs
defaultValue="macOS"
values={[
{ label: 'macOS', value: 'macOS', },
{ label: 'Linux', value: 'Linux', },
]}>
<TabItem value="macOS">

```
~/Library/Application Support/rancher-desktop/lima/_config/override.yaml
```

</TabItem>
  <TabItem value="Linux">

```
~/.local/share/rancher-desktop/lima/_config/override.yaml
```

</TabItem>
</Tabs>

- 在上一步中创建的 `override.yaml` 文件中编写配置脚本。例如，你可以使用以下脚本来增加容器的 ulimit：

```
provision:
- mode: system
  script: |
    #!/bin/sh
    cat <<'EOF' > /etc/security/limits.d/rancher-desktop.conf
    * soft     nofile         82920
    * hard     nofile         82920
    EOF
```
- 你还可以使用 `override.yaml` 来覆盖/修改 lima 配置设置。下面的示例创建了额外的挂载：
```
mounts:
  - location: /some/path
    writable: true
```

## Windows
**注意**：在 Windows 上，你只能为 1.1.0 或更高版本的 Rancher Desktop 使用这些配置脚本。

- 你需要至少运行 Rancher Desktop 一次以允许它创建配置。

- 打开 `%AppData%\\rancher-desktop\\provisioning` 目录。完整路径的示例：`C:\\Users\\Joe\\AppData\\Roaming\\rancher-desktop\\provisioning`。

- 请注意，任何文件扩展名为 `.start` 的文件（例如 `k3s-overrides.start`）都可以在 _Rancher Desktop 启动 Kubernetes 后端（如果启用）_ 时执行。此类文件将在 Rancher Desktop WSL 上下文中运行。

`.start` 文件的示例流程：
- Rancher Desktop 内部设置
- 运行配置脚本
- 在 UI 中启用 `dockerd` 或 `containerd`
- Kubernetes (K3s)

例如，使用 `%AppData%\\rancher-desktop\\provisioning\\insecure-registry.start` 将允许 `nerdctl` 默认使用不安全的镜像仓库：

```
#!/bin/sh

mkdir -p /etc/nerdctl
cat >  /etc/nerdctl/nerdctl.toml <<EOF
insecure_registry = true
EOF
```

- 请注意，文件扩展名为 `.stop` 的文件（例如 `wipe-data.stop`）可以在 _Rancher Desktop 关闭 Kubernetes 后端（如果启用）后_ 执行。此类文件将在相同的 Rancher Desktop WSL 上下文中运行。

`.stop` 文件的示例流程：
- 停止 `k3s`、`dockerd` 或 `containerd`
- 运行取消配置的脚本

**重要提示**：脚本需要以 Unix 行结尾保存，未完成行尾转换，且具有 DOS 行结尾的文件可能会产生意想不到的结果。你可以使用配置脚本更改的内容是有限制的。例如，你不能使用配置脚本更改 WSL2 上的硬 ulimit。请谨慎使用配置脚本，如果你对配置脚本有任何具体问题，请随时在 Slack/Github 上与 Rancher Desktop 团队联系。
