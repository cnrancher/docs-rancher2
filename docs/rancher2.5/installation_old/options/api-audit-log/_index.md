---
title: 启用API审计日志记录系统事件
description: 启用 API 审计日志，系统会将每个用户发起的系统事件信息记录下来。您可以知道发生了什么事件、事件的发生时间、事件的发起人是谁和事件对集群的影响。您可以在 Rancher 安装或升级时开启 API 审计日志功能，开启特性后，所有 Rancher API 的请求和响应信息都会写入到日志文件中。
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
  - 安装指南
  - 资料、参考和高级选项
  - 启用API审计日志记录系统事件
---

启用 API 审计日志，系统会将每个用户发起的系统事件信息记录下来。您可以知道发生了什么事件、事件的发生时间、事件的发起人是谁和事件对集群的影响。您可以在 Rancher 安装或升级时开启 API 审计日志功能，开启特性后，所有 Rancher API 的请求和响应信息都会写入到日志文件中。

## 开启 API 审计日志

您可以向 Rancher Server 容器中传入环境变量，开启和配置审计日志功能。请参考以下链接，在安装时开启该特性。

- [Rancher 单节点](/docs/rancher2.5/installation/other-installation-methods/single-node-docker/_index)

- [Rancher 高可用](/docs/rancher2.5/installation/options/chart-options/_index)

## API 审计日志选项

### 审计日志内容和规则

以下定义了有关审计日志记录的内容以及包含哪些数据的规则：

| 参数                                  | 描述                                                                                                                                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="audit-level"></a>`AUDIT_LEVEL` | `0` - 禁用审计日志 (默认设置)<br/>`1` - 仅记录事件元数据 <br/>`2` - 记录事件元数据及请求内容 <br />`3` - 记录事件元数据、请求内容及响应内容。请求/响应对的每个日志事务使用相同的`auditID`值<br/><br/> 有关显示每个等级设置记录的具体内容，请参阅[审计日志级别](#审计日志级别)。 |
| `AUDIT_LOG_PATH`                      | Rancher Server API 日志记录在容器内的目录位置。审计日志在容器内的默认路径为`/var/log/auditlog/rancher-api-audit.log`。您可以将日志目录挂载到主机。<br/><br/>例如: `AUDIT_LOG_PATH=/my/custom/path/`<br/>                                                                        |
| `AUDIT_LOG_MAXAGE`                    | 定义保留旧审计日志文件的最大天数。默认 10 天。                                                                                                                                                                                                                                  |
| `AUDIT_LOG_MAXBACKUP`                 | 定义保留的审计日志最大文件个数，默认 10。                                                                                                                                                                                                                                       |
| `AUDIT_LOG_MAXSIZE`                   | 定义单个审计日志文件的最大值(以兆为单位)。默认 100M。                                                                                                                                                                                                                           |

### 审计日志级别

下面显示了每个[`AUDIT_LEVEL`](#审计日志级别)设置，记录的 API 事务具体内容。

| `AUDIT_LEVEL` 设置 | 请求元数据 | 请求正文内容 | 响应元数据 | 响应正文内容 |
| ------------------ | ---------- | ------------ | ---------- | ------------ |
| `0`                |            |              |            |              |
| `1`                | ✓          |              |            |              |
| `2`                | ✓          | ✓            |            |              |
| `3`                | ✓          | ✓            | ✓          | ✓            |

## 查看 API 审计日志

### Rancher 单节点

与主机系统共享`AUDIT_LOG_PATH`目录（默认目录：`/var/log/auditlog`）。日志可以通过标准的 CLI 工具进行查看，也可以转发到日志收集工具，例如 Fluentd, Filebeat, Logstash 等。

### Rancher 高可用

使用 Helm Chart 安装 Rancher 时启用 API 审计日志功能，会在 Rancher Pod 中创建一个`rancher-audit-log`的 sidecar 容器。该容器会将 API 审计日志发送到标准输出(stdout)。您可以像查看任何容器日志一样查看审计日志内容。

`rancher-audit-log` 容器位于 `rancher` pod 所在的 `cattle-system` 命名空间中。

#### 通过 CLI 查看

```bash
kubectl -n cattle-system logs -f rancher-84d886bdbb-s4s69 rancher-audit-log
```

#### 通过 Rancher GUI 查看

1. 在下拉菜单中，选择 **Cluster: local > System**。

   ![Local Cluster: System Project](/img/rancher/audit_logs_gui/context_local_system.png)

1. 在主导航栏中，选择 **资源 > 工作负载** (在 v2.3.0 之前的版本, 在主导航栏中选择 **工作负载** )。找到 `cattle-system` 命名空间。找到 `rancher` 工作负载，单击它的链接。

   ![Rancher Workload](/img/rancher/audit_logs_gui/rancher_workload.png)

1. 选择一个 `rancher` Pod 并选择 **省略号 (...) > 查看日志** 来查看 rancher Pod 日志。

   ![View Logs](/img/rancher/audit_logs_gui/view_logs.png)

1. 从 **日志** 下拉菜单中, 选择 `rancher-audit-log`.

   ![Select Audit Log](/img/rancher/audit_logs_gui/rancher_audit_log_container.png)

#### 收集审计日志

可以为集群启用 Rancher 的内置日志收集功能，将审计和其他服务日志发送到受支持的日志收集服务端。
详情请参考[Rancher 工具 - 日志](/docs/rancher2.5/logging/2.0.x-2.4.x/project-logging/_index)。

## 审计日志样本

启用审核后，Rancher 以 JSON 的形式记录每个 API 请求或响应。以下每个代码示例都提供了如何标识每个 API 事务的示例。

### 元数据级别

如果设置了 `AUDIT_LEVEL` 为 `1`, Rancher 会记录每个 API 请求的元数据请求头，但不会记录正文。请求头提供有关 API 事务的基本信息，例如事务的 ID，发起事务的用户，事件发生的时间等。

```json
{
  "auditID": "30022177-9e2e-43d1-b0d0-06ef9d3db183",
  "requestURI": "/v3/schemas",
  "sourceIPs": ["::1"],
  "user": {
    "name": "user-f4tt2",
    "group": ["system:authenticated"]
  },
  "verb": "GET",
  "stage": "RequestReceived",
  "stageTimestamp": "2018-07-20 10:22:43 +0800"
}
```

### 元数据和请求正文级别

如果设置 `AUDIT_LEVEL` 为 `2`, Rancher 会记录每个 API 请求的元数据标题和正文。

下面的代码示例描述了一个 API 请求，包含其元数据请求头和请求正文。

```json
{
  "auditID": "ef1d249e-bfac-4fd0-a61f-cbdcad53b9bb",
  "requestURI": "/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx",
  "sourceIPs": ["::1"],
  "user": {
    "name": "user-f4tt2",
    "group": ["system:authenticated"]
  },
  "verb": "PUT",
  "stage": "RequestReceived",
  "stageTimestamp": "2018-07-20 10:28:08 +0800",
  "requestBody": {
    "hostIPC": false,
    "hostNetwork": false,
    "hostPID": false,
    "paused": false,
    "annotations": {},
    "baseType": "workload",
    "containers": [
      {
        "allowPrivilegeEscalation": false,
        "image": "nginx",
        "imagePullPolicy": "Always",
        "initContainer": false,
        "name": "nginx",
        "ports": [
          {
            "containerPort": 80,
            "dnsName": "nginx-nodeport",
            "kind": "NodePort",
            "name": "80tcp01",
            "protocol": "TCP",
            "sourcePort": 0,
            "type": "/v3/project/schemas/containerPort"
          }
        ],
        "privileged": false,
        "readOnly": false,
        "resources": {
          "type": "/v3/project/schemas/resourceRequirements",
          "requests": {},
          "limits": {}
        },
        "restartCount": 0,
        "runAsNonRoot": false,
        "stdin": true,
        "stdinOnce": false,
        "terminationMessagePath": "/dev/termination-log",
        "terminationMessagePolicy": "File",
        "tty": true,
        "type": "/v3/project/schemas/container",
        "environmentFrom": [],
        "capAdd": [],
        "capDrop": [],
        "livenessProbe": null,
        "volumeMounts": []
      }
    ],
    "created": "2018-07-18T07:34:16Z",
    "createdTS": 1531899256000,
    "creatorId": null,
    "deploymentConfig": {
      "maxSurge": 1,
      "maxUnavailable": 0,
      "minReadySeconds": 0,
      "progressDeadlineSeconds": 600,
      "revisionHistoryLimit": 10,
      "strategy": "RollingUpdate"
    },
    "deploymentStatus": {
      "availableReplicas": 1,
      "conditions": [
        {
          "lastTransitionTime": "2018-07-18T07:34:38Z",
          "lastTransitionTimeTS": 1531899278000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "Deployment has minimum availability.",
          "reason": "MinimumReplicasAvailable",
          "status": "True",
          "type": "Available"
        },
        {
          "lastTransitionTime": "2018-07-18T07:34:16Z",
          "lastTransitionTimeTS": 1531899256000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "ReplicaSet \"nginx-64d85666f9\" has successfully progressed.",
          "reason": "NewReplicaSetAvailable",
          "status": "True",
          "type": "Progressing"
        }
      ],
      "observedGeneration": 2,
      "readyReplicas": 1,
      "replicas": 1,
      "type": "/v3/project/schemas/deploymentStatus",
      "unavailableReplicas": 0,
      "updatedReplicas": 1
    },
    "dnsPolicy": "ClusterFirst",
    "id": "deployment:default:nginx",
    "labels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    },
    "name": "nginx",
    "namespaceId": "default",
    "projectId": "c-bcz5t:p-fdr4s",
    "publicEndpoints": [
      {
        "addresses": ["10.64.3.58"],
        "allNodes": true,
        "ingressId": null,
        "nodeId": null,
        "podId": null,
        "port": 30917,
        "protocol": "TCP",
        "serviceId": "default:nginx-nodeport",
        "type": "publicEndpoint"
      }
    ],
    "restartPolicy": "Always",
    "scale": 1,
    "schedulerName": "default-scheduler",
    "selector": {
      "matchLabels": {
        "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
      },
      "type": "/v3/project/schemas/labelSelector"
    },
    "state": "active",
    "terminationGracePeriodSeconds": 30,
    "transitioning": "no",
    "transitioningMessage": "",
    "type": "deployment",
    "uuid": "f998037d-8a5c-11e8-a4cf-0245a7ebb0fd",
    "workloadAnnotations": {
      "deployment.kubernetes.io/revision": "1",
      "field.cattle.io/creatorId": "user-f4tt2"
    },
    "workloadLabels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    },
    "scheduling": {
      "node": {}
    },
    "description": "my description",
    "volumes": []
  }
}
```

### 元数据、请求正文和响应正文级别

如果设置 `AUDIT_LEVEL` 为 `3`, Rancher 会记录:

- 每个 API 请求的元数据请求头和请求正文。
- 每个 API 响应的元数据响应头和相应正文。

#### 请求

下面的代码示例描述了一个 API 请求，它有元数据请求头和请求正文。

```json
{
  "auditID": "a886fd9f-5d6b-4ae3-9a10-5bff8f3d68af",
  "requestURI": "/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx",
  "sourceIPs": ["::1"],
  "user": {
    "name": "user-f4tt2",
    "group": ["system:authenticated"]
  },
  "verb": "PUT",
  "stage": "RequestReceived",
  "stageTimestamp": "2018-07-20 10:33:06 +0800",
  "requestBody": {
    "hostIPC": false,
    "hostNetwork": false,
    "hostPID": false,
    "paused": false,
    "annotations": {},
    "baseType": "workload",
    "containers": [
      {
        "allowPrivilegeEscalation": false,
        "image": "nginx",
        "imagePullPolicy": "Always",
        "initContainer": false,
        "name": "nginx",
        "ports": [
          {
            "containerPort": 80,
            "dnsName": "nginx-nodeport",
            "kind": "NodePort",
            "name": "80tcp01",
            "protocol": "TCP",
            "sourcePort": 0,
            "type": "/v3/project/schemas/containerPort"
          }
        ],
        "privileged": false,
        "readOnly": false,
        "resources": {
          "type": "/v3/project/schemas/resourceRequirements",
          "requests": {},
          "limits": {}
        },
        "restartCount": 0,
        "runAsNonRoot": false,
        "stdin": true,
        "stdinOnce": false,
        "terminationMessagePath": "/dev/termination-log",
        "terminationMessagePolicy": "File",
        "tty": true,
        "type": "/v3/project/schemas/container",
        "environmentFrom": [],
        "capAdd": [],
        "capDrop": [],
        "livenessProbe": null,
        "volumeMounts": []
      }
    ],
    "created": "2018-07-18T07:34:16Z",
    "createdTS": 1531899256000,
    "creatorId": null,
    "deploymentConfig": {
      "maxSurge": 1,
      "maxUnavailable": 0,
      "minReadySeconds": 0,
      "progressDeadlineSeconds": 600,
      "revisionHistoryLimit": 10,
      "strategy": "RollingUpdate"
    },
    "deploymentStatus": {
      "availableReplicas": 1,
      "conditions": [
        {
          "lastTransitionTime": "2018-07-18T07:34:38Z",
          "lastTransitionTimeTS": 1531899278000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "Deployment has minimum availability.",
          "reason": "MinimumReplicasAvailable",
          "status": "True",
          "type": "Available"
        },
        {
          "lastTransitionTime": "2018-07-18T07:34:16Z",
          "lastTransitionTimeTS": 1531899256000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "ReplicaSet \"nginx-64d85666f9\" has successfully progressed.",
          "reason": "NewReplicaSetAvailable",
          "status": "True",
          "type": "Progressing"
        }
      ],
      "observedGeneration": 2,
      "readyReplicas": 1,
      "replicas": 1,
      "type": "/v3/project/schemas/deploymentStatus",
      "unavailableReplicas": 0,
      "updatedReplicas": 1
    },
    "dnsPolicy": "ClusterFirst",
    "id": "deployment:default:nginx",
    "labels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    },
    "name": "nginx",
    "namespaceId": "default",
    "projectId": "c-bcz5t:p-fdr4s",
    "publicEndpoints": [
      {
        "addresses": ["10.64.3.58"],
        "allNodes": true,
        "ingressId": null,
        "nodeId": null,
        "podId": null,
        "port": 30917,
        "protocol": "TCP",
        "serviceId": "default:nginx-nodeport",
        "type": "publicEndpoint"
      }
    ],
    "restartPolicy": "Always",
    "scale": 1,
    "schedulerName": "default-scheduler",
    "selector": {
      "matchLabels": {
        "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
      },
      "type": "/v3/project/schemas/labelSelector"
    },
    "state": "active",
    "terminationGracePeriodSeconds": 30,
    "transitioning": "no",
    "transitioningMessage": "",
    "type": "deployment",
    "uuid": "f998037d-8a5c-11e8-a4cf-0245a7ebb0fd",
    "workloadAnnotations": {
      "deployment.kubernetes.io/revision": "1",
      "field.cattle.io/creatorId": "user-f4tt2"
    },
    "workloadLabels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    },
    "scheduling": {
      "node": {}
    },
    "description": "my decript",
    "volumes": []
  }
}
```

#### 响应

下面的代码示例描述了一个 API 响应，其中包含它的元数据响应头和响应正文。

```json
{
  "auditID": "a886fd9f-5d6b-4ae3-9a10-5bff8f3d68af",
  "responseStatus": "200",
  "stage": "ResponseComplete",
  "stageTimestamp": "2018-07-20 10:33:06 +0800",
  "responseBody": {
    "actionLinks": {
      "pause": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx?action=pause",
      "resume": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx?action=resume",
      "rollback": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx?action=rollback"
    },
    "annotations": {},
    "baseType": "workload",
    "containers": [
      {
        "allowPrivilegeEscalation": false,
        "image": "nginx",
        "imagePullPolicy": "Always",
        "initContainer": false,
        "name": "nginx",
        "ports": [
          {
            "containerPort": 80,
            "dnsName": "nginx-nodeport",
            "kind": "NodePort",
            "name": "80tcp01",
            "protocol": "TCP",
            "sourcePort": 0,
            "type": "/v3/project/schemas/containerPort"
          }
        ],
        "privileged": false,
        "readOnly": false,
        "resources": {
          "type": "/v3/project/schemas/resourceRequirements"
        },
        "restartCount": 0,
        "runAsNonRoot": false,
        "stdin": true,
        "stdinOnce": false,
        "terminationMessagePath": "/dev/termination-log",
        "terminationMessagePolicy": "File",
        "tty": true,
        "type": "/v3/project/schemas/container"
      }
    ],
    "created": "2018-07-18T07:34:16Z",
    "createdTS": 1531899256000,
    "creatorId": null,
    "deploymentConfig": {
      "maxSurge": 1,
      "maxUnavailable": 0,
      "minReadySeconds": 0,
      "progressDeadlineSeconds": 600,
      "revisionHistoryLimit": 10,
      "strategy": "RollingUpdate"
    },
    "deploymentStatus": {
      "availableReplicas": 1,
      "conditions": [
        {
          "lastTransitionTime": "2018-07-18T07:34:38Z",
          "lastTransitionTimeTS": 1531899278000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "Deployment has minimum availability.",
          "reason": "MinimumReplicasAvailable",
          "status": "True",
          "type": "Available"
        },
        {
          "lastTransitionTime": "2018-07-18T07:34:16Z",
          "lastTransitionTimeTS": 1531899256000,
          "lastUpdateTime": "2018-07-18T07:34:38Z",
          "lastUpdateTimeTS": 1531899278000,
          "message": "ReplicaSet \"nginx-64d85666f9\" has successfully progressed.",
          "reason": "NewReplicaSetAvailable",
          "status": "True",
          "type": "Progressing"
        }
      ],
      "observedGeneration": 2,
      "readyReplicas": 1,
      "replicas": 1,
      "type": "/v3/project/schemas/deploymentStatus",
      "unavailableReplicas": 0,
      "updatedReplicas": 1
    },
    "dnsPolicy": "ClusterFirst",
    "hostIPC": false,
    "hostNetwork": false,
    "hostPID": false,
    "id": "deployment:default:nginx",
    "labels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    },
    "links": {
      "remove": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx",
      "revisions": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx/revisions",
      "self": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx",
      "update": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx",
      "yaml": "https://localhost:8443/v3/project/c-bcz5t:p-fdr4s/workloads/deployment:default:nginx/yaml"
    },
    "name": "nginx",
    "namespaceId": "default",
    "paused": false,
    "projectId": "c-bcz5t:p-fdr4s",
    "publicEndpoints": [
      {
        "addresses": ["10.64.3.58"],
        "allNodes": true,
        "ingressId": null,
        "nodeId": null,
        "podId": null,
        "port": 30917,
        "protocol": "TCP",
        "serviceId": "default:nginx-nodeport"
      }
    ],
    "restartPolicy": "Always",
    "scale": 1,
    "schedulerName": "default-scheduler",
    "selector": {
      "matchLabels": {
        "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
      },
      "type": "/v3/project/schemas/labelSelector"
    },
    "state": "active",
    "terminationGracePeriodSeconds": 30,
    "transitioning": "no",
    "transitioningMessage": "",
    "type": "deployment",
    "uuid": "f998037d-8a5c-11e8-a4cf-0245a7ebb0fd",
    "workloadAnnotations": {
      "deployment.kubernetes.io/revision": "1",
      "field.cattle.io/creatorId": "user-f4tt2"
    },
    "workloadLabels": {
      "workload.user.cattle.io/workloadselector": "deployment-default-nginx"
    }
  }
}
```
