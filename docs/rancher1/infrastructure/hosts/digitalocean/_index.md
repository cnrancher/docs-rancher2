---
title: 添加DigitalOcean主机
---

Rancher 通过使用 `docker machine` 来管理 [DigitalOcean](https://www.digitalocean.com/) 提供的主机。

### 获取 DigitalOcean 访问凭证

为了能启动 DigitalOcean 主机, 需要获取由 DigitalOcean 提供的 **Personal Access Token(私有访问令牌)** 。 首先，登录 DigitalOcean，然后:

1. 切换到 [Apps & API(应用及接口)](https://cloud.digitalocean.com/settings/applications)页面；

2. 选中 **Personal Access Tokens(私有访问令牌汇总)**菜单，单击 **Generate New Token(创建新令牌)**。给新令牌起一个名称，然后单击 **Generate Token(创建令牌)**；

3. 从界面上把 **Access Token(访问令牌)** 复制出来并妥善保管。注意，这是唯一一次可以完整的看到 access token。重新访问这个页面，将无法再看到完整的信息。

### 启动 DigitalOcean 主机

接下来来启动 DigitalOcean 主机。在 Rancher 的操作界面中，选择 **Infrastructure(基础架构) -> Hosts(主机)**，单击 **Add Host(添加主机)**，选择 **DigitalOcean**图标。

1. 拖动滑条来选择需要启动的主机数目；
2. 输入 **Name(名称)**，需要详细备注的时候就填写 **Description(描述)**；
3. 输入刚才获取的 **Access Token(访问令牌)**；
4. Rancher 对 `docker machine` 的支持和 DigitalOcean 是一样的，所以选择需要启动的 **Image(镜像)** 即可；
5. 输入 **Size(大小)**；
6. 选择希望主机启动时所在的 **Region(地域)**，Rancher 是通过调用 DigitalOcean 的 metadata 来获取合适的地域列表，因此无法支持不在这个列表内的地域；
7. 接下来是可选的。必要时，可以选择启用例如 backups(备份)，IPv6，private networking(私有网络)等高级选项操作；
8. 必要时，添加 **[labels(标签)](/docs/rancher1/infrastructure/hosts/_index#labels)** 来辅助管理主机以及 [调度服务或负载均衡](/docs/rancher1/infrastructure/cattle/scheduling/_index)，也可以 [通过 DNS-IP 映射来管理不在 Rancher 内启动的服务](/docs/rancher1/infrastructure/cattle/external-dns-service/_index#为外部dns使用特定的ip)；
9. 必要时，通过 **Advanced Options(高级选项)**，定制化 [Docker engine options(Docker 引擎选项)](https://docs.docker.com/machine/reference/create/#specifying-configuration-options-for-the-created-docker-engine) 来控制 `docker-machine create` 时用到的选项指令；
10. 一切准备就绪后, 单击 **Create(创建)**。

单击创建后，Rancher 将创建 DigitalOcean 的 droplet(主机)，接着在 droplet 上启动一个 _rancher-agent_ 的容器。几分钟之后，就可以通过 [services(服务)](/docs/rancher1/infrastructure/cattle/adding-services/_index) 页面看到一个 Rancher 的主机被启动了。
