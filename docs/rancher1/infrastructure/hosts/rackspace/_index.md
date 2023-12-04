---
title: 添加Rackspace主机
---

Rancher 支持使用 `docker machine` 来管理 [Rackspace](http://www.rackspace.com/) 提供的主机。

### 获取 Rackspace 访问凭证

为了能启动 Rackspace 主机，需要获取由 Rackspace 提供的 **API Key(接口密钥)**。首先，登录 Rackspace，然后:

1. 切换到 Account Settings(账户设置界面)；

2. 在 Login Details(登录明细)中，可以看到 **API Key(接口密钥)**的按钮。单击它就可以看到完整的接口密钥，接下来会在 Rancher 中使用这串密钥。

### 启动 Rackspace 主机

选择 **Infrastructure(基础架构) -> Hosts(主机)**，单击 **Add Host(添加主机)**，选择 **Rackspace**图标。

1. 拖动滑条来选择需要启动的主机数目；
2. 输入 **Name(名称)**，需要详细备注的时候就填写 **Description(描述)**；
3. 输入刚才登录 Rackspace 的 **Username(用户名)**；
4. 输入刚才获取的 **API Key(接口密钥)**；
5. 选择希望主机启动时所在的 **Region(地域)**；
6. 选择主机的 **Flavor(类型)**；
7. 必要时，添加 **[labels(标签)](/docs/rancher1/infrastructure/hosts/_index#labels)** 来辅助管理主机以及 [调度服务或负载均衡](/docs/rancher1/infrastructure/cattle/scheduling/_index)，也可以[通过 DNS-IP 映射来管理不在 Rancher 内启动的服务](/docs/rancher1/infrastructure/cattle/external-dns-service/_index)；
8. 必要时，通过 **Advanced Options(高级选项)**，定制化[Docker engine options(Docker 引擎选项)](https://docs.docker.com/machine/reference/create/#specifying-configuration-options-for-the-created-docker-engine)来控制 `docker-machine create` 时用到的选项指令；
9. 一切准备就绪后, 单击 **Create(创建)**。

单击创建后，Rancher 将创建 Rackspace 的主机，接着在主机上启动一个 _rancher-agent_ 的容器。几分钟之后，就可以通过 [services(服务)](/docs/rancher1/infrastructure/cattle/adding-services/_index) 页面看到一个 Rancher 的主机被启动了。
