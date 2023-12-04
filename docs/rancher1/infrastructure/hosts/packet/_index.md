---
title: 添加Packet主机
---

Rancher 通过使用 `docker machine` 来管理 [Packet](https://www.packet.net/) 提供的主机。

### 获取 Packet 访问凭证

为了能启动 Packet 主机，需要获取由 Rackspace 提供的 **API Key(接口密钥)**。首先，登录 Packet，然后:

1. 切换到 [api-key(接口密钥)](https://app.packet.net/portal#/api-keys)页面，创建一个新接口密钥；

2. 在创建新接口密钥的界面上，可以给新接口密钥增加一个描述，然后单击 **Generate(创建)**；

3. 接下来可以看到新创建的 **Token(令牌)**，复制出来并妥善保管。

### 启动 Packet 主机

选择 **Infrastructure -> Hosts(基础架构 -> 主机)**，单击 **Add Host(添加主机)**，选择 **Packet**图标。

1. 拖动滑条来选择需要启动的主机数目；
2. 输入 **Name(名称)**，需要详细备注的时候就填写 **Description(描述)**；
3. 输入刚才获取的 **API Key(接口密钥)**；
4. 输入希望启动的 **Project(项目)**，必须是 Packet 账户中支持的；
5. Rancher 对 `docker machine` 的支持和 Packet 是一样的，所以选择需要启动的 **Image(镜像)** 即可；
6. 输入 **Size(大小)**；
7. 选择希望主机启动时所在的 **Region(地域)**
8. 必要时，添加 **[labels(标签)](/docs/rancher1/infrastructure/hosts/_index#labels)** 来辅助管理主机以及 [调度服务或负载均衡](/docs/rancher1/infrastructure/cattle/scheduling/_index)，也可以 [通过 DNS-IP 映射来管理不在 Rancher 内启动的服务](/docs/rancher1/infrastructure/cattle/external-dns-service/_index#为外部dns使用特定的ip)；
9. 必要时，通过 **Advanced Options(高级选项)**，定制化 [Docker engine options(Docker 引擎选项)](https://docs.docker.com/machine/reference/create/#specifying-configuration-options-for-the-created-docker-engine) 来控制 `docker-machine create` 时用到的选项指令；
10. 一切准备就绪后, 单击 **Create(创建)**。

单击创建后，Rancher 将创建 Packet 的主机，接着在主机上启动一个 _rancher-agent_ 的容器。几分钟之后，就可以通过 [services(服务)](/docs/rancher1/infrastructure/cattle/adding-services/_index) 页面看到一个 Rancher 的主机被启动了。
