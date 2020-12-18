---
title: 主机驱动
---

[Docker-machine](https://docs.docker.com/machine/)驱动可被添加到 Rancher 中，以便这些驱动可以将主机添加到 Rancher 中。只有[管理员](/docs/rancher1/configurations/environments/access-control/_index#管理员)可以设置哪些主机驱动可见，这个在**系统管理** -> **主机驱动**。

只有**启用**的主机驱动才能在**基础架构** -> **添加主机**的页面上显示出来。默认情况下，Rancher 提供了许多主机驱动，但是只有一些是**启用**状态。

### 添加主机驱动

您可以通过单击**添加主机驱动**轻松添加自己的主机驱动。

1. 提供**下载 URL**。这个地址是 64 位 Linux 驱动的二进制文件的地址。
2. (可选) 为驱动提供自定义添加主机界面的**自定义 UI 的 URL**。参考[ui-driver-skel repository](https://github.com/rancher/ui-driver-skel)以了解更多信息。
3. (可选) 提供一个**校验和**以检验下载的驱动是否匹配期望的校验和。
4. 完成之后，单击**创建**。

单击创建后，Rancher 就会添加这个额外的驱动，并将其显示在[添加主机](/docs/rancher1/infrastructure/hosts/other/_index)页面的**驱动**选项里。
