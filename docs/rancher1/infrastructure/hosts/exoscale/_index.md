---
title: 添加Exoscale主机
---

Rancher 支持使用 `docker machine` 来管理 [Exoscale](https://www.exoscale.ch/) 提供的主机。

### 获取 Exoscale 访问凭证

为了能启动 Exoscale 主机，需要获取由 Exoscale 提供的 **API Key(接口密钥)** and **Secret Key(加密密钥)**。登录到 Exoscale，进入 _API Keys_ 页面，选择 *Profile*就可以获取到接口密钥和加密密钥。

### 启动 Exoscale 主机

选择 **Infrastructure(基础架构) -> Hosts(主机)**，点击 **Add Host(添加主机)**，选择 **Exoscale**图标。 输入获取的 **API Key(接口密钥)** 和 **Secret Key(加密密钥)**，然后点击 **Next: Authenticate & select a Security Group(下一步:校验并选择一个安全组)**。

接下来，将会选择一个被主机使用的安全组。这里有两种安全组的选择:第一种，**Standard(标准)** 选项，是支持 `rancher-machine`的安全组。如果选择该选项，Rancher 服务将会打开所有 Rancher 代理可以被成功运行所需要的端口。而`2376`(Docker deamon 的端口)也会被打开。

另外一种，是 **Custom(自定义)** 选项，可以选择任何一个已经存在的安全组，但必须确保 Rancher 代理正常执行的所有特定端口会被打开。

<a id="port"></a>

### Rancher 代理运行需要的端口:

- 需要打开 TCP 端口 `22`来接收 Rancher 服务管理以及运行 Docker 守护进程的 `2376`端口；
- 如果使用 IPsec [networking driver(网络驱动)](/docs/rancher1/rancher-services/networking/_index)，需要打开 UDP 端口 `500` 和 `4500`；
- 如果使用 VXLAN [networking driver(网络驱动)](/docs/rancher1/rancher-services/networking/_index)，需要打开 UDP 端口 `4789`。

> **注意:** 当选用安全组 `rancher-machine`时，那些在安全组中匹配的端口不会被重新打开。这就意味着，当发现运行不正常时(有可能是因为主机上的端口打开不正确或者没有被打开导致的)，需要检查 Exoscale 上面的端口的情况。

选择好安全组的选项后, 点击 **Next: Set Instance Options(下一步:配置主机实例选项)**.

最后阶段，只需要完善主机配置的一些细节即可:

1. 拖动滑条来选择需要启动的主机数目；
2. 输入 **Name(名称)**，需要详细备注的时候就填写 **Description(描述)**；
3. 选择 **Instance Profile(实例描述)**；
4. 输入磁盘大小到 **Root Size(主机大小)**；
5. 必要时，添加 **[labels(标签)](/docs/rancher1/infrastructure/hosts/_index#labels)** 来辅助管理主机以及 [调度服务或负载均衡](/docs/rancher1/infrastructure/cattle/scheduling/_index)，也可以 [通过 DNS-IP 映射来管理不在 Rancher 内启动的服务](/docs/rancher1/infrastructure/cattle/external-dns-service/_index#为外部dns使用特定的ip)；
6. 必要时，通过 **Advanced Options(高级选项)**，定制化 [Docker engine options(Docker 引擎选项)](https://docs.docker.com/machine/reference/create/_index#specifying-configuration-options-for-the-created-docker-engine) 来控制 `docker-machine create` 时用到的选项指令；
7. 一切准备就绪后, 点击 **Create(创建)**。

> **注意:** 目前 Exoscale 的操作界面上并没有显示所有 `docker machine`的选项。Rancher 默认使用的 Exoscale 的终端(`https://api.exoscale.ch/compute`)，镜像(`ubuntu-14.04`)以及可用地域(`ch-gva-2`)。

点击创建以后，Rancher 将会创建一个 Exoscale 的主机，接着在主机上启动一个 _rancher-agent_ 的容器。几分钟之后，就可以通过 [services(服务)](/docs/rancher1/infrastructure/cattle/adding-services/_index) 页面看到一个 Rancher 的主机被启动了。
