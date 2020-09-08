---
title: 虚拟主机
---

By default, launching virtual machines (VMs) in Rancher is disabled. To enable launching VMs, any [admin](/docs/rancher1/configurations/environments/access-control/_index#管理员) can enable virtual machines in Rancher in the **Admin** -> **Settings** -> **Virtual Machines** section. Select **Enabled** and click **Save**.
默认情况下，Rancher 中启动虚拟机(VMs)的功能是停用的。任何[admin](/docs/rancher1/configurations/environments/access-control/_index#管理员) 用户可以在 Rancher 的 **系统管理** -> **系统设置** -> **虚拟机** 下开启启动虚拟机的功能。选择 **启用** 的选择框并点击保存。

### 启动 VM 的主机要求

- Ubuntu
- RancherOS - 需要在 cloud-config 中开启 `userland-proxy` 配置

  ```
  #cloud-config
  rancher:
    docker:
      extra_args: [--userland-proxy=true]
  ```

### 添加 VM

在 **基础架构** -> **虚拟机**，点击 **添加虚拟机** 并设置您的虚拟机配置。

在镜像名称选项中，当前 Rancher 只支持 `rancher/vm-ubuntu`。用户名/密码是`ubuntu/ubuntu`。

点击**创建**

容器创建后，点击容器的下拉菜单并且点击 **打开命令行** 去登录虚拟机。
