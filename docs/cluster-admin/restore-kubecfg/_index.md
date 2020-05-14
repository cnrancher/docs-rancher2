---
title: 恢复kubectl配置文件
description: 
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
  - 集群管理员指南
  - 集群访问控制
  - 恢复kubectl配置文件
---

分析Rancher UI生成的kubecfg文件可以发现，第一个`server`对应的是Rancher Server的`url或者IP`。当kubectl访问`K8S API SERVER`的时候，请求是先发送到Rancher，然后再通过`cluster agent`转发给`K8S API SERVER`。

![image-20190514185322798](/img/rancher/old-doc/image-20190514185322798.png)

在Rancher v2.2.2以前的版本，Rancher UI生成的kubecfg文件中只设置了一个`server`。从Rancher v2.2.2开始，从Rancher UI创建的集群默认开启`授权集群访问地址`。创建好集群后Rancher UI生成的kubecfg文件中将显示多个master节点IP对应的`server`。

![image-20190514185026706](/img/rancher/old-doc/image-20190514185026706.png)

![image-20190514184126478](/img/rancher/old-doc/image-20190514184126478.png)

因此，`Rancher v2.2.2`以及之后版本通过Rancher UI创建的集群，如果Rancher Server无法访问，那么可以通过`kubectl --kubeconfig=xxx --context=xxx`来切换`server`。

对于`Rancher v2.2.2`之前的版本，则需要通过以下方式找回`kube-admin`配置文件。

> **注意:** 以下脚本需要在业务集群上执行，任意一个节点即可。保存以下文本为`restore-kube-config.sh`

```bash
#!/bin/bash

help ()
{
    echo  ' ================================================================ '
    echo  ' --master-ip: 指定Master节点IP，任意一个K8S Master节点IP即可。'
    echo  ' 使用示例：bash restore-kube-config.sh --master-ip=1.1.1.1 '
    echo  ' ================================================================'
}

case "$1" in
    -h|--help) help; exit;;
esac

if [[ $1 == '' ]];then
    help;
    exit;
fi

CMDOPTS="$*"
for OPTS in $CMDOPTS;
do
    key=$(echo ${OPTS} | awk -F"=" '{print $1}' )
    value=$(echo ${OPTS} | awk -F"=" '{print $2}' )
    case "$key" in
        --master-ip) K8S_MASTER_NODE_IP=$value ;;
    esac
done

# 获取Rancher Agent镜像
RANCHER_IMAGE=$( docker images --filter=label=io.cattle.agent=true |grep 'v2.' | \
grep -v -E 'rc|alpha|<none>' | head -n 1 | awk '{print $3}' )

if [ -d /opt/rke/etc/kubernetes/ssl ]; then
  K8S_SSLDIR=/opt/rke/etc/kubernetes/ssl
else
  K8S_SSLDIR=/etc/kubernetes/ssl
fi

CHECK_CLUSTER_STATE_CONFIGMAP=$( docker run --rm --entrypoint bash --net=host \
-v $K8S_SSLDIR:/etc/kubernetes/ssl:ro $RANCHER_IMAGE -c '\
if kubectl --kubeconfig /etc/kubernetes/ssl/kubecfg-kube-node.yaml \
-n kube-system get configmap full-cluster-state | grep full-cluster-state > /dev/null; then \
echo 'yes'; else echo 'no'; fi' )

if [ $CHECK_CLUSTER_STATE_CONFIGMAP != 'yes' ]; then

  docker run --rm --net=host \
  --entrypoint bash \
  -e K8S_MASTER_NODE_IP=$K8S_MASTER_NODE_IP \
  -v $K8S_SSLDIR:/etc/kubernetes/ssl:ro \
  $RANCHER_IMAGE \
  -c '\
  kubectl --kubeconfig /etc/kubernetes/ssl/kubecfg-kube-node.yaml \
  -n kube-system \
  get secret kube-admin -o jsonpath={.data.Config} | base64 --decode | \
  sed -e "/^[[:space:]]*server:/ s_:.*_: \"https://${K8S_MASTER_NODE_IP}:6443\"_"' > kubeconfig_admin.yaml
  
  if [ -s kubeconfig_admin.yaml ]; then
    echo '恢复成功，执行以下命令测试：'
    echo ''
    echo "kubectl --kubeconfig kubeconfig_admin.yaml get nodes"
  else
    echo "kubeconfig恢复失败。"
  fi

else

  docker run --rm --entrypoint bash --net=host \
  -e K8S_MASTER_NODE_IP=$K8S_MASTER_NODE_IP \
  -v $K8S_SSLDIR:/etc/kubernetes/ssl:ro \
  $RANCHER_IMAGE \
  -c '\
  kubectl --kubeconfig /etc/kubernetes/ssl/kubecfg-kube-node.yaml \
  -n kube-system \
  get configmap full-cluster-state -o json | \
  jq -r .data.\"full-cluster-state\" | \
  jq -r .currentState.certificatesBundle.\"kube-admin\".config | \
  sed -e "/^[[:space:]]*server:/ s_:.*_: \"https://${K8S_MASTER_NODE_IP}:6443\"_"' > kubeconfig_admin.yaml
  
  if [ -s kubeconfig_admin.yaml ]; then
    echo '恢复成功，执行以下命令测试：'
    echo ''
    echo "kubectl --kubeconfig kubeconfig_admin.yaml get nodes"
  else
    echo "kubeconfig恢复失败。"
  fi
fi
```
