---
title: 添加Custom主机
---

如果您已经部署了 Linux 主机，并且希望将它们添加到 Rancher 中。在点击**Custom**图标之后会，Rancher 会自动生成一个`docker`命令脚本，将其拷贝到每一台主机上并运行这条命令来启动`rancher/agent`容器。

如果您在使用不同的[环境](/docs/rancher1/configuration/environments/_index)，不同环境生成的添加主机命令是不一样的。

确保您所在的环境就是您想要添加主机的环境。您所在的环境显示在 UI 的左上角。当您第一次登录进去之后，您是处于名称为**默认**的环境里。

一旦您的主机添加到 Rancher 之后，您就可以开始[添加服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)了。

> **注意:** 确保运行 Rancher Server 的主机和您所添加的主机的时钟是一样的并且能够正常访问主机上的容器。更多信息，请参考[在 Rancher 中访问容器的命令行和日志](/docs/rancher1/faqs/troubleshooting/_index#求助-我不能通过-rancher的界面打开-shell-或查看日志--rancher-是如何去访问容器的-shell和日志)。

## 主机标签

您可以给每台主机添加标签，以帮助您组织您的主机。在启动 rancher/agent 容器时，您所添加的标签会以环境变量的形式添加到主机上。添加的标签是一组键值对，并且键值必须是唯一的。如果您添加了两个具有相同键不同值的标签，那么将会以您后面添加的值为准作为标签值。

增加标签之后，您可以使用这些标签来[调度服务/负载均衡器](/docs/rancher1/infrastructure/cattle/scheduling/_index)，并且可以为您主机上的[服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)创建黑白名单。

添加自定义主机的时候，您可以在 UI 上添加标签，之后将会自动将带有键值对的环境变量(`CATTLE_HOST_LABELS`)添加到 UI 上出现的命令里。

_例子_

```
# Adding one host label to the rancher/agent command
$  sudo docker run -e CATTLE_HOST_LABELS='foo=bar' -d --privileged \
-v /var/run/docker.sock:/var/run/docker.sock rancher/agent:v0.8.2 \
http://<rancher-server-ip>:8080/v1/projects/1a5/scripts/<registrationToken>

# Adding more than one host label requires joining the additional host labels with an `&`
$  sudo docker run -e CATTLE_HOST_LABELS='foo=bar&hello=world' -d --privileged \
-v /var/run/docker.sock:/var/run/docker.sock rancher/agent:v0.8.2 \
http://<rancher-server-ip>:8080/v1/projects/1a5/scripts/<registrationToken>
```

## 安全组／防火墙

对于添加的任何主机，请确保安全组或者防火墙允许流量经过，否则 Rancher 的功能将会受限。

- 如果您正在使用 IPsec[网络驱动](/docs/rancher1/rancher-services/networking/_index)，要开放所有主机上的 UDP 端口 500 和 4500。
- 如果您正在使用 VXLAN[网络驱动](/docs/rancher1/rancher-services/networking/_index)，要开放所有主机上的 UDP 端口`4789`。
- _k8s 主机_ :用作 K8s 的主机需要开放`10250`和`10255`端口来为`kubectl`使用。为了访问外部的服务，NodePort 使用的端口也需要开放，默认的是 TCP 端口`30000` - `32767`。

<a id="samehost"></a>

## 在运行 Rancher Server 的机器上添加主机

如果您想将正在运行 Rancher Server 的主机同时添加为 Agent 主机，您必须修改 UI 上提供的命令行。在 UI 上，您需要指定这台主机的注册 IP，它将会作为环境变量自动添加到命令行中。

```
$ sudo docker run -d -e CATTLE_AGENT_IP=<IP_OF_RANCHER_SERVER> -v /var/run/docker....
```

如果您已经把运行 Rancher Server 的主机同时添加为了 Agent 主机，请注意由于 Rancher Server 需要暴露`8080`端口，所以同一台主机上那些绑定`8080`端口的容器将无法创建，否则将会出现端口冲突的情况，造成 Rancher Server 停止运行。如果您一定要使用`8080`端口，那么您需要在启用 Rancher Server 的时候用另一个端口。

## 添加代理服务器之后的主机

为了在 HTTP 代理服务器后面添加主机， 需要通过配置 docker deamon 将 docker 指向这个代理。在添加自定义主机之前，修改文件`/etc/default/docker`，指向您的代理并重新启动 docker。

```
$ sudo vi /etc/default/docker
```

在文件里，编辑`#export http_proxy="http://127.0.0.1:3128/"`，使其指向您的代理。保存您的修改并且重启 docker。在不同的系统上重启 docker 的方式是不一样的。

> **注意:** 如果是用 systemd 启动的 docker, 那么修改 http 代理的方式请参考 docker [介绍](https://docs.docker.com/articles/systemd/#http-proxy)。

为了在代理后添加主机，您不用在命令行中添加其他环境变量来启动 Rancher Agent。您只需要保证您的 docker daemon 配置正确就可以了。

如果您想要在 Rancher Agent 内使用该代理，您需要修改这个自定义命令，并添加相关的环境变量。

## 同时包含私有 IP 和公共 IP 的虚拟机

默认情况下，对于同时包含私有 IP 和公共 IP 的虚拟机，IP 地址将会根据主机注册地址中指定的地址来确定。例如，如果注册地址中使用的是私有 IP，那么就会使用主机的私有 IP。如果您想修改主机的 IP 地址，您需要编辑 UI 中提供的命令行。为了使 Rancher Agent 中的容器能够正常启动，需要将环境变量`CATTLE_AGENT_IP`设置成期望的 IP 地址。Rancher 中所有的主机都需要和 Rancher Serve 在同一个网络。

```
$ sudo docker run -d -e CATTLE_AGENT_IP=<PRIVATE_IP> -v /var/run/docker....
```

如果在 Agent 已经连接之后需要修改主机的 IP，那么请重新运行添加自定义主机的命令行。

> **注意:** 当设置成私有地址之后，Rancher 中已经存在的容器将不在同一个托管网络内。
