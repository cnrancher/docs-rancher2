---
title: 自定义的网络插件示例
description: 下面的例子展示了如何在`cluster.yml`中配置自定义网络插件与内嵌式插件。
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
  - RKE
  - 配置选项
  - 插件
  - RKE 插件
  - 网络插件
  - 自定义的网络插件示例
---

下面的例子展示了如何在`cluster.yml`中配置自定义网络插件与内嵌式插件。

首先，打开`cluster.yml`文件，将`network`参数的现有值修改为 `none`。

```
network:
    plugin: none
```

然后，在 `cluster.yml`中的 `addons`部分，添加拥有网络插件的集群的 add-on manifest。在下面的例子中，我们通过`addons`字段添加集群的 add-on manifest，将 Canal 插件替换成 Flannel 插件。

```
addons: |-
    ---
    kind: ClusterRoleBinding
    apiVersion: rbac.authorization.k8s.io/v1
    metadata:
      name: flannel
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: flannel
    subjects:
    - kind: ServiceAccount
      name: flannel
      namespace: kube-system
    ---
    kind: ClusterRole
    apiVersion: rbac.authorization.k8s.io/v1
    metadata:
      name: flannel
    rules:
      - apiGroups:
          - ""
        resources:
          - pods
        verbs:
          - get
      - apiGroups:
          - ""
        resources:
          - nodes
        verbs:
          - list
          - watch
      - apiGroups:
          - ""
        resources:
          - nodes/status
        verbs:
          - patch
    ---
    kind: ConfigMap
    apiVersion: v1
    metadata:
      name: kube-flannel-cfg
      namespace: "kube-system"
      labels:
        tier: node
        app: flannel
    data:
      cni-conf.json: |
        {
          "name":"cbr0",
          "cniVersion":"0.3.1",
          "plugins":[
            {
              "type":"flannel",
              "delegate":{
                "forceAddress":true,
                "isDefaultGateway":true
              }
            },
            {
              "type":"portmap",
              "capabilities":{
                "portMappings":true
              }
            }
          ]
        }
      net-conf.json: |
        {
          "Network": "10.42.0.0/16",
          "Backend": {
            "Type": "vxlan"
          }
        }
    ---
    apiVersion: extensions/v1beta1
    kind: DaemonSet
    metadata:
      name: kube-flannel
      namespace: "kube-system"
      labels:
        tier: node
        k8s-app: flannel
    spec:
      template:
        metadata:
          labels:
            tier: node
            k8s-app: flannel
        spec:
          affinity:
            nodeAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerms:
                  - matchExpressions:
                    - key: beta.kubernetes.io/os
                      operator: NotIn
                      values:
                        - windows
          serviceAccountName: flannel
          containers:
          - name: kube-flannel
            image: rancher/coreos-flannel:v0.10.0-rancher1
            imagePullPolicy: IfNotPresent
            resources:
              limits:
                cpu: 300m
                memory: 500M
              requests:
                cpu: 150m
                memory: 64M
            command: ["/opt/bin/flanneld","--ip-masq","--kube-subnet-mgr"]
            securityContext:
              privileged: true
            env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            volumeMounts:
            - name: run
              mountPath: /run
            - name: cni
              mountPath: /etc/cni/net.d
            - name: flannel-cfg
              mountPath: /etc/kube-flannel/
          - name: install-cni
            image: rancher/flannel-cni:v0.3.0-rancher1
            command: ["/install-cni.sh"]
            env:
            # The CNI network config to install on each node.
            - name: CNI_NETWORK_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: kube-flannel-cfg
                  key: cni-conf.json
            - name: CNI_CONF_NAME
              value: "10-flannel.conflist"
            volumeMounts:
            - name: cni
              mountPath: /host/etc/cni/net.d
            - name: host-cni-bin
              mountPath: /host/opt/cni/bin/
          hostNetwork: true
          tolerations:
          - operator: Exists
            effect: NoSchedule
          - operator: Exists
            effect: NoExecute
          - key: node.kubernetes.io/not-ready
            effect: NoSchedule
            operator: Exists
          volumes:
            - name: run
              hostPath:
                path: /run
            - name: cni
              hostPath:
                path: /etc/cni/net.d
            - name: flannel-cfg
              configMap:
                name: kube-flannel-cfg
            - name: host-cni-bin
              hostPath:
                path: /opt/cni/bin
      updateStrategy:
        rollingUpdate:
          maxUnavailable: 20%
        type: RollingUpdate
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: flannel
      namespace: kube-system
```

**结果：** 为集群创建了自定义的网络插件。
