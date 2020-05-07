---
title: 回滚必读
description: 本节包含有关如何将 Rancher Server 回滚到以前版本的信息。
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
  - 升级和回滚
  - 回滚必读
---

本节包含有关如何将 Rancher Server 回滚到以前版本的信息。

- [回滚单节点 Rancher](/docs/upgrades/rollbacks/single-node-rollbacks/_index)
- [回滚高可用 Rancher](/docs/upgrades/rollbacks/ha-server-rollbacks/_index)

## 有关回滚的特殊情况

如果要在这两种情况下都还原到版本，则必须遵循一些额外的说明才能使集群正常工作。

- 从 v2.1.6+ 回滚到 v2.1.0-v2.1.5 或 v2.0.0-v2.0.10 之间的任何版本。
- 从 v2.0.11+ 回滚到 v2.0.0-v2.0.10 之间的任何版本。

由于要解决[CVE-2018-20321](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-20321)，因此如果用户需要回滚到存在此漏洞的 Rancher 的早期版本。则需要采取特殊步骤，步骤如下：

1. 记录每个集群的`serviceAccountToken`。为此，将以下脚本保存在运行 rancher 容器（单节点）或可以通过 kubectl 访问 Rancher 管理平面（高可用）的计算机上，并且运行它们。在运行命令之前，请确保已安装 了 JQ。这些命令取决于您的 Rancher 安装方式。

   **单节点 Rancher**

   ```
   docker exec <NAME OF RANCHER CONTAINER> kubectl get clusters -o json | jq '[.items[] | select(any(.status.conditions[]; .type == "ServiceAccountMigrated")) | {name: .metadata.name, token: .status.serviceAccountToken}]' > tokens.json
   ```

   **高可用 Rancher**

   ```
   kubectl get clusters -o json | jq '[.items[] | select(any(.status.conditions[]; .type == "ServiceAccountMigrated")) | {name: .metadata.name, token: .status.serviceAccountToken}]' > tokens.json
   ```

1. 执行命令后，将创建一个`tokens.json`文件。重要！在安全的地方备份此文件。**回滚 Rancher 后，需要使用它来恢复集群功能。如果丢失此文件，则可能无法访问集群。**

1. 按照[正常回滚流程](/docs/upgrades/rollbacks/_index)回滚 Rancher。

1. 一旦 Rancher 恢复正常，由 Rancher 管理的每个集群（导入集群除外）将处于`Unvailable`状态。

1. 根据您安装 Rancher 的方式应用备份的 tokens。

   **单节点 Rancher**

   将以下脚本另存为`apply_tokens.sh`，然后保存到运行 Rancher docker 容器的机器上。并且将先前创建的`tokens.json`文件复制到脚本所在的目录。

   ```
   set -e

   tokens=$(jq .[] -c tokens.json)
   for token in $tokens; do
       name=$(echo $token | jq -r .name)
       value=$(echo $token | jq -r .token)

       docker exec $1 kubectl patch --type=merge clusters $name -p "{\"status\": {\"serviceAccountToken\": \"$value\"}}"
   done
   ```

   允许执行脚本(`chmod +x apply_tokens.sh`)并执行脚本，如下所示：

   ```
   ./apply_tokens.sh <DOCKER CONTAINER NAME>
   ```

   片刻之后，集群将从`Unavailable`状态回到`Available`状态。

   **高可用 Rancher**

   将以下脚本另存为`apply_tokens.sh`，并复制到可以通过 kubectl 访问 Rancher 管理平面的计算机上。并且将先前创建的`tokens.json`文件复制到脚本所在的目录。

   ```
   set -e

   tokens=$(jq .[] -c tokens.json)
   for token in $tokens; do
       name=$(echo $token | jq -r .name)
       value=$(echo $token | jq -r .token)

   kubectl patch --type=merge clusters $name -p "{\"status\": {\"serviceAccountToken\": \"$value\"}}"
   done
   ```

   允许执行脚本(`chmod +x apply_tokens.sh`)并执行脚本，如下所示：

   ```
   ./apply_tokens.sh
   ```

   片刻之后，集群将从`Unavailable`状态回到`Available`状态。

1. 继续正常使用 Rancher。
