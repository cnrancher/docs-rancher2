---
title: "网络"
weight: 35
---

>**注意:** CNI选项在[安装网络选项](/docs/k3s/installation/network-options/_index)页面有详细介绍。请参考该页面了解Flannel和各种flannel后端选项的细节或者如何设置自己的CNI。

开放端口
----------
请参考[安装要求](/docs/k3s/installation/installation-requirements/_index#网络)页面了解端口信息。

CoreDNS
-------

CoreDNS会在agent启动时部署。要禁用，请在每个server上运行`--disable coredns`选项禁用coredns。

如果你不安装CoreDNS，你需要自己安装一个集群DNS提供商。

Traefik Ingress Controller
--------------------------

[Traefik](https://traefik.io/)是一个现代的HTTP反向代理和负载均衡器，它是为了轻松部署微服务而生的。在设计，部署和运行应用程序时，它简化了网络复杂性。

启动server时，默认情况下会部署Traefik。更多信息请参见[自动部署清单](/docs/k3s/advanced/_index#自动部署清单)。默认的配置文件在`/var/lib/rancher/k3s/server/manifests/traefik.yaml`中，对该文件的任何修改都会以类似`kubectl apply`的方式自动部署到Kubernetes中。

Traefik ingress controller 将使用主机上的 80、443 和 8080 端口（即这些端口不能用于 HostPort 或 NodePort）。

你可以通过在traefik.yaml文件中设置选项来调整traefik以满足你的需求。更多信息请参考官方的[Traefik配置参数](https://github.com/helm/charts/tree/master/stable/traefik#configuration)。

要禁用它，请使用`--disable traefik`选项启动每个server。

Service Load Balancer
---------------------

K3s包含一个基本服务负载均衡器，它使用可用的主机端口。例如，如果你试图创建一个在80端口上监听的负载均衡器，它将尝试在集群中找到一个80端口的空闲主机。如果没有可用端口，负载均衡器将保持在Pending状态。

要禁用嵌入式负载均衡器，请使用`--disable servicelb`选项运行server。如果你想运行其他的负载均衡器，如MetalLB，这是很有必要的。

没有主机名的节点
------------------------

一些云提供商（如Linode）会以 "localhost "作为主机名创建机器，而其他提供商可能根本没有设置主机名。这可能会导致域名解析的问题。你可以用`--node-name`标志或`K3S_NODE_NAME`环境变量来运行K3s，这样就会传递节点名称来解决这个问题。

