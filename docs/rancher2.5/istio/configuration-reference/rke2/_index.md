---
title: 在RKE2集群上安装Istio的操作步骤
---

1. 单击**组件**。
1. 勾选 "**启用 CNI**"旁边的方框。
1. 添加自定义覆盖文件，指定`cniBinDir`和`cniConfDir`。关于这些选项的详细信息，请参考[Istio 文档](https://istio.io/latest/docs/setup/additional-setup/cni/#helm-chart-parameters)。下面是一个例子。

   ```yaml
   apiVersion: install.istio.io/v1alpha1
   kind: IstioOperator
   spec:
   components:
     cni:
       enabled: true
   values:
     cni:
       image: rancher/istio-install-cni:1.7.3
       excludeNamespaces:
         - istio-system
         - kube-system
       logLevel: info
       cniBinDir: /opt/cni/bin
       cniConfDir: /etc/cni/net.d
   ```

1. 安装 Istio 后，你会发现 istio-system 命名空间中的 cni-node pods 出现 CrashLoopBackoff 错误。手动编辑`istio-cni-node` daemonset，在`install-cni`容器上加入以下内容。
   ```yaml
   securityContext:
     privileged: true
   ```

**结果：**现在您应该能够根据需要使用 Istio，包括通过 Kiali 进行 sidecar 注入和监控。
