---
title: 回滚至 v2.0-v2.1 版本
description: Rancher 不再支持回滚到 Rancher v2.0-v2.1。这里保留了回滚到这些版本的说明，仅用于从 Rancher v2.0-v2.1 升级到 Rancher v2.2+ 失败的情况。
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
  - 备份
  - 回滚至 v2.0-v2.1 版本
---

Rancher 不再支持回滚到 Rancher v2.0-v2.1。这里保留了回滚到这些版本的说明，仅用于从 Rancher v2.0-v2.1 升级到 Rancher v2.2+ 失败的情况。

如果您需要执行的回滚属于以下类型，您必须遵循一些额外的说明，以使您的集群工作：

- 从 v2.1.6+回滚到 v2.1.0 - v2.1.5 或 v2.0.0 - v2.0.10 之间的任何版本。
- 从 v2.0.11+回滚到 v2.0.0 - v2.0.10 之间的任何版本。

由于针对[CVE-2018-20321](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-20321)进行了必要的更改，如果用户想要回滚到存在此漏洞的 Rancher 以前的版本，需要采取特殊步骤。步骤如下：

1. 记录每个集群的`serviceAccountToken`。请在具有`kubectl`访问 Rancher 管理平面的机器上保存以下脚本，并执行以下命令。你需要在运行 rancher 容器的机器上运行这些命令。确保在运行命令之前已经安装了 JQ。这些命令将根据您安装 Rancher 的方式而有所不同。

   **使用 Docker 安装的 Rancher**：

   ```bash
   docker exec <NAME OF RANCHER CONTAINER> kubectl get clusters -o json | jq '[. items[] | select(any(.status.conditions[]; .type == "ServiceAccountMigrated")) | {name: .metadata.name, token: .status.serviceAccountToken}]' > tokens.json。
   ```

   **安装在 Kubernetes 集群上的 Rancher**：

   ```bash
   kubectl get clusters -o json | jq '[.items[] | select(any(.status.conditions[]; .type == "ServiceAccountMigrated")) | {name: .metadata.name, token: .status.serviceAccountToken}]' > tokens.json
   ```

2. 执行该命令后，将创建一个`tokens.json`文件。请将此文件备份到安全的地方。**您将需要它来恢复 Rancher 回滚后集群的功能。**如果您丢失了这个文件，您可能会失去对集群的访问权限。

3. 按照[回滚说明](/docs/rancher2/upgrades/rollbacks/_index)回滚 Rancher。

4. 一旦 Rancher 恢复，Rancher 管理的每一个集群（除了导入的集群）都将处于`Unavailable` 不可用状态。

5. 根据您安装 Rancher 的方式应用备份的 token。

   **使用 Docker 安装的 Rancher**。

   将以下脚本保存为`apply_tokens.sh`到 Rancher docker 容器运行的机器上。同时将之前创建的`tokens.json`文件复制到与脚本相同的目录中。

   ```
   set -e
   tokens=$(jq .[] -c tokens.json)
   for token in $tokens; do
       name=$(echo $token | jq -r .name)
       value=$(echo $token | jq -r .token)
       docker exec $1 kubectl patch --type=merge clusters $name -p "{\"status\": {\"serviceAccountToken\": \"$value\"}}"
   done
   ```

   脚本允许执行(`chmod +x apply_tokens.sh`)，并执行脚本如下：

   ```
   ./apply_tokens.sh <DOCKER CONTAINER NAME>
   ```

   几分钟后，集群将从`Unavailable`不可用状态回到`Available`可用状态。

   **安装在 Kubernetes 集群上的 Rancher**。

   将下面的脚本保存为`apply_tokens.sh`，保存在有 kubectl 访问 Rancher controlplane 的机器上。同时将之前创建的`tokens.json`文件复制到与脚本相同的目录中。

   ```
   set -e
   tokens=$(jq .[] -c tokens.json)
   for token in $tokens; do
      name=$(echo $token | jq -r .name)
      value=$(echo $token | jq -r .token)
     kubectl patch --type=merge clusters $name -p "{\"status\": {\"serviceAccountToken\": \"$value\"}}"
   done
   ```

   设置脚本允许执行(`chmod +x apply_tokens.sh`)，并执行脚本如下。

   ```
   ./apply_tokens.sh
   ```

   几分钟后，集群将从`Unavailable`不可用状态回到`Available`可用状态。

6. 继续使用 Rancher。
