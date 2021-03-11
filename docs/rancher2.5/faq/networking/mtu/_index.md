---
title: Pod MTU 值大于主机 flannel.1MTU 值
description: 关于网络的常见问题
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
  - Pod MTU值大于主机flannel.1MTU值
---

## 1. Canal 网络驱动下，Pod MTU 值大于主机 flannel.1MTU 值

1. 编辑配置映射文件

   kubectl --kubeconfig=kube_configxxx.yml edit configmaps -n kube-system canal-config

2. 在`"type": "calico"`下面添加`"mtu": 1450`

   ![image-20181101183954443](/img/rancher/old-doc/image-20181101183954443.png)

3. 删除 Canal Pod 让它重建

   ```bash
   kubectl --kubeconfig=kube_configxxx.yml  get  pod -n kube-system |grep canal | \
       awk '{print $1}' | \
       xargs kubectl --kubeconfig=kube_configxxx.yml delete  -n kube-system pod
   ```
