---
title: rdctl 命令参考
description: 介绍 rdctl 命令参考
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
  - rdctl 命令参考
  - rdctl 命令
  - rdctl
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`rdctl` 是包含在 Rancher Desktop 中的命令行工具，它能让你通过命令行访问 GUI 功能。`rdctl` 旨在帮助用户完成脚本（用于自动化、CI/CD）、故障排除、远程管理等任务。当前版本的 `rdctl` 支持以下命令（即将发布的版本中将支持更多命令）：

**:warning: 由于当前版本的 `rdctl` 是实验性的，因此所有子命令的名称、参数以及它们的输出可能会改变**。

**:warning: 你必须在主机上运行 Rancher Desktop 应用程序才能使用 `rdctl` 命令**。

**注意**：很多 `rdctl` 命令都有对应的 `API` 调用。下面列出了两种格式的可用命令。`api` 示例假定你使用 `curl` 作为与 API 对话的工具。

## rdctl 或 rdctl help

运行 `rdctl` 或 `rdctl help` 查看可用命令的列表：

```
> rdctl help
The eventual goal of this CLI is to enable any UI-based operation to be done from the command-line as well.

Usage:
  rdctl [command]

Available Commands:
  api           Runs API endpoints directly
  api /vX       Enables you to see the endpoints for a particular version; e.g., v0
  completion    Generates the autocompletion script for the specified shell
  help          Help about any command
  list-settings Lists the current settings
  set           Updates selected fields in the Rancher Desktop UI and restart the backend
  shell         Run an interactive shell or a command in a Rancher Desktop-managed VM
  shutdown      Shuts down the running Rancher Desktop application
  start         Start up Rancher Desktop or update its settings
  version       Shows the CLI version

Flags:
      --config-path string   config file (default C:\Users\GunasekharMatamalam\AppData\Roaming\rancher-desktop\rd-engine.json)
  -h, --help                 help for rdctl
      --host string          default is localhost; most useful for WSL
      --password string      overrides the password setting in the config file
      --port string          overrides the port setting in the config file
      --user string          overrides the user setting in the config file

Use "rdctl [command] --help" for more information about a command.
```

## rdctl api

运行 `rdctl api` 全局列出所有端点：

```
$ ../../../resources/darwin/bin/rdctl api / | jq -r .
[
  "GET /",
  "GET /v0",
  "GET /v0/settings",
  "PUT /v0/settings",
  "PUT /v0/shutdown"
]
```
## rdctl api /vX

运行 `rdctl api /v0` 列出指定版本的所有端点：

```
$ rdctl api /v0 | jq -r .
[
  "GET /v0",
  "GET /v0/settings",
  "PUT /v0/settings",
  "PUT /v0/shutdown"
]
```
## rdctl api /v0/settings

`rdctl api [endpoints]` 是对直接使用 API 的用户最有用的命令，因此它们不适合像 `rdctl set` 一样日常使用。例如：

以下命令

```
rdctl api /v0/settings --method PUT --body '{"kubernetes": {"enabled": false}}'
```

与以下命令是一样的：
```
rdctl set --kubernetes-enabled=false
```

只是它没那么简洁和用户友好。
## rdctl list-settings

<Tabs
groupId="command-reference"
defaultValue="CLI"
values={[
{ label: 'CLI', value: 'CLI', },
{ label: 'API', value: 'API', },
]}>
<TabItem value="CLI" default>

运行 `rdctl list-settings` 以查看当前的活动配置：

```
> rdctl list-settings
{
  "version": 4,
  "kubernetes": {
    "version": "1.22.7",
    "memoryInGB": 2,
    "numberCPUs": 2,
    "port": 6443,
    "containerEngine": "moby",
    "checkForExistingKimBuilder": false,
    "enabled": true,
    "WSLIntegrations": {},
    "options": {
      "traefik": true
    }
  },
  "portForwarding": {
    "includeKubernetesServices": false
  },
  "images": {
    "showAll": true,
    "namespace": "k8s.io"
  },
  "telemetry": true,
  "updater": true,
  "debug": false
}
```
</TabItem>
  <TabItem value="API" default>

调用以下 API 以查看当前的活动配置：

```
curl -s -H "Authorization: Basic $AUTH" http://localhost:6107/v0/settings -X GET
```

**注意**：`-X GET` 是可选的。你也可以单独使用前面的命令。

</TabItem>
</Tabs>

## rdctl set

<Tabs
groupId="command-reference"
defaultValue="CLI"
values={[
{ label: 'CLI', value: 'CLI', },
{ label: 'API', value: 'API', },
]}>
<TabItem value="CLI" default>

运行 `rdctl set [flags]` 来设置属性。在大多数情况下，Kubernetes 会在运行 `set` 命令时重置。你可以通过在单个命令中使用链接来设置多个属性。下面是一些参考示例：

```
> rdctl set --kubernetes-enabled=false
> rdctl set --container-engine docker --kubernetes-version 1.21.2
```
</TabItem>
  <TabItem value="API" default>

调用以下 API 来设置属性：

```
curl -s -H "Authorization: Basic $AUTH" http://localhost:6107/v0/settings -d '{ "kubernetes": { "containerEngine": "docker", "enabled": false, "version":"1.23.5" }}' -X PUT
```
</TabItem>
</Tabs>

## rdctl shutdown

<Tabs
groupId="command-reference"
defaultValue="CLI"
values={[
{ label: 'CLI', value: 'CLI', },
{ label: 'API', value: 'API', },
]}>
<TabItem value="CLI" default>

运行 `rdctl shutdown` 来正常关闭 Rancher Desktop：

```
> rdctl shutdown
Shutting down.
```

</TabItem>
  <TabItem value="API" default>


调用以下 API 来关闭 Rancher Desktop：

```
shutdown: curl -s -H "Authorization: Basic $AUTH" http://localhost:6107/v0/shutdown -X PUT
```
</TabItem>
</Tabs>

## rdctl start

<Tabs
groupId="command-reference"
defaultValue="CLI"
values={[
{ label: 'CLI', value: 'CLI', },
{ label: 'API', value: 'API', },
]}>
<TabItem value="CLI" default>

运行 `rdctl start` 来确保 Rancher Desktop 按照要求运行和配置：

```
> rdctl start --container-runtime dockerd -- kubernetes-version 1.19.3
```

</TabItem>
  <TabItem value="API" default>


调用以下 API 来确保 Rancher Desktop 按照要求运行和配置，请填写你的用户和密码：

```
curl -s -H "Authorization: Basic $(echo -n "user:PASSWORD" | base64)"
```
</TabItem>
</Tabs>

## rdctl version

运行 `rdctl version` 来查看当前 rdctl CLI 的版本：

```
> rdctl version
rdctl client version: 1.0.0, targeting server version: v0
```
