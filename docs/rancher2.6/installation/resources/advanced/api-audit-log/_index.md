---
title: 启用 API 审计日志以记录系统事件
weight: 4
---

你可以启用 API 审计日志来记录各个用户发起的系统事件的顺序。通过查看日志，你可以了解发生了什么事件、事件发生的时间，事件发起人，以及事件影响的集群。启用此功能后，所有 Rancher API 的请求和响应都会写入日志中。

API 审计可以在 Rancher 安装或升级期间启用。

## 启用 API 审计日志

你可以将环境变量传递给 Rancher Server 容器，从而启用和配置审计日志。请参见以下文档，在安装时启用该功能：

- [Docker 安装]({{<baseurl>}}/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/#api-audit-log)

- [Kubernetes 安装]({{<baseurl>}}/rancher/v2.6/en/installation/install-rancher-on-k8s/chart-options/#api-audit-log)

## API 审计日志选项

以下参数定义了审计日志的记录规则，其中包括应该记录什么内容以及包括什么数据：

| 参数 | 描述 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="audit-level"></a>`AUDIT_LEVEL` | `0` - 禁用审计日志（默认）<br /> `1` - 日志事件元数据<br /> `2` - 日志事件元数据和请求体<br /> `3` - 日志事件元数据，请求体和响应体。请求/响应对的每个日志事务都使用同一个的 `auditID`。<br /> 如需了解每个设置记录的日志内容，请参见[审计日志级别](#audit-log-levels)。 |
| `AUDIT_LOG_PATH` | Rancher Server API 的日志路径。默认路径：`/var/log/auditlog/rancher-api-audit.log`。你可以将日志目录挂载到主机。<br/><br/>示例：`AUDIT_LOG_PATH=/my/custom/path/`<br/> |
| `AUDIT_LOG_MAXAGE` | 旧审计日志文件可保留的最大天数。默认为 10 天。 |
| `AUDIT_LOG_MAXBACKUP` | 保留的审计日志最大文件个数。默认值为 10。 |
| `AUDIT_LOG_MAXSIZE` | 在审计日志文件被轮换前的最大容量，单位是 MB。默认大小为 100MB。 |

<br/>

### 审核日志级别

下表介绍了每个 [`AUDIT_LEVEL`](#audit-level) 记录的 API 事务：

| `AUDIT_LEVEL` 设置 | 请求元数据 | 请求体 | 响应元数据 | 响应体 |
| --------------------- | ---------------- | ------------ | ----------------- | ------------- |
| `0` |                  |              |                   |               |
| `1` | ✓ |              |                   |               |
| `2` | ✓ | ✓ |                   |               |
| `3` | ✓ | ✓ | ✓ | ✓ |

## 查看 API 审计日志

### Docker 安装

与主机系统共享 `AUDIT_LOG_PATH` 目录（默认目录：`/var/log/auditlog`）。日志可以通过标准 CLI 工具进行解析，也可以转发到 Fluentd、Filebeat、Logstash 等日志收集工具。

### Kubernetes 安装

使用 Helm Chart 安装 Rancher 时启动 API 审计日志，会在 Rancher Pod 中创建一个 `rancher-audit-log` Sidecar 容器。该容器会将日志发送到标准输出 (stdout)。你可以像查看其他容器的日志一样查看 API 审计日志。

`rancher-audit-log` 容器位于 `cattle-system` 命名空间中的 `rancher` Pod 中。

#### 通过 CLI 查看审计日志：

```bash
kubectl -n cattle-system logs -f rancher-84d886bdbb-s4s69 rancher-audit-log
```

#### 发送审计日志

你可以为集群启用 Rancher 的内置日志收集和传送功能，将审计日志和其他服务日志发送到支持的 endpoint。详情请参见 [Rancher 工具 - 日志管理]({{<baseurl>}}/rancher/v2.6/en/logging)。

## 审计日志示例

启用审计日志后，Rancher 会以 JSON 格式记录每个 API 的请求和响应。下文的代码示例展示了如何查看 API 事务。

### 元数据日志级别

如果你将 `AUDIT_LEVEL` 设置为 `1`，Rancher 只会记录每个 API 请求的元数据标头，而不会记录请求体。标头记录了 API 事务的基本信息，包括 ID、发起人、发起时间等。代码示例如下：

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

### 元数据和请求体日志级别

如果你将 `AUDIT_LEVEL` 设置为 `2`，Rancher 会记录每个 API 请求的元数据标头和请求体。

下面的代码示例描述了一个 API 请求，包括它的元数据标头和正文：

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

### 元数据、请求体和响应体日志级别

如果你将 `AUDIT_LEVEL` 设置为 `3`，Rancher 会记录：

- 每个 API 请求的元数据标头和请求体。
- 每个 API 响应的元数据标头和响应体。

#### 请求

下面的代码示例描述了一个 API 请求，包括它的元数据标头和正文：

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

下面的代码示例描述了一个 API 响应，包括它的元数据标头和正文：

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
