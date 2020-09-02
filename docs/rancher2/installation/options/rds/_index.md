---
title: 在 Amazon RDS 中创建 MySQL 数据库
description: 本教程介绍了如何在 Amazon RDS 中创建 MySQL 数据库。该数据库可以用作高可用 K3s Kubernetes 集群的外部数据存储。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - 在 Amazon RDS 中创建 MySQL 数据库
---

本教程介绍了如何在 Amazon RDS 中创建 MySQL 数据库。该数据库可以用作高可用 K3s Kubernetes 集群的外部数据存储。

1. 登录[Amazon AWS RDS 控制台](https://console.aws.amazon.com/rds/)。选择创建的 EC2 实例（Linux 节点）所在的**区域**。
1. 在左侧面板中，单击**数据库**。
1. 单击**创建数据库**。
1. 在**引擎选项**部分中，单击 **MySQL**。
1. 在**版本**部分中，选择 **MySQL 5.7.22**。
1. 在**设置**部分的**凭据设置**下，输入**admin**主用户名的密码。确认密码。
1. 展开**其他配置**部分。在**初始数据库名称**字段中，输入名称。名称只能包含字母，数字和下划线。该名称将用于连接数据库。
1. 单击**创建数据库**。

您需要获取有关新数据库的以下信息，以便 K3s Kubernetes 集群可以连接到该数据库。

要在 Amazon RDS 控制台中查看此信息，请单击**数据库**，然后单击您创建的数据库的名称。

- **用户名：** 管理员用户名。
- **密码：** 管理员密码。
- **主机名：** 使用**端点**作为主机名。端点可以在**连接性和安全性**中找到。
- **端口：** 默认情况下，端口应为 3306，您可以在**连接性和安全性**部分中找到对应的端口号。
- **数据库名称：** 转到**配置**选项卡，确认名称。该名称列在**数据库名称**下。

请将以上信息替换到下面的数据库连接字符串中：

```
mysql://username:password@tcp(hostname:port)/database-name
```

有关为 K3s 配置数据存储的更多信息，请参考 [K3s 文档](/docs/k3s/installation/datastore/_index)。
