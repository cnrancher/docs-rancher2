---
title: 内部DNS服务
---

在 Rancher 中，我们拥有自己的内部 DNS 服务，允许同一个[环境](/docs/rancher1/configurations/environments/_index)中的任何服务都可以解析环境中的任何其他服务.

应用中的所有服务都可以通过`<服务名称>`解析，并且不需要在服务之间设置服务链接。 创建服务时，您可以定义`服务链接`以将服务链接在一起。 对于任何不同应用的服务，您可以通过`<服务名称>.<应用名称>`而不是`<服务名称>`来解析。 如果您想以不同的名称解析服务，您可以设置服务链接，以便服务可以由服务别名解析.

### 通过链接设置服务别名

在 UI 中，[添加服务](/docs/rancher1/infrastructure/cattle/adding-services/_index#在ui中添加服务)时，展开**服务链接**部分，选择服务，并提供别名.

如果您使用 Rancher Compose[添加服务](/docs/rancher1/infrastructure/cattle/adding-services/_index)，`docker-compose.yml`将使用`links`或`external_links`指令.

```
version: '2'
services:
  service1:
    image: wordpress
    # 如果其他服务在同一个应用中
    links:
    # <service_name>:<service_alias>
    - service2:mysql
    # 如果另一个服务是不同的应用
    external_links:
    # <stackname>/<service_name>:<service_alias>
    - Default/service3:mysql
```

### `从容器`和服务连接

在启动服务时，您可能需要指定只在同一台主机上一起启动服务。 具体的用例包括尝试使用另一个服务中的`volume_from`或`net`时。 当添加一个[从容器](/docs/rancher1/infrastructure/cattle/adding-services/_index#sidekick-服务)时，这些服务可以通过他们的名字自动地相互解析。 我们目前不支持通过从容器中的 links/external_links 来创建服务别名。

当添加一个从容器时，总是有一个主服务和从容器。 它们一起被认为是单个启动配置。 此启动配置将作为一组容器部署到主机上，1 个来自主服务器，另一个从每个从容器中定义。 在启动配置的任何服务中，您可以按其名称解析主服务和从容器。 对于启动配置之外的任何服务，主服务可以通过名称解析，但是从容器只能通过`<从容器名称>.<主服务名称>`来解析。

### 容器名称

所有容器都可以通过其名称来全局解析，因为每个服务的容器名称在每个环境中都是唯一的。 没有必要附加服务名称或应用名称。

#### 例子

##### ping 同一应用中的服务

如果您执行一个容器的命令行，您可以通过服务名称 ping 同一应用中的其他服务.

在我们的例子中，有一个名为`stackA`的应用，有两个服务，`foo`和`bar`.

在执行`foo`服务中的一个容器之后，您可以 ping 通`bar`服务.

```
$ ping bar
PING bar.stacka.rancher.internal (10.42.x.x) 58(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.63 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.13 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.07 ms
```

##### ping 不同应用中的服务

对于不同应用的服务，您可以使用`<服务名称>.<应用名称>`在不同的应用中 ping 服务.

在这个例子中，我们有一个名为`stackA`的应用，它包含一个名为`foo`的服务，我们有另一个名为`stackB`的应用，它包含一个名为`bar`的服务.

如果我们执行`foo`服务中的一个容器，您可以用`bar.stackb`来 ping.

```
$ ping bar.stackb
PING bar.stackb (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.43 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.15 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.27 ms
```

##### ping 服务中的从容器

取决于您从哪个服务 ping，您可以通过`<从容器名称>`或`<从容器名称>.<主服务名称>`来访问从容器服务。

在我们的例子中，我们有一个名为`stackA`的应用，它包含一个名为`foo`的服务，它有一个从容器`bar`和一个名为`hello`的服务。 我们也有一个应用叫`stackB`，它包含一个服务`world`。

如果我们执行`foo`服务中的一个容器，您可以直接用`bar'命令 ping 它。

```
# 在`foo`服务中的一个容器中，`bar`是一个从容器。
$ ping bar
PING bar.foo.stacka.rancher.internal (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=64 time=0.060 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=64 time=0.111 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=64 time=0.114 ms
```

如果我们执行在同一个应用中的`hello`服务的一个容器，您可以通过`foo`来 ping`foo`服务和`bar.foo`来 ping`bar`服务.

```
# 在`hello`服务中的一个容器内部，这不是服务/从容器的一部分
# Ping主服务(i.e. foo)
$ ping foo
PING foo.stacka.rancher.internal (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.04 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.40 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.07 ms
# Ping从容器(i.e. bar)
$ ping bar.foo
PING bar.foo (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.01 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.12 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.05 ms
```

如果我们执行`world`服务中的一个容器，它是不同的应用，您可以通过`foo.stacka`来 ping`foo`服务和`bar.foo.stacka`来 ping 从容器`bar`.

```
# 在`world`服务中的一个容器内，它们位于不同的应用中
# Ping另一个应用`stacka`中的主服务(i.e. foo)
$ ping foo.stacka
PING foo.stacka (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.13 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.05 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.29 ms
# Ping另一个应用`stacka`中的从容器(i.e. bar)
$ ping bar.foo.stacka
PING bar.foo.stacka (10.42.x.x) 56(84) bytes of data.
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.23 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.00 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=0.994 ms
```

##### Ping 容器名称

从同一个环境下的任何一个容器中，无论它们是否在相同的应用或服务中，您都可以用容器名称来 ping 其他容器，

在我们的示例中，我们有一个名为`stackA`的应用，它包含一个名为`foo`的服务。 我们还有另一个应用叫`stackB`，它包含一个名为“bar”的服务。 容器的名称是`<stack_name>-<service_name>-<number>`。

如果我们执行`foo`服务中的一个容器，您可以通过 ping 来访问`bar`服务中的相关容器.

```
$ ping stackB-bar-1
PING stackB-bar-1.rancher.internal (10.42.x.x): 56 data bytes
64 bytes from 10.42.x.x: icmp_seq=1 ttl=62 time=1.994 ms
64 bytes from 10.42.x.x: icmp_seq=2 ttl=62 time=1.090 ms
64 bytes from 10.42.x.x: icmp_seq=3 ttl=62 time=1.100 ms
```
