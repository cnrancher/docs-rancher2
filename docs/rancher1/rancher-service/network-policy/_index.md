---
title: 网络策略
---

Rancher 允许用户在[环境](/docs/rancher1/configurations/environments/_index)中配置网络策略。网络策略允许您在一个环境中定义特定的网络规则。所有的容器默认可以互相通信，但是有时您可能需要对的容器间通信做一些限制。

### 启动 Network Policy Manager

当配置[环境模版](/docs/rancher1/configurations/environments/_index#什么是环境模版)时，您可以启动 **Network Policy Manage** 组件。

如果您已经有一个启动的 Rancher 环境，您可以从[Rancher 应用商店](/docs/rancher1/configurations/catalog/_index)中启动 **Network Policy Manager**

> **注意:** Network Policy Manager 现在只能在使用 Cattle 编排引擎的时候使用。环境模版基于编排引擎确定哪些组件可用，Rancher 支持几乎所有的编排引擎。

### 通过 UI 管理网络策略规则

网络策略规则可以在每个环境设置页面中配置。单击左上角下拉列表中的**环境管理**，然后在需要配置的环境右侧单击编辑按钮

在界面上有四个选择，`允许`允许网络通信，`禁止`限制网络通信

- **链接服务之间**:这个选项用来控制两个服务中链接的容器
- **服务内部**: 这个选项用来控制服务内的容器
- **应用内部**: 这个选项用来控制相同应用中不同服务
- **其他**: 这个选项用来控制上面不包含的情况

一个通常的配置是在**其他**选择`禁止`，其他的都选择`允许`。

> **注意:** 规则生效的顺序为从左至右

### 通过 API 管理网络策略规则

对于网络资源，`defaultPolicyAction`和`policy` 字段定义了容器间通信的工作规则。`policy`字段是内容为网络策略规则的有序数组。通过 Rancher 的 API，可以配置环境的网络策略

#### 获取网络的 API 地址

要配置网络策略，需要找到相应的**网络**资源。网络是环境的一部分，找到网络的 URL 为:

```
http://<RANCHER_SERVER_IP>/v2-beta/projects/<PROJECT_ID>/networks/<NETWORK_ID>`
```

怎么查找需要配置的网络的 URL:

1. 单击**API**打开**高级选项**。在 **环境 API Keys**，单击 **Endpoint (v2-beta)**.
   > **注意:**: 在 UI 上是`环境`，在 API 是`project`。
2. 在环境的 links 属性中查找**networks**，单击链接。
3. 查询您环境中启动的网络驱动的名字。例如:可能为 `ipsec`。单击该网络驱动的**self**
4. 在右边的**Operations**中，单击**Edit**，在`defaultPolicyAction`中，您可以修改默认的网络策略，同时在`policy`字段，您可以管理您的网络策略规则。

### 默认策略

默认所有容器间可以互相通信，在 API 中，您可以看到`defaultPolicyAction`被设置成`allow`。

可以通过修改`defaultPolicyAction`为`deny`来限制所有容器间的通信

### 网络策略规则

网络策略规则配置容器可以和一系列特定的容器通信

#### 链接服务之间的容器

假设: 服务 A 链接服务 B。

开启服务 A 和服务 B 之间的通信:

```
{
  "within": "linked",
  "action": "allow"
}
```

> **注意:** 服务 B 的容器不会初始化一个链接到服务 A。

关闭服务 A 和服务 B 之间的通信:

```
{
  "within": "linked",
  "action": "deny"
}
```

在环境内任一链接服务之间的网络策略规则适用于所有有链接的服务

#### 同一服务中的容器

开通同一服务内容器的通信:

```
{
  "within": "service",
  "action": "allow"
}
```

关闭同一服务内容器的通信:

```
{
  "within": "service",
  "action": "deny"
}
```

#### 同一应用中的容器

开通同一应用内容器的通信:

```
{
  "within": "stack",
  "action": "allow"
}
```

关闭同一应用内容器的通信:

```
{
  "within": "stack",
  "action": "deny"
}
```

#### 基于标签的容器通信策略

通过标签开通容器间的通信:

```
{
  "between": {
    "groupBy": "<KEY_OF_LABEL>"
  },
  "action": "allow"
}
```

通过标签关闭容器间的通信:

```
{
  "between": {
    "groupBy": "<KEY_OF_LABEL>"
  },
  "action": "deny"
}
```

### 例子

#### 容器隔离

环境内的容器都无法和彼此通信

- 设置`defaultActionPolicy`为`deny`.

#### 应用隔离

同一个应用中的容器可以彼此通信，但是不能和其他应用中的容器通信

- 设置`defaultActionPolicy`为`deny`.
- `policy`中添加如下规则:

```
{
  "within": "stack",
  "action": "allow"
}
```

#### 标签隔离

包含匹配的标签的容器之间可以通信，这个规则通过标签去划分可以相互通信的容器

假设在环境中，我们有如下一系列的应用

```
stack_one:
  service_one:
    label: com.rancher.department = qa
  service_two:
    label: com.rancher.department = engineering
  service_three:
    label: com.rancher.location = cupertino

stack_two:
  service_one:
    label: com.rancher.department = qa
  service_two:
    label: com.rancher.location = cupertino

stack_three:
  service_one:
    label: com.rancher.department = engineering
  service_two:
    label: com.rancher.location = phoenix
```

包含`com.rancher.department`标签的容器可以相互通信

- 设置`defaultActionPolicy`为`deny`.
- 在`policy`中添加如下规则:

```
{
  "between": {
    "groupBy": "com.rancher.department"
  },
  "action": "allow"
}
```

上面有两个不同的标签键值对(例如 `com.rancher.department`)。

- 容器包含`com.rancher.department = engineering`彼此间可以通信，但是和其他的容器不能通信。在上面例子中，任何 `stack_one.service_two` 中的容器和 `stack_three.service_one`中的容器可以彼此通信，但是其他的不能。
- 容器包含 `com.rancher.department = qa`彼此间可以通信，但是和其他的不能。在上面的例子中，任何`stack_one.service_two`中的容器可以和任何`stack_two.service_two`中的容器通信，但是其他的不能。
- 容器不包含 key `com.rancher.department`不能和其他容器通信。
